import type { CourseSection } from '../../types'

export const section32: CourseSection = {
  id: "microservices",
  index: 32,
  title: "Feature engineering y pipelines sin leakage",
  shortTitle: "Features sin leakage",
  tagline: "tabla de features versionada cuya construcción en train e inferencia es idéntica y no usa información futura o de decisión",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "TableProperties",
  accentColor: "bg-gradient-to-br from-indigo-500 to-violet-800",
  jobRelevance:
    "Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. Id `microservices` conservado; V3 **Feature engineering y pipelines sin leakage** para el workbench CP-N3-B. Features de grafo/contacto no son etiqueta de fraude.",
  learningOutcomes: [
    { text: "Diseñar features numéricas/categóricas/texto" },
    { text: "Aplicar missing indicators, scale y encoding" },
    { text: "Crear features relacionales y de grafo" },
    { text: "Calcular ventanas y frecuencias sin leakage" },
    { text: "Componer transformers reutilizables" },
    { text: "Persistir fit y reutilizar en inferencia" },
    { text: "Partir por entidad/grupo/tiempo" },
    { text: "Detectar leakage y versionar features" },
  ],
  theory: [
    {
      heading: "De microservicios legado a features sin leakage",
      paragraphs: [
        "En V3, **S32 no es el path principal de Docker/K8s microservicios**. Aquí construyes la **tabla de features versionada** del workbench: idéntica en train e inferencia, sin futuro ni labels de decisión.",
        "Hilo: filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`). Features describen evidencia, no condenan.",
        "Orden: **T1 Tipos** → **T2 Relacionales** → **T3 Pipelines** → **T4 Validación**.",
      ],
      callout: {
        type: "info",
        title: "Retarget V3",
        content:
          "Legacy microservices content no es el camino V3 de S32.",
      },
    },
    {
      heading: "numéricas/categóricas/texto",
      subtopicId: "S32-T1-A",
      paragraphs: [
        "Numéricas: montos, conteos, edades de cuenta. Categóricas: canal, región. Texto: notas cortas tokenizadas o longitudes.",
        "Diseña con semántica: ¿disponible en t de decisión? Si no, no es feature de scoring.",
        "Documenta dtype y missing policy por columna en un feature catalog.",
      ],
      code: {
        language: 'python',
        title: "feat_types.py",
        code: `row = {
    "amount_sum_7d": 150.0,
    "channel": "app",
    "region": "LIM",
    "note_len": len("cliente solicita actualización"),
}
types = {"amount_sum_7d": "num", "channel": "cat", "region": "cat", "note_len": "num"}
print("n_feats", len(row))
print("cats", [k for k,v in types.items() if v=="cat"])
print("at_decision_time", True)`,
        output: `n_feats 4
cats ['channel', 'region']
at_decision_time True`,
      },
      callout: {
        type: "tip",
        title: "Catálogo",
        content:
          "Si no está en el catálogo versionado, no entra al modelo.",
      },
    },
    {
      heading: "missing indicators, escalamiento y encoding",
      subtopicId: "S32-T1-B",
      paragraphs: [
        "Missing puede ser informativo: añade indicador binario y rellena con valor de train (mediana/moda).",
        "Escalado (standard/minmax) se **fit** solo en train. One-hot/ordinal con categorías de train; unknowns → bucket.",
        "Nunca uses estadísticas del test set para fit.",
      ],
      code: {
        language: 'python',
        title: "missing_scale.py",
        code: `import statistics
train = [10.0, 12.0, None, 11.0]
vals = [x for x in train if x is not None]
med = statistics.median(vals)
X, ind = [], []
for x in train:
    ind.append(1 if x is None else 0)
    X.append(med if x is None else x)
mean = sum(X)/len(X)
std = (sum((x-mean)**2 for x in X)/len(X))**0.5 or 1.0
scaled = [(x-mean)/std for x in X]
print("median", med)
print("missing_ind", ind)
print("scaled0", round(scaled[0], 3))`,
        output: `median 11.0
missing_ind [0, 0, 1, 0]
scaled0 -1.414`,
      },
      callout: {
        type: "warning",
        title: "Fit en train",
        content:
          "Reusar mean/std de train en serve; no recalcular con el batch de prod a ciegas sin política.",
      },
    },
    {
      heading: "shared contact/address, distance y graph features",
      subtopicId: "S32-T2-A",
      paragraphs: [
        "Features relacionales: shared_phone_count, shared_address, shortest_path_len, degree en ventana.",
        "Calcula solo con hechos observados ≤ t; no uses el label de revisión como feature.",
        "Shared contact es señal de enlace para revisión humana: **no** de parentesco, colusión ni fraude automático.",
      ],
      code: {
        language: 'python',
        title: "rel_feats.py",
        code: `entities = {
    "E1": {"phones": {"900"}, "addr": "av-1"},
    "E2": {"phones": {"900", "901"}, "addr": "av-2"},
}
shared_phone = len(entities["E1"]["phones"] & entities["E2"]["phones"])
same_addr = int(entities["E1"]["addr"] == entities["E2"]["addr"])
# graph feature sintético
path_len = 2
print("shared_phone", shared_phone)
print("same_addr", same_addr)
print("path_len", path_len)`,
        output: `shared_phone 1
same_addr 0
path_len 2`,
      },
      callout: {
        type: "danger",
        title: "No label leakage",
        content:
          "decision=fraud/review no es feature.",
      },
    },
    {
      heading: "ventanas y frecuencia",
      subtopicId: "S32-T2-B",
      paragraphs: [
        "Ventanas rolling (7d, 30d) y frecuencias se anclan en t de la fila. Eventos con ts > t no entran.",
        "Usa half-open intervals [t-W, t) para evitar incluir el evento label-bearing si aplica.",
        "Prueba con un evento 'futuro' sintético que no debe contar.",
      ],
      code: {
        language: 'python',
        title: "windows.py",
        code: `from datetime import datetime, timedelta
events = [
    ("2026-01-01", 10),
    ("2026-01-05", 20),
    ("2026-01-20", 99),  # futuro respecto de t
]
t = datetime(2026, 1, 10)
W = timedelta(days=7)
s = 0
for ts, amt in events:
    d = datetime.fromisoformat(ts)
    if t - W <= d < t:
        s += amt
print("sum_7d", s)
print("excluded_future", 99)
print("window", "7d")`,
        output: `sum_7d 20
excluded_future 99
window 7d`,
      },
      callout: {
        type: "tip",
        title: "Half-open",
        content:
          "[t-W, t) es un contrato; documéntalo en el feature version.",
      },
    },
    {
      heading: "ColumnTransformer y custom transformers",
      subtopicId: "S32-T3-A",
      paragraphs: [
        "Compón: num pipeline (impute+scale), cat (one-hot), custom (graph feats precomputadas).",
        "Custom transformer: implementa fit/transform con estado aprendido en fit.",
        "En el curso usamos dict-transformers didácticos equivalentes a sklearn.",
      ],
      code: {
        language: 'python',
        title: "custom_tf.py",
        code: `class MedianImputer:
    def __init__(self):
        self.median_ = None
    def fit(self, xs):
        vals = sorted(x for x in xs if x is not None)
        self.median_ = vals[len(vals)//2]
        return self
    def transform(self, xs):
        return [self.median_ if x is None else x for x in xs]

imp = MedianImputer().fit([1.0, None, 3.0])
print("median", imp.median_)
print("out", imp.transform([None, 2.0]))
print("fitted", True)`,
        output: `median 3.0
out [3.0, 2.0]
fitted True`,
      },
      callout: {
        type: "tip",
        title: "Estado en fit",
        content:
          "transform sin fit debe fallar ruidosamente.",
      },
    },
    {
      heading: "fit/transform y persistencia",
      subtopicId: "S32-T3-B",
      paragraphs: [
        "fit en train → serializa parámetros (json/joblib) → transform en serve con la misma versión.",
        "Versiona feature_set_id + code hash + data cutoff.",
        "Si cambias encoding, sube versión; no silencies skew.",
      ],
      code: {
        language: 'python',
        title: "persist_fs.py",
        code: `import json
state = {"feature_set": "fs-v3", "median_amount": 12.5, "channels": ["app", "web"]}
blob = json.dumps(state, sort_keys=True)
loaded = json.loads(blob)
def transform_channel(ch, vocab):
    return vocab.index(ch) if ch in vocab else -1
print("fs", loaded["feature_set"])
print("ch_app", transform_channel("app", loaded["channels"]))
print("ch_new", transform_channel("branch", loaded["channels"]))`,
        output: `fs fs-v3
ch_app 0
ch_new -1`,
      },
      callout: {
        type: "warning",
        title: "Train=serve",
        content:
          "Misma función de transform; no reimplementes a mano en otro repo sin contrato.",
      },
    },
    {
      heading: "split por entidad/grupo/tiempo",
      subtopicId: "S32-T4-A",
      paragraphs: [
        "Split aleatorio por fila filtra entidades cruzadas → leakage. Prefiere split por entity_id o por tiempo.",
        "Group split: todas las filas de una entidad van a un solo fold.",
        "Time split: train ts < valid ts.",
      ],
      code: {
        language: 'python',
        title: "entity_split.py",
        code: `rows = [
    {"entity": "E1", "ts": "2026-01-01", "y": 0},
    {"entity": "E1", "ts": "2026-01-02", "y": 1},
    {"entity": "E2", "ts": "2026-01-03", "y": 0},
    {"entity": "E3", "ts": "2026-02-01", "y": 1},
]
# entity split: E1,E2 train / E3 test
train = [r for r in rows if r["entity"] in {"E1", "E2"}]
test = [r for r in rows if r["entity"] == "E3"]
print("train_n", len(train))
print("test_n", len(test))
print("entity_overlap", len({r["entity"] for r in train} & {r["entity"] for r in test}))`,
        output: `train_n 3
test_n 1
entity_overlap 0`,
      },
      callout: {
        type: "tip",
        title: "Overlap 0",
        content:
          "entity_overlap debe ser 0 entre train y test.",
      },
    },
    {
      heading: "leakage, train–serve skew y versionado",
      subtopicId: "S32-T4-B",
      paragraphs: [
        "Leakage: features que usan y, o datos post-decisión, o agregados globales con test.",
        "Train–serve skew: distribución o código distinto. Monitorea y versiona.",
        "Checklist de release de features en el gate del workbench.",
      ],
      code: {
        language: 'python',
        title: "leak_check.py",
        code: `suspect = [
    {"name": "label_reviewer", "leak": True},
    {"name": "amount_7d", "leak": False},
    {"name": "global_mean_including_test", "leak": True},
]
leaks = [f["name"] for f in suspect if f["leak"]]
print("leaks", leaks)
print("n_leaks", len(leaks))
print("version", "fs-v3")`,
        output: `leaks ['label_reviewer', 'global_mean_including_test']
n_leaks 2
version fs-v3`,
      },
      callout: {
        type: "danger",
        title: "Label as feature",
        content:
          "Jamás.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro features versionadas, ventanas sin futuro, transformers y splits sin leakage.",
    steps: [
      {
        demoId: "S32-T1-A-DEMO",
        subtopicId: "S32-T1-A",
        environment: "local-python",
        description: "Clasifica columnas num/cat/text de una fila sintética.",
        code: {
          language: 'python',
          title: "types_demo.py",
          code: `schema = {"amt":"num","canal":"cat","nota":"text"}
print("num", [k for k,v in schema.items() if v=="num"])
print("cat", [k for k,v in schema.items() if v=="cat"])
print("n", len(schema))`,
          output: `num ['amt']
cat ['canal']
n 3`,
        },
        why: "Schema explícito evita tipos implícitos frágiles.",
      },
      {
        demoId: "S32-T1-B-DEMO",
        subtopicId: "S32-T1-B",
        environment: "local-python",
        description: "Imputa mediana de train y escala z-score.",
        code: {
          language: 'python',
          title: "impute_demo.py",
          code: `train=[2.0,4.0,None]
vals=[x for x in train if x is not None]
med=sorted(vals)[len(vals)//2]
X=[med if x is None else x for x in train]
mu=sum(X)/len(X); sd=(sum((x-mu)**2 for x in X)/len(X))**0.5
print("med", med)
print("z0", round((X[0]-mu)/sd, 3))
print("miss_ind", [int(x is None) for x in train])`,
          output: `med 4.0
z0 -1.414
miss_ind [0, 0, 1]`,
        },
        why: "Fit solo con train.",
      },
      {
        demoId: "S32-T2-A-DEMO",
        subtopicId: "S32-T2-A",
        environment: "local-python",
        description: "Shared phone y path_len como features de par.",
        code: {
          language: 'python',
          title: "rel_demo.py",
          code: `a,b={"ph":{"1","2"}},{"ph":{"2","3"}}
print("shared", len(a["ph"]&b["ph"]))
print("path_len", 2)
print("not_fraud_label", True)`,
          output: `shared 1
path_len 2
not_fraud_label True`,
        },
        why: "Señal relacional ≠ veredicto.",
      },
      {
        demoId: "S32-T2-B-DEMO",
        subtopicId: "S32-T2-B",
        environment: "local-python",
        description: "Suma en ventana [t-7d,t) excluyendo futuro.",
        code: {
          language: 'python',
          title: "win_demo.py",
          code: `from datetime import datetime, timedelta
evs=[(datetime(2026,1,1),1),(datetime(2026,1,12),9)]
t=datetime(2026,1,10); W=timedelta(days=7)
s=sum(a for d,a in evs if t-W<=d<t)
print("sum", s)
print("future_excluded", True)
print("W", 7)`,
          output: `sum 0
future_excluded True
W 7`,
        },
        why: "Contrato de ventana temporal.",
      },
      {
        demoId: "S32-T3-A-DEMO",
        subtopicId: "S32-T3-A",
        environment: "local-python",
        description: "Custom transformer con fit/transform de vocab categorico.",
        code: {
          language: 'python',
          title: "vocab_demo.py",
          code: `class Vocab:
    def fit(self, xs):
        self.v={x:i for i,x in enumerate(sorted(set(xs)))}; return self
    def transform(self, xs):
        return [self.v.get(x, -1) for x in xs]
tf=Vocab().fit(["app","web","app"])
print("vocab", tf.v)
print("out", tf.transform(["web","branch"]))
print("ok", True)`,
          output: `vocab {'app': 0, 'web': 1}
out [1, -1]
ok True`,
        },
        why: "Unknown → -1.",
      },
      {
        demoId: "S32-T3-B-DEMO",
        subtopicId: "S32-T3-B",
        environment: "local-python",
        description: "Serializa estado de imputer y reutiliza.",
        code: {
          language: 'python',
          title: "persist_demo.py",
          code: `import json
st={"med":10.0,"fs":"v1"}
s=json.dumps(st); ld=json.loads(s)
def tr(x, med):
    return med if x is None else x
print("fs", ld["fs"])
print("x", tr(None, ld["med"]))
print("persist", True)`,
          output: `fs v1
x 10.0
persist True`,
        },
        why: "Persistencia del fit.",
      },
      {
        demoId: "S32-T4-A-DEMO",
        subtopicId: "S32-T4-A",
        environment: "local-python",
        description: "Split por entidad sin solape.",
        code: {
          language: 'python',
          title: "split_demo.py",
          code: `rows=[{"e":"A"},{"e":"A"},{"e":"B"}]
train_e,test_e={"A"},{"B"}
tr=[r for r in rows if r["e"] in train_e]
te=[r for r in rows if r["e"] in test_e]
print("tr", len(tr), "te", len(te))
print("overlap", len(train_e & test_e))
print("ok", True)`,
          output: `tr 2 te 1
overlap 0
ok True`,
        },
        why: "Entity holdout.",
      },
      {
        demoId: "S32-T4-B-DEMO",
        subtopicId: "S32-T4-B",
        environment: "local-python",
        description: "Detecta features con leakage por nombre/política.",
        code: {
          language: 'python',
          title: "leak_demo.py",
          code: `feats=[("amt",False),("y_true",True),("reviewer_decision",True)]
print("leaks", [n for n,l in feats if l])
print("n", sum(1 for _,l in feats if l))
print("fs_version", "v3")`,
          output: `leaks ['y_true', 'reviewer_decision']
n 2
fs_version v3`,
        },
        why: "Checklist de leakage.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de tipos, missing/scale, relacionales, ventanas, transformers, persistencia y leakage.",
    steps: [
      {
        id: "S32-T1-A-E1",
        subtopicId: "S32-T1-A",
        kind: "guided",
        instruction:
          "Lista features numéricas desde schema dict type→col; imprime sorted.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `schema={'a':'num','b':'cat','c':'num'}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `schema={'a':'num','b':'cat','c':'num'}
print('num', sorted(k for k,v in schema.items() if v=='num'))
print('n', 2)
print('ok', True)`,
          output: `num ['a', 'c']
n 2
ok True`,
        },
      },
      {
        id: "S32-T1-A-E2",
        subtopicId: "S32-T1-A",
        kind: "independent",
        instruction:
          "Calcula note_len y token_count simple de un texto sintético.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `t='hola mundo pe'
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `t='hola mundo pe'
print('note_len', len(t))
print('tokens', len(t.split()))
print('ok', True)`,
          output: `note_len 13
tokens 3
ok True`,
        },
      },
      {
        id: "S32-T1-A-E3",
        subtopicId: "S32-T1-A",
        kind: "transfer",
        instruction:
          "Valida que todas las keys del row están en catálogo.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `row={'a':1,'b':2}; cat={'a','b','c'}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `row={'a':1,'b':2}; cat={'a','b','c'}
print('ok', set(row)<=cat)
print('extra', sorted(set(row)-cat))
print('n', len(row))`,
          output: `ok True
extra []
n 2`,
        },
      },
      {
        id: "S32-T1-B-E1",
        subtopicId: "S32-T1-B",
        kind: "guided",
        instruction:
          "Missing indicator + fill mediana [1,None,3].",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=[1.0,None,3.0]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=[1.0,None,3.0]
vals=[x for x in xs if x is not None]
med=sorted(vals)[len(vals)//2]
print('med', med)
print('ind', [int(x is None) for x in xs])
print('filled', [med if x is None else x for x in xs])`,
          output: `med 3.0
ind [0, 1, 0]
filled [1.0, 3.0, 3.0]`,
        },
      },
      {
        id: "S32-T1-B-E2",
        subtopicId: "S32-T1-B",
        kind: "independent",
        instruction:
          "One-hot manual para canal in {app,web} con unknown.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO one-hot`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `vocab=['app','web']
def oh(c):
    return [1 if c==v else 0 for v in vocab] + [1 if c not in vocab else 0]
print('app', oh('app'))
print('x', oh('branch'))
print('dim', len(oh('app')))`,
          output: `app [1, 0, 0]
x [0, 0, 1]
dim 3`,
        },
      },
      {
        id: "S32-T1-B-E3",
        subtopicId: "S32-T1-B",
        kind: "transfer",
        instruction:
          "Z-score con mu=0, sd=2 para [2,4].",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=[2.0,4.0]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=[2.0,4.0]; mu=0.0; sd=2.0
print('z', [(x-mu)/sd for x in xs])
print('mu', mu)
print('sd', sd)`,
          output: `z [1.0, 2.0]
mu 0.0
sd 2.0`,
        },
      },
      {
        id: "S32-T2-A-E1",
        subtopicId: "S32-T2-A",
        kind: "guided",
        instruction:
          "Shared address binario entre dos entidades.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='av-1','av-1'
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `a,b='av-1','av-1'
print('same', int(a==b))
print('a', a)
print('b', b)`,
          output: `same 1
a av-1
b av-1`,
        },
      },
      {
        id: "S32-T2-A-E2",
        subtopicId: "S32-T2-A",
        kind: "independent",
        instruction:
          "Degree feature: cuenta vecinos de E1.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `adj={'E1':['E2','E3'],'E2':['E1']}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `adj={'E1':['E2','E3'],'E2':['E1']}
print('deg', len(adj['E1']))
print('node', 'E1')
print('ok', True)`,
          output: `deg 2
node E1
ok True`,
        },
      },
      {
        id: "S32-T2-A-E3",
        subtopicId: "S32-T2-A",
        kind: "transfer",
        instruction:
          "Min path len conocido dict; default 99 si missing.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `pl={('E1','E2'):1}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pl={('E1','E2'):1}
print('p', pl.get(('E1','E2'),99))
print('missing', pl.get(('E1','E9'),99))
print('ok', True)`,
          output: `p 1
missing 99
ok True`,
        },
      },
      {
        id: "S32-T2-B-E1",
        subtopicId: "S32-T2-B",
        kind: "guided",
        instruction:
          "Cuenta eventos en [t-3,t) con ts int.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev=[1,2,3,5]; t=5; W=3
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev=[1,2,3,5]; t=5; W=3
print('n', sum(1 for x in ev if t-W<=x<t))
print('t', t)
print('W', W)`,
          output: `n 2
t 5
W 3`,
        },
      },
      {
        id: "S32-T2-B-E2",
        subtopicId: "S32-T2-B",
        kind: "independent",
        instruction:
          "Frecuencia por canal en ventana.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[('app',1),('app',2),('web',2)]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
rows=[('app',1),('app',2),('web',2)]
# ts<3
c=Counter(ch for ch,ts in rows if ts<3)
print('app', c['app'])
print('web', c['web'])
print('n', sum(c.values()))`,
          output: `app 2
web 1
n 3`,
        },
      },
      {
        id: "S32-T2-B-E3",
        subtopicId: "S32-T2-B",
        kind: "transfer",
        instruction:
          "Excluye ts==t si política half-open.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev=[(5,10),(4,1)]; t=5
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ev=[(5,10),(4,1)]; t=5
s=sum(a for ts,a in ev if ts<t)
print('sum', s)
print('excluded', 10)
print('ok', True)`,
          output: `sum 1
excluded 10
ok True`,
        },
      },
      {
        id: "S32-T3-A-E1",
        subtopicId: "S32-T3-A",
        kind: "guided",
        instruction:
          "Fit moda categorica y transform None→moda.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=['a','b','a',None]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `xs=['a','b','a',None]
from collections import Counter
mode=Counter(x for x in xs if x is not None).most_common(1)[0][0]
print('mode', mode)
print('out', [mode if x is None else x for x in xs])
print('ok', True)`,
          output: `mode a
out ['a', 'b', 'a', 'a']
ok True`,
        },
      },
      {
        id: "S32-T3-A-E2",
        subtopicId: "S32-T3-A",
        kind: "independent",
        instruction:
          "Pipeline secuencial: fill 0 luego *2.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO pipe`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def pipe(xs):
    return [((0 if x is None else x)*2) for x in xs]
print(pipe([1,None,3]))
print('steps', 2)
print('ok', True)`,
          output: `[2, 0, 6]
steps 2
ok True`,
        },
      },
      {
        id: "S32-T3-A-E3",
        subtopicId: "S32-T3-A",
        kind: "transfer",
        instruction:
          "Transform falla si not fitted (flag).",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `class T:
    def __init__(self):
        self.fitted=False
    def transform(self, xs):
        if not self.fitted:
            raise RuntimeError('not fitted')
        return xs
try:
    T().transform([1])
    print('raised', False)
except RuntimeError:
    print('raised', True)
print('fitted_default', False)
print('ok', True)`,
          output: `raised True
fitted_default False
ok True`,
        },
      },
      {
        id: "S32-T3-B-E1",
        subtopicId: "S32-T3-B",
        kind: "guided",
        instruction:
          "Round-trip json state median.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import json
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import json
st={'median':3.5}
print(json.loads(json.dumps(st))['median'])
print('keys', 1)
print('ok', True)`,
          output: `3.5
keys 1
ok True`,
        },
      },
      {
        id: "S32-T3-B-E2",
        subtopicId: "S32-T3-B",
        kind: "independent",
        instruction:
          "Version bump si vocab cambia.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `v1={'app'}; v2={'app','web'}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `v1={'app'}
v2={'app','web'}
print('bump', v1!=v2)
print('v', 'fs-v2' if v1!=v2 else 'fs-v1')
print('ok', True)`,
          output: `bump True
v fs-v2
ok True`,
        },
      },
      {
        id: "S32-T3-B-E3",
        subtopicId: "S32-T3-B",
        kind: "transfer",
        instruction:
          "Apply saved med to serve batch.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `med=10.0; batch=[None,12.0]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `med=10.0; batch=[None,12.0]
print([med if x is None else x for x in batch])
print('med', med)
print('n', 2)`,
          output: `[10.0, 12.0]
med 10.0
n 2`,
        },
      },
      {
        id: "S32-T4-A-E1",
        subtopicId: "S32-T4-A",
        kind: "guided",
        instruction:
          "Time split: train ts<'2026-02-01'.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'ts':'2026-01-01'},{'ts':'2026-02-15'}]
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=[{'ts':'2026-01-01'},{'ts':'2026-02-15'}]
tr=[r for r in rows if r['ts']<'2026-02-01']
print('train_n', len(tr))
print('test_n', len(rows)-len(tr))
print('cut', '2026-02-01')`,
          output: `train_n 1
test_n 1
cut 2026-02-01`,
        },
      },
      {
        id: "S32-T4-A-E2",
        subtopicId: "S32-T4-A",
        kind: "independent",
        instruction:
          "Group sizes por entity.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows=['E1','E1','E2']
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
rows=['E1','E1','E2']
print(dict(Counter(rows)))
print('n_ent', 2)
print('ok', True)`,
          output: `{'E1': 2, 'E2': 1}
n_ent 2
ok True`,
        },
      },
      {
        id: "S32-T4-A-E3",
        subtopicId: "S32-T4-A",
        kind: "transfer",
        instruction:
          "Verifica overlap entidades 0.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `tr,te={'A','B'},{'C'}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tr,te={'A','B'},{'C'}
print('overlap', len(tr&te))
print('ok', len(tr&te)==0)
print('n_tr', len(tr))`,
          output: `overlap 0
ok True
n_tr 2`,
        },
      },
      {
        id: "S32-T4-B-E1",
        subtopicId: "S32-T4-B",
        kind: "guided",
        instruction:
          "Flag leakage names containing 'label' or 'decision'.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `names=['amt','label_y','reviewer_decision']
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `names=['amt','label_y','reviewer_decision']
print([n for n in names if 'label' in n or 'decision' in n])
print('n', 2)
print('ok', True)`,
          output: `['label_y', 'reviewer_decision']
n 2
ok True`,
        },
      },
      {
        id: "S32-T4-B-E2",
        subtopicId: "S32-T4-B",
        kind: "independent",
        instruction:
          "Skew: si serve_mean desvía >0.5 de train_mean alerta.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `tr,se=0.0,0.8
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `tr,se=0.0,0.8
print('alert', abs(se-tr)>0.5)
print('delta', round(abs(se-tr),1))
print('ok', True)`,
          output: `alert True
delta 0.8
ok True`,
        },
      },
      {
        id: "S32-T4-B-E3",
        subtopicId: "S32-T4-B",
        kind: "transfer",
        instruction:
          "Feature set id format fs-vN.",
        hint: "Revisa la demo del subtema.",
        hints: [
          "Revisa la demo del subtema.",
          "Imprime las tres líneas pedidas.",
        ],
        edgeCases: ["determinista", "sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver=3
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `ver=3
print('id', f'fs-v{ver}')
print('ver', ver)
print('ok', True)`,
          output: `id fs-v3
ver 3
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Feature table versionada sin leakage (CP-N3-B features)",
    context:
      "Produce una tabla de features versionada (fs-v*) para el workbench: transformers fit en train, ventanas half-open, features relacionales sin labels de decisión. Datos sintéticos; platform id microservices conservado.",
    objectives: [
      "Catálogo num/cat/text con missing policy",
      "Features relacionales y ventanas sin futuro",
      "Pipeline fit/transform persistido",
      "Split entidad/tiempo y checklist leakage",
    ],
    requirements: [
      "Misma transform en train y serve",
      "entity_overlap train/test = 0",
      "Sin features de label/decisión",
      "es-PE; sintético only",
    ],
    starterCode: `# features sin leakage — esqueleto
from datetime import datetime, timedelta

def window_sum(events, t, days=7):
    W = timedelta(days=days)
    return sum(a for ts, a in events if t - W <= ts < t)

# TODO: catalog, imputer state, entity split, version id
if __name__ == '__main__':
    t = datetime(2026, 1, 10)
    print(window_sum([(datetime(2026,1,5), 3.0)], t))
`,
    portfolioNote:
      "Incremento features de CP-N3-B; no marca section_passed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Train=serve y sin leakage de label/futuro", weight: "bonus checklist" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Fit de scaler debe hacerse en:",
        options: ["Test", "Todo el dataset sin split", "Solo producción", "Train"],
        correctIndex: 3,
        explanation:
          "Solo train.",
      },
      {
        question: "Una feature reviewer_decision es:",
        options: ["Útil y válida", "Leakage de decisión", "Obligatoria", "Igual que amount"],
        correctIndex: 1,
        explanation:
          "Label/decisión no es feature.",
      },
      {
        question: "Ventana half-open [t-W,t) excluye:",
        options: ["Todo el pasado", "Train", "Eventos con ts>=t", "Catálogo"],
        correctIndex: 2,
        explanation:
          "No incluye t ni futuro.",
      },
      {
        question: "Split por entidad busca:",
        options: ["Overlap 0 de entidades", "Maximizar overlap", "Solo shuffle de filas", "Ignorar tiempo"],
        correctIndex: 0,
        explanation:
          "Sin entidades cruzadas.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn ColumnTransformer",
        url: "https://scikit-learn.org/stable/modules/compose.html",
        note: "Pipelines",
      },
      {
        label: "Feature leakage",
        url: "https://scikit-learn.org/stable/common_pitfalls.html",
        note: "Pitfalls",
      },
    ],
    books: [
      {
        label: "Feature Engineering for Machine Learning",
        note: "Diseño y validación",
      },
      {
        label: "Hands-On ML (pipelines)",
        note: "fit/transform",
      },
    ],
    courses: [
      {
        label: "sklearn preprocessing",
        url: "https://scikit-learn.org/stable/modules/preprocessing.html",
        note: "API",
      },
    ],
  },
}
