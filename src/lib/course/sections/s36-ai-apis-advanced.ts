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
 "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares** de cola de review. En banca de procesos, fintech y retail (p. ej. colas sintéticas tipo Interbank/fintech Lima en el laboratorio), un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
 learningOutcomes: [
 { text: "Aplicar escalamiento y centroides 1D (núcleo de k-means) sin tratar el cluster como culpa" },
 { text: "Elegir k comparando seeds y reportar límites de métricas internas (no sancionar por silhouette)" },
 { text: "Proyectar con PCA toy (pesos fijos documentados) solo para exploración visual" },
 { text: "Interpretar proyecciones con prudencia y sin auto-etiquetar culpa" },
 { text: "Detectar rareza con reglas σ (y saber cuándo IF/LOF de sklearn aplica en producción) sin veredicto de conducta" },
 { text: "Distinguir novelty vs outlier y calibrar contamination a capacidad de review" },
 { text: "Validar con backtests temporales y ventanas sin leakage" },
 { text: "Evaluar con labels escasos vía precision@k y revisión humana obligatoria" }
 ],
 theory: [
 {
 heading: "Señales no supervisadas para triage (mapa S36)",
 paragraphs: [
 "**Diccionario de la sección** (léelo antes de T1). **Clustering:** agrupar puntos por similitud sin etiqueta de conducta. **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral). **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-score) antes de distancias. **PCA:** proyección a pocas dimensiones para *explorar*, no para decidir culpa. **Anomalía / outlier:** punto raro respecto a una referencia; **novelty:** punto nuevo frente a un modelo de normalidad ya fijado. **contamination:** hipótesis de fracción a flaggear (control de cola), *no* tasa de fraude. **precision@k (P@k):** de los k primeros del ranking, qué fracción era útil al revisor. **HITL:** human-in-the-loop, revisión humana obligatoria antes de acciones que afectan personas. **Fail-closed:** si falta evidencia, revisor o contrato, no se emite sanción automática.",
 "Clustering y detección de rareza alimentan el triage CP-N3-C como **señales auxiliares**, no como veredictos. Se evalúan por utilidad de revisión (¿ahorra tiempo al humano?) y nunca se traducen solas en fraude, parentesco o sanción. El lenguaje fail-closed protege a las personas detrás de los registros sintéticos del laboratorio.",
 "Puente de carrera: en S35 armaste la ficha del caso (evidencia | modelo | incertidumbre | humano). Aquí agregas **scores no supervisados** a la capa modelo/cola, sin tocar la decisión humana. En S37 medirás costo y tiempo de generar estas señales; en S39 las integrarás al triage responsable de CP-N3-C.",
 "Contrato de la sección. Entrada: features sintéticas `CASO-LIM-036`, capacidad de cola de review y labels escasos. Salida: clusters/scores de rareza con disclaimer, backtest temporal y precision@k. Error: tratar anomalía como culpa, contamination como tasa de fraude, o fit con leakage de futuro bloquea el gate de señales.",
 "Caso Red Andina (ficticio, Lima): montos y frecuencias inventadas. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels escasos. Stack didáctico: **stdlib** (`statistics`, listas) para progressive disclosure; sklearn se cita como referencia profesional sin exigir la librería en ejercicios. Esta sección no decide fraude ni parentesco: solo produce señales para la cola de review."
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
 title: "Ética de señales",
 content:
 "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática.",
 },
 },
 {
 heading: "Escalamiento y centroides 1D (núcleo de k-means / density)",
 subtopicId: "S36-T1-A",
 paragraphs: [
 "Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs conteos de eventos). Aquí el núcleo es un **toy 1D de centroides** (media de cada grupo) sobre valores ya estandarizados. Los centroides son resúmenes geométricos, no etiquetas de fraude ni de parentesco.",
 "Mecanismo: el z-score `z = (x-μ)/σ` pone cada feature en escala comparable (`σ=0` se protege con 1.0). Luego el centroide 1D de un grupo es `sum(xs)/len(xs)`. Con dos grupos naturales (bajos vs altos) calculas c1 y c2 por separado. En 2D+ usarías distancias euclídeas y el bucle assign–update de k-means (sklearn/CS229); el 1D deja ver el contrato sin librerías pesadas.",
 "**Density (idea operable en stdlib):** un método density-based (p. ej. DBSCAN) marca como núcleo los puntos con ≥`min_samples` vecinos dentro de radio `eps`. No eliges k de antemano; eliges densidad. Micro-contrato: `n_neighbors = sum(1 for y in xs if abs(x-y) <= eps) - 1` (excluye el propio punto). Si `n_neighbors >= min_samples` es núcleo; si no, borde o ruido. En el lab no instalamos sklearn: escalas primero, cuentas vecinos 1D y documentas que en producción usarías `DBSCAN(eps=..., min_samples=...)`. El examen puede preguntar la idea; el núcleo ejecutable fuerte de T1 sigue siendo scale + centroides.",
 "Contrato operativo. Entrada: vector de features sintéticas. Salida: z-scores, centroides por grupo, `scaled=True` solo si el z-score se calculó, `verdict=False` siempre. Error: imprimir `scaled True` sin escalar, clusterizar montos crudos contra conteos, o publicar el id de cluster como sanción.",
 "Aplicación a `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] se escala; el grupo bajo y el alto se leen en el espacio z; además se marca quién es núcleo density (`eps`, `min_samples`) sin inventar k. Sirve para segmentar la cola de review (volumen bajo/alto o densidad local), nunca para culpar. En banca/fintech peruana el mismo error (escalar mal) distorsiona colas de AML sintéticas de laboratorio."
 ],
 code: {
 language: 'python',
 title: "kmeans1d_centroids.py",
 code: `def centroid_1d(xs):
 if not xs:
  raise ValueError("empty group")
 return sum(xs) / len(xs)

def zscore_list(xs):
 mu = sum(xs) / len(xs)
 var = sum((x - mu) ** 2 for x in xs) / len(xs)
 sd = var ** 0.5 or 1.0
 return [(x - mu) / sd for x in xs], True

def density_core_1d(xs, eps=0.5, min_samples=2):
 # Idea DBSCAN en 1D: núcleo si tiene >= min_samples vecinos en radio eps
 core = []
 for x in xs:
  n_nb = sum(1 for y in xs if abs(x - y) <= eps) - 1
  core.append(n_nb >= min_samples)
 return core

xs = [1.0, 1.2, 5.0, 5.2, 5.1]
xs_scaled, did_scale = zscore_list(xs)
low, high = xs_scaled[:2], xs_scaled[2:]
c1 = centroid_1d(low)
c2 = centroid_1d(high)
core = density_core_1d(xs_scaled, eps=0.5, min_samples=2)
print("c1", round(c1, 2), "c2", round(c2, 2))
print("core_density", core)
print("scaled", did_scale)
print("verdict", False)
`,
 output: `c1 -1.22 c2 0.82
core_density [False, False, True, True, True]
scaled True
verdict False`,
 },
 callout: {
 type: "tip",
 title: "Escala primero",
 content:
 "Sin scale, gana la feature con mayor magnitud. Escala y documenta; el centroide no es una etiqueta moral.",
 },
 },
 {
 heading: "Elección de k, estabilidad multi-seed y límites de métricas",
 subtopicId: "S36-T1-B",
 paragraphs: [
 "Elige **k** con estabilidad multi-seed y sentido de negocio (capacidad de cola), no solo maximizando silhouette. Las métricas internas fallan con formas raras, solapamiento y desbalance. Reporta sensibilidad a seed en el notebook de señales del triage sintético.",
 "Mecanismo didáctico: dado un mapa `k → score` (p. ej. silhouette sintético), eliges `argmax` por seed. La estabilidad multi-seed es un bool: `stable = (k_seed_a == k_seed_b)`. En producción repetirías k-means real y medirías ARI o jitter de centroides; aquí el contrato se ve con dos mapas sintéticos de scores. Un silhouette alto **no** legitima sanción: solo sugiere una partición geométrica útil para priorizar review.",
 "Contrato operativo. Entrada: dos mapas k→score (seed A y seed B). Salida: k de cada seed, `stable` si coinciden, y el k propuesto solo si es estable. Error: fijar k con un solo seed o publicar un k inestable como «óptimo» del negocio.",
 "Aplicación a `CASO-LIM-036-T1B`: seed A {2:0.4, 3:0.55, 4:0.52} y seed B {2:0.41, 3:0.54, 4:0.50} → ambos eligen k=3 (`stable True`). Datos inventados; no existen labels de «culpable»."
 ],
 code: {
 language: 'python',
 title: "choose_k_stable.py",
 code: `def choose_k(scores: dict):
 best_k = max(scores, key=scores.get)
 return best_k, scores[best_k]

scores_seed_a = {2: 0.4, 3: 0.55, 4: 0.52}
scores_seed_b = {2: 0.41, 3: 0.54, 4: 0.50}
k_a, score_a = choose_k(scores_seed_a)
k_b, _ = choose_k(scores_seed_b)
stable = k_a == k_b
print("k", k_a)
print("score", score_a)
print("stable", stable)
print("stable_check", "multi_seed")
`,
 output: `k 3
score 0.55
stable True
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
 "**PCA** proyecta a 1–2D para explorar; no es el modelo de decisión final del triage. La varianza explicada informa compresión, no causalidad ni «eje de riesgo moral». Didáctica: proyección lineal por pesos fijos `pc = w0*x + w1*y` (cargas documentadas a mano). **No** son autovectores reales: en sklearn, `PCA` aprende pesos que maximizan varianza; aquí los fijas para ver el contrato sin álgebra de autovalores.",
 "Mecanismo: primero escalas cada eje (z-score por coordenada); luego cada punto (x,y) se comprime a un escalar `pc = w0*x + w1*y`. Un proxy honesto de «cuánto pesa el primer eje» es `|w0|/(|w0|+|w1|)` — masa del componente, **no** varianza explicada real de autovalores. `decision_model=False`: el scatter no dispara auto-rechazo ni encola sanción.",
 "Contrato operativo. Entrada: puntos sintéticos crudos y pesos de proyección documentados. Salida: puntos escalados, coordenadas pc, weight_share del primer eje, `scaled=True` solo si el z-score por eje se calculó, y `decision_model=False`. Error: proyectar sin scale, clasificar culpa en el scatter, o vender pesos fijos como autovectores de producción.",
 "Aplicación a `CASO-LIM-036-T2A` (Red Andina sintético): w=(0.8,0.2) sobre puntos toy **después** de scale → lista pc y weight_share≈0.8; solo exploración visual del space de features del lab; el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales."
 ],
 code: {
 language: 'python',
 title: "pca_toy_project.py",
 code: `def scale_xy(pts):
 xs = [p[0] for p in pts]
 ys = [p[1] for p in pts]
 mux, muy = sum(xs) / len(xs), sum(ys) / len(ys)
 sdx = (sum((x - mux) ** 2 for x in xs) / len(xs)) ** 0.5 or 1.0
 sdy = (sum((y - muy) ** 2 for y in ys) / len(ys)) ** 0.5 or 1.0
 scaled = [((x - mux) / sdx, (y - muy) / sdy) for x, y in pts]
 return scaled, True

def project(pts, w):
 return [w[0] * x + w[1] * y for x, y in pts]

def weight_share(w):
 mass = abs(w[0]) + abs(w[1])
 return abs(w[0]) / mass if mass else 0.0

w = (0.8, 0.2)
pts = [(1, 2), (2, 1), (8, 9)]
pts_s, did_scale = scale_xy(pts)
pc = project(pts_s, w)
print("pc", [round(v, 2) for v in pc])
print("weight_share_pc1", round(weight_share(w), 2))
print("scaled", did_scale)
print("var_idea", "fixed_weights_not_eigen")
print("decision_model", False)
`,
 output: `pc [-0.8, -0.6, 1.4]
weight_share_pc1 0.8
scaled True
var_idea fixed_weights_not_eigen
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
 "Isolation Forest y LOF generan scores de rareza en producción; en el lab stdlib enseñamos el **contrato** con una **regla legible** (monto > μ+3σ) que el revisor entiende en una frase. Score alto ⇒ candidato a review, no culpa.",
 "**IF / LOF en una tabla mental (sin instalar sklearn):** Isolation Forest aísla puntos con particiones aleatorias: un outlier suele requerir **pocas** particiones (path corto → score alto de rareza). LOF compara la densidad local de un punto con la de sus vecinos: densidad mucho menor ⇒ score de rareza alto. Ambos piden scale previo y un `contamination` de capacidad, no de «tasa de fraude». Cuando el pipeline real use `IsolationForest` / `LocalOutlierFactor`, el mismo disclaimer `misconduct=False` aplica.",
 "Mecanismo stdlib: fijas un conjunto de **referencia** `ref` (normales conocidos del pasado o del batch limpio), calculas μ y σ solo sobre `ref`, y marcas `x > mu + 3*sd` en toda la serie. No asumas que «el último punto es el outlier» (`xs[:-1]`): en producción el índice no te avisa. `statistics.mean` / `pstdev` bastan; si `sd=0`, usa 1.0 para no dividir por cero.",
 "Contrato operativo. Entrada: serie sintética + `ref` explícito. Salida: flags binarios, method y `misconduct=False`. Error: pipe del flag a despido o bloqueo automático; o estimar μ/σ contaminando el fit con el propio outlier que buscas.",
 "Aplicación a `CASO-LIM-036-T3A`: xs=[10,11,10,12,50] con ref=xs[:4] → flag en 50. El valor 50 es raro respecto a la referencia, no «culpable»."
 ],
 code: {
 language: 'python',
 title: "anomaly_rule_sigma.py",
 code: `import statistics

def sigma_flags(xs, ref=None, z=3.0):
 ref = list(ref) if ref is not None else list(xs)
 mu = statistics.mean(ref)
 sd = statistics.pstdev(ref) or 1.0
 return mu, [1 if x > mu + z * sd else 0 for x in xs]

xs = [10, 11, 10, 12, 50]
mu, rule = sigma_flags(xs, ref=xs[:4])
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
 intro: "Te muestro 8 demos con números calculados de clustering, PCA prudente, anomalías σ y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético).",
 steps: [
 {
 demoId: "S36-T1-A-DEMO",
 subtopicId: "S36-T1-A",
 environment: "local-python",
 description: "Demo: z-score real y centroides 1D sobre el espacio escalado.",
 code: {
 language: 'python',
 title: "s36_t1_a_demo.py",
 code: `def centroid(xs):
 return sum(xs) / len(xs)

def zscore_list(xs):
 mu = sum(xs) / len(xs)
 var = sum((x - mu) ** 2 for x in xs) / len(xs)
 sd = var ** 0.5 or 1.0
 return [(x - mu) / sd for x in xs], True

raw = [1.0, 1.0, 5.0, 5.0]
scaled, did_scale = zscore_list(raw)
low, high = scaled[:2], scaled[2:]
print("c1", round(centroid(low), 2))
print("c2", round(centroid(high), 2))
print("scaled", did_scale)
`,
 output: `c1 -1.0
c2 1.0
scaled True`,
 },
 why: "Scale se calcula (no se inventa el flag); centroides en espacio z; sin veredicto de conducta.",
 },
 {
 demoId: "S36-T1-B-DEMO",
 subtopicId: "S36-T1-B",
 environment: "local-python",
 description: "Demo: argmax de k en dos seeds y bool de estabilidad.",
 code: {
 language: 'python',
 title: "s36_t1_b_demo.py",
 code: `def best_k(scores):
    return max(scores, key=scores.get)

seed_a = {2: 0.3, 3: 0.5}
seed_b = {2: 0.28, 3: 0.49}
k_a = best_k(seed_a)
k_b = best_k(seed_b)
print("k", k_a)
print("score", seed_a[k_a])
print("stable", k_a == k_b)
`,
 output: `k 3
score 0.5
stable True`,
 },
 why: "Multi-seed se computa como igualdad de k; k no sanciona personas.",
 },
 {
 demoId: "S36-T2-A-DEMO",
 subtopicId: "S36-T2-A",
 environment: "local-python",
 description: "Demo: scale por eje y proyección ponderada exploratoria.",
 code: {
 language: 'python',
 title: "s36_t2_a_demo.py",
 code: `def scale_pair(x, y, mu_x=0.0, sd_x=1.0, mu_y=0.0, sd_y=1.0):
    sx = (x - mu_x) / (sd_x or 1.0)
    sy = (y - mu_y) / (sd_y or 1.0)
    return sx, sy, True

def project_pc(x, y, w0=0.8, w1=0.2):
    return w0 * x + w1 * y

sx, sy, did_scale = scale_pair(2, 4, mu_x=0, sd_x=1, mu_y=0, sd_y=2)
print(round(project_pc(sx, sy), 2))
print("scaled", did_scale)
print("exploratory", True)
`,
 output: `2.0
scaled True
exploratory True`,
 },
 why: "Scale antes de proyectar; PCA toy es lupa, no juez.",
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
 intro: "S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo, E2 consolida el criterio y E3 transfiere a un caso cercano. Fixtures sintéticos CASO-LIM-036; sin PII real. Cada starter tiene un defect real (fórmula o contrato), no un TODO vacío. La ética fail-closed (anomalía ≠ culpa) ya está en el mapa: aquí practicas números y guards.",
 steps: [
 {
 id: "S36-T1-A-E1",
 subtopicId: "S36-T1-A",
 kind: "guided",
 instruction: "S36-T1-A-E1 · Centroide 1D: media de xs=[1,2] debe ser 1.5. Si vals está vacío, lanza ValueError (no dividas por cero). Imprime la media, n 2 y ok True. El starter suma sin dividir (defect). Fixture CASO-LIM-036-1A; no es veredicto de conducta.",
 hint: "Si not vals: raise ValueError; si no, sum(xs)/len(xs).",
 hints: ["Si not vals: raise ValueError; si no, sum(xs)/len(xs).", "No uses la suma cruda como centroide."],
 edgeCases: ["grupo vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036).",
 feedback: "S36-T1-A-E1: el centroide resume geometría; guarda el grupo vacío; no etiqueta culpa.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
xs = [1, 2]

def centroid(vals):
 # DEFECT: devuelve la suma, no la media; sin guard de vacío
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
 if not vals:
  raise ValueError("empty group")
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
 instruction: "S36-T1-A-E2 · z-score seguro: (x-mu)/sd con x=4, mu=0, sd=2 → 2.0. Si sd=0, usa 1.0. Imprime 2.0, safe_sd 2, ok True. Starter olvida dividir y no protege sd=0 (defect). CASO-LIM-036-1A.",
 hint: "safe_sd = sd if sd else 1.0; z = (x - mu) / safe_sd.",
 hints: ["safe_sd = sd if sd else 1.0; z = (x - mu) / safe_sd.", "Sin scale, gana la magnitud de la feature."],
 edgeCases: ["sd=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E2 (CASO-LIM-036).",
 feedback: "S36-T1-A-E2: scale-first con guard de sd=0.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
x, mu, sd = 4, 0, 2

def zscore(x, mu, sd):
 return x - mu # DEFECT: falta /sd y guard sd=0

print(zscore(x, mu, sd))
print("safe_sd", sd)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-a-e2.py",
 code: `x, mu, sd = 4, 0, 2

def zscore(x, mu, sd):
 safe_sd = sd if sd else 1.0
 return (x - mu) / safe_sd, safe_sd

z, safe_sd = zscore(x, mu, sd)
print(z)
print("safe_sd", safe_sd)
print("ok", True)
`,
 output: `2.0
safe_sd 2
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
 tests: "Salida alinea con solution output de S36-T1-A-E3 (CASO-LIM-036).",
 feedback: "S36-T1-A-E3: segmentar ≠ sancionar.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T1-B-E1 · Elige k con argmax en seed_a={2:0.2,3:0.6,4:0.5} y seed_b={2:0.22,3:0.58,4:0.51}. Imprime k 3, score 0.6 y multi_seed True si ambos seeds eligen el mismo k. Starter usa min en seed_a (defect). CASO-LIM-036-1B.",
 hint: "k = max(scores, key=scores.get) por seed; multi_seed = (k_a == k_b).",
 hints: ["k = max(scores, key=scores.get) por seed; multi_seed = (k_a == k_b).", "No uses min sobre scores de calidad interna."],
 edgeCases: ["empate de scores", "seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E1 (CASO-LIM-036).",
 feedback: "S36-T1-B-E1: argmax del score y multi_seed computado, no inventado.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
seed_a = {2: 0.2, 3: 0.6, 4: 0.5}
seed_b = {2: 0.22, 3: 0.58, 4: 0.51}
k_a = min(seed_a, key=seed_a.get) # DEFECT: debe ser max
k_b = max(seed_b, key=seed_b.get)
print("k", k_a)
print("score", seed_a[k_a])
print("multi_seed", k_a == k_b)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e1.py",
 code: `seed_a = {2: 0.2, 3: 0.6, 4: 0.5}
seed_b = {2: 0.22, 3: 0.58, 4: 0.51}
k_a = max(seed_a, key=seed_a.get)
k_b = max(seed_b, key=seed_b.get)
print("k", k_a)
print("score", seed_a[k_a])
print("multi_seed", k_a == k_b)
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
 instruction: "S36-T1-B-E2 · Multi-seed computado: seed_a={2:0.4,3:0.55,4:0.52}, seed_b={2:0.41,3:0.54,4:0.50}. Elige k por argmax en cada seed; imprime k, stable (k_a==k_b), sanction_from_metric False. Starter usa min en seed_a (defect). CASO-LIM-036-1B.",
 hint: "k = max(scores, key=scores.get) en cada seed; stable = k_a == k_b.",
 hints: ["k = max(scores, key=scores.get) en cada seed; stable = k_a == k_b.", "sanction_from_metric siempre False: métrica ≠ sanción."],
 edgeCases: ["seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E2 (CASO-LIM-036).",
 feedback: "S36-T1-B-E2: estabilidad multi-seed + métrica sin sanción.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
seed_a = {2: 0.4, 3: 0.55, 4: 0.52}
seed_b = {2: 0.41, 3: 0.54, 4: 0.50}
k_a = min(seed_a, key=seed_a.get) # DEFECT: debe ser max
k_b = max(seed_b, key=seed_b.get)
print("k", k_a)
print("stable", k_a == k_b)
print("sanction_from_metric", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e2.py",
 code: `seed_a = {2: 0.4, 3: 0.55, 4: 0.52}
seed_b = {2: 0.41, 3: 0.54, 4: 0.50}
k_a = max(seed_a, key=seed_a.get)
k_b = max(seed_b, key=seed_b.get)
print("k", k_a)
print("stable", k_a == k_b)
print("sanction_from_metric", False)
`,
 output: `k 3
stable True
sanction_from_metric False`,
 },
 },
 {
 id: "S36-T1-B-E3",
 subtopicId: "S36-T1-B",
 kind: "transfer",
 instruction: "S36-T1-B-E3 · Estabilidad: a partir de scores seed_a={2:0.2,3:0.6} y seed_b={2:0.25,3:0.58}, imprime stable True, k 3, ok True. Starter compara mal los k (defect). CASO-LIM-036-1B multi-seed.",
 hint: "stable = (best_k(a) == best_k(b)).",
 hints: ["stable = (best_k(a) == best_k(b)).", "Transfiere argmax a dos seeds."],
 edgeCases: ["seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E3 (CASO-LIM-036).",
 feedback: "S36-T1-B-E3: estabilidad entre seeds antes de fijar k.",
 starterCode: {
 language: 'python',
 title: "s36-t1-b-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
seed_a = {2: 0.2, 3: 0.6}
seed_b = {2: 0.25, 3: 0.58}
k_a = max(seed_a, key=seed_a.get)
k_b = max(seed_b, key=seed_b.get)
stable = k_a != k_b # DEFECT
print("stable", stable)
print("k", k_a)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-b-e3.py",
 code: `seed_a = {2: 0.2, 3: 0.6}
seed_b = {2: 0.25, 3: 0.58}
k_a = max(seed_a, key=seed_a.get)
k_b = max(seed_b, key=seed_b.get)
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
 tests: "Salida alinea con solution output de S36-T2-A-E1 (CASO-LIM-036).",
 feedback: "S36-T2-A-E1: proyección ponderada exploratoria.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T2-A-E2 · Lista pc para pts=[(1,1),(3,1)] y w=(1,0) → [1, 3]. Imprime pc, n 2, decision_model False. Starter usa w invertido (defect). CASO-LIM-036-2A.",
 hint: "Aplica el mismo w a cada punto.",
 hints: ["Aplica el mismo w a cada punto.", "No inviertas los pesos."],
 edgeCases: ["lista vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E2 (CASO-LIM-036).",
 feedback: "S36-T2-A-E2: batch de proyecciones exploratorias.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T2-A-E3 · Transfer: con w=(0.8,0.2) calcula weight_share_pc1 = |w0|/(|w0|+|w1|) → 0.8. Imprime use exploratory, weight_share_pc1 0.8, auto_reject False. Starter invierte la fracción (defect). CASO-LIM-036-2A.",
 hint: "share = abs(w0) / (abs(w0)+abs(w1)); PCA no auto-rechaza.",
 hints: ["share = abs(w0) / (abs(w0)+abs(w1)); PCA no auto-rechaza.", "Pesos fijos ≠ autovectores de producción."],
 edgeCases: ["w=(0,0)", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E3 (CASO-LIM-036).",
 feedback: "S36-T2-A-E3: masa del componente + scatter no juez.",
 starterCode: {
 language: 'python',
 title: "s36-t2-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
w0, w1 = 0.8, 0.2
mass = abs(w0) + abs(w1)
share = abs(w1) / mass # DEFECT: invierte el eje
print("use", "exploratory")
print("weight_share_pc1", share)
print("auto_reject", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-a-e3.py",
 code: `w0, w1 = 0.8, 0.2
mass = abs(w0) + abs(w1)
share = abs(w0) / mass
print("use", "exploratory")
print("weight_share_pc1", share)
print("auto_reject", False)
`,
 output: `use exploratory
weight_share_pc1 0.8
auto_reject False`,
 },
 },
 {
 id: "S36-T2-B-E1",
 subtopicId: "S36-T2-B",
 kind: "guided",
 instruction: "S36-T2-B-E1 · Guard de nombre de eje: axis_name='PC1_feature_mix'. Si el nombre contiene 'fraude' o 'culpa', axis_named_by_business True; si no, False. Imprime axis_named_by_business False, use exploratory, auto_label False. Starter marca True sin chequear (defect). CASO-LIM-036-2B.",
 hint: "named = any(tok in axis_name.lower() for tok in ('fraude','culpa')).",
 hints: ["named = any(tok in axis_name.lower() for tok in ('fraude','culpa')).", "auto_label False siempre en este lab."],
 edgeCases: ["PC2=fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E1 (CASO-LIM-036).",
 feedback: "S36-T2-B-E1: detecta narrativa mágica en el nombre del eje.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
axis_name = "PC1_feature_mix"
named = True # DEFECT: debe chequear tokens prohibidos
print("axis_named_by_business", named)
print("use", "exploratory")
print("auto_label", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e1.py",
 code: `axis_name = "PC1_feature_mix"
forbidden = ("fraude", "culpa")
named = any(tok in axis_name.lower() for tok in forbidden)
print("axis_named_by_business", named)
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
 instruction: "S36-T2-B-E2 · Higiene pre-review: features=[2.0, 4.0, 6.0] (sin None). missing_ok = no hay None; scale_ok = pstdev(features)>0 (hay dispersión para estandarizar). ready = scale_ok and missing_ok. Imprime ready True, scale_ok True, missing_ok True. Starter ignora los datos y fuerza scale_ok False (defect). CASO-LIM-036-2B.",
 hint: "missing_ok = all(x is not None for x in features); scale_ok = statistics.pstdev(features) > 0.",
 hints: ["missing_ok = all(x is not None for x in features); scale_ok = statistics.pstdev(features) > 0.", "ready = scale_ok and missing_ok antes de encolar el scatter."],
 edgeCases: ["missing silencioso", "sd=0"],
 tests: "Salida alinea con solution output de S36-T2-B-E2 (CASO-LIM-036).",
 feedback: "S36-T2-B-E2: ready se deriva de missingness y dispersión, no de un bool inventado.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
features = [2.0, 4.0, 6.0]
missing_ok = all(x is not None for x in features)
scale_ok = False # DEFECT: debe ser pstdev(features) > 0
ready = scale_ok and missing_ok
print("ready", ready)
print("scale_ok", scale_ok)
print("missing_ok", missing_ok)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e2.py",
 code: `import statistics
features = [2.0, 4.0, 6.0]
missing_ok = all(x is not None for x in features)
scale_ok = statistics.pstdev(features) > 0
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
 instruction: "S36-T2-B-E3 · Transfer: pc_vals=[1.2,1.8,8.2]; far = max(pc)-sum(pc)/len(pc) > 3.0. Si far, action review_queue y guilt False. Imprime guilt False, action review_queue, far True. Starter marca guilt True y auto_block (defect). CASO-LIM-036-2B.",
 hint: "far = max(pc) - mean(pc) > 3; guilt siempre False; action review_queue si far.",
 hints: ["far = max(pc) - mean(pc) > 3; guilt siempre False; action review_queue si far.", "Distancia en PC ≠ conducta indebida."],
 edgeCases: ["sancionar por scatter", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E3 (CASO-LIM-036).",
 feedback: "S36-T2-B-E3: outlier en PC encola review; nunca auto-culpa.",
 starterCode: {
 language: 'python',
 title: "s36-t2-b-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
pc = [1.2, 1.8, 8.2]
mean_pc = sum(pc) / len(pc)
far = max(pc) - mean_pc > 3.0
print("guilt", True) # DEFECT
print("action", "auto_block") # DEFECT
print("far", far)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t2-b-e3.py",
 code: `pc = [1.2, 1.8, 8.2]
mean_pc = sum(pc) / len(pc)
far = max(pc) - mean_pc > 3.0
print("guilt", False)
print("action", "review_queue" if far else "pass")
print("far", far)
`,
 output: `guilt False
action review_queue
far True`,
 },
 },
 {
 id: "S36-T3-A-E1",
 subtopicId: "S36-T3-A",
 kind: "guided",
 instruction: "S36-T3-A-E1 · Regla σ: xs=[1,1,1,10], z=3 con ref=xs[:3] (normales explícitos). Imprime flags con 1 solo al final, method rule_sigma, misconduct False. Starter usa z=0 (defect). CASO-LIM-036-3A.",
 hint: "flag si x > mu + z*sd con z=3 y μ,σ solo sobre ref.",
 hints: ["flag si x > mu + z*sd con z=3 y μ,σ solo sobre ref.", "No asumas que el outlier es el último índice; usa ref explícito."],
 edgeCases: ["sd=0", "ref vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E1 (CASO-LIM-036).",
 feedback: "S36-T3-A-E1: rareza legible con regla σ y ref explícito.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
xs = [1, 1, 1, 10]
ref = xs[:3]
mu = statistics.mean(ref)
sd = statistics.pstdev(ref) or 1
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
ref = xs[:3]
mu = statistics.mean(ref)
sd = statistics.pstdev(ref) or 1
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
 instruction: "S36-T3-A-E2 · Cuenta flags: de [0,0,1,0,1] imprime n_flags 2, review_only True, misconduct False. Starter suma mal (defect). CASO-LIM-036-3A.",
 hint: "n_flags = sum(flags).",
 hints: ["n_flags = sum(flags).", "review_only True: no hay auto-sanción."],
 edgeCases: ["lista vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E2 (CASO-LIM-036).",
 feedback: "S36-T3-A-E2: conteo de rareza para capacidad de cola.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T3-A-E3 · Transfer: flags=[0,0,1]; route = human_review si any(flags) else pass; auto_sanction siempre False. Imprime route human_review, ok True, auto_sanction False. Starter usa auto_fire y auto_sanction True (defect). CASO-LIM-036-3A.",
 hint: "route = 'human_review' if any(flags) else 'pass'; auto_sanction = False.",
 hints: ["route = 'human_review' if any(flags) else 'pass'; auto_sanction = False.", "Flag σ encola review, no despido."],
 edgeCases: ["despido automático", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E3 (CASO-LIM-036).",
 feedback: "S36-T3-A-E3: el flag computa la ruta; nunca auto-sanción.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
flags = [0, 0, 1]
route = "auto_fire" if any(flags) else "pass" # DEFECT
print("route", route)
print("ok", True)
print("auto_sanction", True) # DEFECT
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `flags = [0, 0, 1]
route = "human_review" if any(flags) else "pass"
print("route", route)
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
 tests: "Salida alinea con solution output de S36-T3-B-E1 (CASO-LIM-036).",
 feedback: "S36-T3-B-E1: contamination calibra carga, no fraude.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T3-B-E2 · Capacidad: capacity=8, expected=10 → overflow True, action lower_contamination, ok True. Starter overflow False (defect). CASO-LIM-036-3B.",
 hint: "overflow = expected > capacity.",
 hints: ["overflow = expected > capacity.", "Si overflow, baja contamination o prioriza."],
 edgeCases: ["capacity 0", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E2 (CASO-LIM-036).",
 feedback: "S36-T3-B-E2: alinea flags esperados a capacidad real.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T3-B-E3 · Novelty: ref=[10,11,10,12], x_new=50. kind='novelty' si abs(x_new-mu)/sd > 3 con μ,σ de ref; misconduct False. Imprime kind novelty, misconduct False, ok True. Starter usa kind outlier_as_guilt sin calcular z (defect). CASO-LIM-036-3B.",
 hint: "z = abs(x_new - mean(ref)) / (pstdev(ref) or 1); kind = novelty si z>3.",
 hints: ["z = abs(x_new - mean(ref)) / (pstdev(ref) or 1); kind = novelty si z>3.", "Nunca guilt automático."],
 edgeCases: ["confundir novelty con fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E3 (CASO-LIM-036).",
 feedback: "S36-T3-B-E3: novelty se calcula frente a ref; sin moralizar.",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
ref = [10, 11, 10, 12]
x_new = 50
print("kind", "outlier_as_guilt") # DEFECT: calcula z vs ref
print("misconduct", True)
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-b-e3.py",
 code: `import statistics
ref = [10, 11, 10, 12]
x_new = 50
mu = statistics.mean(ref)
sd = statistics.pstdev(ref) or 1.0
z = abs(x_new - mu) / sd
kind = "novelty" if z > 3 else "in_distribution"
print("kind", kind)
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
 instruction: "S36-T4-A-E1 · mean_flag_rate de [0.1,0.2,0.3] → 0.2. Imprime 0.2, backtest True, leakage False. Starter usa max (defect). CASO-LIM-036-4A.",
 hint: "media = sum(rates)/len(rates).",
 hints: ["media = sum(rates)/len(rates).", "leakage False en backtest temporal."],
 edgeCases: ["ventana vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E1 (CASO-LIM-036).",
 feedback: "S36-T4-A-E1: media de flag rates en ventanas.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T4-A-E2 · Anti-leakage: train_months=['2026-01'] y test_month='2026-02'. has_leakage = test_month in train_months. Imprime leakage False, order temporal, ok True. Starter mete el test en train (defect). CASO-LIM-036-4A.",
 hint: "has_leakage(train, test) es True solo si test ∈ train.",
 hints: ["has_leakage(train, test) es True solo si test ∈ train.", "No mezcles futuro en el fit."],
 edgeCases: ["test dentro de train", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E2 (CASO-LIM-036).",
 feedback: "S36-T4-A-E2: split temporal honesto con predicado computado.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
train_months = ["2026-01", "2026-02"] # DEFECT: test no debe estar en train
test_month = "2026-02"

def has_leakage(train, test):
 return test in train

print("leakage", has_leakage(train_months, test_month))
print("order", "temporal")
print("ok", True)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-a-e2.py",
 code: `train_months = ["2026-01"]
test_month = "2026-02"

def has_leakage(train, test):
 return test in train

print("leakage", has_leakage(train_months, test_month))
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
 instruction: "S36-T4-A-E3 · Spike: rates=[0.1,0.5] → spike True si max-min>=0.3, action investigate, ok True. Starter umbral mal (defect). CASO-LIM-036-4A.",
 hint: "spike si max(rates)-min(rates) >= 0.3.",
 hints: ["spike si max(rates)-min(rates) >= 0.3.", "Investiga antes de ampliar cola."],
 edgeCases: ["rates constantes", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E3 (CASO-LIM-036).",
 feedback: "S36-T4-A-E3: estabilidad de flag rate entre ventanas.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T4-B-E1 · P@k: ranked=[1,0,1,0], k=2 → 0.5. Imprime 0.5, k 2, auto_guilt False. Starter usa k=4 (defect). CASO-LIM-036-4B.",
 hint: "P@k = sum(ranked[:k])/k.",
 hints: ["P@k = sum(ranked[:k])/k.", "auto_guilt False."],
 edgeCases: ["k=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E1 (CASO-LIM-036).",
 feedback: "S36-T4-B-E1: precision@k con labels de utilidad.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
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
 instruction: "S36-T4-B-E2 · HITL por escasez: n_labels=5, n_flags=40. human_in_loop = n_labels < n_flags (o True si labels scarce). Imprime True, ok True, labels scarce. Starter apaga HITL con False fijo (defect). CASO-LIM-036-4B.",
 hint: "human_in_loop = True cuando n_labels < n_flags (régimen scarce).",
 hints: ["human_in_loop = True cuando n_labels < n_flags (régimen scarce).", "Sin humano no hay gate responsable."],
 edgeCases: ["automatizar sanción", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E2 (CASO-LIM-036).",
 feedback: "S36-T4-B-E2: HITL se deriva de la escasez de labels.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
n_labels, n_flags = 5, 40
human_in_loop = False # DEFECT: debe ser n_labels < n_flags
labels = "scarce" if n_labels < n_flags else "dense"
print(human_in_loop)
print("ok", True)
print("labels", labels)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-b-e2.py",
 code: `n_labels, n_flags = 5, 40
human_in_loop = n_labels < n_flags
labels = "scarce" if n_labels < n_flags else "dense"
print(human_in_loop)
print("ok", True)
print("labels", labels)
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
 instruction: "S36-T4-B-E3 · Elige métrica: n_labels=3, n_total=100. Si n_labels/n_total < 0.1 usa precision_at_k; si no, global_accuracy. Imprime precision_at_k, ok True, n 1. Starter siempre devuelve global_accuracy (defect). CASO-LIM-036-4B.",
 hint: "choose_metric = 'precision_at_k' si n_labels/n_total < 0.1.",
 hints: ["choose_metric = 'precision_at_k' si n_labels/n_total < 0.1.", "global_accuracy engaña con labels ralos."],
 edgeCases: ["ROC fantasma", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E3 (CASO-LIM-036).",
 feedback: "S36-T4-B-E3: la métrica se elige por escasez de labels.",
 starterCode: {
 language: 'python',
 title: "s36-t4-b-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
n_labels, n_total = 3, 100

def choose_metric(n_labels, n_total):
 return "global_accuracy" # DEFECT: ignora umbral de escasez

print(choose_metric(n_labels, n_total))
print("ok", True)
print("n", 1)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-b-e3.py",
 code: `n_labels, n_total = 3, 100

def choose_metric(n_labels, n_total):
 if n_total <= 0:
  return "precision_at_k"
 if n_labels / n_total < 0.1:
  return "precision_at_k"
 return "global_accuracy"

print(choose_metric(n_labels, n_total))
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
 "Construye un mini-pipeline de clustering/anomalías sobre CASO-LIM-036 (sintético): scale → centroides o flags σ → backtest de flag_rate → P@k con HITL. Sin concluir conducta indebida.",
 objectives: [
 "Scale + cluster/centroides con disclaimer ético",
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

def scale(xs):
 mu = statistics.mean(xs)
 sd = statistics.pstdev(xs) or 1.0
 return [(x - mu) / sd for x in xs]

def centroid(xs):
 return sum(xs) / len(xs)

def project_pc(x, y, w0=0.8, w1=0.2):
 # PCA toy: pesos fijos documentados; no son autovectores de producción
 return w0 * x + w1 * y

def sigma_flags(xs, ref=None, z=3.0):
 # Fit μ,σ solo en ref (train); no uses el mes de test
 ref = list(ref) if ref is not None else list(xs)
 mu = statistics.mean(ref)
 sd = statistics.pstdev(ref) or 1.0
 return [x > mu + z * sd for x in xs]

def mean_flag_rate(windows):
 return sum(r for _, r in windows) / len(windows)

def has_leakage(train_months, test_month):
 return test_month in train_months

def precision_at_k(ranked, k):
 return sum(ranked[:k]) / k

if __name__ == "__main__":
 xs = scale([1.0, 1.2, 5.0, 5.2])
 print("c", centroid(xs[:2]))
 print("pc_toy", round(project_pc(xs[0], xs[1]), 2))
 print("decision_model", False)
 train, test_series = [10, 11, 10, 12], [10, 11, 10, 12, 50]
 print("flags", sigma_flags(test_series, ref=train))
 print("mean_flag_rate", mean_flag_rate([("2026-01", 0.1), ("2026-02", 0.12)]))
 print("leakage", has_leakage(["2026-01"], "2026-02"))
 print("p_at_2", precision_at_k([1, 0, 1], 2))
 print("auto_guilt", False)
`,
 portfolioNote:
 "Señales CP-N3-C; evidencia de utilidad de cola (P@k + HITL). No PASS automático de carrera ni veredicto moral.",
 rubric: [
 { criterion: "Señales auxiliares al triage (cola de review, sin auto-culpa)", weight: "25%" },
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
