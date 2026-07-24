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
    "Un workbench serio **no reemplaza** reglas claras por un modelo opaco sin baseline. En equipos de datos en LatAm (banca, fintech, ops de riesgo), primero se documenta un **baseline** (dummy o regla) y costos de FP/FN de cola; solo entonces se prueba si un modelo supervisado mejora la **prioridad de revisión**. Predicción de cola ≠ etiqueta de fraude ni de parentesco. Capstone de referencia: workbench CP-N3-B con datos sintéticos.",
  learningOutcomes: [
    { text: "Definir unidad de scoring, target observable y horizonte temporal" },
    { text: "Fijar baseline de regla y dummy majority con costo FP/FN" },
    { text: "Calcular sigmoid, predicción umbralada y penalización L2" },
    { text: "Interpretar coeficientes escalados sin claim causal" },
    { text: "Aplicar stumps controlados y voto mayoritario frente al dummy" },
    { text: "Detectar overfit por gap train−valid y fijar seed reproducible" },
    { text: "Registrar runs mínimos (params, metrics, beats_dummy) aunque pierdan al dummy" },
    { text: "Aplicar group CV por entidad y leer n_groups / mean de folds" }
  ],
  theory: [
    {
      heading: "Por qué baselines antes de modelos opacos",
      paragraphs: [
        "Google *Rules of ML* lo resume así: lanza primero con **heurística o baseline**, mide el valor, y solo después sube la complejidad. En muchos equipos se desplegó un modelo opaco que **no** superaba a “siempre la clase mayoritaria”: meses de ingeniería, cero valor en cola. Esta sección no empuja stacking por deporte: define **unidad de scoring**, **target** y **horizonte**, y conserva un **baseline determinista** (dummy majority o regla simple) antes de cualquier modelo en el workbench de Red Andina (CP-N3-B).",
        "Producto incremental: comparación **honesta** dummy/regla vs lineal/árbol sobre el target sintético `needs_review_7d`. Entrada: features de S32 ya sin leakage (p. ej. `shared_phone`, `amount_z`); salida: métricas y la bandera `beats_dummy` — **sin** label de fraude ni parentesco. Un experimento que **no** supera al dummy sigue siendo un run válido: se registra y se documenta.",
        "Orden de la sección: **T1 framing y baseline** → **T2 lineales regularizados** → **T3 stumps y control de overfit** → **T4 tracking y group CV**. Usamos Python estándar (sigmoid, stump, seed) antes de APIs pesadas; en recursos quedan sklearn y Rules of ML. Predicción de prioridad de revisión ≠ veredicto de culpa."
      ],
      callout: {
        type: "info",
        title: "Gate baseline",
        content:
          "Sin baseline documentado no se promociona modelo. Target ≠ fraude. Datos sintéticos only. Un run con beats_dummy=False se loguea igual.",
      },
    },
    {
      heading: "Unidad, target y horizonte",
      subtopicId: "S33-T1-A",
      paragraphs: [
        "Antes de entrenar, cierra el **problema de scoring**: la **unidad** (par de entidades, caso o cuenta en el instante `t`), el **target observable** y el **horizonte** temporal (p. ej. 7 días). En el workbench de Red Andina, un target llamado `fraud` o `is_fraud` es un **breach de producto**: el ML solo prioriza la cola de revisión humana, no etiqueta delito ni parentesco.",
        "En la práctica trabajas con `unit`, el nombre del target y `horizon_days`. Si el nombre contiene `fraud`, rechazas el framing; si falta el horizonte, **no** inventes 7 en silencio — pides evidencia. Solo aceptas targets `needs_review_*` con horizonte **explícito**, y anotas la **prevalencia** de la clase positiva **antes** de cualquier fit: sin esa foto del desbalance, el dummy majority ya engaña.",
        "En `CASO-LIM-033`: `unit=entity_pair`, `target=needs_review_7d`, `horizon=7`. Con `y=[0,1,0,0]` la prevalencia es 0.25 y se anota en el log; `fraud_name=False`. Si falta el horizonte, el flujo pide evidencia (`REQUEST_HORIZON`) en lugar de inventar el valor por defecto."
      ],
      code: {
        language: 'python',
        title: "framing.py",
        code: `def frame_task(unit, target, horizon):
    fraud_name = "fraud" in target.lower()
    return unit, target, horizon, fraud_name

unit, target, horizon, fraud_name = frame_task("entity_pair", "needs_review_7d", 7)
y = [0, 1, 0, 0]
prevalence = round(sum(y) / len(y), 3)
print("unit", unit)
print("target", target)
print("horizon", horizon)
print("fraud_name", fraud_name)
print("prevalence", prevalence)`,
        output: `unit entity_pair
target needs_review_7d
horizon 7
fraud_name False
prevalence 0.25`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Cierra unit + target needs_review_* + horizon > 0. Si el nombre trae fraud → REJECT_FRAUD_TARGET. Si falta horizon → REQUEST_HORIZON (no inventes el valor).",
      },
    },
    {
      heading: "Costos, baseline de regla y dummy estimator",
      subtopicId: "S33-T1-B",
      paragraphs: [
        "El **dummy majority** (predecir siempre la clase más frecuente) y una **regla simple** (p. ej. `x >= thr` sobre un score de S32) anclan el valor mínimo del workbench. El costo `fp * c_fp + fn * c_fn` traduce errores a **impacto de cola**, no a moral de fraude: un FN caro significa un caso que debió revisarse y no se priorizó a tiempo.",
        "Necesitas `y`, las predicciones (dummy o regla) y los costos unitarios. De ahí salen accuracy del dummy, costo total y `has_baseline`. El error grave es **entrenar sin baseline documentado**. Calcula `beats_dummy` **después** de fijar dummy, regla y costo; si el modelo pierde, el run **sigue siendo válido** — solo no se promociona.",
        "En `CASO-LIM-033`: con `y=[1,1,0]` el dummy predice 1 y acierta 2/3 (acc≈0.667). El costo del propio dummy se deriva de comparar `y` vs predicciones (1 FP con c_fp=1 → costo 1). Documenta también la regla `x >= thr` y el dummy en el log **antes** del modelo lineal o del stump."
      ],
      code: {
        language: 'python',
        title: "baseline.py",
        code: `def dummy_and_cost(y, c_fp=1, c_fn=5):
    maj = max(set(y), key=y.count)
    dummy = [maj] * len(y)
    acc = sum(a == b for a, b in zip(y, dummy)) / len(y)
    cost = 0
    for yt, yp in zip(y, dummy):
        if yp == 1 and yt == 0:
            cost += c_fp
        if yp == 0 and yt == 1:
            cost += c_fn
    return round(acc, 3), cost, True

def rule_preds(x, thr=1.0):
    return [int(v >= thr) for v in x]

acc, cost, has_baseline = dummy_and_cost([1, 1, 0])
print("dummy_acc", acc)
print("cost", cost)
print("has_baseline", has_baseline)
print("rule", rule_preds([1.0, 1.0, 0.0], 1.0))`,
        output: `dummy_acc 0.667
cost 1
has_baseline True
rule [1, 1, 0]`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Calcula majority con max(set(y), key=y.count), deriva el costo de y vs pred, y guarda has_baseline=True. Sin baseline → REJECT_NO_BASELINE; sin costo → REQUEST_COST.",
      },
    },
    {
      heading: "Regresión logística y regularización L2",
      subtopicId: "S33-T2-A",
      paragraphs: [
        "La **regresión logística** modela P(y=1|x) con la **sigmoid** σ(z)=1/(1+e^{-z}), donde z = w·x + b. Es el primer modelo **interpretable** del workbench: cada feature de S32 aporta un peso legible, no una caja negra. La regularización **L2** penaliza Σw² (norma al cuadrado) y evita coeficientes enormes cuando hay **muchas columnas y pocas filas etiquetadas**.",
        "Si el número de features es grande frente al de ejemplos, un modelo sin penalización memoriza ruido. Reporta la penalty L2 en el log del experimento. El **umbral** thr convierte probabilidad en **prioridad de cola** (revisar sí/no), nunca en veredicto de fraude: bajar thr llena la cola; subirlo la estrecha. Compara siempre accuracy y costo contra el dummy de T1-B antes de celebrar el modelo.",
        "En `CASO-LIM-033`: σ(0)=0.5 y σ(0.2)≈0.55. Con w=1, b=0, x=0.2 y thr=0.6 la pred es **0** (0.55 no alcanza el umbral). Si thr fuera 0.5, la misma p daría pred 1: el umbral es una decisión de producto, no magia del modelo. La penalización L2 de w=[1,2] como Σw² es 5 (no confundir con √Σw²). Si L2 reportada es 0 con muchas features, el gate marca `REJECT_UNREGULARIZED`."
      ],
      code: {
        language: 'python',
        title: "logistic.py",
        code: `import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def pred_at(w, b, x, thr=0.5):
    return int(sigmoid(w * x + b) >= thr)

def l2_sq(ws):
    # norma L2 al cuadrado: Σ w_i²
    return sum(v * v for v in ws)

print(round(sigmoid(0), 3), round(sigmoid(2), 3))
# p≈0.55; thr=0.6 → no prioriza; thr=0.5 habría predicho 1
print("pred", pred_at(1.0, 0.0, 0.2, thr=0.6))
print("l2_sq", l2_sq([1, 2]))`,
        output: `0.5 0.881
pred 0
l2_sq 5`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Implementa sigmoid, pred_at(w,b,x,thr) y l2_sq = sum(v*v). L2==0 con modelo “listo” → REJECT_UNREGULARIZED. Sin p en [0,1] → REQUEST_SIGMOID.",
      },
    },
    {
      heading: "Coeficientes, supuestos y scaling",
      subtopicId: "S33-T2-B",
      paragraphs: [
        "Comparar magnitudes `|coef|` solo tiene sentido si las features están **escaladas** (z-score de S32: p. ej. `amount_z`). El **signo** indica dirección de asociación *en el modelo*, **no** causalidad social ni fraude probado: un `shared_phone` alto no “prueba” colusión entre entidades.",
        "Trabajas con un diccionario de coeficientes y un `scale_flag`. Ordenas por `|w|` y reportas el signo del top. Si las features **no** están escaladas, no compares magnitudes como si fueran importancia relativa. Antes de rankear para el informe: `scale_flag=True` y `causal=False`.",
        "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage (sin target futuro ni IDs crudos). En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba si está scaled; se imprime el ranking con `causal=False` para no sobre-interpretar el score de cola."
      ],
      code: {
        language: 'python',
        title: "coefs.py",
        code: `def rank_coefs(coefs):
    ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
    top = ranked[0]
    sign = "pos" if coefs[top] > 0 else "neg"
    return ranked, sign

# features S32 escaladas: shared_phone, amount_z
ranked, sign = rank_coefs({"shared_phone": 0.8, "amount_z": -0.2})
print(ranked)
print("sign_shared_phone", sign)
print("causal", False)
print("scaled", True)`,
        output: `['shared_phone', 'amount_z']
sign_shared_phone pos
causal False
scaled True`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Rankea por |coef| solo con scaled=True y causal=False. Sin scaling → REJECT_UNSCALED_COEF. Falta flag → REQUEST_SCALE_FLAG.",
      },
    },
    {
      heading: "Stumps, voto y ensambles controlados",
      subtopicId: "S33-T3-A",
      paragraphs: [
        "Un **stump** es un árbol de profundidad 1: una sola pregunta del tipo `x >= thr`. Varios stumps con **voto mayoritario** ilustran la idea de ensamble sin APIs pesadas. Random Forest y boosting son *familias* de ensambles (bagging vs. reponderar residuos); aquí solo practicamos stump + vote y el control de profundidad. Profundidad **ilimitada** overfittea el dataset sintético y miente frente al dummy.",
        "Recibes una lista `X`, el umbral del stump y una lista de votos de predictores débiles. Sales con las predicciones del stump y el majority vote. `depth_unlimited=True` sin validación es breach de control. Antes de declarar victoria del ensamble, compara su accuracy **contra el dummy** de T1-B.",
        "En `CASO-LIM-033`: thr=0.3 sobre `[0.1, 0.4]` produce `[0, 1]`; el voto de tres predictores débiles `[1,0,1]` da majority 1. Documenta `depth_unlimited=False` en el log del experimento."
      ],
      code: {
        language: 'python',
        title: "stump.py",
        code: `def stump_preds(X, thr):
    return [int(x >= thr) for x in X]

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

print("stump", stump_preds([0.1, 0.4], 0.3))
print("majority", majority_vote([1, 0, 1]))
print("depth_unlimited", False)`,
        output: `stump [0, 1]
majority 1
depth_unlimited False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "stump_preds con x>=thr y majority_vote; depth_unlimited debe ser False. Depth libre → REJECT_DEPTH_UNLIMITED. Sin stump → REQUEST_STUMP.",
      },
    },
    {
      heading: "Overfit, profundidad y reproducibilidad",
      subtopicId: "S33-T3-B",
      paragraphs: [
        "Un gap **train − valid** mayor que el umbral (aquí **0.2**) señala overfit: el modelo memorizó train y no generaliza. Elegir profundidad **solo mirando train** es el error clásico. Fijar **seed** hace comparable la corrida entre PRs del workbench; sin seed, no hay auditoría de regresiones entre versiones del modelo.",
        "Con `train_acc`, `valid_acc` y seed decides si hay overfit y generas una secuencia reproducible. La **mejor profundidad** se elige por **valid** (o por costo en valid), nunca solo por train. Si gap > 0.2 con seed presente, reportas el overfit y, según política del lab, controlas depth o rechazas el run.",
        "En `CASO-LIM-033`: `overfit(0.95, 0.70)` es True con gap=0.2; `seeded_ints(42)` produce tres enteros fijos `[1, 0, 4]`. Reporta seed en params del run junto a depth y gap observado."
      ],
      code: {
        language: 'python',
        title: "overfit.py",
        code: `import random

def overfit(train_acc, valid_acc, gap=0.2):
    return (train_acc - valid_acc) > gap

def seeded_ints(seed, n=3):
    random.seed(seed)
    return [random.randint(0, 9) for _ in range(n)]

print("overfit", overfit(0.95, 0.70))
print(seeded_ints(42))
print("seed", 42)`,
        output: `overfit True
[1, 0, 4]
seed 42`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Umbral de gap unificado: 0.2. Fija seed en params. gap grande → REJECT_OVERFIT; sin seed → REQUEST_SEED.",
      },
    },
    {
      heading: "Pipeline y tracking mínimo",
      subtopicId: "S33-T4-A",
      paragraphs: [
        "Un **run mínimo** registra `run_id`, `params`, `metrics` y la bandera `beats_dummy`. Sin log, “mejoré el modelo” es anécdota. **Importante:** un run que **no** supera al dummy sigue siendo válido si está bien logueado: la comparación honesta es el producto, no un score de vanidad. En ops de riesgo, un experimento que **pierde** al dummy y se documenta evita lanzar complejidad inútil a producción.",
        "Necesitas un dict de metrics, el `dummy_acc` documentado y un `run_id`. Ordenas las keys y **calculas** `beats_dummy` (True o False). Fallan los runs **sin metrics** o sin `run_id` — **no** los que pierden al dummy. No exijas `beats_dummy is True` para aceptar el log.",
        "En `CASO-LIM-033`: keys `accuracy,f1` sorted. Con accuracy=0.7 y dummy_acc=0.667 → beats_dummy=True. Con accuracy=0.5 → beats_dummy=False y el run **igual se registra** con esa verdad: la derrota es evidencia, no basura."
      ],
      code: {
        language: 'python',
        title: "tracking.py",
        code: `def metric_keys(metrics):
    return sorted(metrics)

def run_fields():
    return ["run_id", "params", "metrics", "beats_dummy"]

def beats_dummy(acc, dummy_acc):
    return acc > dummy_acc

def log_valid(metrics, run_id, beats):
    # válido si está logueado; beats puede ser False
    return bool(metrics) and bool(run_id) and isinstance(beats, bool)

dummy_acc = 0.667
win = {"f1": 0.6, "accuracy": 0.7}
lose = {"f1": 0.4, "accuracy": 0.5}
print(metric_keys(win))
print("fields", run_fields())
print("beats_win", beats_dummy(win["accuracy"], dummy_acc))
print("beats_lose", beats_dummy(lose["accuracy"], dummy_acc))
print("lose_run_ok", log_valid(lose, "run-lose-1", False))`,
        output: `['accuracy', 'f1']
fields ['run_id', 'params', 'metrics', 'beats_dummy']
beats_win True
beats_lose False
lose_run_ok True`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Loguea metrics + run_id + beats_dummy (puede ser False). Sin metrics → REQUEST_METRICS. Metrics vacías o sin run_id → REJECT_UNLOGGED_RUN.",
      },
    },
    {
      heading: "Validación cruzada por entidad y análisis de errores",
      subtopicId: "S33-T4-B",
      paragraphs: [
        "**Group CV por entidad** evita leakage entre folds: la misma entidad no debe aparecer en train y en valid del mismo split. Un random split clásico infla métricas cuando hay múltiples filas por entidad (pares, cuentas, dispositivos) — el modelo “recuerda” al par en valid porque ya lo vio en train.",
        "Recibes scores por fold y una lista de entity ids. Devuelves la media de folds y `n_groups = len(set(entities))`. `random_split=True` cuando las entidades se repiten entre folds es el error típico. El protocolo del workbench pide al menos dos grupos y `random_split=False`.",
        "En `CASO-LIM-033`: mean de `[0.6, 0.7, 0.65]` con `round(..., 3)` es **0.65**; con entities `e1,e1,e2,e3` hay **3** grupos. El **análisis de errores** mira el slice con más FN (p. ej. un tipo de par sintético), no solo la media global — umbrales y desbalance se profundizan en S34."
      ],
      code: {
        language: 'python',
        title: "group_cv.py",
        code: `def mean_fold(folds):
    return round(sum(folds) / len(folds), 3)

def n_groups(entities):
    return len(set(entities))

entities = ["e1", "e1", "e2", "e3"]
print("mean", mean_fold([0.6, 0.7, 0.65]))
print("n_groups", n_groups(entities))
print("random_leak_ok", False)`,
        output: `mean 0.65
n_groups 3
random_leak_ok False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "n_groups = len(set(entities)); mean_fold con round(..., 3). random_split → REJECT_RANDOM_LEAK. Sin entities → REQUEST_GROUP_IDS.",
      },
    }
  ],
  iDo: {
    intro: "Te muestro el camino completo: framing honesto, baseline y costo, logística con L2, coeficientes escalados, stump con voto, control de overfit, tracking aunque pierdas al dummy, y group CV por entidad — todo sobre fixtures sintéticos de Red Andina.",
    steps: [
      {
        demoId: "S33-T1-A-DEMO",
        subtopicId: "S33-T1-A",
        environment: "local-python",
        description: "Cierra unit, target needs_review_7d y horizon 7; rechaza nombre fraud y reporta prevalencia.",
        code: {
          language: 'python',
          title: "fr_demo.py",
          code: `def task_spec(unit, target, horizon):
    fraud_name = "fraud" in target.lower()
    return unit, target, horizon, fraud_name

unit, target, horizon, fraud_name = task_spec("entity_pair", "needs_review_7d", 7)
y = [0, 1, 0, 0]
print(unit, target, horizon)
print("fraud_name", fraud_name)
print("prevalence", round(sum(y) / len(y), 3))`,
          output: `entity_pair needs_review_7d 7
fraud_name False
prevalence 0.25`,
        },
        why: "El framing cierra el problema de scoring de cola sin convertir el target en fraude y obliga a mirar la prevalencia antes de modelar.",
      },
      {
        demoId: "S33-T1-B-DEMO",
        subtopicId: "S33-T1-B",
        environment: "local-python",
        description: "Dummy majority con accuracy y costo derivados de y vs predicciones.",
        code: {
          language: 'python',
          title: "base_demo.py",
          code: `def dummy_acc_and_cost(y, c_fp=1, c_fn=5):
    maj = max(set(y), key=y.count)
    dummy = [maj] * len(y)
    acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
    cost = 0
    for yt, yp in zip(y, dummy):
        if yp == 1 and yt == 0:
            cost += c_fp
        if yp == 0 and yt == 1:
            cost += c_fn
    return acc, cost

acc, cost = dummy_acc_and_cost([1, 1, 0])
print("dummy_acc", acc)
print("cost", cost)
print("has_baseline", True)`,
          output: `dummy_acc 0.667
cost 1
has_baseline True`,
        },
        why: "Sin baseline y costo calculados, el ML no demuestra valor incremental en el workbench.",
      },
      {
        demoId: "S33-T2-A-DEMO",
        subtopicId: "S33-T2-A",
        environment: "local-python",
        description: "sigmoid(0), predicción con thr=0.6 (p≈0.55 → 0) y L2 al cuadrado de los pesos.",
        code: {
          language: 'python',
          title: "log_demo.py",
          code: `import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def pred_at(x, thr=0.5):
    return int(sigmoid(1.0 * x + 0.0) >= thr)

def l2_sq(ws):
    return sum(v * v for v in ws)

print(round(sigmoid(0), 3), round(sigmoid(2), 3))
# p≈0.55 < 0.6 → no entra a cola de revisión
print("pred", pred_at(0.2, thr=0.6))
print("l2_sq", l2_sq([1, 2]))`,
          output: `0.5 0.881
pred 0
l2_sq 5`,
        },
        why: "La logística regularizada da scores interpretables; el umbral es decisión de producto y el L2 se reporta antes de árboles más flexibles.",
      },
      {
        demoId: "S33-T2-B-DEMO",
        subtopicId: "S33-T2-B",
        environment: "local-python",
        description: "Ranking de |coef| con features S32 scaled y signo sin claim causal.",
        code: {
          language: 'python',
          title: "coef_demo.py",
          code: `def rank_coefs(coefs):
    return sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)

coefs = {"shared_phone": 0.8, "amount_z": -0.2}
print(rank_coefs(coefs))
print("causal", False)
print("scaled", True)`,
          output: `['shared_phone', 'amount_z']
causal False
scaled True`,
        },
        why: "Coeficientes comparables exigen scaling; el signo no prueba causa social ni fraude.",
      },
      {
        demoId: "S33-T3-A-DEMO",
        subtopicId: "S33-T3-A",
        environment: "local-python",
        description: "Stump thr=0.3 y majority vote de tres predictores débiles.",
        code: {
          language: 'python',
          title: "stump_demo.py",
          code: `def stump_preds(X, thr):
    return [int(x >= thr) for x in X]

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

print("stump", stump_preds([0.1, 0.4], 0.3))
print("majority", majority_vote([1, 0, 1]))
print("depth_unlimited", False)`,
          output: `stump [0, 1]
majority 1
depth_unlimited False`,
        },
        why: "El stump y el voto muestran la idea de ensamble controlado sin profundidad ilimitada ni APIs no enseñadas.",
      },
      {
        demoId: "S33-T3-B-DEMO",
        subtopicId: "S33-T3-B",
        environment: "local-python",
        description: "Detecta overfit por gap train−valid (umbral 0.2) y fija seed reproducible.",
        code: {
          language: 'python',
          title: "ov_demo.py",
          code: `import random

def overfit(train_acc, valid_acc, gap=0.2):
    return (train_acc - valid_acc) > gap

def seeded_ints(seed, n=3):
    random.seed(seed)
    return [random.randint(0, 9) for _ in range(n)]

print("overfit", overfit(0.95, 0.70))
print(seeded_ints(42))
print("seed", 42)`,
          output: `overfit True
[1, 0, 4]
seed 42`,
        },
        why: "Reproducibilidad y control de overfit son requisitos de experimentación responsable.",
      },
      {
        demoId: "S33-T4-A-DEMO",
        subtopicId: "S33-T4-A",
        environment: "local-python",
        description: "Keys sorted, beats_dummy calculado (victoria y derrota) y run válido aunque pierda al dummy.",
        code: {
          language: 'python',
          title: "track_demo.py",
          code: `def metric_keys(metrics):
    return sorted(metrics)

def beats_dummy(acc, dummy_acc):
    return acc > dummy_acc

def run_ok(metrics, run_id, beats):
    return bool(metrics) and bool(run_id) and isinstance(beats, bool)

dummy_acc = 0.667
win = {"f1": 0.6, "accuracy": 0.7}
lose = {"f1": 0.4, "accuracy": 0.5}
print(metric_keys(win))
print("beats_win", beats_dummy(win["accuracy"], dummy_acc))
print("beats_lose", beats_dummy(lose["accuracy"], dummy_acc))
print("lose_run_ok", run_ok(lose, "run-lose-1", False))`,
          output: `['accuracy', 'f1']
beats_win True
beats_lose False
lose_run_ok True`,
        },
        why: "El tracking mínimo compara runs con honestidad: un beats_dummy False bien logueado es válido; metrics vacías no.",
      },
      {
        demoId: "S33-T4-B-DEMO",
        subtopicId: "S33-T4-B",
        environment: "local-python",
        description: "Mean de folds (3 decimales) y n_groups desde entidades únicas.",
        code: {
          language: 'python',
          title: "gcv_demo.py",
          code: `def mean_fold(folds):
    return round(sum(folds) / len(folds), 3)

def n_groups(entities):
    return len(set(entities))

entities = ["e1", "e1", "e2", "e3"]
print("mean", mean_fold([0.6, 0.7, 0.65]))
print("n_groups", n_groups(entities))
print("random_leak_ok", False)`,
          output: `mean 0.65
n_groups 3
random_leak_ok False`,
        },
        why: "Group CV evita que la misma entidad contamine train y valid del workbench.",
      }
    ],
  },
  weDo: {
    intro: "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema: primero reparas un cálculo o contrato defectuoso, luego modelas rutas válido/adverso/faltante, y al final aplicas fallo cerrado (continuar / rechazar / pedir evidencia).",
    steps: [
      {
        id: "S33-T1-A-E1",
        subtopicId: "S33-T1-A",
        kind: "guided",
        instruction: "S33-T1-A-E1 · **Calcula** el framing de `CASO-LIM-033-1A`: con `y=[0,1,0,0]` la prevalencia debe ser 0.25; el target `needs_review_7d` no debe contener `fraud`; horizon=7 y unit no vacío. El starter divide por `len(y)-1` (DEFECT) e invierte el check de fraud. Corrige ambos y obtén PASS. Salida exacta: `S33-T1-A PASS`.",
        hint: "prevalence = round(sum(y)/len(y), 3); fraud_name = \"fraud\" in target.lower(); exige fraud_name is False y horizon > 0.",
        hints: [
          "prevalence = round(sum(y)/len(y), 3); fraud_name = \"fraud\" in target.lower(); exige fraud_name is False y horizon > 0.",
          "Con y=[0,1,0,0] hay un positivo de cuatro → 0.25. No uses len(y)-1.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "Tras corregir prevalencia y fraud_name, imprime `S33-T1-A PASS`.",
        feedback: "S33-T1-A-E1: el framing cierra unit/target/horizon y obliga a mirar prevalencia antes de modelar; fraud en el nombre es breach.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e1.py",
          code: `# CASO-LIM-033 · unit/target/horizon + prevalencia
# DEFECT: divide por len(y)-1; acepta target con fraud
# TAREA: prevalence==0.25 y fraud_name False; imprime S33-T1-A PASS
unit, target, horizon = "entity_pair", "needs_review_7d", 7
y = [0, 1, 0, 0]
prevalence = round(sum(y) / (len(y) - 1), 3)  # DEFECT
fraud_name = "fraud" in target.lower()
meets_contract = (
    prevalence == 0.25
    and fraud_name is True  # DEFECT: debería ser False
    and horizon > 0
    and bool(unit)
)
status = "PASS" if meets_contract else "REJECT_FRAUD_TARGET"
print("S33-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e1.py",
          code: `unit, target, horizon = "entity_pair", "needs_review_7d", 7
y = [0, 1, 0, 0]
prevalence = round(sum(y) / len(y), 3)
fraud_name = "fraud" in target.lower()
meets_contract = (
    prevalence == 0.25
    and fraud_name is False
    and horizon > 0
    and bool(unit)
)
status = "PASS" if meets_contract else "REJECT_FRAUD_TARGET"
print("S33-T1-A", status)
assert meets_contract is True
` ,
          output: `S33-T1-A PASS` ,
        },
      },
      {
        id: "S33-T1-A-E2",
        subtopicId: "S33-T1-A",
        kind: "independent",
        instruction: "S33-T1-A-E2 · Modela tres rutas de framing: fixture válido (needs_review_7d), adverso (`is_fraud`) y registro sin `horizon`. Salidas exactas: `PASS`, `REJECT_FRAUD_TARGET`, `MISSING:horizon`. Primero valida campos faltantes; después el contenido del target.",
        hint: "Primero se calcula `missing`; ningún acceso a horizon debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a horizon debe ocurrir antes de esa rama.",
          "Después aplica: target sin fraud, horizon > 0 y unit truthy. El adverso falla por contenido, no por schema.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `horizon` ausente y produce exactamente `PASS REJECT_FRAUD_TARGET MISSING:horizon`.",
        feedback: "S33-T1-A-E2: ausencia ≠ breach; missing va a MISSING:horizon y el nombre fraud a REJECT_FRAUD_TARGET.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e2.py",
          code: `# CASO-LIM-033 · assess framing (REJECT_FRAUD_TARGET)
# DEFECT: da PASS cuando el target contiene "fraud"
# TAREA: missing primero; luego needs_review sin fraud + horizon>0
def assess(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if "fraud" in record["target"] else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
invalid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'is_fraud', 'horizon': 7}}
incomplete = {**valid}
incomplete.pop("horizon")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if "fraud" not in record["target"] and record["horizon"] > 0 and bool(record["unit"]) else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
invalid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'is_fraud', 'horizon': 7}}
incomplete = {**valid}
incomplete.pop("horizon")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_FRAUD_TARGET MISSING:horizon` ,
        },
      },
      {
        id: "S33-T1-A-E3",
        subtopicId: "S33-T1-A",
        kind: "transfer",
        instruction: "S33-T1-A-E3 · Fallo cerrado para framing: `CASO-LIM-033-1A` → `CONTINUE`, adverso `is_fraud` → `REJECT_FRAUD_TARGET`, sin `horizon` → `REQUEST_HORIZON`. El starter trata missing como CONTINUE y tiene el predicado invertido: corrige ambas ramas.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HORIZON` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HORIZON` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla de needs_review + horizon + unit; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "Fixtures `CASO-LIM-033-1A`, adverso y sin `horizon` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T1-A-E3: CONTINUE solo con framing limpio; REQUEST_* pide evidencia; REJECT_* cierra el breach.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e3.py",
          code: `# CASO-LIM-033 · decide framing (REQUEST_HORIZON / REJECT_FRAUD_TARGET)
# DEFECT: missing→CONTINUE; pred invertido sobre fraud
# TAREA: sin horizon → REQUEST_HORIZON; is_fraud → REJECT; limpio → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if "fraud" in record["target"] else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
invalid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'is_fraud', 'horizon': 7}}
uncertain = {**valid}
uncertain.pop("horizon")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_HORIZON"
    return "CONTINUE" if "fraud" not in record["target"] and record["horizon"] > 0 and bool(record["unit"]) else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
