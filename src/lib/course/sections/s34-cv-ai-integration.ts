import type { CourseSection } from '../../types'

export const section34: CourseSection = {
  id: "cv-ai-integration",
  index: 34,
  title: "Métricas, desbalance, calibración y umbrales",
  shortTitle: "Métricas y umbrales",
  tagline:
    "De scores del baseline a una cola humana calibrada: métricas honestas, thr versionado y abstención — nunca auto-fraude",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "Gauge",
  accentColor: "bg-gradient-to-br from-fuchsia-500 to-purple-900",
  jobRelevance:
    "En un equipo de investigación de relaciones (fintech, compliance o riesgo de crédito en LatAm), el baseline de S33 ya produce **scores de priorización**. El paso que separa un notebook de un producto operable es convertir esos scores en una **cola de revisión humana** con métricas honestas bajo desbalance, calibración fuera de muestra y umbrales versionados por costo y capacidad del equipo. Cierras **CP-N3-B** del **Relationship Investigation Workbench** (Red Andina, ficticia): precision/recall de la cola — **nunca** auto-etiqueta de fraude. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.",
  learningOutcomes: [
    {
      text: "Calcular matriz de confusión completa (TP/FP/FN/TN), precision, recall, F1 y average precision de ranking cuando la clase positiva es rara",
    },
    {
      text: "Medir precision@k y recall@k de una cola ordenada y detectar overload frente a la capacidad diaria de analistas",
    },
    {
      text: "Aplicar class weights o resampling solo dentro del fold de train y documentar la política CV-safe (test intacto)",
    },
    {
      text: "Reportar prevalencia (base rate) junto a P/R y rechazar accuracy como única métrica bajo desbalance",
    },
    {
      text: "Calcular Brier medio sobre un conjunto y un bin de reliability (mean_p vs frecuencia observada)",
    },
    {
      text: "Aplicar un calibrador afín (esqueleto didáctico de Platt) solo sobre holdout versionado, nunca sobre el test final",
    },
    {
      text: "Elegir umbral thr-vN buscando candidatos por costo (c_fp, c_fn) sujeto a capacidad de revisión",
    },
    {
      text: "Implementar banda de abstención (skip / abstain / review) y no forzar etiqueta 0/1 en zona gris",
    },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-B: de scores a cola de revisión humana",
      paragraphs: [
        "Esta sección **cierra CP-N3-B**. En S31 armaste el grafo de relaciones, en S32 las features de evidencia y en S33 un baseline responsable que ya produce un número por caso. Hoy ese número deja de vivir en un notebook: se convierte en una **cola de revisión humana** — un ranking con métricas honestas, calibración fuera de muestra y umbrales versionados por costo y capacidad. Sin esa capa, el score es decoración: no prioriza a nadie de forma auditable.",
        "Imagina el mini-tablero sintético `CASO-LIM-034` en Red Andina (ficticia): cinco scores `[0.1, 0.4, 0.55, 0.6, 0.9]` y etiquetas `needs_review` `[0, 0, 1, 0, 1]`. Es el mismo hilo de punta a punta. En T1 mides confusión, F1 y la calidad del ranking; en T2 enfrentas el desbalance y la prevalencia; en T3 preguntas si el score se comporta como probabilidad útil (Brier y reliability); en T4 eliges thr-v1 bajo capacidad y dejas la zona gris en **abstain**. Nunca imprimes `fraud=true`: el score solo ordena trabajo humano.",
        "Mapa mental: **T1** confusión y ranking → **T2** desbalance y prevalencia → **T3** Brier y calibrador en holdout → **T4** umbral por costo/capacidad y banda de abstención. Esta lección es de **evaluación y umbrales de cola**, no de visión por computador. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude. Solo datos sintéticos.",
        "Glosario del workbench (códigos de política, no de Python): `REJECT_*` = la evidencia está completa pero **rompe** la política (accuracy sola, resample global, thr sin versionar, forzar label en banda). `REQUEST_*` = **falta** un campo necesario (counts, capacidad, base rate, set de calibración). Regla de oro: no inventes evidencia y no auto-etiquetes fraude. Cuando falte un dato, pides; cuando la política se rompe, rechazas.",
      ],
      callout: {
        type: "info",
        title: "Cierre CP-N3-B — promesa del día",
        content:
          "Ranking calibrado para humanos. Matching ≠ parentesco ni fraude. Sin PII real. REJECT_*/REQUEST_* son políticas de cola del workbench (no de visión por computador). Al final del You Do tendrás un reporte con confusión, precision@k, Brier, thr-v* y abstain.",
      },
    },
    {
      heading: "Matriz de confusión, precision, recall y F1",
      subtopicId: "S34-T1-A",
      paragraphs: [
        "Con **desbalance**, un solo porcentaje de aciertos (accuracy) engaña: si casi nadie necesita revisión, predecir siempre «no revisar» luce genial en el dashboard y no prioriza a nadie. Piensa en la cola como un filtro de calidad, no como un concurso de aciertos globales. **Precision** responde: de lo que mandas a cola, ¿cuánto era realmente positivo? **Recall** responde: de los positivos reales, ¿cuántos atrapaste? **F1** es la media armónica de ambos: castiga cuando uno de los dos se desploma. Cuando el costo de un FN pesa más que el de un FP (perder un caso que sí merecía revisión), la familia se generaliza a **Fβ** con β>1; en el workbench anclamos en F1 y dejamos el desbalance de costos al umbral versionado de T4.",
        "Operación concreta: a partir de `y` (verdad) y `pred` (decisión binaria) cuentas la matriz completa **TP, FP, FN y TN**. Luego `P = TP/(TP+FP)`, `R = TP/(TP+FN)`, `F1 = 2·P·R/(P+R)` (con cuidado de ceros: si no hay predicciones positivas, P=0; si no hay positivos reales, R=0). **Average precision (AP)** resume el ranking sin fijar un thr: ordenas por score descendente y promedias la precision en cada positivo recuperado. Es el espíritu de la curva precision-recall (PR) y un proxy didáctico de PR-AUC — la brújula natural cuando la clase positiva es rara, a diferencia de ROC que se infla con muchos verdaderos negativos.",
        "Mini-caso `CASO-LIM-034`: con `y=[1,0]` y `pred=[1,1]` obtienes TP=1, FP=1, FN=0, TN=0 → P=0.5, R=1.0, F1≈0.667. Atrapaste el positivo, pero la mitad de la cola era ruido. El workbench trata costos de FP (cola ruidosa, horas de analista) y FN (miss operativo) por separado en T4. Si solo publicas accuracy, la política responde `REJECT_ACCURACY_ONLY`; si faltan counts, `REQUEST_CONFUSION`.",
      ],
      code: {
        language: "python",
        title: "confusion.py",
        code: `def confusion_counts(y, pred):
    tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
    fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
    fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
    tn = sum(a == 0 and b == 0 for a, b in zip(y, pred))
    return tp, fp, fn, tn

def precision_recall_f1(tp, fp, fn):
    p = tp / (tp + fp) if (tp + fp) else 0.0
    r = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * p * r / (p + r) if (p + r) else 0.0
    return p, r, f1

def average_precision(scores, labels):
    order = sorted(zip(scores, labels), key=lambda t: -t[0])
    hit, precs = 0, []
    for i, (_, y) in enumerate(order, 1):
        if y == 1:
            hit += 1
            precs.append(hit / i)
    return sum(precs) / len(precs) if precs else 0.0

tp, fp, fn, tn = confusion_counts([1, 0], [1, 1])
p, r, f1 = precision_recall_f1(tp, fp, fn)
ap = average_precision([0.9, 0.6, 0.4, 0.1], [1, 0, 1, 0])
print("tp_fp_fn_tn", (tp, fp, fn, tn))
print("p_r_f1", (round(p, 3), round(r, 3), round(f1, 3)))
print("ap", round(ap, 3))
print("accuracy_only", False)`,
        output: `tp_fp_fn_tn (1, 1, 0, 0)
p_r_f1 (0.5, 1.0, 0.667)
ap 0.833
accuracy_only False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Implementa confusión completa + P/R/F1 (y AP de ranking) antes de publicar accuracy. Breach → REJECT_ACCURACY_ONLY; sin counts → REQUEST_CONFUSION.",
      },
    },
    {
      heading: "Precision@k, recall@k y carga de revisión",
      subtopicId: "S34-T1-B",
      paragraphs: [
        "En un workbench de investigación de relaciones no revisas todo el universo: miras los **k primeros** del ranking, porque el equipo de analistas tiene un tope diario. **precision@k** es la fracción de positivos en ese top-k (calidad del recorte). **recall@k** es la fracción de *todos* los positivos reales capturados en ese top-k (cobertura). Una cola con precision@k alta pero que genera más alertas que personas puede «ganar» el notebook y perder el turno: la métrica de ranking y la **capacidad** viajan juntas.",
        "Para medirlos necesitas labels ya ordenados por score descendente, un entero `k` alineado a la capacidad del día y el total de positivos `n_pos` (sin él, recall@k no tiene denominador). El flag `overload = load > capacity` te dice cuándo el thr es inviable para el personal de revisión: no es un detalle de UX, es un breach operativo (`REJECT_QUEUE_OVERLOAD`). Si falta capacity en el reporte, el workbench pide `REQUEST_CAPACITY` en vez de inventar un default generoso.",
        "Con el top-3 sintético `[1,0,1]` obtienes precision@3 ≈ 0.667 y, si `n_pos=2`, recall@3 = 1.0: atrapaste todos los positivos del set, pero un tercio del top era ruido. Cincuenta alertas frente a capacidad 10 es overload: reevalúas thr o k. El score solo prioriza humanos; entity resolution o matching de identidad no prueba parentesco ni fraude.",
      ],
      code: {
        language: "python",
        title: "topk.py",
        code: `def precision_at_k(labels, k):
    return sum(labels[:k]) / k

def recall_at_k(labels, k, n_pos):
    return sum(labels[:k]) / n_pos if n_pos else 0.0

def queue_overload(load, cap):
    return load > cap

labels = [1, 0, 1]
print("precision_at_k", round(precision_at_k(labels, 3), 3))
print("recall_at_k", round(recall_at_k(labels, 3, n_pos=2), 3))
print("overload", queue_overload(50, 10))
print("fraud_label", False)`,
        output: `precision_at_k 0.667
recall_at_k 1.0
overload True
fraud_label False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Reporta precision@k y recall@k junto a capacidad. Si load > capacity → REJECT_QUEUE_OVERLOAD; sin capacidad → REQUEST_CAPACITY.",
      },
    },
    {
      heading: "Pesos de clase y resampling dentro de CV",
      subtopicId: "S34-T2-A",
      paragraphs: [
        "Cuando hay nueve negativos por cada positivo, el optimizador puede «aprender» a ignorar la minoría: el loss se minimiza prediciendo siempre la clase mayoritaria. **Class weights** (ratio simple `n0/n1` o mapa `{0: 1, 1: n0/n1}`) y **resampling** (oversample de la minoría o undersample de la mayoría) reequilibran la señal, pero solo si viven **dentro del fold de train**. Resamplear todo el dataset *antes* del cross-validation contamina la validación: el test «ve» copias sintéticas o un balance artificial y las métricas se inflan respecto a producción.",
        "Piensa cada fold como dos cajas: train y test. El plan honesto deja la caja de test intacta y aplica oversample o weights solo a train. En código, un esqueleto es `fold_plan(..., resample_global=False)` → `resample_train_only=True`, `test_untouched=True`. El flag `resample_global=True` es leakage de pipeline: no es un detalle de estilo, es un error de evaluación. El boceto de abajo simula un fold con índices de train y test: el rebalance solo toca train.",
        "Con `n0=9` y `n1=1` el weight ratio es 9.0 (división float en Python 3). Política del workbench: sin resample global y test sin tocar. Si alguien resamplea el dataset entero → `REJECT_LEAKY_RESAMPLE`. Si falta el conteo de minoría `n1` → `REQUEST_WEIGHTS` (no inventes un ratio).",
      ],
      code: {
        language: "python",
        title: "weights.py",
        code: `def weight_ratio(n0, n1):
    return n0 / n1

def fold_plan(n_train, n_test, resample_global):
    # Política CV-safe: rebalance solo en train; test intacto
    return {
        "resample_train_only": not resample_global,
        "test_untouched": True,
        "n_train": n_train,
        "n_test": n_test,
    }

def apply_rebalance_in_fold(train_idx, test_idx, resample_global):
    """Esqueleto: el rebalance toca train; test nunca se toca."""
    plan = fold_plan(len(train_idx), len(test_idx), resample_global)
    rebalanced_train = list(train_idx)  # aquí iría oversample/weights
    untouched_test = list(test_idx)
    return plan, rebalanced_train, untouched_test

print("weight_ratio", weight_ratio(9, 1))
print("plan", fold_plan(80, 20, resample_global=False))
train_i, test_i = list(range(80)), list(range(80, 100))
plan, tr, te = apply_rebalance_in_fold(train_i, test_i, False)
print("test_len", len(te), "cv_safe", plan["resample_train_only"] and plan["test_untouched"])
print("resample_global", False)`,
        output: `weight_ratio 9.0
plan {'resample_train_only': True, 'test_untouched': True, 'n_train': 80, 'n_test': 20}
test_len 20 cv_safe True
resample_global False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Weights o resample solo en el train del fold; dibuja train/test antes de rebalancear. Resample global → REJECT_LEAKY_RESAMPLE; sin n1 → REQUEST_WEIGHTS.",
      },
    },
    {
      heading: "Prevalencia y métricas engañosas",
      subtopicId: "S34-T2-B",
      paragraphs: [
        "La **prevalencia** (base rate) es la fracción de positivos en la población que miras. Si cae de un trimestre a otro, la misma especificidad del modelo produce peor precision: aparecen más falsos positivos relativos a los verdaderos positivos. Un clasificador **all-negative** (siempre «no revisar») luce genial en accuracy cuando la clase positiva es rara — y no prioriza ninguna cola. Es el truco más barato del dashboard y el más caro en operación.",
        "Por eso el workbench exige reportar prevalencia **junto** a P/R. Comparar precision entre Q1 y Q2 sin base rate es comparar manzanas con naranjas: un modelo «peor» puede parecer ganador si la prevalencia cambió. Marcar `accuracy_enough=True` con prevalencia baja es ceguera de producto; la política responde `REJECT_PREVALENCE_BLIND`. Si falta la base rate en el reporte → `REQUEST_BASE_RATE`.",
        "Ejemplo sintético del tablero: 25 positivos de 1000 → prevalencia 0.025; accuracy all-neg ≈ 0.975 engaña al panel ejecutivo. Preferimos la familia PR, precision@k bajo capacidad y la carga real de cola. Cuando presentes resultados a compliance o a producto, di en voz alta la prevalencia antes de la precision: es el ancla de interpretación.",
      ],
      code: {
        language: "python",
        title: "prevalence.py",
        code: `def prevalence(pos, n):
    return pos / n

def all_neg_accuracy(prev):
    return 1 - prev

print("prevalence", prevalence(25, 1000))
print("all_neg_acc", round(all_neg_accuracy(0.025), 3))
print("accuracy_enough", False)`,
        output: `prevalence 0.025
all_neg_acc 0.975
accuracy_enough False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Publica la prevalencia junto a P/R. Si accuracy_enough=True bajo prev baja → REJECT_PREVALENCE_BLIND; sin prev → REQUEST_BASE_RATE.",
      },
    },
    {
      heading: "Curvas de reliability y Brier",
      subtopicId: "S34-T3-A",
      paragraphs: [
        "Un score de 0.8 no «es» 80 % de culpa ni de parentesco: es una señal de **priorización** para la cola. Si quieres leerlo como probabilidad útil («de cada 10 casos con ~0.8, ¿cuántos resultaron positivos?»), necesitas calibración. **Brier** promedia `(p − y)²` sobre el conjunto: más bajo es mejor entre modelos comparables. **Reliability** agrupa scores en bins y contrasta la media de `p` con la frecuencia observada de y=1. Si mean_p=0.8 y freq=0.5, el bin miente: el modelo se sobreconfía.",
        "No basta un punto perfecto (`p=1, y=1` → Brier 0 en un solo caso). Calculas Brier **medio** sobre el set y al menos un bin. Un Brier bajo con bins desalineados, o bins perfectos con Brier alto, cuentan historias distintas (calibración vs discriminación). Evaluar reliability «a ojo» sobre el mismo set con el que ajustaste un calibrador es autoengaño: la medición va sobre datos no usados para el fit (T3-B).",
        "`CASO-LIM-034` (mini-set de calibración): scores `[0.1,0.2,0.8,0.9]` y labels `[0,0,0,1]` → Brier medio 0.175; bin `[0.7,1.0)` da mean_p=0.85 y freq=0.5 → no calibrado. Breach → `REJECT_UNCALIBRATED`. Sin scores/Brier en el reporte → `REQUEST_BRIER`.",
      ],
      code: {
        language: "python",
        title: "brier.py",
        code: `def brier_mean(ps, ys):
    return sum((p - y) ** 2 for p, y in zip(ps, ys)) / len(ps)

def reliability_bin(ps, ys, lo, hi):
    pair = [(p, y) for p, y in zip(ps, ys) if lo <= p < hi]
    if not pair:
        return None
    mean_p = sum(p for p, _ in pair) / len(pair)
    freq = sum(y for _, y in pair) / len(pair)
    return mean_p, freq

ps = [0.1, 0.2, 0.8, 0.9]
ys = [0, 0, 0, 1]
mean_p, freq = reliability_bin(ps, ys, 0.7, 1.0)
print("brier", round(brier_mean(ps, ys), 3))
print("mean_p", round(mean_p, 2), "freq", freq)
print("calibrated", abs(mean_p - freq) <= 0.1)`,
        output: `brier 0.175
mean_p 0.85 freq 0.5
calibrated False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "S34-T3-A: calcula Brier medio y al menos un bin (mean_p vs freq). Breach → REJECT_UNCALIBRATED; falta scores → REQUEST_BRIER.",
      },
    },
    {
      heading: "Calibradores y evaluación fuera de muestra",
      subtopicId: "S34-T3-B",
      paragraphs: [
        "**Platt scaling** (regresión logística del score crudo hacia probabilidad) e **isotonic regression** (mapa monótono no paramétrico) se ajustan en un set de calibración **distinto** del train del modelo base. En producción verás `CalibratedClassifierCV` en sklearn; aquí usamos un **mapa afín** `clip(a·raw + b)` como esqueleto didáctico de Platt: los coeficientes `a, b` se «ajustan» solo con el holdout versionado (`holdout_v1`), nunca con el test final del reporte.",
        "Clip a `[0,1]` es un pre-paso de rango, **no** es calibración por sí solo: no aprende la relación entre score y frecuencia observada. El contrato del workbench exige: (1) set nombrado que empiece por `holdout`, (2) misma longitud raw/cal, (3) evaluación de Brier/reliability en un split no usado para fit. `calibrator_set=train_in_sample` activa `REJECT_IN_SAMPLE_CAL`; sin set → `REQUEST_CAL_SET`.",
        "`CASO-LIM-034`: raw `[1.5, -0.2, 0.4]` con `a=0.8`, `b=0.1` (coeficientes ficticios de holdout_v1) → `[1.0, 0.0, 0.42]`. En el portafolio documenta: *dónde se ajustó el calibrador* y *dónde se midió Brier*. Esa frase evita training-serving skew de probabilidades cuando el thr de T4 se elige sobre scores «calibrados».",
      ],
      code: {
        language: "python",
        title: "calibrator.py",
        code: `def calibrate_affine(raw, a, b):
    """Mapa afín + clip: esqueleto didáctico de Platt en holdout."""
    return [round(min(1.0, max(0.0, a * x + b)), 2) for x in raw]

raw = [1.5, -0.2, 0.4]
# a, b «ajustados» solo en holdout_v1 (no en test)
cal = calibrate_affine(raw, a=0.8, b=0.1)
print(cal)
print("calibrator_set", "holdout_v1")
print("same_len", len(raw) == len(cal))`,
        output: `[1.0, 0.0, 0.42]
calibrator_set holdout_v1
same_len True`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "S34-T3-B: ajusta el mapa afín solo en holdout versionado; mide Brier fuera de ese set. Breach → REJECT_IN_SAMPLE_CAL; falta set → REQUEST_CAL_SET. Clip ≠ calibración completa.",
      },
    },
    {
      heading: "Umbral por costo y capacidad de revisión",
      subtopicId: "S34-T4-A",
      paragraphs: [
        "El **umbral** no es el default 0.5 de la librería ni un número «mágico» del modelo: es una **decisión de producto**. Se elige por **costo** (`fp·c_fp + fn·c_fn`) y por **capacidad** de la cola (cuántos casos puede revisar el equipo hoy). Se **versiona** (`thr-v1`, `thr-v2`) para auditoría y rollback cuando cambian costos, headcount o prevalencia. Un thr fijo sin matriz de costos es `REJECT_FIXED_THR`; sin costos documentados → `REQUEST_COST_MATRIX`.",
        "Procedimiento honesto: para cada thr candidato (p. ej. valores únicos de score), predices `s >= thr`, descartas candidatos con `n_review > capacity` o `n_review == 0`, calculas costo y te quedas con el de menor costo. Documentas thr_id, n_review y la matriz de costos. Si c_fn sube (un miss es más caro), el thr óptimo suele bajar: mandas más casos a cola. Si la capacidad cae, el thr suele subir: priorizas menos volumen y más precisión operativa.",
        "Demo de cuatro puntos `CASO-LIM-034`: scores `[0.1,0.4,0.6,0.9]`, labels `[0,0,1,1]`, `c_fp=2`, `c_fn=10`, capacidad 2 → thr óptimo 0.6, n_review=2, costo 0, thr_id `thr-v1`. En el You Do de cinco puntos con capacity 2 el óptimo puede ser **otro** thr: no copies 0.6 de memoria; corre la búsqueda.",
      ],
      code: {
        language: "python",
        title: "threshold.py",
        code: `def choose_thr(scores, labels, c_fp, c_fn, capacity):
    best_thr, best_cost = None, float("inf")
    for thr in sorted(set(scores)):
        pred = [1 if s >= thr else 0 for s in scores]
        n_review = sum(pred)
        if n_review > capacity or n_review == 0:
            continue
        fp = sum(p == 1 and y == 0 for p, y in zip(pred, labels))
        fn = sum(p == 0 and y == 1 for p, y in zip(pred, labels))
        cost = fp * c_fp + fn * c_fn
        if cost < best_cost:
            best_thr, best_cost = thr, cost
    return best_thr, best_cost

scores = [0.1, 0.4, 0.6, 0.9]
labels = [0, 0, 1, 1]
thr, cost = choose_thr(scores, labels, c_fp=2, c_fn=10, capacity=2)
n_review = sum(1 for s in scores if s >= thr)
print("thr", thr, "n_review", n_review)
print("cost", cost)
print("thr_id", "thr-v1")`,
        output: `thr 0.6 n_review 2
cost 0
thr_id thr-v1`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "Busca thr por costo bajo capacidad y versiona thr-vN. thr fijo o sin costos → REJECT_FIXED_THR / REQUEST_COST_MATRIX.",
      },
    },
    {
      heading: "Abstención, slices y sensibilidad",
      subtopicId: "S34-T4-B",
      paragraphs: [
        "Entre «claramente no revisar» y «claramente revisar» hay una **banda gris**. Forzar 0/1 ahí fabrica confianza falsa: el sistema parece decisivo y en realidad está adivinando. La política `decide(score)` devuelve `skip` (bajo low), `review` (sobre high) o `abstain` (en banda). Abstener es salida de **primera clase**, no un error del pipeline: protege al sujeto investigado y al analista de un thr frágil.",
        "Además, antes de promover el thr conviene mirar **sensibilidad** (cuántos casos cambian de decisión al mover low/high o el thr 0.5→0.6) y métricas **por slice** (cohorte, región sintética, tipo de edge del grafo de S31). Un thr que luce bien en global y se rompe en un slice es una deuda de equidad y de producto. Nunca conviertas el score en auto-fraude ni en prueba de parentesco.",
        "`CASO-LIM-034`: score 0.5 (o 0.55 en el You Do) con low=0.3 y high=0.7 → `abstain`. `decision=force_1` en banda activa `REJECT_FORCE_LABEL`. Sin low/high documentados → `REQUEST_ABSTAIN_BAND`. Así cierras el arco: ranking para humanos, no veredicto automático.",
      ],
      code: {
        language: "python",
        title: "abstain.py",
        code: `def decide(score, low=0.3, high=0.7):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "abstain"

def thr_sensitivity(scores, thr_a, thr_b):
    """Cuántos casos cambian de lado al mover el thr (sensibilidad)."""
    pred_a = [1 if s >= thr_a else 0 for s in scores]
    pred_b = [1 if s >= thr_b else 0 for s in scores]
    return sum(a != b for a, b in zip(pred_a, pred_b))

print(decide(0.5))
print(decide(0.15))
print(decide(0.9))
print("n_flip_0.5_to_0.6", thr_sensitivity([0.1, 0.4, 0.55, 0.6, 0.9], 0.5, 0.6))
print("force_label", False)`,
        output: `abstain
skip
review
n_flip_0.5_to_0.6 1
force_label False`,
      },
      callout: {
        type: "tip",
        title: "Qué escribir ahora",
        content:
          "En banda gris devuelve abstain (no force 0/1). Mide sensibilidad al mover thr. Forzar label → REJECT_FORCE_LABEL; sin low/high → REQUEST_ABSTAIN_BAND.",
      },
    },
  ],
  iDo: {
    intro:
      "Te muestro, paso a paso, cómo el workbench de Red Andina convierte el mini-set `CASO-LIM-034` en números auditables: confusión y F1, precision@k / recall@k, pesos CV-safe, prevalencia, Brier y bin de reliability, calibración afín en holdout, thr por costo bajo capacidad y decide() con abstain. Observa el cálculo — no solo el print final — porque en We Do repararás el mismo tipo de defecto.",
    steps: [
      {
        demoId: "S34-T1-A-DEMO",
        subtopicId: "S34-T1-A",
        environment: "local-python",
        description:
          "Matriz completa TP/FP/FN/TN, F1 y average precision de ranking; rechaza accuracy como única métrica.",
        code: {
          language: "python",
          title: "cm_demo.py",
          code: `def confusion_counts(y, pred):
    tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
    fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
    fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
    tn = sum(a == 0 and b == 0 for a, b in zip(y, pred))
    return tp, fp, fn, tn

def f1(tp, fp, fn):
    p = tp / (tp + fp) if (tp + fp) else 0.0
    r = tp / (tp + fn) if (tp + fn) else 0.0
    return 2 * p * r / (p + r) if (p + r) else 0.0

def average_precision(scores, labels):
    order = sorted(zip(scores, labels), key=lambda t: -t[0])
    hit, precs = 0, []
    for i, (_, y) in enumerate(order, 1):
        if y == 1:
            hit += 1
            precs.append(hit / i)
    return sum(precs) / len(precs) if precs else 0.0

tp, fp, fn, tn = confusion_counts([1, 0], [1, 1])
print("tp_fp_fn_tn", (tp, fp, fn, tn))
print("f1", round(f1(tp, fp, fn), 3))
print("ap", round(average_precision([0.9, 0.6, 0.4, 0.1], [1, 0, 1, 0]), 3))
print("accuracy_only", False)`,
          output: `tp_fp_fn_tn (1, 1, 0, 0)
f1 0.667
ap 0.833
accuracy_only False`,
        },
        why: "La matriz completa y AP de ranking anclan P/R/F1 antes de elegir umbral de cola de revisión.",
      },
      {
        demoId: "S34-T1-B-DEMO",
        subtopicId: "S34-T1-B",
        environment: "local-python",
        description:
          "precision@k y recall@k del top-3; overload cuando alertas superan capacidad.",
        code: {
          language: "python",
          title: "topk_demo.py",
          code: `def precision_at_k(labels, k):
    return sum(labels[:k]) / k

def recall_at_k(labels, k, n_pos):
    return sum(labels[:k]) / n_pos if n_pos else 0.0

labels = [1, 0, 1]
print("precision_at_k", round(precision_at_k(labels, 3), 3))
print("recall_at_k", round(recall_at_k(labels, 3, 2), 3))
print("overload", 50 > 10)`,
          output: `precision_at_k 0.667
recall_at_k 1.0
overload True`,
        },
        why: "Top-k alinea ranking con la capacidad real del equipo de revisión en el workbench.",
      },
      {
        demoId: "S34-T2-A-DEMO",
        subtopicId: "S34-T2-A",
        environment: "local-python",
        description:
          "Weight ratio n0/n1 y plan de fold con rebalance solo en train (test intacto).",
        code: {
          language: "python",
          title: "w_demo.py",
          code: `def weight_ratio(n0, n1):
    return n0 / n1

def fold_plan(resample_global):
    return {"resample_train_only": not resample_global, "test_untouched": True}

def rebalance_train_only(train_y, resample_global):
    # Esqueleto: aquí iría oversample; el test del fold no entra
    plan = fold_plan(resample_global)
    assert plan["test_untouched"] is True
    return plan, len(train_y)

print(weight_ratio(9, 1))
print(fold_plan(False))
print(rebalance_train_only([0] * 9 + [1], False))
print("resample_global", False)`,
          output: `9.0
{'resample_train_only': True, 'test_untouched': True}
({'resample_train_only': True, 'test_untouched': True}, 10)
resample_global False`,
        },
        why: "Pesos o resample solo en train del fold evitan leakage y métricas infladas en validación.",
      },
      {
        demoId: "S34-T2-B-DEMO",
        subtopicId: "S34-T2-B",
        environment: "local-python",
        description:
          "Prevalencia 0.025 y accuracy all-negative engañosa para la clase rara.",
        code: {
          language: "python",
          title: "prev_demo.py",
          code: `def prevalence(pos, n):
    return pos / n

print(prevalence(25, 1000))
print("all_neg_acc", round(1 - 0.025, 3))
print("accuracy_enough", False)`,
          output: `0.025
all_neg_acc 0.975
accuracy_enough False`,
        },
        why: "Sin base rate, precision no es comparable entre periodos ni entre slices.",
      },
      {
        demoId: "S34-T3-A-DEMO",
        subtopicId: "S34-T3-A",
        environment: "local-python",
        description:
          "Brier medio sobre un mini-set y bin de reliability desalineado.",
        code: {
          language: "python",
          title: "brier_demo.py",
          code: `def brier_mean(ps, ys):
    return sum((p - y) ** 2 for p, y in zip(ps, ys)) / len(ps)

def reliability_bin(ps, ys, lo, hi):
    pair = [(p, y) for p, y in zip(ps, ys) if lo <= p < hi]
    mean_p = sum(p for p, _ in pair) / len(pair)
    freq = sum(y for _, y in pair) / len(pair)
    return mean_p, freq

ps, ys = [0.1, 0.2, 0.8, 0.9], [0, 0, 0, 1]
mean_p, freq = reliability_bin(ps, ys, 0.7, 1.0)
print("brier", round(brier_mean(ps, ys), 3))
print("bin", (round(mean_p, 2), freq))
print("calibrated", False)`,
          output: `brier 0.175
bin (0.85, 0.5)
calibrated False`,
        },
        why: "Brier y reliability dicen si el score se puede leer como probabilidad de priorización.",
      },
      {
        demoId: "S34-T3-B-DEMO",
        subtopicId: "S34-T3-B",
        environment: "local-python",
        description:
          "Mapa afín + clip ajustado en holdout_v1 (esqueleto de Platt), no in-sample.",
        code: {
          language: "python",
          title: "cal_demo.py",
          code: `def calibrate_affine(raw, a, b):
    return [round(min(1.0, max(0.0, a * x + b)), 2) for x in raw]

print(calibrate_affine([1.5, -0.2, 0.4], 0.8, 0.1))
print("calibrator_set", "holdout_v1")`,
          output: `[1.0, 0.0, 0.42]
calibrator_set holdout_v1`,
        },
        why: "Calibrar fuera de muestra evita autoengaño y training-serving skew de probabilidades.",
      },
      {
        demoId: "S34-T4-A-DEMO",
        subtopicId: "S34-T4-A",
        environment: "local-python",
        description:
          "Búsqueda de thr por costo bajo capacidad 2; thr-v1 documentado.",
        code: {
          language: "python",
          title: "thr_demo.py",
          code: `def choose_thr(scores, labels, c_fp, c_fn, capacity):
    best_thr, best_cost = None, float("inf")
    for thr in sorted(set(scores)):
        pred = [1 if s >= thr else 0 for s in scores]
        if sum(pred) > capacity or sum(pred) == 0:
            continue
        fp = sum(p == 1 and y == 0 for p, y in zip(pred, labels))
        fn = sum(p == 0 and y == 1 for p, y in zip(pred, labels))
        cost = fp * c_fp + fn * c_fn
        if cost < best_cost:
            best_thr, best_cost = thr, cost
    return best_thr, best_cost

thr, cost = choose_thr([0.1, 0.4, 0.6, 0.9], [0, 0, 1, 1], 2, 10, 2)
print("thr", thr, "cost", cost)
print("thr_id", "thr-v1")`,
          output: `thr 0.6 cost 0
thr_id thr-v1`,
        },
        why: "El thr se elige por costo y capacidad y se versiona para auditoría del workbench.",
      },
      {
        demoId: "S34-T4-B-DEMO",
        subtopicId: "S34-T4-B",
        environment: "local-python",
        description:
          "Decisión abstain en banda gris 0.3–0.7 y sensibilidad al mover thr; sin forzar label 0/1.",
        code: {
          language: "python",
          title: "abs_demo.py",
          code: `def decide(score, low=0.3, high=0.7):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "abstain"

def thr_sensitivity(scores, thr_a, thr_b):
    pred_a = [1 if s >= thr_a else 0 for s in scores]
    pred_b = [1 if s >= thr_b else 0 for s in scores]
    return sum(a != b for a, b in zip(pred_a, pred_b))

print(decide(0.5))
print("n_flip", thr_sensitivity([0.1, 0.4, 0.55, 0.6, 0.9], 0.5, 0.6))
print("force_label", False)`,
          output: `abstain
n_flip 1
force_label False`,
        },
        why: "La abstención es salida de primera clase; la sensibilidad al thr evita promover un corte frágil.",
      },
    ],
  },
  weDo: {
    intro:
      "Ahora te toca operar el Relationship Investigation Workbench sobre `CASO-LIM-034` (Red Andina, sintético) y cerrar **CP-N3-B**. En cada unidad practicas el cálculo de la métrica o la política de decisión (E1), triages un fixture válido frente a uno adverso y uno incompleto (E2), y cierras fail-closed con CONTINUE / REJECT_* / REQUEST_* (E3). Los fixtures usan case_id peruanos sintéticos; no hay PII real ni auto-fraude: el score solo prioriza revisión humana.",
    steps: [
      {
        id: "S34-T1-A-E1",
        subtopicId: "S34-T1-A",
        kind: "guided",
        instruction:
          "S34-T1-A-E1 · Sobre `CASO-LIM-034-1A`, calcula TP/FP/FN a partir de `y=[1,0]` y `pred=[1,1]`, luego precision, recall y **F1**. El starter usa `f1 = p + r` (suma, no media armónica): corrige la fórmula. Imprime `S34-T1-A PASS` solo si `|f1 − 2/3| < 1e-9`; si no, `REJECT_ACCURACY_ONLY`. No cambies y/pred.",
        hint: "F1 = 2·P·R / (P+R) cuando P+R > 0; con P=0.5 y R=1.0 debe dar 2/3.",
        hints: [
          "F1 = 2·P·R / (P+R) cuando P+R > 0; con P=0.5 y R=1.0 debe dar 2/3.",
          "Primero cuenta TP/FP/FN con zip; luego P y R; al final la media armónica — no la suma.",
        ],
        edgeCases: [
          "falta tp o divisiones por cero en P/R",
          "fixture adverso: accuracy_only=True o counts todos en cero",
          "CASO-LIM-034-1A es sintético",
        ],
        tests: "Con y/pred del starter, F1 correcto → `S34-T1-A PASS` y assert True.",
        feedback:
          "S34-T1-A-E1: ¿qué fórmula usaste para F1 y por qué la suma p+r no es una media armónica? Anota P, R y F1 obtenidos.",
        starterCode: {
          language: "python",
          title: "s34-t1-a-e1.py",
          code: `# CASO-LIM-034-1A · F1 (media armónica)
# DEFECT: f1 = p + r (suma, no armónica)
y, pred = [1, 0], [1, 1]
tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
p = tp / (tp + fp) if (tp + fp) else 0.0
r = tp / (tp + fn) if (tp + fn) else 0.0
f1 = p + r  # DEFECT
ok = abs(f1 - 2 / 3) < 1e-9
status = "PASS" if ok else "REJECT_ACCURACY_ONLY"
print("S34-T1-A", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-a-e1.py",
          code: `y, pred = [1, 0], [1, 1]
tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
p = tp / (tp + fp) if (tp + fp) else 0.0
r = tp / (tp + fn) if (tp + fn) else 0.0
f1 = 2 * p * r / (p + r) if (p + r) else 0.0
ok = abs(f1 - 2 / 3) < 1e-9
status = "PASS" if ok else "REJECT_ACCURACY_ONLY"
print("S34-T1-A", status)
assert ok is True
`,
          output: `S34-T1-A PASS`,
        },
      },
      {
        id: "S34-T1-A-E2",
        subtopicId: "S34-T1-A",
        kind: "independent",
        instruction:
          "S34-T1-A-E2 · Tres rutas de política de confusión en la cola de Red Andina: fixture válido (counts > 0, accuracy_only=False, región sintética), adverso (accuracy_only=True o counts cero) y sin `tp`. Salidas exactas: `PASS`, `REJECT_ACCURACY_ONLY`, `MISSING:tp`. Corrige solo el predicado de dominio; respeta la rama missing antes de leer campos.",
        hint: "Primero `missing`; después exige accuracy_only is False y suma de counts ≥ 1.",
        hints: [
          "Primero `missing`; después exige accuracy_only is False y suma de counts ≥ 1.",
          "El adverso debe fallar por contenido (accuracy_only o counts), no por schema; region/team son contexto, no gates.",
        ],
        edgeCases: [
          "falta tp",
          "fixture adverso: accuracy_only=True o counts todos en cero",
          "CASO-LIM-034-1A es sintético",
        ],
        tests: "Salida exacta: `PASS REJECT_ACCURACY_ONLY MISSING:tp`.",
        feedback:
          "S34-T1-A-E2: ordena las tres rutas (válido / adverso / missing) y di qué campo del adverso activa REJECT_ACCURACY_ONLY frente a un REQUEST_CONFUSION por ausencia. ¿Qué rol juegan region/team en el reporte vs en el predicado?",
        starterCode: {
          language: "python",
          title: "s34-t1-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_ACCURACY_ONLY
# DEFECT: PASS si accuracy_only True
def assess(record: dict) -> str:
    required = {"case_id", "tp", "fp", "fn", "accuracy_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_only"] is True else "REJECT_ACCURACY_ONLY"

valid = {
    "case_id": "CASO-LIM-034-1A",
    "tp": 1,
    "fp": 1,
    "fn": 0,
    "accuracy_only": False,
    "region": "Lima-sintetica",
    "team": "cola-relaciones",
}
invalid = {"case_id": "CASO-LIM-034-1A", "tp": 0, "fp": 0, "fn": 0, "accuracy_only": True}
incomplete = {**valid}
incomplete.pop("tp")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "tp", "fp", "fn", "accuracy_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["accuracy_only"] is False and record["tp"] + record["fp"] + record["fn"] >= 1
    return "PASS" if ok else "REJECT_ACCURACY_ONLY"

valid = {
    "case_id": "CASO-LIM-034-1A",
    "tp": 1,
    "fp": 1,
    "fn": 0,
    "accuracy_only": False,
    "region": "Lima-sintetica",
    "team": "cola-relaciones",
}
invalid = {"case_id": "CASO-LIM-034-1A", "tp": 0, "fp": 0, "fn": 0, "accuracy_only": True}
incomplete = {**valid}
incomplete.pop("tp")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_ACCURACY_ONLY MISSING:tp`,
        },
      },
      {
        id: "S34-T1-A-E3",
        subtopicId: "S34-T1-A",
        kind: "transfer",
        instruction:
          "S34-T1-A-E3 · Fail-closed del workbench de Red Andina: válido → `CONTINUE`, adverso → `REJECT_ACCURACY_ONLY`, sin `tp` → `REQUEST_CONFUSION` (no CONTINUE). El starter confunde missing con CONTINUE y tiene el predicado invertido: repara ambas ramas sin rellenar evidencia ni inventar counts.",
        hint: "Ausencia ≠ breach: REQUEST_CONFUSION antes de evaluar contenido.",
        hints: [
          "Ausencia ≠ breach: REQUEST_CONFUSION antes de evaluar contenido.",
          "Datos completos: CONTINUE solo si accuracy_only is False y hay al menos un count no nulo.",
        ],
        edgeCases: [
          "falta tp",
          "fixture adverso: accuracy_only=True o counts todos en cero",
          "CASO-LIM-034-1A es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_ACCURACY_ONLY REQUEST_CONFUSION`.",
        feedback:
          "S34-T1-A-E3: ¿por qué REQUEST_CONFUSION protege mejor que inventar tp=0? Relaciona fail-closed con no fabricar una matriz de confusión en un informe a compliance.",
        starterCode: {
          language: "python",
          title: "s34-t1-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_ACCURACY_ONLY
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "tp", "fp", "fn", "accuracy_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["accuracy_only"] is True else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", "tp": 1, "fp": 1, "fn": 0, "accuracy_only": False}
invalid = {"case_id": "CASO-LIM-034-1A", "tp": 0, "fp": 0, "fn": 0, "accuracy_only": True}
uncertain = {**valid}
uncertain.pop("tp")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "tp", "fp", "fn", "accuracy_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CONFUSION"
    ok = record["accuracy_only"] is False and record["tp"] + record["fp"] + record["fn"] >= 1
    return "CONTINUE" if ok else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", "tp": 1, "fp": 1, "fn": 0, "accuracy_only": False}
invalid = {"case_id": "CASO-LIM-034-1A", "tp": 0, "fp": 0, "fn": 0, "accuracy_only": True}
uncertain = {**valid}
uncertain.pop("tp")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_ACCURACY_ONLY", "REQUEST_CONFUSION"]
`,
          output: `CONTINUE REJECT_ACCURACY_ONLY REQUEST_CONFUSION`,
        },
      },
      {
        id: "S34-T1-B-E1",
        subtopicId: "S34-T1-B",
        kind: "guided",
        instruction:
          "S34-T1-B-E1 · Calcula precision@k y recall@k sobre labels top ordenados `[1,0,1]` con k=3 y n_pos=2. El starter divide mal recall (`/ k` en vez de `/ n_pos`). Corrige y marca PASS si precision≈0.667, recall=1.0 y load=8 ≤ capacity=10; si no, `REJECT_QUEUE_OVERLOAD`.",
        hint: "recall@k = sum(labels[:k]) / n_pos; precision@k = sum(labels[:k]) / k.",
        hints: [
          "recall@k = sum(labels[:k]) / n_pos; precision@k = sum(labels[:k]) / k.",
          "También exige load <= capacity para no saturar la cola de Red Andina.",
        ],
        edgeCases: [
          "falta capacity",
          "fixture adverso: load > capacity",
          "CASO-LIM-034-1B es sintético",
        ],
        tests: "Salida `S34-T1-B PASS` con métricas y capacidad válidas.",
        feedback:
          "S34-T1-B-E1: explica la diferencia conceptual entre precision@k (calidad del top) y recall@k (cobertura de positivos) en una cola de 10 analistas.",
        starterCode: {
          language: "python",
          title: "s34-t1-b-e1.py",
          code: `# CASO-LIM-034-1B · precision@k y recall@k
# DEFECT: recall divide entre k (no n_pos)
labels = [1, 0, 1]
k, n_pos = 3, 2
load, capacity = 8, 10
precision_at_k = sum(labels[:k]) / k
recall_at_k = sum(labels[:k]) / k  # DEFECT
ok = (
    abs(precision_at_k - 2 / 3) < 1e-9
    and abs(recall_at_k - 1.0) < 1e-9
    and load <= capacity
)
status = "PASS" if ok else "REJECT_QUEUE_OVERLOAD"
print("S34-T1-B", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-b-e1.py",
          code: `labels = [1, 0, 1]
k, n_pos = 3, 2
load, capacity = 8, 10
precision_at_k = sum(labels[:k]) / k
recall_at_k = sum(labels[:k]) / n_pos if n_pos else 0.0
ok = (
    abs(precision_at_k - 2 / 3) < 1e-9
    and abs(recall_at_k - 1.0) < 1e-9
    and load <= capacity
)
status = "PASS" if ok else "REJECT_QUEUE_OVERLOAD"
print("S34-T1-B", status)
assert ok is True
`,
          output: `S34-T1-B PASS`,
        },
      },
      {
        id: "S34-T1-B-E2",
        subtopicId: "S34-T1-B",
        kind: "independent",
        instruction:
          "S34-T1-B-E2 · Tres rutas: válido (load ≤ capacity y precision_at_k en [0,1]), adverso (load > capacity), sin `capacity` → `MISSING:capacity`. Salidas: `PASS`, `REJECT_QUEUE_OVERLOAD`, `MISSING:capacity`.",
        hint: "Missing primero; luego load <= capacity y 0 <= precision_at_k <= 1.",
        hints: [
          "Missing primero; luego load <= capacity y 0 <= precision_at_k <= 1.",
          "El adverso tiene load=50, capacity=10.",
        ],
        edgeCases: [
          "falta capacity",
          "fixture adverso: load > capacity",
          "CASO-LIM-034-1B es sintético",
        ],
        tests: "Salida: `PASS REJECT_QUEUE_OVERLOAD MISSING:capacity`.",
        feedback:
          "S34-T1-B-E2: ¿qué haría el workbench si ignorara capacity y solo maximizara recall@k? Conecta overload con costo humano de cola.",
        starterCode: {
          language: "python",
          title: "s34-t1-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_QUEUE_OVERLOAD
# DEFECT: PASS si load > capacity
def assess(record: dict) -> str:
    required = {"case_id", "precision_at_k", "load", "capacity"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["load"] > record["capacity"] else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 8, "capacity": 10}
invalid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 50, "capacity": 10}
incomplete = {**valid}
incomplete.pop("capacity")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "precision_at_k", "load", "capacity"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["load"] <= record["capacity"] and 0 <= record["precision_at_k"] <= 1
    return "PASS" if ok else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 8, "capacity": 10}
invalid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 50, "capacity": 10}
incomplete = {**valid}
incomplete.pop("capacity")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_QUEUE_OVERLOAD MISSING:capacity`,
        },
      },
      {
        id: "S34-T1-B-E3",
        subtopicId: "S34-T1-B",
        kind: "transfer",
        instruction:
          "S34-T1-B-E3 · Fail-closed: válido → CONTINUE, overload → REJECT_QUEUE_OVERLOAD, sin capacity → REQUEST_CAPACITY. Corrige missing→CONTINUE y el predicado invertido del starter.",
        hint: "REQUEST_CAPACITY ante ausencia; CONTINUE solo con load ≤ capacity y precision válida.",
        hints: [
          "REQUEST_CAPACITY ante ausencia; CONTINUE solo con load ≤ capacity y precision válida.",
          "No rellenes capacity por defecto: sin capacidad no hay thr operativo.",
        ],
        edgeCases: [
          "falta capacity",
          "fixture adverso: load > capacity",
          "CASO-LIM-034-1B es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_QUEUE_OVERLOAD REQUEST_CAPACITY`.",
        feedback:
          "S34-T1-B-E3: argumenta por qué pedir capacity (REQUEST_*) es preferible a asumir un default de 100 alertas/día en un equipo de 3 analistas.",
        starterCode: {
          language: "python",
          title: "s34-t1-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_QUEUE_OVERLOAD
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "precision_at_k", "load", "capacity"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["load"] > record["capacity"] else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 8, "capacity": 10}
invalid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 50, "capacity": 10}
uncertain = {**valid}
uncertain.pop("capacity")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "precision_at_k", "load", "capacity"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CAPACITY"
    ok = record["load"] <= record["capacity"] and 0 <= record["precision_at_k"] <= 1
    return "CONTINUE" if ok else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 8, "capacity": 10}
