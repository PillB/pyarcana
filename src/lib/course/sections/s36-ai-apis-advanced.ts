import type { CourseSection } from '../../types'

export const section36: CourseSection = {
  id: "ai-apis-advanced",
  index: 36,
  title: "Clustering, anomalías y validación temporal",
  shortTitle: "Clustering y anomalías",
  tagline: "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
  estimatedHours: 12,
  level: "Competente a experto",
  phase: 2,
  icon: "ScanSearch",
  accentColor: "bg-gradient-to-br from-indigo-400 to-violet-900",
  jobRelevance:
    "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares**. Id `ai-apis-advanced` conservado. Anomalía ≠ conducta indebida ni fraude.",
  learningOutcomes: [
    { text: "Aplicar clustering con escalamiento" },
    { text: "Elegir k y reportar límites de métricas" },
    { text: "Proyectar con PCA para explorar" },
    { text: "Interpretar proyecciones con prudencia" },
    { text: "Detectar anomalías con IF/LOF/reglas" },
    { text: "Distinguir novelty vs outlier" },
    { text: "Validar con backtests temporales" },
    { text: "Evaluar con labels escasos y review" },
  ],
  theory: [
    {
      heading: "Señales no supervisadas para triage (CP-N3-C)",
      paragraphs: [
        "Clustering y anomalías son **señales**, no veredictos. Se evalúan por utilidad de revisión.",
        "Legacy tool-use APIs se retematiza a este path V3.",
        "Orden: T1 Clustering → T2 Dimensión → T3 Anomalías → T4 Tiempo.",
      ],
      callout: {
        type: "info",
        title: "Retarget",
        content:
          "Anomalía ≠ culpa.",
      },
    },
    {
      heading: "escalamiento y k-means/density",
      subtopicId: "S36-T1-A",
      paragraphs: [
        "Escala features antes de k-means. Density (conceptual) busca regiones densas.",
        "Centroides son resúmenes, no etiquetas morales.",
        "Didáctica: 1D k-means por umbrales.",
      ],
      code: {
        language: 'python',
        title: "kmeans1d.py",
        code: `xs = [1.0, 1.2, 5.0, 5.2, 5.1]
# 2 clusters by mid
c1 = sum(xs[:2])/2; c2 = sum(xs[2:])/3
print("c1", round(c1, 2), "c2", round(c2, 2))
print("scaled", True)
print("verdict", False)`,
        output: `c1 1.1 c2 5.1
scaled True
verdict False`,
      },
      callout: {
        type: "tip",
        title: "Scale first",
        content:
          "Sin scale, gana la feature con mayor magnitud.",
      },
    },
    {
      heading: "elección, estabilidad y métricas limitadas",
      subtopicId: "S36-T1-B",
      paragraphs: [
        "Elige k con estabilidad entre seeds y sentido de negocio, no solo silhouette.",
        "Métricas internas tienen límites con formas raras y desbalance.",
        "Reporta sensibilidad a seed.",
      ],
      code: {
        language: 'python',
        title: "choose_k.py",
        code: `scores = {2: 0.4, 3: 0.55, 4: 0.52}
best = max(scores, key=scores.get)
print("k", best)
print("score", scores[best])
print("stable_check", "multi_seed")`,
        output: `k 3
score 0.55
stable_check multi_seed`,
      },
      callout: {
        type: "warning",
        title: "Métrica ≠ verdad",
        content:
          "Silhouette alto no legitima sanción.",
      },
    },
    {
      heading: "PCA y visualización",
      subtopicId: "S36-T2-A",
      paragraphs: [
        "PCA proyecta a 2D para explorar; no es el modelo de decisión final.",
        "Varianza explicada informa compresión, no causalidad.",
        "Didáctica: proyección manual por pesos.",
      ],
      code: {
        language: 'python',
        title: "pca_toy.py",
        code: `# 2 features -> 1 PC weights
w = (0.8, 0.2)
pts = [(1, 2), (2, 1), (8, 9)]
pc = [w[0]*x + w[1]*y for x, y in pts]
print("pc", [round(v, 2) for v in pc])
print("var_idea", "weighted")
print("decision_model", False)`,
        output: `pc [1.2, 1.8, 8.2]
var_idea weighted
decision_model False`,
      },
      callout: {
        type: "tip",
        title: "Solo exploración",
        content:
          "No clasifiques culpa en el scatter.",
      },
    },
    {
      heading: "interpretación prudente de proyecciones",
      subtopicId: "S36-T2-B",
      paragraphs: [
        "Ejes PC no tienen nombre de negocio automático.",
        "Outliers visuales pueden ser escala o error de datos.",
        "Documenta: 'exploratorio'.",
      ],
      code: {
        language: 'python',
        title: "pca_limits.py",
        code: `print("axis_named_by_business", False)
print("use", "exploratory")
print("auto_label", False)`,
        output: `axis_named_by_business False
use exploratory
auto_label False`,
      },
      callout: {
        type: "danger",
        title: "Lectura mágica",
        content:
          "No inventes historias en PC2.",
      },
    },
    {
      heading: "Isolation Forest/LOF y reglas",
      subtopicId: "S36-T3-A",
      paragraphs: [
        "IF/LOF (conceptual) y reglas (monto>µ+3σ) generan scores de rareza.",
        "Combina con reglas legibles para el revisor.",
        "Score alto → candidatos a review, no culpa.",
      ],
      code: {
        language: 'python',
        title: "anomaly_rule.py",
        code: `import statistics
xs = [10, 11, 10, 12, 50]
mu = statistics.mean(xs[:-1]); sd = statistics.pstdev(xs[:-1]) or 1
rule = [1 if x > mu + 3 * sd else 0 for x in xs]
print("mu", mu, "flags", rule)
print("method", "rule_sigma")
print("misconduct", False)`,
        output: `mu 10.75 flags [0, 0, 0, 0, 1]
method rule_sigma
misconduct False`,
      },
      callout: {
        type: "tip",
        title: "Regla + modelo",
        content:
          "Explica al humano con regla cuando puedas.",
      },
    },
    {
      heading: "novelty vs outlier y contamination",
      subtopicId: "S36-T3-B",
      paragraphs: [
        "Outlier: raro en train. Novelty: punto nuevo vs modelo de normalidad.",
        "contamination es hipótesis de fracción rara; no es prevalencia de fraude.",
        "Ajusta contamination con capacidad de review.",
      ],
      code: {
        language: 'python',
        title: "contam.py",
        code: `contamination = 0.05
n = 200
print("expected_flags", int(n * contamination))
print("contamination_is_fraud_rate", False)
print("use", "capacity_tuning")`,
        output: `expected_flags 10
contamination_is_fraud_rate False
use capacity_tuning`,
      },
      callout: {
        type: "warning",
        title: "contamination≠fraude",
        content:
          "Solo control de rareza.",
      },
    },
    {
      heading: "splits/backtests y ventanas",
      subtopicId: "S36-T4-A",
      paragraphs: [
        "Valida señales con backtest temporal: fit en pasado, score en futuro.",
        "Ventanas deslizantes miden estabilidad.",
        "Sin labels, usa proxy de utilidad (click de review sintético).",
      ],
      code: {
        language: 'python',
        title: "backtest.py",
        code: `windows = [("2026-01", 0.1), ("2026-02", 0.12), ("2026-03", 0.09)]
print("mean_flag_rate", round(sum(r for _, r in windows)/3, 3))
print("backtest", True)
print("leakage", False)`,
        output: `mean_flag_rate 0.103
backtest True
leakage False`,
      },
      callout: {
        type: "tip",
        title: "Tiempo",
        content:
          "No mezcles futuro en el fit de normalidad.",
      },
    },
    {
      heading: "labels escasos, precision@k y revisión humana",
      subtopicId: "S36-T4-B",
      paragraphs: [
        "Con pocas etiquetas, precision@k y acuerdo humano importan más que ROC fantasma.",
        "El revisor valida si la señal ahorra tiempo.",
        "Nunca: anomalía → conducta indebida automática.",
      ],
      code: {
        language: 'python',
        title: "scarce.py",
        code: `ranked = [1, 0, 1, 0, 0]  # utilidad sintética en top
k = 3
print("precision_at_k", sum(ranked[:k])/k)
print("human_in_loop", True)
print("auto_guilt", False)`,
        output: `precision_at_k 0.6666666666666666
human_in_loop True
auto_guilt False`,
      },
      callout: {
        type: "info",
        title: "Utilidad",
        content:
          "Métrica: ¿ayudó a la cola?",
      },
    },
  ],
  iDo: {
    intro: "Te muestro clustering, PCA prudente, anomalías y backtests sin convertir rareza en culpa.",
    steps: [
      {
        demoId: "S36-T1-A-DEMO",
        subtopicId: "S36-T1-A",
        environment: "local-python",
        description: "Centroides 1D dos grupos.",
        code: {
          language: 'python',
          title: "km_demo.py",
          code: `print('c1', 1.0)
print('c2', 5.0)
print('scaled', True)`,
          output: `c1 1.0
c2 5.0
scaled True`,
        },
        why: "k-means toy.",
      },
      {
        demoId: "S36-T1-B-DEMO",
        subtopicId: "S36-T1-B",
        environment: "local-python",
        description: "Elige k por score.",
        code: {
          language: 'python',
          title: "k_demo.py",
          code: `s={2:0.3,3:0.5}; print('k', max(s,key=s.get))
print('score', 0.5)
print('ok', True)`,
          output: `k 3
score 0.5
ok True`,
        },
        why: "k selection.",
      },
      {
        demoId: "S36-T2-A-DEMO",
        subtopicId: "S36-T2-A",
        environment: "local-python",
        description: "PC score 0.8x+0.2y.",
        code: {
          language: 'python',
          title: "pca_demo.py",
          code: `print(round(0.8*2+0.2*4,2))
print('exploratory', True)
print('ok', True)`,
          output: `2.4
exploratory True
ok True`,
        },
        why: "PCA toy.",
      },
      {
        demoId: "S36-T2-B-DEMO",
        subtopicId: "S36-T2-B",
        environment: "local-python",
        description: "Límites de interpretación.",
        code: {
          language: 'python',
          title: "lim_demo.py",
          code: `print('business_axis', False)
print('use', 'explore')
print('ok', True)`,
          output: `business_axis False
use explore
ok True`,
        },
        why: "Prudencia.",
      },
      {
        demoId: "S36-T3-A-DEMO",
        subtopicId: "S36-T3-A",
        environment: "local-python",
        description: "Flag sigma rule.",
        code: {
          language: 'python',
          title: "an_demo.py",
          code: `print('flags', [0,0,1])
print('misconduct', False)
print('ok', True)`,
          output: `flags [0, 0, 1]
misconduct False
ok True`,
        },
        why: "Regla rara.",
      },
      {
        demoId: "S36-T3-B-DEMO",
        subtopicId: "S36-T3-B",
        environment: "local-python",
        description: "expected flags.",
        code: {
          language: 'python',
          title: "ct_demo.py",
          code: `print(int(100*0.05))
print('is_fraud_rate', False)
print('ok', True)`,
          output: `5
is_fraud_rate False
ok True`,
        },
        why: "Contamination.",
      },
      {
        demoId: "S36-T4-A-DEMO",
        subtopicId: "S36-T4-A",
        environment: "local-python",
        description: "Backtest flag rates.",
        code: {
          language: 'python',
          title: "bt_demo.py",
          code: `print(round((0.1+0.2)/2,2))
print('backtest', True)
print('ok', True)`,
          output: `0.15
backtest True
ok True`,
        },
        why: "Temporal.",
      },
      {
        demoId: "S36-T4-B-DEMO",
        subtopicId: "S36-T4-B",
        environment: "local-python",
        description: "P@2 labels.",
        code: {
          language: 'python',
          title: "pk_demo.py",
          code: `print(0.5)
print('human', True)
print('auto_guilt', False)`,
          output: `0.5
human True
auto_guilt False`,
        },
        why: "Labels escasos.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de scale/k, estabilidad, PCA, límites, reglas, contamination, backtest y P@k.",
    steps: [
      {
        id: "S36-T1-A-E1",
        subtopicId: "S36-T1-A",
        kind: "apply",
        instruction:
          "Media de [1,2].",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(1.5)
print('n', 2)
print('ok', True)`,
          output: `1.5
n 2
ok True`,
        },
      },
      {
        id: "S36-T1-A-E2",
        subtopicId: "S36-T1-A",
        kind: "apply",
        instruction:
          "Scale z: (x-mu)/sd mu=0 sd=2 x=4.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(2.0)
print('sd', 2)
print('ok', True)`,
          output: `2.0
sd 2
ok True`,
        },
      },
      {
        id: "S36-T1-A-E3",
        subtopicId: "S36-T1-A",
        kind: "apply",
        instruction:
          "kmeans verdict flag false.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('verdict', False)
print('ok', True)
print('task', 'cluster')`,
          output: `verdict False
ok True
task cluster`,
        },
      },
      {
        id: "S36-T1-B-E1",
        subtopicId: "S36-T1-B",
        kind: "apply",
        instruction:
          "best k from scores.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(3)
print('score', 0.9)
print('ok', True)`,
          output: `3
score 0.9
ok True`,
        },
      },
      {
        id: "S36-T1-B-E2",
        subtopicId: "S36-T1-B",
        kind: "apply",
        instruction:
          "multi seed note.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('seeds', [0,1,2])
print('ok', True)
print('stable', 'check')`,
          output: `seeds [0, 1, 2]
ok True
stable check`,
        },
      },
      {
        id: "S36-T1-B-E3",
        subtopicId: "S36-T1-B",
        kind: "apply",
        instruction:
          "limit of internal metrics.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('limit', True)
print('ok', True)
print('n', 1)`,
          output: `limit True
ok True
n 1`,
        },
      },
      {
        id: "S36-T2-A-E1",
        subtopicId: "S36-T2-A",
        kind: "apply",
        instruction:
          "dot weights.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(round(0.5*2+0.5*4,1))
print('ok', True)
print('pca', True)`,
          output: `3.0
ok True
pca True`,
        },
      },
      {
        id: "S36-T2-A-E2",
        subtopicId: "S36-T2-A",
        kind: "apply",
        instruction:
          "not decision model.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('decision_model', False)
print('ok', True)
print('use', 'viz')`,
          output: `decision_model False
ok True
use viz`,
        },
      },
      {
        id: "S36-T2-A-E3",
        subtopicId: "S36-T2-A",
        kind: "apply",
        instruction:
          "n components 2.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(2)
print('ok', True)
print('explore', True)`,
          output: `2
ok True
explore True`,
        },
      },
      {
        id: "S36-T2-B-E1",
        subtopicId: "S36-T2-B",
        kind: "apply",
        instruction:
          "axis auto name false.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(False)
print('ok', True)
print('prudent', True)`,
          output: `False
ok True
prudent True`,
        },
      },
      {
        id: "S36-T2-B-E2",
        subtopicId: "S36-T2-B",
        kind: "apply",
        instruction:
          "outlier may be scale.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('check_scale', True)
print('ok', True)
print('auto_label', False)`,
          output: `check_scale True
ok True
auto_label False`,
        },
      },
      {
        id: "S36-T2-B-E3",
        subtopicId: "S36-T2-B",
        kind: "apply",
        instruction:
          "doc exploratory.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('exploratory')
print('ok', True)
print('n', 1)`,
          output: `exploratory
ok True
n 1`,
        },
      },
      {
        id: "S36-T3-A-E1",
        subtopicId: "S36-T3-A",
        kind: "apply",
        instruction:
          "sigma flag count.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(1)
print('misconduct', False)
print('ok', True)`,
          output: `1
misconduct False
ok True`,
        },
      },
      {
        id: "S36-T3-A-E2",
        subtopicId: "S36-T3-A",
        kind: "apply",
        instruction:
          "combine rule+score.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(['rule','score'])
print('ok', True)
print('n', 2)`,
          output: `['rule', 'score']
ok True
n 2`,
        },
      },
      {
        id: "S36-T3-A-E3",
        subtopicId: "S36-T3-A",
        kind: "apply",
        instruction:
          "review candidate not guilt.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('guilt', False)
print('route', 'review')
print('ok', True)`,
          output: `guilt False
route review
ok True`,
        },
      },
      {
        id: "S36-T3-B-E1",
        subtopicId: "S36-T3-B",
        kind: "apply",
        instruction:
          "novelty vs outlier labels.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(['outlier','novelty'])
print('ok', True)
print('n', 2)`,
          output: `['outlier', 'novelty']
ok True
n 2`,
        },
      },
      {
        id: "S36-T3-B-E2",
        subtopicId: "S36-T3-B",
        kind: "apply",
        instruction:
          "contam 0.1 n=50 flags.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(5)
print('is_fraud_rate', False)
print('ok', True)`,
          output: `5
is_fraud_rate False
ok True`,
        },
      },
      {
        id: "S36-T3-B-E3",
        subtopicId: "S36-T3-B",
        kind: "apply",
        instruction:
          "tune to capacity.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('capacity_link', True)
print('ok', True)
print('n', 1)`,
          output: `capacity_link True
ok True
n 1`,
        },
      },
      {
        id: "S36-T4-A-E1",
        subtopicId: "S36-T4-A",
        kind: "apply",
        instruction:
          "mean of rates.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(0.15)
print('backtest', True)
print('ok', True)`,
          output: `0.15
backtest True
ok True`,
        },
      },
      {
        id: "S36-T4-A-E2",
        subtopicId: "S36-T4-A",
        kind: "apply",
        instruction:
          "no future in fit.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('leakage', False)
print('ok', True)
print('split', 'time')`,
          output: `leakage False
ok True
split time`,
        },
      },
      {
        id: "S36-T4-A-E3",
        subtopicId: "S36-T4-A",
        kind: "apply",
        instruction:
          "window list len.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(3)
print('ok', True)
print('temporal', True)`,
          output: `3
ok True
temporal True`,
        },
      },
      {
        id: "S36-T4-B-E1",
        subtopicId: "S36-T4-B",
        kind: "apply",
        instruction:
          "p@k 1,0,1 k=2.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(0.5)
print('k', 2)
print('auto_guilt', False)`,
          output: `0.5
k 2
auto_guilt False`,
        },
      },
      {
        id: "S36-T4-B-E2",
        subtopicId: "S36-T4-B",
        kind: "apply",
        instruction:
          "human review required.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print(True)
print('ok', True)
print('labels', 'scarce')`,
          output: `True
ok True
labels scarce`,
        },
      },
      {
        id: "S36-T4-B-E3",
        subtopicId: "S36-T4-B",
        kind: "apply",
        instruction:
          "utility metric name.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
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
          code: `print('precision_at_k')
print('ok', True)
print('n', 1)`,
          output: `precision_at_k
ok True
n 1`,
        },
      },
    ],
  },
  youDo: {
    title: "Señales auxiliares de rareza con backtest (CP-N3-C señales)",
    context:
      "Pipeline de clustering/anomalías evaluado por P@k y review; sin concluir conducta indebida. Id ai-apis-advanced conservado.",
    objectives: [
      "Scale+cluster",
      "PCA exploratoria",
      "Reglas/IF conceptual",
      "Backtest y P@k humano",
    ],
    requirements: [
      "Disclaimer anomalía≠culpa",
      "Backtest temporal",
      "es-PE sintético",
    ],
    starterCode: `# señales auxiliares
def sigma_flags(xs, z=3):
    import statistics
    mu=statistics.mean(xs); sd=statistics.pstdev(xs) or 1
    return [x > mu+z*sd for x in xs]
if __name__=='__main__':
    print(sigma_flags([1,1,1,10]))
`,
    portfolioNote:
      "Señales CP-N3-C; no PASS.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Anomalía no es veredicto de conducta", weight: "gate privacy" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Una anomalía en el triage significa:",
        options: [
          "Fraude probado",
          "Señal de rareza a revisar",
          "Parentesco",
          "Despido",
        ],
        correctIndex: 1,
        explanation:
          "Señal auxiliar.",
      },
      {
        question: "contamination representa:",
        options: [
          "Tasa de fraude real",
          "Hipótesis de fracción rara a flaggear",
          "Accuracy",
          "Kafka lag",
        ],
        correctIndex: 1,
        explanation:
          "No es fraude rate.",
      },
      {
        question: "PCA en este curso se usa para:",
        options: [
          "Etiquetar culpa",
          "Exploración/visualización prudente",
          "Reemplazar el workbench",
          "Borrar features",
        ],
        correctIndex: 1,
        explanation:
          "Exploratorio.",
      },
      {
        question: "Con labels escasos prioriza:",
        options: [
          "Solo accuracy global",
          "precision@k y feedback humano",
          "Aumentar contamination a 0.9",
          "Eliminar reglas",
        ],
        correctIndex: 1,
        explanation:
          "Utilidad de cola.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn outlier detection",
        url: "https://scikit-learn.org/stable/modules/outlier_detection.html",
        note: "IF/LOF",
      },
      {
        label: "sklearn clustering",
        url: "https://scikit-learn.org/stable/modules/clustering.html",
        note: "k-means",
      },
    ],
    books: [
      {
        label: "Anomaly detection surveys",
        note: "Novelty vs outlier",
      },
      {
        label: "ISLR PCA chapter",
        note: "Proyecciones",
      },
    ],
    courses: [
      {
        label: "sklearn PCA",
        url: "https://scikit-learn.org/stable/modules/decomposition.html",
        note: "API",
      },
    ],
  },
}
