import type { CourseSection } from '../../types'

export const section36: CourseSection = {
 id: "ai-apis-advanced",
 index: 36,
 title: "Clustering, anomalías y validación temporal",
 shortTitle: "Clustering y anomalías",
 tagline: "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
 estimatedHours: 18,
 level: "Competente a experto",
 phase: 2,
 icon: "ScanSearch",
 accentColor: "bg-gradient-to-br from-indigo-400 to-violet-900",
 jobRelevance:
 "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares** de cola de review. En banca de procesos, fintech y retail (p. ej. colas sintéticas tipo Interbank/fintech Lima en el laboratorio), un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Id `ai-apis-advanced` conservado por legacy de plataforma. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
 learningOutcomes: [
 { text: "Aplicar clustering con escalamiento previo de features y centroides calculados" },
 { text: "Elegir k con estabilidad multi-seed y reportar límites de métricas internas" },
 { text: "Proyectar con PCA (o pesos toy) solo para exploración visual" },
 { text: "Interpretar proyecciones con prudencia y sin auto-etiquetar culpa" },
 { text: "Detectar rareza con reglas σ e ideas IF/LOF sin veredicto de conducta" },
 { text: "Distinguir novelty vs outlier y calibrar contamination a capacidad de review" },
 { text: "Validar con backtests temporales y ventanas sin leakage" },
 { text: "Evaluar con labels escasos vía precision@k y revisión humana obligatoria" }
 ],
 theory: [
 {
 heading: "Señales no supervisadas para triage (mapa S36)",
 paragraphs: [
 "**Diccionario de la sección** (léelo antes de T1). **Clustering:** agrupar puntos por similitud sin etiqueta de conducta. **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral). **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-score) antes de distancias. **PCA:** proyección a pocas dimensiones para *explorar*, no para decidir culpa. **Anomalía / outlier:** punto raro respecto a una referencia; **novelty:** punto nuevo frente a un modelo de normalidad ya fijado. **contamination:** hipótesis de fracción a flaggear (control de cola), *no* tasa de fraude. **precision@k (P@k):** de los k primeros del ranking, qué fracción era útil al revisor. **HITL:** human-in-the-loop, revisión humana obligatoria antes de acciones que afectan personas.",
 "Clustering y detección de rareza alimentan el triage CP-N3-C como **señales auxiliares**, no como veredictos. Se evalúan por utilidad de revisión (¿ahorra tiempo al humano?) y nunca se traducen solas en fraude, parentesco o sanción. El lenguaje fail-closed protege a las personas detrás de los registros sintéticos del laboratorio.",
 "Contrato de la sección. Entrada: features sintéticas `CASO-LIM-036`, capacidad de cola de review y labels escasos. Salida: clusters/scores de rareza con disclaimer, backtest temporal y precision@k. Error: tratar anomalía como culpa, contamination como tasa de fraude, o fit con leakage de futuro bloquea el gate de señales.",
 "Caso Red Andina (ficticio, Lima): montos y frecuencias inventadas. El id de plataforma `ai-apis-advanced` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels escasos. Stack didáctico: **stdlib** (`statistics`, listas) para progressive disclosure; sklearn se cita como referencia profesional sin exigir la librería en ejercicios."
 ],
 code: {
 language: 'python',
 title: "s36_map_contract.py",
 code: `def section_contract():
 return {
 "case": "CASO-LIM-036",
 "signals": ["cluster", "anomaly_score", "precision_at_k"],
 "misconduct_auto": False,
 "human_review": True,
 }

c = section_contract()
print("case", c["case"])
print("auto_guilt", c["misconduct_auto"])
print("hitl", c["human_review"])
`,
 output: `case CASO-LIM-036
auto_guilt False
hitl True`,
 },
 callout: {
 type: "info",
 title: "Retarget y ética",
 content:
 "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática.",
 },
 },
 {
 heading: "Escalamiento y k-means / density (1D didáctico)",
 subtopicId: "S36-T1-A",
 paragraphs: [
 "Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs conteos de eventos). Density-based methods buscan regiones densas; aquí enseñamos el núcleo con un **toy 1D de centroides** (media de cada grupo). Los centroides son resúmenes geométricos, no etiquetas de fraude ni de parentesco.",
 "Mecanismo: para un grupo de valores, el centroide 1D es la media aritmética `sum(xs)/len(xs)`. Con dos grupos naturales (bajos vs altos) calculas c1 y c2 por separado. En 2D+ usarías distancias euclídeas y asignación iterativa (k-means clásico de sklearn/CS229); el 1D deja ver el contrato sin librerías pesadas.",
 "Contrato operativo. Entrada: vector de features sintéticas y decisión de escalado. Salida: centroides, `scaled=True` cuando aplicaste z-score o normalización, `verdict=False` siempre. Error: clusterizar montos crudos contra conteos sin normalizar, o publicar el id de cluster como sanción.",
 "Aplicación a `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] → grupo bajo media≈1.1, grupo alto≈5.1. Sirve para segmentar la cola de review (p. ej. volumen bajo/alto), nunca para culpar. En banca/fintech peruana el mismo error (escalar mal) distorsiona colas de AML sintéticas de laboratorio."
 ],
 code: {
 language: 'python',
 title: "kmeans1d_centroids.py",
 code: `def centroid_1d(xs):
 if not xs:
 raise ValueError("empty group")
 return sum(xs) / len(xs)

xs = [1.0, 1.2, 5.0, 5.2, 5.1]
low, high = xs[:2], xs[2:]
c1 = centroid_1d(low)
c2 = centroid_1d(high)
print("c1", round(c1, 2), "c2", round(c2, 2))
print("scaled", True)
print("verdict", False)
`,
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
 heading: "Elección de k, estabilidad multi-seed y límites de métricas",
 subtopicId: "S36-T1-B",
 paragraphs: [
 "Elige **k** con estabilidad multi-seed y sentido de negocio (capacidad de cola), no solo maximizando silhouette. Las métricas internas fallan con formas raras, solapamiento y desbalance. Reporta sensibilidad a seed en el notebook de señales del triage sintético.",
 "Mecanismo didáctico: dado un mapa `k → score` (p. ej. silhouette sintético), eliges `argmax`. En producción repetirías k-means con varias seeds y medirías si la partición es estable (adjusted rand / variación de centroides). Un silhouette alto **no** legitima sanción: solo sugiere una partición geométrica útil para priorizar review.",
 "Contrato operativo. Entrada: mapa k→score interno sintético + checklist multi_seed. Salida: k elegido, score y `stable_check=multi_seed`. Error: k que fragmenta de más la cola o que no se sostiene entre seeds. Si la partición salta entre seeds, no publiques el k como «óptimo» del negocio.",
 "Aplicación a `CASO-LIM-036-T1B`: scores {2:0.4, 3:0.55, 4:0.52} → k=3 con score 0.55. Se exige multi_seed en el checklist del PR de señales. Datos inventados; no existen labels de «culpable»."
 ],
 code: {
 language: 'python',
 title: "choose_k_stable.py",
 code: `def choose_k(scores: dict):
 best_k = max(scores, key=scores.get)
 return best_k, scores[best_k]

scores = {2: 0.4, 3: 0.55, 4: 0.52}
k, score = choose_k(scores)
print("k", k)
print("score", score)
print("stable_check", "multi_seed")
`,
 output: `k 3
score 0.55
stable_check multi_seed`,
 },
 callout: {
 type: "warning",
 title: "Métrica ≠ verdad",
 content:
 "Silhouette alto no legitima sanción. Reporta estabilidad multi-seed y capacidad de cola.",
 },
 },
 {
 heading: "PCA y visualización exploratoria",
 subtopicId: "S36-T2-A",
 paragraphs: [
 "**PCA** proyecta a 1–2D para explorar; no es el modelo de decisión final del triage. La varianza explicada informa compresión, no causalidad ni «eje de riesgo moral». Didáctica: proyección lineal por pesos fijos `pc = w0*x + w1*y` sobre features sintéticas (equivalente conceptual a un componente con cargas fijos, sin autovalores).",
 "Mecanismo: cada punto (x,y) se comprime a un escalar pc. En sklearn usarías `PCA(n_components=2).fit_transform`; aquí fijas pesos para ver el contrato sin autovalores. `decision_model=False` es política: el scatter no dispara auto-rechazo ni encola sanción.",
 "Contrato operativo. Entrada: puntos sintéticos y pesos de proyección documentados. Salida: coordenadas pc y `decision_model=False`. Error: clasificar culpa en el scatter, tratar el eje como «eje de fraude» o omitir que la proyección es exploratoria.",
 "Aplicación a `CASO-LIM-036-T2A` (Red Andina sintético): w=(0.8,0.2) sobre puntos toy → lista pc; solo exploración visual del space de features del lab; el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales."
 ],
 code: {
 language: 'python',
 title: "pca_toy_project.py",
 code: `def project(pts, w):
 return [w[0] * x + w[1] * y for x, y in pts]

w = (0.8, 0.2)
pts = [(1, 2), (2, 1), (8, 9)]
pc = project(pts, w)
print("pc", [round(v, 2) for v in pc])
print("var_idea", "weighted")
print("decision_model", False)
`,
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
 heading: "Interpretación prudente de proyecciones",
 subtopicId: "S36-T2-B",
 paragraphs: [
 "Los ejes PC **no** traen nombre de negocio automático: no inventes «PC2 = riesgo moral». Un outlier visual puede ser escala mal hecha, un error de datos o un segmento legítimo raro — no un villano. Documenta el uso como exploratorio en el dossier de señales del triage sintético.",
 "Mecanismo de gobierno: flags booleanos de política en el reporte (`axis_named_by_business=False`, `use=exploratory`, `auto_label=False`). Cualquier historia de negocio sobre un eje se valida con features originales y un humano revisor antes de priorizar la cola.",
 "Contrato operativo. Entrada: proyección y checklist de interpretación. Salida: flags de prudencia explícitos. Error: auto-etiquetar clusters en el plot como «sospechosos» o publicar el scatter como prueba de conducta.",
 "Aplicación a `CASO-LIM-036-T2B`: si un punto se aleja en el scatter, primero revisa scale y missingness sintéticos antes de encolar review; nunca auto-label de conducta indebida. El fail-closed del lab es: duda → más evidencia o HITL, no sanción."
 ],
 code: {
 language: 'python',
 title: "pca_limits_policy.py",
 code: `def pca_policy():
 return {
 "axis_named_by_business": False,
 "use": "exploratory",
 "auto_label": False,
 }

p = pca_policy()
print("axis_named_by_business", p["axis_named_by_business"])
print("use", p["use"])
print("auto_label", p["auto_label"])
`,
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
 heading: "Isolation Forest / LOF (conceptual) y reglas σ",
 subtopicId: "S36-T3-A",
 paragraphs: [
 "Isolation Forest y LOF (conceptual) generan scores de rareza; las **reglas legibles** (monto > μ+3σ) ayudan al revisor a entender el flag. Score alto ⇒ candidato a review, no culpa. Combina modelo y regla cuando puedas explicar el caso sintético en una frase.",
 "Mecanismo stdlib: calcula μ y σ de los «normales» (o de toda la serie con cuidado) y marca `x > mu + 3*sd`. `statistics.mean` / `pstdev` bastan. En sklearn, `IsolationForest(contamination=...)` devuelve −1/1; aquí la regla σ enseña el contrato ético con números transparentes.",
 "Contrato operativo. Entrada: serie sintética de montos. Salida: flags binarios, method y `misconduct=False`. Error: pipe del flag a despido o bloqueo automático.",
 "Aplicación a `CASO-LIM-036-T3A`: xs=[10,11,10,12,50]; μ sobre los normales del lab → flag en 50. El valor 50 es raro respecto al resto, no «culpable»."
 ],
 code: {
 language: 'python',
 title: "anomaly_rule_sigma.py",
 code: `import statistics

def sigma_flags(xs, z=3.0):
 body = xs[:-1]
 mu = statistics.mean(body)
 sd = statistics.pstdev(body) or 1.0
 return mu, [1 if x > mu + z * sd else 0 for x in xs]

xs = [10, 11, 10, 12, 50]
mu, rule = sigma_flags(xs)
print("mu", mu, "flags", rule)
print("method", "rule_sigma")
print("misconduct", False)
`,
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
 heading: "Novelty vs outlier y contamination (capacidad de cola)",
 subtopicId: "S36-T3-B",
 paragraphs: [
 "**Outlier:** punto raro respecto al train. **Novelty:** punto nuevo comparado con un modelo de normalidad ya fijado. **contamination** es una hipótesis de fracción a flaggear, no la prevalencia de fraude del negocio. Ajústala a la capacidad real de la cola de review sintética del lab.",
 "Mecanismo: `expected_flags = int(n * contamination)`. Si expected_flags > capacidad de analistas, bajas contamination o priorizas con otra señal. Nunca digas «contamination=0.05 ⇒ 5% de fraude».",
 "Contrato operativo. Entrada: contamination y n del batch sintético. Salida: expected_flags e `is_fraud_rate=False`. Error: vender contamination como tasa de ilícitos.",
 "Aplicación a `CASO-LIM-036-T3B`: contamination=0.05, n=200 → expected_flags=10. use=capacity_tuning. Solo control de rareza y de carga de la cola ficticia."
 ],
 code: {
 language: 'python',
 title: "contam_capacity.py",
 code: `def expected_flags(n: int, contamination: float) -> int:
 return int(n * contamination)

contamination = 0.05
n = 200
print("expected_flags", expected_flags(n, contamination))
print("contamination_is_fraud_rate", False)
print("use", "capacity_tuning")
`,
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
 heading: "Splits, backtests y ventanas temporales",
 subtopicId: "S36-T4-A",
 paragraphs: [
 "Valida señales con **backtest temporal**: fit de normalidad en el pasado, score en el futuro. Ventanas deslizantes miden estabilidad de la flag rate. Sin labels densos, usa un proxy de utilidad (click de review sintético), nunca leakage de datos futuros en el fit.",
 "Mecanismo: serie de (mes, flag_rate); reportas media y fijas `backtest=True`, `leakage=False`. Un spike de flags se investiga (drift de datos, bug de scale) antes de ampliar la cola.",
 "Contrato operativo. Entrada: ventanas (mes, flag_rate). Salida: mean_flag_rate, backtest=True, leakage=False. Error: entrenar con todo el histórico incluyendo el mes evaluado.",
 "Aplicación a `CASO-LIM-036-T4A`: rates 0.1, 0.12, 0.09 → mean≈0.103. Solo series sintéticas; el reloj del caso manda sobre cualquier shuffle aleatorio."
 ],
 code: {
 language: 'python',
 title: "backtest_windows.py",
 code: `def mean_flag_rate(windows):
 rates = [r for _, r in windows]
 return sum(rates) / len(rates)

windows = [("2026-01", 0.1), ("2026-02", 0.12), ("2026-03", 0.09)]
print("mean_flag_rate", round(mean_flag_rate(windows), 3))
print("backtest", True)
print("leakage", False)
`,
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
 heading: "Labels escasos, precision@k y revisión humana",
 subtopicId: "S36-T4-B",
 paragraphs: [
 "Con pocas etiquetas, **precision@k** y el acuerdo humano importan más que un ROC fantasma. El revisor valida si la señal ahorra tiempo en la cola. Nunca: anomalía → conducta indebida automática. El HITL es parte del contrato, no un adorno del dashboard.",
 "Mecanismo: ranking binario de utilidad (1=útil al revisor) en los top-k; `P@k = sum(ranked[:k])/k`. Política: `human_in_loop=True`, `auto_guilt=False`.",
 "Contrato operativo. Entrada: ranking de utilidad sintética y k. Salida: precision_at_k + flags HITL. Error: optimizar solo accuracy global con labels ralos.",
 "Aplicación a `CASO-LIM-036-T4B`: ranked=[1,0,1,0,0], k=3 → P@k≈0.667. La métrica de negocio del lab es «¿ayudó a la cola sintética?», no un veredicto moral."
 ],
 code: {
 language: 'python',
 title: "scarce_precision_at_k.py",
 code: `def precision_at_k(ranked, k):
 if k <= 0:
 raise ValueError("k must be positive")
 return sum(ranked[:k]) / k

ranked = [1, 0, 1, 0, 0]
k = 3
print("precision_at_k", precision_at_k(ranked, k))
print("human_in_loop", True)
print("auto_guilt", False)
`,
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
 }
 ],
 iDo: {
 intro: "Te muestro 8 demos calculados (no print-theater) de clustering, PCA prudente, anomalías σ y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético).",
 steps: [
 {
 demoId: "S36-T1-A-DEMO",
 subtopicId: "S36-T1-A",
 environment: "local-python",
 description: "Demo: centroides 1D calculados (no hardcode).",
 code: {
 language: 'python',
 title: "s36_t1_a_demo.py",
 code: `def centroid(xs):
 return sum(xs) / len(xs)

low, high = [1.0, 1.0], [5.0, 5.0]
print("c1", centroid(low))
print("c2", centroid(high))
print("scaled", True)
`,
 output: `c1 1.0
c2 5.0
scaled True`,
 },
 why: "Centroides derivados de medias reales; scale-first en política; sin veredicto de conducta.",
 },
 {
 demoId: "S36-T1-B-DEMO",
 subtopicId: "S36-T1-B",
 environment: "local-python",
 description: "Demo: argmax de k por score interno.",
 code: {
 language: 'python',
 title: "s36_t1_b_demo.py",
 code: `def best_k(scores):
    return max(scores, key=scores.get)

s = {2: 0.3, 3: 0.5}
k = best_k(s)
print("k", k)
print("score", s[k])
print("ok", True)
`,
 output: `k 3
score 0.5
ok True`,
 },
 why: "Argmax de score + recordatorio multi-seed en teoría; k no sanciona personas.",
 },
 {
 demoId: "S36-T2-A-DEMO",
 subtopicId: "S36-T2-A",
 environment: "local-python",
 description: "Demo: proyección ponderada exploratoria.",
 code: {
 language: 'python',
 title: "s36_t2_a_demo.py",
 code: `def project_pc(x, y, w0=0.8, w1=0.2):
    return w0 * x + w1 * y

print(round(project_pc(2, 4), 2))
print("exploratory", True)
print("ok", True)
`,
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
 description: "Demo: límites de interpretación de ejes PC.",
 code: {
 language: 'python',
 title: "s36_t2_b_demo.py",
 code: `def axis_policy_ok(policy):
    return (
        policy.get("business_axis") is False
        and policy.get("use") == "explore"
        and policy.get("ok") is True
    )

policy = {"business_axis": False, "use": "explore", "ok": True}
print("business_axis", policy["business_axis"])
print("use", policy["use"])
print("ok", axis_policy_ok(policy))
`,
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
 description: "Demo: flags σ computados sobre serie sintética.",
 code: {
 language: 'python',
 title: "s36_t3_a_demo.py",
 code: `import statistics

def sigma_flags(xs, ref=None, k=3):
    ref = ref if ref is not None else xs
    mu = statistics.mean(ref)
    sd = statistics.pstdev(ref) or 1.0
    return [1 if x > mu + k * sd else 0 for x in xs]

xs = [10, 10, 50]
print("flags", sigma_flags(xs, ref=xs[:2]))
print("misconduct", False)
print("ok", True)
`,
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
 description: "Demo: expected_flags = n * contamination.",
 code: {
 language: 'python',
 title: "s36_t3_b_demo.py",
 code: `def expected_flags(n, contamination):
    return int(n * contamination)

print(expected_flags(100, 0.05))
print("is_fraud_rate", False)
print("ok", True)
`,
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
 code: `def mean_flag_rate(rates):
    return round(sum(rates) / len(rates), 2)

print(mean_flag_rate([0.1, 0.2]))
print("backtest", True)
print("ok", True)
`,
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
 description: "Demo: precision@k con ranking de utilidad.",
 code: {
 language: 'python',
 title: "s36_t4_b_demo.py",
 code: `def precision_at_k(ranked, k):
    return sum(ranked[:k]) / k

print(precision_at_k([1, 0], 2))
print("human", True)
print("auto_guilt", False)
`,
 output: `0.5
human True
auto_guilt False`,
 },
 why: "P@k + HITL miden utilidad de cola con labels escasos.",
 }
 ],
 },
 weDo: {
 intro: "S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo o el flag ético, E2 fija la política válida y E3 transfiere el criterio fail-closed. Fixtures CASO-LIM-036; sin PII real; anomalía ≠ culpa. Cada starter tiene un defect real (fórmula o política), no un TODO vacío.",
 steps: [
 {
 id: "S36-T1-A-E1",
 subtopicId: "S36-T1-A",
 kind: "guided",
 instruction: "S36-T1-A-E1 · Centroide 1D: media de xs=[1,2] debe ser 1.5. Imprime la media, n 2 y ok True. El starter suma sin dividir (defect). Fixture CASO-LIM-036-1A; no es veredicto de conducta.",
 hint: "Centroide 1D = sum(xs)/len(xs).",
 hints: ["Centroide 1D = sum(xs)/len(xs).", "No uses la suma cruda como centroide."],
 edgeCases: ["grupo vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-A-E1: el centroide resume geometría; no etiqueta culpa.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
xs = [1, 2]

def centroid(vals):
 # DEFECT: devuelve la suma, no la media
 return sum(vals)

print(centroid(xs))
print("n", len(xs))
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-a-e1.py",
 code: `xs = [1, 2]

def centroid(vals):
 return sum(vals) / len(vals)

print(centroid(xs))
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
 instruction: "S36-T1-A-E2 · z-score: (x-mu)/sd con x=4, mu=0, sd=2 → 2.0. Imprime 2.0, sd 2, ok True. Starter olvida dividir por sd (defect). Escala antes de k-means en el path sintético CASO-LIM-036-1A.",
 hint: "z = (x - mu) / sd.",
 hints: ["z = (x - mu) / sd.", "Sin scale, gana la magnitud de la feature."],
 edgeCases: ["sd=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-A-E2: scale-first es parte del contrato de clustering.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
x, mu, sd = 4, 0, 2

def zscore(x, mu, sd):
 return x - mu # DEFECT

print(zscore(x, mu, sd))
print("sd", sd)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-a-e2.py",
 code: `x, mu, sd = 4, 0, 2

def zscore(x, mu, sd):
 return (x - mu) / sd

print(zscore(x, mu, sd))
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
 instruction: "S36-T1-A-E3 · Dos grupos: low=[2,4], high=[10,12]. Imprime c_low 3.0, c_high 11.0, verdict False. Starter promedia todos juntos (defect). Transferencia: segmentar cola sin sancionar (CASO-LIM-036-1A).",
 hint: "Calcula media por grupo, no global.",
 hints: ["Calcula media por grupo, no global.", "verdict False es política ética."],
 edgeCases: ["mezclar grupos", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-A-E3: segmentar ≠ sancionar.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
low, high = [2, 4], [10, 12]
all_xs = low + high
c = sum(all_xs) / len(all_xs) # DEFECT
print("c_low", c)
print("c_high", c)
print("verdict", True) # DEFECT ético
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-a-e3.py",
 code: `low, high = [2, 4], [10, 12]
c_low = sum(low) / len(low)
c_high = sum(high) / len(high)
print("c_low", c_low)
print("c_high", c_high)
print("verdict", False)
`,
 output: `c_low 3.0
c_high 11.0
verdict False`,
 },
 },
 {
 id: "S36-T1-B-E1",
 subtopicId: "S36-T1-B",
 kind: "guided",
 instruction: "S36-T1-B-E1 · Elige k con argmax: scores={2:0.2,3:0.6,4:0.5} → k 3 y score 0.6, multi_seed True. Starter usa min (defect). CASO-LIM-036-1B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "best_k = max(scores, key=scores.get).",
 hints: ["best_k = max(scores, key=scores.get).", "No uses min sobre scores de calidad interna."],
 edgeCases: ["empate de scores", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-B-E1: argmax del score; multi_seed en checklist.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
scores = {2: 0.2, 3: 0.6, 4: 0.5}
k = min(scores, key=scores.get) # DEFECT
print("k", k)
print("score", scores[k])
print("multi_seed", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e1.py",
 code: `scores = {2: 0.2, 3: 0.6, 4: 0.5}
k = max(scores, key=scores.get)
print("k", k)
print("score", scores[k])
print("multi_seed", True)
`,
 output: `k 3
score 0.6
multi_seed True`,
 },
 },
 {
 id: "S36-T1-B-E2",
 subtopicId: "S36-T1-B",
 kind: "independent",
 instruction: "S36-T1-B-E2 · Política: silhouette no sanciona. Imprime sanction_from_metric False, k 3, ok True. Starter True (defect ético). CASO-LIM-036-1B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "Métrica interna ≠ veredicto de conducta.",
 hints: ["Métrica interna ≠ veredicto de conducta.", "sanction_from_metric debe ser False."],
 edgeCases: ["usar silhouette como culpa", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-B-E2: prohíbe sanción por métrica interna.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
k = 3
print("sanction_from_metric", True) # DEFECT
print("k", k)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e2.py",
 code: `k = 3
print("sanction_from_metric", False)
print("k", k)
print("ok", True)
`,
 output: `sanction_from_metric False
k 3
ok True`,
 },
 },
 {
 id: "S36-T1-B-E3",
 subtopicId: "S36-T1-B",
 kind: "transfer",
 instruction: "S36-T1-B-E3 · Estabilidad: si seed_a_k==seed_b_k imprime stable True, k ese valor, ok True. Datos k_a=3,k_b=3. Starter compara mal (defect). CASO-LIM-036-1B multi-seed.",
 hint: "stable = (k_a == k_b).",
 hints: ["stable = (k_a == k_b).", "Transfiere el checklist multi_seed a un bool."],
 edgeCases: ["seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T1-B-E3: estabilidad entre seeds antes de fijar k.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
k_a, k_b = 3, 3
stable = k_a != k_b # DEFECT
print("stable", stable)
print("k", k_a)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e3.py",
 code: `k_a, k_b = 3, 3
stable = k_a == k_b
print("stable", stable)
print("k", k_a)
print("ok", True)
`,
 output: `stable True
k 3
ok True`,
 },
 },
 {
 id: "S36-T2-A-E1",
 subtopicId: "S36-T2-A",
 kind: "guided",
 instruction: "S36-T2-A-E1 · Proyección pc=0.5*x+0.5*y con (x,y)=(4,6) → 5.0. Imprime 5.0, exploratory True, decision_model False. Starter suma sin pesos (defect). CASO-LIM-036-2A.",
 hint: "pc = w0*x + w1*y.",
 hints: ["pc = w0*x + w1*y.", "decision_model False en exploración."],
 edgeCases: ["pesos mal normalizados", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-A-E1: proyección ponderada exploratoria.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
x, y = 4, 6
w0, w1 = 0.5, 0.5
pc = x + y # DEFECT: ignora pesos
print(pc)
print("exploratory", True)
print("decision_model", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-a-e1.py",
 code: `x, y = 4, 6
w0, w1 = 0.5, 0.5
pc = w0 * x + w1 * y
print(pc)
print("exploratory", True)
print("decision_model", False)
`,
 output: `5.0
exploratory True
decision_model False`,
 },
 },
 {
 id: "S36-T2-A-E2",
 subtopicId: "S36-T2-A",
 kind: "independent",
 instruction: "S36-T2-A-E2 · Lista pc para pts=[(1,1),(3,1)] y w=(1,0) → [1, 3]. Imprime pc, n 2, decision_model False. Starter usa w invertido (defect). CASO-LIM-036-2A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "Aplica el mismo w a cada punto.",
 hints: ["Aplica el mismo w a cada punto.", "No inviertas los pesos."],
 edgeCases: ["lista vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-A-E2: batch de proyecciones exploratorias.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
pts = [(1, 1), (3, 1)]
w = (1, 0)
pc = [w[1] * x + w[0] * y for x, y in pts] # DEFECT
print("pc", pc)
print("n", len(pc))
print("decision_model", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-a-e2.py",
 code: `pts = [(1, 1), (3, 1)]
w = (1, 0)
pc = [w[0] * x + w[1] * y for x, y in pts]
print("pc", pc)
print("n", len(pc))
print("decision_model", False)
`,
 output: `pc [1, 3]
n 2
decision_model False`,
 },
 },
 {
 id: "S36-T2-A-E3",
 subtopicId: "S36-T2-A",
 kind: "transfer",
 instruction: "S36-T2-A-E3 · Transfer: corrige scatter PCA a use exploratory, auto_reject False, ok True. Starter deja auto_reject True (defect ético). CASO-LIM-036-2A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "PCA no auto-rechaza casos.",
 hints: ["PCA no auto-rechaza casos.", "use debe ser exploratory."],
 edgeCases: ["scatter como juez", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-A-E3: transferencia fail-closed del scatter.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("use", "production_judge") # DEFECT
print("auto_reject", True) # DEFECT
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-a-e3.py",
 code: `print("use", "exploratory")
print("auto_reject", False)
print("ok", True)
`,
 output: `use exploratory
auto_reject False
ok True`,
 },
 },
 {
 id: "S36-T2-B-E1",
 subtopicId: "S36-T2-B",
 kind: "guided",
 instruction: "S36-T2-B-E1 · Política de ejes: imprime axis_named_by_business False, use exploratory, auto_label False. Starter nombra el eje de negocio (defect). CASO-LIM-036-2B.",
 hint: "No auto-nombrar ejes PC con moral de negocio.",
 hints: ["No auto-nombrar ejes PC con moral de negocio.", "auto_label False."],
 edgeCases: ["PC2=fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-B-E1: ejes sin narrativa mágica.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("axis_named_by_business", True) # DEFECT
print("use", "exploratory")
print("auto_label", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e1.py",
 code: `print("axis_named_by_business", False)
print("use", "exploratory")
print("auto_label", False)
`,
 output: `axis_named_by_business False
use exploratory
auto_label False`,
 },
 },
 {
 id: "S36-T2-B-E2",
 subtopicId: "S36-T2-B",
 kind: "independent",
 instruction: "S36-T2-B-E2 · Checklist pre-review: scale_ok y missing_ok deben ser True antes de encolar. Imprime ready True, scale_ok True, missing_ok True. Starter scale_ok False (defect). CASO-LIM-036-2B.",
 hint: "Revisa scale y missingness antes del review.",
 hints: ["Revisa scale y missingness antes del review.", "ready = scale_ok and missing_ok."],
 edgeCases: ["missing silencioso", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-B-E2: higiene de datos antes de encolar.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
scale_ok, missing_ok = False, True # DEFECT scale
ready = scale_ok and missing_ok
print("ready", ready)
print("scale_ok", scale_ok)
print("missing_ok", missing_ok)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e2.py",
 code: `scale_ok, missing_ok = True, True
ready = scale_ok and missing_ok
print("ready", ready)
print("scale_ok", scale_ok)
print("missing_ok", missing_ok)
`,
 output: `ready True
scale_ok True
missing_ok True`,
 },
 },
 {
 id: "S36-T2-B-E3",
 subtopicId: "S36-T2-B",
 kind: "transfer",
 instruction: "S36-T2-B-E3 · Transfer: un punto lejos en PC no implica culpa. Imprime guilt False, action review_queue, ok True. Starter guilt True (defect). CASO-LIM-036-2B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "Outlier visual → cola de review, no culpa.",
 hints: ["Outlier visual → cola de review, no culpa.", "guilt siempre False en auto."],
 edgeCases: ["sancionar por scatter", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T2-B-E3: distancia en PC ≠ conducta indebida.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("guilt", True) # DEFECT
print("action", "auto_block")
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e3.py",
 code: `print("guilt", False)
print("action", "review_queue")
print("ok", True)
`,
 output: `guilt False
action review_queue
ok True`,
 },
 },
 {
 id: "S36-T3-A-E1",
 subtopicId: "S36-T3-A",
 kind: "guided",
 instruction: "S36-T3-A-E1 · Regla σ: xs=[1,1,1,10], z=3 sobre body=xs[:3]. Imprime flags con 1 solo al final, method rule_sigma, misconduct False. Starter usa z=0 (defect). CASO-LIM-036-3A.",
 hint: "flag si x > mu + z*sd con z=3.",
 hints: ["flag si x > mu + z*sd con z=3.", "misconduct False siempre en auto."],
 edgeCases: ["sd=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-A-E1: rareza legible con regla σ.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
import statistics
xs = [1, 1, 1, 10]
body = xs[:3]
mu = statistics.mean(body)
sd = statistics.pstdev(body) or 1
z = 0 # DEFECT
flags = [1 if x > mu + z * sd else 0 for x in xs]
print("flags", flags)
print("method", "rule_sigma")
print("misconduct", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e1.py",
 code: `import statistics
xs = [1, 1, 1, 10]
body = xs[:3]
mu = statistics.mean(body)
sd = statistics.pstdev(body) or 1
z = 3
flags = [1 if x > mu + z * sd else 0 for x in xs]
print("flags", flags)
print("method", "rule_sigma")
print("misconduct", False)
`,
 output: `flags [0, 0, 0, 1]
method rule_sigma
misconduct False`,
 },
 },
 {
 id: "S36-T3-A-E2",
 subtopicId: "S36-T3-A",
 kind: "independent",
 instruction: "S36-T3-A-E2 · Cuenta flags: de [0,0,1,0,1] imprime n_flags 2, review_only True, misconduct False. Starter suma mal (defect). CASO-LIM-036-3A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "n_flags = sum(flags).",
 hints: ["n_flags = sum(flags).", "review_only True: no hay auto-sanción."],
 edgeCases: ["lista vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-A-E2: conteo de rareza para capacidad de cola.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
flags = [0, 0, 1, 0, 1]
n_flags = len(flags) # DEFECT
print("n_flags", n_flags)
print("review_only", True)
print("misconduct", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e2.py",
 code: `flags = [0, 0, 1, 0, 1]
n_flags = sum(flags)
print("n_flags", n_flags)
print("review_only", True)
print("misconduct", False)
`,
 output: `n_flags 2
review_only True
misconduct False`,
 },
 },
 {
 id: "S36-T3-A-E3",
 subtopicId: "S36-T3-A",
 kind: "transfer",
 instruction: "S36-T3-A-E3 · Transfer fail-closed: corrige a route human_review, ok True, auto_sanction False. CASO-LIM-036-3A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "Flag σ encola review humano.",
 hints: ["Flag σ encola review humano.", "auto_sanction False."],
 edgeCases: ["despido automático", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-A-E3: transferencia ética del flag de rareza.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("route", "auto_fire") # DEFECT
print("ok", True)
print("auto_sanction", True) # DEFECT
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `print("route", "human_review")
print("ok", True)
print("auto_sanction", False)
`,
 output: `route human_review
ok True
auto_sanction False`,
 },
 },
 {
 id: "S36-T3-B-E1",
 subtopicId: "S36-T3-B",
 kind: "guided",
 instruction: "S36-T3-B-E1 · expected_flags: n=200, contamination=0.1 → 20. Imprime 20, is_fraud_rate False, use capacity_tuning. Starter multiplica mal (defect). CASO-LIM-036-3B.",
 hint: "expected_flags = int(n * contamination).",
 hints: ["expected_flags = int(n * contamination).", "is_fraud_rate False."],
 edgeCases: ["contamination>1", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-B-E1: contamination calibra carga, no fraude.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
n, contamination = 200, 0.1
print(int(n + contamination)) # DEFECT
print("is_fraud_rate", False)
print("use", "capacity_tuning")
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-b-e1.py",
 code: `n, contamination = 200, 0.1
print(int(n * contamination))
print("is_fraud_rate", False)
print("use", "capacity_tuning")
`,
 output: `20
is_fraud_rate False
use capacity_tuning`,
 },
 },
 {
 id: "S36-T3-B-E2",
 subtopicId: "S36-T3-B",
 kind: "independent",
 instruction: "S36-T3-B-E2 · Capacidad: capacity=8, expected=10 → overflow True, action lower_contamination, ok True. Starter overflow False (defect). CASO-LIM-036-3B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "overflow = expected > capacity.",
 hints: ["overflow = expected > capacity.", "Si overflow, baja contamination o prioriza."],
 edgeCases: ["capacity 0", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-B-E2: alinea flags esperados a capacidad real.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
capacity, expected = 8, 10
overflow = expected < capacity # DEFECT
print("overflow", overflow)
print("action", "lower_contamination")
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-b-e2.py",
 code: `capacity, expected = 8, 10
overflow = expected > capacity
print("overflow", overflow)
print("action", "lower_contamination")
print("ok", True)
`,
 output: `overflow True
action lower_contamination
ok True`,
 },
 },
 {
 id: "S36-T3-B-E3",
 subtopicId: "S36-T3-B",
 kind: "transfer",
 instruction: "S36-T3-B-E3 · Novelty vs outlier: imprime kind novelty, misconduct False, ok True. Starter kind outlier_as_guilt (defect). CASO-LIM-036-3B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "Novelty compara con modelo de normalidad fijado.",
 hints: ["Novelty compara con modelo de normalidad fijado.", "Nunca guilt automático."],
 edgeCases: ["confundir novelty con fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T3-B-E3: nombra el régimen sin moralizar.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("kind", "outlier_as_guilt") # DEFECT
print("misconduct", True)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-b-e3.py",
 code: `print("kind", "novelty")
print("misconduct", False)
print("ok", True)
`,
 output: `kind novelty
misconduct False
ok True`,
 },
 },
 {
 id: "S36-T4-A-E1",
 subtopicId: "S36-T4-A",
 kind: "guided",
 instruction: "S36-T4-A-E1 · mean_flag_rate de [0.1,0.2,0.3] → 0.2. Imprime 0.2, backtest True, leakage False. Starter usa max (defect). CASO-LIM-036-4A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "media = sum(rates)/len(rates).",
 hints: ["media = sum(rates)/len(rates).", "leakage False en backtest temporal."],
 edgeCases: ["ventana vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-A-E1: media de flag rates en ventanas.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
rates = [0.1, 0.2, 0.3]
print(max(rates)) # DEFECT
print("backtest", True)
print("leakage", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-a-e1.py",
 code: `rates = [0.1, 0.2, 0.3]
print(sum(rates) / len(rates))
print("backtest", True)
print("leakage", False)
`,
 output: `0.2
backtest True
leakage False`,
 },
 },
 {
 id: "S36-T4-A-E2",
 subtopicId: "S36-T4-A",
 kind: "independent",
 instruction: "S36-T4-A-E2 · Anti-leakage: train_end='2026-01', test_month='2026-02' → leakage False, order temporal, ok True. Starter marca leakage True (defect). CASO-LIM-036-4A.",
 hint: "test posterior a train_end ⇒ leakage False.",
 hints: ["test posterior a train_end ⇒ leakage False.", "No mezcles futuro en el fit."],
 edgeCases: ["test dentro de train", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-A-E2: split temporal honesto.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
train_end, test_month = "2026-01", "2026-02"
print("leakage", True) # DEFECT
print("order", "temporal")
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-a-e2.py",
 code: `train_end, test_month = "2026-01", "2026-02"
print("leakage", False)
print("order", "temporal")
print("ok", True)
`,
 output: `leakage False
order temporal
ok True`,
 },
 },
 {
 id: "S36-T4-A-E3",
 subtopicId: "S36-T4-A",
 kind: "transfer",
 instruction: "S36-T4-A-E3 · Spike: rates=[0.1,0.5] → spike True si max-min>=0.3, action investigate, ok True. Starter umbral mal (defect). CASO-LIM-036-4A. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "spike si max(rates)-min(rates) >= 0.3.",
 hints: ["spike si max(rates)-min(rates) >= 0.3.", "Investiga antes de ampliar cola."],
 edgeCases: ["rates constantes", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-A-E3: estabilidad de flag rate entre ventanas.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
rates = [0.1, 0.5]
spike = (max(rates) - min(rates)) >= 0.9 # DEFECT threshold
print("spike", spike)
print("action", "investigate")
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-a-e3.py",
 code: `rates = [0.1, 0.5]
spike = (max(rates) - min(rates)) >= 0.3
print("spike", spike)
print("action", "investigate")
print("ok", True)
`,
 output: `spike True
action investigate
ok True`,
 },
 },
 {
 id: "S36-T4-B-E1",
 subtopicId: "S36-T4-B",
 kind: "guided",
 instruction: "S36-T4-B-E1 · P@k: ranked=[1,0,1,0], k=2 → 0.5. Imprime 0.5, k 2, auto_guilt False. Starter usa k=4 (defect). CASO-LIM-036-4B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "P@k = sum(ranked[:k])/k.",
 hints: ["P@k = sum(ranked[:k])/k.", "auto_guilt False."],
 edgeCases: ["k=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-B-E1: precision@k con labels de utilidad.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e1.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
ranked = [1, 0, 1, 0]
k = 4 # DEFECT
print(sum(ranked[:k]) / k)
print("k", k)
print("auto_guilt", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-b-e1.py",
 code: `ranked = [1, 0, 1, 0]
k = 2
print(sum(ranked[:k]) / k)
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
 instruction: "S36-T4-B-E2 · HITL obligatorio: imprime True, ok True, labels scarce. Starter False (defect: apaga HITL). CASO-LIM-036-4B. Fixture sintético CASO-LIM-036; sin PII; anomalía no es veredicto de conducta indebida.",
 hint: "HITL obligatorio con labels ralos.",
 hints: ["HITL obligatorio con labels ralos.", "labels scarce nombra el régimen."],
 edgeCases: ["automatizar sanción", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E2; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-B-E2: sin humano no hay gate de señales responsable.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e2.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print(False) # DEFECT apaga HITL
print("ok", True)
print("labels", "scarce")
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
 instruction: "S36-T4-B-E3 · Métrica de utilidad: imprime precision_at_k, ok True, n 1. Starter global_accuracy (defect). Transferencia: con labels escasos prioriza P@k en CASO-LIM-036-4B.",
 hint: "P@k alinea con capacidad de cola.",
 hints: ["P@k alinea con capacidad de cola.", "global_accuracy engaña con labels ralos."],
 edgeCases: ["ROC fantasma", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E3; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
 feedback: "S36-T4-B-E3: nombra la métrica que la cola realmente usa.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e3.py",
 code: `# CASO-LIM-036 sintético · Red Andina (Lima) lab · sin PII real
# Repara solo el DEFECT; conserva el contrato de prints del exercise.
# Stack: stdlib (statistics/listas). Anomalía ≠ culpa.
print("global_accuracy") # DEFECT
print("ok", True)
print("n", 1)
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
 }
 ],
 },

 youDo: {
 title: "Señales auxiliares de rareza con backtest (CP-N3-C señales)",
 context:
 "Construye un mini-pipeline de clustering/anomalías sobre CASO-LIM-036 (sintético): scale → centroides o flags σ → backtest de flag_rate → P@k con HITL. Id ai-apis-advanced conservado. Sin concluir conducta indebida.",
 objectives: [
 "Scale + cluster/centroides con disclaimer ethical",
 "PCA exploratoria prudente (decision_model=False)",
 "Reglas σ / rareza sin guilt automático",
 "Backtest temporal + P@k con human_in_loop",
 ],
 requirements: [
 "Disclaimer anomalía≠culpa en cada salida de flag",
 "Backtest temporal sin leakage",
 "es-PE sintético; sin PII real",
 "Ruta humana obligatoria para flags que afectan personas",
 ],
 starterCode: `# CASO-LIM-036 · señales auxiliares (youDo)
import statistics

def centroid(xs):
 return sum(xs) / len(xs)

def sigma_flags(xs, z=3.0):
 mu = statistics.mean(xs)
 sd = statistics.pstdev(xs) or 1.0
 return [x > mu + z * sd for x in xs]

def precision_at_k(ranked, k):
 return sum(ranked[:k]) / k

if __name__ == "__main__":
 print("c", centroid([1.0, 1.2]))
 print("flags", sigma_flags([10, 11, 10, 50]))
 print("p_at_2", precision_at_k([1, 0, 1], 2))
 print("auto_guilt", False)
`,
 portfolioNote:
 "Señales CP-N3-C; evidencia de utilidad de cola (P@k + HITL). No PASS automático de carrera ni veredicto moral.",
 rubric: [
 { criterion: "Alineación al gate V3 de señales auxiliares", weight: "25%" },
 { criterion: "Correctitud técnica (scale, centroides, σ, P@k, backtest)", weight: "20%" },
 { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
 { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
 { criterion: "Código legible y límites claros", weight: "10%" },
 { criterion: "Documentación en español profesional", weight: "10%" },
 { criterion: "Anomalía no es veredicto de conducta (gate privacy)", weight: "gate" }
 ],
 },
 selfCheck: {
 questions: [
 {
 question: "Una anomalía en el triage significa:",
 options: ["Fraude probado", "Parentesco automático", "Despido justificado", "Señal de rareza a revisar por un humano"],
 correctIndex: 3,
 explanation: "Es una señal auxiliar de rareza que puede encolar revisión humana; no prueba fraude ni parentesco.",
 },
 {
 question: "contamination representa:",
 options: ["Tasa de fraude real del negocio", "Hipótesis de fracción rara a flaggear (capacidad de cola)", "Accuracy del clasificador supervisado", "Kafka lag del pipeline"],
 correctIndex: 1,
 explanation: "Es un control de cuántos puntos se marcan raros; se calibra a capacidad de review, no a prevalencia de ilícitos.",
 },
 {
 question: "PCA en este curso se usa para:",
 options: ["Etiquetar culpa en el eje PC2", "Reemplazar el workbench de revisión", "Exploración/visualización prudente", "Borrar features de privacidad automáticamente"],
 correctIndex: 2,
 explanation: "Proyección exploratoria; no es el modelo de decisión ni un eje moral.",
 },
 {
 question: "Con labels escasos prioriza:",
 options: ["precision@k y feedback humano", "Solo accuracy global", "Aumentar contamination a 0.9", "Eliminar reglas legibles"],
 correctIndex: 0,
 explanation: "P@k alinea con la cola; el humano valida utilidad. Accuracy global con labels ralos engaña.",
 },
 {
 question: "Un fit de normalidad que incluye el mes evaluado comete:",
 options: ["Warmup de benchmark", "Blocking de candidatos", "Backpressure de cola", "Leakage temporal"],
 correctIndex: 3,
 explanation: "Mezclar futuro en el fit invalida el backtest; el split debe ser temporal.",
 }
 ],
 },
 resources: {
 docs: [
 { label: "sklearn outlier detection", url: "https://scikit-learn.org/stable/modules/outlier_detection.html", note: "IF/LOF; novelty vs outlier" },
 { label: "sklearn clustering", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "k-means y límites" },
 { label: "sklearn PCA", url: "https://scikit-learn.org/stable/modules/decomposition.html#pca", note: "Proyecciones" },
 { label: "sklearn StandardScaler", url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html", note: "Scale-first antes de distancias" },
 { label: "Python statistics — mean/pstdev", url: "https://docs.python.org/3/library/statistics.html", note: "Reglas σ en stdlib" },
 { label: "Py4E — progressive exercises", url: "https://www.py4e.com", note: "Pedagogía de liberación gradual" }
 ],
 books: [
 { label: "ISLR — PCA chapter", note: "Proyecciones e interpretación prudente" },
 { label: "ESL / anomaly detection surveys", note: "Novelty vs outlier; límites de unsupervised" },
 { label: "Python Data Science Handbook (VanderPlas) — k-means/PCA", note: "Notebooks clásicos" }
 ],
 courses: [
 { label: "Stanford CS229 — unsupervised learning notes", url: "https://cs229.stanford.edu/", note: "k-means, PCA, framing unsupervised" },
 { label: "Coursera Machine Learning (clustering modules)", url: "https://www.coursera.org/learn/machine-learning", note: "Intuición de k-means y costo" },
 { label: "MIT OCW Intro ML (6.036 materials)", url: "https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/", note: "Framing unsupervised" },
 { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python", note: "Guided vs independent problem design" },
 { label: "StatQuest — K-means clustering", url: "https://www.youtube.com/watch?v=4b5d3muPQmA", note: "Centroides con claridad visual" },
 { label: "StatQuest — PCA", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", note: "Ejes ≠ etiquetas morales" }
 ],
 },
}