invalid = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'is_fraud', 'horizon': 7}}
uncertain = {**valid}
uncertain.pop("horizon")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FRAUD_TARGET", "REQUEST_HORIZON"]
` ,
          output: `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON` ,
        },
      },
      {
        id: "S33-T1-B-E1",
        subtopicId: "S33-T1-B",
        kind: "guided",
        instruction: "S33-T1-B-E1 · **Calcula** dummy majority y **costo** sobre `y=[1,1,0]` con c_fp=1, c_fn=5. El starter usa `min` (minoría) y deja `cost=0` hardcodeado (DEFECT). Corrige: majority con `max`, deriva costo de y vs predicciones dummy, espera `dummy_acc==0.667` y `cost==1` (un FP). Salida: `S33-T1-B PASS`.",
        hint: "maj = max(set(y), key=y.count); dummy = [maj]*len(y); suma c_fp/c_fn al comparar y vs dummy.",
        hints: [
          "maj = max(set(y), key=y.count); dummy = [maj]*len(y); suma c_fp/c_fn al comparar y vs dummy.",
          "Con y=[1,1,0] majority es 1 → dummy [1,1,1]: un FP en la tercera fila → cost=1; acc=2/3≈0.667.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "Tras max + costo derivado, dummy_acc==0.667 y cost==1 e imprime `S33-T1-B PASS`.",
        feedback: "S33-T1-B-E1: baseline y costo se calculan de y vs pred; min y cost=0 mentían el ancla del workbench.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `# CASO-LIM-033 · baseline dummy + costo de cola
