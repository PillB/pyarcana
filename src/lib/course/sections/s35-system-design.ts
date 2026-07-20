import type { CourseSection } from '../../types'

export const section35: CourseSection = {
  id: "system-design",
  index: 35,
  title: "Explicabilidad, equidad e incertidumbre",
  shortTitle: "Explainability y equidad",
  tagline: "ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana",
  estimatedHours: 12,
  level: "Competente a experto",
  phase: 2,
  icon: "Scale",
  accentColor: "bg-gradient-to-br from-violet-400 to-purple-800",
  jobRelevance:
    "Inicias **CP-N3-C**: la ficha de caso separa **evidencia**, **modelo**, **incertidumbre** y **decisión humana**. Id `system-design` conservado. Explicar no es acusar de fraude.",
  learningOutcomes: [
    { text: "Explicar con coeficientes e importancia" },
    { text: "Delimitar explicación local y correlación" },
    { text: "Medir equidad por cohorte/slice" },
    { text: "Detectar proxies y daño diferencial" },
    { text: "Comunicar incertidumbre y conformal" },
    { text: "Abstener ante OOD" },
    { text: "Documentar model card y contestabilidad" },
    { text: "Operar aprobación, override y retiro" },
  ],
  theory: [
    {
      heading: "Inicio CP-N3-C: ficha de caso responsable",
      paragraphs: [
        "En V3, **S35** abre CP-N3-C. La ficha de caso no es un dump de SHAP: distingue capas.",
        "Legacy 'system design IA' se retematiza a explicabilidad, equidad e incertidumbre.",
        "Orden: **T1 Explicación** → **T2 Equidad** → **T3 Incertidumbre** → **T4 Gobernanza**.",
      ],
      callout: {
        type: "info",
        title: "Retarget V3",
        content:
          "Inicio CP-N3-C; sin section_passed.",
      },
    },
    {
      heading: "coeficientes e importancia por permutación",
      subtopicId: "S35-T1-A",
      paragraphs: [
        "Coeficientes (lineales) e importance por permutación (caída de métrica al barajar una feature).",
        "Importancia global no explica un caso; es mapa de sensibilidad del modelo.",
        "No traduzcas importance a 'prueba de fraude': es sensibilidad del modelo sobre datos sintéticos, **no** veredicto legal ni label automático de fraude/parentesco.",
      ],
      code: {
        language: 'python',
        title: "perm_imp.py",
        code: `# permutación conceptual: drop en accuracy
base = 0.80
drops = {"shared_phone": 0.10, "amount_7d": 0.03, "region": 0.01}
imp = sorted(drops, key=drops.get, reverse=True)
print("top_feature", imp[0])
print("drop", drops[imp[0]])
print("means_fraud", False)`,
        output: `top_feature shared_phone
drop 0.1
means_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Misma métrica",
        content:
          "Permuta y mide la métrica de negocio, no solo accuracy.",
      },
    },
    {
      heading: "explicación local, correlación y límites",
      subtopicId: "S35-T1-B",
      paragraphs: [
        "Local: contribución de features al score del caso (pesos × valores).",
        "Correlación ≠ contribución ≠ causa. Límites: dependencia de grafo, confusores.",
        "Plantilla: evidencia observada | aporte modelo | incertidumbre | decisión humana.",
      ],
      code: {
        language: 'python',
        title: "local_exp.py",
        code: `feats = {"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}
contrib = {k: v * w for k, (v, w) in feats.items()}
print("contrib", {k: round(v, 3) for k, v in contrib.items()})
print("sum", round(sum(contrib.values()), 3))
print("causal", False)`,
        output: `contrib {'shared_phone': 0.9, 'amount_z': 0.1}
sum 1.0
causal False`,
      },
      callout: {
        type: "warning",
        title: "Límites",
        content:
          "Di qué no puedes afirmar.",
      },
    },
    {
      heading: "cohortes y métricas por slice",
      subtopicId: "S35-T2-A",
      paragraphs: [
        "Corta por región, canal, tipo de enlace. Compara precision/recall/tasa de queue.",
        "n chico → intervalos anchos; no grites inequidad con n=3.",
        "Equidad aquí: daño diferencial en revisión, no 'paridad de fraude'.",
      ],
      code: {
        language: 'python',
        title: "slices.py",
        code: `slices = {
    "LIM": {"n": 100, "precision": 0.6},
    "AQP": {"n": 8, "precision": 0.9},
}
for s, m in slices.items():
    flag = "low_n" if m["n"] < 30 else "ok_n"
    print(s, m["precision"], flag)
print("compared", True)`,
        output: `LIM 0.6 ok_n
AQP 0.9 low_n
compared True`,
      },
      callout: {
        type: "tip",
        title: "n importa",
        content:
          "Reporta n por slice siempre.",
      },
    },
    {
      heading: "proxies, sample size y daño diferencial",
      subtopicId: "S35-T2-B",
      paragraphs: [
        "Proxies: variables que correlacionan con atributos sensibles. Revisa features de ubicación/canal.",
        "Daño: más falsos positivos en un grupo → más fricción injustificada.",
        "Mitiga: quitar proxy, recalibrar por grupo con cuidado, abstener, oversight humano.",
      ],
      code: {
        language: 'python',
        title: "proxies.py",
        code: `features = ["amount_7d", "district_code", "shared_phone"]
proxy_risk = {"amount_7d": "low", "district_code": "high", "shared_phone": "medium"}
print("high_proxy", [f for f in features if proxy_risk[f] == "high"])
print("action", "review_feature")
print("fraud_eq", False)`,
        output: `high_proxy ['district_code']
action review_feature
fraud_eq False`,
      },
      callout: {
        type: "danger",
        title: "Proxy silencioso",
        content:
          "district_code puede ser proxy; documéntalo en model card.",
      },
    },
    {
      heading: "calibración, intervalos/conformal conceptualmente",
      subtopicId: "S35-T3-A",
      paragraphs: [
        "Además de Brier: intervalos de predicción / conformal dan cobertura garantizada bajo i.i.d. (idealizado).",
        "Comunica: score 0.7 con banda o set de predicción, no certeza.",
        "Didáctica: residual quantiles como intervalo toy.",
      ],
      code: {
        language: 'python',
        title: "interval.py",
        code: `resid = [0.1, -0.2, 0.05, 0.15, -0.05]
q = sorted(abs(r) for r in resid)[int(0.8 * (len(resid) - 1))]
p = 0.7
print("interval", round(p - q, 3), round(p + q, 3))
print("level", "approx_80pct")
print("guarantee", "conceptual")`,
        output: `interval 0.55 0.85
level approx_80pct
guarantee conceptual`,
      },
      callout: {
        type: "info",
        title: "Conformal",
        content:
          "Idea de cobertura; no magia fuera de supuestos.",
      },
    },
    {
      heading: "out-of-distribution y abstención",
      subtopicId: "S35-T3-B",
      paragraphs: [
        "OOD: feature fuera de rango train, grafo inusual, canal nuevo. Abstén y escala a humano.",
        "Detector simple: max |z-score| > umbral.",
        "Mejor abstener que inventar certeza.",
      ],
      code: {
        language: 'python',
        title: "ood.py",
        code: `def ood(z, thr=3.0):
    return max(abs(x) for x in z) > thr
print("ood", ood([0.1, 0.2, 4.5]))
print("action", "abstain")
print("auto_fraud", False)`,
        output: `ood True
action abstain
auto_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Rutas",
        content:
          "OOD → abstain + log, no score inventado.",
      },
    },
    {
      heading: "model card y contestabilidad",
      subtopicId: "S35-T4-A",
      paragraphs: [
        "Model card: uso previsto, datos, métricas, límites, fairness slices, dueño.",
        "Contestabilidad: el afectado o revisor puede pedir revisión del score/proceso.",
        "Sin card, no hay promoción responsable en CP-N3-C.",
      ],
      code: {
        language: 'python',
        title: "model_card.py",
        code: `card = {
    "name": "review_ranker_v1",
    "intended_use": "priorizar cola de revisión sintética",
    "out_of_scope": "etiqueta de fraude o parentesco",
    "owner": "risk-ml-pe",
}
print(card["intended_use"])
print("out_of_scope", card["out_of_scope"])
print("contestability", True)`,
        output: `priorizar cola de revisión sintética
out_of_scope etiqueta de fraude o parentesco
contestability True`,
      },
      callout: {
        type: "warning",
        title: "Out of scope",
        content:
          "Declara lo que el modelo no puede hacer.",
      },
    },
    {
      heading: "aprobación, override, apelación y retiro",
      subtopicId: "S35-T4-B",
      paragraphs: [
        "Estados: proposed → approved → production → retired. Override humano siempre auditado.",
        "Apelación reabre caso. Retiro si drift o incidente.",
        "La ficha de caso muestra quién decidió qué.",
      ],
      code: {
        language: 'python',
        title: "governance.py",
        code: `states = ["proposed", "approved", "production", "retired"]
event = {"case": "c1", "model_score": 0.82, "human": "override_skip", "by": "analyst_7"}
print("lifecycle", " > ".join(states))
print("override", event["human"])
print("audit", True)`,
        output: `lifecycle proposed > approved > production > retired
override override_skip
audit True`,
      },
      callout: {
        type: "tip",
        title: "Audit log",
        content:
          "Sin by/timestamp no hay gobernanza.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro explicación, equidad, incertidumbre y gobernanza de la ficha de caso.",
    steps: [
      {
        demoId: "S35-T1-A-DEMO",
        subtopicId: "S35-T1-A",
        environment: "local-python",
        description: "Ranking de importance por drop.",
        code: {
          language: 'python',
          title: "imp_demo.py",
          code: `d={"f1":0.02,"f2":0.1}
print(max(d, key=d.get), d[max(d, key=d.get)])
print('fraud', False)
print('ok', True)`,
          output: `f2 0.1
fraud False
ok True`,
        },
        why: "Importancia global.",
      },
      {
        demoId: "S35-T1-B-DEMO",
        subtopicId: "S35-T1-B",
        environment: "local-python",
        description: "Contrib local suma.",
        code: {
          language: 'python',
          title: "loc_demo.py",
          code: `c={"a":0.2,"b":-0.1}
print(round(sum(c.values()),3))
print('causal', False)
print('ok', True)`,
          output: `0.1
causal False
ok True`,
        },
        why: "Local no causal.",
      },
      {
        demoId: "S35-T2-A-DEMO",
        subtopicId: "S35-T2-A",
        environment: "local-python",
        description: "Slice con low_n.",
        code: {
          language: 'python',
          title: "slice_demo.py",
          code: `n=5; print('flag', 'low_n' if n<30 else 'ok_n')
print('n', n)
print('ok', True)`,
          output: `flag low_n
n 5
ok True`,
        },
        why: "n por cohorte.",
      },
      {
        demoId: "S35-T2-B-DEMO",
        subtopicId: "S35-T2-B",
        environment: "local-python",
        description: "Lista proxies high.",
        code: {
          language: 'python',
          title: "proxy_demo.py",
          code: `print(['district_code'])
print('action', 'review')
print('ok', True)`,
          output: `['district_code']
action review
ok True`,
        },
        why: "Proxy risk.",
      },
      {
        demoId: "S35-T3-A-DEMO",
        subtopicId: "S35-T3-A",
        environment: "local-python",
        description: "Intervalo toy p±q.",
        code: {
          language: 'python',
          title: "int_demo.py",
          code: `p,q=0.6,0.1
print(round(p-q,2), round(p+q,2))
print('level', 'toy')
print('ok', True)`,
          output: `0.5 0.7
level toy
ok True`,
        },
        why: "Incertidumbre.",
      },
      {
        demoId: "S35-T3-B-DEMO",
        subtopicId: "S35-T3-B",
        environment: "local-python",
        description: "OOD z-score.",
        code: {
          language: 'python',
          title: "ood_demo.py",
          code: `print(max(abs(x) for x in [1,2,3.5])>3)
print('action', 'abstain')
print('ok', True)`,
          output: `True
action abstain
ok True`,
        },
        why: "Abstain OOD.",
      },
      {
        demoId: "S35-T4-A-DEMO",
        subtopicId: "S35-T4-A",
        environment: "local-python",
        description: "Model card out_of_scope.",
        code: {
          language: 'python',
          title: "card_demo.py",
          code: `print('out_of_scope', 'fraud_label')
print('use', 'queue_rank')
print('card', True)`,
          output: `out_of_scope fraud_label
use queue_rank
card True`,
        },
        why: "Card mínima.",
      },
      {
        demoId: "S35-T4-B-DEMO",
        subtopicId: "S35-T4-B",
        environment: "local-python",
        description: "Override audit fields.",
        code: {
          language: 'python',
          title: "gov_demo.py",
          code: `print({'case':'c1','human':'override','by':'u1'})
print('audit', True)
print('ok', True)`,
          output: `{'case': 'c1', 'human': 'override', 'by': 'u1'}
audit True
ok True`,
        },
        why: "Gobernanza.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de importance, local, slices, proxies, intervalos, OOD, cards y overrides.",
    steps: [
      {
        id: "S35-T1-A-E1",
        subtopicId: "S35-T1-A",
        kind: "apply",
        instruction:
          "Top feature por drop dict.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `d={'a':0.01,'b':0.2}
print(max(d,key=d.get))
print(d['b'])
print('fraud', False)`,
          output: `b
0.2
fraud False`,
        },
      },
      {
        id: "S35-T1-A-E2",
        subtopicId: "S35-T1-A",
        kind: "apply",
        instruction:
          "Orden features por importance desc.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `d={'x':0.1,'y':0.3}
print(sorted(d,key=d.get,reverse=True))
print('n', 2)
print('ok', True)`,
          output: `['y', 'x']
n 2
ok True`,
        },
      },
      {
        id: "S35-T1-A-E3",
        subtopicId: "S35-T1-A",
        kind: "apply",
        instruction:
          "Perm importance no implica causa.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('causal', False)
print('type', 'global')
print('ok', True)`,
          output: `causal False
type global
ok True`,
        },
      },
      {
        id: "S35-T1-B-E1",
        subtopicId: "S35-T1-B",
        kind: "apply",
        instruction:
          "contrib = value*weight.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(round(2*0.3,2))
print('feature', 'f')
print('causal', False)`,
          output: `0.6
feature f
causal False`,
        },
      },
      {
        id: "S35-T1-B-E2",
        subtopicId: "S35-T1-B",
        kind: "apply",
        instruction:
          "Plantilla 4 capas flags.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(['evidence','model','uncertainty','human'])
print('n', 4)
print('ok', True)`,
          output: `['evidence', 'model', 'uncertainty', 'human']
n 4
ok True`,
        },
      },
      {
        id: "S35-T1-B-E3",
        subtopicId: "S35-T1-B",
        kind: "apply",
        instruction:
          "Límite: correlación no basta.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('corr_is_cause', False)
print('ok', True)
print('note', 'limits')`,
          output: `corr_is_cause False
ok True
note limits`,
        },
      },
      {
        id: "S35-T2-A-E1",
        subtopicId: "S35-T2-A",
        kind: "apply",
        instruction:
          "Flag low_n si n<30.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `n=12
print('low_n' if n<30 else 'ok_n')
print('n', n)
print('ok', True)`,
          output: `low_n
n 12
ok True`,
        },
      },
      {
        id: "S35-T2-A-E2",
        subtopicId: "S35-T2-A",
        kind: "apply",
        instruction:
          "Delta precision LIM-AQP.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(round(0.6-0.5,2))
print('slice', 'LIM-AQP')
print('ok', True)`,
          output: `0.1
slice LIM-AQP
ok True`,
        },
      },
      {
        id: "S35-T2-A-E3",
        subtopicId: "S35-T2-A",
        kind: "apply",
        instruction:
          "Reporta n junto a metric.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print({'n':40,'precision':0.7})
print('ok', True)
print('required', 'n')`,
          output: `{'n': 40, 'precision': 0.7}
ok True
required n`,
        },
      },
      {
        id: "S35-T2-B-E1",
        subtopicId: "S35-T2-B",
        kind: "apply",
        instruction:
          "Clasifica proxy risk high list.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(['zip_code'])
print('n', 1)
print('ok', True)`,
          output: `['zip_code']
n 1
ok True`,
        },
      },
      {
        id: "S35-T2-B-E2",
        subtopicId: "S35-T2-B",
        kind: "apply",
        instruction:
          "FP rate group A vs B daño.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('harm', 0.2>0.05)
print('fp_A', 0.2)
print('fp_B', 0.05)`,
          output: `harm True
fp_A 0.2
fp_B 0.05`,
        },
      },
      {
        id: "S35-T2-B-E3",
        subtopicId: "S35-T2-B",
        kind: "apply",
        instruction:
          "Acción mitiga proxy.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('action', 'remove_or_constrain')
print('ok', True)
print('fraud_eq', False)`,
          output: `action remove_or_constrain
ok True
fraud_eq False`,
        },
      },
      {
        id: "S35-T3-A-E1",
        subtopicId: "S35-T3-A",
        kind: "apply",
        instruction:
          "p=0.5 q=0.1 interval.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(0.4, 0.6)
print('p', 0.5)
print('ok', True)`,
          output: `0.4 0.6
p 0.5
ok True`,
        },
      },
      {
        id: "S35-T3-A-E2",
        subtopicId: "S35-T3-A",
        kind: "apply",
        instruction:
          "Cobertura conceptual label.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('coverage', 'approx')
print('not_proof', True)
print('ok', True)`,
          output: `coverage approx
not_proof True
ok True`,
        },
      },
      {
        id: "S35-T3-A-E3",
        subtopicId: "S35-T3-A",
        kind: "apply",
        instruction:
          "Brier vs interval complementary.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('both', True)
print('ok', True)
print('n', 2)`,
          output: `both True
ok True
n 2`,
        },
      },
      {
        id: "S35-T3-B-E1",
        subtopicId: "S35-T3-B",
        kind: "apply",
        instruction:
          "ood if any |z|>3.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `z=[0,1,3.1]
print(max(abs(x) for x in z)>3)
print('action', 'abstain')
print('ok', True)`,
          output: `True
action abstain
ok True`,
        },
      },
      {
        id: "S35-T3-B-E2",
        subtopicId: "S35-T3-B",
        kind: "apply",
        instruction:
          "Canal nuevo → ood policy.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('ood', True)
print('channel', 'new')
print('ok', True)`,
          output: `ood True
channel new
ok True`,
        },
      },
      {
        id: "S35-T3-B-E3",
        subtopicId: "S35-T3-B",
        kind: "apply",
        instruction:
          "No auto fraud on ood.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('auto_fraud', False)
print('route', 'human')
print('ok', True)`,
          output: `auto_fraud False
route human
ok True`,
        },
      },
      {
        id: "S35-T4-A-E1",
        subtopicId: "S35-T4-A",
        kind: "apply",
        instruction:
          "Keys mínimas model card.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(sorted(['name','intended_use','out_of_scope','owner']))
print('n', 4)
print('ok', True)`,
          output: `['intended_use', 'name', 'out_of_scope', 'owner']
n 4
ok True`,
        },
      },
      {
        id: "S35-T4-A-E2",
        subtopicId: "S35-T4-A",
        kind: "apply",
        instruction:
          "out_of_scope fraud.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('out_of_scope', 'fraud_parentesco')
print('ok', True)
print('card', True)`,
          output: `out_of_scope fraud_parentesco
ok True
card True`,
        },
      },
      {
        id: "S35-T4-A-E3",
        subtopicId: "S35-T4-A",
        kind: "apply",
        instruction:
          "contestability True.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('contestability', True)
print('channel', 'appeal')
print('ok', True)`,
          output: `contestability True
channel appeal
ok True`,
        },
      },
      {
        id: "S35-T4-B-E1",
        subtopicId: "S35-T4-B",
        kind: "apply",
        instruction:
          "Estado siguiente de approved.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('production')
print('from', 'approved')
print('ok', True)`,
          output: `production
from approved
ok True`,
        },
      },
      {
        id: "S35-T4-B-E2",
        subtopicId: "S35-T4-B",
        kind: "apply",
        instruction:
          "Override log fields.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print(['case','human_decision','by','ts'])
print('n', 4)
print('ok', True)`,
          output: `['case', 'human_decision', 'by', 'ts']
n 4
ok True`,
        },
      },
      {
        id: "S35-T4-B-E3",
        subtopicId: "S35-T4-B",
        kind: "apply",
        instruction:
          "Retiro por drift flag.",
        hint: "Revisa teoría.",
        hints: [
          "Revisa teoría.",
          "3 prints.",
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
          code: `print('retire', True)
print('reason', 'drift')
print('ok', True)`,
          output: `retire True
reason drift
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Ficha de caso: evidencia | modelo | incertidumbre | humano (CP-N3-C inicio)",
    context:
      "Arma plantilla de ficha de caso con explicación local, slices, OOD abstain y model card. Id system-design conservado.",
    objectives: [
      "Importancia y explicación local con límites",
      "Slices y proxies",
      "Incertidumbre/OOD",
      "Card y override audit",
    ],
    requirements: [
      "4 capas en ficha",
      "Sin acusación de fraude",
      "es-PE sintético",
    ],
    starterCode: `# ficha de caso
case = {"evidence": [], "model": {}, "uncertainty": {}, "human": {}}
# TODO
if __name__ == '__main__':
    print(case.keys())
`,
    portfolioNote:
      "Inicio CP-N3-C; no PASS automático.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Ficha 4 capas + out_of_scope", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "La ficha de caso debe separar:",
        options: [
          "Solo score",
          "Evidencia, modelo, incertidumbre y decisión humana",
          "Solo SHAP global",
          "Solo UI",
        ],
        correctIndex: 1,
        explanation:
          "4 capas.",
      },
      {
        question: "Perm importance prueba:",
        options: [
          "Fraude",
          "Sensibilidad del modelo a barajar features",
          "Parentesco",
          "Causalidad legal",
        ],
        correctIndex: 1,
        explanation:
          "No causa.",
      },
      {
        question: "Ante OOD conviene:",
        options: [
          "Forzar pred 1",
          "Abstener y escalar",
          "Borrar logs",
          "Ignorar",
        ],
        correctIndex: 1,
        explanation:
          "Abstención.",
      },
      {
        question: "Model card out_of_scope incluye:",
        options: [
          "Nada",
          "Usos prohibidos p.ej. etiqueta de fraude",
          "Solo accuracy",
          "Solo owner email personal",
        ],
        correctIndex: 1,
        explanation:
          "Límites de uso.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Model Cards (Mitchell et al.)",
        url: "https://arxiv.org/abs/1810.03993",
        note: "Plantilla",
      },
      {
        label: "sklearn inspection",
        url: "https://scikit-learn.org/stable/inspection.html",
        note: "Permutation importance",
      },
    ],
    books: [
      {
        label: "Interpretable Machine Learning (Molnar)",
        note: "Límites de explicación",
      },
      {
        label: "Fairness concepts",
        note: "Slices y daño",
      },
    ],
    courses: [
      {
        label: "Responsible AI practices",
        url: "https://www.tensorflow.org/responsible_ai",
        note: "Referencia amplia",
      },
    ],
  },
}
