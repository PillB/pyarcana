import type { CourseSection } from '../../types'

export const section36: CourseSection = {
  id: "ai-apis-advanced",
  index: 36,
  title: "Clustering, anomalías y validación temporal",
  shortTitle: "Clustering y anomalías",
  tagline: "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
  estimatedHours: 19,
  level: "Competente a experto",
  phase: 2,
  icon: "ScanSearch",
  accentColor: "bg-gradient-to-br from-indigo-400 to-violet-900",
  jobRelevance:
    "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares** de cola de review. En banca de procesos, fintech y retail, un flag de rareza mal comunicado se convierte en daño. Id `ai-apis-advanced` conservado. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036.",
  learningOutcomes: [
    { text: "Aplicar clustering con escalamiento previo de features" },
    { text: "Elegir k con estabilidad multi-seed y reportar límites de métricas internas" },
    { text: "Proyectar con PCA (o pesos toy) solo para exploración visual" },
    { text: "Interpretar proyecciones con prudencia y sin auto-etiquetar culpa" },
    { text: "Detectar rareza con reglas σ e ideas IF/LOF sin veredicto de conducta" },
    { text: "Distinguir novelty vs outlier y calibrar contamination a capacidad de review" },
    { text: "Validar con backtests temporales y ventanas sin leakage" },
    { text: "Evaluar con labels escasos vía precision@k y revisión humana obligatoria" },
  ],
  theory: [
    {
      heading: "Señales no supervisadas para triage (CP-N3-C)",
      paragraphs: [
        "Clustering y detección de anomalías alimentan el triage como **señales auxiliares**, no como veredictos de conducta. Se evalúan por utilidad de revisión (¿ahorra tiempo al humano?) y nunca se traducen solas en fraude, parentesco o sanción. El lenguaje fail-closed protege a las personas detrás de los registros sintéticos del laboratorio.",
        "Contrato operativo de la sección. Entrada: features sintéticas `CASO-LIM-036`, capacidad de cola de review y labels escasos. Salida: clusters/scores de rareza con disclaimer, backtest temporal y precision@k. Error: tratar anomalía como culpa, contamination como tasa de fraude, o fit con leakage de futuro bloquea el gate de señales.",
        "Caso Red Andina (ficticio): montos y frecuencias inventadas de Lima. El id `ai-apis-advanced` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels escasos.",
      ],
      callout: {
        type: "info",
        title: "Retarget y ética",
        content:
          "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática.",
      },
    },
    {
      heading: "escalamiento y k-means/density",
      subtopicId: "S36-T1-A",
      paragraphs: [
        "Antes de k-means, escala features: sin scale, gana la magnitud (soles vs conteos). Density-based methods (conceptual) buscan regiones densas; aquí usamos un toy 1D de centroides. Los centroides son resúmenes geométricos, no etiquetas morales ni de fraude.",
        "Contrato operativo. Entrada: vector de features sintéticas y decisión de escalado. Salida: centroides y flags scaled=True, verdict=False. Error: clusterizar montos crudos contra conteos sin normalizar, o publicar el cluster como veredicto. Criterio: el pipeline documenta scale-first y prohíbe usar el id de cluster como sanción.",
        "Aplicación a `CASO-LIM-036-T1A`: xs=[1.0,1.2,5.0,5.2,5.1] → c1≈1.1, c2≈5.1. Dos grupos de «bajo/alto» sintético del laboratorio; scaled True; verdict False siempre. Útil para segmentar la cola de review, nunca para culpar ni inferir parentesco o fraude a partir del centroide.",
      ],
      code: {
        language: 'python',
        title: "kmeans1d.py",
        code: `xs = [1.0, 1.2, 5.0, 5.2, 5.1]
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
          "Sin scale, gana la feature con mayor magnitud. Escala y documenta; el centroide no es una etiqueta moral.",
      },
    },
    {
      heading: "elección, estabilidad y métricas limitadas",
      subtopicId: "S36-T1-B",
      paragraphs: [
        "Elige k con estabilidad multi-seed y sentido de negocio (capacidad de cola), no solo maximizando silhouette. Las métricas internas fallan con formas raras, solapamiento y desbalance. Reporta sensibilidad a seed en el notebook de señales del triage sintético.",
        "Contrato operativo. Entrada: mapa k→score interno sintético. Salida: k elegido, score y stable_check=multi_seed. Error: k que fragmenta de más la cola o que no se sostiene entre seeds. Criterio: silhouette alto no legitima sanción; la decisión de k se documenta con límites explícitos de la métrica interna.",
        "Aplicación a `CASO-LIM-036-T1B`: scores {2:0.4, 3:0.55, 4:0.52} → k=3 con score 0.55. Se exige multi_seed en el checklist del PR de señales. Datos inventados del laboratorio; no existen labels de «culpable» ni de parentesco en este fixture.",
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
          "Silhouette alto no legitima sanción. Las métricas internas tienen límites; reporta estabilidad y sentido de cola.",
      },
    },
    {
      heading: "PCA y visualización",
      subtopicId: "S36-T2-A",
      paragraphs: [
        "PCA proyecta a 1–2D para explorar; no es el modelo de decisión final del triage. La varianza explicada informa compresión, no causalidad. Didáctica: proyección manual por pesos fijos sobre features sintéticas del caso Red Andina ficticio.",
        "Contrato operativo. Entrada: puntos y pesos de proyección. Salida: coordenadas pc y decision_model=False. Error: clasificar culpa en el scatter o tratar el eje como «eje de fraude». Criterio: el artefacto se etiqueta exploratory y no alimenta un auto-rechazo ni una sanción automática.",
        "Aplicación a `CASO-LIM-036-T2A`: w=(0.8,0.2) sobre puntos toy → lista pc; var_idea weighted; decision_model False. Solo exploración visual del space de features sintéticas; el revisor humano sigue mandando en la cola de triage.",
      ],
      code: {
        language: 'python',
        title: "pca_toy.py",
        code: `w = (0.8, 0.2)
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
          "No clasifiques culpa en el scatter. PCA es lupa, no juez.",
      },
    },
    {
      heading: "interpretación prudente de proyecciones",
      subtopicId: "S36-T2-B",
      paragraphs: [
        "Los ejes PC no traen nombre de negocio automático: no inventes «PC2 = riesgo moral». Un outlier visual puede ser escala mal hecha o un error de datos, no un villano. Documenta el uso como exploratorio en el dossier de señales del pipeline sintético.",
        "Contrato operativo. Entrada: proyección y checklist de interpretación. Salida: axis_named_by_business=False, use=exploratory, auto_label=False. Error: auto-etiquetar clusters en el plot como «sospechosos». Criterio: cualquier historia de negocio sobre un eje se valida con features originales y un humano revisor.",
        "Aplicación a `CASO-LIM-036-T2B`: flags de prudencia en el reporte de laboratorio. Si un punto se aleja en el scatter, primero revisa scale y missingness sintéticos antes de encolar review; nunca auto-label de conducta indebida.",
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
          "No inventes historias en PC2. Sin evidencia en features originales, no hay narrativa de negocio.",
      },
    },
    {
      heading: "Isolation Forest/LOF y reglas",
      subtopicId: "S36-T3-A",
      paragraphs: [
        "Isolation Forest y LOF (conceptual) generan scores de rareza; las reglas legibles (monto > μ+3σ) ayudan al revisor a entender el flag. Score alto ⇒ candidato a review, no culpa. Combina modelo y regla cuando puedas explicar el caso sintético en una frase clara.",
        "Contrato operativo. Entrada: serie sintética de montos. Salida: flags binarios, method y misconduct=False. Error: pipe del flag a un despido o bloqueo automático. Criterio: todo flag de rareza conserva ruta humana y disclaimer explícito de no-conducta en el workbench de triage.",
        "Aplicación a `CASO-LIM-036-T3A`: xs=[10,11,10,12,50]; μ sobre los «normales» del lab → flag en 50. method rule_sigma; misconduct False. El valor 50 es raro respecto al resto, no «culpable» ni prueba de fraude o parentesco.",
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
          "Explica al humano con regla cuando puedas. El score solo no es narrativa suficiente para la cola.",
      },
    },
    {
      heading: "novelty vs outlier y contamination",
      subtopicId: "S36-T3-B",
      paragraphs: [
        "Outlier: punto raro respecto al train. Novelty: punto nuevo comparado con un modelo de normalidad ya fijado. contamination es una hipótesis de fracción a flaggear, no la prevalencia de fraude del negocio. Ajústala a la capacidad real de la cola de review sintética del lab.",
        "Contrato operativo. Entrada: contamination y n del batch sintético. Salida: expected_flags e is_fraud_rate=False. Error: vender contamination=0.05 como «5% de fraude». Criterio: expected_flags ≤ capacidad de review; si no, bajas contamination o priorizas con otra señal auxiliar documentada.",
        "Aplicación a `CASO-LIM-036-T3B`: contamination=0.05, n=200 → expected_flags=10. use=capacity_tuning. Sin afirmar tasas reales de ilícitos ni parentesco; solo control de rareza y de carga de la cola de analistas del caso ficticio.",
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
          "Solo control de rareza y de carga de cola. Nunca lo presentes como tasa de fraude real.",
      },
    },
    {
      heading: "splits/backtests y ventanas",
      subtopicId: "S36-T4-A",
      paragraphs: [
        "Valida señales con backtest temporal: fit de normalidad en el pasado, score en el futuro. Ventanas deslizantes miden estabilidad de la flag rate. Sin labels densos, usa un proxy de utilidad (click de review sintético), nunca leakage de datos futuros en el fit del modelo de normalidad.",
        "Contrato operativo. Entrada: ventanas (mes, flag_rate). Salida: mean_flag_rate, backtest=True, leakage=False. Error: entrenar con todo el histórico incluyendo el mes evaluado. Criterio: el split es temporal y se documenta; un spike de flags se investiga antes de ampliar la cola de review.",
        "Aplicación a `CASO-LIM-036-T4A`: rates 0.1, 0.12, 0.09 → mean≈0.103. backtest True, leakage False. Solo series sintéticas de laboratorio Red Andina; el reloj del caso manda sobre cualquier shuffle aleatorio.",
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
          "No mezcles futuro en el fit de normalidad. El reloj del caso sintético manda en el split.",
      },
    },
    {
      heading: "labels escasos, precision@k y revisión humana",
      subtopicId: "S36-T4-B",
      paragraphs: [
        "Con pocas etiquetas, precision@k y el acuerdo humano importan más que un ROC fantasma. El revisor valida si la señal ahorra tiempo en la cola. Nunca: anomalía → conducta indebida automática. El HITL es parte del contrato operativo, no un adorno del dashboard.",
        "Contrato operativo. Entrada: ranking binario de utilidad sintética y k. Salida: precision_at_k, human_in_loop=True, auto_guilt=False. Error: optimizar solo accuracy global con labels ralos. Criterio: se reporta P@k y se mantiene la ruta humana obligatoria para acciones que afectan personas detrás de los ids sintéticos.",
        "Aplicación a `CASO-LIM-036-T4B`: ranked=[1,0,1,0,0], k=3 → P@k≈0.67. human_in_loop True; auto_guilt False. La métrica de negocio del lab es «¿ayudó a la cola sintética de review?», no un veredicto moral sobre el titular del registro.",
      ],
      code: {
        language: 'python',
        title: "scarce.py",
        code: `ranked = [1, 0, 1, 0, 0]
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
          "Métrica: ¿ayudó a la cola? precision@k + feedback humano > ROC inventado con labels escasos.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de clustering, PCA prudente, anomalías y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético).",
    steps: [
      {
        demoId: "S36-T1-A-DEMO",
        subtopicId: "S36-T1-A",
        environment: "local-python",
        description: "Demo: centroides 1D de dos grupos sintéticos.",
        code: {
          language: 'python',
          title: "s36_t1_a_demo.py",
          code: `print('c1', 1.0)
print('c2', 5.0)
print('scaled', True)`,
          output: `c1 1.0
c2 5.0
scaled True`,
        },
        why: "Centroides toy con scale-first; no hay veredicto de conducta.",
      },
      {
        demoId: "S36-T1-B-DEMO",
        subtopicId: "S36-T1-B",
        environment: "local-python",
        description: "Demo: elegir k por score interno.",
        code: {
          language: 'python',
          title: "s36_t1_b_demo.py",
          code: `s={2:0.3,3:0.5}; print('k', max(s,key=s.get))
print('score', 0.5)
print('ok', True)`,
          output: `k 3
score 0.5
ok True`,
        },
        why: "Argmax de score + recordatorio de multi-seed en teoría.",
      },
      {
        demoId: "S36-T2-A-DEMO",
        subtopicId: "S36-T2-A",
        environment: "local-python",
        description: "Demo: proyección ponderada exploratoria.",
        code: {
          language: 'python',
          title: "s36_t2_a_demo.py",
          code: `print(round(0.8*2+0.2*4,2))
print('exploratory', True)
print('ok', True)`,
          output: `2.4
exploratory True
ok True`,
        },
        why: "PCA toy como lupa; decision_model fuera del demo.",
      },
      {
        demoId: "S36-T2-B-DEMO",
        subtopicId: "S36-T2-B",
        environment: "local-python",
        description: "Demo: límites de interpretación de ejes.",
        code: {
          language: 'python',
          title: "s36_t2_b_demo.py",
          code: `print('business_axis', False)
print('use', 'explore')
print('ok', True)`,
          output: `business_axis False
use explore
ok True`,
        },
        why: "Prohíbe auto-nombrar ejes y auto-etiquetar culpa.",
      },
      {
        demoId: "S36-T3-A-DEMO",
        subtopicId: "S36-T3-A",
        environment: "local-python",
        description: "Demo: flags de regla sigma sintéticos.",
        code: {
          language: 'python',
          title: "s36_t3_a_demo.py",
          code: `print('flags', [0,0,1])
print('misconduct', False)
print('ok', True)`,
          output: `flags [0, 0, 1]
misconduct False
ok True`,
        },
        why: "Rareza encola review; misconduct False es política.",
      },
      {
        demoId: "S36-T3-B-DEMO",
        subtopicId: "S36-T3-B",
        environment: "local-python",
        description: "Demo: expected flags por contamination.",
        code: {
          language: 'python',
          title: "s36_t3_b_demo.py",
          code: `print(int(100*0.05))
print('is_fraud_rate', False)
print('ok', True)`,
          output: `5
is_fraud_rate False
ok True`,
        },
        why: "contamination calibra carga; no es tasa de fraude.",
      },
      {
        demoId: "S36-T4-A-DEMO",
        subtopicId: "S36-T4-A",
        environment: "local-python",
        description: "Demo: media de flag rates en backtest.",
        code: {
          language: 'python',
          title: "s36_t4_a_demo.py",
          code: `print(round((0.1+0.2)/2,2))
print('backtest', True)
print('ok', True)`,
          output: `0.15
backtest True
ok True`,
        },
        why: "Backtest temporal con leakage=False en el contrato de teoría.",
      },
      {
        demoId: "S36-T4-B-DEMO",
        subtopicId: "S36-T4-B",
        environment: "local-python",
        description: "Demo: precision@k y veto de auto_guilt.",
        code: {
          language: 'python',
          title: "s36_t4_b_demo.py",
          code: `print(0.5)
print('human', True)
print('auto_guilt', False)`,
          output: `0.5
human True
auto_guilt False`,
        },
        why: "P@k + HITL miden utilidad de cola con labels escasos.",
      },
    ],
  },
  weDo: {
    intro: "S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo o el flag ético, E2 fija la política válida y E3 transfiere el criterio fail-closed. Fixtures CASO-LIM-036; sin PII real; anomalía ≠ culpa.",
    steps: [
      {
        id: "S36-T1-A-E1",
        subtopicId: "S36-T1-A",
        kind: "guided",
        instruction: "S36-T1-A-E1 · Centroide 1D: media de [1,2] = 1.5. Imprime 1.5, n 2, ok True. Starter imprime sum sin dividir (defect=3). Fixture de clustering sintético CASO-LIM-036-1A; no es veredicto de conducta.",
        hint: "Centroide 1D = media del grupo.",
        hints: ["Centroide 1D = media del grupo.", "No uses la suma cruda como centroide."],
        edgeCases: ["grupo vacío", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-A-E1; fixture sintético.",
        feedback: "S36-T1-A-E1: el centroide resume; no etiqueta culpa.",
        starterCode: {
          language: 'python',
          title: "s36-t1-a-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
xs = [1, 2]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(sum(xs)/len(xs))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-a-e1.py",
          code: `xs = [1, 2]
print(sum(xs)/len(xs))
print("n", len(xs))
print("ok", True)
`,
          output: `1.5
n 2
ok True`,
        },
      },
      {
        id: "S36-T1-A-E2",
        subtopicId: "S36-T1-A",
        kind: "independent",
        instruction: "S36-T1-A-E2 · Scale z-score: (x-mu)/sd con mu=0, sd=2, x=4 → 2.0. Imprime 2.0, sd 2, ok True. Starter olvida dividir por sd (defect=4). Escala antes de k-means en el path sintético.",
        hint: "z = (x-mu)/sd.",
        hints: ["z = (x-mu)/sd.", "Sin scale, gana la magnitud."],
        edgeCases: ["sd=0", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-A-E2; fixture sintético.",
        feedback: "S36-T1-A-E2: scale-first es parte del contrato de clustering.",
        starterCode: {
          language: 'python',
          title: "s36-t1-a-e2.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
x, mu, sd = 4, 0, 2
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print((x - mu) / sd)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-a-e2.py",
          code: `x, mu, sd = 4, 0, 2
print((x - mu) / sd)
print("sd", sd)
print("ok", True)
`,
          output: `2.0
sd 2
ok True`,
        },
      },
      {
        id: "S36-T1-A-E3",
        subtopicId: "S36-T1-A",
        kind: "transfer",
        instruction: "S36-T1-A-E3 · Cluster no es veredicto: imprime verdict False, ok True, task 'cluster'. Starter verdict True (defect: convierte segmento en culpa). Transferencia ética del triage CP-N3-C señales.",
        hint: "Centroides no son sanciones.",
        hints: ["Centroides no son sanciones.", "verdict False es fail-closed de conducta."],
        edgeCases: ["auto-sanción", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-A-E3; fixture sintético.",
        feedback: "S36-T1-A-E3: segmentar ≠ condenar.",
        starterCode: {
          language: 'python',
          title: "s36-t1-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("verdict", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-a-e3.py",
          code: `print("verdict", False)
print("ok", True)
print("task", "cluster")
`,
          output: `verdict False
ok True
task cluster`,
        },
      },
      {
        id: "S36-T1-B-E1",
        subtopicId: "S36-T1-B",
        kind: "guided",
        instruction: "S36-T1-B-E1 · Elige k con score máximo: scores {2:0.2,3:0.9,4:0.5} → k=3 y score 0.9. Imprime 3, score 0.9, ok True. Starter elige min (defect). Fixture sintético multi-k CASO-LIM-036.",
        hint: "max por score interno del lab.",
        hints: ["max por score interno del lab.", "Luego valida estabilidad multi-seed."],
        edgeCases: ["empate de scores", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-B-E1; fixture sintético.",
        feedback: "S36-T1-B-E1: el argmax es el primer filtro, no la verdad final.",
        starterCode: {
          language: 'python',
          title: "s36-t1-b-e1.py",
          code: `scores = {2: 0.2, 3: 0.9, 4: 0.5}
best = min(scores, key=scores.get)  # TODO max
print(best)
print("score", scores[best])
print("ok", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-b-e1.py",
          code: `scores = {2: 0.2, 3: 0.9, 4: 0.5}
best = max(scores, key=scores.get)
print(best)
print("score", scores[best])
print("ok", True)
`,
          output: `3
score 0.9
ok True`,
        },
      },
      {
        id: "S36-T1-B-E2",
        subtopicId: "S36-T1-B",
        kind: "independent",
        instruction: "S36-T1-B-E2 · Estabilidad multi-seed: imprime seeds [0,1,2], ok True, stable 'check'. Starter seeds [0] (defect). Contrato de sensibilidad a seed en CASO-LIM-036.",
        hint: "Varias seeds antes de fijar k.",
        hints: ["Varias seeds antes de fijar k.", "stable check documenta el rito."],
        edgeCases: ["k inestable", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-B-E2; fixture sintético.",
        feedback: "S36-T1-B-E2: multi-seed evita k de un solo luck.",
        starterCode: {
          language: 'python',
          title: "s36-t1-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("seeds", [0, 1, 2])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-b-e2.py",
          code: `print("seeds", [0, 1, 2])
print("ok", True)
print("stable", "check")
`,
          output: `seeds [0, 1, 2]
ok True
stable check`,
        },
      },
      {
        id: "S36-T1-B-E3",
        subtopicId: "S36-T1-B",
        kind: "transfer",
        instruction: "S36-T1-B-E3 · Límite de métricas internas: imprime limit True, ok True, n 1. Starter limit False (defect: confía ciegamente en silhouette). Transferencia de humildad métrica del path de señales.",
        hint: "Métricas internas fallan con formas raras.",
        hints: ["Métricas internas fallan con formas raras.", "limit True = reporta el caveat."],
        edgeCases: ["desbalance", "sintético"],
        tests: "Salida alinea con solution output de S36-T1-B-E3; fixture sintético.",
        feedback: "S36-T1-B-E3: silhouette no es veredicto de negocio.",
        starterCode: {
          language: 'python',
          title: "s36-t1-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("limit", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t1-b-e3.py",
          code: `print("limit", True)
print("ok", True)
print("n", 1)
`,
          output: `limit True
ok True
n 1`,
        },
      },
      {
        id: "S36-T2-A-E1",
        subtopicId: "S36-T2-A",
        kind: "guided",
        instruction: "S36-T2-A-E1 · Proyección toy: 0.5*2 + 0.5*4 = 3.0. Imprime 3.0, ok True, pca True. Starter suma pesos mal (defect). Exploración sintética CASO-LIM-036, no modelo de decisión final.",
        hint: "pc = w0*x + w1*y.",
        hints: ["pc = w0*x + w1*y.", "Solo exploración visual."],
        edgeCases: ["pesos sin normalizar", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-A-E1; fixture sintético.",
        feedback: "S36-T2-A-E1: la proyección es lupa, no juez.",
        starterCode: {
          language: 'python',
          title: "s36-t2-a-e1.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(round(0.5*2 + 0.5*4, 1))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-a-e1.py",
          code: `print(round(0.5*2 + 0.5*4, 1))
print("ok", True)
print("pca", True)
`,
          output: `3.0
ok True
pca True`,
        },
      },
      {
        id: "S36-T2-A-E2",
        subtopicId: "S36-T2-A",
        kind: "independent",
        instruction: "S36-T2-A-E2 · PCA no es decision model: imprime decision_model False, ok True, use 'viz'. Starter True (defect). Contrato del dossier de señales CASO-LIM-036.",
        hint: "Prohibido auto-decidir con PC.",
        hints: ["Prohibido auto-decidir con PC.", "use viz nombra el rol."],
        edgeCases: ["scatter-as-judge", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-A-E2; fixture sintético.",
        feedback: "S36-T2-A-E2: decisión de negocio no vive en el eje PC.",
        starterCode: {
          language: 'python',
          title: "s36-t2-a-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("decision_model", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-a-e2.py",
          code: `print("decision_model", False)
print("ok", True)
print("use", "viz")
`,
          output: `decision_model False
ok True
use viz`,
        },
      },
      {
        id: "S36-T2-A-E3",
        subtopicId: "S36-T2-A",
        kind: "transfer",
        instruction: "S36-T2-A-E3 · Componentes para explorar en 2D: imprime 2, ok True, explore True. Starter 10 (defect: sobre-proyecta sin plan). Transferencia de n_components del lab sintético.",
        hint: "2D es el default de exploración visual.",
        hints: ["2D es el default de exploración visual.", "explore True en el reporte."],
        edgeCases: ["n_components sin plan", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-A-E3; fixture sintético.",
        feedback: "S36-T2-A-E3: 2 componentes para mirar, no para sentenciar.",
        starterCode: {
          language: 'python',
          title: "s36-t2-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(2)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-a-e3.py",
          code: `print(2)
print("ok", True)
print("explore", True)
`,
          output: `2
ok True
explore True`,
        },
      },
      {
        id: "S36-T2-B-E1",
        subtopicId: "S36-T2-B",
        kind: "guided",
        instruction: "S36-T2-B-E1 · Eje PC no se auto-nombra de negocio: imprime False, ok True, prudent True. Starter True (defect: nombra PC2='riesgo'). Prudencia de interpretación en CASO-LIM-036.",
        hint: "axis_named_by_business = False.",
        hints: ["axis_named_by_business = False.", "Valida historias en features originales."],
        edgeCases: ["narrativa mágica", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-B-E1; fixture sintético.",
        feedback: "S36-T2-B-E1: sin nombre de negocio automático en PC.",
        starterCode: {
          language: 'python',
          title: "s36-t2-b-e1.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-b-e1.py",
          code: `print(False)
print("ok", True)
print("prudent", True)
`,
          output: `False
ok True
prudent True`,
        },
      },
      {
        id: "S36-T2-B-E2",
        subtopicId: "S36-T2-B",
        kind: "independent",
        instruction: "S36-T2-B-E2 · Outlier visual puede ser escala: imprime check_scale True, ok True, auto_label False. Starter auto_label True (defect). Antes de encolar, revisa scale del fixture sintético.",
        hint: "Primero scale/missingness.",
        hints: ["Primero scale/missingness.", "No auto-etiquetes sospechosos en el plot."],
        edgeCases: ["error de datos", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-B-E2; fixture sintético.",
        feedback: "S36-T2-B-E2: el plot miente si la escala miente.",
        starterCode: {
          language: 'python',
          title: "s36-t2-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("check_scale", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-b-e2.py",
          code: `print("check_scale", True)
print("ok", True)
print("auto_label", False)
`,
          output: `check_scale True
ok True
auto_label False`,
        },
      },
      {
        id: "S36-T2-B-E3",
        subtopicId: "S36-T2-B",
        kind: "transfer",
        instruction: "S36-T2-B-E3 · Documenta uso exploratorio: imprime 'exploratory', ok True, n 1. Starter 'production_judge' (defect). Transferencia de etiqueta del artefacto PCA en el dossier sintético.",
        hint: "Marca exploratory en el reporte.",
        hints: ["Marca exploratory en el reporte.", "No promociones PCA a juez de prod."],
        edgeCases: ["uso indebido del scatter", "sintético"],
        tests: "Salida alinea con solution output de S36-T2-B-E3; fixture sintético.",
        feedback: "S36-T2-B-E3: la etiqueta de uso es control de riesgo.",
        starterCode: {
          language: 'python',
          title: "s36-t2-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("exploratory")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t2-b-e3.py",
          code: `print("exploratory")
print("ok", True)
print("n", 1)
`,
          output: `exploratory
ok True
n 1`,
        },
      },
      {
        id: "S36-T3-A-E1",
        subtopicId: "S36-T3-A",
        kind: "guided",
        instruction: "S36-T3-A-E1 · Cuenta flags sigma: en [0,0,1] hay 1 flag. Imprime 1, misconduct False, ok True. Starter cuenta len (defect=3). Rareza ≠ conducta indebida en CASO-LIM-036-3A.",
        hint: "sum(flags) cuenta raros.",
        hints: ["sum(flags) cuenta raros.", "misconduct siempre False aquí."],
        edgeCases: ["regla mal calibrada", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-A-E1; fixture sintético.",
        feedback: "S36-T3-A-E1: contar flags no prueba culpa.",
        starterCode: {
          language: 'python',
          title: "s36-t3-a-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
flags = [0, 0, 1]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(sum(flags))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-a-e1.py",
          code: `flags = [0, 0, 1]
print(sum(flags))
print("misconduct", False)
print("ok", True)
`,
          output: `1
misconduct False
ok True`,
        },
      },
      {
        id: "S36-T3-A-E2",
        subtopicId: "S36-T3-A",
        kind: "independent",
        instruction: "S36-T3-A-E2 · Combina regla + score: imprime ['rule','score'], ok True, n 2. Starter solo ['score'] (defect). Explicabilidad para el revisor humano del path de señales sintéticas.",
        hint: "Regla legible + score de rareza.",
        hints: ["Regla legible + score de rareza.", "El humano necesita la frase de la regla."],
        edgeCases: ["caja negra sola", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-A-E2; fixture sintético.",
        feedback: "S36-T3-A-E2: regla+score mejora la cola de review.",
        starterCode: {
          language: 'python',
          title: "s36-t3-a-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(["rule", "score"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-a-e2.py",
          code: `print(["rule", "score"])
print("ok", True)
print("n", 2)
`,
          output: `['rule', 'score']
ok True
n 2`,
        },
      },
      {
        id: "S36-T3-A-E3",
        subtopicId: "S36-T3-A",
        kind: "transfer",
        instruction: "S36-T3-A-E3 · Flag → review, no guilt: imprime guilt False, route 'review', ok True. Starter guilt True y route 'auto_ban' (defect). Fail-closed de conducta en el triage sintético.",
        hint: "Ruta humana obligatoria.",
        hints: ["Ruta humana obligatoria.", "auto_ban está fuera de política."],
        edgeCases: ["acción automática", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-A-E3; fixture sintético.",
        feedback: "S36-T3-A-E3: rareza encola revisión, no castiga.",
        starterCode: {
          language: 'python',
          title: "s36-t3-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("guilt", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-a-e3.py",
          code: `print("guilt", False)
print("route", "review")
print("ok", True)
`,
          output: `guilt False
route review
ok True`,
        },
      },
      {
        id: "S36-T3-B-E1",
        subtopicId: "S36-T3-B",
        kind: "guided",
        instruction: "S36-T3-B-E1 · Etiquetas conceptuales: imprime ['outlier','novelty'], ok True, n 2. Starter solo ['outlier'] (defect). Distingue rareza en train vs punto nuevo en CASO-LIM-036.",
        hint: "Outlier en train; novelty vs modelo fijado.",
        hints: ["Outlier en train; novelty vs modelo fijado.", "Nombra ambos en el glosario de señales."],
        edgeCases: ["mezclar definiciones", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-B-E1; fixture sintético.",
        feedback: "S36-T3-B-E1: el glosario evita debates semánticos en la cola.",
        starterCode: {
          language: 'python',
          title: "s36-t3-b-e1.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(["outlier", "novelty"])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-b-e1.py",
          code: `print(["outlier", "novelty"])
print("ok", True)
print("n", 2)
`,
          output: `['outlier', 'novelty']
ok True
n 2`,
        },
      },
      {
        id: "S36-T3-B-E2",
        subtopicId: "S36-T3-B",
        kind: "independent",
        instruction: "S36-T3-B-E2 · expected_flags: contam 0.1 * n=50 → 5. Imprime 5, is_fraud_rate False, ok True. Starter marca is_fraud_rate True (defect). Contamination no es prevalencia de fraude.",
        hint: "expected_flags = int(n*contamination).",
        hints: ["expected_flags = int(n*contamination).", "Nunca lo vendas como fraude rate."],
        edgeCases: ["cola saturada", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-B-E2; fixture sintético.",
        feedback: "S36-T3-B-E2: contamination calibra carga, no culpa.",
        starterCode: {
          language: 'python',
          title: "s36-t3-b-e2.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
c, n = 0.1, 50
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(int(n * c))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-b-e2.py",
          code: `c, n = 0.1, 50
print(int(n * c))
print("is_fraud_rate", False)
print("ok", True)
`,
          output: `5
is_fraud_rate False
ok True`,
        },
      },
      {
        id: "S36-T3-B-E3",
        subtopicId: "S36-T3-B",
        kind: "transfer",
        instruction: "S36-T3-B-E3 · Tune a capacidad de review: imprime capacity_link True, ok True, n 1. Starter False (defect). Transferencia: expected_flags debe caber en la cola sintética de analistas.",
        hint: "Baja contamination si la cola no da abasto.",
        hints: ["Baja contamination si la cola no da abasto.", "capacity_link True en el diseño."],
        edgeCases: ["flags >> reviewers", "sintético"],
        tests: "Salida alinea con solution output de S36-T3-B-E3; fixture sintético.",
        feedback: "S36-T3-B-E3: la capacidad humana es un hiperparámetro real.",
        starterCode: {
          language: 'python',
          title: "s36-t3-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("capacity_link", True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t3-b-e3.py",
          code: `print("capacity_link", True)
print("ok", True)
print("n", 1)
`,
          output: `capacity_link True
ok True
n 1`,
        },
      },
      {
        id: "S36-T4-A-E1",
        subtopicId: "S36-T4-A",
        kind: "guided",
        instruction: "S36-T4-A-E1 · Media de flag rates [0.1,0.2] = 0.15. Imprime 0.15, backtest True, ok True. Starter suma sin dividir (defect). Ventanas sintéticas del backtest temporal CASO-LIM-036.",
        hint: "mean de rates por ventana.",
        hints: ["mean de rates por ventana.", "backtest True documenta el protocolo."],
        edgeCases: ["ventana única", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-A-E1; fixture sintético.",
        feedback: "S36-T4-A-E1: promediar ventanas mide estabilidad.",
        starterCode: {
          language: 'python',
          title: "s36-t4-a-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
rates = [0.1, 0.2]
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(sum(rates)/len(rates))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-a-e1.py",
          code: `rates = [0.1, 0.2]
print(sum(rates)/len(rates))
print("backtest", True)
print("ok", True)
`,
          output: `0.15
backtest True
ok True`,
        },
      },
      {
        id: "S36-T4-A-E2",
        subtopicId: "S36-T4-A",
        kind: "independent",
        instruction: "S36-T4-A-E2 · Sin leakage de futuro: imprime leakage False, ok True, split 'time'. Starter leakage True (defect: fit con futuro). Contrato temporal del path de señales sintéticas.",
        hint: "Fit en pasado, score en futuro.",
        hints: ["Fit en pasado, score en futuro.", "split time, no random shuffle ciego."],
        edgeCases: ["shuffle con tiempo", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-A-E2; fixture sintético.",
        feedback: "S36-T4-A-E2: el reloj manda en la validación.",
        starterCode: {
          language: 'python',
          title: "s36-t4-a-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("leakage", False)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-a-e2.py",
          code: `print("leakage", False)
print("ok", True)
print("split", "time")
`,
          output: `leakage False
ok True
split time`,
        },
      },
      {
        id: "S36-T4-A-E3",
        subtopicId: "S36-T4-A",
        kind: "transfer",
        instruction: "S36-T4-A-E3 · Tres ventanas en el lab: imprime 3, ok True, temporal True. Starter 1 (defect). Transferencia del diseño de ventanas deslizantes sintéticas CASO-LIM-036.",
        hint: "Varias ventanas para ver estabilidad.",
        hints: ["Varias ventanas para ver estabilidad.", "temporal True en el reporte."],
        edgeCases: ["una sola foto", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-A-E3; fixture sintético.",
        feedback: "S36-T4-A-E3: una ventana no prueba estabilidad.",
        starterCode: {
          language: 'python',
          title: "s36-t4-a-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(3)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-a-e3.py",
          code: `print(3)
print("ok", True)
print("temporal", True)
`,
          output: `3
ok True
temporal True`,
        },
      },
      {
        id: "S36-T4-B-E1",
        subtopicId: "S36-T4-B",
        kind: "guided",
        instruction: "S36-T4-B-E1 · precision@k con ranked [1,0,1] y k=2 → 0.5. Imprime 0.5, k 2, auto_guilt False. Starter k=3 (defect). Labels sintéticos de utilidad de review, no de culpa.",
        hint: "P@k = media de los top-k labels de utilidad.",
        hints: ["P@k = media de los top-k labels de utilidad.", "auto_guilt False siempre."],
        edgeCases: ["labels ralos", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-B-E1; fixture sintético.",
        feedback: "S36-T4-B-E1: P@k mide utilidad de cola, no culpa.",
        starterCode: {
          language: 'python',
          title: "s36-t4-b-e1.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
ranked, k = [1, 0, 1], 2
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(sum(ranked[:k])/k)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-b-e1.py",
          code: `ranked, k = [1, 0, 1], 2
print(sum(ranked[:k])/k)
print("k", k)
print("auto_guilt", False)
`,
          output: `0.5
k 2
auto_guilt False`,
        },
      },
      {
        id: "S36-T4-B-E2",
        subtopicId: "S36-T4-B",
        kind: "independent",
        instruction: "S36-T4-B-E2 · Human review required: imprime True, ok True, labels 'scarce'. Starter False (defect: apaga HITL). Contrato de revisión humana con labels escasos en el triage sintético.",
        hint: "HITL obligatorio con labels ralos.",
        hints: ["HITL obligatorio con labels ralos.", "labels scarce nombra el régimen."],
        edgeCases: ["automatizar sanción", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-B-E2; fixture sintético.",
        feedback: "S36-T4-B-E2: sin humano no hay gate de señales responsable.",
        starterCode: {
          language: 'python',
          title: "s36-t4-b-e2.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(True)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-b-e2.py",
          code: `print(True)
print("ok", True)
print("labels", "scarce")
`,
          output: `True
ok True
labels scarce`,
        },
      },
      {
        id: "S36-T4-B-E3",
        subtopicId: "S36-T4-B",
        kind: "transfer",
        instruction: "S36-T4-B-E3 · Nombre de métrica de utilidad: imprime 'precision_at_k', ok True, n 1. Starter 'global_accuracy' (defect). Transferencia: con labels escasos prioriza P@k en CASO-LIM-036.",
        hint: "P@k alinea con capacidad de cola.",
        hints: ["P@k alinea con capacidad de cola.", "global_accuracy engaña con labels ralos."],
        edgeCases: ["ROC fantasma", "sintético"],
        tests: "Salida alinea con solution output de S36-T4-B-E3; fixture sintético.",
        feedback: "S36-T4-B-E3: nombra la métrica que la cola realmente usa.",
        starterCode: {
          language: 'python',
          title: "s36-t4-b-e3.py",
          code: `# Fixture sintético CASO-PE — sin PII real
case_id = "CASO-LIM-SYN"
run_id = "local-check"
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("precision_at_k")
`,
        },
        solutionCode: {
          language: 'python',
          title: "s36-t4-b-e3.py",
          code: `print("precision_at_k")
print("ok", True)
print("n", 1)
`,
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
      "Pipeline de clustering/anomalías evaluado por P@k y review; sin concluir conducta indebida. Id ai-apis-advanced conservado. Solo datos sintéticos CASO-LIM-036.",
    objectives: ["Scale+cluster con disclaimer", "PCA exploratoria prudente", "Reglas/IF conceptual sin guilt", "Backtest y P@k con HITL"],
    requirements: ["Disclaimer anomalía≠culpa", "Backtest temporal sin leakage", "es-PE sintético", "Ruta humana para flags"],
    starterCode: `# señales auxiliares
def sigma_flags(xs, z=3):
    import statistics
    mu=statistics.mean(xs); sd=statistics.pstdev(xs) or 1
    return [x > mu+z*sd for x in xs]
if __name__=='__main__':
    print(sigma_flags([1,1,1,10]))
`,
    portfolioNote:
      "Señales CP-N3-C; evidencia de utilidad de cola. No PASS automático de carrera.",
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
        options: ["Fraude probado", "Parentesco", "Despido", "Señal de rareza a revisar"],
        correctIndex: 3,
        explanation: "Es una señal auxiliar de rareza que puede encolar revisión humana; no prueba fraude ni parentesco.",
      },
      {
        question: "contamination representa:",
        options: ["Tasa de fraude real", "Hipótesis de fracción rara a flaggear", "Accuracy", "Kafka lag"],
        correctIndex: 1,
        explanation: "Es un control de cuántos puntos se marcan raros; se calibra a capacidad de review, no a prevalencia de ilícitos.",
      },
      {
        question: "PCA en este curso se usa para:",
        options: ["Etiquetar culpa", "Reemplazar el workbench", "Exploración/visualización prudente", "Borrar features"],
        correctIndex: 2,
        explanation: "Proyección exploratoria; no es el modelo de decisión ni un eje moral.",
      },
      {
        question: "Con labels escasos prioriza:",
        options: ["precision@k y feedback humano", "Solo accuracy global", "Aumentar contamination a 0.9", "Eliminar reglas"],
        correctIndex: 0,
        explanation: "P@k alinea con la cola; el humano valida utilidad. Accuracy global con labels ralos engaña.",
      },
      {
        question: "Un fit de normalidad que incluye el mes evaluado comete:",
        options: ["Warmup", "Blocking", "Leakage temporal", "Backpressure"],
        correctIndex: 2,
        explanation: "Mezclar futuro en el fit invalida el backtest; el split debe ser temporal.",
      },
    ],
  },
  resources: {
    docs: [
      { label: "sklearn outlier detection", url: "https://scikit-learn.org/stable/modules/outlier_detection.html", note: "IF/LOF" },
      { label: "sklearn clustering", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "k-means" },
      { label: "sklearn PCA", url: "https://scikit-learn.org/stable/modules/decomposition.html", note: "Proyecciones" },
    ],
    books: [
      { label: "ISLR — PCA chapter", note: "Proyecciones e interpretación prudente" },
      { label: "Anomaly detection surveys", note: "Novelty vs outlier" },
    ],
    courses: [
      { label: "Coursera / Michigan Applied ML unsupervised modules", url: "https://www.coursera.org/", note: "Clustering y evaluación" },
      { label: "Stanford CS229 notes — unsupervised learning", url: "https://cs229.stanford.edu/", note: "PCA y anomalías conceptuales" },
    ],
  },
}
