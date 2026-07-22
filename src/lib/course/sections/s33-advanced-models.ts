import type { CourseSection } from '../../types'

export const section33: CourseSection = {
  id: "advanced-models",
  index: 33,
  title: "ML supervisado y baselines responsables",
  shortTitle: "Baselines ML responsables",
  tagline: "comparación honesta que conserva el baseline determinista y demuestra cuándo el ML agrega —o no agrega— valor",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "LineChart",
  accentColor: "bg-gradient-to-br from-purple-500 to-indigo-800",
  jobRelevance:
    "Un workbench serio **no reemplaza** reglas claras por un modelo opaco sin baseline. Id `advanced-models` conservado; V3 **ML supervisado y baselines responsables** (baseline del workbench CP-N3-B). Predicción de prioridad de revisión ≠ etiqueta de fraude.",
  learningOutcomes: [
    { text: "Definir unidad, target y horizonte" },
    { text: "Fijar baseline de regla y dummy" },
    { text: "Entrenar modelos lineales regularizados" },
    { text: "Interpretar coeficientes y supuestos" },
    { text: "Entrenar árboles y ensambles" },
    { text: "Controlar overfit y reproducibilidad" },
    { text: "Registrar experimentos mínimos" },
    { text: "Hacer CV y análisis de errores" },
  ],
  theory: [
    {
      heading: "De modelos avanzados legado a baselines responsables",
      paragraphs: [
        "En V3, **S33** no empuja stacking por deporte: define **unidad de scoring**, **target** y **horizonte**, y conserva un **baseline determinista**.",
        "Target típico del workbench: necesita_revision (0/1) sintético — **no** 'es fraude'.",
        "Orden: **T1 Framing** → **T2 Lineales** → **T3 Árboles** → **T4 Experimento**.",
      ],
      callout: {
        type: "info",
        title: "Retarget V3",
        content:
          "Legacy gradient boosting showcase se reubica; baseline primero.",
      },
    },
    {
      heading: "unidad, target y horizonte",
      subtopicId: "S33-T1-A",
      paragraphs: [
        "Unidad: par de entidades, caso, o cuenta en t. Target: etiqueta observable en horizonte h (p.ej. mandado a review en 7d).",
        "Si el horizonte es confuso, el modelo aprende basura. Documenta t0 y h.",
        "Sintético: y en {0,1} con prevalencia conocida.",
      ],
      code: {
        language: 'python',
        title: "framing.py",
        code: `unit = "entity_pair_at_t0"
target = "needs_review_7d"
horizon_days = 7
rows = [
    {"pair": "E1-E2", "t0": "2026-01-01", "y": 1},
    {"pair": "E3-E4", "t0": "2026-01-01", "y": 0},
]
prev = sum(r["y"] for r in rows) / len(rows)
print("unit", unit)
print("target", target)
print("prevalence", prev)`,
        output: `unit entity_pair_at_t0
target needs_review_7d
prevalence 0.5`,
      },
      callout: {
        type: "tip",
        title: "Nombra el target",
        content:
          "needs_review ≠ fraud.",
      },
    },
    {
      heading: "costos, baseline de regla y dummy estimator",
      subtopicId: "S33-T1-B",
      paragraphs: [
        "Costos: FN y FP no son simétricos en capacidad de revisión. El baseline de **regla** (if shared_phone then review) debe quedar en el leaderboard.",
        "Dummy: predice clase mayoritaria o prevalencia. Si el ML no gana al dummy/regla, no despliegues.",
        "Comparación honesta en la misma métrica y split.",
      ],
      code: {
        language: 'python',
        title: "baselines.py",
        code: `y = [0, 0, 0, 1, 0]
# dummy majority
maj = 0 if y.count(0) >= y.count(1) else 1
dummy_acc = sum(yi == maj for yi in y) / len(y)
# rule: x>0 → 1
x = [0, 0, 1, 1, 0]
rule = [1 if xi > 0 else 0 for xi in x]
rule_acc = sum(a == b for a, b in zip(rule, y)) / len(y)
print("dummy_acc", dummy_acc)
print("rule_acc", rule_acc)
print("keep_baseline", True)`,
        output: `dummy_acc 0.8
rule_acc 0.8
keep_baseline True`,
      },
      callout: {
        type: "warning",
        title: "No borres la regla",
        content:
          "El gate exige baseline determinista conservado.",
      },
    },
    {
      heading: "regresión/logística y regularización",
      subtopicId: "S33-T2-A",
      paragraphs: [
        "Logística con L2 reduce coeficientes; útil con features correlacionadas de grafo.",
        "Implementación didáctica: score lineal + sigmoid + umbral 0.5; pesos con decay conceptual.",
        "Regularización no es opcional en alta dimensión relativa a n.",
      ],
      code: {
        language: 'python',
        title: "logreg.py",
        code: `import math
def sigmoid(z):
    return 1 / (1 + math.exp(-z))
w, b = 1.2, -0.5
xs = [0.0, 0.5, 1.0]
probs = [sigmoid(w * x + b) for x in xs]
preds = [1 if p >= 0.5 else 0 for p in probs]
print("probs", [round(p, 3) for p in probs])
print("preds", preds)
print("L2_idea", "shrink_w")`,
        output: `probs [0.378, 0.525, 0.668]
preds [0, 1, 1]
L2_idea shrink_w`,
      },
      callout: {
        type: "tip",
        title: "Escala features",
        content:
          "Sin scaling, L2 penaliza distinto por unidad.",
      },
    },
    {
      heading: "coeficientes, supuestos y scaling",
      subtopicId: "S33-T2-B",
      paragraphs: [
        "Coeficientes se interpretan ceteris paribus solo con scaling y sin multicolinealidad fuerte.",
        "Supuestos: linealidad en log-odds, independencia condicional aproximada — en grafo hay dependencia; sé humilde.",
        "Reporta top coefs con dirección, no como prueba causal.",
      ],
      code: {
        language: 'python',
        title: "coefs.py",
        code: `# features scaled ~ N(0,1) sintéticas
coefs = {"shared_phone": 0.9, "amount_7d": 0.3, "region_LIM": -0.1}
top = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
print("top", top[0], coefs[top[0]])
print("causal", False)
print("scaled", True)`,
        output: `top shared_phone 0.9
causal False
scaled True`,
      },
      callout: {
        type: "danger",
        title: "No causalidad",
        content:
          "Coef ≠ causa de fraude.",
      },
    },
    {
      heading: "decisiones y random forest/boosting",
      subtopicId: "S33-T3-A",
      paragraphs: [
        "Árboles capturan no linealidades; RF reduce varianza; boosting reduce sesgo con cuidado de overfit.",
        "Didáctica: árbol de un nivel (stump) por feature threshold.",
        "En workbench, a menudo la regla + logística bastan; boosting es opción, no vanidad.",
      ],
      code: {
        language: 'python',
        title: "stump.py",
        code: `def stump(x, thr=0.5):
    return 1 if x >= thr else 0
X = [0.1, 0.6, 0.9]
y = [0, 1, 1]
pred = [stump(x) for x in X]
acc = sum(p == t for p, t in zip(pred, y)) / len(y)
print("acc", acc)
print("thr", 0.5)
print("model", "stump")`,
        output: `acc 1.0
thr 0.5
model stump`,
      },
      callout: {
        type: "tip",
        title: "Empieza simple",
        content:
          "Stump/RF shallow antes de deep boosting.",
      },
    },
    {
      heading: "overfit, profundidad y reproducibilidad",
      subtopicId: "S33-T3-B",
      paragraphs: [
        "Profundidad alta memoriza. Limita depth/min_samples. Fija random_state.",
        "Curva train vs valid: si train→1 y valid baja, overfit.",
        "Reproduce con seed y log de hiperparámetros.",
      ],
      code: {
        language: 'python',
        title: "overfit.py",
        code: `import random
random.seed(42)
train_acc = [0.7, 0.85, 0.99]
valid_acc = [0.68, 0.72, 0.60]
depth = [1, 3, 10]
best = max(range(3), key=lambda i: valid_acc[i])
print("best_depth", depth[best])
print("valid", valid_acc[best])
print("seed", 42)`,
        output: `best_depth 3
valid 0.72
seed 42`,
      },
      callout: {
        type: "warning",
        title: "Valid manda",
        content:
          "No elijas depth por train_acc.",
      },
    },
    {
      heading: "pipeline y tracking mínimo",
      subtopicId: "S33-T4-A",
      paragraphs: [
        "Pipeline: preprocess → model. Tracking: run_id, params, metrics, feature_set, data_cutoff.",
        "Un JSON lines de experimentos supera a 'mejores pesos en mi laptop'.",
        "Compara siempre vs baseline_rule y dummy en el mismo run.",
      ],
      code: {
        language: 'python',
        title: "tracking.py",
        code: `import json
run = {
    "run_id": "exp-001",
    "feature_set": "fs-v3",
    "model": "logreg_l2",
    "params": {"C": 1.0},
    "metrics": {"pr_auc": 0.61, "baseline_rule_pr_auc": 0.55, "dummy_pr_auc": 0.50},
}
print(json.dumps(run["metrics"], sort_keys=True))
print("beats_rule", run["metrics"]["pr_auc"] > run["metrics"]["baseline_rule_pr_auc"])
print("run_id", run["run_id"])`,
        output: `{"baseline_rule_pr_auc": 0.55, "dummy_pr_auc": 0.5, "pr_auc": 0.61}
beats_rule True
run_id exp-001`,
      },
      callout: {
        type: "tip",
        title: "Tres métricas",
        content:
          "modelo, regla, dummy en cada run.",
      },
    },
    {
      heading: "validación cruzada apropiada y error analysis",
      subtopicId: "S33-T4-B",
      paragraphs: [
        "CV por grupo/entidad o time-series split — no KFold i.i.d. ingenuo si hay leakage.",
        "Error analysis: slices por región, tipo de enlace, prevalencia; FP/FN sintéticos revisados.",
        "Documenta fallas sistemáticas antes de subir complejidad.",
      ],
      code: {
        language: 'python',
        title: "cv_errors.py",
        code: `# group CV scores sintéticos
folds = [0.60, 0.58, 0.63]
mean = sum(folds) / len(folds)
errors = [
    {"slice": "shared_phone", "fn": 3, "fp": 1},
    {"slice": "no_link", "fn": 0, "fp": 4},
]
print("cv_mean", round(mean, 3))
print("worst_fp_slice", max(errors, key=lambda e: e["fp"])["slice"])
print("n_folds", len(folds))`,
        output: `cv_mean 0.603
worst_fp_slice no_link
n_folds 3`,
      },
      callout: {
        type: "info",
        title: "Slices",
        content:
          "El promedio esconde el daño en un slice.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro framing, baselines, lineales, árboles y tracking honesto.",
    steps: [
      {
        demoId: "S33-T1-A-DEMO",
        subtopicId: "S33-T1-A",
        environment: "local-python",
        description: "Define unit/target/horizon y prevalencia.",
        code: {
          language: 'python',
          title: "frame_demo.py",
          code: `print("unit", "case_at_t0")
print("target", "needs_review_7d")
print("prevalence", 0.2)`,
          output: `unit case_at_t0
target needs_review_7d
prevalence 0.2`,
        },
        why: "Framing claro.",
      },
      {
        demoId: "S33-T1-B-DEMO",
        subtopicId: "S33-T1-B",
        environment: "local-python",
        description: "Dummy majority vs regla x>0.",
        code: {
          language: 'python',
          title: "base_demo.py",
          code: `y=[0,0,1]; x=[0,1,1]
maj=0
print("dummy", sum(yi==maj for yi in y)/3)
print("rule", sum((1 if xi>0 else 0)==yi for xi,yi in zip(x,y))/3)
print("keep", True)`,
          output: `dummy 0.6666666666666666
rule 0.6666666666666666
keep True`,
        },
        why: "Baseline en leaderboard.",
      },
      {
        demoId: "S33-T2-A-DEMO",
        subtopicId: "S33-T2-A",
        environment: "local-python",
        description: "Sigmoid scores para 3 x.",
        code: {
          language: 'python',
          title: "sig_demo.py",
          code: `import math
w,b=2.0,-1.0
ps=[1/(1+math.exp(-(w*x+b))) for x in (0,0.5,1)]
print([round(p,3) for p in ps])
print("thr", 0.5)
print("ok", True)`,
          output: `[0.269, 0.5, 0.731]
thr 0.5
ok True`,
        },
        why: "Logística simple.",
      },
      {
        demoId: "S33-T2-B-DEMO",
        subtopicId: "S33-T2-B",
        environment: "local-python",
        description: "Top coeficiente por valor absoluto.",
        code: {
          language: 'python',
          title: "coef_demo.py",
          code: `c={"a":0.2,"b":-0.9,"c":0.1}
t=max(c, key=lambda k: abs(c[k]))
print("top", t, c[t])
print("causal", False)
print("n", len(c))`,
          output: `top b -0.9
causal False
n 3`,
        },
        why: "Interpretación limitada.",
      },
      {
        demoId: "S33-T3-A-DEMO",
        subtopicId: "S33-T3-A",
        environment: "local-python",
        description: "Stump threshold accuracy.",
        code: {
          language: 'python',
          title: "stump_demo.py",
          code: `X,y=[0.2,0.8],[0,1]
pred=[1 if x>=0.5 else 0 for x in X]
print("acc", sum(p==t for p,t in zip(pred,y))/2)
print("thr", 0.5)
print("ok", True)`,
          output: `acc 1.0
thr 0.5
ok True`,
        },
        why: "Árbol mínimo.",
      },
      {
        demoId: "S33-T3-B-DEMO",
        subtopicId: "S33-T3-B",
        environment: "local-python",
        description: "Elige depth por valid no train.",
        code: {
          language: 'python',
          title: "depth_demo.py",
          code: `tr=[0.9,0.99]; va=[0.7,0.65]; d=[2,8]
i=max(range(2), key=lambda j: va[j])
print("depth", d[i])
print("valid", va[i])
print("seed", 0)`,
          output: `depth 2
valid 0.7
seed 0`,
        },
        why: "Anti-overfit.",
      },
      {
        demoId: "S33-T4-A-DEMO",
        subtopicId: "S33-T4-A",
        environment: "local-python",
        description: "Run log beats_rule.",
        code: {
          language: 'python',
          title: "track_demo.py",
          code: `m={"model":0.62,"rule":0.55,"dummy":0.5}
print("beats_rule", m["model"]>m["rule"])
print("beats_dummy", m["model"]>m["dummy"])
print("run", "exp-1")`,
          output: `beats_rule True
beats_dummy True
run exp-1`,
        },
        why: "Tracking mínimo.",
      },
      {
        demoId: "S33-T4-B-DEMO",
        subtopicId: "S33-T4-B",
        environment: "local-python",
        description: "CV mean y worst slice por fp.",
        code: {
          language: 'python',
          title: "cv_demo.py",
          code: `folds=[0.6,0.5,0.7]
print("mean", round(sum(folds)/3,3))
print("worst", "slice_B")
print("n_folds", 3)`,
          output: `mean 0.6
worst slice_B
n_folds 3`,
        },
        why: "Error analysis.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de framing, baselines, logística, árboles, overfit y CV.",
    steps: [
      {
        id: "S33-T1-A-E1",
        subtopicId: "S33-T1-A",
        kind: "guided",
        instruction:
          "Imprime unit, target needs_review_7d y horizon 7.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('unit', 'entity_pair')
print('target', 'needs_review_7d')
print('horizon', 7)`,
          output: `unit entity_pair
target needs_review_7d
horizon 7`,
        },
      },
      {
        id: "S33-T1-A-E2",
        subtopicId: "S33-T1-A",
        kind: "independent",
        instruction:
          "Prevalencia de y=[0,1,0,0].",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `y=[0,1,0,0]
print('prevalence', sum(y)/len(y))
print('n', len(y))
print('pos', sum(y))`,
          output: `prevalence 0.25
n 4
pos 1`,
        },
      },
      {
        id: "S33-T1-A-E3",
        subtopicId: "S33-T1-A",
        kind: "transfer",
        instruction:
          "Valida target name no contiene 'fraud'.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `t='needs_review_7d'
print('ok', 'fraud' not in t)
print('target', t)
print('policy', 'review_not_fraud')`,
          output: `ok True
target needs_review_7d
policy review_not_fraud`,
        },
      },
      {
        id: "S33-T1-B-E1",
        subtopicId: "S33-T1-B",
        kind: "guided",
        instruction:
          "Dummy majority para y=[1,1,0].",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `y=[1,1,0]
maj=1 if y.count(1)>=y.count(0) else 0
print('maj', maj)
print('acc', sum(yi==maj for yi in y)/len(y))
print('n', len(y))`,
          output: `maj 1
acc 0.6666666666666666
n 3`,
        },
      },
      {
        id: "S33-T1-B-E2",
        subtopicId: "S33-T1-B",
        kind: "independent",
        instruction:
          "Regla x>=1 predice 1; accuracy vs y.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `x,y=[0,1,2],[0,1,0]
p=[1 if xi>=1 else 0 for xi in x]
print('acc', sum(a==b for a,b in zip(p,y))/len(y))
print('preds', p)
print('keep_rule', True)`,
          output: `acc 0.6666666666666666
preds [0, 1, 1]
keep_rule True`,
        },
      },
      {
        id: "S33-T1-B-E3",
        subtopicId: "S33-T1-B",
        kind: "transfer",
        instruction:
          "Costo total: fp*1 + fn*5 con fp=2,fn=1.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('cost', 2*1+1*5)
print('fp', 2)
print('fn', 1)`,
          output: `cost 7
fp 2
fn 1`,
        },
      },
      {
        id: "S33-T2-A-E1",
        subtopicId: "S33-T2-A",
        kind: "guided",
        instruction:
          "sigmoid(0) y sigmoid(2) redondeados 3 dec.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `import math
def s(z): return 1/(1+math.exp(-z))
print('s0', round(s(0),3))
print('s2', round(s(2),3))
print('ok', True)`,
          output: `s0 0.5
s2 0.881
ok True`,
        },
      },
      {
        id: "S33-T2-A-E2",
        subtopicId: "S33-T2-A",
        kind: "independent",
        instruction:
          "Predicción w=1,b=0,x=0.2 umbral 0.5.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `import math
p=1/(1+math.exp(-0.2))
print('prob', round(p,3))
print('pred', int(p>=0.5))
print('thr', 0.5)`,
          output: `prob 0.55
pred 1
thr 0.5`,
        },
      },
      {
        id: "S33-T2-A-E3",
        subtopicId: "S33-T2-A",
        kind: "transfer",
        instruction:
          "L2 penalty w^2 para w=[1,2].",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `w=[1,2]
print('l2', sum(x*x for x in w))
print('n', len(w))
print('ok', True)`,
          output: `l2 5
n 2
ok True`,
        },
      },
      {
        id: "S33-T2-B-E1",
        subtopicId: "S33-T2-B",
        kind: "guided",
        instruction:
          "Ordena coefs por |w| desc e imprime nombres.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `c={'x':0.1,'y':-0.5,'z':0.2}
print(sorted(c, key=lambda k: abs(c[k]), reverse=True))
print('top', 'y')
print('causal', False)`,
          output: `['y', 'z', 'x']
top y
causal False`,
        },
      },
      {
        id: "S33-T2-B-E2",
        subtopicId: "S33-T2-B",
        kind: "independent",
        instruction:
          "Marca si features están scaled (flag True).",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('scaled', True)
print('assume', 'log_odds_linear')
print('ok', True)`,
          output: `scaled True
assume log_odds_linear
ok True`,
        },
      },
      {
        id: "S33-T2-B-E3",
        subtopicId: "S33-T2-B",
        kind: "transfer",
        instruction:
          "Signo de coef shared_phone=0.8.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `w=0.8
print('sign', 'pos' if w>0 else 'neg')
print('w', w)
print('causal', False)`,
          output: `sign pos
w 0.8
causal False`,
        },
      },
      {
        id: "S33-T3-A-E1",
        subtopicId: "S33-T3-A",
        kind: "guided",
        instruction:
          "Stump thr=0.3 sobre X=[0.1,0.4].",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `X=[0.1,0.4]
print([1 if x>=0.3 else 0 for x in X])
print('thr', 0.3)
print('ok', True)`,
          output: `[0, 1]
thr 0.3
ok True`,
        },
      },
      {
        id: "S33-T3-A-E2",
        subtopicId: "S33-T3-A",
        kind: "independent",
        instruction:
          "Voto mayoría de 3 stumps preds.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `preds=[[1,0],[1,1],[0,1]]
# por columna
out=[]
for j in range(2):
    col=[preds[i][j] for i in range(3)]
    out.append(1 if sum(col)>=2 else 0)
print('vote', out)
print('n_models', 3)
print('ok', True)`,
          output: `vote [1, 1]
n_models 3
ok True`,
        },
      },
      {
        id: "S33-T3-A-E3",
        subtopicId: "S33-T3-A",
        kind: "transfer",
        instruction:
          "Compara stump acc vs majority dummy.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `y=[0,1,1]; pred=[0,1,0]; maj=1
print('stump', sum(p==t for p,t in zip(pred,y))/3)
print('dummy', sum(t==maj for t in y)/3)
print('ok', True)`,
          output: `stump 0.6666666666666666
dummy 0.6666666666666666
ok True`,
        },
      },
      {
        id: "S33-T3-B-E1",
        subtopicId: "S33-T3-B",
        kind: "guided",
        instruction:
          "best depth by valid list.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `d=[1,4,8]; v=[0.5,0.7,0.65]
i=max(range(3), key=lambda j: v[j])
print('depth', d[i])
print('valid', v[i])
print('seed', 7)`,
          output: `depth 4
valid 0.7
seed 7`,
        },
      },
      {
        id: "S33-T3-B-E2",
        subtopicId: "S33-T3-B",
        kind: "independent",
        instruction:
          "Detect overfit if train-valid gap>0.2.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `tr,va=0.95,0.6
print('overfit', tr-va>0.2)
print('gap', round(tr-va,2))
print('ok', True)`,
          output: `overfit True
gap 0.35
ok True`,
        },
      },
      {
        id: "S33-T3-B-E3",
        subtopicId: "S33-T3-B",
        kind: "transfer",
        instruction:
          "Fija seed e imprime random 3 ints 0-9.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `import random
random.seed(1)
print([random.randint(0,9) for _ in range(3)])
print('seed', 1)
print('repro', True)`,
          output: `[2, 9, 1]
seed 1
repro True`,
        },
      },
      {
        id: "S33-T4-A-E1",
        subtopicId: "S33-T4-A",
        kind: "guided",
        instruction:
          "JSON metrics keys sorted.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `import json
m={'pr_auc':0.6,'rule':0.5}
print(json.dumps(m, sort_keys=True))
print('beats', m['pr_auc']>m['rule'])
print('run', 'r1')`,
          output: `{"pr_auc": 0.6, "rule": 0.5}
beats True
run r1`,
        },
      },
      {
        id: "S33-T4-A-E2",
        subtopicId: "S33-T4-A",
        kind: "independent",
        instruction:
          "Lista campos mínimos de run.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `fields=['run_id','feature_set','model','params','metrics']
print(fields)
print('n', len(fields))
print('ok', True)`,
          output: `['run_id', 'feature_set', 'model', 'params', 'metrics']
n 5
ok True`,
        },
      },
      {
        id: "S33-T4-A-E3",
        subtopicId: "S33-T4-A",
        kind: "transfer",
        instruction:
          "beats_dummy check.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `print('beats_dummy', 0.55>0.5)
print('model', 0.55)
print('dummy', 0.5)`,
          output: `beats_dummy True
model 0.55
dummy 0.5`,
        },
      },
      {
        id: "S33-T4-B-E1",
        subtopicId: "S33-T4-B",
        kind: "guided",
        instruction:
          "Mean de folds.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `f=[0.4,0.6,0.5]
print(round(sum(f)/len(f),3))
print('n', len(f))
print('ok', True)`,
          output: `0.5
n 3
ok True`,
        },
      },
      {
        id: "S33-T4-B-E2",
        subtopicId: "S33-T4-B",
        kind: "independent",
        instruction:
          "Slice con más FN.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `s=[{'name':'A','fn':2},{'name':'B','fn':5}]
print(max(s, key=lambda x: x['fn'])['name'])
print('fn', 5)
print('ok', True)`,
          output: `B
fn 5
ok True`,
        },
      },
      {
        id: "S33-T4-B-E3",
        subtopicId: "S33-T4-B",
        kind: "transfer",
        instruction:
          "Group CV: n groups = n unique entities.",
        hint: "Sigue el framing del subtema.",
        hints: [
          "Sigue el framing del subtema.",
          "Deriva el resultado desde el fixture y verifica un caso de borde.",
        ],
        edgeCases: ["sintético"],
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
          code: `ents=['e1','e1','e2']
print('n_groups', len(set(ents)))
print('n_rows', len(ents))
print('ok', True)`,
          output: `n_groups 2
n_rows 3
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Baseline del workbench + comparación honesta (CP-N3-B baseline)",
    context:
      "Define unit/target/horizon para needs_review (no fraude), implementa dummy+regla+modelo, tracking y CV por entidad. Id advanced-models conservado.",
    objectives: [
      "Framing y costos",
      "Baseline regla y dummy en leaderboard",
      "Modelo simple reproducible",
      "CV/error analysis por slices",
    ],
    requirements: [
      "Target ≠ fraud label",
      "Baseline determinista no eliminado",
      "Seed y run log",
      "es-PE sintético",
    ],
    starterCode: `# baseline responsable
y = [0, 0, 1, 0, 1]
# TODO: dummy, rule, model scores, compare
if __name__ == '__main__':
    maj = 0 if y.count(0) >= y.count(1) else 1
    print('dummy_maj', maj)
`,
    portfolioNote:
      "Baseline CP-N3-B; no section_passed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Baseline conservado y target needs_review", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El target del workbench debe ser preferentemente:",
        options: ["needs_review u objetivo de cola", "fraud_auto", "parentesco", "culpa"],
        correctIndex: 0,
        explanation:
          "Revisión, no fraude automático.",
      },
      {
        question: "Si el modelo no gana a la regla:",
        options: ["Despliega igual", "Borra baseline", "Conserva regla y no vendas humo", "Sube depth a 100"],
        correctIndex: 2,
        explanation:
          "Comparación honesta.",
      },
      {
        question: "Coeficientes logísticos prueban:",
        options: ["Causalidad de fraude", "Parentesco", "Que el grafo miente", "Asociación en el modelo, no causa legal"],
        correctIndex: 3,
        explanation:
          "No causalidad.",
      },
      {
        question: "Elegir hiperparámetros por train_acc alto:",
        options: ["Es best practice", "Riesgo de overfit; usa valid", "Ignora seed", "Borra dummy"],
        correctIndex: 1,
        explanation:
          "Valid manda.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn DummyClassifier",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html",
        note: "Baseline",
      },
      {
        label: "LogisticRegression",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html",
        note: "L2",
      },
    ],
    books: [
      {
        label: "An Introduction to Statistical Learning",
        note: "Baselines y CV",
      },
      {
        label: "Interpretable ML concepts",
        note: "Coeficientes y límites",
      },
    ],
    courses: [
      {
        label: "sklearn model evaluation",
        url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        note: "Métricas",
      },
    ],
  },
}