invalid = {"case_id": "CASO-LIM-034-1B", "precision_at_k": 0.667, "load": 50, "capacity": 10}
uncertain = {**valid}
uncertain.pop("capacity")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_QUEUE_OVERLOAD", "REQUEST_CAPACITY"]
`,
          output: `CONTINUE REJECT_QUEUE_OVERLOAD REQUEST_CAPACITY`,
        },
      },
      {
        id: "S34-T2-A-E1",
        subtopicId: "S34-T2-A",
        kind: "guided",
        instruction:
          "S34-T2-A-E1 · Calcula `weight_ratio = n0/n1` y un plan de fold. El starter marca `resample_train_only = resample_global` (leak invertido). Corrige para que con n0=9, n1=1 y resample_global=False el ratio sea 9.0 y el plan sea CV-safe; imprime `S34-T2-A PASS` o `REJECT_LEAKY_RESAMPLE`.",
        hint: "resample_train_only debe ser not resample_global; n1 > 0.",
        hints: [
          "resample_train_only debe ser not resample_global; n1 > 0.",
          "weight_ratio en Python 3 es float: 9.0, no 9.",
        ],
        edgeCases: [
          "falta n1",
          "fixture adverso: resample_global=True",
          "CASO-LIM-034-2A es sintético",
        ],
        tests: "PASS cuando ratio 9.0 y plan train-only.",
        feedback:
          "S34-T2-A-E1: dibuja mentalmente train/test de un fold y señala dónde vive el oversample. ¿Qué métrica se infla si resampleas globalmente?",
        starterCode: {
          language: "python",
          title: "s34-t2-a-e1.py",
          code: `# CASO-LIM-034-2A · pesos + fold CV-safe