# DEFECT: majority con min; cost hardcodeado en 0
# TAREA: max + costo desde y vs dummy; acc==0.667 y cost==1
y = [1, 1, 0]
c_fp, c_fn = 1, 5
maj = min(set(y), key=y.count)  # DEFECT: minoría
dummy = [maj] * len(y)
dummy_acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
cost = 0  # DEFECT: debe derivarse de FP/FN
meets_contract = dummy_acc == 0.667 and cost == 1
status = "PASS" if meets_contract else "REJECT_NO_BASELINE"
print("S33-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `y = [1, 1, 0]
c_fp, c_fn = 1, 5
maj = max(set(y), key=y.count)
dummy = [maj] * len(y)
dummy_acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
cost = 0
for yt, yp in zip(y, dummy):
    if yp == 1 and yt == 0:
        cost += c_fp
    if yp == 0 and yt == 1:
        cost += c_fn
meets_contract = dummy_acc == 0.667 and cost == 1
status = "PASS" if meets_contract else "REJECT_NO_BASELINE"
print("S33-T1-B", status)
assert meets_contract is True
` ,
          output: `S33-T1-B PASS` ,
        },
      },
      {
        id: "S33-T1-B-E2",
        subtopicId: "S33-T1-B",
        kind: "independent",
        instruction: "S33-T1-B-E2 · Tres rutas de baseline: válido (has_baseline True, cost y dummy_acc presentes), adverso (has_baseline False) y sin campo `cost`. Salidas: `PASS`, `REJECT_NO_BASELINE`, `MISSING:cost`.",
        hint: "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
          "PASS solo si has_baseline is True, cost is not None y dummy_acc >= 0.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "Produce exactamente `PASS REJECT_NO_BASELINE MISSING:cost`.",
        feedback: "S33-T1-B-E2: sin baseline documentado no se promociona modelo; falta cost pide REQUEST en E3.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e2.py",
          code: `# CASO-LIM-033 · assess baseline (REJECT_NO_BASELINE)
# DEFECT: da PASS cuando has_baseline es False
# TAREA: missing de cost primero; PASS solo con baseline + cost + dummy_acc
def assess(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 1, 'has_baseline': True}}
invalid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.0, 'cost': None, 'has_baseline': False}}
incomplete = {**valid}
incomplete.pop("cost")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["has_baseline"] is True and record["cost"] is not None and record["dummy_acc"] >= 0 else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 1, 'has_baseline': True}}
invalid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.0, 'cost': None, 'has_baseline': False}}
incomplete = {**valid}
incomplete.pop("cost")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_NO_BASELINE MISSING:cost` ,
        },
      },
      {
        id: "S33-T1-B-E3",
        subtopicId: "S33-T1-B",
        kind: "transfer",
        instruction: "S33-T1-B-E3 · Fallo cerrado: válido → `CONTINUE`, sin baseline → `REJECT_NO_BASELINE`, sin `cost` → `REQUEST_COST`. Corrige missing→CONTINUE y el predicado invertido del starter.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_COST` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_COST` antes de evaluar el contenido.",
          "CONTINUE solo con has_baseline True, cost no nulo y dummy_acc >= 0.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "Produce `CONTINUE REJECT_NO_BASELINE REQUEST_COST`.",
        feedback: "S33-T1-B-E3: el costo de cola se pide; no se inventa un c_fn por defecto en silencio.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e3.py",
          code: `# CASO-LIM-033 · decide baseline (REQUEST_COST / REJECT_NO_BASELINE)
