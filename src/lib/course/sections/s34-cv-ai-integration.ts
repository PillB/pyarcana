import type { CourseSection } from '../../types'

export const section34: CourseSection = {
  id: "cv-ai-integration",
  index: 34,
  title: "Métricas, desbalance, calibración y umbrales",
  shortTitle: "Métricas y umbrales",
  tagline: "Relationship Investigation Workbench: grafo + evidencia con ranking calibrado para revisión; no etiqueta fraude automáticamente",
  estimatedHours: 14,
  level: "Competente a experto",
  phase: 2,
  icon: "Gauge",
  accentColor: "bg-gradient-to-br from-fuchsia-500 to-purple-900",
  jobRelevance:
    "Cierras **CP-N3-B** con el **Relationship Investigation Workbench**: grafo, features, baseline y **ranking calibrado** para humanos. Id `cv-ai-integration` conservado. Precision/recall de cola de revisión — **nunca** auto-etiqueta de fraude. ER/matching ≠ parentesco ni fraude.",
  learningOutcomes: [
    { text: "Elegir métricas para desbalance" },
    { text: "Dimensionar top-k y carga de revisión" },
    { text: "Balancear clases sin leakage en CV" },
    { text: "Evitar métricas engañosas por prevalencia" },
    { text: "Evaluar calibración con Brier/reliability" },
    { text: "Calibrar y evaluar fuera de muestra" },
    { text: "Elegir umbral por costo y capacidad" },
    { text: "Aplicar abstención y sensibilidad por slice" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-B: Relationship Investigation Workbench",
      paragraphs: [
        "En V3, **S34 cierra CP-N3-B**. Integras grafo (S31), features (S32), baseline/ML (S33) con **métricas de ranking**, **calibración** y **umbrales por capacidad**.",
        "El workbench **prioriza revisión** y **explica**; no imprime fraud=true. Decisiones humanas quedan registradas.",
        "Orden: **T1 Métricas** → **T2 Desbalance** → **T3 Calibración** → **T4 Decisión**.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-B",
        content:
          "Relationship Investigation Workbench. Esta lane **no** marca section_passed ni ledger/checkpoint.",
      },
    },
    {
      heading: "confusion matrix, precision/recall/F y PR-AUC",
      subtopicId: "S34-T1-A",
      paragraphs: [
        "Con desbalance, accuracy engaña. Precision/recall y PR-AUC describen mejor la cola positiva (needs_review).",
        "Confusion matrix: TP/FP/TN/FN sobre umbral. F1 es media armónica; elige beta según costo.",
        "PR-AUC resume ranking sin fijar umbral único.",
      ],
      code: {
        language: 'python',
        title: "pr_metrics.py",
        code: `y = [1, 1, 0, 0, 0, 0, 0, 0, 0, 1]
# scores rankean positivos primero
scores = [0.9, 0.8, 0.7, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.85]
thr = 0.5
pred = [1 if s >= thr else 0 for s in scores]
tp = sum(p == 1 and t == 1 for p, t in zip(pred, y))
fp = sum(p == 1 and t == 0 for p, t in zip(pred, y))
fn = sum(p == 0 and t == 1 for p, t in zip(pred, y))
prec = tp / (tp + fp) if tp + fp else 0.0
rec = tp / (tp + fn) if tp + fn else 0.0
f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(prec, 3), "recall", round(rec, 3))
print("f1", round(f1, 3))`,
        output: `tp 3 fp 1 fn 0
precision 0.75 recall 1.0
f1 0.857`,
      },
      callout: {
        type: "tip",
        title: "PR > Acc",
        content:
          "Reporta prevalencia junto a accuracy si la usas.",
      },
    },
    {
      heading: "top-k y carga de revisión",
      subtopicId: "S34-T1-B",
      paragraphs: [
        "La operación tiene capacidad k casos/día. Métrica operativa: precision@k, recall@k, capturas en top-k.",
        "Carga: si envías más de k, hay cola o abandono. El umbral se acopla a k.",
        "Simula k fijo y mide cuántos positivos reales entran.",
      ],
      code: {
        language: 'python',
        title: "topk.py",
        code: `import math
pairs = sorted([
    ("c1", 0.95, 1), ("c2", 0.9, 0), ("c3", 0.85, 1), ("c4", 0.2, 1), ("c5", 0.1, 0)
], key=lambda x: -x[1])
k = 2
topk = pairs[:k]
prec_at_k = sum(y for _, _, y in topk) / k
print("precision_at_k", prec_at_k)
print("positives_in_topk", sum(y for _, _, y in topk))
print("capacity_k", k)`,
        output: `precision_at_k 0.5
positives_in_topk 1
capacity_k 2`,
      },
      callout: {
        type: "warning",
        title: "Capacidad real",
        content:
          "Un modelo 'óptimo' que manda 10k alertas no sirve.",
      },
    },
    {
      heading: "class weights y resampling dentro de CV",
      subtopicId: "S34-T2-A",
      paragraphs: [
        "Class weights o undersampling/oversampling **solo dentro** del fold de train. Resamplear antes del split filtra valid.",
        "Documenta la política. No inventes filas con labels de fraude real.",
        "Pesos inversos a frecuencia como baseline de desbalance.",
      ],
      code: {
        language: 'python',
        title: "class_weights.py",
        code: `y_train = [0, 0, 0, 0, 1]
n0, n1 = y_train.count(0), y_train.count(1)
w0, w1 = 1 / n0, 1 / n1
# normaliza
s = w0 + w1
w0, w1 = w0 / s * 2, w1 / s * 2
print("weight_0", round(w0, 3))
print("weight_1", round(w1, 3))
print("resample_before_split", False)`,
        output: `weight_0 0.4
weight_1 1.6
resample_before_split False`,
      },
      callout: {
        type: "danger",
        title: "Resample global",
        content:
          "Prohibido antes de CV.",
      },
    },
    {
      heading: "prevalencia y métricas engañosas",
      subtopicId: "S34-T2-B",
      paragraphs: [
        "Accuracy con 1% positivos y predecir todo 0 da 99%. Reporta prevalencia y matriz.",
        "Precision depende de prevalencia; al cambiar mix, recalibra expectativas.",
        "Comunica a negocio en términos de carga y capturas, no solo accuracy.",
      ],
      code: {
        language: 'python',
        title: "prevalence.py",
        code: `n, pos = 1000, 10
# predict all negative
acc = (n - pos) / n
print("acc_all_neg", acc)
print("prevalence", pos / n)
print("useful", False)`,
        output: `acc_all_neg 0.99
prevalence 0.01
useful False`,
      },
      callout: {
        type: "tip",
        title: "Siempre prevalencia",
        content:
          "Al lado de cada accuracy.",
      },
    },
    {
      heading: "reliability curves y Brier",
      subtopicId: "S34-T3-A",
      paragraphs: [
        "Calibración: si dices 0.8, ~80% deben ser positivos en ese bin. Reliability curve por bins.",
        "Brier score: media de (p - y)^2; menor es mejor.",
        "Ranking bueno ≠ calibración buena; el workbench necesita ambas para umbrales por capacidad.",
      ],
      code: {
        language: 'python',
        title: "brier.py",
        code: `y = [1, 0, 1, 0]
p = [0.9, 0.1, 0.6, 0.4]
brier = sum((pi - yi) ** 2 for pi, yi in zip(p, y)) / len(y)
# bin simple >=0.5
bin_hi = [(pi, yi) for pi, yi in zip(p, y) if pi >= 0.5]
freq = sum(yi for _, yi in bin_hi) / len(bin_hi) if bin_hi else None
print("brier", round(brier, 3))
print("hi_bin_freq", freq)
print("hi_bin_mean_p", round(sum(pi for pi, _ in bin_hi) / len(bin_hi), 3))`,
        output: `brier 0.085
hi_bin_freq 1.0
hi_bin_mean_p 0.75`,
      },
      callout: {
        type: "tip",
        title: "Bins con n bajo",
        content:
          "No sobreinterpretes bins con 2 puntos.",
      },
    },
    {
      heading: "calibradores y evaluación fuera de muestra",
      subtopicId: "S34-T3-B",
      paragraphs: [
        "Platt/isotonic se fit en holdout de calibración, no en el test final.",
        "Evalúa Brier/reliability out-of-sample. Recalibra si hay drift de prevalencia.",
        "Didáctica: rescale afín clipado de scores como calibrador toy.",
      ],
      code: {
        language: 'python',
        title: "calibrator.py",
        code: `def calibrate_affine(p, a=1.1, b=-0.05):
    x = a * p + b
    return max(0.0, min(1.0, x))
raw = [0.2, 0.5, 0.8]
cal = [calibrate_affine(p) for p in raw]
print("cal", [round(c, 3) for c in cal])
print("fit_on", "calib_holdout")
print("not_on_test", True)`,
        output: `cal [0.17, 0.5, 0.83]
fit_on calib_holdout
not_on_test True`,
      },
      callout: {
        type: "warning",
        title: "Holdout",
        content:
          "No fit calibrador en el mismo set que reportas.",
      },
    },
    {
      heading: "threshold por costo/capacidad",
      subtopicId: "S34-T4-A",
      paragraphs: [
        "Elige umbral minimizando costo esperado o fijando |pred=1| ≈ capacidad k.",
        "Barrido de umbrales con métrica de negocio. Conserva thr en config versionada.",
        "Decisión automática solo para 'no revisar' de muy baja score si la política lo permite — nunca fraud label.",
      ],
      code: {
        language: 'python',
        title: "threshold.py",
        code: `scores_y = [(0.9, 1), (0.8, 0), (0.4, 1), (0.2, 0)]
capacity = 1
# top score as thr policy
ordered = sorted(scores_y, key=lambda z: -z[0])
chosen = ordered[:capacity]
print("review_ids_scores", [s for s, _ in chosen])
print("precision_cap", sum(y for _, y in chosen) / capacity)
print("auto_fraud_label", False)`,
        output: `review_ids_scores [0.9]
precision_cap 1.0
auto_fraud_label False`,
      },
      callout: {
        type: "danger",
        title: "Sin auto-fraude",
        content:
          "El umbral manda a review o no; no etiqueta delito.",
      },
    },
    {
      heading: "abstención, slices y sensibilidad",
      subtopicId: "S34-T4-B",
      paragraphs: [
        "Abstención: bandas grises → humano. Slices: métricas por cohorte. Sensibilidad: mueve thr ±ε.",
        "El workbench registra abstenciones y overrides.",
        "Cierre CP-N3-B: paquete explicable + ranking calibrado + registro de decisión.",
      ],
      code: {
        language: 'python',
        title: "abstain.py",
        code: `def decide(p, t_low=0.3, t_high=0.7):
    if p >= t_high:
        return "auto_queue"
    if p <= t_low:
        return "skip"
    return "abstain_human"
ps = [0.1, 0.5, 0.9]
print([decide(p) for p in ps])
print("labels_fraud", False)
print("gate", "CP-N3-B")`,
        output: `['skip', 'abstain_human', 'auto_queue']
labels_fraud False
gate CP-N3-B`,
      },
      callout: {
        type: "info",
        title: "Cierre workbench",
        content:
          "Grafo+evidencia+ranking calibrado+registro; no fraude auto.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre CP-N3-B: PR, top-k, desbalance, calibración, umbrales y abstención sin auto-fraude.",
    steps: [
      {
        demoId: "S34-T1-A-DEMO",
        subtopicId: "S34-T1-A",
        environment: "local-python",
        description: "Precision/recall a thr=0.5.",
        code: {
          language: 'python',
          title: "pr_demo.py",
          code: `y,p=[1,0,1],[0.9,0.4,0.6]
pred=[int(s>=0.5) for s in p]
tp=sum(a==1 and b==1 for a,b in zip(pred,y))
fp=sum(a==1 and b==0 for a,b in zip(pred,y))
fn=sum(a==0 and b==1 for a,b in zip(pred,y))
print('P', round(tp/(tp+fp),3), 'R', round(tp/(tp+fn),3))
print('tp', tp)
print('ok', True)`,
          output: `P 1.0 R 1.0
tp 2
ok True`,
        },
        why: "Matriz y PR.",
      },
      {
        demoId: "S34-T1-B-DEMO",
        subtopicId: "S34-T1-B",
        environment: "local-python",
        description: "precision@2 sobre ranking.",
        code: {
          language: 'python',
          title: "topk_demo.py",
          code: `rows=sorted([(0.9,1),(0.8,0),(0.7,1)], reverse=True)
k=2
print('p_at_k', sum(y for _,y in rows[:k])/k)
print('k', k)
print('load', k)`,
          output: `p_at_k 0.5
k 2
load 2`,
        },
        why: "Capacidad k.",
      },
      {
        demoId: "S34-T2-A-DEMO",
        subtopicId: "S34-T2-A",
        environment: "local-python",
        description: "Pesos inversos a conteo.",
        code: {
          language: 'python',
          title: "w_demo.py",
          code: `y=[0,0,1]; n0,n1=2,1
print('w1_over_w0', round((1/n1)/(1/n0),3))
print('inside_cv', True)
print('ok', True)`,
          output: `w1_over_w0 2.0
inside_cv True
ok True`,
        },
        why: "Weights en train fold.",
      },
      {
        demoId: "S34-T2-B-DEMO",
        subtopicId: "S34-T2-B",
        environment: "local-python",
        description: "Accuracy all-negative engañosa.",
        code: {
          language: 'python',
          title: "prev_demo.py",
          code: `n,pos=100,5
print('acc', (n-pos)/n)
print('prevalence', pos/n)
print('misleading', True)`,
          output: `acc 0.95
prevalence 0.05
misleading True`,
        },
        why: "Reporta prevalencia.",
      },
      {
        demoId: "S34-T3-A-DEMO",
        subtopicId: "S34-T3-A",
        environment: "local-python",
        description: "Brier de 2 puntos.",
        code: {
          language: 'python',
          title: "brier_demo.py",
          code: `print('brier', round(((0.8-1)**2+(0.2-0)**2)/2, 3))
print('n', 2)
print('ok', True)`,
          output: `brier 0.04
n 2
ok True`,
        },
        why: "Brier simple.",
      },
      {
        demoId: "S34-T3-B-DEMO",
        subtopicId: "S34-T3-B",
        environment: "local-python",
        description: "Calibrador clip affine.",
        code: {
          language: 'python',
          title: "cal_demo.py",
          code: `def cal(p): return max(0,min(1,1.2*p-0.1))
print([round(cal(p),3) for p in (0,0.5,1)])
print('holdout_fit', True)
print('ok', True)`,
          output: `[0, 0.5, 1]
holdout_fit True
ok True`,
        },
        why: "OOS calib.",
      },
      {
        demoId: "S34-T4-A-DEMO",
        subtopicId: "S34-T4-A",
        environment: "local-python",
        description: "Selecciona top-1 por capacidad.",
        code: {
          language: 'python',
          title: "thr_demo.py",
          code: `s=[(0.4,'a'),(0.9,'b')]
pick=max(s)[1]
print('review', pick)
print('capacity', 1)
print('auto_fraud', False)`,
          output: `review b
capacity 1
auto_fraud False`,
        },
        why: "Umbral por capacidad.",
      },
      {
        demoId: "S34-T4-B-DEMO",
        subtopicId: "S34-T4-B",
        environment: "local-python",
        description: "Banda de abstención.",
        code: {
          language: 'python',
          title: "abs_demo.py",
          code: `def d(p):
    if p>=0.8: return 'queue'
    if p<=0.2: return 'skip'
    return 'abstain'
print([d(p) for p in (0.1,0.5,0.9)])
print('fraud_label', False)
print('gate', 'CP-N3-B')`,
          output: `['skip', 'abstain', 'queue']
fraud_label False
gate CP-N3-B`,
        },
        why: "Abstención humana.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de métricas, carga, desbalance, prevalencia, Brier, calibración, umbrales y slices.",
    steps: [
      {
        id: "S34-T1-A-E1",
        subtopicId: "S34-T1-A",
        kind: "apply",
        instruction:
          "TP/FP/FN con y=[1,0], pred=[1,1].",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('tp', 1)
print('fp', 1)
print('fn', 0)`,
          output: `tp 1
fp 1
fn 0`,
        },
      },
      {
        id: "S34-T1-A-E2",
        subtopicId: "S34-T1-A",
        kind: "apply",
        instruction:
          "F1 con P=0.5 R=0.5.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `P=R=0.5
print('f1', 2*P*R/(P+R))
print('P', P)
print('R', R)`,
          output: `f1 0.5
P 0.5
R 0.5`,
        },
      },
      {
        id: "S34-T1-A-E3",
        subtopicId: "S34-T1-A",
        kind: "apply",
        instruction:
          "Accuracy engañosa n=10 pos=1 pred all0.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('acc', 0.9)
print('prevalence', 0.1)
print('ok', True)`,
          output: `acc 0.9
prevalence 0.1
ok True`,
        },
      },
      {
        id: "S34-T1-B-E1",
        subtopicId: "S34-T1-B",
        kind: "apply",
        instruction:
          "precision@3 con labels top [1,0,1].",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('p_at_3', round(2/3,3))
print('k', 3)
print('pos', 2)`,
          output: `p_at_3 0.667
k 3
pos 2`,
        },
      },
      {
        id: "S34-T1-B-E2",
        subtopicId: "S34-T1-B",
        kind: "apply",
        instruction:
          "Carga si alertas=50 capacidad=10.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('overload', 50-10)
print('capacity', 10)
print('alerts', 50)`,
          output: `overload 40
capacity 10
alerts 50`,
        },
      },
      {
        id: "S34-T1-B-E3",
        subtopicId: "S34-T1-B",
        kind: "apply",
        instruction:
          "recall@k: 2 pos en topk de 4 pos totales.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('r_at_k', 0.5)
print('pos_topk', 2)
print('pos_all', 4)`,
          output: `r_at_k 0.5
pos_topk 2
pos_all 4`,
        },
      },
      {
        id: "S34-T2-A-E1",
        subtopicId: "S34-T2-A",
        kind: "apply",
        instruction:
          "n0=9 n1=1 weight ratio w1/w0.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('ratio', 9.0)
print('n1', 1)
print('inside_cv', True)`,
          output: `ratio 9.0
n1 1
inside_cv True`,
        },
      },
      {
        id: "S34-T2-A-E2",
        subtopicId: "S34-T2-A",
        kind: "apply",
        instruction:
          "Prohibido resample flag.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('resample_before_split', False)
print('policy', 'inside_train_fold')
print('ok', True)`,
          output: `resample_before_split False
policy inside_train_fold
ok True`,
        },
      },
      {
        id: "S34-T2-A-E3",
        subtopicId: "S34-T2-A",
        kind: "apply",
        instruction:
          "Cuenta minority en y.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `y=[0,0,1,0]
print('minority', 1)
print('count', y.count(1))
print('ok', True)`,
          output: `minority 1
count 1
ok True`,
        },
      },
      {
        id: "S34-T2-B-E1",
        subtopicId: "S34-T2-B",
        kind: "apply",
        instruction:
          "Prevalencia 25/1000.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('prevalence', 0.025)
print('pos', 25)
print('n', 1000)`,
          output: `prevalence 0.025
pos 25
n 1000`,
        },
      },
      {
        id: "S34-T2-B-E2",
        subtopicId: "S34-T2-B",
        kind: "apply",
        instruction:
          "Precision cambia si prevalencia cae (mensaje).",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('depends_on_prevalence', True)
print('metric', 'precision')
print('ok', True)`,
          output: `depends_on_prevalence True
metric precision
ok True`,
        },
      },
      {
        id: "S34-T2-B-E3",
        subtopicId: "S34-T2-B",
        kind: "apply",
        instruction:
          "All-neg acc for prev=0.02.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('acc', 0.98)
print('useful_alone', False)
print('ok', True)`,
          output: `acc 0.98
useful_alone False
ok True`,
        },
      },
      {
        id: "S34-T3-A-E1",
        subtopicId: "S34-T3-A",
        kind: "apply",
        instruction:
          "Brier (1-1)^2=0 single.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('brier', 0.0)
print('n', 1)
print('ok', True)`,
          output: `brier 0.0
n 1
ok True`,
        },
      },
      {
        id: "S34-T3-A-E2",
        subtopicId: "S34-T3-A",
        kind: "apply",
        instruction:
          "Reliability: mean p vs freq en bin.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `ps,ys=[0.8,0.9],[1,0]
print('mean_p', 0.85)
print('freq', 0.5)
print('n', 2)`,
          output: `mean_p 0.85
freq 0.5
n 2`,
        },
      },
      {
        id: "S34-T3-A-E3",
        subtopicId: "S34-T3-A",
        kind: "apply",
        instruction:
          "Menor Brier es mejor: 0.1 vs 0.3.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('best', 0.1)
print('worse', 0.3)
print('ok', True)`,
          output: `best 0.1
worse 0.3
ok True`,
        },
      },
      {
        id: "S34-T3-B-E1",
        subtopicId: "S34-T3-B",
        kind: "apply",
        instruction:
          "Clip 1.5→1.0, -0.2→0.0.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `def c(x): return max(0.0, min(1.0, x))
print(c(1.5), c(-0.2))
print('ok', True)
print('holdout', True)`,
          output: `1.0 0.0
ok True
holdout True`,
        },
      },
      {
        id: "S34-T3-B-E2",
        subtopicId: "S34-T3-B",
        kind: "apply",
        instruction:
          "Fit calibrator set name.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('fit_on', 'calib_holdout')
print('eval_on', 'test')
print('ok', True)`,
          output: `fit_on calib_holdout
eval_on test
ok True`,
        },
      },
      {
        id: "S34-T3-B-E3",
        subtopicId: "S34-T3-B",
        kind: "apply",
        instruction:
          "Lista raw vs cal same length.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `raw=[0.1,0.2]; cal=raw[:]
print(len(raw)==len(cal))
print('n', 2)
print('ok', True)`,
          output: `True
n 2
ok True`,
        },
      },
      {
        id: "S34-T4-A-E1",
        subtopicId: "S34-T4-A",
        kind: "apply",
        instruction:
          "thr que deja 2 de scores [0.1,0.4,0.6,0.9] en review (>=thr).",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `scores=[0.1,0.4,0.6,0.9]; thr=0.6
print('n_review', sum(s>=thr for s in scores))
print('thr', thr)
print('auto_fraud', False)`,
          output: `n_review 2
thr 0.6
auto_fraud False`,
        },
      },
      {
        id: "S34-T4-A-E2",
        subtopicId: "S34-T4-A",
        kind: "apply",
        instruction:
          "Costo fp*2+fn*10 con fp=3 fn=1.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('cost', 16)
print('fp', 3)
print('fn', 1)`,
          output: `cost 16
fp 3
fn 1`,
        },
      },
      {
        id: "S34-T4-A-E3",
        subtopicId: "S34-T4-A",
        kind: "apply",
        instruction:
          "Config thr versionada thr-v1=0.7.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('thr_id', 'thr-v1')
print('value', 0.7)
print('ok', True)`,
          output: `thr_id thr-v1
value 0.7
ok True`,
        },
      },
      {
        id: "S34-T4-B-E1",
        subtopicId: "S34-T4-B",
        kind: "apply",
        instruction:
          "decide(0.5) con low=0.3 high=0.7 → abstain.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print('decision', 'abstain_human')
print('p', 0.5)
print('fraud_label', False)`,
          output: `decision abstain_human
p 0.5
fraud_label False`,
        },
      },
      {
        id: "S34-T4-B-E2",
        subtopicId: "S34-T4-B",
        kind: "apply",
        instruction:
          "Sensibilidad: thr 0.5 vs 0.6 n_pos_pred scores.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `s=[0.55,0.65,0.4]
print('at_0.5', sum(x>=0.5 for x in s))
print('at_0.6', sum(x>=0.6 for x in s))
print('ok', True)`,
          output: `at_0.5 2
at_0.6 1
ok True`,
        },
      },
      {
        id: "S34-T4-B-E3",
        subtopicId: "S34-T4-B",
        kind: "apply",
        instruction:
          "Slice metric dict output.",
        hint: "Usa las demos de métricas.",
        hints: [
          "Usa las demos de métricas.",
          "Salida alineada a prints.",
        ],
        edgeCases: ["sintético", "sin label fraude auto"],
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
          code: `print({'slice':'LIM','precision':0.5})
print('n_slices', 1)
print('ok', True)`,
          output: `{'slice': 'LIM', 'precision': 0.5}
n_slices 1
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Relationship Investigation Workbench (cierre CP-N3-B)",
    context:
      "Cierra CP-N3-B: integra grafo+evidencia+features+modelo con ranking calibrado, top-k por capacidad, abstención y registro de decisiones humanas. **No** etiquetes fraude automáticamente. Platform id cv-ai-integration conservado. ER ≠ parentesco ≠ fraude.",
    objectives: [
      "Métricas PR y precision@k operativas",
      "Desbalance tratado dentro de CV",
      "Calibración OOS y Brier",
      "Umbral por capacidad + abstención + slices",
      "Registro de decisión/override sin auto-fraude",
    ],
    requirements: [
      "Demo workbench reproducible",
      "Baseline + modelo en métricas",
      "Cero auto-label fraude",
      "Privacidad/sintético/es-PE",
      "Documenta gate CP-N3-B (esta lane no marca PASS)",
    ],
    starterCode: `# CP-N3-B CLOSE — Relationship Investigation Workbench
def decide(p, t_low=0.3, t_high=0.75):
    if p >= t_high:
        return "queue_review"
    if p <= t_low:
        return "skip"
    return "abstain"

def precision_at_k(ranked_labels, k):
    top = ranked_labels[:k]
    return sum(top) / k if k else 0.0

# TODO: wire graph evidence packet, calibrated scores, decision log
if __name__ == "__main__":
    print(decide(0.5), precision_at_k([1, 0, 1], 2))
`,
    portfolioNote:
      "Cierre CP-N3-B Workbench. Calificación PASS del gate es otra lane; no editar seed/checkpoint/ledger.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Ranking calibrado + top-k/abstención documentados", weight: "bonus checklist" },
      { criterion: "Sin auto-etiqueta de fraude; ER≠parentesco", weight: "gate privacy" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El workbench CP-N3-B debe:",
        options: [
          "Auto-etiquetar fraude",
          "Priorizar revisión con evidencia y ranking",
          "Inferir parentesco legal",
          "Borrar baselines",
        ],
        correctIndex: 1,
        explanation:
          "Revisión explicable, no fraude auto.",
      },
      {
        question: "precision@k responde a:",
        options: [
          "Solo Brier",
          "Calidad del ranking bajo capacidad k",
          "Docker",
          "Kafka lag",
        ],
        correctIndex: 1,
        explanation:
          "Métrica operativa de cola.",
      },
      {
        question: "Resampling de clases debe:",
        options: [
          "Hacerse antes de todo split",
          "Solo dentro del train de cada fold",
          "En el test",
          "Nunca documentarse",
        ],
        correctIndex: 1,
        explanation:
          "Evita leakage.",
      },
      {
        question: "Abstención sirve para:",
        options: [
          "Ocultar métricas",
          "Enviar banda gris a humano",
          "Forzar fraud=1",
          "Eliminar el grafo",
        ],
        correctIndex: 1,
        explanation:
          "Control humano.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn calibration",
        url: "https://scikit-learn.org/stable/modules/calibration.html",
        note: "Reliability/Brier",
      },
      {
        label: "Precision-Recall",
        url: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html",
        note: "PR curves",
      },
    ],
    books: [
      {
        label: "Practical Statistics for Data Scientists",
        note: "Métricas y prevalencia",
      },
      {
        label: "Trustworthy ML notes",
        note: "Calibración y umbrales",
      },
    ],
    courses: [
      {
        label: "Model evaluation guide",
        url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        note: "API métricas",
      },
    ],
  },
}
