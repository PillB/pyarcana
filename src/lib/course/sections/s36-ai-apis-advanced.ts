/**
 * S36 — Clustering, anomalías y validación temporal
 *
 * The filename and the exported id ("ai-apis-advanced") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section36: CourseSection = {
 id: "ai-apis-advanced",
 index: 36,
 title: "Clustering, anomalías y validación temporal",
 shortTitle: "Clustering y anomalías",
 tagline: "Señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida.",
 estimatedHours: 9,
 level: "Integración avanzada",
 phase: 2,
 icon: "ScanSearch",
 accentColor: "bg-gradient-to-br from-indigo-400 to-violet-900",
 jobRelevance:
 "En un workbench de riesgo operativo en Lima (colas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita señales auxiliares que acorten la cola de revisión; son apoyo, no un juez automático. Aquí aprendes a usar clustering, rareza y backtests temporales para priorizar qué mirar primero, midiendo si la señal ahorra tiempo al revisor (P@k: precisión en los k primeros del ranking). Si falta revisor o contrato, el sistema aplica fail-closed (cierra el flujo y no emite decisión automática), porque anomalía no es conducta indebida ni fraude.",
 learningOutcomes: [
 { text: "Escalar features, ejecutar un micro-paso assign–update de centroides 1D (núcleo de k-means) y marcar núcleos density (eps/min_samples) sin tratar el cluster como culpa." },
 { text: "Elegir k comparando seeds y reportar límites de métricas internas (no sancionar por silhouette)." },
 { text: "Proyectar con PCA toy (pesos fijos documentados, scale previo) solo para exploración visual." },
 { text: "Interpretar proyecciones con prudencia y sin autoetiquetar culpa." },
 { text: "Detectar rareza con reglas σ y un micro-modelo de path length (idea de Isolation Forest), sabiendo cuándo IF/LOF de sklearn aplica en producción, sin veredicto de conducta." },
 { text: "Distinguir novelty vs. outlier y calibrar contamination a capacidad de revisión." },
 { text: "Validar con backtests temporales: fit de normalidad en el pasado y score en el futuro, sin leakage." },
 { text: "Evaluar con etiquetas escasas vía precision@k y revisión humana obligatoria." }
 ],
 theory: [
 {
 heading: "Encontrar estructura cuando nadie etiquetó nada",
 figure: {
   id: "S36-k-vs-density",
   caption:
     "k-means te pide cuántos grupos hay; density te pide qué tan cerca es cerca.",
   alt:
     "Tabla que compara k-means y clustering por densidad segun lo que cada uno exige de entrada.",
 },
 paragraphs: [
 "Hasta ahora cada modelo aprendió de ejemplos ya juzgados: esto necesitaba revisión, esto no. Aquí desaparece esa guía. Tienes registros y ninguna etiqueta, y la pregunta cambia de «¿a cuál de estas categorías pertenece?» a «¿qué grupos hay aquí, y cuáles se salen de todos ellos?».",
 "Agrupar por parecido se llama **clustering**, y no es un algoritmo sino una familia de ellos, que se diferencian sobre todo en qué te piden de entrada. El más común —k-means, con el que empezamos aquí— te pide el número de grupos, y su mecanismo es más simple de lo que sugiere el nombre. Eliges cuántos grupos quieres y colocas los primeros puntos de referencia donde puedas —al azar entre los datos, o con `k-means++`, que los separa a propósito—, porque el promedio de un grupo no existe hasta que hay miembros que promediar. A partir de ahí el ciclo se sostiene solo: hay un punto de referencia en cada grupo —el **centroide**, que es sencillamente el promedio de sus miembros—, asignas cada dato al centroide más cercano y recalculas los promedios. Repites hasta que nada se mueve. Conviene decirlo antes de que la costumbre lo olvide: un centroide es un promedio de coordenadas —la media aritmética de sus miembros, punto por punto—, no una categoría moral. Y conviene no llamarlo «promedio geométrico», porque en estadística ese nombre está tomado: la media geométrica es la raíz n-ésima del producto, y no es lo que k-means calcula.",
 "Todo esto se apoya en medir distancias, y ahí hay una trampa de escala. Si una columna va de 0 a 1 y otra de 0 a 100 000, la segunda domina la distancia y la primera deja de existir para el algoritmo. Poner las features en una escala comparable antes de medir no es un paso opcional de limpieza: decide qué agrupa el modelo.",
 "La otra mitad de la sección busca lo contrario del grupo: el punto que no encaja. Aquí es donde más fácil se resbala el lenguaje. Que un registro sea **raro** significa que se parece poco al resto — nada más. La frecuencia no es evidencia de conducta, y el parámetro que fija qué fracción marcar es una decisión sobre el tamaño de la cola, no una estimación de cuántos casos son ilícitos. Confundir esas dos cosas es cómo un sistema estadístico se convierte en una acusación.",
 "Y como no hay etiquetas, tampoco hay una métrica que diga si acertaste. Lo que se puede medir es la utilidad para quien revisa: de los primeros k casos que el sistema puso arriba, ¿cuántos valieron el tiempo? La pregunta que atraviesa la sección se sostiene sobre esa distinción: **¿esto es raro, o simplemente poco frecuente — y quién decide qué significa?** La respuesta a la última parte es siempre una persona.",
 ],
 callout: {
 type: "warning",
 title: "Señal auxiliar, nunca veredicto",
 content:
 "Clustering y rareza alimentan la cola de revisión como señales de apoyo. No se traducen solas en fraude, parentesco ni sanción, y si falta evidencia o revisor humano, no se emite ninguna acción automática.",
 },
 },
 {
 heading: "Contrato de la sección (referencia)",
 optional: true,
 paragraphs: [
 "Bloque de referencia. Entrada, salida, orden de los subtemas y errores que bloquean el gate.",
 "**Contrato.** Recibes features sintéticas del caso, la capacidad de la cola de revisión y unas pocas etiquetas. Entregas clusters y scores de rareza con su aviso ético, un backtest temporal —ajustar la normalidad solo con el pasado y puntuar el futuro— y la precisión sobre los primeros k. El gate se bloquea si se trata la anomalía como culpa, si el parámetro de contaminación se lee como tasa de fraude, o si el ajuste usa datos del futuro.",
 "**Orden de los subtemas.** T1 clustering. T2 reducción de dimensión y PCA, para explorar y no para decidir. T3 anomalías y novedad. T4 tiempo y etiquetas escasas.",
 "**Puente entre secciones.** En S35 armaste la ficha del caso con sus cuatro capas; aquí agregas scores no supervisados a la capa del modelo, sin tocar la decisión humana. En S37 medirás lo que cuesta generarlos y en S39 se integran al triage responsable.",
 "**Stack.** Biblioteca estándar (`statistics`, listas). sklearn se cita como referencia profesional, sin exigirlo en los ejercicios.",
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
 },
 {
 heading: "Escalamiento y centroides 1D (núcleo de k-means / density)",
 figure: {
   id: "S36-scale-trap",
   caption:
     "La distancia euclídea suma ambas: la segunda domina por completo, y el clúster solo agrupa por monto.",
   alt:
     "Dos barras que comparan el rango de una columna de 0 a 1 con otra de 0 a 100 000.",
 },
 subtopicId: "S36-T1-A",
 paragraphs: [
 "Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs. conteos de eventos). El núcleo didáctico es un **toy 1D**: z-score, un paso **assign → update** de centroides (el corazón de k-means) y, en paralelo, una idea density-based. Los centroides y los núcleos de densidad son resúmenes geométricos, no etiquetas de fraude ni de parentesco.",
 "Cómo se mueve el algoritmo: el z-score `z = (x-μ)/σ` pone cada feature en escala comparable (`σ=0` → 1.0). Luego (1) **assign**: cada punto se etiqueta con el índice del centroide más cercano en 1D (`argmin |x − c_i|`); (2) **update**: cada centroide se recalcula como media de su grupo. Un solo ciclo basta para ver el contrato; en 2D+ y en sklearn el bucle se repite hasta convergencia (CS229). Aquí no fingimos «k-means completo de producción»: mostramos el núcleo ejecutable sin librerías pesadas. Si un grupo queda vacío, se conserva el centroide previo (no se inventa un `0.0`).",
 "**Density (operable en stdlib):** un método density-based (p. ej. DBSCAN) marca como núcleo los puntos con ≥`min_samples` vecinos en radio `eps`, **contando el propio punto** (misma convención que sklearn). No eliges k; eliges densidad. Micro-contrato: `n_inc = sum(1 for y in xs if abs(x-y) <= eps)`; es núcleo si `n_inc >= min_samples`. En producción usarías `DBSCAN(eps=..., min_samples=...)` **después** de scale. Este lab solo calcula la máscara de núcleos; no expande clústeres ni etiqueta ruido como DBSCAN completo.",
 "Qué debe salir del micro-lab: z-scores, labels del assign, centroides actualizados, máscara density y `scaled=True` solo si el z-score se calculó; `verdict=False` siempre. Falla si imprimes `scaled True` sin escalar, mezclas montos crudos con conteos, o publicas el `id` de cluster como sanción.",
 "En `CASO-LIM-036-T1A` (Red Andina sintética): xs=[1.0,1.2,5.0,5.2,5.1] se escala; un assign–update con k=2 separa bajo/alto en el espacio z; density con `eps` y `min_samples=3` (incluye el propio punto) marca núcleos locales. Sirve para segmentar la cola de revisión (volumen o densidad), nunca para culpar. En fintech peruana de laboratorio, escalar mal distorsiona colas AML sintéticas."
 ],
 code: {
 language: 'python',
 title: "kmeans1d_assign_update.py",
 code: `def centroid_1d(xs):
 if not xs:
  raise ValueError("empty group")
 return sum(xs) / len(xs)

def zscore_list(xs):
 mu = sum(xs) / len(xs)
 var = sum((x - mu) ** 2 for x in xs) / len(xs)
 sd = var ** 0.5 or 1.0
 return [(x - mu) / sd for x in xs], True

def assign_1d(xs, cents):
 # Cada punto → índice del centroide más cercano (núcleo de k-means)
 return [min(range(len(cents)), key=lambda i: abs(x - cents[i])) for x in xs]

def update_centroids(xs, labels, k, prev=None):
 # Grupo vacío: conserva prev[i]; no inventa 0.0
 groups = [[] for _ in range(k)]
 for x, lab in zip(xs, labels):
  groups[lab].append(x)
 out = []
 for i, g in enumerate(groups):
  if g:
   out.append(centroid_1d(g))
  elif prev is not None:
   out.append(prev[i])
  else:
   raise ValueError("empty cluster without previous centroid")
 return out

def density_core_1d(xs, eps=0.5, min_samples=3):
 # Idea DBSCAN 1D (sklearn): min_samples cuenta el propio punto
 core = []
 for x in xs:
  n_inc = sum(1 for y in xs if abs(x - y) <= eps)
  core.append(n_inc >= min_samples)
 return core

xs = [1.0, 1.2, 5.0, 5.2, 5.1]
xs_scaled, did_scale = zscore_list(xs)
cents0 = [xs_scaled[0], xs_scaled[-1]]  # init: extremos
labels = assign_1d(xs_scaled, cents0)
cents1 = update_centroids(xs_scaled, labels, 2, prev=cents0)
core = density_core_1d(xs_scaled, eps=0.5, min_samples=3)
print("labels", labels)
print("c1", round(cents1[0], 2), "c2", round(cents1[1], 2))
print("core_density", core)
print("scaled", did_scale)
print("verdict", False)
`,
 output: `labels [0, 0, 1, 1, 1]
c1 -1.22 c2 0.82
core_density [False, False, True, True, True]
scaled True
verdict False`,
 },
 callout: {
 type: "tip",
 title: "Escala primero",
 content:
 "Sin scale, gana la feature con mayor magnitud. Escala, assign–update y documenta; el centroide no es una etiqueta moral.",
 },
 },
 {
 heading: "Elección de k, estabilidad multi-seed y límites de métricas",
      figure: {
        id: "S36-rolling-origin",
        caption:
          "Tres pliegues, cada uno con su propio origen. La ventana de entrenamiento solo crece hacia atrás, y lo que queda a la derecha de cada pliegue todavía no había ocurrido cuando ese pliegue tuvo que predecir.",
        alt:
          "Tres filas apiladas sobre un eje de tiempo. En cada fila, un bloque verde de entrenamiento seguido de un bloque naranja de validación, y después un bloque punteado que representa el futuro aún no disponible. El bloque verde crece en cada fila sucesiva.",
      },
 subtopicId: "S36-T1-B",
 paragraphs: [
 "Elige **k** con estabilidad multi-seed y sentido de negocio (capacidad de cola), no solo maximizando silhouette. Las métricas internas fallan con formas raras, solapamiento y desbalance: un score alto puede ser un espejismo geométrico. Reporta sensibilidad a seed en el notebook de señales del triage sintético.",
 "Dado un mapa `k → score` (p. ej. silhouette sintético), tomas `argmax` por seed. El lab computa un **acuerdo de k**: `stable = (k_seed_a == k_seed_b)`. Eso no es estabilidad de partición: en producción repetirías k-means real y medirías ARI o jitter de centroides. Un silhouette alto **no** legitima sanción: solo sugiere una partición útil para priorizar revisión.",
 "Entrada: dos mapas k→score (seed A y seed B). Salida: k de cada seed, `stable` si el k elegido coincide, y el k propuesto solo si hay acuerdo. Error: fijar k con un solo seed o vender un k inestable como «óptimo» del negocio.",
 "En `CASO-LIM-036-T1B`: seed A {2:0.4, 3:0.55, 4:0.52} y seed B {2:0.41, 3:0.54, 4:0.50} → ambos eligen k=3 (`stable True` = acuerdo de k). Datos inventados; no hay etiquetas de «culpable»."
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
 "Orden honesto del toy: (1) z-score por coordenada para que un eje en soles no aplaste a otro en conteos; (2) comprimir cada punto a `pc = w0*x + w1*y`. Un proxy legible de «cuánto pesa el primer eje» es `|w0|/(|w0|+|w1|)` — masa del componente, **no** la varianza explicada de autovalores reales. Con `decision_model=False`, el *scatter* no dispara autorrechazo ni encola sanción.",
 "Qué entra y qué sale: puntos sintéticos crudos + pesos documentados → puntos escalados, lista pc, weight_share del primer eje y `scaled=True` solo si el z-score por eje se calculó. Falla el contrato si proyectas sin scale, clasificas culpa en el *scatter* o presentas pesos fijos como autovectores de producción.",
 "En `CASO-LIM-036-T2A` (Red Andina sintética), w=(0.8,0.2) sobre puntos toy **después** de scale produce la lista pc y weight_share≈0.8. Sirve solo para explorar el espacio de features del lab: el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales, no en el eje proyectado."
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
 "No clasifiques culpa en el *scatter* (diagrama de dispersión). PCA es lupa, no juez.",
 },
 },
 {
 heading: "Interpretación prudente de proyecciones",
 subtopicId: "S36-T2-B",
 paragraphs: [
 "Los ejes PC **no** traen nombre de negocio automático: no inventes «PC2 = riesgo moral». Un outlier visual puede ser escala mal hecha, un error de datos o un segmento legítimo raro — no un villano. Documenta el uso como exploratorio en el dossier de señales del triage sintético.",
 "Antes de narrar, **calcula** distancia en el eje: `far = max(pc) - mean(pc) > umbral`. Si `far`, la acción es `review_queue`, nunca `auto_block`. En paralelo, un guard de nombre prohíbe tokens como «fraude» o «culpa» en el label del eje. La historia de negocio se valida con features originales y un humano.",
 "Checklist del *scatter*: con lista pc, nombre de eje y umbral calculas `far`, eliges `action` y verificas que el eje no se llame con tokens de culpa; `auto_label=False`. No autoetiquetes clusters como «sospechosos» ni uses el *plot* como prueba de conducta.",
 "En `CASO-LIM-036-T2B`: pc=[1.2,1.8,8.2] está lejos del centro → encola revisión; guilt siempre False. Fail-closed: duda → más evidencia o HITL, no sanción."
 ],
 code: {
 language: 'python',
 title: "pca_interpret_guard.py",
 code: `def far_from_mean(pc, thresh=3.0):
 mean_pc = sum(pc) / len(pc)
 return max(pc) - mean_pc > thresh

def axis_named_by_business(axis_name):
 forbidden = ("fraude", "culpa")
 return any(tok in axis_name.lower() for tok in forbidden)

pc = [1.2, 1.8, 8.2]
axis_name = "PC1_feature_mix"
far = far_from_mean(pc, 3.0)
named = axis_named_by_business(axis_name)
action = "review_queue" if far else "pass"
print("far", far, "action", action)
print("axis_named_by_business", named)
print("auto_label", False)
print("guilt", False)
`,
 output: `far True action review_queue
axis_named_by_business False
auto_label False
guilt False`,
 },
 callout: {
 type: "danger",
 title: "Lectura mágica",
 content:
 "No inventes historias en PC2. Distancia en el eje encola revisión; sin evidencia en features originales, no hay narrativa de negocio.",
 },
 },
 {
 heading: "Isolation Forest / LOF (idea + path length) y reglas σ",
 subtopicId: "S36-T3-A",
 paragraphs: [
 "Isolation Forest y LOF generan scores de rareza en producción. En el lab stdlib enseñamos el **contrato** con dos piezas legibles: (1) regla σ (`x > μ+3σ` con `ref` explícito) y (2) un *path length* toy que imita la idea de Isolation Forest sin sklearn. Score alto o path corto ⇒ candidato a revisión, no culpa.",
 "**IF / LOF (tabla mental + micro-demo):** Isolation Forest aísla puntos con cortes (particiones): un outlier suele quedar solo tras **pocos** cortes (path corto → más «fácil de aislar»). LOF compara densidad local del punto con la de sus vecinos: densidad mucho menor ⇒ rareza alta. LOF pide scale previo, porque compara distancias entre vecinos y una columna de rango grande domina la métrica. Isolation Forest no lo necesita del mismo modo: parte cada eje entre su propio mínimo y máximo, así que reescalar una feature de forma afín —un z-score, por ejemplo— no cambia las longitudes de camino ni, por tanto, el score. Y en ambos, `contamination` expresa la capacidad de revisión disponible, no una «tasa de fraude» estimada. En producción: `IsolationForest` / `LocalOutlierFactor` con el mismo `misconduct=False`. El toy de un solo camino con cortes fijos **no** es el ensamble real de Isolation Forest.",
 "Regla σ: fijas `ref` (normales del pasado o batch limpio), calculas μ y σ solo sobre `ref`, y marcas `x > mu + 3*sd` en la serie. **No** asumas «el último índice es el outlier» (`xs[:-1]`): el reloj y el índice no te avisan. Si `sd=0`, usa 1.0.",
 "Piezas del lab: serie + `ref` explícito + (opcional) umbrales de corte → flags σ, path lengths del toy IF, method y `misconduct=False`. Prohibido: conectar el flag a un despido automático, o estimar μ/σ contaminando el fit con el propio outlier.",
 "En `CASO-LIM-036-T3A`: xs=[10,11,10,12,50], ref=xs[:4] → flag en 50; el *path length* del 50 es más corto que el de un 10 típico. Raro respecto a la referencia, no «culpable»."
 ],
 code: {
 language: 'python',
 title: "anomaly_sigma_and_path.py",
 code: `import statistics

def sigma_flags(xs, ref=None, z=3.0):
 ref = list(ref) if ref is not None else list(xs)
 mu = statistics.mean(ref)
 sd = statistics.pstdev(ref) or 1.0
 return mu, [1 if x > mu + z * sd else 0 for x in xs]

def path_length_toy(x, pool, cuts):
 # Idea IF: cuántos cortes hasta aislar x (path corto ⇒ más raro)
 active = list(pool)
 depth = 0
 for t in cuts:
  depth += 1
  left = [v for v in active if v < t]
  right = [v for v in active if v >= t]
  active = left if x < t else right
  if len(active) <= 1:
   break
 return depth

xs = [10, 11, 10, 12, 50]
mu, rule = sigma_flags(xs, ref=xs[:4])
cuts = [15, 30, 40]  # umbrales didácticos fijos (no aleatorios)
path_normal = path_length_toy(10, xs, cuts)
path_rare = path_length_toy(50, xs, cuts)
print("mu", mu, "flags", rule)
print("path_normal", path_normal, "path_rare", path_rare)
print("method", "rule_sigma+path_toy")
print("misconduct", False)
`,
 output: `mu 10.75 flags [0, 0, 0, 0, 1]
path_normal 3 path_rare 1
method rule_sigma+path_toy
misconduct False`,
 },
 callout: {
 type: "tip",
 title: "Regla + path + modelo",
 content:
 "Explica al humano con regla σ o con «se aisló en pocos cortes». El score solo no basta para la cola.",
 },
 },
 {
 heading: "Novelty vs. outlier y contamination (capacidad de cola)",
 subtopicId: "S36-T3-B",
 paragraphs: [
 "**Outlier:** punto raro respecto al train. **Novelty:** punto nuevo comparado con un modelo de normalidad ya fijado. **contamination** es una hipótesis de fracción a marcar, no la prevalencia de fraude del negocio. Ajústala a la capacidad real de la cola de revisión sintética del lab.",
 "La aritmética es simple y el error de negocio es grave: `expected_flags = int(n * contamination)`. Si esa cantidad supera la capacidad de analistas, `overflow=True` y la acción es bajar *contamination* o priorizar con otra señal — no «descubrir más fraude». Nunca digas «contamination=0.05 ⇒ 5% de fraude».",
 "Entrada del lab: n del batch, contamination y capacity. Salida: expected_flags, overflow y `is_fraud_rate=False`. Falla el contrato si vendes contamination como tasa de ilícitos o encolas más de lo que el humano puede revisar con calidad.",
 "En `CASO-LIM-036-T3B`, n=200 y contamination=0.05 → expected_flags=10; con capacity=8 hay overflow y toca recalibrar. use=capacity_tuning: solo control de rareza y de carga de la cola ficticia."
 ],
 code: {
 language: 'python',
 title: "contam_capacity.py",
 code: `def expected_flags(n: int, contamination: float) -> int:
 return int(n * contamination)

contamination = 0.05
n = 200
capacity = 8
exp = expected_flags(n, contamination)
overflow = exp > capacity
print("expected_flags", exp)
print("overflow", overflow)
print("action", "lower_contamination" if overflow else "ok")
print("contamination_is_fraud_rate", False)
print("use", "capacity_tuning")
`,
 output: `expected_flags 10
overflow True
action lower_contamination
contamination_is_fraud_rate False
use capacity_tuning`,
 },
 callout: {
 type: "warning",
 title: "contamination≠fraude",
 content:
 "Solo control de rareza y de carga de cola. Nunca presentes contamination como tasa de fraude real.",
 },
 },
 {
 heading: "Splits, backtests y ventanas temporales",
 subtopicId: "S36-T4-A",
 paragraphs: [
 "Valida señales con **backtest temporal**: el fit de normalidad (μ, σ) vive **solo en el pasado**; el score se aplica al futuro. Ventanas deslizantes miden estabilidad de la tasa de flags. Sin etiquetas densas, un proxy de utilidad (clic de revisión sintético) basta; el *leakage* de futuro en el fit invalida el experimento.",
 "Dos capas del contrato: (1) **fit → score**: `train` de meses pasados define μ y σ; `future` se marca con esa normalidad; (2) **ventanas**: serie `(mes, flag_rate)` → media y detección de spikes. `has_leakage` es True solo si el mes de test aparece en train (chequeo de mes duplicado; el orden cronológico del split lo defines tú al armar train/future). Un spike se investiga (drift, bug de scale) antes de ampliar la cola.",
 "El split temporal del caso produce: flags del future (con μ/σ del pasado), mean_flag_rate de ventanas, `backtest=True` y `leakage=False`. Rompes el experimento si el mes evaluado entra al fit o barajas filas como si el tiempo no existiera.",
 "En `CASO-LIM-036-T4A`: train=[10,11,10,12], future=[11,10,50] → flag solo en 50; rates 0.1, 0.12, 0.09 → mean≈0.103. Series sintéticas; el reloj del caso manda."
 ],
 code: {
 language: 'python',
 title: "backtest_fit_score.py",
 code: `import statistics

def fit_mu_sd(train):
 mu = statistics.mean(train)
 sd = statistics.pstdev(train) or 1.0
 return mu, sd

def score_future(future, mu, sd, z=3.0):
 return [1 if x > mu + z * sd else 0 for x in future]

def mean_flag_rate(windows):
 rates = [r for _, r in windows]
 return sum(rates) / len(rates)

def has_leakage(train_months, test_month):
 return test_month in train_months

train = [10, 11, 10, 12]
future = [11, 10, 50]
mu, sd = fit_mu_sd(train)
flags = score_future(future, mu, sd)
windows = [("2026-01", 0.1), ("2026-02", 0.12), ("2026-03", 0.09)]
print("flags", flags)
print("mean_flag_rate", round(mean_flag_rate(windows), 3))
print("leakage", has_leakage(["2026-01"], "2026-02"))
print("backtest", True)
`,
 output: `flags [0, 0, 1]
mean_flag_rate 0.103
leakage False
backtest True`,
 },
 callout: {
 type: "tip",
 title: "Tiempo",
 content:
 "Fit en el pasado, score en el futuro. El reloj del caso sintético manda en el split.",
 },
 },
 {
 heading: "Labels escasos, precision@k y revisión humana",
 subtopicId: "S36-T4-B",
 paragraphs: [
 "Con pocas etiquetas, **precision@k** y el acuerdo humano importan más que un ROC fantasma. El revisor valida si la señal ahorra tiempo en la cola. Nunca: anomalía → conducta indebida automática. El HITL es parte del contrato, no un adorno del dashboard.",
 "Tomas un ranking binario de utilidad (1 = el revisor dijo «me sirvió») y miras solo los top-k: `P@k = sum(ranked[:k])/k`. Si `n_labels` es mucho menor que `n_flags`, el régimen es scarce y `human_in_loop` debe ser True; `auto_guilt` permanece False siempre.",
 "Entrada: ranking sintético de utilidad y k (y, en el lab, conteos de etiquetas vs. flags). Salida: precision_at_k + política HITL. Error de diseño: optimizar *accuracy* global con etiquetas ralas o apagar el humano «para ir más rápido».",
 "En `CASO-LIM-036-T4B`, ranked=[1,0,1,0,0] con k=3 → P@k≈0.667. La métrica de negocio del lab es «¿ayudó a la cola sintética?», no un veredicto moral sobre personas."
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
 description: "Demo: z-score, assign–update 1D y núcleos density en espacio escalado.",
 preamble:
  "Antes de encolar casos del workbench sintético Red Andina, el analista necesita **segmentar por geometría**, no por culpa. En esta demo una serie `raw=[1.0,1.2,5.0,5.2,5.1]` se escala con z-score; un paso assign–update con k=2 separa bajo/alto; density (`eps=0.5`, `min_samples=3`, contando el propio punto) marca núcleos locales. No escribas aún: predice `labels`, los centroides y `core_density`, y compara con la salida. Si saltas el scale, la magnitud miente; si lees el `0`/`1` como «culpable», rompes el contrato del triage.",
 code: {
 language: 'python',
 title: "s36_t1_a_demo.py",
 code: `def zscore_list(xs):
 mu = sum(xs) / len(xs)
 var = sum((x - mu) ** 2 for x in xs) / len(xs)
 sd = var ** 0.5 or 1.0
 return [(x - mu) / sd for x in xs], True

def assign_1d(xs, cents):
 return [min(range(len(cents)), key=lambda i: abs(x - cents[i])) for x in xs]

def update_centroids(xs, labels, k, prev=None):
 groups = [[] for _ in range(k)]
 for x, lab in zip(xs, labels):
  groups[lab].append(x)
 out = []
 for i, g in enumerate(groups):
  if g:
   out.append(sum(g) / len(g))
  elif prev is not None:
   out.append(prev[i])
  else:
   raise ValueError("empty cluster without previous centroid")
 return out

def density_core_1d(xs, eps=0.5, min_samples=3):
 # sklearn: min_samples incluye el propio punto
 core = []
 for x in xs:
  n_inc = sum(1 for y in xs if abs(x - y) <= eps)
  core.append(n_inc >= min_samples)
 return core

raw = [1.0, 1.2, 5.0, 5.2, 5.1]
scaled, did_scale = zscore_list(raw)
cents0 = [scaled[0], scaled[-1]]
labels = assign_1d(scaled, cents0)
cents1 = update_centroids(scaled, labels, 2, prev=cents0)
core = density_core_1d(scaled, eps=0.5, min_samples=3)
print("labels", labels)
print("c1", round(cents1[0], 2), "c2", round(cents1[1], 2))
print("core_density", core)
print("scaled", did_scale)
`,
 output: `labels [0, 0, 1, 1, 1]
c1 -1.22 c2 0.82
core_density [False, False, True, True, True]
scaled True`,
 },
 why: "El z-score pone features en escala comparable antes de distancias. Assign etiqueta cada punto al centroide más cercano y update recalcula medias: ese ciclo es el núcleo de k-means 1D. Density marca densidad local con la convención sklearn de DBSCAN (min_samples cuenta el propio punto). Ningún print es veredicto moral: solo geometría para priorizar la cola. En We Do repararás media, z-score con `sd=0` y el ciclo assign–update+density con `verdict False`.",
 retrospective:
  "Si puedes explicar por qué el centroide y el núcleo density son resúmenes geométricos y no «prueba de fraude», ya tienes el hábito de señales auxiliares. El error clásico es publicar el ID de cluster como sanción. En We Do practicarás media, scale y un ciclo assign–update con defecto ético deliberado.",
 },
 {
 demoId: "S36-T1-B-DEMO",
 subtopicId: "S36-T1-B",
 environment: "local-python",
 description: "Demo: argmax de k en dos seeds y bool de acuerdo de k (no ARI).",
 preamble:
  "Elegir **k** en el lab multi-seed no es maximizar un número mágico ni sancionar un segmento. En esta demo dos mapas sintéticos k→score eligen el mismo k=3 y `stable True` solo significa **acuerdo de k**, no que las particiones sean idénticas (eso pediría ARI). No escribas: predice `k`, `score` y `stable` antes de mirar la salida. Si fijas k con un solo seed, el «óptimo» puede ser ruido de inicialización.",
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
 why: "`max(scores, key=scores.get)` elige k por seed según el score reportado. La igualdad de k entre seeds es un acuerdo de hiperparámetro, no estabilidad de etiquetas (ARI o jitter de centroides). Un silhouette alto no legitima sanción: solo sugiere una partición útil para priorizar revisión. En We Do corregirás `min` por `max`, reportarás multi-seed y no sancionarás por métrica.",
 retrospective:
  "Acuerdo de k ≠ ARI ni particiones idénticas: solo dice que dos seeds eligieron el mismo entero. El error clásico es vender un k inestable o sancionar por silhouette. Pregunta: si seed A elige 3 y seed B elige 4, ¿qué reportas al negocio? (sensibilidad a seed, no un «óptimo» fingido.) We Do: argmax, `stable` y `sanction_from_metric False`.",
 },
 {
 demoId: "S36-T2-A-DEMO",
 subtopicId: "S36-T2-A",
 environment: "local-python",
 description: "Demo: scale por eje y proyección ponderada exploratoria.",
 preamble:
  "PCA en este lab es una **lupa** para explorar el espacio de features sintéticas, no el modelo de decisión del triage. En la demo escalas un par (x,y) y proyectas con pesos fijos `w0,w1` documentados a mano — no son autovectores de sklearn. Observa `project_pc`, `scaled True` y `exploratory True`. Si proyectas sin scale o clasificas culpa en el eje, rompes el contrato exploratorio.",
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
 why: "Scale por coordenada evita que un eje en soles aplaste a otro en conteos. La proyección lineal `w0*x+w1*y` es didáctica: pesos fijos documentados, no autovectores de producción. `decision_model` / `exploratory` dejan claro que el scatter no dispara autorrechazo. En We Do practicarás pesos, batch de pc y weight_share sin autorrechazo.",
 retrospective:
  "Pesos fijos ≠ PCA de producción (sklearn aprende autovectores); scale por eje evita que soles aplasten conteos. El error clásico es narrar «eje de riesgo moral» en el scatter. Pregunta: ¿por qué `exploratory True` debe convivir con `decision_model False`? We Do: pc, batch de proyecciones y weight_share sin autorrechazo.",
 },
 {
 demoId: "S36-T2-B-DEMO",
 subtopicId: "S36-T2-B",
 environment: "local-python",
 description: "Demo: far-from-mean en PC + guard de nombre de eje.",
 preamble:
  "Un punto lejos en el eje PC puede ser escala mala, error de datos o un segmento legítimo raro — no un villano. En esta demo calculas `far` respecto a la media de `pc`, eliges `review_queue` (nunca auto_block) y verificas que el nombre del eje no contenga tokens de culpa. Observa `far True`, `axis_named_by_business False` y `guilt False` antes de tocar teclado.",
 code: {
 language: 'python',
 title: "s36_t2_b_demo.py",
 code: `pc = [1.2, 1.8, 8.2]
mean_pc = sum(pc) / len(pc)
far = max(pc) - mean_pc > 3.0
axis_name = "PC1_feature_mix"
named = any(tok in axis_name.lower() for tok in ("fraude", "culpa"))
print("far", far)
print("action", "review_queue" if far else "pass")
print("axis_named_by_business", named)
print("guilt", False)
`,
 output: `far True
action review_queue
axis_named_by_business False
guilt False`,
 },
 why: "La distancia en el eje encola revisión humana; no prueba conducta. El guard de nombre corta narrativa mágica («fraude»/«culpa» en el label del eje). Fail-closed del lab: duda → humano, nunca auto_block. En We Do: tokens prohibidos, higiene pre-review y far sin autoculpa.",
 retrospective:
  "Far en PC → cola de revisión, no culpa automática. El error clásico es bautizar el eje como «fraude» o disparar `auto_block`. Pregunta: si far es True pero las features originales son un segmento legítimo raro, ¿qué haces? (HITL + evidencia original.) We Do: guards de nombre, ready de features y action ética.",
 },
 {
 demoId: "S36-T3-A-DEMO",
 subtopicId: "S36-T3-A",
 environment: "local-python",
 description: "Demo: flags σ con ref + path length toy (idea IF).",
 preamble:
  "Isolation Forest y LOF en producción generan scores de rareza; aquí ves el **contrato** con regla σ (`ref` explícito) y un path length toy: el 50 se aísla en menos cortes que un 10 típico. Observa `flags`, `path_rare` y `misconduct False`. No escribas: predice por qué el path del raro es más corto y por qué eso **no** autoriza un despido.",
 code: {
 language: 'python',
 title: "s36_t3_a_demo.py",
 code: `import statistics

def sigma_flags(xs, ref=None, k=3):
 ref = ref if ref is not None else xs
 mu = statistics.mean(ref)
 sd = statistics.pstdev(ref) or 1.0
 return [1 if x > mu + k * sd else 0 for x in xs]

def path_length_toy(x, pool, cuts):
 active = list(pool)
 depth = 0
 for t in cuts:
  depth += 1
  left = [v for v in active if v < t]
  right = [v for v in active if v >= t]
  active = left if x < t else right
  if len(active) <= 1:
   break
 return depth

xs = [10, 10, 50]
print("flags", sigma_flags(xs, ref=xs[:2]))
print("path_rare", path_length_toy(50, xs, [20, 40]))
print("misconduct", False)
`,
 output: `flags [0, 0, 1]
path_rare 1
misconduct False`,
 },
 why: "μ y σ se estiman solo sobre `ref` (normalidad limpia); path corto sugiere rareza geométrica (idea IF), no moral. `misconduct False` es política del triage: la señal encola revisión. En We Do: umbral z=3, lados correctos del corte y ruta `human_review`.",
 retrospective:
  "σ + path son señales legibles para el humano. El error clásico es estimar normalidad contaminando el fit con el outlier o moralizar el path. We Do: regla, path y enrutamiento.",
 },
 {
 demoId: "S36-T3-B-DEMO",
 subtopicId: "S36-T3-B",
 environment: "local-python",
 description: "Demo: expected_flags vs. capacity (overflow de cola).",
 preamble:
  "**contamination** es una hipótesis de fracción a marcar para controlar la cola, no la tasa de fraude del negocio. En la demo, n=100 y contamination=0.05 esperan 5 flags; con capacity=3 hay overflow y la acción es bajar contamination. Observa `is_fraud_rate False` y el print de action. Si lees «5% de fraude», el lab falló en comunicación de riesgo.",
 code: {
 language: 'python',
 title: "s36_t3_b_demo.py",
 code: `def expected_flags(n, contamination):
 return int(n * contamination)

n, contamination, capacity = 100, 0.05, 3
exp = expected_flags(n, contamination)
overflow = exp > capacity
print("expected_flags", exp)
print("overflow", overflow)
print("action", "lower_contamination" if overflow else "ok")
print("is_fraud_rate", False)
`,
 output: `expected_flags 5
overflow True
action lower_contamination
is_fraud_rate False`,
 },
 why: "`int(n*contamination)` estima la carga de la cola; overflow frente a capacity fuerza recalibrar (bajar contamination o priorizar), nunca «descubrir más fraude». `is_fraud_rate` queda False a propósito: el parámetro no es prevalencia de ilícitos. En We Do: producto n×contamination, overflow y novelty vs. ref.",
 retrospective:
  "Contamination calibra rareza y carga de revisores, no la tasa de ilícitos del negocio. El error clásico es vender «contamination=0.05 ⇒ 5% de fraude». Pregunta: con overflow, ¿subes contamination «para cazar más»? (no — bajas o priorizas.) We Do: expected_flags, overflow y kind novelty.",
 },
 {
 demoId: "S36-T4-A-DEMO",
 subtopicId: "S36-T4-A",
 environment: "local-python",
 description: "Demo: fit μ/σ en train, score en future y mean_flag_rate de ventanas.",
 preamble:
  "Un backtest temporal honesto **ajusta normalidad solo en el pasado** y marca el futuro. En la demo, train=[10,11,10,12] y future con un 50 producen flags `[0,0,1]`; las ventanas de flag_rate promedian ≈0.103; el mes de test no está en train (`leakage False`). No escribas: predice qué pasa si metes el 50 en el fit (el umbral se ensancha y el experimento miente).",
 code: {
 language: 'python',
 title: "s36_t4_a_demo.py",
 code: `import statistics

def fit_mu_sd(train):
 return statistics.mean(train), statistics.pstdev(train) or 1.0

def score_future(future, mu, sd, z=3.0):
 return [1 if x > mu + z * sd else 0 for x in future]

def mean_flag_rate(windows):
 rates = [r for _, r in windows]
 return sum(rates) / len(rates)

train, future = [10, 11, 10, 12], [11, 10, 50]
mu, sd = fit_mu_sd(train)
windows = [("2026-01", 0.1), ("2026-02", 0.12), ("2026-03", 0.09)]
print("flags", score_future(future, mu, sd))
print("mean_flag_rate", round(mean_flag_rate(windows), 3))
print("leakage", "2026-02" in ["2026-01"])
print("backtest", True)
`,
 output: `flags [0, 0, 1]
mean_flag_rate 0.103
leakage False
backtest True`,
 },
 why: "Fit-past / score-future es el contrato del backtest: μ y σ solo en train; flags en future. La media de tasas por ventana resume estabilidad operativa; el chequeo de mes duplicado detecta leakage barato. En We Do: quitar leakage de magnitud, arreglar train_months y detectar spikes.",
 retrospective:
  "El reloj del caso manda el split. El error clásico es barajar filas o meter el mes evaluado al fit. We Do: flags, leakage de meses y spike de tasas.",
 },
 {
 demoId: "S36-T4-B-DEMO",
 subtopicId: "S36-T4-B",
 environment: "local-python",
 description: "Demo: precision@k con ranking de utilidad.",
 preamble:
  "Con pocas etiquetas de utilidad, **precision@k** y el humano importan más que un ROC inventado. En la demo, ranking `[1,0]` con k=2 da P@k=0.5; `human True` y `auto_guilt False` son política del triage. Observa que 1 significa «el revisor dijo que sirvió», no «culpable». No escribas: predice el cociente y por qué no optimizas accuracy global aquí.",
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
 why: "P@k mide utilidad en el top de la cola: de los k primeros, cuántos ayudaron al revisor. Con labels escasos la accuracy global engaña. HITL es obligatorio; `auto_guilt False` cierra el gate ético. En We Do: k del contrato, HITL por escasez y elegir métrica según régimen de labels.",
 retrospective:
  "P@k + humano miden si la señal ahorra tiempo. El error clásico es accuracy global con labels ralos o apagar HITL «para ir más rápido». We Do: k, human_in_loop y choose_metric.",
 }
 ],
 },
 weDo: {
 intro: "S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo, E2 consolida el criterio y E3 transfiere a un caso cercano. Fixtures sintéticos CASO-LIM-036; sin PII real. Cada starter trae un defecto real de fórmula o contrato (no un esqueleto vacío). La ética fail-closed (anomalía ≠ culpa) ya está en el mapa: aquí practicas números y guards.",
 steps: [
 {
 id: "S36-T1-A-E1",
 subtopicId: "S36-T1-A",
 kind: "guided",
 title: "Centroide 1D como media del grupo",
 preamble:
  "- **Contexto:** en el lab CASO-LIM-036, el primer ladrillo de k-means 1D es resumir un grupo con su media (centroide), no con la suma.\n- **Meta:** implementar `centroid(vals)` = media aritmética, con `ValueError` si el grupo está vacío.\n- **Éxito:** con `xs=[1,2]` imprimes `1.5`, luego `n 2` y `ok True`.\n- **Límites:** no uses la suma cruda; no inventes `0.0` en vacío; no es veredicto de conducta.",
 instruction:
  "1. Abre el starter: `return sum(vals)` (bug: falta dividir y guard).\n2. Si `not vals`, lanza `ValueError(\"empty group\")`.\n3. Si no, devuelve `sum(vals) / len(vals)`.\n4. Conserva los tres prints del contrato.",
 hint: "Si not vals: raise ValueError; si no, sum(xs)/len(xs).",
 hints: ["Si not vals: raise ValueError; si no, sum(xs)/len(xs).", "No uses la suma cruda como centroide."],
 edgeCases: ["grupo vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036).",
 feedback:
  "El centroide es la media del grupo: resume geometría para segmentar la cola. Usar la suma infla el «centro» y rompe assign–update. El guard de vacío evita división por cero cuando un cluster queda sin puntos.",
 retrospective:
  "Media = centroide 1D: resume el grupo para el siguiente assign, no para culpar. Vacío = `ValueError`, no un `0.0` inventado que mueve el centroide al origen. El error clásico del starter es tratar la suma como posición. Pregunta: si un cluster queda sin puntos tras assign, ¿qué debe devolver `update`? (conservar prev o error — no inventar cero.) Siguiente (E2): z-score con protección de `sd=0`.",
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
 title: "Z-score seguro con sd cero",
 preamble:
  "- **Contexto:** sin scale, en Red Andina gana la feature con mayor magnitud (soles vs. conteos). Aquí practicas el z-score atómico antes del assign.\n- **Meta:** calcular `(x-mu)/safe_sd` con `safe_sd = sd if sd else 1.0`.\n- **Éxito:** con `x=4, mu=0, sd=2` imprimes `2.0`, `safe_sd 2` y `ok True`.\n- **Límites:** no omitas la división; si `sd=0` no divides por cero; solo sintético.",
 instruction:
  "1. Revisa el starter: `return x - mu` (bug: falta dividir y el guard).\n2. Define `safe_sd = sd if sd else 1.0` y devuelve `(z, safe_sd)` con `z = (x - mu) / safe_sd`.\n3. Desempaqueta e imprime `z`, luego el `safe_sd` **devuelto** por la función (no el `sd` crudo) y `ok True`.\n4. No hardcodees `2.0` sin calcular.",
 hint: "safe_sd = sd if sd else 1.0; z = (x - mu) / safe_sd.",
 hints: ["safe_sd = sd if sd else 1.0; z = (x - mu) / safe_sd.", "Sin scale, gana la magnitud de la feature."],
 edgeCases: ["sd=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E2 (CASO-LIM-036).",
 feedback:
  "Scale-first salva distancias en la cola: soles y conteos dejan de competir por magnitud. El guard de `sd=0` evita división por cero cuando no hay dispersión. Imprime el `safe_sd` que devuelve la función, no solo el `sd` de entrada.",
 retrospective:
  "Scale-first es el hábito que salva distancias en la cola: soles y conteos dejan de competir por magnitud. «Restar y ya» o dividir por cero distorsiona el assign. Pregunta: si `sd=0` en un batch monótono, ¿por qué `safe_sd=1.0` y no un crash? Luego (E3): unes assign–update y density con `verdict False`.",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
x, mu, sd = 4, 0, 2

def zscore(x, mu, sd):
 # DEFECT: debe devolver (z, safe_sd) con z=(x-mu)/safe_sd y safe_sd=sd or 1.0
 return x - mu

z = zscore(x, mu, sd)  # DEFECT: desempaca (z, safe_sd); no uses sd crudo abajo
print(z)
print("safe_sd", sd)  # DEFECT: imprime el safe_sd devuelto, no el sd de entrada
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
 title: "Assign–update y density sin veredicto",
 preamble:
  "- **Contexto:** en CASO-LIM-036-1A segmentas la cola por geometría 1D: centroides + núcleos density, nunca por «culpa».\n- **Meta:** assign al centroide más cercano, update de medias, `density_core_1d` con `min_samples` contando el propio punto, y `verdict False`.\n- **Éxito:** `labels [0,0,1,1]`, `c1 3.0 c2 11.0`, `core_density` todo `True`, `verdict False` con `xs=[2,4,10,12]`, `cents0=[2,12]`, `eps=8`, `min_samples=2`.\n- **Límites:** no dejes labels fijos; no imprimas `cents0` sin update; no marques `verdict True`.",
 instruction:
  "1. Corrige labels con `argmin |x − c_i|` (nearest centroid).\n2. Agrupa por label y calcula medias `c1`/`c2`.\n3. Implementa density: `n_inc >= min_samples` (incluye el propio punto).\n4. Imprime labels, c1/c2, core_density y `verdict False`.",
 hint: "label = argmin |x-c|; media por label; núcleo si n_inc (incluye el punto) >= min_samples; verdict False.",
 hints: ["label = argmin |x-c|; media por label; núcleo si n_inc (incluye el punto) >= min_samples; verdict False.", "Un ciclo assign–update + máscara density basta para el núcleo de k-means y de DBSCAN 1D."],
 edgeCases: ["grupo vacío tras assign", "eps demasiado chico (todo borde)", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-A-E3 (CASO-LIM-036).",
 feedback:
  "Un ciclo assign–update + máscara density segmenta geometría para priorizar la cola. `verdict True` convertiría el cluster en sanción y rompe el gate ético de CASO-LIM-036. Los labels son índices de grupo, no culpables.",
 retrospective:
  "Un ciclo assign–update + máscara density basta para ver el núcleo de k-means y DBSCAN 1D. El error clásico es fijar labels a mano o convertir el cluster en sanción. Pregunta: ¿por qué `min_samples` cuenta el propio punto? (convención sklearn.)",
 starterCode: {
 language: 'python',
 title: "s36-t1-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
xs = [2, 4, 10, 12]
cents0 = [2, 12]
labels = [0, 1, 0, 1]  # DEFECT: no es nearest-centroid
# DEFECT: no hace update; imprime cents0
# DEFECT: omite density_core_1d
print("labels", labels)
print("c1", float(cents0[0]), "c2", float(cents0[1]))
print("core_density", [False] * len(xs))
print("verdict", True)  # DEFECT ético
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t1-a-e3.py",
 code: `xs = [2, 4, 10, 12]
cents0 = [2, 12]
labels = [min(range(2), key=lambda i: abs(x - cents0[i])) for x in xs]
groups = [[], []]
for x, lab in zip(xs, labels):
 groups[lab].append(x)
c1 = sum(groups[0]) / len(groups[0])
c2 = sum(groups[1]) / len(groups[1])

def density_core_1d(xs, eps=8, min_samples=2):
 # sklearn: min_samples incluye el propio punto
 core = []
 for x in xs:
  n_inc = sum(1 for y in xs if abs(x - y) <= eps)
  core.append(n_inc >= min_samples)
 return core

print("labels", labels)
print("c1", c1, "c2", c2)
print("core_density", density_core_1d(xs, eps=8, min_samples=2))
print("verdict", False)
`,
 output: `labels [0, 0, 1, 1]
c1 3.0 c2 11.0
core_density [True, True, True, True]
verdict False`,
 },
 },
 {
 id: "S36-T1-B-E1",
 subtopicId: "S36-T1-B",
 kind: "guided",
 title: "Argmax de k en dos seeds",
 preamble:
  "- **Contexto:** en CASO-LIM-036-1B eliges k comparando dos seeds sintéticos de score interno, no con un solo run.\n- **Meta:** `k = max(scores, key=scores.get)` en cada seed; `multi_seed = (k_a == k_b)`.\n- **Éxito:** imprime `k 3`, `score 0.6` y `multi_seed True` con los mapas del fixture.\n- **Límites:** no uses `min` sobre scores de calidad; no inventes k a ojo.",
 instruction:
  "1. Abre el starter: `k_a = min(seed_a, key=seed_a.get)` (bug).\n2. Cámbialo a `max` (seed_b ya está bien).\n3. Imprime k de seed_a, su score y el bool de acuerdo.\n4. No reordenes los diccionarios a mano.",
 hint: "k = max(scores, key=scores.get) por seed; multi_seed = (k_a == k_b).",
 hints: ["k = max(scores, key=scores.get) por seed; multi_seed = (k_a == k_b).", "No uses min sobre scores de calidad interna."],
 edgeCases: ["empate de scores", "seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E1 (CASO-LIM-036).",
 feedback:
  "Argmax elige el k con mejor score reportado; multi_seed exige el mismo k en ambos seeds. Usar `min` confunde «menor error» con score de calidad: el k del lab se va al peor valor y la cola de segmentación se arma mal.",
 retrospective:
  "`max(..., key=scores.get)` elige el k con mejor score **reportado** en ese seed; `multi_seed` solo comprueba igualdad del entero k. Confundir con «menor error» y usar `min` manda la cola al peor k del mapa. Pregunta: ¿por qué seed_b ya en `max` no basta solo? (un seed es ruido de inicialización.) Siguiente (E2): misma idea + bandera `sanction_from_metric False`.",
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
 title: "Multi-seed sin sancionar por métrica",
 preamble:
  "- **Contexto:** un silhouette sintético alto no autoriza bloquear un segmento de la cola Red Andina. Aquí consolidas argmax multi-seed **y** la bandera ética.\n- **Meta:** elegir k por argmax en cada seed; reportar `stable` y `sanction_from_metric False`.\n- **Éxito:** `k 3`, `stable True`, `sanction_from_metric False` con los mapas del fixture.\n- **Límites:** no uses min; no pongas `sanction_from_metric True`; métrica interna ≠ verdad de negocio.",
 instruction:
  "1. El **objetivo** aquí es el gate ético: `stable` + `sanction_from_metric False` (métrica ≠ sanción), no redescubrir solo el argmax.\n2. Corrige `min` → `max` en seed_a para que k sea el del score más alto (seed_b ya está en max).\n3. Imprime k, stable y la bandera ética en False.\n4. No calcules ARI; no pongas `sanction_from_metric True`.",
 hint: "k = max(scores, key=scores.get) en cada seed; stable = k_a == k_b.",
 hints: ["k = max(scores, key=scores.get) en cada seed; stable = k_a == k_b.", "sanction_from_metric siempre False: métrica ≠ sanción."],
 edgeCases: ["seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E2 (CASO-LIM-036).",
 feedback:
  "Estabilidad de k y rechazo de sanción por métrica son el mismo gate: la señal prioriza revisión, no castiga. `sanction_from_metric True` convertiría un score geométrico en política punitiva y rompe el contrato del triage.",
 retrospective:
  "Un silhouette alto no autoriza bloquear un segmento: la métrica interna prioriza revisión. `sanction_from_metric False` es política del triage, no un print decorativo. El error clásico es copiar E1 y olvidar que aquí el gate es ético. Pregunta: si `stable False`, ¿sancionarías al cluster 0 «por si acaso»? (no.) Luego (E3): el bool `stable` se compara con `==`, no `!=`.",
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
 title: "Acuerdo de k entre seeds",
 preamble:
  "- **Contexto:** antes de fijar k en el notebook de señales, verificas si dos seeds coinciden en el entero k.\n- **Meta:** `stable = (best_k(a) == best_k(b))` e imprimir k acordado.\n- **Éxito:** `stable True`, `k 3`, `ok True` con seed_a/seed_b del fixture.\n- **Límites:** no inviertas la comparación; no digas que las particiones son idénticas.",
 instruction:
  "1. Lee el starter: `stable = k_a != k_b` (bug).\n2. Cámbialo a `k_a == k_b`.\n3. Conserva prints de stable, k y ok.\n4. Los argmax ya están correctos.",
 hint: "stable = (best_k(a) == best_k(b)).",
 hints: ["stable = (best_k(a) == best_k(b)).", "Transfiere argmax a dos seeds."],
 edgeCases: ["seeds divergen", "sintético"],
 tests: "Salida alinea con solution output de S36-T1-B-E3 (CASO-LIM-036).",
 feedback:
  "Stable de k es un acuerdo de hiperparámetro, no ARI de particiones. Invertir `==` a `!=` reporta inestabilidad falsa y empuja a fijar k a ciegas en el notebook de la cola.",
 retrospective:
  "Stable de k es un acuerdo de hiperparámetro, no ARI. El error clásico es negar la igualdad o confundir k con etiquetas. Pregunta: si seeds divergen, ¿qué reportas al negocio? (sensibilidad a seed, no un k «óptimo» fingido.)",
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
 title: "Proyección ponderada exploratoria",
 preamble:
  "- **Contexto:** en CASO-LIM-036-2A comprimes un punto sintético a un eje con pesos documentados solo para explorar.\n- **Meta:** `pc = w0*x + w1*y` con `decision_model False`.\n- **Éxito:** con `(4,6)` y pesos `0.5,0.5` imprimes `5.0`, `exploratory True`, `decision_model False`.\n- **Límites:** no ignores los pesos; no uses el pc como autorrechazo.",
 instruction:
  "1. Abre el starter: `pc = x + y` (bug).\n2. Multiplica cada coordenada por su peso.\n3. Conserva los tres prints.\n4. No normalices pesos salvo que el enunciado lo pida (aquí no).",
 hint: "pc = w0*x + w1*y.",
 hints: ["pc = w0*x + w1*y.", "decision_model False en exploración."],
 edgeCases: ["pesos mal normalizados", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E1 (CASO-LIM-036).",
 feedback:
  "La proyección ponderada es un producto punto didáctico para el scatter del lab. Omitir pesos es un bug de fórmula, no «otra PCA». `decision_model False` deja claro que el eje no dispara autorrechazo en la cola.",
 retrospective:
  "La proyección ponderada es un producto punto con cargas **documentadas**, no «otra PCA mágica». Omitir pesos es bug de fórmula: el eje ya no refleja el contrato del lab. Pregunta: con `w0=w1=0.5` y `(4,6)`, ¿por qué 5.0 y no 10? Siguiente (E2): el mismo w sobre un **batch** de puntos.",
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
 title: "Batch de proyecciones con el mismo w",
 preamble:
  "- **Contexto:** el scatter exploratorio del lab proyecta **varios** puntos con el mismo vector de pesos documentado.\n- **Meta:** aplicar `w[0]*x + w[1]*y` a cada par sin invertir w.\n- **Éxito:** `pc [1, 3]`, `n 2`, `decision_model False` con `pts=[(1,1),(3,1)]` y `w=(1,0)`.\n- **Límites:** no inviertas los pesos; no mutes la lista de puntos.",
 instruction:
  "1. Revisa el starter: usa `w[1]*x + w[0]*y` (bug).\n2. Corrige el orden de pesos.\n3. Imprime pc, n y decision_model.\n4. No hardcodees `[1,3]`.",
 hint: "Aplica el mismo w a cada punto.",
 hints: ["Aplica el mismo w a cada punto.", "No inviertas los pesos."],
 edgeCases: ["lista vacía", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E2 (CASO-LIM-036).",
 feedback:
  "Invertir w rota el significado del eje y engaña la exploración visual de la cola. El batch debe reutilizar el mismo contrato de pesos documentados que un solo punto.",
 retrospective:
  "Invertir `w` rota el significado del eje y engaña la exploración visual de la cola. El batch debe reutilizar el **mismo** vector documentado que un solo punto; no reordenar cargas «porque se ve mejor». Pregunta: con `w=(1,0)`, ¿qué coordenada debe dominar `pc`? Luego (E3): weight_share del primer eje sin auto_reject.",
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
 title: "Masa del componente sin autorrechazo",
 preamble:
  "- **Contexto:** en el toy PCA de Red Andina reportas cuánto «pesa» el primer eje como `|w0|/(|w0|+|w1|)`, no como varianza real de autovalores.\n- **Meta:** calcular weight_share_pc1 y mantener `auto_reject False`.\n- **Éxito:** `use exploratory`, `weight_share_pc1 0.8`, `auto_reject False` con `w=(0.8,0.2)`.\n- **Límites:** no uses `|w1|` en el numerador; no presentes pesos fijos como autovectores; no autorrechaces.",
 instruction:
  "1. Lee el starter: `share = abs(w1)/mass` (bug).\n2. Usa `abs(w0)/mass`.\n3. Conserva use, share y auto_reject.\n4. No hardcodees 0.8 sin fórmula.",
 hint: "share = abs(w0) / (abs(w0)+abs(w1)); PCA no autorrechaza.",
 hints: ["share = abs(w0) / (abs(w0)+abs(w1)); PCA no autorrechaza.", "Pesos fijos ≠ autovectores de producción."],
 edgeCases: ["w=(0,0)", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-A-E3 (CASO-LIM-036).",
 feedback:
  "weight_share es un proxy de masa del componente documentado, no la varianza explicada de sklearn. Un share alto no autoriza auto_reject: el scatter sigue siendo lupa para la cola HITL.",
 retrospective:
  "weight_share es un proxy de masa del componente documentado, no la varianza explicada de sklearn. El error clásico es invertir ejes o convertir el scatter en juez. Pregunta: ¿por qué `auto_reject` debe ser False aunque share sea alto?",
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
 title: "Guard de tokens en el nombre del eje",
 preamble:
  "- **Contexto:** en el dossier de señales, un eje llamado con «fraude» o «culpa» empuja a lectura mágica del scatter.\n- **Meta:** detectar tokens prohibidos en `axis_name` (casefold).\n- **Éxito:** con `PC1_feature_mix` imprimes `axis_named_by_business False`, `use exploratory`, `auto_label False`.\n- **Límites:** no marques True sin chequear; `auto_label` siempre False en este lab.",
 instruction:
  "1. Abre el starter: `named = True` (bug).\n2. Calcula `any(tok in axis_name.lower() for tok in (\"fraude\",\"culpa\"))`.\n3. Conserva los tres prints.\n4. No cambies el nombre del fixture para «pasar».",
 hint: "named = any(tok in axis_name.lower() for tok in ('fraude','culpa')).",
 hints: ["named = any(tok in axis_name.lower() for tok in ('fraude','culpa')).", "auto_label False siempre en este lab."],
 edgeCases: ["PC2=fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E1 (CASO-LIM-036).",
 feedback:
  "El guard de nombre es higiene narrativa del dossier, no un modelo. Forzar True inventa una historia de negocio falsa y empuja al revisor a leer el scatter como culpa.",
 retrospective:
  "El guard de nombre es higiene del dossier: corta lectura mágica del scatter, no es un modelo de riesgo. Forzar `True` inventa una historia de negocio falsa. Pregunta: ¿por qué `auto_label` debe ser False aunque el eje se llame «feature_mix»? Siguiente (E2): ready a partir de missingness y dispersión.",
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
 title: "Ready por missing y dispersión",
 preamble:
  "- **Contexto:** antes de encolar un scatter del lab, verificas que no hay `None` y que hay dispersión para estandarizar.\n- **Meta:** `missing_ok` y `scale_ok = pstdev(features) > 0`; `ready` es la conjunción.\n- **Éxito:** con `[2.0,4.0,6.0]` imprimes `ready True`, `scale_ok True`, `missing_ok True`.\n- **Límites:** no hardcodees `scale_ok False`; deriva de los datos.",
 instruction:
  "1. Revisa el starter: `scale_ok = False` (bug).\n2. Usa `statistics.pstdev(features) > 0`.\n3. `ready = scale_ok and missing_ok`.\n4. Conserva los tres prints.",
 hint: "Falta nada si ningún feature es None. La escala sirve si los valores varían: una desviación de cero no discrimina.",
 hints: ["missing_ok = all(x is not None for x in features); scale_ok = statistics.pstdev(features) > 0.", "ready = scale_ok and missing_ok antes de encolar el scatter."],
 edgeCases: ["missing silencioso", "sd=0"],
 tests: "Salida alinea con solution output de S36-T2-B-E2 (CASO-LIM-036).",
 feedback:
  "Ready se **deriva** de missingness y dispersión: un bool inventado miente al revisor y bloquea o libera el scatter sin base en los datos de la cola.",
 retrospective:
  "`ready` se **deriva** de missingness y dispersión (`pstdev > 0`); un bool inventado miente al revisor y libera o bloquea el scatter sin base en los datos. El error clásico del starter es hardcodear `scale_ok False` «por precaución». Pregunta: con features constantes `[3,3,3]`, ¿`scale_ok` debería ser True? (no — no hay dispersión para estandarizar.) Luego (E3): far en PC encola revisión sin guilt.",
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
 title: "Far en PC encola, no culpa",
 preamble:
  "- **Contexto:** un punto lejano en pc del CASO-LIM-036-2B es candidato a **revisión humana**, nunca a auto-bloqueo moral.\n- **Meta:** `far = max(pc)-mean(pc) > 3`; action `review_queue` si far; `guilt` siempre False.\n- **Éxito:** `guilt False`, `action review_queue`, `far True` con `pc=[1.2,1.8,8.2]`.\n- **Límites:** no imprimas `auto_block` ni `guilt True`; no uses PII real.",
 instruction:
  "1. Deja el cálculo de `far` (ya correcto).\n2. Cambia `guilt` a False.\n3. Action: `review_queue` si far, si no `pass`.\n4. Conserva el print de far.",
 hint: "far = max(pc) - mean(pc) > 3; guilt siempre False; action review_queue si far.",
 hints: ["far = max(pc) - mean(pc) > 3; guilt siempre False; action review_queue si far.", "Distancia en PC ≠ conducta indebida."],
 edgeCases: ["sancionar por scatter", "sintético"],
 tests: "Salida alinea con solution output de S36-T2-B-E3 (CASO-LIM-036).",
 feedback:
  "Geometría en PC prioriza la cola HITL; no prueba conducta. `auto_block` por scatter es el anti-patrón que el gate ético de Red Andina corta de raíz.",
 retrospective:
  "Geometría en PC prioriza la cola; no prueba conducta. El error clásico es auto_block por scatter. Pregunta: ¿qué harías si far es True pero las features originales son legítimas? (HITL y evidencia original.)",
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
 title: "Flags σ con z=3 y ref explícito",
 preamble:
  "- **Contexto:** en CASO-LIM-036-3A marcas rareza respecto a una referencia limpia, no asumiendo que «el último índice es el malo».\n- **Meta:** flag si `x > mu + 3*sd` con μ/σ solo sobre `ref`.\n- **Éxito:** `flags [0,0,0,1]`, `method rule_sigma`, `misconduct False` con `xs=[1,1,1,10]`, `ref=xs[:3]`.\n- **Límites:** no dejes z=0; no uses future en el fit (aquí ref es el pasado sintético).",
 instruction:
  "1. Abre el starter: `z = 0` (bug).\n2. Cámbialo a `3`.\n3. Conserva mu/sd sobre ref y los prints.\n4. No hardcodees la lista de flags.",
 hint: "flag si x > mu + z*sd con z=3 y μ,σ solo sobre ref.",
 hints: ["flag si x > mu + z*sd con z=3 y μ,σ solo sobre ref.", "No asumas que el outlier es el último índice; usa ref explícito."],
 edgeCases: ["sd=0", "ref vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E1 (CASO-LIM-036).",
 feedback:
  "z=3 es el umbral didáctico de rareza; z=0 marca casi todo y satura la cola de revisión. μ/σ solo sobre ref evita contaminar la normalidad con el outlier sintético.",
 retrospective:
  "z=3 es el umbral didáctico de rareza respecto a `ref` limpia; z=0 marca casi todo y satura la cola. El error clásico es meter el outlier en el fit de μ/σ o asumir «el último índice es el malo». Pregunta: ¿por qué `ref=xs[:3]` y no `xs` completo en este fixture? Siguiente (E2): path length toy con lados correctos del corte.",
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
 title: "Path length toy (idea Isolation Forest)",
 preamble:
  "- **Contexto:** el toy IF del lab cuenta cuántos cortes bastan para aislar un punto; path corto sugiere rareza geométrica en la cola sintética.\n- **Meta:** tras cada umbral t, `active = left if x < t else right`; profundidad al aislar.\n- **Éxito:** `path_rare 1`, `path_normal 3`, `misconduct False` con pool y cuts del fixture.\n- **Límites:** no inviertas left/right; no imprimas culpa.",
 instruction:
  "1. Revisa el starter: `active = left if x >= t else right` (bug).\n2. Usa `x < t` para left.\n3. Imprime path_rare, path_normal y misconduct.\n4. No cambies los cuts fijos del lab.",
 hint: "Tras cada corte t, active = left si x<t else right; depth cuando len(active)<=1.",
 hints: ["Tras cada corte t, active = left si x<t else right; depth cuando len(active)<=1.", "Path corto ⇒ más fácil de aislar, no culpa."],
 edgeCases: ["pool unitario", "cuts vacíos", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E2 (CASO-LIM-036).",
 feedback:
  "Path corto = más fácil de aislar geométricamente, no prueba moral. Invertir lados miente el ranking de rareza y prioriza mal la cola HITL del workbench.",
 retrospective:
  "Path corto = más fácil de aislar, no prueba moral. Invertir lados miente el ranking de rareza. Luego (E3): flags σ + ruta human_review sin auto_sanction.",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e2.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
def path_length_toy(x, pool, cuts):
 active = list(pool)
 depth = 0
 for t in cuts:
  depth += 1
  left = [v for v in active if v < t]
  right = [v for v in active if v >= t]
  active = left if x >= t else right  # DEFECT: lados invertidos
  if len(active) <= 1:
   break
 return depth

pool = [10, 11, 10, 12, 50]
cuts = [15, 30, 40]
print("path_rare", path_length_toy(50, pool, cuts))
print("path_normal", path_length_toy(10, pool, cuts))
print("misconduct", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e2.py",
 code: `def path_length_toy(x, pool, cuts):
 active = list(pool)
 depth = 0
 for t in cuts:
  depth += 1
  left = [v for v in active if v < t]
  right = [v for v in active if v >= t]
  active = left if x < t else right
  if len(active) <= 1:
   break
 return depth

pool = [10, 11, 10, 12, 50]
cuts = [15, 30, 40]
print("path_rare", path_length_toy(50, pool, cuts))
print("path_normal", path_length_toy(10, pool, cuts))
print("misconduct", False)
`,
 output: `path_rare 1
path_normal 3
misconduct False`,
 },
 },
 {
 id: "S36-T3-A-E3",
 subtopicId: "S36-T3-A",
 kind: "transfer",
 title: "Flag σ encola human_review",
 preamble:
  "- **Contexto:** un flag de rareza en Red Andina debe **encolar revisión**, nunca disparar sanción automática.\n- **Meta:** calcular flags con z=3 sobre ref; `route = human_review` si hay flags; `auto_sanction False`.\n- **Éxito:** `flags [0,0,0,1]`, `route human_review`, `auto_sanction False` con `xs=[10,11,10,50]`.\n- **Límites:** no uses z=0 ni `auto_fire`; no moralices el flag.",
 instruction:
  "1. Deja μ/σ solo sobre `ref` (ya correcto en el starter).\n2. Asegura umbral de rareza z=3 (el starter tiene z=0).\n3. Route: `human_review` si `any(flags)` else `pass` — **nunca** `auto_fire` (meta de transfer).\n4. `auto_sanction` False; conserva print de flags.",
 hint: "mu/sd solo sobre ref; flag si x > mu+3*sd; route según any(flags); nunca auto_sanction.",
 hints: ["mu/sd solo sobre ref; flag si x > mu+3*sd; route según any(flags); nunca auto_sanction.", "Flag σ encola review, no despido."],
 edgeCases: ["sd=0", "despido automático", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-A-E3 (CASO-LIM-036).",
 feedback:
  "Señal → ruta humana. `auto_fire` por rareza es el anti-patrón fail-open: sin revisor, fail-closed no emite sanción automática. El umbral z=3 alimenta la cola, no el veredicto.",
 retrospective:
  "Señal → ruta humana. El error clásico es auto_fire por rareza. Pregunta: si no hay revisor disponible, ¿qué hace fail-closed? (no emitir sanción automática.)",
 starterCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
xs = [10, 11, 10, 50]
ref = xs[:3]
mu = statistics.mean(ref)
sd = statistics.pstdev(ref) or 1.0
z = 0  # DEFECT: debe ser 3
flags = [1 if x > mu + z * sd else 0 for x in xs]
route = "auto_fire" if any(flags) else "pass"  # DEFECT
print("flags", flags)
print("route", route)
print("auto_sanction", True)  # DEFECT
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t3-a-e3.py",
 code: `import statistics
xs = [10, 11, 10, 50]
ref = xs[:3]
mu = statistics.mean(ref)
sd = statistics.pstdev(ref) or 1.0
z = 3
flags = [1 if x > mu + z * sd else 0 for x in xs]
route = "human_review" if any(flags) else "pass"
print("flags", flags)
print("route", route)
print("auto_sanction", False)
`,
 output: `flags [0, 0, 0, 1]
route human_review
auto_sanction False`,
 },
 },
 {
 id: "S36-T3-B-E1",
 subtopicId: "S36-T3-B",
 kind: "guided",
 title: "expected_flags por contamination",
 preamble:
  "- **Contexto:** en CASO-LIM-036-3B estimas cuántos flags generará el batch sintético para no saturar revisores.\n- **Meta:** `expected_flags = int(n * contamination)`.\n- **Éxito:** con n=200 y contamination=0.1 imprimes `20`, `is_fraud_rate False`, `use capacity_tuning`.\n- **Límites:** multiplica, no sumes; no digas que 0.1 es fraude.",
 instruction:
  "1. Abre el starter: `int(n + contamination)` (bug).\n2. Cambia a `int(n * contamination)`.\n3. Conserva los tres prints.\n4. No redondees distinto de `int`.",
 hint: "expected_flags = int(n * contamination).",
 hints: ["expected_flags = int(n * contamination).", "is_fraud_rate False."],
 edgeCases: ["contamination>1", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E1 (CASO-LIM-036).",
 feedback:
  "El producto n×contamination es control de cola, no prevalencia de ilícitos. Sumar es un bug trivial con impacto de negocio: la capacidad de revisores se planifica mal y la cola se desborda o se subutiliza.",
 retrospective:
  "El producto `n × contamination` es control de **carga** de cola, no prevalencia de ilícitos. Sumar es un bug trivial con impacto de negocio: planificas mal la capacidad de revisores. Pregunta: con n=200 y contamination=0.1, ¿por qué 20 y no 200.1? Siguiente (E2): overflow vs. capacity real de slots.",
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
 title: "Overflow de cola vs. capacity",
 preamble:
  "- **Contexto:** si esperas 10 flags y solo hay 8 slots de revisor, la cola de Red Andina se desborda.\n- **Meta:** `overflow = expected > capacity` y action de bajar contamination.\n- **Éxito:** `overflow True`, `action lower_contamination`, `ok True` con capacity=8, expected=10.\n- **Límites:** no inviertas la desigualdad; no «descubras más fraude» al overflow.",
 instruction:
  "1. Revisa: `overflow = expected < capacity` (bug).\n2. Usa `>`.\n3. Conserva action y ok.\n4. No cambies capacity del fixture.",
 hint: "Hay desborde cuando lo esperado supera la capacidad — fíjate en el sentido de la comparación del starter.",
 hints: ["overflow = expected > capacity.", "Si overflow, baja contamination o prioriza."],
 edgeCases: ["capacity 0", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E2 (CASO-LIM-036).",
 feedback:
  "Overflow es un problema de **capacidad**, no de «más delincuentes». Invertir la comparación oculta el desborde y deja a los revisores sin cupo real en la cola HITL.",
 retrospective:
  "Overflow es un problema de **capacidad de revisor**, no de «más delincuentes en el batch». Invertir `>` a `<` oculta el desborde y deja la cola HITL sin cupo real. Pregunta: si expected=10 y capacity=8, ¿la action es «subir contamination»? (no — `lower_contamination` o priorizar.) Luego (E3): novelty calculada vs. ref, sin culpa.",
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
 title: "Novelty frente a ref, sin culpa",
 preamble:
  "- **Contexto:** un valor nuevo se compara con un modelo de normalidad **ya fijado** (ref); rareza alta ⇒ kind novelty, no culpa.\n- **Meta:** z = |x_new−μ|/σ sobre ref; `kind = novelty` si z>3; `misconduct False`.\n- **Éxito:** `kind novelty`, `misconduct False`, `ok True` con ref=[10,11,10,12], x_new=50.\n- **Límites:** no hardcodees culpa; calcula z; no uses PII real.",
 instruction:
  "1. Calcula mu, sd y z sobre ref.\n2. Asigna kind novelty o in_distribution.\n3. misconduct False siempre.\n4. Imprime kind, misconduct, ok.",
 hint: "z = abs(x_new - mean(ref)) / (pstdev(ref) or 1); kind = novelty si z>3.",
 hints: ["z = abs(x_new - mean(ref)) / (pstdev(ref) or 1); kind = novelty si z>3.", "Nunca guilt automático."],
 edgeCases: ["confundir novelty con fraude", "sintético"],
 tests: "Salida alinea con solution output de S36-T3-B-E3 (CASO-LIM-036).",
 feedback:
  "Novelty es rareza frente a normalidad fijada; no es veredicto. `outlier_as_guilt` moraliza el score y rompe el gate ético del triage CP-N3-C.",
 retrospective:
  "Novelty es rareza frente a normalidad fijada; no es veredicto. El error clásico es `outlier_as_guilt`. Pregunta: ¿en qué se diferencia novelty de «outlier en el mismo batch de train»? (modelo ya fijado vs. rareza en el conjunto de ajuste.)",
 starterCode: {
 language: 'python',
 title: "s36-t3-b-e3.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
ref = [10, 11, 10, 12]
x_new = 50
print("kind", "outlier_as_guilt") # DEFECT: calcula z vs. ref
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
 title: "Fit solo en el pasado",
 preamble:
  "- **Contexto:** en CASO-LIM-036-4A validas la señal σ con backtest: la normalidad se aprende en train y se aplica a future.\n- **Meta:** μ/σ solo con train; flags en future con z=3; `backtest True`, `leakage False`.\n- **Éxito:** `flags [0,0,1]` con train/future del fixture.\n- **Límites:** no concatenes future al fit; no barajes el tiempo.",
 instruction:
  "1. Abre el starter: `pool = train + future` (bug).\n2. Calcula mu/sd solo con train.\n3. Score future con umbral 3σ.\n4. Conserva prints de flags, backtest y leakage.",
 hint: "mu, sd = mean(train), pstdev(train) or 1; no uses future en el fit.",
 hints: ["mu, sd = mean(train), pstdev(train) or 1; no uses future en el fit.", "leakage False: el mes de test no entra al train."],
 edgeCases: ["sd=0 en train", "future vacío", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E1 (CASO-LIM-036).",
 feedback:
  "Meter el futuro en el fit ensancha σ y esconde el outlier: leakage de magnitud. El hábito del lab es split temporal estricto — el reloj manda el experimento de la cola.",
 retrospective:
  "Meter el futuro en el fit ensancha σ y **esconde** el outlier: leakage de magnitud. El hábito del lab es split temporal estricto — el reloj manda el experimento de la cola. Pregunta: si el 50 entra al train, ¿el flag del future sigue siendo 1? (a menudo no.) Siguiente (E2): predicado de meses train/test.",
 starterCode: {
 language: 'python',
 title: "s36-t4-a-e1.py",
 code: `# CASO-LIM-036 sintético · lab stdlib
# Repara solo el DEFECT; conserva el contrato de prints.
import statistics
train = [10, 11, 10, 12]
future = [11, 10, 50]
# DEFECT: fit sobre train+future (leakage de magnitud)
pool = train + future
mu = statistics.mean(pool)
sd = statistics.pstdev(pool) or 1.0
flags = [1 if x > mu + 3 * sd else 0 for x in future]
print("flags", flags)
print("backtest", True)
print("leakage", False)
`,
 },
 solutionCode: {
 language: 'python',
 title: "s36-t4-a-e1.py",
 code: `import statistics
train = [10, 11, 10, 12]
future = [11, 10, 50]
mu = statistics.mean(train)
sd = statistics.pstdev(train) or 1.0
flags = [1 if x > mu + 3 * sd else 0 for x in future]
print("flags", flags)
print("backtest", True)
print("leakage", False)
`,
 output: `flags [0, 0, 1]
backtest True
leakage False`,
 },
 },
 {
 id: "S36-T4-A-E2",
 subtopicId: "S36-T4-A",
 kind: "independent",
 title: "Mes de test fuera del train",
 preamble:
  "- **Contexto:** el chequeo de leakage del lab es simple y duro: el mes evaluado no puede aparecer en train.\n- **Meta:** `has_leakage = test_month in train_months` con train limpio.\n- **Éxito:** `leakage False`, `order temporal`, `ok True` con train `['2026-01']` y test `2026-02`.\n- **Límites:** no dejes el test dentro de train; no mientas el bool a mano.",
 instruction:
  "1. Revisa: train incluye `\"2026-02\"` (bug).\n2. Quita el mes de test del train.\n3. Deja la función has_leakage.\n4. Conserva los tres prints.",
 hint: "has_leakage(train, test) es True solo si test ∈ train.",
 hints: ["has_leakage(train, test) es True solo si test ∈ train.", "No mezcles futuro en el fit."],
 edgeCases: ["test dentro de train", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E2 (CASO-LIM-036).",
 feedback:
  "Leakage de mes es el anti-patrón más barato de detectar y el más caro de ignorar: el backtest de la cola se vuelve optimista y miente al revisor sobre la utilidad de la señal.",
 retrospective:
  "Leakage de mes es el anti-patrón más barato de detectar y el más caro de ignorar: el backtest se vuelve optimista y miente al revisor sobre la utilidad de la señal. El error clásico es dejar el test dentro de `train_months` «por completitud». Pregunta: con train `['2026-01']` y test `2026-02`, ¿qué imprime `has_leakage`? Luego (E3): spike de flag_rate entre ventanas.",
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
 title: "Spike de flag_rate entre ventanas",
 preamble:
  "- **Contexto:** si la tasa de flags salta de 0.1 a 0.5 entre ventanas sintéticas, no amplíes la cola a ciegas: investigas drift o bug de scale.\n- **Meta:** `spike` si `max(rates)-min(rates) >= 0.3`; action `investigate`.\n- **Éxito:** `spike True`, `action investigate`, `ok True` con rates=[0.1,0.5].\n- **Límites:** no dejes umbral 0.9; no ignores el spike.",
 instruction:
  "1. Corrige el umbral a 0.3.\n2. Conserva action investigate y ok.\n3. No hardcodees spike True sin fórmula.\n4. Con rates constantes, spike debe ser False (no lo hardcodees True).",
 hint: "spike si max(rates)-min(rates) >= 0.3.",
 hints: ["spike si max(rates)-min(rates) >= 0.3.", "Investiga antes de ampliar cola."],
 edgeCases: ["rates constantes", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-A-E3 (CASO-LIM-036).",
 feedback:
  "Estabilidad de la tasa de flags es parte del backtest operativo. Umbral 0.9 es ceguera: no ves el salto y amplías la cola sin investigar scale, leakage o cambio de población.",
 retrospective:
  "Estabilidad de la tasa de flags es parte del backtest. Umbral demasiado alto es ceguera operativa. Pregunta: ¿qué miras primero ante un spike? (scale, leakage, cambio de población.)",
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
 title: "Precision@k con k del contrato",
 preamble:
  "- **Contexto:** en CASO-LIM-036-4B mides qué fracción del top-k del ranking de utilidad ayudó al revisor.\n- **Meta:** `P@k = sum(ranked[:k]) / k` con el k del contrato (2).\n- **Éxito:** imprime `0.5`, `k 2`, `auto_guilt False` con ranked=[1,0,1,0].\n- **Límites:** no uses k=4; no traduzcas 1 a «culpable».",
 instruction:
  "1. Abre el starter: `k = 4` (bug).\n2. Cámbialo a `2`.\n3. Conserva la fórmula y los prints.\n4. No reordenes el ranking.",
 hint: "P@k = sum(ranked[:k])/k.",
 hints: ["P@k = sum(ranked[:k])/k.", "auto_guilt False."],
 edgeCases: ["k=0", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E1 (CASO-LIM-036).",
 feedback:
  "k es parte del contrato de evaluación de cola. Cambiar k a escondidas miente el P@k y falsea la utilidad reportada al revisor HITL. El 1 del ranking es «sirvió», no «culpable».",
 retrospective:
  "k es parte del contrato de evaluación de cola: cambiarlo a escondidas miente el P@k reportado al revisor. El 1 del ranking es «sirvió», no «culpable». Pregunta: con ranked=`[1,0,1,0]` y k=2, ¿qué discriminante importa además del float 0.5? (el print `k 2` del contrato.) Siguiente (E2): HITL cuando labels son escasos frente a flags.",
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
 title: "HITL cuando labels son escasos",
 preamble:
  "- **Contexto:** con 5 etiquetas y 40 flags, el régimen es scarce: no puedes apagar al humano «para ir más rápido».\n- **Meta:** `human_in_loop = n_labels < n_flags` (y etiquetar scarce).\n- **Éxito:** imprime `True`, `ok True`, `labels scarce`.\n- **Límites:** no hardcodees False; no automatizes sanción.",
 instruction:
  "1. Revisa: `human_in_loop = False` (bug).\n2. Derívalo de `n_labels < n_flags`.\n3. Conserva labels scarce/dense.\n4. Imprime en el orden del contrato.",
 hint: "human_in_loop = True cuando n_labels < n_flags (régimen scarce).",
 hints: ["human_in_loop = True cuando n_labels < n_flags (régimen scarce).", "Sin humano no hay gate responsable."],
 edgeCases: ["automatizar sanción", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E2 (CASO-LIM-036).",
 feedback:
  "HITL se **deriva** de la escasez de labels frente a flags, no se apaga a gusto. False fijo rompe el gate responsable del triage y empuja a sanción automática sin evidencia humana.",
 retrospective:
  "HITL se **deriva** de la escasez, no se apaga a gusto. El error clásico es False fijo. Luego (E3): elegir precision_at_k cuando la prevalencia de labels es baja.",
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
 title: "Elegir P@k con labels ralos",
 preamble:
  "- **Contexto:** con 3 labels en 100 casos sintéticos, la accuracy global engaña; el lab exige `precision_at_k`.\n- **Meta:** si `n_labels/n_total < 0.1` → `precision_at_k`; si no, `global_accuracy`.\n- **Éxito:** imprime `precision_at_k`, `ok True`, `n 1`.\n- **Límites:** no devuelvas siempre global_accuracy; no inventes ROC con labels ralos.",
 instruction:
  "1. Abre choose_metric: return fijo (bug).\n2. Implementa el umbral 0.1 (y guard n_total<=0).\n3. Conserva los prints del contrato.\n4. No hardcodees el string sin condición.",
 hint: "choose_metric = 'precision_at_k' si n_labels/n_total < 0.1.",
 hints: ["choose_metric = 'precision_at_k' si n_labels/n_total < 0.1.", "global_accuracy engaña con labels ralos."],
 edgeCases: ["ROC fantasma", "sintético"],
 tests: "Salida alinea con solution output de S36-T4-B-E3 (CASO-LIM-036).",
 feedback:
  "La métrica se elige por régimen de labels, no por moda del dashboard. Accuracy global con datos ralos inventa un «99%» que no mide si la señal ahorra tiempo al revisor de la cola.",
 retrospective:
  "La métrica se elige por régimen de labels, no por moda del dashboard. El error clásico es accuracy global con datos ralos. Pregunta: ¿qué defiendes en 30 segundos ante un gerente que pide «accuracy 99%»? (P@k + HITL + utilidad de cola.)",
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
 "Construye un mini-pipeline de clustering y anomalías sobre `CASO-LIM-036` (sintético): scale → assign–update o centroides → PCA toy → flags σ + path length → fit-past/score-future → P@k con HITL. Sin concluir conducta indebida. Antes de marcar listo, podrás defender tres invariantes en 30 segundos (scale-first, fit solo en pasado, auto_guilt False).",
 objectives: [
 "Scale + assign–update/centroides 1D + núcleos density (eps/min_samples, contando el propio punto) con aviso ético.",
 "PCA exploratoria prudente (decision_model=False; pesos fijos, no autovectores).",
 "Reglas σ y path length toy (idea IF) sin guilt automático.",
 "Backtest temporal (fit pasado / score futuro) + P@k con human_in_loop.",
 ],
 requirements: [
 "Aviso: anomalía ≠ culpa en cada salida de flag",
 "Backtest temporal sin leakage (test ∉ train)",
 "es-PE sintético; sin PII real",
 "Ruta humana obligatoria para flags que afectan personas",
 ],
 starterCode: `# CASO-LIM-036 · señales auxiliares (youDo)
import statistics

def scale(xs):
 mu = statistics.mean(xs)
 sd = statistics.pstdev(xs) or 1.0
 return [(x - mu) / sd for x in xs]

def assign_1d(xs, cents):
 return [min(range(len(cents)), key=lambda i: abs(x - cents[i])) for x in xs]

def update_centroids(xs, labels, k, prev=None):
 # Grupo vacío: conserva prev[i]; no inventa 0.0
 groups = [[] for _ in range(k)]
 for x, lab in zip(xs, labels):
  groups[lab].append(x)
 out = []
 for i, g in enumerate(groups):
  if g:
   out.append(sum(g) / len(g))
  elif prev is not None:
   out.append(prev[i])
  else:
   raise ValueError("empty cluster without previous centroid")
 return out

def density_core_1d(xs, eps=0.5, min_samples=3):
 # Idea DBSCAN 1D (sklearn): min_samples cuenta el propio punto
 core = []
 for x in xs:
  n_inc = sum(1 for y in xs if abs(x - y) <= eps)
  core.append(n_inc >= min_samples)
 return core

def project_pc(x, y, w0=0.8, w1=0.2):
 # PCA toy: pesos fijos documentados; no son autovectores de producción
 return w0 * x + w1 * y

def sigma_flags(xs, ref=None, z=3.0):
 # Fit μ,σ solo en ref (train); no uses el mes de test
 ref = list(ref) if ref is not None else list(xs)
 mu = statistics.mean(ref)
 sd = statistics.pstdev(ref) or 1.0
 return [x > mu + z * sd for x in xs]

def path_length_toy(x, pool, cuts):
 active = list(pool)
 depth = 0
 for t in cuts:
  depth += 1
  left = [v for v in active if v < t]
  right = [v for v in active if v >= t]
  active = left if x < t else right
  if len(active) <= 1:
   break
 return depth

def fit_mu_sd(train):
 return statistics.mean(train), statistics.pstdev(train) or 1.0

def score_future(future, mu, sd, z=3.0):
 return [1 if x > mu + z * sd else 0 for x in future]

def mean_flag_rate(windows):
 return sum(r for _, r in windows) / len(windows)

def has_leakage(train_months, test_month):
 return test_month in train_months

def precision_at_k(ranked, k):
 return sum(ranked[:k]) / k

if __name__ == "__main__":
 xs = scale([1.0, 1.2, 5.0, 5.2, 5.1])
 cents0 = [xs[0], xs[-1]]
 labels = assign_1d(xs, cents0)
 cents = update_centroids(xs, labels, 2, prev=cents0)
 print("labels", labels, "cents", [round(c, 2) for c in cents])
 print("core_density", density_core_1d(xs, eps=0.5, min_samples=3))
 print("pc_toy", round(project_pc(xs[0], xs[1]), 2))
 print("decision_model", False)
 train, future = [10, 11, 10, 12], [11, 10, 50]
 mu, sd = fit_mu_sd(train)
 print("flags", score_future(future, mu, sd))
 print("path_rare", path_length_toy(50, train + [50], [15, 30, 40]))
 print("mean_flag_rate", mean_flag_rate([("2026-01", 0.1), ("2026-02", 0.12)]))
 print("leakage", has_leakage(["2026-01"], "2026-02"))
 print("p_at_2", precision_at_k([1, 0, 1], 2))
 print("auto_guilt", False)
`,
 portfolioNote:
 "Señales CP-N3-C; evidencia de utilidad de cola (P@k en top-k de la cola sintética + HITL obligatorio). En el README, una frase de impacto medible que puedas defender en 30 s — no «detectamos fraude». No PASS automático de carrera ni veredicto moral.",
 retrospective:
  "Antes de marcar listo: (1) ¿qué invariante demuestras — scale antes de distancias, fit solo en pasado, o `auto_guilt False` en cada flag? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, capacidad real de revisor)? (3) En el README, una frase de impacto medible que puedas defender en 30 segundos: utilidad de cola (P@k + HITL), no «detectamos fraude». El error clásico es un notebook bonito que publica rareza como culpa.",
 rubric: [
 { criterion: "Señales auxiliares al triage (cola de revisión, sin autoculpa)", weight: "25%" },
 { criterion: "Correctitud técnica (scale, centroides/density, σ/path, P@k, backtest)", weight: "20%" },
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
 explanation: "Es un control de cuántos puntos se marcan raros; se calibra a capacidad de revisión, no a prevalencia de ilícitos.",
 },
 {
 question: "PCA en este curso se usa para:",
 options: ["Etiquetar culpa en el eje PC2", "Reemplazar el workbench de revisión", "Exploración/visualización prudente", "Borrar features de privacidad automáticamente"],
 correctIndex: 2,
 explanation: "Proyección exploratoria; no es el modelo de decisión ni un eje moral. El lab usa pesos fijos; sklearn aprende autovectores.",
 },
 {
 question: "Con etiquetas escasas prioriza:",
 options: ["precision@k y feedback humano", "Solo accuracy global", "Aumentar contamination a 0.9", "Eliminar reglas legibles"],
 correctIndex: 0,
 explanation: "P@k alinea con la cola; el humano valida la utilidad. La accuracy global con etiquetas ralas engaña.",
 },
 {
 question: "Un fit de normalidad que incluye el mes evaluado comete:",
 options: ["Warmup de benchmark", "Blocking de candidatos", "Backpressure de cola", "Leakage temporal"],
 correctIndex: 3,
 explanation: "Mezclar futuro en el fit invalida el backtest; el split debe ser temporal.",
 },
 {
 question: "En el path length toy (idea de Isolation Forest), un punto con path más corto que el resto suele interpretarse como:",
 options: ["Prueba de fraude", "Más fácil de aislar geométricamente (candidato a revisión)", "Etiqueta moral automática", "Que contamination es tasa de ilícitos"],
 correctIndex: 1,
 explanation: "Path corto sugiere rareza geométrica (se aísla con pocos cortes). Sigue siendo señal auxiliar; no prueba conducta indebida.",
 },
 {
 question: "En el micro-contrato density 1D (idea DBSCAN, convención sklearn), un punto es núcleo cuando:",
 options: ["Su id de cluster es impar", "contamination supera 0.5", "Tiene al menos min_samples vecinos en eps contando el propio punto", "El silhouette del mes de test es alto"],
 correctIndex: 2,
 explanation: "Núcleo = densidad local suficiente (vecinos en eps, incluido el punto). No eliges k; eliges densidad. El núcleo no es una etiqueta de culpa.",
 },
 {
 question: "Si dos seeds eligen el mismo k en el lab multi-seed, ¿qué puedes afirmar con rigor?",
 options: ["Hay acuerdo sobre el número de clusters k; la estabilidad de etiquetas exige otra métrica (p. ej. ARI)", "Las particiones son idénticas (ARI = 1)", "Se puede sancionar al segmento del cluster 0", "El silhouette del mes de test es válido"],
 correctIndex: 0,
 explanation: "El lab mide acuerdo de k (argmax por seed). Estabilidad de partición requiere comparar etiquetas o centroides (ARI, jitter), no solo el entero k.",
 }
 ],
 },
 resources: {
 docs: [
 { label: "sklearn outlier detection", url: "https://scikit-learn.org/stable/modules/outlier_detection.html", note: "IF/LOF; novelty vs. outlier" },
 { label: "sklearn clustering", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "k-means y límites" },
 { label: "sklearn PCA", url: "https://scikit-learn.org/stable/modules/decomposition.html#pca", note: "Proyecciones" },
 { label: "sklearn StandardScaler", url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html", note: "Scale-first antes de distancias" },
 { label: "Módulo statistics de Python — mean/pstdev", url: "https://docs.python.org/3/library/statistics.html", note: "Reglas σ en stdlib" },
 { label: "Py4E — progressive exercises", url: "https://www.py4e.com", note: "Pedagogía de liberación gradual" }
 ],
 books: [
 { label: "ISLR — PCA chapter", note: "Proyecciones e interpretación prudente" },
 { label: "ESL / anomaly detection surveys", note: "Novelty vs. outlier; límites de unsupervised" },
 { label: "Python Data Science Handbook (VanderPlas) — k-means/PCA", note: "Notebooks clásicos" }
 ],
 courses: [
 { label: "Stanford CS229 — unsupervised learning notes", url: "https://cs229.stanford.edu/", note: "k-means, PCA, framing unsupervised" },
 { label: "Coursera Machine Learning (clustering modules)", url: "https://www.coursera.org/learn/machine-learning", note: "Intuición de k-means y costo" },
 { label: "MIT OCW Intro ML (6.036 materials)", url: "https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/", note: "Framing unsupervised" },
 { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python", note: "Guided vs. independent problem design" },
 { label: "StatQuest — K-means clustering", url: "https://www.youtube.com/watch?v=4b5d3muPQmA", note: "Centroides con claridad visual" },
 { label: "StatQuest — PCA", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", note: "Ejes ≠ etiquetas morales" }
 ],
 },
}