# DEFECT: missing→CONTINUE; pred invertido
# TAREA: sin cost → REQUEST_COST; sin baseline → REJECT; ok → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 1, 'has_baseline': True}}
invalid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.0, 'cost': None, 'has_baseline': False}}
uncertain = {**valid}
uncertain.pop("cost")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_COST"
    return "CONTINUE" if record["has_baseline"] is True and record["cost"] is not None and record["dummy_acc"] >= 0 else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 1, 'has_baseline': True}}
invalid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.0, 'cost': None, 'has_baseline': False}}
uncertain = {**valid}
uncertain.pop("cost")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_NO_BASELINE", "REQUEST_COST"]
` ,
          output: `CONTINUE REJECT_NO_BASELINE REQUEST_COST` ,
        },
      },
      {
        id: "S33-T2-A-E1",
        subtopicId: "S33-T2-A",
        kind: "guided",
        instruction: "S33-T2-A-E1 · **Calcula** sigmoid, predicción umbralada y L2². Con z=0 → p=0.5; con w=1,b=0,x=0.2 y thr=0.6 → pred=0; con w=[1,2] → l2_sq=5. El starter usa L1 y thr=0.5 (DEFECT). Corrige a Σw² y thr=0.6. Salida: `S33-T2-A PASS`.",
        hint: "sigmoid(0)=0.5; pred = int(sigmoid(w*x+b) >= thr); l2_sq = sum(v*v for v in ws).",
        hints: [
          "sigmoid(0)=0.5; pred = int(sigmoid(w*x+b) >= thr); l2_sq = sum(v*v for v in ws).",
          "p≈0.55 < 0.6 → pred 0. L2 al cuadrado de [1,2] es 5 (no uses abs ni la raíz).",
        ],
        edgeCases: ["falta p", "fixture adverso: l2_sq==0 (sin regularizar)", "CASO-LIM-033-2A es sintético"],
        tests: "p==0.5, pred==0, l2_sq==5 e imprime `S33-T2-A PASS`.",
        feedback: "S33-T2-A-E1: sigmoid + umbral de producto + L2² son el primer modelo interpretable del workbench.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e1.py",
          code: `# CASO-LIM-033 · sigmoid + thr + L2 al cuadrado