# DEFECT: resample_train_only = resample_global
n0, n1 = 9, 1
resample_global = False
weight_ratio = n0 / n1
resample_train_only = resample_global  # DEFECT
ok = (
    abs(weight_ratio - 9.0) < 1e-9
    and resample_train_only is True
    and n1 > 0
)
status = "PASS" if ok else "REJECT_LEAKY_RESAMPLE"
print("S34-T2-A", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-a-e1.py",
          code: `n0, n1 = 9, 1
resample_global = False
weight_ratio = n0 / n1
resample_train_only = not resample_global
ok = (
    abs(weight_ratio - 9.0) < 1e-9
    and resample_train_only is True
    and n1 > 0
)
status = "PASS" if ok else "REJECT_LEAKY_RESAMPLE"
print("S34-T2-A", status)
assert ok is True
`,
          output: `S34-T2-A PASS`,
        },
      },
      {
        id: "S34-T2-A-E2",
        subtopicId: "S34-T2-A",
        kind: "independent",
        instruction:
          "S34-T2-A-E2 · assess: válido (resample_global=False, n1>0, n0>n1), adverso (resample_global=True), sin n1 → MISSING:n1. Salidas PASS / REJECT_LEAKY_RESAMPLE / MISSING:n1.",
        hint: "Missing primero; PASS solo si no hay resample global y minority > 0.",
        hints: [
          "Missing primero; PASS solo si no hay resample global y minority > 0.",
          "n0 > n1 documenta desbalance real del fold.",
        ],
        edgeCases: [
          "falta n1",
          "fixture adverso: resample_global=True",
          "CASO-LIM-034-2A es sintético",
        ],
        tests: "Salida: `PASS REJECT_LEAKY_RESAMPLE MISSING:n1`.",
        feedback:
          "S34-T2-A-E2: si el adverso fuera n1=0 en vez de resample_global, ¿qué REQUEST o REJECT aplicarías y por qué?",
        starterCode: {
          language: "python",
          title: "s34-t2-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_LEAKY_RESAMPLE
# DEFECT: PASS con resample_global True
def assess(record: dict) -> str:
    required = {"case_id", "n0", "n1", "resample_global"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["resample_global"] is True else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": False}
invalid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": True}
incomplete = {**valid}
incomplete.pop("n1")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "n0", "n1", "resample_global"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["resample_global"] is False and record["n1"] > 0 and record["n0"] > record["n1"]
    return "PASS" if ok else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": False}
invalid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": True}
incomplete = {**valid}
incomplete.pop("n1")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_LEAKY_RESAMPLE MISSING:n1`,
        },
      },
      {
        id: "S34-T2-A-E3",
        subtopicId: "S34-T2-A",
        kind: "transfer",
        instruction:
          "S34-T2-A-E3 · Fail-closed: CONTINUE / REJECT_LEAKY_RESAMPLE / REQUEST_WEIGHTS. Repara missing→CONTINUE y predicado invertido.",
        hint: "Sin n1 → REQUEST_WEIGHTS; CONTINUE solo con política CV-safe.",
        hints: [
          "Sin n1 → REQUEST_WEIGHTS; CONTINUE solo con política CV-safe.",
          "No inventes minority counts: sin n1 no hay weight ratio.",
        ],
        edgeCases: [
          "falta n1",
          "fixture adverso: resample_global=True",
          "CASO-LIM-034-2A es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_LEAKY_RESAMPLE REQUEST_WEIGHTS`.",
        feedback:
          "S34-T2-A-E3: relaciona REQUEST_WEIGHTS con no poder auditar el ratio de clase en un reporte de modelo.",
        starterCode: {
          language: "python",
          title: "s34-t2-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_LEAKY_RESAMPLE
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "n0", "n1", "resample_global"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["resample_global"] is True else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": False}
invalid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": True}
uncertain = {**valid}
uncertain.pop("n1")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "n0", "n1", "resample_global"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_WEIGHTS"
    ok = record["resample_global"] is False and record["n1"] > 0 and record["n0"] > record["n1"]
    return "CONTINUE" if ok else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": False}
invalid = {"case_id": "CASO-LIM-034-2A", "n0": 9, "n1": 1, "resample_global": True}
uncertain = {**valid}
uncertain.pop("n1")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_LEAKY_RESAMPLE", "REQUEST_WEIGHTS"]
`,
          output: `CONTINUE REJECT_LEAKY_RESAMPLE REQUEST_WEIGHTS`,
        },
      },
      {
        id: "S34-T2-B-E1",
        subtopicId: "S34-T2-B",
        kind: "guided",
        instruction:
          "S34-T2-B-E1 · Calcula prevalencia = 25/1000 y all_neg_acc = 1 − prev. El starter marca accuracy_enough=True pese a prev baja. Corrige: PASS solo si prev en (0, 0.5) y accuracy_enough is False; si no REJECT_PREVALENCE_BLIND.",
        hint: "prevalence = pos/n; all_neg_acc = 1 - prev; accuracy no basta bajo desbalance.",
        hints: [
          "prevalence = pos/n; all_neg_acc = 1 - prev; accuracy no basta bajo desbalance.",
          "Con prev=0.025, all_neg_acc=0.975 engaña: accuracy_enough debe ser False.",
        ],
        edgeCases: [
          "falta prevalence",
          "fixture adverso: accuracy_enough=True con prev baja",
          "CASO-LIM-034-2B es sintético",
        ],
        tests: "Salida `S34-T2-B PASS` con base rate honesta.",
        feedback:
          "S34-T2-B-E1: si la prevalencia cae de 5 % a 1 % y precision se mantiene, ¿qué cambió realmente en la cola? Usa base rate en tu respuesta.",
        starterCode: {
          language: "python",
          title: "s34-t2-b-e1.py",
          code: `# CASO-LIM-034-2B · prevalencia + accuracy trap
# DEFECT: accuracy_enough = True
pos, n = 25, 1000
prevalence = pos / n
all_neg_acc = 1 - prevalence
accuracy_enough = True  # DEFECT
ok = accuracy_enough is False and 0 < prevalence < 0.5
status = "PASS" if ok else "REJECT_PREVALENCE_BLIND"
print("S34-T2-B", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-b-e1.py",
          code: `pos, n = 25, 1000
prevalence = pos / n
all_neg_acc = 1 - prevalence
accuracy_enough = False
ok = accuracy_enough is False and 0 < prevalence < 0.5
status = "PASS" if ok else "REJECT_PREVALENCE_BLIND"
print("S34-T2-B", status)
assert ok is True
assert abs(prevalence - 0.025) < 1e-12
assert abs(all_neg_acc - 0.975) < 1e-12
`,
          output: `S34-T2-B PASS`,
        },
      },
      {
        id: "S34-T2-B-E2",
        subtopicId: "S34-T2-B",
        kind: "independent",
        instruction:
          "S34-T2-B-E2 · assess válido/adverso/missing prevalence. PASS si accuracy_enough is False y 0 < prevalence < 0.5. Salidas: PASS / REJECT_PREVALENCE_BLIND / MISSING:prevalence.",
        hint: "Missing primero; el adverso tiene accuracy_enough=True.",
        hints: [
          "Missing primero; el adverso tiene accuracy_enough=True.",
          "No uses all_neg_acc como único gate: la política es accuracy_enough + base rate.",
        ],
        edgeCases: [
          "falta prevalence",
          "fixture adverso: accuracy_enough=True con prev baja",
          "CASO-LIM-034-2B es sintético",
        ],
        tests: "Salida: `PASS REJECT_PREVALENCE_BLIND MISSING:prevalence`.",
        feedback:
          "S34-T2-B-E2: ¿por qué comparar precision entre Q1 y Q2 sin reportar prevalencia puede hacer que un modelo peor «gane» el dashboard?",
        starterCode: {
          language: "python",
          title: "s34-t2-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_PREVALENCE_BLIND
# DEFECT: PASS si accuracy_enough True
def assess(record: dict) -> str:
    required = {"case_id", "prevalence", "all_neg_acc", "accuracy_enough"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_enough"] is True else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": False}
invalid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": True}
incomplete = {**valid}
incomplete.pop("prevalence")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "prevalence", "all_neg_acc", "accuracy_enough"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["accuracy_enough"] is False and 0 < record["prevalence"] < 0.5
    return "PASS" if ok else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": False}
invalid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": True}
incomplete = {**valid}
incomplete.pop("prevalence")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_PREVALENCE_BLIND MISSING:prevalence`,
        },
      },
      {
        id: "S34-T2-B-E3",
        subtopicId: "S34-T2-B",
        kind: "transfer",
        instruction:
          "S34-T2-B-E3 · Fail-closed: CONTINUE / REJECT_PREVALENCE_BLIND / REQUEST_BASE_RATE. Corrige missing y predicado del starter.",
        hint: "Sin prevalence → REQUEST_BASE_RATE; no inventes 0.5 por defecto.",
        hints: [
          "Sin prevalence → REQUEST_BASE_RATE; no inventes 0.5 por defecto.",
          "CONTINUE solo con accuracy_enough False y prevalencia en (0, 0.5).",
        ],
        edgeCases: [
          "falta prevalence",
          "fixture adverso: accuracy_enough=True con prev baja",
          "CASO-LIM-034-2B es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_PREVALENCE_BLIND REQUEST_BASE_RATE`.",
        feedback:
          "S34-T2-B-E3: en un informe a compliance, ¿qué frase en español peruano profesional usarías para explicar por qué all-neg accuracy no basta?",
        starterCode: {
          language: "python",
          title: "s34-t2-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_PREVALENCE_BLIND
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "prevalence", "all_neg_acc", "accuracy_enough"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["accuracy_enough"] is True else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": False}
invalid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": True}
uncertain = {**valid}
uncertain.pop("prevalence")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "prevalence", "all_neg_acc", "accuracy_enough"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_BASE_RATE"
    ok = record["accuracy_enough"] is False and 0 < record["prevalence"] < 0.5
    return "CONTINUE" if ok else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": False}
invalid = {"case_id": "CASO-LIM-034-2B", "prevalence": 0.025, "all_neg_acc": 0.975, "accuracy_enough": True}
uncertain = {**valid}
uncertain.pop("prevalence")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_PREVALENCE_BLIND", "REQUEST_BASE_RATE"]
`,
          output: `CONTINUE REJECT_PREVALENCE_BLIND REQUEST_BASE_RATE`,
        },
      },
      {
        id: "S34-T3-A-E1",
        subtopicId: "S34-T3-A",
        kind: "guided",
        instruction:
          "S34-T3-A-E1 · Calcula Brier medio sobre ps=[0.5,0.5] ys=[0,1] y un bin [0.0,1.0) con mean_p y freq. El starter usa brier de un solo punto o compara mal. PASS si brier==0.25 y |mean_p−freq|≤0.1; si no REJECT_UNCALIBRATED.",
        hint: "brier_mean = media de (p−y)²; con p=0.5 y y en {0,1}: (0.25+0.25)/2=0.25.",
        hints: [
          "brier_mean = media de (p−y)²; con p=0.5 y y en {0,1}: (0.25+0.25)/2=0.25.",
          "reliability del bin completo: mean_p=0.5, freq=0.5 → alineado.",
        ],
        edgeCases: [
          "falta brier o lista vacía",
          "fixture adverso: |mean_p−freq| grande o Brier alto",
          "CASO-LIM-034-3A es sintético",
        ],
        tests: "Salida `S34-T3-A PASS` con Brier y bin calculados.",
        feedback:
          "S34-T3-A-E1: ¿por qué un Brier de un solo punto perfecto no demuestra calibración del modelo completo?",
        starterCode: {
          language: "python",
          title: "s34-t3-a-e1.py",
          code: `# CASO-LIM-034-3A · Brier medio + bin
# DEFECT: brier de un solo punto (1.0,1) en vez de la media del set
ps = [0.5, 0.5]
ys = [0, 1]
brier = (1.0 - 1) ** 2  # DEFECT: ignora el set
mean_p = sum(ps) / len(ps)
freq = sum(ys) / len(ys)
ok = abs(brier - 0.25) < 1e-9 and abs(mean_p - freq) <= 0.1
status = "PASS" if ok else "REJECT_UNCALIBRATED"
print("S34-T3-A", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-a-e1.py",
          code: `ps = [0.5, 0.5]
ys = [0, 1]
brier = sum((p - y) ** 2 for p, y in zip(ps, ys)) / len(ps)
mean_p = sum(ps) / len(ps)
freq = sum(ys) / len(ys)
ok = abs(brier - 0.25) < 1e-9 and abs(mean_p - freq) <= 0.1
status = "PASS" if ok else "REJECT_UNCALIBRATED"
print("S34-T3-A", status)
assert ok is True
`,
          output: `S34-T3-A PASS`,
        },
      },
      {
        id: "S34-T3-A-E2",
        subtopicId: "S34-T3-A",
        kind: "independent",
        instruction:
          "S34-T3-A-E2 · assess: válido (brier≤0.25 y |mean_p−freq|≤0.1), adverso (desalineado o brier alto), sin brier → MISSING:brier.",
        hint: "Missing primero; umbrales del contrato de reliability del workbench.",
        hints: [
          "Missing primero; umbrales del contrato de reliability del workbench.",
          "Adverso ejemplo: brier=0.4, mean_p=0.9, freq=0.2.",
        ],
        edgeCases: [
          "falta brier",
          "fixture adverso: |mean_p−freq| grande o Brier alto",
          "CASO-LIM-034-3A es sintético",
        ],
        tests: "Salida: `PASS REJECT_UNCALIBRATED MISSING:brier`.",
        feedback:
          "S34-T3-A-E2: si mean_p y freq alinean pero Brier es alto, ¿qué te dice sobre discriminación vs calibración?",
        starterCode: {
          language: "python",
          title: "s34-t3-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_UNCALIBRATED
# DEFECT: PASS si |mean_p-freq| > 0.3
def assess(record: dict) -> str:
    required = {"case_id", "brier", "mean_p", "freq"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if abs(record["mean_p"] - record["freq"]) > 0.3 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", "brier": 0.1, "mean_p": 0.5, "freq": 0.5}
invalid = {"case_id": "CASO-LIM-034-3A", "brier": 0.4, "mean_p": 0.9, "freq": 0.2}
incomplete = {**valid}
incomplete.pop("brier")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "brier", "mean_p", "freq"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = abs(record["mean_p"] - record["freq"]) <= 0.1 and record["brier"] <= 0.25
    return "PASS" if ok else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", "brier": 0.1, "mean_p": 0.5, "freq": 0.5}
invalid = {"case_id": "CASO-LIM-034-3A", "brier": 0.4, "mean_p": 0.9, "freq": 0.2}
incomplete = {**valid}
incomplete.pop("brier")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_UNCALIBRATED MISSING:brier`,
        },
      },
      {
        id: "S34-T3-A-E3",
        subtopicId: "S34-T3-A",
        kind: "transfer",
        instruction:
          "S34-T3-A-E3 · Fail-closed: CONTINUE / REJECT_UNCALIBRATED / REQUEST_BRIER. Repara missing y predicado invertido.",
        hint: "Sin brier → REQUEST_BRIER; no inventes 0.0 «perfecto».",
        hints: [
          "Sin brier → REQUEST_BRIER; no inventes 0.0 «perfecto».",
          "CONTINUE con |mean_p−freq|≤0.1 y brier≤0.25.",
        ],
        edgeCases: [
          "falta brier",
          "fixture adverso: |mean_p−freq| grande o Brier alto",
          "CASO-LIM-034-3A es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_UNCALIBRATED REQUEST_BRIER`.",
        feedback:
          "S34-T3-A-E3: describe en una frase de portafolio por qué el score del workbench es probabilidad de priorización, no de culpa.",
        starterCode: {
          language: "python",
          title: "s34-t3-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_UNCALIBRATED
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "brier", "mean_p", "freq"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if abs(record["mean_p"] - record["freq"]) > 0.3 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", "brier": 0.1, "mean_p": 0.5, "freq": 0.5}
invalid = {"case_id": "CASO-LIM-034-3A", "brier": 0.4, "mean_p": 0.9, "freq": 0.2}
uncertain = {**valid}
uncertain.pop("brier")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "brier", "mean_p", "freq"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_BRIER"
    ok = abs(record["mean_p"] - record["freq"]) <= 0.1 and record["brier"] <= 0.25
    return "CONTINUE" if ok else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", "brier": 0.1, "mean_p": 0.5, "freq": 0.5}
invalid = {"case_id": "CASO-LIM-034-3A", "brier": 0.4, "mean_p": 0.9, "freq": 0.2}
uncertain = {**valid}
uncertain.pop("brier")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNCALIBRATED", "REQUEST_BRIER"]
`,
          output: `CONTINUE REJECT_UNCALIBRATED REQUEST_BRIER`,
        },
      },
      {
        id: "S34-T3-B-E1",
        subtopicId: "S34-T3-B",
        kind: "guided",
        instruction:
          "S34-T3-B-E1 · Aplica mapa afín `clip(a·x+b)` con a=0.8, b=0.1 a raw=[1.5,-0.2,0.4]. El starter solo hace clip sin afín. PASS si cal==[1.0,0.0,0.42], calibrator_set empieza por holdout y misma longitud; si no REJECT_IN_SAMPLE_CAL.",
        hint: "cal_i = min(1, max(0, a*raw_i + b)); no uses solo min/max del raw.",
        hints: [
          "cal_i = min(1, max(0, a*raw_i + b)); no uses solo min/max del raw.",
          "Clip sin a,b no es calibración; aquí a,b vienen del holdout_v1 ficticio.",
        ],
        edgeCases: [
          "falta calibrator_set",
          "fixture adverso: calibrator_set=train_in_sample",
          "CASO-LIM-034-3B es sintético",
        ],
        tests: "Salida `S34-T3-B PASS` con cal afín en holdout.",
        feedback:
          "S34-T3-B-E1: nombra una diferencia entre clip a [0,1] y un calibrador ajustado en holdout. ¿Cuál miente en reliability?",
        starterCode: {
          language: "python",
          title: "s34-t3-b-e1.py",
          code: `# CASO-LIM-034-3B · afín holdout (esqueleto Platt)
# DEFECT: solo clip, sin a·x+b
raw = [1.5, -0.2, 0.4]
a, b = 0.8, 0.1
cal = [min(1.0, max(0.0, x)) for x in raw]  # DEFECT: clip sin a·x+b
calibrator_set = "holdout_v1"
expected = [1.0, 0.0, 0.42]
ok = (
    cal == expected
    and calibrator_set.startswith("holdout")
    and len(raw) == len(cal)
)
status = "PASS" if ok else "REJECT_IN_SAMPLE_CAL"
print("S34-T3-B", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-b-e1.py",
          code: `raw = [1.5, -0.2, 0.4]
a, b = 0.8, 0.1
cal = [round(min(1.0, max(0.0, a * x + b)), 2) for x in raw]
calibrator_set = "holdout_v1"
expected = [1.0, 0.0, 0.42]
ok = (
    cal == expected
    and calibrator_set.startswith("holdout")
    and len(raw) == len(cal)
)
status = "PASS" if ok else "REJECT_IN_SAMPLE_CAL"
print("S34-T3-B", status)
assert ok is True
`,
          output: `S34-T3-B PASS`,
        },
      },
      {
        id: "S34-T3-B-E2",
        subtopicId: "S34-T3-B",
        kind: "independent",
        instruction:
          "S34-T3-B-E2 · assess: holdout + misma longitud → PASS; train_in_sample → REJECT_IN_SAMPLE_CAL; sin calibrator_set → MISSING:calibrator_set.",
        hint: "startswith('holdout') y len(raw)==len(cal).",
        hints: [
          "startswith('holdout') y len(raw)==len(cal).",
          "El adverso usa calibrator_set='train_in_sample'.",
        ],
        edgeCases: [
          "falta calibrator_set",
          "fixture adverso: calibrator_set=train_in_sample",
          "CASO-LIM-034-3B es sintético",
        ],
        tests: "Salida: `PASS REJECT_IN_SAMPLE_CAL MISSING:calibrator_set`.",
        feedback:
          "S34-T3-B-E2: ¿qué riesgo de auditoría aparece si el calibrator_set no está versionado en el reporte del workbench?",
        starterCode: {
          language: "python",
          title: "s34-t3-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_IN_SAMPLE_CAL
# DEFECT: PASS con train_in_sample
def assess(record: dict) -> str:
    required = {"case_id", "raw", "cal", "calibrator_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["calibrator_set"] == "train_in_sample" else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "holdout_v1"}
invalid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "train_in_sample"}
incomplete = {**valid}
incomplete.pop("calibrator_set")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "raw", "cal", "calibrator_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["calibrator_set"].startswith("holdout") and len(record["raw"]) == len(record["cal"])
    return "PASS" if ok else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "holdout_v1"}
invalid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "train_in_sample"}
incomplete = {**valid}
incomplete.pop("calibrator_set")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_IN_SAMPLE_CAL MISSING:calibrator_set`,
        },
      },
      {
        id: "S34-T3-B-E3",
        subtopicId: "S34-T3-B",
        kind: "transfer",
        instruction:
          "S34-T3-B-E3 · Fail-closed: CONTINUE / REJECT_IN_SAMPLE_CAL / REQUEST_CAL_SET. Repara missing y predicado.",
        hint: "Sin set → REQUEST_CAL_SET; CONTINUE solo con holdout + misma longitud.",
        hints: [
          "Sin set → REQUEST_CAL_SET; CONTINUE solo con holdout + misma longitud.",
          "Nunca fit del calibrador en el test final del reporte.",
        ],
        edgeCases: [
          "falta calibrator_set",
          "fixture adverso: calibrator_set=train_in_sample",
          "CASO-LIM-034-3B es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_IN_SAMPLE_CAL REQUEST_CAL_SET`.",
        feedback:
          "S34-T3-B-E3: escribe la política en una línea para el README del workbench: dónde se ajusta el calibrador y dónde se mide Brier.",
        starterCode: {
          language: "python",
          title: "s34-t3-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_IN_SAMPLE_CAL
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "raw", "cal", "calibrator_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["calibrator_set"] == "train_in_sample" else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "holdout_v1"}
invalid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "train_in_sample"}
uncertain = {**valid}
uncertain.pop("calibrator_set")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "raw", "cal", "calibrator_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CAL_SET"
    ok = record["calibrator_set"].startswith("holdout") and len(record["raw"]) == len(record["cal"])
    return "CONTINUE" if ok else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "holdout_v1"}
invalid = {"case_id": "CASO-LIM-034-3B", "raw": [0.2, 0.8], "cal": [0.25, 0.75], "calibrator_set": "train_in_sample"}
uncertain = {**valid}
uncertain.pop("calibrator_set")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_IN_SAMPLE_CAL", "REQUEST_CAL_SET"]
`,
          output: `CONTINUE REJECT_IN_SAMPLE_CAL REQUEST_CAL_SET`,
        },
      },
      {
        id: "S34-T4-A-E1",
        subtopicId: "S34-T4-A",
        kind: "guided",
        instruction:
          "S34-T4-A-E1 · Implementa búsqueda de thr: scores=[0.1,0.4,0.6,0.9], labels=[0,0,1,1], c_fp=2, c_fn=10, capacity=2. El starter fija thr=0.5 sin buscar. PASS si thr==0.6, cost==0 y thr_id empieza por thr-v; si no REJECT_FIXED_THR.",
        hint: "Itera thr en sorted(set(scores)); descarta n_review > capacity; minimiza fp*c_fp+fn*c_fn.",
        hints: [
          "Itera thr en sorted(set(scores)); descarta n_review > capacity; minimiza fp*c_fp+fn*c_fn.",
          "Con capacidad 2 el thr 0.6 deja exactamente los dos positivos sin FP.",
        ],
        edgeCases: [
          "falta cost",
          "fixture adverso: thr_id=default o cost is None",
          "CASO-LIM-034-4A es sintético",
        ],
        tests: "Salida `S34-T4-A PASS` con thr óptimo versionado.",
        feedback:
          "S34-T4-A-E1: si c_fn sube a 100, ¿esperas un thr más bajo o más alto? Razona en términos de misses vs cola.",
        starterCode: {
          language: "python",
          title: "s34-t4-a-e1.py",
          code: `# CASO-LIM-034-4A · thr por costo/capacidad
# DEFECT: thr fijo 0.5 sin búsqueda
scores = [0.1, 0.4, 0.6, 0.9]
labels = [0, 0, 1, 1]
c_fp, c_fn, capacity = 2, 10, 2
thr = 0.5  # DEFECT
pred = [1 if s >= thr else 0 for s in scores]
fp = sum(p == 1 and y == 0 for p, y in zip(pred, labels))
fn = sum(p == 0 and y == 1 for p, y in zip(pred, labels))
cost = fp * c_fp + fn * c_fn
thr_id = "thr-v1"
ok = thr == 0.6 and cost == 0 and thr_id.startswith("thr-v")
status = "PASS" if ok else "REJECT_FIXED_THR"
print("S34-T4-A", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-a-e1.py",
          code: `scores = [0.1, 0.4, 0.6, 0.9]
labels = [0, 0, 1, 1]
c_fp, c_fn, capacity = 2, 10, 2
best_thr, best_cost = None, float("inf")
for thr_c in sorted(set(scores)):
    pred = [1 if s >= thr_c else 0 for s in scores]
    n_review = sum(pred)
    if n_review > capacity or n_review == 0:
        continue
    fp = sum(p == 1 and y == 0 for p, y in zip(pred, labels))
    fn = sum(p == 0 and y == 1 for p, y in zip(pred, labels))
    cost = fp * c_fp + fn * c_fn
    if cost < best_cost:
        best_thr, best_cost = thr_c, cost
thr, cost = best_thr, best_cost
thr_id = "thr-v1"
ok = thr == 0.6 and cost == 0 and thr_id.startswith("thr-v")
status = "PASS" if ok else "REJECT_FIXED_THR"
print("S34-T4-A", status)
assert ok is True
`,
          output: `S34-T4-A PASS`,
        },
      },
      {
        id: "S34-T4-A-E2",
        subtopicId: "S34-T4-A",
        kind: "independent",
        instruction:
          "S34-T4-A-E2 · assess: thr_id thr-v* + cost not None + n_review≥1 → PASS; default/None → REJECT_FIXED_THR; sin cost → MISSING:cost.",
        hint: "Missing primero; startswith('thr-v') y cost is not None.",
        hints: [
          "Missing primero; startswith('thr-v') y cost is not None.",
          "Adverso: thr_id='default', cost=None.",
        ],
        edgeCases: [
          "falta cost",
          "fixture adverso: thr_id=default o cost is None",
          "CASO-LIM-034-4A es sintético",
        ],
        tests: "Salida: `PASS REJECT_FIXED_THR MISSING:cost`.",
        feedback:
          "S34-T4-A-E2: ¿por qué versionar thr-v1 vs thr-v2 importa cuando el headcount de analistas cambia de 10 a 6?",
        starterCode: {
          language: "python",
          title: "s34-t4-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_FIXED_THR
# DEFECT: PASS con thr_id default
def assess(record: dict) -> str:
    required = {"case_id", "thr", "n_review", "thr_id", "cost"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["thr_id"] == "default" else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", "thr": 0.6, "n_review": 2, "thr_id": "thr-v1", "cost": 16}
invalid = {"case_id": "CASO-LIM-034-4A", "thr": 0.5, "n_review": 2, "thr_id": "default", "cost": None}
incomplete = {**valid}
incomplete.pop("cost")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "thr", "n_review", "thr_id", "cost"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["thr_id"].startswith("thr-v") and record["cost"] is not None and record["n_review"] >= 1
    return "PASS" if ok else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", "thr": 0.6, "n_review": 2, "thr_id": "thr-v1", "cost": 16}
invalid = {"case_id": "CASO-LIM-034-4A", "thr": 0.5, "n_review": 2, "thr_id": "default", "cost": None}
incomplete = {**valid}
incomplete.pop("cost")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_FIXED_THR MISSING:cost`,
        },
      },
      {
        id: "S34-T4-A-E3",
        subtopicId: "S34-T4-A",
        kind: "transfer",
        instruction:
          "S34-T4-A-E3 · Fail-closed: CONTINUE / REJECT_FIXED_THR / REQUEST_COST_MATRIX. Repara missing y predicado.",
        hint: "Sin cost → REQUEST_COST_MATRIX; no asumas c_fp=c_fn=1 en silencio.",
        hints: [
          "Sin cost → REQUEST_COST_MATRIX; no asumas c_fp=c_fn=1 en silencio.",
          "CONTINUE con thr-v* versionado y cost documentado.",
        ],
        edgeCases: [
          "falta cost",
          "fixture adverso: thr_id=default o cost is None",
          "CASO-LIM-034-4A es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_FIXED_THR REQUEST_COST_MATRIX`.",
        feedback:
          "S34-T4-A-E3: formula en español cómo explicarías a un auditor que el thr no es «mágico 0.5» sino una decisión de costo y capacidad.",
        starterCode: {
          language: "python",
          title: "s34-t4-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_FIXED_THR
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "thr", "n_review", "thr_id", "cost"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["thr_id"] == "default" else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", "thr": 0.6, "n_review": 2, "thr_id": "thr-v1", "cost": 16}
invalid = {"case_id": "CASO-LIM-034-4A", "thr": 0.5, "n_review": 2, "thr_id": "default", "cost": None}
uncertain = {**valid}
uncertain.pop("cost")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "thr", "n_review", "thr_id", "cost"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_COST_MATRIX"
    ok = record["thr_id"].startswith("thr-v") and record["cost"] is not None and record["n_review"] >= 1
    return "CONTINUE" if ok else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", "thr": 0.6, "n_review": 2, "thr_id": "thr-v1", "cost": 16}
invalid = {"case_id": "CASO-LIM-034-4A", "thr": 0.5, "n_review": 2, "thr_id": "default", "cost": None}
uncertain = {**valid}
uncertain.pop("cost")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FIXED_THR", "REQUEST_COST_MATRIX"]
`,
          output: `CONTINUE REJECT_FIXED_THR REQUEST_COST_MATRIX`,
        },
      },
      {
        id: "S34-T4-B-E1",
        subtopicId: "S34-T4-B",
        kind: "guided",
        instruction:
          "S34-T4-B-E1 · Implementa decide(score, low=0.3, high=0.7). El starter fuerza 'review' en la banda. PASS si decide(0.5)=='abstain', decide(0.1)=='skip', decide(0.9)=='review'; si no REJECT_FORCE_LABEL.",
        hint: "score < low → skip; score > high → review; else abstain.",
        hints: [
          "score < low → skip; score > high → review; else abstain.",
          "No devuelvas force_1 ni labels binarios en zona gris.",
        ],
        edgeCases: [
          "falta low",
          "fixture adverso: decision=force_1 en banda",
          "CASO-LIM-034-4B es sintético",
        ],
        tests: "Salida `S34-T4-B PASS` con las tres rutas de decide.",
        feedback:
          "S34-T4-B-E1: ¿por qué abstener en 0.5 puede ser más seguro para el sujeto investigado que forzar review o skip automático?",
        starterCode: {
          language: "python",
          title: "s34-t4-b-e1.py",
          code: `# CASO-LIM-034-4B · banda de abstención
# DEFECT: en banda devuelve 'review' (fuerza cola)
def decide(score, low=0.3, high=0.7):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "review"  # DEFECT: debería abstain

ok = decide(0.5) == "abstain" and decide(0.1) == "skip" and decide(0.9) == "review"
status = "PASS" if ok else "REJECT_FORCE_LABEL"
print("S34-T4-B", status)
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-b-e1.py",
          code: `def decide(score, low=0.3, high=0.7):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "abstain"

ok = decide(0.5) == "abstain" and decide(0.1) == "skip" and decide(0.9) == "review"
status = "PASS" if ok else "REJECT_FORCE_LABEL"
print("S34-T4-B", status)
assert ok is True
`,
          output: `S34-T4-B PASS`,
        },
      },
      {
        id: "S34-T4-B-E2",
        subtopicId: "S34-T4-B",
        kind: "independent",
        instruction:
          "S34-T4-B-E2 · assess: score en (low, high) y decision==abstain → PASS; force_1 → REJECT_FORCE_LABEL; sin low → MISSING:low.",
        hint: "Missing primero; exige low < score < high y decision abstain.",
        hints: [
          "Missing primero; exige low < score < high y decision abstain.",
          "Adverso: decision='force_1' con el mismo score en banda.",
        ],
        edgeCases: [
          "falta low",
          "fixture adverso: decision=force_1 en banda",
          "CASO-LIM-034-4B es sintético",
        ],
        tests: "Salida: `PASS REJECT_FORCE_LABEL MISSING:low`.",
        feedback:
          "S34-T4-B-E2: si el adverso fuera decision='skip' con score=0.5, ¿seguiría siendo breach? Justifica con la banda.",
        starterCode: {
          language: "python",
          title: "s34-t4-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_FORCE_LABEL
# DEFECT: PASS con force_1
def assess(record: dict) -> str:
    required = {"case_id", "score", "low", "high", "decision"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["decision"] == "force_1" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "abstain"}
invalid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "force_1"}
incomplete = {**valid}
incomplete.pop("low")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "score", "low", "high", "decision"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["low"] < record["score"] < record["high"] and record["decision"] == "abstain"
    return "PASS" if ok else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "abstain"}
invalid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "force_1"}
incomplete = {**valid}
incomplete.pop("low")
print(*(assess(valid), assess(invalid), assess(incomplete)))
`,
          output: `PASS REJECT_FORCE_LABEL MISSING:low`,
        },
      },
      {
        id: "S34-T4-B-E3",
        subtopicId: "S34-T4-B",
        kind: "transfer",
        instruction:
          "S34-T4-B-E3 · Fail-closed: CONTINUE / REJECT_FORCE_LABEL / REQUEST_ABSTAIN_BAND. Repara missing y predicado.",
        hint: "Sin low → REQUEST_ABSTAIN_BAND; no fuerces 0/1 en zona gris.",
        hints: [
          "Sin low → REQUEST_ABSTAIN_BAND; no fuerces 0/1 en zona gris.",
          "CONTINUE solo con score en banda y decision abstain.",
        ],
        edgeCases: [
          "falta low",
          "fixture adverso: decision=force_1 en banda",
          "CASO-LIM-034-4B es sintético",
        ],
        tests: "Salida: `CONTINUE REJECT_FORCE_LABEL REQUEST_ABSTAIN_BAND`.",
        feedback:
          "S34-T4-B-E3: cierra el arco CP-N3-B: ¿cómo protege la abstención la promesa de «ranking para humanos, no auto-fraude»?",
        starterCode: {
          language: "python",
          title: "s34-t4-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_FORCE_LABEL
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "score", "low", "high", "decision"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["decision"] == "force_1" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "abstain"}
invalid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "force_1"}
uncertain = {**valid}
uncertain.pop("low")
print(*[decide(x) for x in (valid, invalid, uncertain)])
`,
        },
        solutionCode: {
          language: "python",
          title: "s34-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "score", "low", "high", "decision"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_ABSTAIN_BAND"
    ok = record["low"] < record["score"] < record["high"] and record["decision"] == "abstain"
    return "CONTINUE" if ok else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "abstain"}
invalid = {"case_id": "CASO-LIM-034-4B", "score": 0.5, "low": 0.3, "high": 0.7, "decision": "force_1"}
uncertain = {**valid}
uncertain.pop("low")
results = [decide(x) for x in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FORCE_LABEL", "REQUEST_ABSTAIN_BAND"]
`,
          output: `CONTINUE REJECT_FORCE_LABEL REQUEST_ABSTAIN_BAND`,
        },
      },
    ],
  },
  youDo: {
    title: "Workbench: métricas + thr versionado + abstain (cierre CP-N3-B)",
    context:
      "Integra, sobre el mismo mini-set sintético CASO-LIM-034 de Red Andina (cinco scores del baseline de S33 y labels `needs_review`), el flujo completo del Relationship Investigation Workbench que **cierra CP-N3-B**: confusión y F1 → precision@k bajo capacidad → Brier y reliability_bin → thr-v1 por costo y capacidad → decide() con abstain. El thr **no se copia** del demo de cuatro puntos de T4-A: lo descubres con búsqueda bajo capacidad 2 (con cinco puntos el óptimo suele ser 0.9, costo 10). Sin auto-fraude ni PII real. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.",
    objectives: [
      "Calcular confusión (TP/FP/FN/TN), precision, recall y F1 con el thr elegido por búsqueda",
      "Reportar precision@k bajo capacidad y respetar n_review ≤ CAPACITY",
      "Calcular Brier medio y un bin de reliability (mean_p vs frecuencia observada)",
      "Elegir thr-v1 por costo/capacidad (sin hardcodear 0.5 ni copiar 0.6) y aplicar banda de abstención en 0.55",
    ],
    requirements: [
      "accuracy_only=False en el reporte final",
      "Sin fraud label automático; scores solo priorizan humanos",
      "thr_id versionado (thr-v*) y cost documentado; thr hallado por búsqueda (no thr fijo 0.5 ni copiar 0.6 del demo T4-A)",
      "Incluir brier y al menos un reliability_bin en el reporte",
      "Datos sintéticos CASO-LIM-034; comentarios en español profesional",
      "n_review ≤ CAPACITY y decision_sample == abstain para score 0.55 en banda 0.3–0.7",
    ],
    starterCode: `# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)
# Flujo: confusión → precision@k → Brier/reliability → thr-v* → abstain
# Defectos intencionales del starter (corrígelos):
#  1) choose_thr fija thr=0.5 sin buscar por costo bajo capacidad
#  2) decide fuerza "review" en la banda gris (debe ser abstain)
#  3) el reporte deja accuracy_only=True y thr_id="default"
# Pista: con 5 scores y capacity=2 el thr óptimo suele ser 0.9 (costo 10),
# no el 0.6 del demo de 4 puntos de T4-A. Corre la búsqueda.
# No inventes PII ni auto-fraude. Matching de identidad ≠ parentesco ni fraude.

SCORES = [0.1, 0.4, 0.55, 0.6, 0.9]
LABELS = [0, 0, 1, 0, 1]  # needs_review sintético (no es etiqueta de fraude)
CAPACITY = 2
C_FP, C_FN = 2, 10
LOW, HIGH = 0.3, 0.7


def confusion_counts(y, pred):
    tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
    fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
    fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
    tn = sum(a == 0 and b == 0 for a, b in zip(y, pred))
    return {"tp": tp, "fp": fp, "fn": fn, "tn": tn}


def precision_recall_f1(tp, fp, fn):
    p = tp / (tp + fp) if (tp + fp) else 0.0
    r = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * p * r / (p + r) if (p + r) else 0.0
    return {"precision": p, "recall": r, "f1": f1}


def precision_at_k(labels_ranked, k):
    return sum(labels_ranked[:k]) / k if k else 0.0


def brier_mean(ps, ys):
    return sum((p - y) ** 2 for p, y in zip(ps, ys)) / len(ps)


def reliability_bin(ps, ys, lo, hi):
    pair = [(p, y) for p, y in zip(ps, ys) if lo <= p < hi]
    if not pair:
        return None
    mean_p = sum(p for p, _ in pair) / len(pair)
    freq = sum(y for _, y in pair) / len(pair)
    return {"mean_p": mean_p, "freq": freq, "n": len(pair)}


def choose_thr(scores, labels, c_fp, c_fn, capacity):
    # DEFECT: thr fijo sin optimizar costo bajo capacidad
    thr = 0.5
    pred = [1 if s >= thr else 0 for s in scores]
    fp = sum(p == 1 and y == 0 for p, y in zip(pred, labels))
    fn = sum(p == 0 and y == 1 for p, y in zip(pred, labels))
    return thr, fp * c_fp + fn * c_fn


def decide(score, low=LOW, high=HIGH):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "review"  # DEFECT: en banda debe ser abstain


def build_workbench_report(scores, labels, capacity=CAPACITY):
    thr, cost = choose_thr(scores, labels, C_FP, C_FN, capacity)
    pred = [1 if s >= thr else 0 for s in scores]
    ranked = [lab for _, lab in sorted(zip(scores, labels), key=lambda t: -t[0])]
    conf = confusion_counts(labels, pred)
    prf = precision_recall_f1(conf["tp"], conf["fp"], conf["fn"])
    rel = reliability_bin(scores, labels, 0.5, 1.0)
    report = {
        "case": "CASO-LIM-034",
        "confusion": conf,
        "metrics": prf,
        "precision_at_k": precision_at_k(ranked, capacity),
        "brier": round(brier_mean(scores, labels), 4),
        "reliability_bin": rel,
        "thr": thr,
        "thr_id": "default",  # DEFECT: versiona thr-v1
        "cost": cost,
        "n_review": sum(pred),
        "decision_sample": decide(0.55),
        "accuracy_only": True,  # DEFECT: debe ser False
        "fraud_label": False,
    }
    return report


if __name__ == "__main__":
    report = build_workbench_report(SCORES, LABELS, capacity=CAPACITY)
    assert report["accuracy_only"] is False
    assert report["fraud_label"] is False
    assert str(report["thr_id"]).startswith("thr-v")
    assert report["decision_sample"] == "abstain"
    assert report["n_review"] <= CAPACITY
    assert report["reliability_bin"] is not None
    print(
        report["precision_at_k"],
        report["decision_sample"],
        report["thr_id"],
        report["thr"],
        report["brier"],
    )
`,
    portfolioNote:
      "Cierre CP-N3-B: adjunta el thr-v* que devuelva tu búsqueda sobre los cinco scores (no el del demo de cuatro puntos), un reliability_bin o Brier, capacidad 2 y un párrafo en español profesional: el score prioriza revisión humana y no es auto-fraude ni prueba de parentesco. En S35 conectarás este reporte con explainability y equidad por slice.",
    rubric: [
      {
        criterion:
          "Reporte de métricas + thr versionado + abstención alineado al workbench (sin auto-fraude)",
        weight: "25%",
      },
      { criterion: "Correctitud técnica de confusión, Brier y choose_thr por búsqueda", weight: "20%" },
      {
        criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude",
        weight: "20%",
      },
      { criterion: "Pruebas o casos de borde documentados (overload, banda, missing)", weight: "15%" },
      { criterion: "Código legible y límites claros (capacidad, costos)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "thr versionado + reliability/Brier + capacidad en el reporte", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Con desbalance fuerte en una cola de revisión, conviene priorizar:",
        options: ["Solo accuracy", "Precision/recall o PR-AUC (familia PR) de la cola", "Solo loss de train", "Color del dashboard"],
        correctIndex: 1,
        explanation:
          "Accuracy engaña con prevalencia baja; P/R y la familia PR describen mejor la cola de revisión.",
      },
      {
        question: "Resamplear todo el dataset antes de CV:",
        options: ["Es best practice", "Elimina necesidad de thr", "Garantiza calibración", "Introduce leakage y métricas infladas"],
        correctIndex: 3,
        explanation:
          "El resampling debe vivir dentro del fold de train; hacerlo global contamina validación.",
      },
      {
        question: "Un calibrador (Platt/afín/isotonic) debe ajustarse:",
        options: ["En un set de calibración fuera de muestra (holdout versionado)", "En el test final", "En el mismo train del modelo base sin holdout", "Solo en producción sin logs"],
        correctIndex: 0,
        explanation:
          "Fit de calibración en holdout evita autoengaño de reliability; clip solo no es calibración.",
      },
      {
        question: "Score en banda low–high del workbench debe:",
        options: ["Forzar 1", "Forzar 0", "Abstener según política (abstain)", "Borrar el caso"],
        correctIndex: 2,
        explanation:
          "La abstención es salida de primera clase para zona gris; no fabricar labels 0/1.",
      },
      {
        question: "El umbral de cola se elige por…",
        options: ["default 0.5 de la librería", "costo/capacidad y se versiona (thr-vN)", "maximizar solo recall sin carga", "calibrar en el mismo test final"],
        correctIndex: 1,
        explanation:
          "Thr versionado por costo y capacidad; calibración en holdout distinto del test.",
      },
      {
        question: "Brier score sobre un conjunto es:",
        options: ["La accuracy del top-k", "El ratio n0/n1", "El número de FP en la confusión", "La media de (p − y)² sobre los casos"],
        correctIndex: 3,
        explanation:
          "Brier promedia el error cuadrático entre probabilidad predicha y etiqueta; más bajo es mejor entre modelos comparables.",
      },
      {
        question: "Con clase positiva rara en cola de revisión, ¿por qué preferir familia PR (precision-recall / AP) sobre ROC-AUC sola?",
        options: ["Porque ROC puede verse optimista cuando los negativos dominan; PR enfoca la cola positiva", "Porque ROC ignora siempre el thr", "Porque PR no necesita labels", "Porque sklearn prohíbe ROC"],
        correctIndex: 0,
        explanation:
          "Con prevalencia baja, muchos verdaderos negativos inflan ROC; PR y average precision miran la calidad de la cola positiva que el workbench prioriza.",
      },
      {
        question: "Si precision@k es alta pero load > capacity del equipo de analistas, el workbench debe:",
        options: ["Ignorar capacity y maximizar recall", "Auto-etiquetar el excedente como fraude", "Tratar overload como breach operativo (reevaluar thr / k) aunque la métrica de top-k luzca bien", "Bajar k a cero y cerrar el tablero"],
        correctIndex: 2,
        explanation:
          "Una cola brillante en el papel que satura a los humanos no es operable: capacity y thr versionado van juntos.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn model evaluation",
        url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        note: "P/R/F, ROC, PR, Brier",
      },
      {
        label: "sklearn calibration",
        url: "https://scikit-learn.org/stable/modules/calibration.html",
        note: "Platt/isotonic holdout",
      },
      {
        label: "sklearn precision_recall_curve",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html",
        note: "PR curve para desbalance",
      },
      {
        label: "Google ML Crash Course — classification",
        url: "https://developers.google.com/machine-learning/crash-course/classification",
        note: "Umbrales y métricas",
      },
      {
        label: "Google Rules of ML",
        url: "https://developers.google.com/machine-learning/guides/rules-of-ml",
        note: "Métricas honestas y slices",
      },
      {
        label: "Imbalanced-learn docs",
        url: "https://imbalanced-learn.org/stable/",
        note: "Resampling dentro de pipelines",
      },
      {
        label: "NIST AI RMF (risk context)",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Riesgo y uso responsable",
      },
    ],
    books: [
      { label: "Evaluating Machine Learning Models", note: "Costos, thr y desbalance" },
      { label: "Fairness and Machine Learning (Barocas et al.)", note: "Slices y daño por cohorte" },
    ],
    courses: [
      {
        label: "Coursera — ML specialization metrics",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        note: "Evaluación supervisada",
      },
      {
        label: "deeplearning.ai — ML courses",
        url: "https://www.deeplearning.ai/",
        note: "Calibración y métricas",
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
    ],
  },
}
