import type { CourseSection } from '../../types'

export const section33: CourseSection = {
  id: "advanced-models",
  index: 33,
  title: "ML supervisado y baselines responsables",
  shortTitle: "Baselines ML responsables",
  tagline: "comparación honesta que conserva el baseline determinista y demuestra cuándo el ML agrega —o no agrega— valor",
  estimatedHours: 18,
  level: "Integración avanzada",
  phase: 2,
  icon: "LineChart",
  accentColor: "bg-gradient-to-br from-purple-500 to-indigo-800",
  jobRelevance:
    "En banca, fintech y ops de riesgo en LatAm (mesas de revisión de alertas en Lima o Arequipa), un workbench serio —la mesa de trabajo del analista— no reemplaza reglas claras por un modelo opaco sin un baseline (línea base determinista que todo modelo debe superar). Aquí aprendes a documentar ese baseline, los costos de FP/FN (falsos positivos y falsos negativos) y a probar si un modelo supervisado mejora la prioridad de revisión. Si no gana al dummy, se loguea igual y no se promueve complejidad inútil; la predicción de cola nunca es etiqueta de fraude.",
  learningOutcomes: [
    { text: "Definir unidad de scoring, target observable y horizonte temporal" },
    { text: "Fijar baseline de regla y dummy majority con costo FP/FN" },
    { text: "Calcular sigmoid, predicción umbralada y documentar L2 (penalty + l2_sq diagnóstico)" },
    { text: "Interpretar coeficientes escalados sin claim causal" },
    { text: "Aplicar stumps controlados y voto mayoritario frente al dummy y a la regla" },
    { text: "Detectar overfit por gap train−valid (diagnóstico de lab) y fijar seed reproducible" },
    { text: "Registrar runs mínimos (params, metrics, beats_dummy/beats_rule) aunque pierdan al baseline" },
    { text: "Aplicar group CV por entidad con disyunción train/valid y leer n_groups / mean de folds" }
  ],
  theory: [
    {
            heading: "Antes de preguntar si el modelo es bueno, pregunta contra qué",
      paragraphs: [
        "Hay equipos que pasaron meses construyendo un modelo que nunca superó a «responder siempre lo más frecuente». No es una anécdota rara: pasa cada vez que se mide el acierto sin compararlo con nada. Con 90% de casos negativos, un sistema que dice «no» a todo acierta el 90% y no sirve para nada.",
        "Por eso lo primero que se construye no es el modelo sino su rival. Un **baseline** es la respuesta más tonta que sea razonable: siempre la clase mayoritaria, o una regla de una línea del tipo «si el monto supera este umbral, revisar». Es deliberadamente pobre, y esa es su virtud — si lo sofisticado no le gana, lo sofisticado no se ha ganado su costo de mantenimiento.",
        "Antes hace falta cerrar qué se predice, y con qué honestidad se nombra. El **target** de esta sección es `needs_review_7d`: si un caso debería entrar a la cola de revisión humana en los próximos siete días. No es una etiqueta de fraude, y la diferencia no es de vocabulario — un modelo que prioriza una cola y un modelo que acusa a alguien son productos distintos con responsabilidades distintas.",
        "Ese `7d` es el **horizonte**, y no se puede inventar. Sin un horizonte explícito, «va a necesitar revisión» no tiene significado comprobable: ¿mañana? ¿alguna vez? Cuando falta, el flujo pide el dato en lugar de asumir un valor por defecto.",
        "La pregunta que atraviesa la sección es incómoda a propósito: **¿esto es mejor que lo más tonto que se me ocurre, y cuánto mejor?** Se trabaja con Python estándar —una sigmoide, un stump, una semilla fija— antes de tocar librerías pesadas, porque el objetivo es entender la comparación y no invocar una API.",
      ],
      callout: {
        type: "info",
        title: "Gate baseline (qué hacer ya)",
        content:
          "Sin baseline documentado no se promociona modelo. Target needs_review_* con horizonte explícito (no fraud). Datos sintéticos únicamente. Un run con beats_dummy=False se loguea igual. Anota prevalencia antes del fit.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas y criterios de promoción.",
        "**Orden de los subtemas.** T1 fija el encuadre y el baseline. T2 pasa a modelos lineales regularizados. T3 introduce stumps y el control del sobreajuste. T4 cierra con el registro de experimentos y la validación cruzada por grupo.",
        "**Criterios de promoción.** Sin baseline documentado no se promociona un modelo. El target debe ser del tipo `needs_review_*` con horizonte explícito, nunca `fraud`. Un run que no le gana al baseline se registra igual — ocultarlo es lo que convierte un experimento en propaganda. La prevalencia se anota antes de ajustar nada.",
        "**Referencia.** Las *Rules of ML* de Google resumen el mismo criterio: lanza primero con una heurística o un baseline, mide el valor, y solo después sube la complejidad.",
      ],
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
        "Necesitas `y`, las predicciones (dummy o regla) y los costos unitarios. De ahí salen accuracy del dummy, accuracy de la regla, costo total y `has_baseline`. El error grave es **entrenar sin baseline documentado**. Calcula `beats_dummy` **después** de fijar dummy, regla y costo; si el modelo pierde, el run **sigue siendo válido** — solo no se promociona.",
        "En `CASO-LIM-033`: con `y=[1,1,0]` el dummy predice 1 y acierta 2/3 (acc≈0.667); su costo se deriva de y vs. predicciones (1 FP con c_fp=1 → costo 1). La regla `x >= 1` sobre `x=[1,1,0]` produce pred `[1,1,0]` y accuracy **1.0**: a veces la heurística ya gana al dummy. Documenta **ambos** anclajes en el log **antes** del modelo lineal o del stump. Empate de clases: con conteos iguales usa la clase **menor** (política fija del lab; no inventes otra en silencio)."
      ],
      code: {
        language: 'python',
        title: "baseline.py",
        code: `def dummy_and_cost(y, c_fp=1, c_fn=5):
    # empate: max con key=count, y si hay empate de conteo, max elige el menor valor de clase
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

def rule_acc(y, x, thr=1.0):
    pred = rule_preds(x, thr)
    return round(sum(a == b for a, b in zip(y, pred)) / len(y), 3), pred

y, x = [1, 1, 0], [1.0, 1.0, 0.0]
acc, cost, has_baseline = dummy_and_cost(y)
r_acc, r_pred = rule_acc(y, x, 1.0)
print("dummy_acc", acc)
print("cost", cost)
print("has_baseline", has_baseline)
print("rule", r_pred)
print("rule_acc", r_acc)`,
        output: `dummy_acc 0.667
cost 1
has_baseline True
rule [1, 1, 0]
rule_acc 1.0`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Calcula majority con max(set(y), key=y.count), deriva el costo de y vs. pred, y la accuracy de la regla x>=thr. Sin baseline → REJECT_NO_BASELINE; sin costo → REQUEST_COST.",
      },
    },
    {
      heading: "Regresión logística y regularización L2",
      subtopicId: "S33-T2-A",
      paragraphs: [
        "La **regresión logística** modela P(y=1|x) con la **sigmoid** σ(z)=1/(1+e^{-z}), donde z = w·x + b. Es el primer modelo **interpretable** del workbench: cada feature de S32 aporta un peso legible, no una caja negra. La regularización **L2** es una **configuración de entrenamiento** (`penalty=\"l2\"` y una fuerza C o λ): al optimizar, el objetivo penaliza coeficientes grandes. Eso **no** se demuestra midiendo solo Σw² de un vector ya ajustado.",
        "Si el número de features es grande frente al de ejemplos, un modelo sin penalización en el *fit* memoriza ruido. En el log del experimento declara `penalty` y la fuerza; reporta también `l2_sq=Σw²` solo como **diagnóstico de magnitud**. Un vector con pesos no nulos puede provenir de un *fit* sin regularizar: por eso el gate del lab exige la **declaración** `penalty=\"l2\"`, no un umbral mágico sobre Σw². El **umbral** thr convierte probabilidad en **prioridad de cola** (revisar sí/no), nunca en veredicto de fraude. Compara accuracy y **costo** contra el dummy **y** la regla de T1-B antes de celebrar el modelo.",
        "En `CASO-LIM-033`: σ(0)=0.5 y σ(0.2)≈0.55. Con w=1, b=0, x=0.2 y thr=0.6 la pred es **0** (0.55 no alcanza el umbral). Si thr fuera 0.5, la misma p daría pred 1: el umbral es una decisión de producto, no magia del modelo. `l2_sq` de w=[1,2] como Σw² es 5 (diagnóstico; no confundir con √Σw² ni con “prueba de L2”). Si `penalty` no es `\"l2\"`, el gate marca `REJECT_UNREGULARIZED`."
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
    # diagnóstico de magnitud: Σ w_i² (no prueba de que el fit usó L2)
    return sum(v * v for v in ws)

# evidencia de regularización: configuración documentada en params
params = {"penalty": "l2", "C": 1.0}
print(round(sigmoid(0), 3), round(sigmoid(2), 3))
# p≈0.55; thr=0.6 → no prioriza; thr=0.5 habría predicho 1
print("pred", pred_at(1.0, 0.0, 0.2, thr=0.6))
print("l2_sq", l2_sq([1, 2]))
print("penalty", params["penalty"], "C", params["C"])`,
        output: `0.5 0.881
pred 0
l2_sq 5
penalty l2 C 1.0`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Implementa sigmoid, pred_at(w, b, x, thr) y l2_sq = sum(v*v) como diagnóstico. Declara penalty=\"l2\" y C en params. Sin penalty l2 → REJECT_UNREGULARIZED. Sin p en [0,1] → REQUEST_SIGMOID.",
      },
    },
    {
      heading: "Coeficientes, supuestos y scaling",
      subtopicId: "S33-T2-B",
      paragraphs: [
        "Comparar magnitudes `|coef|` solo tiene sentido si las features están **escaladas** (z-score de S32: p. ej. `amount_z`). El **signo** indica dirección de asociación *en el modelo*, **no** causalidad social ni fraude probado: un `shared_phone` alto no “prueba” colusión entre entidades.",
        "Trabajas con un diccionario de coeficientes y un `scale_flag`. Ordenas por `|w|` y reportas el signo del top. Si las features **no** están escaladas, no compares magnitudes como si fueran importancia relativa. Antes de rankear para el informe: `scale_flag=True` y `causal=False`.",
        "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage (sin target futuro ni ID crudos en el feature set). Si en S32 exportaste una tabla con esas columnas z-score, aquí solo las **rankeas por |coef|** cuando `scaled=True`. En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba; se imprime el ranking con `causal=False` para no sobre-interpretar el score de cola como parentesco o fraude. El ranking por |coef| es un atajo de lab: no sustituye estabilidad entre folds ni un diagnóstico de colinealidad."
      ],
      code: {
        language: 'python',
        title: "coefs.py",
        code: `def rank_coefs(coefs):
    ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
    top = ranked[0]
    sign = "pos" if coefs[top] > 0 else "neg"
    return ranked, sign

# features S32 escaladas (sin leakage): shared_phone, amount_z
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
      heading: "De la regresión logística a una red neuronal diminuta",
      subtopicId: "S33-T2-B",
      optional: true,
      paragraphs: [
        "Esta sección es **opcional**: nada de lo que viene después la necesita. Está aquí porque la regresión logística que acabas de ajustar ya contiene, en miniatura, todo lo que hace una red neuronal, y verlo una vez desmitifica la palabra para siempre.",
        "Repasa lo que hace la logística: multiplica cada feature por un peso, suma un sesgo y pasa el resultado por una sigmoide para obtener algo que se lee como probabilidad. Una red neuronal repite ese mismo gesto **por capas**. Los valores intermedios se llaman **activaciones**: representaciones que el modelo calcula por su cuenta, en vez de columnas que tú nombraste en el catálogo de features. Lo importante no es la palabra “neuronal”. Lo importante es que definiste cuatro cosas: parámetros, un cálculo hacia adelante, una **pérdida** que mide qué tan mal va, y un procedimiento para mover los parámetros de modo que esa pérdida baje.",
        "Ese procedimiento se apoya en el **gradiente**: cuánto cambiaría la pérdida si movieras un peso un poquito. Si subir el peso empeora la pérdida, el gradiente apunta en una dirección; el paso de entrenamiento va en la contraria. **Backpropagation** no es más que aplicar la regla de la cadena hacia atrás por las capas para obtener todos esos gradientes de una sola pasada. Los frameworks lo hacen por ti con **diferenciación automática**, y esa comodidad recién es útil cuando ya tienes el ciclo en la cabeza: adelante calcula, la pérdida juzga, el gradiente indica hacia dónde, el paso corrige.",
        "La pieza que convierte capas apiladas en algo más expresivo que una logística es la **función de activación** — aquí `tanh`. Sin ella, componer dos capas lineales da otra transformación lineal, y apilar no compra nada. El caso de abajo lo mide en vez de afirmarlo: sobre XOR —cuatro puntos que ninguna recta separa— la red con `tanh` acierta **4 de 4** con pérdida 0.001; la misma red sin activación acierta **2 de 4** y se queda en una pérdida de **0.6931**, que es exactamente ln 2: el número al que llega un modelo que no aprendió nada y predice la misma probabilidad para todo.",
        "Dos límites honestos antes de cerrar. Primero, esta red tiene cuatro ejemplos y ninguna validación: es una demostración de mecánica, no un resultado. Con datos reales seguirías necesitando todo lo de esta sección —baseline, folds sin leakage, análisis de errores— y una red pequeña casi nunca gana a una logística bien hecha sobre datos tabulares. Segundo, nada de esto se instala en el curso: es NumPy, el mismo que ya usas. Si algún día pasas a PyTorch, lo que llevas contigo es este ciclo; lo que cambia es quién calcula los gradientes.",
      ],
      code: {
        language: 'python',
        title: "red_diminuta.py",
        code: `def s33_th_red_neuronal():
    import numpy as np

    rng = np.random.default_rng(33)
    # XOR: ninguna recta separa estos cuatro puntos
    X = np.array([[0., 0.], [0., 1.], [1., 0.], [1., 1.]])
    y = np.array([[0.], [1.], [1.], [0.]])

    def entrena(con_activacion, pasos=4000, lr=0.5):
        W1 = rng.normal(0, 1, (2, 4)); b1 = np.zeros((1, 4))
        W2 = rng.normal(0, 1, (4, 1)); b2 = np.zeros((1, 1))
        for _ in range(pasos):
            z1 = X @ W1 + b1
            a1 = np.tanh(z1) if con_activacion else z1     # la no linealidad
            z2 = a1 @ W2 + b2
            p = 1 / (1 + np.exp(-z2))                      # sigmoide -> probabilidad
            perdida = -np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))
            dz2 = (p - y) / len(X)                         # gradientes (regla de la cadena)
            dW2 = a1.T @ dz2; db2 = dz2.sum(0, keepdims=True)
            da1 = dz2 @ W2.T
            dz1 = da1 * (1 - a1 ** 2) if con_activacion else da1
            dW1 = X.T @ dz1; db1 = dz1.sum(0, keepdims=True)
            W1 -= lr * dW1; b1 -= lr * db1                  # un paso cuesta abajo
            W2 -= lr * dW2; b2 -= lr * db2
        return float(perdida), (p > 0.5).astype(int).ravel()

    perd_con, pred_con = entrena(True)
    perd_sin, pred_sin = entrena(False)
    objetivo = y.ravel().astype(int)
    print("objetivo      ", objetivo.tolist())
    print("con_tanh pred ", pred_con.tolist(), "perdida", round(perd_con, 4))
    print("sin_tanh pred ", pred_sin.tolist(), "perdida", round(perd_sin, 4))
    print("aciertos_con  ", int((pred_con == objetivo).sum()), "de 4")
    print("aciertos_sin  ", int((pred_sin == objetivo).sum()), "de 4")

s33_th_red_neuronal()`,
        output: `objetivo       [0, 1, 1, 0]
con_tanh pred  [0, 1, 1, 0] perdida 0.001
sin_tanh pred  [0, 0, 0, 0] perdida 0.6931
aciertos_con   4 de 4
aciertos_sin   2 de 4`,
      },
      callout: {
        type: "info",
        title: "Qué llevarte de aquí",
        content:
          "Parámetros, cálculo hacia adelante, pérdida, gradiente, paso. Sin activación, apilar capas no compra nada. Y en datos tabulares, una logística bien validada sigue siendo un rival duro.",
      },
    },
    {
      heading: "Stumps, voto y ensambles controlados",
      subtopicId: "S33-T3-A",
      paragraphs: [
        "Un **stump** es un árbol de profundidad 1: una sola pregunta del tipo `x >= thr`. Varios stumps con **voto mayoritario** ilustran la idea de ensamble sin API pesadas — es un **voto**, no un *Random Forest* completo. **Random Forest** (*bagging* de árboles con muestreo) y **boosting** (que reasigna pesos a los residuos o errores en rondas sucesivas) son *familias* distintas y más ricas; aquí solo practicamos stump + vote y el control de profundidad — suficiente para el workbench y para no inventar API no enseñadas. Profundidad **ilimitada** sobreajusta el dataset sintético y miente frente al dummy.",
        "Recibes una lista `X`, el umbral del stump y una lista de votos de predictores débiles. Sales con las predicciones del stump y el majority vote. `depth_unlimited=True` sin validación es breach de control. Antes de declarar victoria del ensamble, compara su accuracy **contra el dummy** de T1-B (y, si aplica, contra la regla).",
        "En `CASO-LIM-033`: thr=0.3 sobre `[0.1, 0.4]` produce `[0, 1]`; el voto de tres predictores débiles `[1,0,1]` da majority 1. Documenta `depth_unlimited=False` en el log del experimento. Si más adelante lees RF/GB en sklearn, verás la misma idea de “muchos débiles bien controlados” — con bagging o boosting, no con un solo árbol profundo."
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
        "Un gap **train − valid** grande señala overfit: el modelo memorizó train y no generaliza. El valor **0.2** es un **diagnóstico de lab** (umbral de práctica del workbench), no una ley universal de ML: en producción el umbral se calibra con validación y costo. Elegir profundidad **solo mirando train** es el error clásico. Fijar **seed** hace comparable la corrida entre los PR del workbench; sin seed, no hay auditoría de regresiones entre versiones del modelo.",
        "Con `train_acc`, `valid_acc` y seed decides si hay overfit y generas una secuencia reproducible. La **mejor profundidad** se elige por **valid** (o por costo en valid), nunca solo por train. Si gap > 0.2 con seed presente, reportas el overfit y, según política del lab, controlas depth o rechazas el run.",
        "En `CASO-LIM-033`: `overfit(0.95, 0.70)` es True con gap de lab=0.2; `seeded_ints(42)` produce tres enteros fijos `[1, 0, 4]`. Reporta seed en params del run junto a depth y gap observado."
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
          "Umbral de gap de lab: 0.2 (diagnóstico, no ley universal). Fija seed en params. Si el gap es grande → REJECT_OVERFIT; si falta seed → REQUEST_SEED.",
      },
    },
    {
      heading: "Pipeline y tracking mínimo",
      subtopicId: "S33-T4-A",
      paragraphs: [
        "Un **run mínimo** registra `run_id`, `params`, `metrics` y las banderas `beats_dummy` (y, cuando aplica, `beats_rule` o un costo de cola). Sin log, “mejoré el modelo” es anécdota. **Importante:** un run que **no** supera al dummy —ni a la regla— sigue siendo válido si está bien logueado: la comparación honesta es el producto, no un score de vanidad. En ops de riesgo, un experimento que **pierde** al mejor baseline y se documenta evita lanzar complejidad inútil a producción.",
        "Necesitas un dict de metrics, el `dummy_acc` (y `rule_acc` si la tienes) documentados y un `run_id`. Ordenas las keys y **calculas** `beats_dummy` (True o False). Fallan los runs **sin metrics** o sin `run_id` — **no** los que pierden al dummy. No exijas `beats_dummy is True` para aceptar el log. Accuracy sola no basta para promocionar: el lab también registra costo cuando c_fp/c_fn son asimétricos.",
        "En `CASO-LIM-033`: keys `accuracy,f1` sorted. Con accuracy=0.7 y dummy_acc=0.667 → beats_dummy=True. Con accuracy=0.5 → beats_dummy=False y el run **igual se registra** con esa verdad: la derrota es evidencia, no basura. Si la regla ya tiene accuracy 1.0, un modelo que solo “gana al dummy” aún no demuestra valor incremental.",
        "**PyTorch y el ecosistema de deep learning.** En 2016, el laboratorio de investigación en inteligencia artificial de Meta (entonces Facebook) publicó PyTorch, un framework de deep learning que adoptó un enfoque diametralmente opuesto al de TensorFlow: en lugar de definir un grafo estático y luego ejecutarlo, PyTorch construye el grafo dinámicamente a medida que el código Python se ejecuta. Esta diferencia filosófica — *eager execution* frente a *graph execution* — hizo que la comunidad investigadora adoptara PyTorch masivamente: para 2023, más del 80% de los artículos en NeurIPS usaban PyTorch.",
        "PyTorch y TensorFlow (esto es, los dos frameworks dominantes para deep learning) comparten los mismos conceptos fundamentales: tensores (esto es, arrays multidimensionales con aceleración GPU), autograd (esto es, diferenciación automática para calcular gradientes), y módulos (esto es, bloques reutilizables de red neuronal). La sintaxis difiere: en PyTorch escribes `torch.nn.Linear(in, out)` mientras que en TensorFlow escribes `tf.keras.layers.Dense(out, input_shape=(in,))`. En PyTorch, el bucle de entrenamiento es explícito (`loss.backward(); optimizer.step()`), lo que da control total; en TensorFlow Keras, `model.fit()` abstrae el bucle, lo que simplifica pero oculta detalles.",
        "En el mercado laboral de 2026, ambos frameworks son solicitados. Las ofertas de trabajo en Estados Unidos tienden a mencionar TensorFlow en roles de producción (por su despliegue en servidores con TensorFlow Serving), mientras que las ofertas en China — especialmente en ByteDance, DeepSeek y Baidu — prefieren PyTorch por su flexibilidad en investigación. Conocer ambos es ideal, pero dominar uno y entender las diferencias del otro es el mínimo para un ingeniero ML.",
        "La retrospectiva: PyTorch te enseña que la transparencia — ver exactamente qué hace cada línea de tu código de entrenamiento — no es un lujo académico sino una necesidad operacional. Cuando un modelo falla en producción, la capacidad de inspeccionar el grafo dinámico paso a paso es lo que separa una depuración de horas de una de días.",
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
        "**Group CV por entidad** evita leakage entre folds: la misma entidad no debe aparecer en train y en valid del mismo split. Contar entidades únicas (`n_groups`) es **perfilado** del dataset; la prueba de group CV es la **disjunción** train∩valid = ∅ por entidad. Un random split clásico infla métricas cuando hay múltiples filas por entidad (pares, cuentas, dispositivos) — el modelo “recuerda” al par en valid porque ya lo vio en train.",
        "Recibes scores por fold, entity ids y, en el lab, conjuntos train/valid por fold. Devuelves la media de folds, `n_groups = len(set(entities))` y `groups_disjoint`. `random_split=True` (o entidades compartidas entre train y valid) es el error típico. El protocolo del workbench pide al menos dos grupos y disyunción verificada.",
        "En `CASO-LIM-033`: mean de `[0.6, 0.7, 0.65]` con `round(..., 3)` es **0.65**; con entities `e1,e1,e2,e3` hay **3** grupos. Train `{e1}` y valid `{e2,e3}` son disjuntos; si `e1` aparece en ambos, hay leak. El **análisis de errores** mira el *slice* con más FN (p. ej. un tipo de par sintético), no solo la media global — umbrales y desbalance se profundizan en S34."
      ],
      code: {
        language: 'python',
        title: "group_cv.py",
        code: `def mean_fold(folds):
    return round(sum(folds) / len(folds), 3)

def n_groups(entities):
    return len(set(entities))

def groups_disjoint(train_ents, valid_ents):
    return set(train_ents).isdisjoint(set(valid_ents))

entities = ["e1", "e1", "e2", "e3"]
train_fold0, valid_fold0 = ["e1"], ["e2", "e3"]
print("mean", mean_fold([0.6, 0.7, 0.65]))
print("n_groups", n_groups(entities))
print("disjoint", groups_disjoint(train_fold0, valid_fold0))
print("random_leak_ok", False)`,
        output: `mean 0.65
n_groups 3
disjoint True
random_leak_ok False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "n_groups = len(set(entities)); mean_fold con round(..., 3); verifica train∩valid vacío por entidad. Si hay random_split o intersección → REJECT_RANDOM_LEAK. Sin entities → REQUEST_GROUP_IDS.",
      },
    },
    {
      heading: "Cuando la dependencia es el tiempo: origen móvil y baseline estacional",
      subtopicId: "S33-T4-B",
      paragraphs: [
        "El group CV que acabas de hacer resuelve **una** dependencia: filas que comparten entidad. Hay otra que rompe evaluaciones con la misma facilidad y no se arregla igual — el **tiempo**. No existe un esquema de validación universalmente correcto; lo elige la dependencia que tienes. Si filas de la misma entidad se filtran entre folds, preservas el grupo. Si observaciones posteriores no deben informar predicciones anteriores, preservas el orden temporal. Algunos sistemas necesitan las dos cosas a la vez.",
        "Cuando el problema es temporal, cierra primero el contrato que ya conoces de T1-A: **origen** (el instante desde el que predices) y **horizonte** (cuán lejos está el objetivo). En producción el lunes por la mañana los casos del viernes todavía no existen, y esa puerta solo abre en un sentido. Un split aleatorio la viola en silencio: marzo entra a train, febrero a valid, Python no se queja y el score hasta se ve bien. El experimento simplemente ensayó un problema que el sistema real nunca tendrá permiso de resolver. La disciplina de ventanas half-open que viste en S32 protege cada *feature*; esto protege el *split*.",
        "La forma práctica es la **validación de origen móvil**: mueve el origen hacia adelante y evalúa cada período nuevo usando solo datos anteriores. Con **ventana expansiva** el train crece y conserva toda la historia; con **ventana deslizante** mantienes solo el pasado reciente, útil cuando lo viejo ya no se parece al proceso actual. Ambas preservan el mismo invariante, y conviene verificarlo con una aserción en vez de confiar: `max(indice_train) < min(indice_valid)` en cada fold.",
        "Falta el rival. Un **baseline estacional ingenuo** —“este martes se parece al martes pasado”— cuesta una línea y obliga al candidato a ganarse su complejidad. La corrida de abajo lo mide con **MAE** (*mean absolute error*), el error absoluto promedio, que se lee en las unidades del problema: un MAE de 1.10 significa equivocarse en algo más de un caso por día. Sobre la misma serie, el baseline estacional promedia **1.10** y el ingenuo de “ayer” **3.86** — más del triple. Elegir mal el baseline no solo te da un rival débil: te hace creer que tu modelo aportó algo cuando solo capturó el día de la semana. Y si el candidato pierde, eso se registra; no se arregla barajando fechas ni retocando el último fold hasta que la historia quede bonita.",
      ],
      code: {
        language: 'python',
        title: "origen_movil.py",
        code: `def s33_th_origen_movil():
    from statistics import mean

    # 28 dias sinteticos de carga de revision: patron semanal claro
    serie = [40, 42, 45, 47, 50, 44, 38, 41, 43, 46, 48, 52, 45, 39,
             42, 44, 47, 50, 53, 46, 40, 43, 45, 48, 51, 54, 47, 41]
    H = 7  # horizonte: predecimos los 7 dias siguientes al origen

    def folds(n, inicio=7, ventana=None):
        """El origen avanza. ventana=None -> expansiva; entero -> deslizante."""
        salida, origen = [], inicio
        while origen + H <= n:
            ini = 0 if ventana is None else max(0, origen - ventana)
            salida.append((ini, origen, origen + H))
            origen += H
        return salida

    def frontera_respetada(f):
        # el ultimo indice de train debe ser anterior al primer indice de valid
        return all(max(range(ini, org)) < min(range(org, fin)) for ini, org, fin in f)

    def mae(pred, ini, org, fin):
        return mean(abs(serie[i] - pred(i)) for i in range(org, fin))

    exp = folds(len(serie))
    des = folds(len(serie), ventana=14)
    print("folds_expansivos ", exp)
    print("folds_deslizantes", des)
    print("frontera_respetada", frontera_respetada(exp), frontera_respetada(des))
    est = [mae(lambda i: serie[i - 7], *f) for f in exp]   # naive estacional
    ayer = [mae(lambda i: serie[i - 1], *f) for f in exp]  # naive "ayer"
    print("mae_estacional_por_fold", [round(m, 2) for m in est])
    print("mae_ayer_por_fold      ", [round(m, 2) for m in ayer])
    print("mae_estacional_prom", round(mean(est), 2), "| mae_ayer_prom", round(mean(ayer), 2))

s33_th_origen_movil()`,
        output: `folds_expansivos  [(0, 7, 14), (0, 14, 21), (0, 21, 28)]
folds_deslizantes [(0, 7, 14), (0, 14, 21), (7, 21, 28)]
frontera_respetada True True
mae_estacional_por_fold [1.14, 1.14, 1]
mae_ayer_por_fold       [3.86, 3.86, 3.86]
mae_estacional_prom 1.1 | mae_ayer_prom 3.86`,
      },
      callout: {
        type: "warning",
        title: "La dependencia elige el split",
        content:
          "Entidades compartidas → group CV. Orden temporal → origen móvil con `max(train) < min(valid)` verificado. Baseline y candidato se comparan sobre los mismos folds, y el último período no se retoca.",
      },
    }
  ],
  iDo: {
    intro: "Te muestro el camino completo sobre fixtures sintéticos de Red Andina: (1) framing honesto y baseline con costo; (2) logística con L2 declarada y coeficientes escalados; (3) stump con voto y control de overfit; (4) tracking aunque pierdas al dummy o a la regla; y (5) group CV con disyunción de entidades.",
    steps: [
      {
        demoId: "S33-T1-A-DEMO",
        subtopicId: "S33-T1-A",
        environment: "local-python",
        description: "Cierra unit, target needs_review_7d y horizon 7; rechaza nombre fraud y reporta prevalencia.",
        preamble:
          "Antes de entrenar en el workbench de Red Andina (CP-N3-B), el analista cierra el **problema de scoring**: unidad, target de cola y horizonte. En esta demo el fixture sintético CASO-LIM-033 usa `entity_pair`, `needs_review_7d` y 7 días. No escribas aún: predice si `fraud_name` es False, qué prevalencia sale de `y=[0,1,0,0]` y por qué un target llamado `is_fraud` rompería el producto. Observa la salida: unit, target, horizon, fraud_name y prevalence.",
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
        why: "El ML solo prioriza la cola de revisión humana; un nombre con `fraud` es breach de producto, no de schema. La prevalencia se anota **antes** del fit para no engañarse con el dummy majority. Sin horizonte explícito no se inventa 7 en silencio: se pide evidencia. El framing cierra unit/target/horizon y obliga a mirar el desbalance antes de modelar. En We Do corregirás prevalencia y el check invertido de fraud.",
        retrospective:
          "Si puedes explicar por qué `needs_review_7d` no es un veredicto de delito sin mirar el código, ya tienes el hábito de framing honesto. El error clásico es modelar «fraude» porque el negocio lo pide en la conversación. En We Do practicarás prevalencia correcta y rechazo de nombres prohibidos.",
      },
      {
        demoId: "S33-T1-B-DEMO",
        subtopicId: "S33-T1-B",
        environment: "local-python",
        description: "Dummy majority + regla simple: accuracy y costo derivados; dual baseline antes del ML.",
        preamble:
          "En mesas de revisión de alertas (p. ej. Lima), un workbench serio documenta **dummy majority** y una **regla simple** antes del modelo. En esta demo, con `y=[1,1,0]` y `x=[1,1,0]`, el dummy acierta 2/3 (costo 1 por un FP) y la regla `x>=1` acierta 1.0. No escribas: predice dummy_acc, cost y rule_acc; observa que a veces la heurística **ya gana** al dummy — y eso se celebra documentándolo, no ocultándolo.",
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

def rule_acc(y, x, thr=1.0):
    pred = [int(v >= thr) for v in x]
    return round(sum(a == b for a, b in zip(y, pred)) / len(y), 3), pred

y, x = [1, 1, 0], [1.0, 1.0, 0.0]
acc, cost = dummy_acc_and_cost(y)
r_acc, r_pred = rule_acc(y, x, 1.0)
has_baseline = True  # documentado tras dummy + regla
print("dummy_acc", acc)
print("cost", cost)
print("has_baseline", has_baseline)
print("rule", r_pred)
print("rule_acc", r_acc)`,
          output: `dummy_acc 0.667
cost 1
has_baseline True
rule [1, 1, 0]
rule_acc 1.0`,
        },
        why: "Dual baseline (dummy + regla) y costo FP/FN anclan el valor mínimo del workbench. El costo traduce errores a impacto de cola, no a moral de fraude: un FN caro es un caso que debió revisarse y no se priorizó. Sin `has_baseline` no se promociona modelo. Comparar solo accuracy sin costo engaña cuando FN es asimétrico. En We Do: majority con max, costo derivado y regla x>=thr.",
        retrospective:
          "Dummy y regla se calculan de y vs. pred, no se inventan. El error clásico es entrenar sin baseline «porque el modelo se ve bien» o documentar solo el dummy y olvidar que la regla ya es perfecta. Pregunta: si la regla acierta 1.0, ¿qué valor incremental debe demostrar el ML para promocionarse? We Do: dual ancla con max (no min) y cost real.",
      },
      {
        demoId: "S33-T2-A-DEMO",
        subtopicId: "S33-T2-A",
        environment: "local-python",
        description: "sigmoid(0), predicción con thr=0.6 (p≈0.55 → 0), l2_sq diagnóstico y penalty=\"l2\" documentada.",
        preamble:
          "La logística es el primer modelo interpretable del workbench: σ(z) da probabilidad y el **umbral** convierte eso en prioridad de cola. En esta demo, p≈0.55 con thr=0.6 **no** prioriza (pred 0); si thr fuera 0.5, la misma p daría 1. Observa también `l2_sq=5` (solo magnitud) y `penalty l2` en params: la **declaración** de regularización, no el Σw², es la evidencia del gate.",
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

params = {"penalty": "l2", "C": 1.0}
print(round(sigmoid(0), 3), round(sigmoid(2), 3))
# p≈0.55 < 0.6 → no entra a cola de revisión
print("pred", pred_at(0.2, thr=0.6))
print("l2_sq", l2_sq([1, 2]))
print("penalty", params["penalty"])`,
          output: `0.5 0.881
pred 0
l2_sq 5
penalty l2`,
        },
        why: "La sigmoid acota p en (0,1). El thr es decisión de producto (cuánta cola aguantas), no magia del modelo. `l2_sq=Σw²` es solo diagnóstico de magnitud: no prueba que el fit usó L2. Sin `penalty=\"l2\"` el gate marca REJECT_UNREGULARIZED. Umbral ≠ veredicto de fraude. En We Do: thr 0.6, Σw² y penalty documentada.",
        retrospective:
          "Umbral ≠ veredicto de fraude; L2 se **declara** en params, no se «prueba» con Σw²>0. El error clásico es creer que un vector no nulo ya está regularizado. Pregunta: si thr bajara a 0.5 con la misma p≈0.55, ¿qué cambia en la cola y por qué no es magia del modelo? We Do: arreglar L1 vs. L2 y thr del lab.",
      },
      {
        demoId: "S33-T2-B-DEMO",
        subtopicId: "S33-T2-B",
        environment: "local-python",
        description: "Ranking de |coef| con features S32 scaled y signo sin claim causal.",
        preamble:
          "Las features de S32 (`shared_phone`, `amount_z`) ya vienen escaladas y sin leakage. En esta demo rankeas por |coef| y reportas `causal False` y `scaled True`. No escribas: predice el orden (shared_phone primero) y por qué un signo positivo **no** prueba parentesco ni fraude. Si las features no estuvieran en z-score, comparar |w| sería engañoso.",
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
        why: "Solo con `scaled=True` las magnitudes |coef| son comparables entre features. El signo es asociación en el modelo, no causa social ni fraude probado. El ranking por |coef| es un atajo de lab: no sustituye estabilidad entre folds ni colinealidad. En We Do: reverse=True y causal False en el contrato del informe.",
        retrospective:
          "Ranking honesto = features escaladas + sin claim causal. El error clásico es leer «shared_phone alto ⇒ colusión» o comparar |w| de columnas crudas. Pregunta: si `amount` viniera en soles sin z-score, ¿por qué el ranking mentiría aunque el signo sea el mismo? We Do: orden descendente y flags de interpretación.",
      },
      {
        demoId: "S33-T3-A-DEMO",
        subtopicId: "S33-T3-A",
        environment: "local-python",
        description: "Stump thr=0.3 y majority vote de tres predictores débiles.",
        preamble:
          "Un **stump** es un árbol de profundidad 1: una sola pregunta `x >= thr`. Varios predictores débiles con **voto mayoritario** ilustran el ensamble sin API pesadas — no es un Random Forest completo. En esta demo, thr=0.3 sobre [0.1, 0.4] da [0, 1] y el voto [1,0,1] da 1. Observa `depth_unlimited False`: profundidad libre sobreajusta el sintético y miente frente al dummy.",
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
        why: "Stump + vote es la idea de «muchos débiles controlados»; bagging y boosting son familias más ricas (lectura posterior). Sin control de depth el lab rechaza el run. Antes de declarar victoria del ensamble, compara su accuracy al dummy y a la regla de T1-B. En We Do: thr correcto y majority con umbral de mayoría.",
        retrospective:
          "Control de profundidad es parte del producto, no un detalle de sklearn. El error clásico es un árbol profundo que memoriza el fixture y «vence» al dummy en train. Pregunta: ¿por qué un voto mayoritario con depth libre sigue siendo rechazable aunque majority sea 1? We Do: thr invertido y majority rota.",
      },
      {
        demoId: "S33-T3-B-DEMO",
        subtopicId: "S33-T3-B",
        environment: "local-python",
        description: "Detecta overfit por gap train−valid (umbral 0.2) y fija seed reproducible.",
        preamble:
          "Un gap **train − valid** grande señala memorización. El umbral **0.2** es diagnóstico de lab del workbench, no una ley de ML. En esta demo, 0.95 vs. 0.70 dispara overfit True; `seeded_ints(42)` fija tres enteros reproducibles. No escribas: predice overfit y la lista; observa que sin seed no hay auditoría entre PRs del modelo.",
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
        why: "La mejor profundidad se elige por valid (o costo en valid), nunca solo por train. Seed en params hace comparable la corrida entre versiones del workbench. Un gap > 0.2 con seed aún se reporta y, según política del lab, se rechaza. Reproducibilidad y control de overfit son requisitos de experimentación responsable. En We Do: gap_thr=0.2 y caso controlado (no overfit).",
        retrospective:
          "Reproducibilidad + control de gap son requisitos de experimentación responsable. El error clásico es «train 99% ⇒ listo». We Do: umbral unificado 0.2 y seed presente (caso controlado, no el overfit de esta demo).",
      },
      {
        demoId: "S33-T4-A-DEMO",
        subtopicId: "S33-T4-A",
        environment: "local-python",
        description: "Keys sorted, beats_dummy calculado (victoria y derrota) y run válido aunque pierda al dummy.",
        preamble:
          "Tracking mínimo del workbench: keys ordenadas, `beats_dummy` calculado y un run **válido aunque pierda**. En esta demo, acc 0.7 gana al dummy 0.667; acc 0.5 pierde — y `lose_run_ok` es True porque hay metrics + run_id + beats booleano. No escribas: predice beats_win, beats_lose y por qué metrics vacías sí invalidan el log mientras la derrota no.",
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
        why: "La comparación honesta es el producto del workbench: no se exige `beats_dummy is True` para aceptar el log. Si la regla ya tiene accuracy 1.0, ganar solo al dummy no basta para promocionar. Keys sorted ayudan al audit entre PRs. Metrics vacías o run_id vacío sí invalidan. En We Do: beats False con log completo = PASS.",
        retrospective:
          "`beats_dummy=False` bien logueado es válido: la derrota es evidencia, no basura. El error clásico es borrar el run que «quedó mal» y sesgar el historial. Pregunta: si la regla ya tiene acc 1.0, ¿basta ganar al dummy para promocionar el modelo? We Do: quitar el gate anti-ML que exige victoria.",
      },
      {
        demoId: "S33-T4-B-DEMO",
        subtopicId: "S33-T4-B",
        environment: "local-python",
        description: "Mean de folds (3 decimales) y n_groups desde entidades únicas.",
        preamble:
          "Group CV por entidad evita leakage: la misma entidad no cae en train y valid del mismo fold. En esta demo, entities con e1 repetido dan **3** grupos (no 4 filas); mean de [0.6, 0.7, 0.65] con 3 decimales es 0.65; train {e1} y valid {e2,e3} son disjuntos. Observa `random_leak_ok False`: un split aleatorio con pares repetidos hace que el modelo «recuerde» al par.",
        code: {
          language: 'python',
          title: "gcv_demo.py",
          code: `def mean_fold(folds):
    return round(sum(folds) / len(folds), 3)

def n_groups(entities):
    return len(set(entities))

def groups_disjoint(train_ents, valid_ents):
    return set(train_ents).isdisjoint(set(valid_ents))

entities = ["e1", "e1", "e2", "e3"]
print("mean", mean_fold([0.6, 0.7, 0.65]))
print("n_groups", n_groups(entities))
print("disjoint", groups_disjoint(["e1"], ["e2", "e3"]))
print("random_leak_ok", False)`,
          output: `mean 0.65
n_groups 3
disjoint True
random_leak_ok False`,
        },
        why: "`n_groups = len(set(...))` es perfilado del dataset; la prueba de group CV es la disyunción train∩valid = ∅ por entidad. Un random split clásico infla métricas cuando hay múltiples filas por entidad. El análisis de errores por slice se profundiza en S34. En We Do: set, round a 3 decimales e isdisjoint.",
        retrospective:
          "Disyunción por entidad es el contrato, no solo el mean de folds. El error clásico es `len(entities)` o confiar en KFold clásico con pares repetidos. Pregunta: si e1 cayera en train y valid del mismo fold, ¿qué métrica inflada verías y por qué? We Do: n_groups=3 y mean=0.65 exactos.",
      }
    ],
  },
  weDo: {
    intro: "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats o n_groups); luego enrutas fixtures válidos, adversos o faltantes; y cierras con fallo cerrado —continuar, rechazar o pedir evidencia— sin inventar valores por defecto.",
    steps: [
      {
        id: "S33-T1-A-E1",
        subtopicId: "S33-T1-A",
        kind: "guided",
        title: "Prevalencia y target sin fraud",
        preamble:
          "- **Contexto:** en CASO-LIM-033-1A el workbench exige unit, target de cola y prevalencia real antes de cualquier modelo.\n- **Meta:** corregir el cálculo de prevalencia y el check de nombre fraud.\n- **Éxito:** una línea `S33-T1-A PASS`.\n- **Límites:** `prevalence = round(sum(y)/len(y), 3)` (no `len(y)-1`); exige `fraud_name is False`; no inventes labels de fraude.",
        instruction:
          "1. Abre el starter: divide por `len(y)-1` y exige `fraud_name is True` (DEFECT).\n2. Cambia a `sum(y) / len(y)` redondeado a 3.\n3. Exige `fraud_name is False` con target `needs_review_7d`.\n4. Imprime `S33-T1-A` y el status (debe ser PASS).",
        hint: "prevalence = round(sum(y)/len(y), 3); fraud_name = \"fraud\" in target.lower(); exige fraud_name is False y horizon > 0.",
        hints: [
          "prevalence = round(sum(y)/len(y), 3); fraud_name = \"fraud\" in target.lower(); exige fraud_name is False y horizon > 0.",
          "Con y=[0,1,0,0] hay un positivo de cuatro → 0.25. No uses len(y)-1.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "Tras corregir prevalencia y fraud_name, imprime `S33-T1-A PASS`.",
        feedback:
          "Con `y=[0,1,0,0]` la prevalencia es 0.25, no 0.333. Exigir `fraud_name True` sobre un target limpio es un gate invertido: el breach es el nombre `is_fraud`, no el framing correcto.",
        retrospective:
          "Prevalencia = positivos / n, mirados **antes** del fit. El error clásico es off-by-one en el denominador o aceptar un target con «fraud» en el nombre. Siguiente (E2): enrutar válido, adverso e incompleto.",
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
        title: "Assess de framing con prevalencia calculada",
        preamble:
          "- **Contexto:** el gate del workbench no solo «ve» el dict: exige prevalencia calculada y rechaza nombres de fraude.\n- **Meta:** armar el fixture válido con prevalencia real y enrutar tres casos (limpio, `is_fraud`, sin horizon).\n- **Éxito:** `PASS REJECT_FRAUD_TARGET MISSING:horizon`.\n- **Límites:** no hardcodes 0.25 a mano sin calcular; missing de horizon **antes** de mirar el contenido; datos sintéticos.",
        instruction:
          "1. Revisa el starter: `prevalence = 0.0` y assess da PASS si el target contiene `\"fraud\"` (DEFECT).\n2. Calcula prevalencia de `y=[0,1,0,0]`.\n3. Corrige `assess`: missing primero; PASS solo target limpio + horizon > 0 + unit + prevalence==0.25.\n4. Imprime las tres salidas en orden.",
        hint: "prevalence = round(sum(y)/len(y), 3); fraud_name = \"fraud\" in target.lower(); missing antes de mirar contenido.",
        hints: [
          "Con y=[0,1,0,0] prevalencia=0.25; el válido lleva unit, target limpio, horizon=7 y prevalence calculada.",
          "Primero missing de horizon; después target sin fraud + horizon > 0 + unit truthy.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "Produce `PASS REJECT_FRAUD_TARGET MISSING:horizon` con prevalence==0.25 en el válido.",
        feedback:
          "El framing válido se alimenta de prevalencia calculada (0.25 sobre `y=[0,1,0,0]`), no inventada. `is_fraud` es breach de **producto** en la cola de revisión, no un schema vacío: el assess debe fallar el adverso aunque el dict «se vea completo».",
        retrospective:
          "Hardcodear 0.25 «porque ya sabes el número» esconde un pipeline que no recalcula desbalance en el siguiente lote. El error clásico es dar PASS al nombre `is_fraud` por un if invertido. Pregunta: si mañana el lote tiene prevalencia 0.05, ¿qué se rompe si dejaste el 0.25 fijo? Luego (E3): CONTINUE / REJECT / REQUEST en lugar de PASS genérico.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e2.py",
          code: `# CASO-LIM-033 · assess framing con prevalencia calculada
# DEFECT: prevalence inventada; da PASS cuando target contiene "fraud"
# TAREA: deriva prevalence; missing primero; PASS solo framing limpio
y = [0, 1, 0, 0]
unit, target, horizon = "entity_pair", "needs_review_7d", 7
prevalence = 0.0  # DEFECT: debe ser round(sum(y)/len(y), 3) → 0.25
fraud_name = "fraud" in target.lower()

def assess(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon', 'prevalence'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if "fraud" in record["target"] else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", "unit": unit, "target": target, "horizon": horizon, "prevalence": prevalence}
invalid = {"case_id": "CASO-LIM-033-1A", "unit": unit, "target": "is_fraud", "horizon": 7, "prevalence": 0.25}
incomplete = {k: v for k, v in valid.items() if k != "horizon"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e2.py",
          code: `y = [0, 1, 0, 0]
unit, target, horizon = "entity_pair", "needs_review_7d", 7
prevalence = round(sum(y) / len(y), 3)
fraud_name = "fraud" in target.lower()

def assess(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon', 'prevalence'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        "fraud" not in record["target"]
        and record["horizon"] > 0
        and bool(record["unit"])
        and record["prevalence"] == 0.25
    )
    return "PASS" if ok else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", "unit": unit, "target": target, "horizon": horizon, "prevalence": prevalence}
invalid = {"case_id": "CASO-LIM-033-1A", "unit": unit, "target": "is_fraud", "horizon": 7, "prevalence": 0.25}
incomplete = {k: v for k, v in valid.items() if k != "horizon"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
assert results == ("PASS", "REJECT_FRAUD_TARGET", "MISSING:horizon")
assert valid["prevalence"] == 0.25 and fraud_name is False
` ,
          output: `PASS REJECT_FRAUD_TARGET MISSING:horizon` ,
        },
      },
      {
        id: "S33-T1-A-E3",
        subtopicId: "S33-T1-A",
        kind: "transfer",
        title: "Fallo cerrado: CONTINUE o REQUEST_HORIZON",
        preamble:
          "- **Contexto:** en ops de riesgo no se inventa un horizonte de 7 días cuando falta: se pide evidencia.\n- **Meta:** decidir CONTINUE / REJECT_FRAUD_TARGET / REQUEST_HORIZON con prevalencia calculada.\n- **Éxito:** `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON`.\n- **Límites:** missing → REQUEST_HORIZON (no CONTINUE); no inventes prevalence; is_fraud cierra con REJECT.",
        instruction:
          "1. Lee el DEFECT: prevalence inventada y missing devuelve CONTINUE.\n2. Calcula prevalencia real (0.25).\n3. En `decide`, missing → `REQUEST_HORIZON`; limpio → `CONTINUE`; fraud en nombre → `REJECT_FRAUD_TARGET`.\n4. Imprime las tres decisiones en orden.",
        hint: "prevalence = round(sum(y)/len(y), 3); missing → REQUEST_HORIZON antes de mirar fraud.",
        hints: [
          "Una ausencia no es breach: enrútala a REQUEST_HORIZON. is_fraud cierra con REJECT_FRAUD_TARGET.",
          "CONTINUE solo con target limpio, horizon > 0, unit truthy y prevalence==0.25 calculada.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
        tests: "Produce `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON` con prevalence calculada en el válido.",
        feedback:
          "CONTINUE solo con framing limpio y prevalencia mirada. REQUEST_* pide evidencia; REJECT_* cierra el breach de nombre. No rellenes horizon por defecto en silencio: distorsiona el target de cola.",
        retrospective:
          "En ops de riesgo, ausencia de horizonte no es «OK con default»: se pide evidencia y se detiene el fit. El error clásico es rellenar 7 en silencio «porque el lab siempre usó 7». Pregunta: si el negocio pidiera `is_fraud` y un horizon inventado a la vez, ¿qué código de fallo cierra primero y por qué? Ese hábito se reutiliza en el You Do al cerrar el framing de CP-N3-B.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e3.py",
          code: `# CASO-LIM-033 · decide framing con prevalencia calculada
# DEFECT: prevalence inventada; missing→CONTINUE; pred invertido
# TAREA: sin horizon → REQUEST_HORIZON; is_fraud → REJECT; limpio → CONTINUE
y = [0, 1, 0, 0]
prevalence = 1.0  # DEFECT: debe ser 0.25

def decide(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon', 'prevalence'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if "fraud" in record["target"] else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", "unit": "entity_pair", "target": "needs_review_7d", "horizon": 7, "prevalence": prevalence}
invalid = {"case_id": "CASO-LIM-033-1A", "unit": "entity_pair", "target": "is_fraud", "horizon": 7, "prevalence": 0.25}
uncertain = {k: v for k, v in valid.items() if k != "horizon"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e3.py",
          code: `y = [0, 1, 0, 0]
prevalence = round(sum(y) / len(y), 3)

def decide(record: dict) -> str:
    required = {"case_id", 'unit', 'target', 'horizon', 'prevalence'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_HORIZON"
    ok = (
        "fraud" not in record["target"]
        and record["horizon"] > 0
        and bool(record["unit"])
        and record["prevalence"] == 0.25
    )
    return "CONTINUE" if ok else "REJECT_FRAUD_TARGET"

valid = {"case_id": "CASO-LIM-033-1A", "unit": "entity_pair", "target": "needs_review_7d", "horizon": 7, "prevalence": prevalence}
invalid = {"case_id": "CASO-LIM-033-1A", "unit": "entity_pair", "target": "is_fraud", "horizon": 7, "prevalence": 0.25}
uncertain = {k: v for k, v in valid.items() if k != "horizon"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FRAUD_TARGET", "REQUEST_HORIZON"]
assert valid["prevalence"] == 0.25
` ,
          output: `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON` ,
        },
      },
      {
        id: "S33-T1-B-E1",
        subtopicId: "S33-T1-B",
        kind: "guided",
        title: "Dual baseline: dummy, costo y regla",
        preamble:
          "- **Contexto:** CASO-LIM-033-1B exige dummy majority **y** regla `x>=1` documentados antes del ML.\n- **Meta:** calcular dummy_acc≈0.667, cost=1 (un FP) y rule_acc=1.0.\n- **Éxito:** `S33-T1-B PASS`.\n- **Límites:** majority con `max(set(y), key=y.count)` (no `min`); costo desde y vs. dummy; no dejes cost=0 inventado.",
        instruction:
          "1. Abre el starter: `min` de clase, cost=0 y `v < 1` en la regla (DEFECT).\n2. Cambia a `max` para majority.\n3. Suma c_fp/c_fn al comparar y vs. dummy.\n4. Regla con `v >= 1.0`; imprime `S33-T1-B PASS`.",
        hint: "maj = max(set(y), key=y.count); dummy = [maj]*len(y); costo desde y vs. dummy; rule_pred = [int(v>=1) for v in x].",
        hints: [
          "maj = max(...); dummy = [maj]*n; suma c_fp/c_fn al comparar y vs. dummy → cost=1, acc≈0.667.",
          "Regla: pred [1,1,0] sobre x=[1,1,0] → rule_acc=1.0. Documenta dummy **y** regla antes del ML.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "dummy_acc==0.667, cost==1 y rule_acc==1.0 e imprime `S33-T1-B PASS`.",
        feedback:
          "Con y=[1,1,0] el majority es 1: un FP cuesta 1 (c_fp=1). La regla sobre x da pred perfecta. Usar min o hardcodear cost deja un «baseline» falso que el modelo «gana» sin mérito.",
        retrospective:
          "Dual baseline = dummy **y** regla, ambos calculados. El error clásico es documentar solo el dummy y olvidar que la regla ya puede ser perfecta. Siguiente (E2): assess con cost/acc derivados.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `# CASO-LIM-033 · dual baseline: dummy+costo + regla x>=thr
# DEFECT: majority con min; cost=0 hardcode; rule_acc no calculado
# TAREA: max + costo desde y vs. dummy; rule_acc de x>=1; PASS
y = [1, 1, 0]
x = [1.0, 1.0, 0.0]
c_fp, c_fn = 1, 5
maj = min(set(y), key=y.count)  # DEFECT: minoría
dummy = [maj] * len(y)
dummy_acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
cost = 0  # DEFECT: debe derivarse de FP/FN
rule_pred = [int(v < 1.0) for v in x]  # DEFECT: umbral invertido
rule_acc = round(sum(a == b for a, b in zip(y, rule_pred)) / len(y), 3)
meets_contract = dummy_acc == 0.667 and cost == 1 and rule_acc == 1.0
status = "PASS" if meets_contract else "REJECT_NO_BASELINE"
print("S33-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `y = [1, 1, 0]
x = [1.0, 1.0, 0.0]
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
rule_pred = [int(v >= 1.0) for v in x]
rule_acc = round(sum(a == b for a, b in zip(y, rule_pred)) / len(y), 3)
meets_contract = dummy_acc == 0.667 and cost == 1 and rule_acc == 1.0
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
        title: "Assess de baseline con cost calculado",
        preamble:
          "- **Contexto:** el contrato del gate se alimenta de números reales, no de un dict pre-rellenado a mano.\n- **Meta:** derivar dummy_acc y cost; enrutar válido / sin baseline / sin cost.\n- **Éxito:** `PASS REJECT_NO_BASELINE MISSING:cost`.\n- **Límites:** missing de cost primero; no des PASS si `has_baseline is False`; deriva cost como en E1.",
        instruction:
          "1. Revisa el starter: `cost = None` y assess invertido (DEFECT).\n2. Deriva cost de FP/FN sobre el dummy.\n3. PASS solo con has_baseline True, cost no nulo y dummy_acc >= 0.\n4. Imprime las tres salidas.",
        hint: "Primero missing; luego has_baseline True, cost is not None y dummy_acc >= 0. Deriva dummy_acc/cost como en E1.",
        hints: [
          "maj = max(...); dummy = [maj]*n; acc y cost desde y vs. dummy (c_fp=1, c_fn=5).",
          "Con y=[1,1,0] esperas dummy_acc≈0.667 y cost=1 en el fixture válido.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "Produce exactamente `PASS REJECT_NO_BASELINE MISSING:cost` con cost/acc derivados en el válido.",
        feedback:
          "El contrato se alimenta de números calculados de y vs. dummy, no de un dict pre-rellenado. Sin cost no hay impacto de cola defendible.",
        retrospective:
          "Un baseline sin costo es incompleto para la cola (FP/FN asimétricos). El error clásico es un dict «válido» con cost None. Luego (E3): REQUEST_COST en lugar de inventar c_fn.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e2.py",
          code: `# CASO-LIM-033 · assess baseline con fields calculados
# DEFECT: cost/acc no derivados; da PASS cuando has_baseline es False
# TAREA: deriva dummy_acc+cost; missing de cost primero; PASS solo con baseline real
y = [1, 1, 0]
c_fp, c_fn = 1, 5
maj = max(set(y), key=y.count)
dummy = [maj] * len(y)
dummy_acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
cost = None  # DEFECT: deriva FP/FN como en E1

def assess(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": dummy_acc, "cost": cost, "has_baseline": True}
invalid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": 0.0, "cost": 0, "has_baseline": False}
incomplete = {k: v for k, v in valid.items() if k != "cost"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e2.py",
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

def assess(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["has_baseline"] is True and record["cost"] is not None and record["dummy_acc"] >= 0 else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": dummy_acc, "cost": cost, "has_baseline": True}
invalid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": 0.0, "cost": 0, "has_baseline": False}
incomplete = {k: v for k, v in valid.items() if k != "cost"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
assert results == ("PASS", "REJECT_NO_BASELINE", "MISSING:cost")
assert valid["dummy_acc"] == 0.667 and valid["cost"] == 1
` ,
          output: `PASS REJECT_NO_BASELINE MISSING:cost` ,
        },
      },
      {
        id: "S33-T1-B-E3",
        subtopicId: "S33-T1-B",
        kind: "transfer",
        title: "REQUEST_COST si falta el costo de cola",
        preamble:
          "- **Contexto:** en el workbench, un c_fn inventado «porque 5 suena bien» distorsiona la promoción del modelo.\n- **Meta:** derivar cost real y decidir CONTINUE / REJECT_NO_BASELINE / REQUEST_COST.\n- **Éxito:** `CONTINUE REJECT_NO_BASELINE REQUEST_COST`.\n- **Límites:** no dejes cost=99; missing → REQUEST_COST; has_baseline False → REJECT.",
        instruction:
          "1. Lee el DEFECT: cost hardcode y missing devuelve CONTINUE.\n2. Deriva cost de y vs. dummy (esperado 1).\n3. Corrige `decide` a REQUEST_COST / REJECT / CONTINUE según el caso.\n4. Imprime las tres decisiones.",
        hint: "Deriva acc/cost como en E1; missing de cost → REQUEST_COST; has_baseline False → REJECT.",
        hints: [
          "Con y=[1,1,0] dummy majority → acc≈0.667 y cost=1. No inventes el costo en el válido.",
          "CONTINUE solo con has_baseline True, cost no nulo y dummy_acc >= 0.",
        ],
        edgeCases: ["falta cost", "fixture adverso: has_baseline=False o sin dummy", "CASO-LIM-033-1B es sintético"],
        tests: "Produce `CONTINUE REJECT_NO_BASELINE REQUEST_COST` con cost/acc derivados en el válido.",
        feedback:
          "El costo de cola se calcula o se pide; no se inventa un c_fn por defecto en silencio. Un default mudo sesga la promoción del modelo.",
        retrospective:
          "El costo se calcula o se pide; no se inventa. El error clásico es rellenar defaults en silencio. Pregunta: ¿qué riesgo hay si c_fn real es mucho mayor que el del lab?",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e3.py",
          code: `# CASO-LIM-033 · decide baseline con cost calculado
# DEFECT: cost hardcode; missing→CONTINUE; pred invertido
# TAREA: deriva dummy_acc+cost; sin cost → REQUEST; sin baseline → REJECT
y = [1, 1, 0]
c_fp, c_fn = 1, 5
maj = max(set(y), key=y.count)
dummy = [maj] * len(y)
dummy_acc = round(sum(a == b for a, b in zip(y, dummy)) / len(y), 3)
cost = 99  # DEFECT: debe derivarse de FP/FN (esperado 1)

def decide(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": dummy_acc, "cost": cost, "has_baseline": True}
invalid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": 0.0, "cost": None, "has_baseline": False}
uncertain = {k: v for k, v in valid.items() if k != "cost"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e3.py",
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

def decide(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_COST"
    return "CONTINUE" if record["has_baseline"] is True and record["cost"] is not None and record["dummy_acc"] >= 0 else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": dummy_acc, "cost": cost, "has_baseline": True}
invalid = {"case_id": "CASO-LIM-033-1B", "dummy_acc": 0.0, "cost": None, "has_baseline": False}
uncertain = {k: v for k, v in valid.items() if k != "cost"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_NO_BASELINE", "REQUEST_COST"]
assert valid["dummy_acc"] == 0.667 and valid["cost"] == 1
` ,
          output: `CONTINUE REJECT_NO_BASELINE REQUEST_COST` ,
        },
      },
      {
        id: "S33-T2-A-E1",
        subtopicId: "S33-T2-A",
        kind: "guided",
        title: "Sigmoid, thr 0.6 y L2 documentada",
        preamble:
          "- **Contexto:** CASO-LIM-033-2A exige p, pred umbralada, l2_sq diagnóstico y `penalty=\"l2\"`.\n- **Meta:** p=0.5, pred=0 con thr=0.6, l2_sq=5 y penalty l2.\n- **Éxito:** `S33-T2-A PASS`.\n- **Límites:** l2_sq = sum(v*v), no abs; thr del lab = 0.6; no dejes penalty=\"none\".",
        instruction:
          "1. Abre el starter: thr=0.5, penalty none, sum(abs(v)) (DEFECT).\n2. Fija thr=0.6 y penalty=\"l2\".\n3. Cambia a sum(v*v) para l2_sq.\n4. Imprime `S33-T2-A PASS`.",
        hint: "sigmoid(0)=0.5; pred = int(sigmoid(w*x+b) >= thr); l2_sq = sum(v*v for v in ws); penalty debe ser \"l2\".",
        hints: [
          "sigmoid(0)=0.5; pred = int(sigmoid(w*x+b) >= thr); l2_sq = sum(v*v for v in ws).",
          "p≈0.55 < 0.6 → pred 0. l2_sq de [1,2] es 5 (diagnóstico de magnitud; no uses abs ni la raíz).",
        ],
        edgeCases: ["falta p", "fixture adverso: penalty distinta de l2", "CASO-LIM-033-2A es sintético"],
        tests: "p==0.5, pred==0, l2_sq==5, penalty==\"l2\" e imprime `S33-T2-A PASS`.",
        feedback:
          "p≈0.55 no alcanza thr=0.6 → pred 0. L1 (suma de |w|) no es l2_sq. El gate exige la config L2, no un umbral mágico sobre Σw².",
        retrospective:
          "Cuatro piezas: sigmoid, thr de producto, l2_sq diagnóstico, penalty en params. El error clásico es confiar thr=0.5 «porque es el default». Siguiente (E2): assess con penalty none como adverso.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e1.py",
          code: `# CASO-LIM-033 · sigmoid + thr + l2_sq diagnóstico + penalty
# DEFECT: L1 en vez de Σw²; thr=0.5; penalty sin declarar l2
# TAREA: p==0.5, pred==0 con thr=0.6, l2_sq==5, penalty=="l2"
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

ws, w, b, x = [1, 2], 1.0, 0.0, 0.2
thr = 0.5  # DEFECT: debe ser 0.6 para el caso del lab
penalty = "none"  # DEFECT: debe ser "l2"
p = round(sigmoid(0), 3)
pred = int(sigmoid(w * x + b) >= thr)
l2_sq = sum(abs(v) for v in ws)  # DEFECT: L1
meets_contract = p == 0.5 and pred == 0 and l2_sq == 5 and penalty == "l2"
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
penalty = "l2"
p = round(sigmoid(0), 3)
pred = int(sigmoid(w * x + b) >= thr)
l2_sq = sum(v * v for v in ws)
meets_contract = p == 0.5 and pred == 0 and l2_sq == 5 and penalty == "l2"
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
        title: "Assess: penalty l2, no solo l2_sq",
        preamble:
          "- **Contexto:** un vector con pesos no nulos puede venir de un fit **sin** regularizar; el gate mira la declaración.\n- **Meta:** enrutar válido (penalty l2) / adverso (none) / sin p.\n- **Éxito:** `PASS REJECT_UNREGULARIZED MISSING:p`.\n- **Límites:** missing de p primero; PASS solo con penalty==\"l2\" y p/pred válidos; l2_sq no sustituye la config.",
        instruction:
          "1. Revisa el assess invertido (PASS si penalty==\"none\").\n2. Deja p, pred y l2 ya calculados.\n3. PASS solo si penalty==\"l2\" y rangos OK.\n4. Imprime las tres salidas.",
        hint: "Primero missing de p; luego exige penalty==\"l2\", p en [0,1], pred en {0,1}. l2_sq=5 es diagnóstico, no la prueba de L2.",
        hints: [
          "p = round(sigmoid(0), 3); pred = int(sigmoid(1*0.2+0) >= 0.6); l2 = sum(v*v for v in [1,2]).",
          "El adverso con penalty=\"none\" falla aunque l2_sq > 0: la config, no la magnitud, prueba L2.",
        ],
        edgeCases: ["falta p", "fixture adverso: penalty=\"none\" (sin L2 documentada)", "CASO-LIM-033-2A es sintético"],
        tests: "Produce `PASS REJECT_UNREGULARIZED MISSING:p` con p/pred/l2 y penalty derivados en el válido.",
        feedback:
          "El gate de regularización exige `penalty=\"l2\"` documentada en params. Un `l2_sq=5` solo describe magnitudes de coeficientes: un fit sin regularizar también puede dejar pesos no nulos. El adverso con `penalty=\"none\"` debe fallar aunque el número se vea «grande».",
        retrospective:
          "Declarar L2 es un contrato de entrenamiento, no un umbral mágico sobre Σw². El error clásico es «ya hay pesos ⇒ ya hay L2». Pregunta: ¿qué más reportarías junto a `penalty` (C o λ) para que un revisor de PR no tenga que adivinar la fuerza? Luego (E3): REQUEST_SIGMOID si falta p.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e2.py",
          code: `# CASO-LIM-033 · assess logística: penalty L2 + p/pred/l2_sq
# DEFECT: da PASS cuando penalty=="none"; l2 inventado en válido
# TAREA: deriva p, pred, l2_sq; PASS solo con penalty=="l2"
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

p = round(sigmoid(0), 3)
pred = int(sigmoid(1.0 * 0.2 + 0.0) >= 0.6)
l2 = float(sum(v * v for v in [1, 2]))

def assess(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2', 'penalty'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["penalty"] == "none" else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", "p": p, "pred": pred, "l2": l2, "penalty": "l2"}
invalid = {"case_id": "CASO-LIM-033-2A", "p": 0.5, "pred": 0, "l2": 5.0, "penalty": "none"}
incomplete = {k: v for k, v in valid.items() if k != "p"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-a-e2.py",
          code: `import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

p = round(sigmoid(0), 3)
pred = int(sigmoid(1.0 * 0.2 + 0.0) >= 0.6)
l2 = float(sum(v * v for v in [1, 2]))

def assess(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2', 'penalty'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["penalty"] == "l2"
        and 0 <= record["p"] <= 1
        and record["pred"] in (0, 1)
    )
    return "PASS" if ok else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", "p": p, "pred": pred, "l2": l2, "penalty": "l2"}
invalid = {"case_id": "CASO-LIM-033-2A", "p": 0.5, "pred": 0, "l2": 5.0, "penalty": "none"}
incomplete = {k: v for k, v in valid.items() if k != "p"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
assert results == ("PASS", "REJECT_UNREGULARIZED", "MISSING:p")
assert valid["p"] == 0.5 and valid["pred"] == 0 and valid["l2"] == 5.0 and valid["penalty"] == "l2"
` ,
          output: `PASS REJECT_UNREGULARIZED MISSING:p` ,
        },
      },
      {
        id: "S33-T2-A-E3",
        subtopicId: "S33-T2-A",
        kind: "transfer",
        title: "REQUEST_SIGMOID si falta la probabilidad",
        preamble:
          "- **Contexto:** priorizar cola sin p en [0,1] es adivinar; sin L2 documentada el modelo no pasa el gate del lab.\n- **Meta:** decide CONTINUE / REJECT_UNREGULARIZED / REQUEST_SIGMOID.\n- **Éxito:** `CONTINUE REJECT_UNREGULARIZED REQUEST_SIGMOID`.\n- **Límites:** missing → REQUEST_SIGMOID; no trates penalty none como CONTINUE aunque l2>0.",
        instruction:
          "1. Lee el DEFECT: missing→CONTINUE y PASS invertido sobre penalty.\n2. Missing → `REQUEST_SIGMOID`.\n3. penalty==\"l2\" + p/pred válidos → CONTINUE; si no → REJECT_UNREGULARIZED.\n4. Imprime las tres decisiones.",
        hint: "Missing → REQUEST_SIGMOID; COMPLETE con penalty==\"l2\" y p/pred válidos → CONTINUE.",
        hints: [
          "Missing → REQUEST_SIGMOID; COMPLETE con penalty==\"l2\" y p/pred válidos → CONTINUE.",
          "No trates penalty=\"none\" como CONTINUE aunque l2_sq > 0.",
        ],
        edgeCases: ["falta p", "fixture adverso: penalty=\"none\"", "CASO-LIM-033-2A es sintético"],
        tests: "Produce `CONTINUE REJECT_UNREGULARIZED REQUEST_SIGMOID`.",
        feedback:
          "Sin probabilidad sigmoid en [0,1] no se prioriza cola: es adivinar. Sin `penalty=\"l2\"` documentada el modelo no pasa el gate del workbench de revisión, aunque `l2_sq` sea positivo. Missing de p → REQUEST, no CONTINUE.",
        retrospective:
          "Sin sigmoid no hay score de cola; sin penalty l2 no se acepta el modelo. El error clásico es «seguir con CONTINUE» cuando falta p. Pregunta: ¿qué pedirías si falta C o λ además del penalty?",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e3.py",
          code: `# CASO-LIM-033 · decide logística (REQUEST_SIGMOID / REJECT_UNREGULARIZED)
# DEFECT: missing→CONTINUE; pred invertido sobre penalty
# TAREA: sin p → REQUEST_SIGMOID; penalty!="l2" → REJECT; l2 documentada → CONTINUE
def decide(record: dict) -> str:
    required = {"case_id", 'p', 'pred', 'l2', 'penalty'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["penalty"] == "none" else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0, 'penalty': 'l2'}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0, 'penalty': 'none'}}
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
    required = {"case_id", 'p', 'pred', 'l2', 'penalty'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SIGMOID"
    ok = (
        record["penalty"] == "l2"
        and 0 <= record["p"] <= 1
        and record["pred"] in (0, 1)
    )
    return "CONTINUE" if ok else "REJECT_UNREGULARIZED"

valid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0, 'penalty': 'l2'}}
invalid = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0, 'penalty': 'none'}}
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
        title: "Ranking |coef| sin claim causal",
        preamble:
          "- **Contexto:** el informe del workbench lista features S32 por importancia de coeficiente solo si están escaladas.\n- **Meta:** top=`shared_phone`, scaled True, causal False.\n- **Éxito:** `S33-T2-B PASS`.\n- **Límites:** `sorted(..., reverse=True)`; no exijas causal True; no compares |coef| si scaled=False.",
        instruction:
          "1. Abre el starter: sorted sin reverse y causal is True en el contrato (DEFECT).\n2. Añade reverse=True.\n3. Exige causal is False (y scaled True, top shared_phone).\n4. Imprime `S33-T2-B PASS`.",
        hint: "ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True); top debe ser shared_phone.",
        hints: [
          "ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True); top debe ser shared_phone.",
          "scaled True y causal False son obligatorios antes de rankear para el informe.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Tras reverse=True y causal=False, top es shared_phone e imprime `S33-T2-B PASS`.",
        feedback:
          "Sin reverse el «top» es amount_z por magnitud menor. Exigir causal True es un gate anti-producto: el lab prohíbe el claim causal en el informe de cola.",
        retrospective:
          "|coef| descendente + causal=False. El error clásico es ordenar al revés o «demostrar causa» con un signo. Siguiente (E2): assess con scaled False como adverso.",
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
        title: "Assess de coefs escalados y no causales",
        preamble:
          "- **Contexto:** un informe con scaled=False o causal=True no debe pasar el gate de interpretación.\n- **Meta:** top calculado + tres rutas PASS / REJECT_UNSCALED_COEF / MISSING:scaled.\n- **Éxito:** `PASS REJECT_UNSCALED_COEF MISSING:scaled`.\n- **Límites:** missing de scaled primero; top debe ser shared_phone; no des PASS al adverso.",
        instruction:
          "1. Corrige ranking con reverse=True.\n2. Arma valid con top, scaled True, causal False.\n3. PASS solo si scaled, !causal y top correcto.\n4. Imprime las tres salidas.",
        hint: "Ordena las features por magnitud del coeficiente, de mayor a menor; el top es la primera.",
        hints: [
          "top debe ser shared_phone; el válido lleva top, scaled True y causal False.",
          "Primero missing de scaled; el adverso falla por flags de interpretación, no por schema.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Produce `PASS REJECT_UNSCALED_COEF MISSING:scaled` con top==shared_phone calculado.",
        feedback:
          "El ranking de features S32 solo se acepta escalado y sin claim causal. El adverso falla por flags de interpretación, no por schema vacío.",
        retrospective:
          "Un informe de cola con `scaled=False` o `causal=True` no es «casi OK»: es un overclaim de importancia o de causa. El error clásico es rankear features crudas «porque el número se ve grande». Pregunta: si el top correcto es `shared_phone` pero `causal=True`, ¿qué daño hace a la mesa de revisión de Lima? Luego (E3): REQUEST_SCALE_FLAG.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e2.py",
          code: `# CASO-LIM-033 · assess coefs con top calculado (REJECT_UNSCALED_COEF)
# DEFECT: ranking ascendente; da PASS cuando scaled=False o causal=True
# TAREA: top=shared_phone; missing de scaled primero; PASS solo scaled+!causal
coefs = {"shared_phone": 0.8, "amount_z": -0.2}
ranked = sorted(coefs, key=lambda k: abs(coefs[k]))  # DEFECT: falta reverse=True
top = ranked[0]
scaled, causal = True, False

def assess(record: dict) -> str:
    required = {"case_id", 'coefs', 'top', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["scaled"] is False or record["causal"] is True else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", "coefs": coefs, "top": top, "scaled": scaled, "causal": causal}
invalid = {"case_id": "CASO-LIM-033-2B", "coefs": coefs, "top": top, "scaled": False, "causal": True}
incomplete = {k: v for k, v in valid.items() if k != "scaled"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-b-e2.py",
          code: `coefs = {"shared_phone": 0.8, "amount_z": -0.2}
ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
top = ranked[0]
scaled, causal = True, False

def assess(record: dict) -> str:
    required = {"case_id", 'coefs', 'top', 'scaled', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["scaled"] is True
        and record["causal"] is False
        and record["top"] == "shared_phone"
    )
    return "PASS" if ok else "REJECT_UNSCALED_COEF"

valid = {"case_id": "CASO-LIM-033-2B", "coefs": coefs, "top": top, "scaled": scaled, "causal": causal}
invalid = {"case_id": "CASO-LIM-033-2B", "coefs": coefs, "top": top, "scaled": False, "causal": True}
incomplete = {k: v for k, v in valid.items() if k != "scaled"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
assert results == ("PASS", "REJECT_UNSCALED_COEF", "MISSING:scaled")
assert top == "shared_phone"
` ,
          output: `PASS REJECT_UNSCALED_COEF MISSING:scaled` ,
        },
      },
      {
        id: "S33-T2-B-E3",
        subtopicId: "S33-T2-B",
        kind: "transfer",
        title: "REQUEST_SCALE_FLAG antes de rankear",
        preamble:
          "- **Contexto:** si el log no trae `scaled`, no inventes True: pides el flag y detienes el ranking engañoso.\n- **Meta:** decide CONTINUE / REJECT_UNSCALED_COEF / REQUEST_SCALE_FLAG.\n- **Éxito:** `CONTINUE REJECT_UNSCALED_COEF REQUEST_SCALE_FLAG`.\n- **Límites:** missing → REQUEST_SCALE_FLAG antes de mirar causal; unscaled o causal → REJECT.",
        instruction:
          "1. Lee el DEFECT: missing→CONTINUE y predicado invertido.\n2. Missing → `REQUEST_SCALE_FLAG`.\n3. CONTINUE solo scaled True y causal False.\n4. Imprime las tres decisiones.",
        hint: "Missing → REQUEST_SCALE_FLAG antes de mirar causal.",
        hints: [
          "Missing → REQUEST_SCALE_FLAG antes de mirar causal.",
          "CONTINUE solo con scaled True y causal False.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: scaled=False o causal=True", "CASO-LIM-033-2B es sintético"],
        tests: "Produce `CONTINUE REJECT_UNSCALED_COEF REQUEST_SCALE_FLAG`.",
        feedback:
          "Pedir el scale flag evita rankings engañosos en el informe de cola: sin z-score, |coef| miente sobre importancia relativa. Missing de `scaled` → REQUEST, no inventar True ni rankear «igual».",
        retrospective:
          "Pedir el scale flag es fail-closed de interpretación. El error clásico es rankear «igual» sin saber la escala. Pregunta: ¿qué harías si scaled=True pero las columnas no son z-score de S32?",
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
        title: "Stump thr y majority vote correctos",
        preamble:
          "- **Contexto:** CASO-LIM-033-3A pide predicciones de stump controlado y un voto de tres débiles.\n- **Meta:** preds=[0,1], maj=1, depth_unlimited False.\n- **Éxito:** `S33-T3-A PASS`.\n- **Límites:** `int(x >= thr)`; majority `sum >= (len+1)//2`; no dejes depth libre.",
        instruction:
          "1. Abre el starter: umbral invertido y majority imposible (DEFECT).\n2. Cambia a `x >= thr`.\n3. Majority con umbral de mayoría simple.\n4. Imprime `S33-T3-A PASS`.",
        hint: "stump: int(x >= thr); majority: sum(votes) >= (len(votes)+1)//2.",
        hints: [
          "stump: int(x >= thr); majority: sum(votes) >= (len(votes)+1)//2.",
          "0.1 → 0, 0.4 → 1; votos [1,0,1] → majority 1.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "preds==[0,1], maj==1, depth_unlimited False e imprime `S33-T3-A PASS`.",
        feedback:
          "0.1 no alcanza 0.3 → 0; 0.4 sí → 1. Con votos [1,0,1] la mayoría es 1. `sum > len` casi nunca es True: el voto queda muerto.",
        retrospective:
          "Sentido del umbral y del voto importan tanto como «tener un stump». El error clásico es copiar thr de otro lab sin mirar el fixture. Siguiente (E2): reject de depth_unlimited.",
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
        title: "Assess: rechazar profundidad ilimitada",
        preamble:
          "- **Contexto:** depth libre sobre el sintético memoriza ruido y no demuestra valor frente al dummy.\n- **Meta:** enrutar válido / depth libre / sin stump_preds.\n- **Éxito:** `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds`.\n- **Límites:** missing primero; PASS solo depth False y preds no vacías.",
        instruction:
          "1. Revisa el assess que da PASS si depth_unlimited is True (DEFECT).\n2. Invierte: PASS con depth False y len(stump_preds) >= 1.\n3. Deja las tres rutas en orden.\n4. Imprime las salidas.",
        hint: "PASS si depth_unlimited is False y len(stump_preds) >= 1.",
        hints: [
          "PASS si depth_unlimited is False y len(stump_preds) >= 1.",
          "Primero missing; el adverso falla por depth libre.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "Produce `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds`.",
        feedback:
          "Profundidad ilimitada sobreajusta el sintético y se rechaza en este lab: `max_depth` libre no demuestra valor frente al dummy de cola aunque el accuracy de train suba.",
        retrospective:
          "El adverso no es «stump vacío de idea»: es profundidad sin control frente al dummy de cola. El error clásico es `max_depth=None` porque el accuracy de train sube. Pregunta: si train_acc=0.99 y valid_acc=0.60 con depth libre, ¿qué compararías antes de promocionar? Luego (E3): REQUEST_STUMP.",
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
        title: "REQUEST_STUMP si no hay predicciones",
        preamble:
          "- **Contexto:** aceptar un ensamble opaco o depth libre sin ver preds del stump es un breach del lab.\n- **Meta:** calcular preds/maj y decidir CONTINUE / REJECT_DEPTH_UNLIMITED / REQUEST_STUMP.\n- **Éxito:** `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP`.\n- **Límites:** thr=0.3 con `>=`; missing → REQUEST_STUMP; depth True → REJECT.",
        instruction:
          "1. Corrige stump a `x >= thr`.\n2. Calcula preds y maj del fixture.\n3. decide: missing → REQUEST_STUMP; depth controlada + preds → CONTINUE; si no → REJECT.\n4. Imprime las tres decisiones.",
        hint: "Calcula preds y maj; missing → REQUEST_STUMP; depth True → REJECT; ok → CONTINUE.",
        hints: [
          "stump_preds: int(x >= 0.3); majority: sum >= (len+1)//2.",
          "CONTINUE solo con depth_unlimited False y lista de preds no vacía.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: depth_unlimited=True", "CASO-LIM-033-3A es sintético"],
        tests: "Produce `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP` con preds calculados.",
        feedback:
          "Se pide el stump calculado antes de aceptar un ensamble opaco o depth libre. Hardcodear preds sin thr no pasa el gate del lab.",
        retrospective:
          "Se pide el stump calculado antes de celebrar el voto. El error clásico es hardcodear [0,1] y olvidar thr. Pregunta: ¿por qué depth_unlimited=True se rechaza aunque majority sea 1?",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e3.py",
          code: `# CASO-LIM-033 · decide stump con preds calculados
# DEFECT: thr invertido; missing→CONTINUE; pred invertido sobre depth
# TAREA: thr=0.3, maj de [1,0,1]; sin stump → REQUEST; depth libre → REJECT
def stump_preds(X, thr):
    return [int(x < thr) for x in X]  # DEFECT

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

preds = stump_preds([0.1, 0.4], 0.3)
maj = majority_vote([1, 0, 1])

def decide(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["depth_unlimited"] is True else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", "stump_preds": preds, "majority": maj, "depth_unlimited": False}
invalid = {"case_id": "CASO-LIM-033-3A", "stump_preds": preds, "majority": maj, "depth_unlimited": True}
uncertain = {k: v for k, v in valid.items() if k != "stump_preds"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-a-e3.py",
          code: `def stump_preds(X, thr):
    return [int(x >= thr) for x in X]

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

preds = stump_preds([0.1, 0.4], 0.3)
maj = majority_vote([1, 0, 1])

def decide(record: dict) -> str:
    required = {"case_id", 'stump_preds', 'majority', 'depth_unlimited'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_STUMP"
    return "CONTINUE" if record["depth_unlimited"] is False and len(record["stump_preds"]) >= 1 else "REJECT_DEPTH_UNLIMITED"

valid = {"case_id": "CASO-LIM-033-3A", "stump_preds": preds, "majority": maj, "depth_unlimited": False}
invalid = {"case_id": "CASO-LIM-033-3A", "stump_preds": preds, "majority": maj, "depth_unlimited": True}
uncertain = {k: v for k, v in valid.items() if k != "stump_preds"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_DEPTH_UNLIMITED", "REQUEST_STUMP"]
assert preds == [0, 1] and maj == 1
` ,
          output: `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP` ,
        },
      },
      {
        id: "S33-T3-B-E1",
        subtopicId: "S33-T3-B",
        kind: "guided",
        title: "Gap ≤ 0.2 y seed fija",
        preamble:
          "- **Contexto:** CASO-LIM-033-3B acepta un run **controlado** (a diferencia del demo, que mostraba overfit True): gap pequeño **y** seed presente.\n- **Meta:** con train=0.8, valid=0.75 y seed=42, pasar el gate (no overfit).\n- **Éxito:** `S33-T3-B PASS`.\n- **Límites:** gap_thr del lab = **0.2** (no 0.15); PASS si **not** overfit y seed no nula; no inventes seed.",
        instruction:
          "1. Abre el starter: thr=0.15 y meets_contract = is_overfit (DEFECT).\n2. Fija gap_thr=0.2.\n3. meets_contract = (not is_overfit) and seed is not None.\n4. Imprime `S33-T3-B PASS`.",
        hint: "gap = train_acc - valid_acc; overfit si gap > 0.2; PASS si not overfit y seed is not None.",
        hints: [
          "gap = train_acc - valid_acc; overfit si gap > 0.2; PASS si not overfit y seed is not None.",
          "El umbral unificado de la sección es 0.2 (no 0.15). Con 0.8−0.75=0.05 no hay overfit.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Con umbral 0.2, gap 0.05 y seed 42 imprime `S33-T3-B PASS`.",
        feedback:
          "0.8−0.75=0.05 no supera 0.2. El umbral 0.15 del starter es un off-by-policy del lab. Exigir is_overfit para PASS invierte el gate de control.",
        retrospective:
          "Gap controlado + seed = mínimo reproducible. El error clásico es copiar el thr de otro notebook o forzar overfit True imitando el demo. Siguiente (E2): REJECT_OVERFIT cuando el gap es grande.",
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
        title: "Assess: REJECT_OVERFIT si gap grande",
        preamble:
          "- **Contexto:** un gap train−valid de 0.39 con seed 42 sigue siendo overfit rechazable en este gate.\n- **Meta:** enrutar válido (gap≤0.2 + seed) / adverso / sin seed.\n- **Éxito:** `PASS REJECT_OVERFIT MISSING:seed`.\n- **Límites:** missing de seed primero; no des PASS al gap grande.",
        instruction:
          "1. Revisa el assess invertido (PASS si gap > 0.2).\n2. PASS solo gap <= 0.2 y seed presente.\n3. Mantén invalid train 0.99 / valid 0.6.\n4. Imprime las tres salidas.",
        hint: "Primero missing; luego gap <= 0.2 y seed presente.",
        hints: [
          "Primero missing; luego gap <= 0.2 y seed presente.",
          "invalid de ejemplo: train 0.99, valid 0.6.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Produce `PASS REJECT_OVERFIT MISSING:seed`.",
        feedback:
          "Gap > 0.2 con seed sigue siendo overfit rechazable en este gate: la seed hace reproducible la memoria, no la perdona. El log debe reportar el gap, no solo el seed.",
        retrospective:
          "Seed presente hace **reproducible** la memoria, no la absuelve: un gap 0.39 sigue siendo overfit de lab. El error clásico es loguear seed y celebrar train_acc 0.99. Pregunta: si eligieras depth mirando solo train, ¿qué métrica del valid te faltaría en el log del PR? Luego (E3): REQUEST_SEED.",
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
        title: "REQUEST_SEED si falta la semilla",
        preamble:
          "- **Contexto:** sin seed no se audita un PR del modelo entre versiones del workbench.\n- **Meta:** decide CONTINUE / REJECT_OVERFIT / REQUEST_SEED.\n- **Éxito:** `CONTINUE REJECT_OVERFIT REQUEST_SEED`.\n- **Límites:** missing → REQUEST_SEED (no rellenar 42); gap > 0.2 → REJECT.",
        instruction:
          "1. Lee el DEFECT: missing→CONTINUE y predicado invertido sobre gap.\n2. Missing → `REQUEST_SEED`.\n3. CONTINUE solo gap <= 0.2 y seed no nula.\n4. Imprime las tres decisiones.",
        hint: "Missing → REQUEST_SEED; gap > 0.2 → REJECT_OVERFIT.",
        hints: [
          "Missing → REQUEST_SEED; gap > 0.2 → REJECT_OVERFIT.",
          "CONTINUE solo con gap <= 0.2 y seed no nula.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap train−valid > 0.2", "CASO-LIM-033-3B es sintético"],
        tests: "Produce `CONTINUE REJECT_OVERFIT REQUEST_SEED`.",
        feedback:
          "Sin seed no se audita el PR del modelo entre versiones; se pide, no se inventa 42 en silencio «porque siempre lo usamos».",
        retrospective:
          "Se pide la seed; no se inventa. El error clásico es hardcodear 42 «porque siempre lo usamos». Pregunta: ¿qué más pondrías en params junto a seed y depth?",
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
        title: "Run válido aunque pierda al dummy",
        preamble:
          "- **Contexto:** en ops de riesgo, un experimento que pierde al dummy y se documenta evita lanzar complejidad inútil.\n- **Meta:** con acc=0.5 y dummy=0.667, beats=False y log completo → PASS.\n- **Éxito:** `S33-T4-A PASS`.\n- **Límites:** no uses `beats is True` como gate de validez; exige metrics no vacías, beats booleano y run_id.",
        instruction:
          "1. Abre el starter: meets_contract exige beats is True (DEFECT anti-ML).\n2. Calcula beats = acc > dummy_acc (será False).\n3. Valida con bool(metrics), isinstance(beats, bool), bool(run_id).\n4. Imprime `S33-T4-A PASS`.",
        hint: "beats = acc > dummy_acc; meets_contract = bool(metrics) and beats is not None and bool(run_id) — no exijas beats True.",
        hints: [
          "beats = acc > dummy_acc; el run sigue válido con beats False si metrics y run_id están.",
          "No uses `beats is True` como gate de validez del log.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Con acc 0.5, dummy 0.667, beats False, metrics y run_id presentes imprime `S33-T4-A PASS`.",
        feedback:
          "0.5 no supera 0.667 → beats False. Eso **no** es REJECT_UNLOGGED_RUN. El rechazo es para metrics vacías o run_id vacío: la derrota se loguea con honestidad.",
        retrospective:
          "Validez del log ≠ victoria del modelo. El error clásico es filtrar «solo wins» y sesgar el historial de experimentos. Siguiente (E2): assess de log mal armado.",
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
        title: "Assess: REJECT_UNLOGGED_RUN sin metrics",
        preamble:
          "- **Contexto:** el adverso del gate de tracking es un run sin metrics o sin run_id, **no** un beats_dummy False.\n- **Meta:** enrutar log completo / vacío / sin campo metrics.\n- **Éxito:** `PASS REJECT_UNLOGGED_RUN MISSING:metrics`.\n- **Límites:** no castigues beats False; missing de metrics primero; valid puede llevar beats False.",
        instruction:
          "1. Revisa el assess que da PASS si not metrics (DEFECT).\n2. PASS si metrics no vacías, beats_dummy presente y run_id truthy.\n3. Mantén valid con beats False.\n4. Imprime las tres salidas.",
        hint: "No uses `beats_dummy is True` como gate de validez del log.",
        hints: [
          "No uses `beats_dummy is True` como gate de validez del log.",
          "invalid de ejemplo: metrics {} y/o run_id ''.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Produce `PASS REJECT_UNLOGGED_RUN MISSING:metrics`.",
        feedback:
          "El adverso es un run mal logueado (metrics vacías o run_id vacío), no un modelo que pierde al dummy en la cola de Lima.",
        retrospective:
          "El if del gate de tracking mira **completitud del log**, no el signo de `beats_dummy`. El error clásico es mezclar «perdió al dummy» y «metrics vacías» en la misma rama. Pregunta: con beats False, metrics llenas y run_id, ¿qué imprime el assess y por qué es correcto? Luego (E3): dual win/lose + REQUEST_METRICS.",
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
        title: "Tracking dual: victoria y derrota se loguean",
        preamble:
          "- **Contexto:** el historial del workbench debe mostrar wins **y** losses frente al dummy 0.667.\n- **Meta:** decide sobre win, lose, run vacío y sin metrics.\n- **Éxito:** `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`.\n- **Límites:** no exijas beats True; missing metrics → REQUEST_METRICS; metrics {} o run_id '' → REJECT.",
        instruction:
          "1. Lee el DEFECT: exige victoria y missing→CONTINUE.\n2. Calcula beats en win y lose (True y False).\n3. CONTINUE si log completo (beats True o False); REJECT si vacío; REQUEST si falta metrics.\n4. Imprime las cuatro decisiones en orden.",
        hint: "Calcula beats = acc > 0.667 en cada run; decide no castiga beats False. Missing metrics → REQUEST_METRICS.",
        hints: [
          "Ambos runs con metrics+run_id+beats_dummy (True o False) → CONTINUE.",
          "metrics {} o run_id '' → REJECT_UNLOGGED_RUN; clave metrics ausente → REQUEST_METRICS.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics vacías o run_id vacío", "CASO-LIM-033-4A es sintético"],
        tests: "Produce `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`.",
        feedback:
          "Tracking responsable loguea victoria **y** derrota frente al dummy 0.667. Exigir `beats True` para CONTINUE es un gate anti-ML: oculta experimentos y sesga el historial del workbench. Metrics vacías o `run_id` vacío sí rechazan; falta de metrics → REQUEST.",
        retrospective:
          "El historial del workbench debe mostrar wins y losses: la comparación honesta es el producto, no un score de vanidad. El error clásico es filtrar «solo wins» para el dashboard. Pregunta: si la regla ya tiene acc 1.0, ¿basta `beats_dummy True` para promocionar, o miras también `beats_rule` y el costo de cola? Ese criterio cierra el You Do de CP-N3-B.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e3.py",
          code: `# CASO-LIM-033 · decide tracking dual win/lose
# DEFECT: exige beats True; missing→CONTINUE
# TAREA: win y lose logueados → CONTINUE; vacío → REJECT; sin metrics → REQUEST
dummy_acc = 0.667

def decide(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    # DEFECT: exige victoria
    ok = bool(record["metrics"]) and record.get("beats_dummy") is True and bool(record["run_id"])
    return "CONTINUE" if ok else "REJECT_UNLOGGED_RUN"

win = {"case_id": "CASO-LIM-033-4A", "metrics": {"accuracy": 0.7}, "beats_dummy": 0.7 > dummy_acc, "run_id": "run-win"}
lose = {"case_id": "CASO-LIM-033-4A", "metrics": {"accuracy": 0.5}, "beats_dummy": 0.5 > dummy_acc, "run_id": "run-lose"}
invalid = {"case_id": "CASO-LIM-033-4A", "metrics": {}, "beats_dummy": False, "run_id": ""}
uncertain = {"case_id": "CASO-LIM-033-4A", "beats_dummy": False, "run_id": "run-x"}
results = [decide(item) for item in (win, lose, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-a-e3.py",
          code: `dummy_acc = 0.667

def decide(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_METRICS"
    ok = bool(record["metrics"]) and "beats_dummy" in record and bool(record["run_id"])
    return "CONTINUE" if ok else "REJECT_UNLOGGED_RUN"

win = {"case_id": "CASO-LIM-033-4A", "metrics": {"accuracy": 0.7}, "beats_dummy": 0.7 > dummy_acc, "run_id": "run-win"}
lose = {"case_id": "CASO-LIM-033-4A", "metrics": {"accuracy": 0.5}, "beats_dummy": 0.5 > dummy_acc, "run_id": "run-lose"}
invalid = {"case_id": "CASO-LIM-033-4A", "metrics": {}, "beats_dummy": False, "run_id": ""}
uncertain = {"case_id": "CASO-LIM-033-4A", "beats_dummy": False, "run_id": "run-x"}
results = [decide(item) for item in (win, lose, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "CONTINUE", "REJECT_UNLOGGED_RUN", "REQUEST_METRICS"]
assert win["beats_dummy"] is True and lose["beats_dummy"] is False
` ,
          output: `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS` ,
        },
      },
      {
        id: "S33-T4-B-E1",
        subtopicId: "S33-T4-B",
        kind: "guided",
        title: "n_groups, mean_fold y disyunción",
        preamble:
          "- **Contexto:** CASO-LIM-033-4B exige entidades únicas, media de folds y train∩valid vacío.\n- **Meta:** n_groups=3, mean=0.65, disjoint True.\n- **Éxito:** `S33-T4-B PASS`.\n- **Límites:** len(set(entities)); round(..., 3) no 2; calcula isdisjoint, no hardcodes True.",
        instruction:
          "1. Abre el starter: len(entities), round 2, disjoint=True fijo (DEFECT).\n2. n_groups = len(set(entities)).\n3. mean con 3 decimales; disjoint con set(...).isdisjoint(...).\n4. Imprime `S33-T4-B PASS`.",
        hint: "n_groups = len(set(entities)); mean = round(sum(folds)/len(folds), 3); set(train).isdisjoint(set(valid)).",
        hints: [
          "n_groups = len(set(entities)); debe ser 3 (e1 se repite).",
          "mean_fold con 3 decimales: 0.65 exacto (no round a 2). Disyunción: train∩valid vacío.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True o train∩valid no vacío", "CASO-LIM-033-4B es sintético"],
        tests: "n_groups==3, mean==0.65, disjoint True e imprime `S33-T4-B PASS`.",
        feedback:
          "e1 se repite: hay 3 grupos, no 4. round a 2 da 0.65 por casualidad en este fixture, pero el contrato del lab es 3 decimales. Hardcodear disjoint esconde un leak futuro.",
        retrospective:
          "Tres chequeos: grupos únicos, media a 3 decimales, disyunción calculada. El error clásico es contar filas o hardcodear `disjoint=True` y esconder un leak futuro. Pregunta: ¿por qué round a 2 «funciona» en este fixture pero no es el contrato del lab? Siguiente (E2): assess con random_split True como adverso.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `# CASO-LIM-033 · n_groups + mean_fold + disyunción
# DEFECT: cuenta filas (len); round a 2; no verifica train∩valid
# TAREA: n_groups==3, mean==0.65, disjoint True; PASS
entities = ["e1", "e1", "e2", "e3"]
folds = [0.6, 0.7, 0.65]
train_ents, valid_ents = ["e1"], ["e2", "e3"]
n_groups = len(entities)  # DEFECT
mean = round(sum(folds) / len(folds), 2)  # DEFECT: debe ser 3
disjoint = True  # DEFECT: debe calcularse con isdisjoint
meets_contract = n_groups == 3 and mean == 0.65 and disjoint is True
status = "PASS" if meets_contract else "REJECT_RANDOM_LEAK"
print("S33-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `entities = ["e1", "e1", "e2", "e3"]
folds = [0.6, 0.7, 0.65]
train_ents, valid_ents = ["e1"], ["e2", "e3"]
n_groups = len(set(entities))
mean = round(sum(folds) / len(folds), 3)
disjoint = set(train_ents).isdisjoint(set(valid_ents))
meets_contract = n_groups == 3 and mean == 0.65 and disjoint is True
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
        title: "Assess group CV sin random_split",
        preamble:
          "- **Contexto:** random_split=True con entidades repetidas infla la métrica: el modelo ve al par en train y «acierta» en valid.\n- **Meta:** n_groups/mean calculados + PASS / REJECT_RANDOM_LEAK / MISSING:entities.\n- **Éxito:** `PASS REJECT_RANDOM_LEAK MISSING:entities`.\n- **Límites:** n_groups de set; mean con 3 decimales; PASS solo random_split False y ≥2 grupos.",
        instruction:
          "1. Corrige n_groups y mean.\n2. assess: missing entities primero; PASS con random_split False, n_groups>=2 y mean==0.65.\n3. No des PASS al adverso random.\n4. Imprime las tres salidas.",
        hint: "Los grupos son entidades únicas, no filas. La media va a 3 decimales. PASS exige split no aleatorio y al menos dos grupos.",
        hints: [
          "e1 se repite: n_groups es 3, no 4. mean con round(..., 3) es 0.65.",
          "Primero missing de entities; el adverso falla por random_split True.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True (leak entre folds)", "CASO-LIM-033-4B es sintético"],
        tests: "Produce `PASS REJECT_RANDOM_LEAK MISSING:entities` con n_groups==3 y mean==0.65 en el válido.",
        feedback:
          "Group CV se alimenta de entidades únicas y media de folds **calculadas**; random split con pares repetidos infla métricas de cola aunque el dict «se vea completo».",
        retrospective:
          "Group CV se alimenta de `n_groups` y mean **calculados**, no de un dict pre-rellenado a mano. El error clásico es poner `random_split=False` sin verificar entidades únicas. Pregunta: con entities `[\"e1\",\"e1\"]` y random_split True, ¿qué falla primero — el conteo de grupos o la disyunción conceptual? Luego (E3): REQUEST_GROUP_IDS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e2.py",
          code: `# CASO-LIM-033 · assess group CV con n_groups/mean calculados
# DEFECT: n_groups=len(entities); da PASS cuando random_split es True
# TAREA: n_groups=len(set(...)); mean round 3; missing entities primero
entities = ["e1", "e1", "e2", "e3"]
folds = [0.6, 0.7, 0.65]
n_groups = len(entities)  # DEFECT: debe ser len(set(entities)) → 3
mean = round(sum(folds) / len(folds), 2)  # DEFECT: 3 decimales → 0.65

def assess(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'n_groups', 'mean', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["random_split"] is True else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", "fold_scores": folds, "entities": entities, "n_groups": n_groups, "mean": mean, "random_split": False}
invalid = {"case_id": "CASO-LIM-033-4B", "fold_scores": folds, "entities": ["e1", "e1"], "n_groups": 1, "mean": mean, "random_split": True}
incomplete = {k: v for k, v in valid.items() if k != "entities"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e2.py",
          code: `entities = ["e1", "e1", "e2", "e3"]
folds = [0.6, 0.7, 0.65]
n_groups = len(set(entities))
mean = round(sum(folds) / len(folds), 3)

def assess(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'n_groups', 'mean', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["random_split"] is False
        and record["n_groups"] >= 2
        and record["n_groups"] == len(set(record["entities"]))
        and record["mean"] == 0.65
    )
    return "PASS" if ok else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", "fold_scores": folds, "entities": entities, "n_groups": n_groups, "mean": mean, "random_split": False}
invalid = {"case_id": "CASO-LIM-033-4B", "fold_scores": folds, "entities": ["e1", "e1"], "n_groups": 1, "mean": mean, "random_split": True}
incomplete = {k: v for k, v in valid.items() if k != "entities"}
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
assert results == ("PASS", "REJECT_RANDOM_LEAK", "MISSING:entities")
assert valid["n_groups"] == 3 and valid["mean"] == 0.65
` ,
          output: `PASS REJECT_RANDOM_LEAK MISSING:entities` ,
        },
      },
      {
        id: "S33-T4-B-E3",
        subtopicId: "S33-T4-B",
        kind: "transfer",
        title: "REQUEST_GROUP_IDS sin lista de entidades",
        preamble:
          "- **Contexto:** sin ids de entidad no puedes garantizar disyunción entre folds: se pide la lista, no se inventa el split.\n- **Meta:** n_groups=3 calculado y decide CONTINUE / REJECT_RANDOM_LEAK / REQUEST_GROUP_IDS.\n- **Éxito:** `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS`.\n- **Límites:** n_groups = len(set(...)); missing → REQUEST_GROUP_IDS; random_split True → REJECT.",
        instruction:
          "1. Corrige n_groups a len(set(entities)).\n2. Missing → `REQUEST_GROUP_IDS`.\n3. CONTINUE solo random_split False y n_groups >= 2 (y coherente con set de entities).\n4. Imprime las tres decisiones.",
        hint: "Cuenta entidades únicas, no filas. Sin entities se pide la lista; con split aleatorio se rechaza.",
        hints: [
          "CONTINUE solo con random_split False y n_groups >= 2 (calculado, no inventado).",
          "Sin entities no hay CV confiable por entidad: se pide la lista.",
        ],
        edgeCases: ["falta entities", "fixture adverso: random_split=True (leak entre folds)", "CASO-LIM-033-4B es sintético"],
        tests: "Produce `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS` con n_groups==3 en el válido.",
        feedback:
          "n_groups se calcula de entidades únicas; sin group ids se pide evidencia, no se inventa el split ni se asume KFold clásico «porque sklearn es fácil».",
        retrospective:
          "Sin ids de entidad no hay CV confiable por grupo: se pide la lista, no se inventa el split. El error clásico es rellenar entities sintéticas al azar para forzar CONTINUE. Pregunta: ¿qué pasaría si e1 apareciera en train y valid del mismo fold, y cómo lo detectarías con `isdisjoint`? Ese hábito cierra el group CV del You Do.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e3.py",
          code: `# CASO-LIM-033 · decide group CV con n_groups calculado
# DEFECT: n_groups=len(entities); missing→CONTINUE; pred invertido
# TAREA: n_groups=len(set(...)); sin entities → REQUEST; random leak → REJECT
entities = ["e1", "e1", "e2", "e3"]
n_groups = len(entities)  # DEFECT: debe ser 3

def decide(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'n_groups', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["random_split"] is True else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", "fold_scores": [0.6, 0.7, 0.65], "entities": entities, "n_groups": n_groups, "random_split": False}
invalid = {"case_id": "CASO-LIM-033-4B", "fold_scores": [0.6, 0.7], "entities": ["e1", "e1"], "n_groups": 1, "random_split": True}
uncertain = {k: v for k, v in valid.items() if k != "entities"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e3.py",
          code: `entities = ["e1", "e1", "e2", "e3"]
n_groups = len(set(entities))

def decide(record: dict) -> str:
    required = {"case_id", 'fold_scores', 'entities', 'n_groups', 'random_split'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_GROUP_IDS"
    ok = (
        record["random_split"] is False
        and record["n_groups"] >= 2
        and record["n_groups"] == len(set(record["entities"]))
    )
    return "CONTINUE" if ok else "REJECT_RANDOM_LEAK"

valid = {"case_id": "CASO-LIM-033-4B", "fold_scores": [0.6, 0.7, 0.65], "entities": entities, "n_groups": n_groups, "random_split": False}
invalid = {"case_id": "CASO-LIM-033-4B", "fold_scores": [0.6, 0.7], "entities": ["e1", "e1"], "n_groups": 1, "random_split": True}
uncertain = {k: v for k, v in valid.items() if k != "entities"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_RANDOM_LEAK", "REQUEST_GROUP_IDS"]
assert valid["n_groups"] == 3
` ,
          output: `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS` ,
        },
      }
    ],
  },
  youDo: {
    title: "Baseline vs. modelo: framing + tracking (CP-N3-B)",
    context:
      "Sobre CASO-LIM-033 (sintético): define unit, target y horizon; calcula dummy + costo y la regla simple; entrena un stump (o lineal simple); registra un run con params, metrics, beats_dummy y beats_rule (True o False); y reporta n_groups con group CV y disyunción de entidades. Las features de entrada siguen el estilo de S32 (`shared_phone`, `amount_z`). El starter trae thr=0.9 defectuoso: elige un thr sensato, recalcula beats y loguea aunque pierdas al dummy o a la regla.",
    objectives: [
      "Framing sin fraud en target y con horizonte explícito",
      "Dummy, regla y costo derivados de y vs. predicciones",
      "Modelo (stump o lineal) con seed fija y comparación honesta al mejor baseline",
      "Run log completo y group CV con disyunción train/valid por entidad",
      "Declarar qué dependencia manda en tu split — entidad, tiempo o ambas — y, si es tiempo, entregar el manifiesto de folds con origen y horizonte",
    ],
    requirements: [
      "has_baseline=True con dummy y regla documentados antes de promocionar modelo",
      "Sin label de fraude ni PII real",
      "es-PE sintético; seed fija en params",
      "beats_dummy y beats_rule calculados (pueden ser False) y logueados",
      "Si el problema es temporal: folds de origen móvil con `max(train) < min(valid)` verificado, baseline estacional y MAE de baseline y candidato sobre los mismos folds",
    ],
    starterCode: `# baselines CP-N3-B — CASO-LIM-033 (sintético únicamente)
# Pipeline: framing → dummy+costo+regla → stump → run log → group CV.
# Defecto intencional: thr del stump = 0.9 (casi nunca prioriza).
# Tarea: elige un thr que priorice de forma sensata para este fixture,
# recalcula accuracy/costo, beats_dummy y beats_rule, y deja el run log
# completo aunque pierdas al dummy o a la regla.
import math

y = [1, 1, 0, 0]
x = [0.1, 0.4, 0.2, 0.05]  # score sintético al estilo S32
entities = ["e1", "e1", "e2", "e3"]
fold_scores = [0.6, 0.7, 0.65]
train_ents, valid_ents = ["e1"], ["e2", "e3"]
seed = 42
c_fp, c_fn = 1, 5

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

def rule_preds(X, thr=1.0):
    return [int(v >= thr) for v in X]

def stump_preds(X, thr):
    return [int(v >= thr) for v in X]

def accuracy(y_true, y_pred):
    return round(sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true), 3)

def pred_cost(y_true, y_pred, c_fp=1, c_fn=5):
    cost = 0
    for yt, yp in zip(y_true, y_pred):
        if yp == 1 and yt == 0:
            cost += c_fp
        if yp == 0 and yt == 1:
            cost += c_fn
    return cost

def mean_fold(folds):
    return round(sum(folds) / len(folds), 3)

if __name__ == "__main__":
    frame = frame_task("entity_pair", "needs_review_7d", 7)
    assert frame["fraud_name"] is False and frame["horizon"] == 7

    dummy_acc, dummy_cost, has_baseline = dummy_acc_and_cost(y, c_fp, c_fn)
    r_pred = rule_preds(x, thr=1.0)
    rule_acc = accuracy(y, r_pred)
    thr = 0.9  # DEFECT: umbral demasiado alto — elígelo tú para este fixture
    preds = stump_preds(x, thr)
    model_acc = accuracy(y, preds)
    model_cost = pred_cost(y, preds, c_fp, c_fn)
    beats_dummy = model_acc > dummy_acc
    beats_rule = model_acc > rule_acc
    run = {
        "run_id": "run-caso-lim-033",
        "params": {"seed": seed, "thr": thr, "depth_unlimited": False},
        "metrics": {"accuracy": model_acc, "cost": model_cost},
        "beats_dummy": beats_dummy,
        "beats_rule": beats_rule,
    }
    n_groups = len(set(entities))
    disjoint = set(train_ents).isdisjoint(set(valid_ents))
    print("frame", frame)
    print("dummy_acc", dummy_acc, "dummy_cost", dummy_cost, "rule_acc", rule_acc)
    print("model_acc", model_acc, "model_cost", model_cost)
    print("beats_dummy", beats_dummy, "beats_rule", beats_rule)
    print("run_keys", sorted(run.keys()))
    print("n_groups", n_groups, "mean_fold", mean_fold(fold_scores), "disjoint", disjoint)
`,
    portfolioNote:
      "Primero dual baseline (dummy y regla); el portafolio debe incluir run log (params/metrics/beats_dummy/beats_rule), costo de cola y group CV con disyunción de entidades. Un beats_dummy=False o beats_rule=False bien documentado es válido. En el README: por qué el thr elegido prioriza de forma sensata sin convertir el score en veredicto de fraude, y al menos un print o assert de disyunción train/valid.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras — dual baseline documentado, seed en params, o disyunción de entidades? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, prevalencias distintas)? (3) Escribe en el README una frase de impacto medible (p. ej. «regla acc X vs. stump Y; beats_rule=Z») que puedas defender en 30 segundos sin overclaim de fraude.",
    rubric: [
      { criterion: "Framing unit/target/horizon + baseline dummy y regla documentados", weight: "25%" },
      { criterion: "Correctitud técnica: dummy, regla, modelo, costo y métricas calculados (no hardcode)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (gap, missing, adverso, leak de entidad)", weight: "15%" },
      { criterion: "Código legible y límites claros (depth, seed, penalty L2 si aplica)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "beats_dummy + beats_rule + group CV con disyunción + seed en params", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El target del workbench debe:",
        options: ["Ser needs_review con horizonte", "Llamarse is_fraud", "Omitir unidad", "Ignorar prevalencia"],
        correctIndex: 0,
        explanation:
          "needs_review_* con horizonte y unidad cierra el problema de cola sin auto-etiqueta de fraude. is_fraud es breach de producto; sin prevalencia el dummy engaña.",
      },
      {
        question: "Antes del modelo ML conviene:",
        options: ["Solo deep learning", "Borrar features", "Dummy/regla y costos", "Cambiar el thr a 0"],
        correctIndex: 2,
        explanation:
          "Rules of ML: baseline (dummy o regla) y costos FP/FN demuestran si el ML agrega valor real a la cola antes de subir complejidad.",
      },
      {
        question: "Comparar coeficientes exige:",
        options: ["Features sin escala", "SHAP obligatorio", "Depth ilimitada", "Features scaled y causal=False"],
        correctIndex: 3,
        explanation:
          "Sin scaling (p. ej. amount_z de S32) los |coef| no son comparables; el signo no prueba causa social ni fraude. SHAP se reserva a S35.",
      },
      {
        question: "Group CV por entidad evita:",
        options: ["Usar métricas", "Leakage de la misma entidad entre folds", "Registrar runs", "Fijar seed"],
        correctIndex: 1,
        explanation:
          "Si la misma entidad cae en train y valid, el modelo “recuerda” al par y las métricas se inflan. random_split=True con entidades repetidas es breach.",
      },
      {
        question: "Un run con beats_dummy=False y metrics completas es…",
        options: ["Válido si está bien logueado: la comparación honesta incluye derrotas", "Inválido: solo se loguean victorias", "Obligatorio rechazarlo con REJECT_UNLOGGED_RUN", "Señal de usar target fraud"],
        correctIndex: 0,
        explanation:
          "Tracking responsable registra también cuando el modelo no supera al dummy; no se exige beats_dummy=True para validar el log. REJECT_UNLOGGED_RUN es para metrics vacías o run_id vacío.",
      },
      {
        question: "¿Qué evidencia documenta que el modelo usó regularización L2?",
        options: ["Que Σw² (l2_sq) sea mayor que cero", "Que accuracy supere al dummy", "La configuración de entrenamiento: penalty=\"l2\" y la fuerza (C o λ) en el log", "Que el umbral thr sea 0.5"],
        correctIndex: 2,
        explanation:
          "l2_sq=Σw² solo describe la magnitud de un vector de pesos; un modelo sin L2 también puede tener pesos no nulos. La evidencia de regularización es la config del fit (penalty y fuerza) registrada en params.",
      },
      {
        question: "Para promocionar un modelo en el workbench, ¿contra qué ancla conviene compararlo?",
        options: ["Solo contra el dummy majority", "Solo contra deep learning", "Contra thr=0 sin baseline", "Contra el dummy y la regla determinista (el mejor baseline simple), idealmente también por costo"],
        correctIndex: 3,
        explanation:
          "Ganar solo al dummy no basta si una regla simple ya es mejor. Documenta beats_dummy y beats_rule (y costo cuando FP/FN son asimétricos) antes de subir complejidad.",
      },
      {
        question: "Evalúas un modelo que predice la carga de revisión de la próxima semana y usas un split aleatorio. ¿Cuál es el problema de fondo?",
        options: ["Un split aleatorio siempre deja folds desbalanceados", "Observaciones posteriores entran al train, así que el ensayo usa información que el sistema real no tendría en el momento de predecir", "Los modelos no pueden entrenarse con datos ordenados por fecha", "El MAE deja de ser comparable entre folds de distinto tamaño"],
        correctIndex: 1,
        explanation:
          "La validación debe reproducir la restricción de información del problema real: el lunes, los casos del viernes todavía no existen. Un split aleatorio deja que marzo enseñe a predecir febrero; Python no se queja y el score hasta mejora, pero mide un problema que producción nunca podrá resolver así. El desbalance de folds es otro tema, y sí se puede entrenar con datos ordenados — de hecho es lo que exige el origen móvil.",
      },
      {
        question: "Sobre la misma serie, el baseline estacional promedia MAE 1.10 y el ingenuo de “ayer” 3.86. Tu candidato saca 1.05. ¿Qué reportas?",
        options: ["Que apenas mejora al baseline estacional, y que compararlo contra el de “ayer” exageraría su aporte", "Que el candidato es más de tres veces mejor que el baseline", "Que el baseline estacional debe descartarse por ser demasiado exigente", "Que con un MAE de 1.05 el modelo ya está listo para producción"],
        correctIndex: 0,
        explanation:
          "El rival correcto es el mejor baseline simple disponible, no el más fácil de ganar. Contra el estacional la mejora es de 0.05 casos por día — real, pero pequeña frente al costo de mantener un modelo. Elegir el baseline débil no hace mejor al candidato: solo le regala el crédito de haber aprendido el día de la semana.",
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