# DEFECT: L1 en vez de Σw²; thr=0.5 en vez de 0.6
# TAREA: p==0.5, pred==0 con thr=0.6, l2_sq==5
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

ws, w, b, x = [1, 2], 1.0, 0.0, 0.2
thr = 0.5  # DEFECT: debe ser 0.6 para el caso del lab
p = round(sigmoid(0), 3)
pred = int(sigmoid(w * x + b) >= thr)
l2_sq = sum(abs(v) for v in ws)  # DEFECT: L1
meets_contract = p == 0.5 and pred == 0 and l2_sq == 5
status = "PASS" if meets_contract else "REJECT_UNREGULARIZED"
print("S33-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-a-e1.py",
          code: `import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

ws, w, b, x = [1, 2], 1.0, 0.0, 0.2
thr = 0.6
p = round(sigmoid(0), 3)
pred = int(sigmoid(w * x + b) >= thr)
l2_sq = sum(v * v for v in ws)
meets_contract = p == 0.5 and pred == 0 and l2_sq == 5
status = "PASS" if meets_contract else "REJECT_UNREGULARIZED"
print("S33-T2-A", status)
assert meets_contract is True
` ,
          output: `S33-T2-A PASS` ,
        },
      },
      {
        id: "S33-T2-A-E2",
        subtopicId: "S33-T2-A",
        kind: "independent",
        instruction: "S33-T2-A-E2 · Tres rutas de logística regularizada: válido (p en [0,1], pred binaria, l2>0), adverso (l2=0) y sin campo `p`. Salidas: `PASS`, `REJECT_UNREGULARIZED`, `MISSING:p`.",
        hint: "Primero `missing`; luego exige l2 > 0, p en [0,1] y pred en (0, 1).",
        hints: [
          "Primero `missing`; luego exige l2 > 0, p en [0,1] y pred en (0, 1).",
          "El adverso con l2=0 falla por contenido, no por schema.",
        ],
        edgeCases: ["falta p", "fixture adverso: l2_sq==0 (sin regularizar)", "CASO-LIM-033-2A es sintético"],
        tests: "Produce `PASS REJECT_UNREGULARIZED MISSING:p`.",
        feedback: "S33-T2-A-E2: L2==0 con modelo “listo” es breach de regularización en este lab.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e2.py",
          code: `# CASO-LIM-033 · assess logística (REJECT_UNREGULARIZED)
# DEFECT: da PASS cuando l2==0
# TAREA: missing de p primero; PASS solo con l2>0, p en [0,1], pred binaria
def assess(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["l2"] == 0 else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 0.0}}
incomplete = {**valid}
incomplete.pop("p")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["l2"] > 0 and 0 <= record["p"] <= 1 and record["pred"] in (0, 1) else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 0.0}}
incomplete = {**valid}
incomplete.pop("p")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNREGULARIZED MISSING:p` ,
        },
      },
      {
        id: "S33-T2-A-E3",
        subtopicId: "S33-T2-A",
        kind: "transfer",
        instruction: "S33-T2-A-E3 · Fallo cerrado: válido → `CONTINUE`, l2=0 → `REJECT_UNREGULARIZED`, sin `p` → `REQUEST_SIGMOID`. Corrige missing y el predicado invertido.",
        hint: "Missing → REQUEST_SIGMOID; COMPLETE con L2>0 y p/pred válidos → CONTINUE.",
        hints: [
          "Missing → REQUEST_SIGMOID; COMPLETE con L2>0 y p/pred válidos → CONTINUE.",
          "No trates l2=0 como CONTINUE.",
        ],
        edgeCases: ["falta p", "fixture adverso: l2_sq==0 (sin regularizar)", "CASO-LIM-033-2A es sintético"],
        tests: "Produce `CONTINUE REJECT_UNREGULARIZED REQUEST_SIGMOID`.",
        feedback: "S33-T2-A-E3: sin probabilidad sigmoid no se prioriza cola; se pide evidencia.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e3.py",
          code: `# CASO-LIM-033 · decide logística (REQUEST_SIGMOID / REJECT_UNREGULARIZED)
# DEFECT: missing→CONTINUE; pred invertido sobre l2
# TAREA: sin p → REQUEST_SIGMOID; l2=0 → REJECT; regularizado → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["l2"] == 0 else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 0.0}}
uncertain = {**valid}
uncertain.pop("p")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SIGMOID"
    return "CONTINUE" if record["l2"] > 0 and 0 <= record["p"] <= 1 and record["pred"] in (0, 1) else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 0.0}}
uncertain = {**valid}
uncertain.pop("p")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNREGULARIZED", "REQUEST_SIGMOID"]
` ,
          output: `CONTINUE REJECT_UNREGULARIZED REQUEST_SIGMOID` ,
        },
      },
      {
        id: "S33-T2-B-E1",
        subtopicId: "S33-T2-B",
        kind: "guided",
        instruction: "S33-T2-B-E1 · **Calcula** el ranking de `|coef|` sobre features S32 `shared_phone=0.8` y `amount_z=-0.2`. El starter ordena por magnitud **ascendente** (DEFECT) y exige `causal is True`. Corrige a ranking descendente por `|w|`, top=`shared_phone`, `scaled is True` y `causal is False`. Salida: `S33-T2-B PASS`.",
        hint: "ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True); top debe ser shared_phone.",
        hints: [
          "ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True); top debe ser shared_phone.",
          "scaled True y causal False son obligatorios antes de rankear para el informe.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Tras reverse=True y causal=False, top es shared_phone e imprime `S33-T2-B PASS`.",
        feedback: "S33-T2-B-E1: se rankea por |coef| solo con features escaladas; el signo no prueba causa social.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e1.py",
          code: `# CASO-LIM-033 · rank |coef| features S32
# DEFECT: orden ascendente; exige causal True
# TAREA: ranking por |w| desc; top=shared_phone; causal=False
coefs = {"shared_phone": 0.8, "amount_z": -0.2}
scaled, causal = True, False
ranked = sorted(coefs, key=lambda k: abs(coefs[k]))  # DEFECT: falta reverse=True
top = ranked[0]
meets_contract = top == "shared_phone" and scaled is True and causal is True  # DEFECT
status = "PASS" if meets_contract else "REJECT_UNSCALED_COEF"
print("S33-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-b-e1.py",
          code: `coefs = {"shared_phone": 0.8, "amount_z": -0.2}
scaled, causal = True, False
ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
top = ranked[0]
meets_contract = top == "shared_phone" and scaled is True and causal is False
status = "PASS" if meets_contract else "REJECT_UNSCALED_COEF"
print("S33-T2-B", status)
assert meets_contract is True
` ,
          output: `S33-T2-B PASS` ,
        },
      },
      {
        id: "S33-T2-B-E2",
        subtopicId: "S33-T2-B",
        kind: "independent",
        instruction: "S33-T2-B-E2 · Tres rutas: válido (scaled True, causal False), adverso (scaled False y/o causal True), sin campo `scaled`. Salidas: `PASS`, `REJECT_UNSCALED_COEF`, `MISSING:scaled`.",
        hint: "Primero missing; luego scaled True y causal False.",
        hints: [
          "Primero missing; luego scaled True y causal False.",
          "El adverso falla por flags de interpretación, no por schema.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Produce `PASS REJECT_UNSCALED_COEF MISSING:scaled`.",
        feedback: "S33-T2-B-E2: coefs de features S32 solo se rankean si vienen escalados.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e2.py",
          code: `# CASO-LIM-033 · assess coeficientes (REJECT_UNSCALED_COEF)
# DEFECT: da PASS cuando scaled=False o causal=True
# TAREA: missing de scaled primero; PASS solo scaled=True y causal=False
def assess(record: dict) -> str:
    required = {"case_id", 'coefs', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["scaled"] is False or record["causal"] is True else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
invalid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': False, 'causal': True}}
incomplete = {**valid}
incomplete.pop("scaled")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'coefs', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["scaled"] is True and record["causal"] is False else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
invalid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': False, 'causal': True}}
incomplete = {**valid}
incomplete.pop("scaled")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNSCALED_COEF MISSING:scaled` ,
        },
      },
      {
        id: "S33-T2-B-E3",
        subtopicId: "S33-T2-B",
        kind: "transfer",
        instruction: "S33-T2-B-E3 · Fallo cerrado: válido → `CONTINUE`, unscaled/causal → `REJECT_UNSCALED_COEF`, sin `scaled` → `REQUEST_SCALE_FLAG`.",
        hint: "Missing → REQUEST_SCALE_FLAG antes de mirar causal.",
        hints: [
          "Missing → REQUEST_SCALE_FLAG antes de mirar causal.",
          "CONTINUE solo con scaled True y causal False.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Produce `CONTINUE REJECT_UNSCALED_COEF REQUEST_SCALE_FLAG`.",
        feedback: "S33-T2-B-E3: pedir el scale flag evita rankings engañosos en el informe.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e3.py",
          code: `# CASO-LIM-033 · decide coeficientes (REQUEST_SCALE_FLAG / REJECT_UNSCALED_COEF)
# DEFECT: missing→CONTINUE; pred invertido sobre flags
# TAREA: sin scaled → REQUEST_SCALE_FLAG; unscaled/causal → REJECT; ok → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'coefs', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["scaled"] is False or record["causal"] is True else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
invalid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': False, 'causal': True}}
uncertain = {**valid}
uncertain.pop("scaled")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'coefs', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SCALE_FLAG"
    return "CONTINUE" if record["scaled"] is True and record["causal"] is False else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
invalid = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': False, 'causal': True}}
uncertain = {**valid}
uncertain.pop("scaled")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNSCALED_COEF", "REQUEST_SCALE_FLAG"]
` ,
          output: `CONTINUE REJECT_UNSCALED_COEF REQUEST_SCALE_FLAG` ,
        },
      },
      {
        id: "S33-T3-A-E1",
        subtopicId: "S33-T3-A",
        kind: "guided",
        instruction: "S33-T3-A-E1 · **Calcula** stump y majority vote. El starter usa `x < thr` (invertido) y majority por `sum > len` (DEFECT). Corrige: `stump_preds([0.1,0.4], 0.3) → [0,1]` y `majority_vote([1,0,1]) → 1`; `depth_unlimited=False`. Salida: `S33-T3-A PASS`.",
        hint: "stump: int(x >= thr); majority: sum(votes) >= (len(votes)+1)//2.",
        hints: [
          "stump: int(x >= thr); majority: sum(votes) >= (len(votes)+1)//2.",
          "0.1 → 0, 0.4 → 1; votos [1,0,1] → majority 1.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "preds==[0,1], maj==1, depth_unlimited False e imprime `S33-T3-A PASS`.",
        feedback: "S33-T3-A-E1: stump + voto es el ensamble controlado del lab; el sentido del umbral y el voto importan.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e1.py",
          code: `# CASO-LIM-033 · stump thr=0.3 + majority vote
# DEFECT: x < thr; majority con umbral incorrecto
# TAREA: preds==[0,1], maj==1, depth_unlimited False
def stump_preds(X, thr):
    return [int(x < thr) for x in X]  # DEFECT

def majority_vote(votes):
    return int(sum(votes) > len(votes))  # DEFECT

preds = stump_preds([0.1, 0.4], 0.3)
maj = majority_vote([1, 0, 1])
depth_unlimited = False
meets_contract = preds == [0, 1] and maj == 1 and depth_unlimited is False
status = "PASS" if meets_contract else "REJECT_DEPTH_UNLIMITED"
print("S33-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-a-e1.py",
          code: `def stump_preds(X, thr):
    return [int(x >= thr) for x in X]

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

preds = stump_preds([0.1, 0.4], 0.3)
maj = majority_vote([1, 0, 1])
depth_unlimited = False
meets_contract = preds == [0, 1] and maj == 1 and depth_unlimited is False
status = "PASS" if meets_contract else "REJECT_DEPTH_UNLIMITED"
print("S33-T3-A", status)
assert meets_contract is True
` ,
          output: `S33-T3-A PASS` ,
        },
      },
      {
        id: "S33-T3-A-E2",
        subtopicId: "S33-T3-A",
        kind: "independent",
        instruction: "S33-T3-A-E2 · Tres rutas de stump controlado: válido (depth_unlimited False y stump_preds no vacío), adverso (depth_unlimited True), sin `stump_preds`. Salidas: `PASS`, `REJECT_DEPTH_UNLIMITED`, `MISSING:stump_preds`.",
        hint: "PASS si depth_unlimited is False y len(stump_preds) >= 1.",
        hints: [
          "PASS si depth_unlimited is False y len(stump_preds) >= 1.",
          "Primero missing; el adverso falla por depth libre.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "Produce `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds`.",
        feedback: "S33-T3-A-E2: profundidad ilimitada overfittea y se rechaza en este lab.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e2.py",
          code: `# CASO-LIM-033 · assess stump (REJECT_DEPTH_UNLIMITED)
# DEFECT: da PASS cuando depth_unlimited es True
# TAREA: missing de stump_preds primero; PASS solo con depth controlada y preds
def assess(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["depth_unlimited"] is True else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
invalid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': True}}
incomplete = {**valid}
incomplete.pop("stump_preds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["depth_unlimited"] is False and len(record["stump_preds"]) >= 1 else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
invalid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': True}}
incomplete = {**valid}
incomplete.pop("stump_preds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds` ,
        },
      },
      {
        id: "S33-T3-A-E3",
        subtopicId: "S33-T3-A",
        kind: "transfer",
        instruction: "S33-T3-A-E3 · Fallo cerrado: stump controlado → `CONTINUE`, depth libre → `REJECT_DEPTH_UNLIMITED`, sin stump → `REQUEST_STUMP`.",
        hint: "Missing → REQUEST_STUMP; depth_unlimited True → REJECT.",
        hints: [
          "Missing → REQUEST_STUMP; depth_unlimited True → REJECT.",
          "CONTINUE solo con depth_unlimited False y lista de preds no vacía.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "Produce `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP`.",
        feedback: "S33-T3-A-E3: se pide el stump antes de aceptar un ensamble opaco.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e3.py",
          code: `# CASO-LIM-033 · decide stump (REQUEST_STUMP / REJECT_DEPTH_UNLIMITED)
# DEFECT: missing→CONTINUE; pred invertido sobre depth
# TAREA: sin stump → REQUEST_STUMP; depth libre → REJECT; controlado → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["depth_unlimited"] is True else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
invalid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': True}}
uncertain = {**valid}
uncertain.pop("stump_preds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_STUMP"
    return "CONTINUE" if record["depth_unlimited"] is False and len(record["stump_preds"]) >= 1 else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
invalid = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': True}}
uncertain = {**valid}
uncertain.pop("stump_preds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_DEPTH_UNLIMITED", "REQUEST_STUMP"]
` ,
          output: `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP` ,
        },
      },
      {
        id: "S33-T3-B-E1",
        subtopicId: "S33-T3-B",
        kind: "guided",
        instruction: "S33-T3-B-E1 · **Calcula** el gap train−valid con umbral **0.2**. El starter usa gap=0.15 (DEFECT de umbral) e invierte la condición de PASS. Con train=0.8, valid=0.75 el gap es 0.05 (bajo control) y seed=42 debe estar presente. Salida: `S33-T3-B PASS`.",
        hint: "gap = train_acc - valid_acc; overfit si gap > 0.2; PASS si not overfit y seed is not None.",
        hints: [
          "gap = train_acc - valid_acc; overfit si gap > 0.2; PASS si not overfit y seed is not None.",
          "El umbral unificado de la sección es 0.2 (no 0.15). Con 0.8−0.75=0.05 no hay overfit.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Con umbral 0.2, gap 0.05 y seed 42 imprime `S33-T3-B PASS`.",
        feedback: "S33-T3-B-E1: gap controlado + seed fija son el mínimo reproducible del workbench.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e1.py",
          code: `# CASO-LIM-033 · overfit train-valid gap
# DEFECT: umbral 0.15 y PASS cuando hay overfit
# TAREA: gap_thr=0.2, not overfit, seed fija; PASS
train_acc, valid_acc, seed = 0.8, 0.75, 42
gap_thr = 0.15  # DEFECT: debe ser 0.2
gap = train_acc - valid_acc
is_overfit = gap > gap_thr
meets_contract = is_overfit and seed is not None  # DEFECT: not is_overfit
status = "PASS" if meets_contract else "REJECT_OVERFIT"
print("S33-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-b-e1.py",
          code: `train_acc, valid_acc, seed = 0.8, 0.75, 42
gap_thr = 0.2
gap = train_acc - valid_acc
is_overfit = gap > gap_thr
meets_contract = (not is_overfit) and seed is not None
status = "PASS" if meets_contract else "REJECT_OVERFIT"
print("S33-T3-B", status)
assert meets_contract is True
` ,
          output: `S33-T3-B PASS` ,
        },
      },
      {
        id: "S33-T3-B-E2",
        subtopicId: "S33-T3-B",
        kind: "independent",
        instruction: "S33-T3-B-E2 · Tres rutas: válido (gap ≤ 0.2 + seed), adverso (gap grande), sin `seed`. Salidas: `PASS`, `REJECT_OVERFIT`, `MISSING:seed`.",
        hint: "Primero missing; luego gap <= 0.2 y seed presente.",
        hints: [
          "Primero missing; luego gap <= 0.2 y seed presente.",
          "invalid de ejemplo: train 0.99, valid 0.6.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Produce `PASS REJECT_OVERFIT MISSING:seed`.",
        feedback: "S33-T3-B-E2: gap > 0.2 con seed sigue siendo overfit rechazable en este gate.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e2.py",
          code: `# CASO-LIM-033 · assess overfit (REJECT_OVERFIT)
# DEFECT: da PASS cuando el gap train−valid es grande
# TAREA: missing de seed primero; PASS solo con gap≤0.2 y seed presente
def assess(record: dict) -> str:
    required = {"case_id", 'train_acc', 'valid_acc', 'seed'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["train_acc"] - record["valid_acc"] > 0.2 else "REJECT_OVERFIT"

valid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
invalid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.99, 'valid_acc': 0.6, 'seed': 42}}
incomplete = {**valid}
incomplete.pop("seed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'train_acc', 'valid_acc', 'seed'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["train_acc"] - record["valid_acc"] <= 0.2 and record["seed"] is not None else "REJECT_OVERFIT"

valid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
invalid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.99, 'valid_acc': 0.6, 'seed': 42}}
incomplete = {**valid}
incomplete.pop("seed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_OVERFIT MISSING:seed` ,
        },
      },
      {
        id: "S33-T3-B-E3",
        subtopicId: "S33-T3-B",
        kind: "transfer",
        instruction: "S33-T3-B-E3 · Fallo cerrado: gap ok → `CONTINUE`, overfit → `REJECT_OVERFIT`, sin seed → `REQUEST_SEED`.",
        hint: "Missing → REQUEST_SEED; gap > 0.2 → REJECT_OVERFIT.",
        hints: [
          "Missing → REQUEST_SEED; gap > 0.2 → REJECT_OVERFIT.",
          "CONTINUE solo con gap <= 0.2 y seed no nula.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Produce `CONTINUE REJECT_OVERFIT REQUEST_SEED`.",
        feedback: "S33-T3-B-E3: sin seed no se audita el PR del modelo; se pide, no se inventa 42 en silencio.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e3.py",
          code: `# CASO-LIM-033 · decide overfit (REQUEST_SEED / REJECT_OVERFIT)
# DEFECT: missing→CONTINUE; pred invertido sobre gap
# TAREA: sin seed → REQUEST_SEED; gap>0.2 → REJECT; controlado → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'train_acc', 'valid_acc', 'seed'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["train_acc"] - record["valid_acc"] > 0.2 else "REJECT_OVERFIT"

valid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
invalid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.99, 'valid_acc': 0.6, 'seed': 42}}
uncertain = {**valid}
uncertain.pop("seed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'train_acc', 'valid_acc', 'seed'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SEED"
    return "CONTINUE" if record["train_acc"] - record["valid_acc"] <= 0.2 and record["seed"] is not None else "REJECT_OVERFIT"

valid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
invalid = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.99, 'valid_acc': 0.6, 'seed': 42}}
uncertain = {**valid}
uncertain.pop("seed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_OVERFIT", "REQUEST_SEED"]
` ,
          output: `CONTINUE REJECT_OVERFIT REQUEST_SEED` ,
        },
      },
      {
        id: "S33-T4-A-E1",
        subtopicId: "S33-T4-A",
        kind: "guided",
        instruction: "S33-T4-A-E1 · **Calcula** `beats_dummy` y valida el log. Con accuracy=0.5 y dummy_acc=0.667, `beats_dummy` debe ser **False**. Un run es válido si metrics no está vacío, la clave `beats_dummy` existe (True **o** False) y `run_id` no vacío. El starter exige `beats is True` (DEFECT anti-ML). Salida: `S33-T4-A PASS`.",
        hint: "beats = acc > dummy_acc; meets_contract = bool(metrics) and beats is not None and bool(run_id) — no exijas beats True.",
        hints: [
          "beats = acc > dummy_acc; el run sigue válido con beats False si metrics y run_id están.",
          "No uses `beats is True` como gate de validez del log.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Con acc 0.5, dummy 0.667, beats False, metrics y run_id presentes imprime `S33-T4-A PASS`.",
        feedback: "S33-T4-A-E1: beats_dummy False no invalida el run; metrics vacías sí. La comparación honesta se loguea.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e1.py",
          code: `# CASO-LIM-033 · tracking honesto (puede perder al dummy)
# DEFECT: exige beats_dummy True para validar el run
# TAREA: beats puede ser False; log completo → PASS
metrics = {"accuracy": 0.5, "f1": 0.4}
dummy_acc = 0.667
run_id = "run-1"
beats = metrics["accuracy"] > dummy_acc
meets_contract = bool(metrics) and beats is True and bool(run_id)  # DEFECT
status = "PASS" if meets_contract else "REJECT_UNLOGGED_RUN"
print("S33-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-a-e1.py",
          code: `metrics = {"accuracy": 0.5, "f1": 0.4}
dummy_acc = 0.667
run_id = "run-1"
beats = metrics["accuracy"] > dummy_acc  # False: 0.5 no supera 0.667
meets_contract = bool(metrics) and isinstance(beats, bool) and bool(run_id)
status = "PASS" if meets_contract else "REJECT_UNLOGGED_RUN"
print("S33-T4-A", status)
assert meets_contract is True and beats is False
` ,
          output: `S33-T4-A PASS` ,
        },
      },
      {
        id: "S33-T4-A-E2",
        subtopicId: "S33-T4-A",
        kind: "independent",
        instruction: "S33-T4-A-E2 · Tres rutas de tracking: válido (metrics no vacías + beats_dummy presente + run_id; puede ser False), adverso (metrics vacías o run_id vacío), sin campo `metrics`. Salidas: `PASS`, `REJECT_UNLOGGED_RUN`, `MISSING:metrics`.",
        hint: "No uses `beats_dummy is True` como gate de validez del log.",
        hints: [
          "No uses `beats_dummy is True` como gate de validez del log.",
          "invalid de ejemplo: metrics {} y/o run_id ''.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Produce `PASS REJECT_UNLOGGED_RUN MISSING:metrics`.",
        feedback: "S33-T4-A-E2: el adverso es un run mal logueado, no un modelo que pierde al dummy.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e2.py",
          code: `# CASO-LIM-033 · assess tracking (REJECT_UNLOGGED_RUN)
# DEFECT: da PASS con metrics vacías; no castigues beats_dummy False
# TAREA: missing de metrics primero; PASS si log completo (beats puede ser False)
def assess(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["metrics"] else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.5, 'f1': 0.4}, 'beats_dummy': False, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': ''}}
incomplete = {k: v for k, v in valid.items() if k != "metrics"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = bool(record["metrics"]) and "beats_dummy" in record and bool(record["run_id"])
    return "PASS" if ok else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.5, 'f1': 0.4}, 'beats_dummy': False, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': ''}}
incomplete = {k: v for k, v in valid.items() if k != "metrics"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNLOGGED_RUN MISSING:metrics` ,
        },
      },
      {
        id: "S33-T4-A-E3",
        subtopicId: "S33-T4-A",
        kind: "transfer",
        instruction: "S33-T4-A-E3 · Fallo cerrado: run logueado (aunque beats_dummy=False) → `CONTINUE`, run mal logueado → `REJECT_UNLOGGED_RUN`, sin metrics → `REQUEST_METRICS`.",
        hint: "Missing metrics → REQUEST_METRICS; no castigues beats_dummy False.",
        hints: [
          "Missing metrics → REQUEST_METRICS; no castigues beats_dummy False.",
          "CONTINUE si metrics no vacías, beats_dummy en el dict y run_id truthy.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Produce `CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`.",
        feedback: "S33-T4-A-E3: tracking responsable documenta derrotas ante el dummy; no las oculta.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e3.py",
          code: `# CASO-LIM-033 · decide tracking (REQUEST_METRICS / REJECT_UNLOGGED_RUN)
# DEFECT: missing→CONTINUE; pred invertido; no exijas beats True
# TAREA: sin metrics → REQUEST_METRICS; log vacío → REJECT; log completo → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["metrics"] else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.5, 'f1': 0.4}, 'beats_dummy': False, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': ''}}
uncertain = {k: v for k, v in valid.items() if k != "metrics"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_METRICS"
    ok = bool(record["metrics"]) and "beats_dummy" in record and bool(record["run_id"])
    return "CONTINUE" if ok else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.5, 'f1': 0.4}, 'beats_dummy': False, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': ''}}
uncertain = {k: v for k, v in valid.items() if k != "metrics"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNLOGGED_RUN", "REQUEST_METRICS"]
` ,
          output: `CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS` ,
        },
      },
      {
        id: "S33-T4-B-E1",
        subtopicId: "S33-T4-B",
        kind: "guided",
        instruction: "S33-T4-B-E1 · **Calcula** `n_groups` sobre entities `['e1','e1','e2','e3']`. El starter usa `len(entities)` (4) en vez de `len(set(entities))` (3). Corrige y obtén PASS. Salida: `S33-T4-B PASS`.",
        hint: "n_groups = len(set(entities)); debe ser 3.",
        hints: [
          "n_groups = len(set(entities)); debe ser 3.",
          "e1 se repite: no cuentes filas, cuenta entidades únicas.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True (leak entre folds)", "CASO-LIM-033-4B es sintético"],
        tests: "Tras corregir a set, n_groups==3 e imprime `S33-T4-B PASS`.",
        feedback: "S33-T4-B-E1: group CV se define sobre entidades, no sobre filas.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `# CASO-LIM-033 · n_groups por entidad
# DEFECT: cuenta filas (len) en vez de entidades únicas (set)
# TAREA: n_groups = len(set(entities)) == 3; PASS
entities = ["e1", "e1", "e2", "e3"]
n_groups = len(entities)  # DEFECT
meets_contract = n_groups == 3
status = "PASS" if meets_contract else "REJECT_RANDOM_LEAK"
print("S33-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `entities = ["e1", "e1", "e2", "e3"]
n_groups = len(set(entities))
meets_contract = n_groups == 3
status = "PASS" if meets_contract else "REJECT_RANDOM_LEAK"
print("S33-T4-B", status)
assert meets_contract is True
` ,
          output: `S33-T4-B PASS` ,
        },
      },
      {
        id: "S33-T4-B-E2",
        subtopicId: "S33-T4-B",
        kind: "independent",
        instruction: "S33-T4-B-E2 · Tres rutas de group CV: válido (random_split False y ≥2 entidades únicas), adverso (random_split True), sin `entities`. Salidas: `PASS`, `REJECT_RANDOM_LEAK`, `MISSING:entities`.",
        hint: "PASS si random_split is False and len(set(entities)) >= 2.",
        hints: [
          "PASS si random_split is False and len(set(entities)) >= 2.",
          "Primero missing de entities.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True (leak entre folds)", "CASO-LIM-033-4B es sintético"],
        tests: "Produce `PASS REJECT_RANDOM_LEAK MISSING:entities`.",
        feedback: "S33-T4-B-E2: random split con la misma entidad en train y valid infla métricas.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e2.py",
          code: `# CASO-LIM-033 · assess group CV (REJECT_RANDOM_LEAK)
# DEFECT: da PASS cuando random_split es True
# TAREA: missing de entities primero; PASS solo con group split y ≥2 entidades
def assess(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["random_split"] is True else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
invalid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e1'], 'random_split': True}}
incomplete = {**valid}
incomplete.pop("entities")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["random_split"] is False and len(set(record["entities"])) >= 2 else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
invalid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e1'], 'random_split': True}}
incomplete = {**valid}
incomplete.pop("entities")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_RANDOM_LEAK MISSING:entities` ,
        },
      },
      {
        id: "S33-T4-B-E3",
        subtopicId: "S33-T4-B",
        kind: "transfer",
        instruction: "S33-T4-B-E3 · Fallo cerrado: group CV ok → `CONTINUE`, random leak → `REJECT_RANDOM_LEAK`, sin entities → `REQUEST_GROUP_IDS`.",
        hint: "Missing → REQUEST_GROUP_IDS; random_split True → REJECT_RANDOM_LEAK.",
        hints: [
          "Missing → REQUEST_GROUP_IDS; random_split True → REJECT_RANDOM_LEAK.",
          "CONTINUE solo con random_split False y ≥2 entidades únicas.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True (leak entre folds)", "CASO-LIM-033-4B es sintético"],
        tests: "Produce `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS`.",
        feedback: "S33-T4-B-E3: sin group ids no hay CV confiable por entidad; se pide la lista.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e3.py",
          code: `# CASO-LIM-033 · decide group CV (REQUEST_GROUP_IDS / REJECT_RANDOM_LEAK)
# DEFECT: missing→CONTINUE; pred invertido sobre random_split
# TAREA: sin entities → REQUEST_GROUP_IDS; random leak → REJECT; ok → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["random_split"] is True else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
invalid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e1'], 'random_split': True}}
uncertain = {**valid}
uncertain.pop("entities")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_GROUP_IDS"
    return "CONTINUE" if record["random_split"] is False and len(set(record["entities"])) >= 2 else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
invalid = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e1'], 'random_split': True}}
uncertain = {**valid}
uncertain.pop("entities")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_RANDOM_LEAK", "REQUEST_GROUP_IDS"]
` ,
          output: `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS` ,
        },
      }
    ],
  },
  youDo: {
    title: "Baseline vs modelo: framing + tracking (CP-N3-B)",
    context:
      "Sobre CASO-LIM-033 (sintético): define unit/target/horizon, calcula dummy+costo, entrena un modelo lineal simple o un stump, registra un run con params/metrics/beats_dummy (True o False) y reporta n_groups con group CV por entidad. Features de entrada al estilo S32 (`shared_phone`, `amount_z`).",
    objectives: [
      "Framing sin fraud en target y con horizonte explícito",
      "Dummy y costo derivados de y vs predicciones",
      "Modelo regularizado (L2) o stump con seed fija",
      "Run log completo y group CV por entidad",
    ],
    requirements: [
      "has_baseline=True antes de promocionar modelo",
      "Sin label de fraude ni PII real",
      "es-PE sintético; seed fija en params",
      "beats_dummy calculado (puede ser False) y logueado",
    ],
    starterCode: `# baselines CP-N3-B — CASO-LIM-033 (sintético only)
# Completa el pipeline: framing → dummy+costo → modelo → run log → group CV.
import math

y = [1, 1, 0, 0]
x = [0.1, 0.4, 0.2, 0.05]  # score sintético al estilo S32 (shared_phone/amount_z → score)
entities = ["e1", "e1", "e2", "e3"]
seed = 42
c_fp, c_fn = 1, 5
dummy_acc_doc = None  # fíjalo tras calcular el dummy

def frame_task(unit, target, horizon):
    return {
        "unit": unit,
        "target": target,
        "horizon": horizon,
        "fraud_name": "fraud" in target.lower(),
    }

def dummy_acc_and_cost(labels, c_fp=1, c_fn=5):
    maj = max(set(labels), key=labels.count)
    dummy = [maj] * len(labels)
    acc = round(sum(a == b for a, b in zip(labels, dummy)) / len(labels), 3)
    cost = 0
    for yt, yp in zip(labels, dummy):
        if yp == 1 and yt == 0:
            cost += c_fp
        if yp == 0 and yt == 1:
            cost += c_fn
    return acc, cost, True

def stump_preds(X, thr):
    return [int(v >= thr) for v in X]

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

# 1) frame = frame_task("entity_pair", "needs_review_7d", 7)  # fraud_name debe ser False
# 2) dummy_acc_doc, cost, has_baseline = dummy_acc_and_cost(y, c_fp, c_fn)
# 3) Elige stump (thr) o logística (w,b,thr) + L2; fija depth_unlimited=False / seed
# 4) metrics = {"accuracy": ..., "f1": ...}; beats = metrics["accuracy"] > dummy_acc_doc
# 5) run = {"run_id": "run-1", "params": {"seed": seed}, "metrics": metrics, "beats_dummy": beats}
# 6) n_groups = len(set(entities)); mean_fold = round(sum(folds)/len(folds), 3)
if __name__ == "__main__":
    frame = frame_task("entity_pair", "needs_review_7d", 7)
    print("frame", frame)
    print("next: dummy+cost → modelo → run log → n_groups")
`,
    portfolioNote:
      "Primero baseline; el portafolio debe incluir run log (params/metrics/beats_dummy) y group CV por entidad. Un beats_dummy=False bien documentado es válido.",
    rubric: [
      { criterion: "Framing unit/target/horizon + baseline dummy/regla documentados", weight: "25%" },
      { criterion: "Correctitud técnica: dummy, modelo y métricas calculados (no hardcode)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (gap, missing, adverso)", weight: "15%" },
      { criterion: "Código legible y límites claros (depth, seed, L2)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "beats_dummy calculado + group CV + seed en params", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El target del workbench debe:",
        options: ["Ser needs_review con horizonte", "Llamarse is_fraud", "Omitir unidad", "Ignorar prevalencia"],
        correctIndex: 0,
        explanation:
          "needs_review con horizonte y unidad cierra el problema sin auto-etiqueta de fraude.",
      },
      {
        question: "Antes del modelo ML conviene:",
        options: ["Solo deep learning", "Borrar features", "Dummy/regla y costos", "Cambiar el thr a 0"],
        correctIndex: 2,
        explanation:
          "Baseline y costos demuestran si el ML agrega valor real a la cola.",
      },
      {
        question: "Comparar coeficientes exige:",
        options: ["Features sin escala", "SHAP obligatorio", "Depth ilimitada", "Features scaled y causal=False"],
        correctIndex: 3,
        explanation:
          "Sin scaling los |coef| no son comparables; el signo no es causa.",
      },
      {
        question: "Group CV por entidad evita:",
        options: ["Usar métricas", "Leakage de la misma entidad entre folds", "Registrar runs", "Fijar seed"],
        correctIndex: 1,
        explanation:
          "Si la misma entidad cae en train y valid, las métricas se inflan.",
      },
      {
        question: "Un run con beats_dummy=False y metrics completas es…",
        options: [
          "Inválido: solo se loguean victorias",
          "Válido si está bien logueado: la comparación honesta incluye derrotas",
          "Obligatorio rechazarlo con REJECT_UNLOGGED_RUN",
          "Señale de usar target fraud",
        ],
        correctIndex: 1,
        explanation:
          "Tracking responsable registra también cuando el modelo no supera al dummy; no se exige beats_dummy=True para validar el log.",
      }
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn DummyClassifier",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html",
        note: "Baseline majority/stratified",
      },
      {
        label: "sklearn LogisticRegression",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html",
        note: "L2/L1 y solvers",
      },
      {
        label: "sklearn ensemble (RF/GB)",
        url: "https://scikit-learn.org/stable/modules/ensemble.html",
        note: "Árboles y ensambles (lectura; lab usa stump+vote)",
      },
      {
        label: "sklearn cross-validation",
        url: "https://scikit-learn.org/stable/modules/cross_validation.html",
        note: "GroupKFold y splits",
      },
      {
        label: "Google Rules of ML",
        url: "https://developers.google.com/machine-learning/guides/rules-of-ml",
        note: "Baseline primero; métricas honestas",
      },
      {
        label: "ISL book (online)",
        url: "https://www.statlearning.com/",
        note: "Regularización y árboles",
      },
      {
        label: "MLflow Tracking concepts",
        url: "https://mlflow.org/docs/latest/tracking.html",
        note: "Experiment tracking mínimo",
      },
    ],
    books: [
      { label: "Introduction to Statistical Learning (ISL)", note: "Regularización y validación" },
      { label: "Hands-On ML (Géron)", note: "Pipelines y baselines" },
    ],
    courses: [
      {
        label: "Coursera — Supervised ML (Ng / DeepLearning.AI)",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        note: "Logística, reg y evaluación",
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
        label: "deeplearning.ai — ML courses",
        url: "https://www.deeplearning.ai/",
        note: "Supervised ML y métricas",
      },
    ],
  },
}
