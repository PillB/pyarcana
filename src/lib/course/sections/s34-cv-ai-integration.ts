import type { CourseSection } from '../../types'

export const section34: CourseSection = {
  id: "cv-ai-integration",
  index: 34,
  title: "Métricas, desbalance, calibración y umbrales",
  shortTitle: "Métricas y umbrales",
  tagline: "Relationship Investigation Workbench: grafo + evidencia con ranking calibrado para revisión; no etiqueta fraude automáticamente",
  estimatedHours: 19,
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
    { text: "Aplicar abstención y sensibilidad por slice" }
  ],
  theory: [
    {
      heading: "Cierre CP-N3-B: Relationship Investigation Workbench",
      paragraphs: [
        "Esta sección **cierra CP-N3-B** integrando grafo (S31), features (S32) y baselines (S33) con **métricas de ranking**, **calibración** y **umbrales por capacidad** de revisión humana en Red Andina (ficticia).",
        "Producto incremental: workbench que **prioriza cola y explica**; **no** imprime `fraud=true`. Entrada: scores y labels sintéticos `needs_review`; salida: precision@k, Brier, thr versionado y banda de abstención.",
        "Orden: **T1 métricas** → **T2 desbalance** → **T3 calibración** → **T4 decisión**. Id legacy `cv-ai-integration` se conserva; **no** hay YOLO ni computer vision en V3 de esta sección. ER/matching ≠ parentesco ni fraude."
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-B",
        content:
          "Cierre workbench: ranking calibrado para humanos. ER/matching ≠ parentesco ni fraude. Sin PII real.",
      },
    },
    {
      heading: "confusion matrix, precision/recall/F y PR-AUC",
      subtopicId: "S34-T1-A",
      paragraphs: [
        "Con **desbalance**, accuracy engaña. **Precision, recall, Fβ** y el área bajo la curva **precision-recall** describen mejor la cola de revisión que un solo % de aciertos — la mayoría de pares no necesitan review.",
        "Contrato: entrada `y` y `pred` binarios; salida TP/FP/FN/TN y F1. Error: reportar **solo accuracy** con prevalencia baja. Criterio: confusion **completa** antes de elegir thr.",
        "Aplicación a `CASO-LIM-034`: `y=[1,0] pred=[1,1]` produce FP; F1 con P=R=0.5 es 0.5. El workbench documenta **costos distintos** de FP y FN (cola vs miss)."
      ],
      code: {
        language: 'python',
        title: "confusion.py",
        code: `def confusion_counts(y, pred):
    tp = sum(1 for a, b in zip(y, pred) if a == 1 and b == 1)
    fp = sum(1 for a, b in zip(y, pred) if a == 0 and b == 1)
    fn = sum(1 for a, b in zip(y, pred) if a == 1 and b == 0)
    return tp, fp, fn

print("tp_fp_fn", confusion_counts([1, 0], [1, 1]))
print("accuracy_only", False)`,
        output: `tp_fp_fn (1, 1, 0)
accuracy_only False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T1-A: confusion antes de accuracy. Breach → REJECT_ACCURACY_ONLY; falta counts → REQUEST_CONFUSION.",
      },
    },
    {
      heading: "top-k y carga de revisión",
      subtopicId: "S34-T1-B",
      paragraphs: [
        "**precision@k** y **recall@k** miden la calidad de los **k primeros** de la cola. Si alertas **> capacidad**, la carga satura al equipo: el thr debe **bajar el volumen**, no solo maximizar recall a costa de overload.",
        "Contrato: entrada labels top-k y capacidad; salida precision@k y flag de overload. Error: **ignorar capacidad operativa**. Criterio: `k` alineado a capacidad diaria del clerical review.",
        "Aplicación a `CASO-LIM-034`: top-3 labels `[1,0,1]` → precision@3=2/3; 50 alertas vs capacidad 10 → overload y thr se reevalúa."
      ],
      code: {
        language: 'python',
        title: "topk.py",
        code: `def precision_at_k(labels, k):
    return sum(labels[:k]) / k

def queue_overload(load, cap):
    return load > cap

print("precision_at_k", round(precision_at_k([1, 0, 1], 3), 3))
print("overload", queue_overload(50, 10))
print("fraud_label", False)`,
        output: `precision_at_k 0.667
overload True
fraud_label False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T1-B: precision@k + capacidad. Breach → REJECT_QUEUE_OVERLOAD; falta cap → REQUEST_CAPACITY.",
      },
    },
    {
      heading: "class weights y resampling dentro de CV",
      subtopicId: "S34-T2-A",
      paragraphs: [
        "**Class weights** o **resampling solo dentro del fold de train** evitan leakage. Resamplear **todo** el dataset antes de CV infla métricas y **miente** sobre producción.",
        "Contrato: entrada conteos `n0/n1`; salida ratio de pesos y flag de política CV-safe. Error: **oversample global**. Criterio: minority count documentado **sin** tocar test/holdout.",
        "Aplicación a `CASO-LIM-034`: `n0=9 n1=1` → weight ratio 9; política `resample_global=False` en el pipeline del workbench."
      ],
      code: {
        language: 'python',
        title: "weights.py",
        code: `def weight_ratio(n0, n1):
    return n0 / n1

print("weight_ratio", weight_ratio(9, 1))
print("resample_global", False)
print("cv_safe", True)`,
        output: `weight_ratio 9.0
resample_global False
cv_safe True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T2-A: weights o resample solo en train fold. Breach → REJECT_LEAKY_RESAMPLE.",
      },
    },
    {
      heading: "prevalencia y métricas engañosas",
      subtopicId: "S34-T2-B",
      paragraphs: [
        "Si la **prevalencia** cae, la misma especificidad produce **peor precision**. Un clasificador **all-negative** luce genial en accuracy cuando la clase positiva es rara — y no prioriza ninguna cola.",
        "Contrato: entrada prevalencia y política de reporte; salida base rate y advertencia de precision. Error: comparar precision entre periodos **sin** base rate. Criterio: reportar prevalencia **junto** a P/R.",
        "Aplicación a `CASO-LIM-034`: 25/1000=0.025; all-neg accuracy≈0.975 engaña. El workbench prefiere **PR** y carga de cola."
      ],
      code: {
        language: 'python',
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
        title: "Contrato local",
        content:
          "S34-T2-B: base rate visible. Breach → REJECT_PREVALENCE_BLIND; falta prev → REQUEST_BASE_RATE.",
      },
    },
    {
      heading: "reliability curves y Brier",
      subtopicId: "S34-T3-A",
      paragraphs: [
        "**Brier** (media de `(p−y)²`) y **reliability** (media de `p` vs frecuencia en bins) miden si el score se puede leer como probabilidad de **priorización**, **no** de culpa o fraude.",
        "Contrato: entrada `p` y `y`; salida Brier y bin mean vs freq. Error: calibrar a ojo **sin** holdout. Criterio: menor Brier es mejor entre modelos comparables con misma tarea.",
        "Aplicación a `CASO-LIM-034`: `p=1,y=1` → Brier 0; un bin con mean p=0.8 y freq=0.5 muestra **mala reliability**."
      ],
      code: {
        language: 'python',
        title: "brier.py",
        code: `def brier_one(p, y):
    return (p - y) ** 2

print("brier", brier_one(1.0, 1))
print("mean_p", 0.8, "freq", 0.5)
print("calibrated", False)`,
        output: `brier 0.0
mean_p 0.8 freq 0.5
calibrated False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T3-A: Brier + reliability. Breach → REJECT_UNCALIBRATED; falta scores → REQUEST_BRIER.",
      },
    },
    {
      heading: "calibradores y evaluación fuera de muestra",
      subtopicId: "S34-T3-B",
      paragraphs: [
        "**Platt** o **isotonic** se ajustan en un set de calibración **distinto** del train del modelo base. Evaluar calibración en el mismo set de fit es **autoengaño**.",
        "Contrato: entrada raw scores y nombre de calibrador; salida scores clipados/calibrados misma longitud. Error: fit calibrator en **test final**. Criterio: holdout de calibración **versionado**.",
        "Aplicación a `CASO-LIM-034`: clip `1.5→1.0` y `-0.2→0.0`; `calibrator_set=holdout_v1`; raw y cal tienen misma longitud."
      ],
      code: {
        language: 'python',
        title: "calibrator.py",
        code: `def clip_scores(raw, lo=0.0, hi=1.0):
    return [min(hi, max(lo, x)) for x in raw]

raw = [1.5, -0.2, 0.4]
cal = clip_scores(raw)
print(cal)
print("calibrator_set", "holdout_v1")
print("same_len", len(raw) == len(cal))`,
        output: `[1.0, 0.0, 0.4]
calibrator_set holdout_v1
same_len True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T3-B: cal en holdout. Breach → REJECT_IN_SAMPLE_CAL; falta set → REQUEST_CAL_SET.",
      },
    },
    {
      heading: "threshold por costo/capacidad",
      subtopicId: "S34-T4-A",
      paragraphs: [
        "El **umbral** se elige por **costo** (`fp*c_fp+fn*c_fn`) y por **capacidad de la cola**, no por un default 0.5 de librería. El thr se **versiona** (`thr-v1`) para auditoría y rollback.",
        "Contrato: entrada scores, costos, k deseado; salida thr que deja k en review y costo total. Error: thr fijo **sin** costos. Criterio: config thr versionada en el workbench.",
        "Aplicación a `CASO-LIM-034`: scores `[0.1,0.4,0.6,0.9]` con thr que deja 2 en review; costo `fp*2+fn*10` documentado."
      ],
      code: {
        language: 'python',
        title: "threshold.py",
        code: `def n_in_review(scores, thr):
    return sum(1 for s in scores if s >= thr)

def review_cost(n_fp, n_fn, c_fp=2, c_fn=10):
    return n_fp * c_fp + n_fn * c_fn

thr = 0.6
print("thr", thr, "n_review", n_in_review([0.1, 0.4, 0.6, 0.9], thr))
print("cost", review_cost(3, 1))
print("thr_id", "thr-v1")`,
        output: `thr 0.6 n_review 2
cost 16
thr_id thr-v1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T4-A: thr por costo/capacidad versionado. Breach → REJECT_FIXED_THR; falta costos → REQUEST_COST_MATRIX.",
      },
    },
    {
      heading: "abstención, slices y sensibilidad",
      subtopicId: "S34-T4-B",
      paragraphs: [
        "Banda **low/high de abstención** evita forzar labels 0/1 en zona gris. **Sensibilidad a thr** y métricas **por slice** detectan degradación local antes de promover el modelo — y **nunca** convierten score en auto-fraude.",
        "Contrato: entrada score, low, high; salida `review|skip|abstain` y dict de slice metrics. Error: **forzar 0/1** en banda. Criterio: abstain es **primera clase** del producto.",
        "Aplicación a `CASO-LIM-034`: score 0.5 con low=0.3 high=0.7 → `abstain`; thr 0.5 vs 0.6 cambia `n_pos_pred` en sensibilidad."
      ],
      code: {
        language: 'python',
        title: "abstain.py",
        code: `def decide(score, low=0.3, high=0.7):
    if score < low:
        return "skip"
    if score > high:
        return "review"
    return "abstain"
print(decide(0.5))
print("force_label", False)
print("ok", True)`,
        output: `abstain
force_label False
ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S34-T4-B: banda abstain. Breach → REJECT_FORCE_LABEL; falta band → REQUEST_ABSTAIN_BAND.",
      },
    }
  ],
  iDo: {
    intro: "S34 · Te muestro métricas, desbalance, calibración y umbrales del workbench sobre fixtures sintéticos de Red Andina.",
    steps: [
      {
        demoId: "S34-T1-A-DEMO",
        subtopicId: "S34-T1-A",
        environment: "local-python",
        description: "Calcula TP/FP/FN sobre y y pred sintéticos y rechaza accuracy como única métrica.",
        code: {
          language: 'python',
          title: "cm_demo.py",
          code: `def fp_count(y, p):
    return sum(a == 0 and b == 1 for a, b in zip(y, p))

print('fp', fp_count([1, 0], [1, 1]))
print('accuracy_only', False)
print('ok', True)`,
          output: `fp 1
accuracy_only False
ok True`,
        },
        why: "La matriz de confusión ancla precision/recall antes de elegir umbral de cola de revisión.",
      },
      {
        demoId: "S34-T1-B-DEMO",
        subtopicId: "S34-T1-B",
        environment: "local-python",
        description: "precision@k y detección de overload cuando alertas superan capacidad de analistas.",
        code: {
          language: 'python',
          title: "topk_demo.py",
          code: `def precision_at_k(labels, k):
    return sum(labels[:k]) / k

print(round(precision_at_k([1, 0, 1], 3), 3))
print('overload', 50 > 10)
print('ok', True)`,
          output: `0.667
overload True
ok True`,
        },
        why: "Top-k alinea ranking con la capacidad real del equipo de revisión en el workbench.",
      },
      {
        demoId: "S34-T2-A-DEMO",
        subtopicId: "S34-T2-A",
        environment: "local-python",
        description: "Weight ratio n0/n1 y bandera de que el resample global está prohibido fuera de CV.",
        code: {
          language: 'python',
          title: "w_demo.py",
          code: `def weight_ratio(n0, n1):
    return n0 / n1

print(weight_ratio(9, 1))
print('resample_global', False)
print('ok', True)`,
          output: `9
resample_global False
ok True`,
        },
        why: "Pesos o resample solo en train fold evitan leakage y métricas infladas.",
      },
      {
        demoId: "S34-T2-B-DEMO",
        subtopicId: "S34-T2-B",
        environment: "local-python",
        description: "Prevalencia 0.025 y accuracy all-negative engañosa para la clase rara.",
        code: {
          language: 'python',
          title: "prev_demo.py",
          code: `def prevalence(pos, n):
    return pos / n

print(prevalence(25, 1000))
print('all_neg_acc', round(1 - 0.025, 3))
print('ok', True)`,
          output: `0.025
all_neg_acc 0.975
ok True`,
        },
        why: "Sin base rate, precision no es comparable entre periodos ni entre slices.",
      },
      {
        demoId: "S34-T3-A-DEMO",
        subtopicId: "S34-T3-A",
        environment: "local-python",
        description: "Brier de un caso perfecto y contraste con bin de reliability desalineado.",
        code: {
          language: 'python',
          title: "brier_demo.py",
          code: `def brier_one(p, y):
    return (p - y) ** 2

print(brier_one(1.0, 1))
print('calibrated', False)
print('ok', True)`,
          output: `0.0
calibrated False
ok True`,
        },
        why: "Brier y reliability dicen si el score se puede leer como probabilidad de priorización.",
      },
      {
        demoId: "S34-T3-B-DEMO",
        subtopicId: "S34-T3-B",
        environment: "local-python",
        description: "Clip de scores a [0,1] y nombre del set de calibración holdout versionado.",
        code: {
          language: 'python',
          title: "cal_demo.py",
          code: `def clip_scores(raw):
    return [min(1.0, max(0.0, x)) for x in raw]

print(clip_scores([1.5, -0.2])[:2])
print('calibrator_set', 'holdout_v1')
print('ok', True)`,
          output: `[1.0, 0.0]
calibrator_set holdout_v1
ok True`,
        },
        why: "Calibrar fuera de muestra evita autoengaño y training-serving skew de probabilidades.",
      },
      {
        demoId: "S34-T4-A-DEMO",
        subtopicId: "S34-T4-A",
        environment: "local-python",
        description: "Umbral thr-v1 que deja dos casos en review y reporta costo fp/fn.",
        code: {
          language: 'python',
          title: "thr_demo.py",
          code: `def n_in_review(scores, thr):
    return sum(1 for s in scores if s >= thr)

print('n_review', n_in_review([0.1, 0.4, 0.6, 0.9], 0.6))
print('thr_id', 'thr-v1')
print('ok', True)`,
          output: `n_review 2
thr_id thr-v1
ok True`,
        },
        why: "El thr se elige por costo y capacidad y se versiona para auditoría del workbench.",
      },
      {
        demoId: "S34-T4-B-DEMO",
        subtopicId: "S34-T4-B",
        environment: "local-python",
        description: "Decisión abstain en banda gris 0.3–0.7 sin forzar label 0/1.",
        code: {
          language: 'python',
          title: "abs_demo.py",
          code: `def decide(score, low=0.3, high=0.7):
    if score < low:
        return 'skip'
    if score > high:
        return 'review'
    return 'abstain'

print(decide(0.5))
print('force_label', False)
print('ok', True)`,
          output: `abstain
force_label False
ok True`,
        },
        why: "La abstención es una salida de primera clase para casos inciertos en la cola.",
      }
    ],
  },
  weDo: {
    intro: "S34 · Laboratorio Relationship Investigation Workbench (cierre CP-N3-B): 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra fail-closed con fixtures peruanos sintéticos.",
    steps: [
      {
        id: "S34-T1-A-E1",
        subtopicId: "S34-T1-A",
        kind: "guided",
        instruction: "S34-T1-A-E1 · Calcula el contrato de `confusion matrix, precision/recall/F y PR-AUC` sobre `CASO-LIM-034-1A`. La entrada es el dict completo del starter; la operación debe demostrar counts de confusión con accuracy_only=False. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_ACCURACY_ONLY` en E2.",
        hint: "Relaciona los campos `tp, fp, fn, accuracy_only` con la regla explicada en S34-T1-A.",
        hints: [
          "Relaciona los campos `tp, fp, fn, accuracy_only` con la regla explicada en S34-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva counts de confusión con accuracy_only=False; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta tp", "fixture adverso: counts de confusión con accuracy_only=False", "CASO-LIM-034-1A es sintético"],
        tests: "El fixture `CASO-LIM-034-1A` satisface un predicado de dominio real; imprime `S34-T1-A PASS` y el assert booleano pasa.",
        feedback: "S34-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ACCURACY_ONLY y por qué faltar tp exige REQUEST_CONFUSION.",
        starterCode: {
          language: 'python',
          title: "s34-t1-a-e1.py",
          code: `# CASO-LIM-034 · confusion matrix not accuracy-only
# DEFECT: PASS si accuracy_only True
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
meets_contract = record["accuracy_only"] is True
status = "PASS" if meets_contract else "REJECT_ACCURACY_ONLY"
print("S34-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
meets_contract = record["accuracy_only"] is False and record["tp"] + record["fp"] + record["fn"] >= 1
status = "PASS" if meets_contract else "REJECT_ACCURACY_ONLY"
print("S34-T1-A", status)
assert meets_contract is True
` ,
          output: `S34-T1-A PASS` ,
        },
      },
      {
        id: "S34-T1-A-E2",
        subtopicId: "S34-T1-A",
        kind: "independent",
        instruction: "S34-T1-A-E2 · Modela tres rutas de `confusion matrix, precision/recall/F y PR-AUC`: fixture válido, fixture adverso y registro sin `tp`. Entrada: dict con case_id, tp, fp, fn, accuracy_only. Salidas exactas: `PASS`, `REJECT_ACCURACY_ONLY`, `MISSING:tp`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a tp debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a tp debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T1-A: counts de confusión con accuracy_only=False. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta tp", "fixture adverso: counts de confusión con accuracy_only=False", "CASO-LIM-034-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `tp` ausente y produce exactamente `PASS REJECT_ACCURACY_ONLY MISSING:tp`.",
        feedback: "S34-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ACCURACY_ONLY y por qué faltar tp exige REQUEST_CONFUSION.",
        starterCode: {
          language: 'python',
          title: "s34-t1-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_ACCURACY_ONLY
# DEFECT: PASS con accuracy como única métrica
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'tp', 'fp', 'fn', 'accuracy_only'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_only"] is True else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
invalid = {"case_id": "CASO-LIM-034-1A", **{'tp': 0, 'fp': 0, 'fn': 0, 'accuracy_only': True}}
incomplete = {**valid}
incomplete.pop("tp")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'tp', 'fp', 'fn', 'accuracy_only'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_only"] is False and record["tp"] + record["fp"] + record["fn"] >= 1 else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
invalid = {"case_id": "CASO-LIM-034-1A", **{'tp': 0, 'fp': 0, 'fn': 0, 'accuracy_only': True}}
incomplete = {**valid}
incomplete.pop("tp")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_ACCURACY_ONLY MISSING:tp` ,
        },
      },
      {
        id: "S34-T1-A-E3",
        subtopicId: "S34-T1-A",
        kind: "transfer",
        instruction: "S34-T1-A-E3 · Contrasta fallo cerrado para `confusion matrix, precision/recall/F y PR-AUC` con tres fixtures distintos. `CASO-LIM-034-1A` debe continuar, el adverso debe devolver `REJECT_ACCURACY_ONLY` y la ausencia de `tp` debe devolver `REQUEST_CONFUSION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CONFUSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CONFUSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró counts de confusión con accuracy_only=False; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta tp", "fixture adverso: counts de confusión con accuracy_only=False", "CASO-LIM-034-1A es sintético"],
        tests: "Fixtures `CASO-LIM-034-1A`, adverso y sin `tp` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ACCURACY_ONLY y por qué faltar tp exige REQUEST_CONFUSION.",
        starterCode: {
          language: 'python',
          title: "s34-t1-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_ACCURACY_ONLY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'tp', 'fp', 'fn', 'accuracy_only'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["accuracy_only"] is True else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
invalid = {"case_id": "CASO-LIM-034-1A", **{'tp': 0, 'fp': 0, 'fn': 0, 'accuracy_only': True}}
uncertain = {**valid}
uncertain.pop("tp")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'tp', 'fp', 'fn', 'accuracy_only'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CONFUSION"
    return "CONTINUE" if record["accuracy_only"] is False and record["tp"] + record["fp"] + record["fn"] >= 1 else "REJECT_ACCURACY_ONLY"

valid = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
invalid = {"case_id": "CASO-LIM-034-1A", **{'tp': 0, 'fp': 0, 'fn': 0, 'accuracy_only': True}}
uncertain = {**valid}
uncertain.pop("tp")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_ACCURACY_ONLY", "REQUEST_CONFUSION"]
` ,
          output: `CONTINUE REJECT_ACCURACY_ONLY REQUEST_CONFUSION` ,
        },
      },
      {
        id: "S34-T1-B-E1",
        subtopicId: "S34-T1-B",
        kind: "guided",
        instruction: "S34-T1-B-E1 · Calcula el contrato de `top-k y carga de revisión` sobre `CASO-LIM-034-1B`. La entrada es el dict completo del starter; la operación debe demostrar precision@k con load dentro de capacidad. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_QUEUE_OVERLOAD` en E2.",
        hint: "Relaciona los campos `precision_at_k, load, capacity` con la regla explicada en S34-T1-B.",
        hints: [
          "Relaciona los campos `precision_at_k, load, capacity` con la regla explicada en S34-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva precision@k con load dentro de capacidad; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta capacity", "fixture adverso: precision@k con load dentro de capacidad", "CASO-LIM-034-1B es sintético"],
        tests: "El fixture `CASO-LIM-034-1B` satisface un predicado de dominio real; imprime `S34-T1-B PASS` y el assert booleano pasa.",
        feedback: "S34-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QUEUE_OVERLOAD y por qué faltar capacity exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s34-t1-b-e1.py",
          code: `# CASO-LIM-034 · top-k review load vs capacity
# DEFECT: PASS si load > capacity
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
meets_contract = record["load"] > record["capacity"]
status = "PASS" if meets_contract else "REJECT_QUEUE_OVERLOAD"
print("S34-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
meets_contract = record["load"] <= record["capacity"] and 0 <= record["precision_at_k"] <= 1
status = "PASS" if meets_contract else "REJECT_QUEUE_OVERLOAD"
print("S34-T1-B", status)
assert meets_contract is True
` ,
          output: `S34-T1-B PASS` ,
        },
      },
      {
        id: "S34-T1-B-E2",
        subtopicId: "S34-T1-B",
        kind: "independent",
        instruction: "S34-T1-B-E2 · Modela tres rutas de `top-k y carga de revisión`: fixture válido, fixture adverso y registro sin `capacity`. Entrada: dict con case_id, precision_at_k, load, capacity. Salidas exactas: `PASS`, `REJECT_QUEUE_OVERLOAD`, `MISSING:capacity`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a capacity debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a capacity debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T1-B: precision@k con load dentro de capacidad. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta capacity", "fixture adverso: precision@k con load dentro de capacidad", "CASO-LIM-034-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `capacity` ausente y produce exactamente `PASS REJECT_QUEUE_OVERLOAD MISSING:capacity`.",
        feedback: "S34-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QUEUE_OVERLOAD y por qué faltar capacity exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s34-t1-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_QUEUE_OVERLOAD
# DEFECT: PASS con cola de revisión sobrecargada
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'precision_at_k', 'load', 'capacity'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["load"] > record["capacity"] else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
invalid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 50, 'capacity': 10}}
incomplete = {**valid}
incomplete.pop("capacity")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'precision_at_k', 'load', 'capacity'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["load"] <= record["capacity"] and 0 <= record["precision_at_k"] <= 1 else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
invalid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 50, 'capacity': 10}}
incomplete = {**valid}
incomplete.pop("capacity")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_QUEUE_OVERLOAD MISSING:capacity` ,
        },
      },
      {
        id: "S34-T1-B-E3",
        subtopicId: "S34-T1-B",
        kind: "transfer",
        instruction: "S34-T1-B-E3 · Contrasta fallo cerrado para `top-k y carga de revisión` con tres fixtures distintos. `CASO-LIM-034-1B` debe continuar, el adverso debe devolver `REJECT_QUEUE_OVERLOAD` y la ausencia de `capacity` debe devolver `REQUEST_CAPACITY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CAPACITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró precision@k con load dentro de capacidad; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta capacity", "fixture adverso: precision@k con load dentro de capacidad", "CASO-LIM-034-1B es sintético"],
        tests: "Fixtures `CASO-LIM-034-1B`, adverso y sin `capacity` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QUEUE_OVERLOAD y por qué faltar capacity exige REQUEST_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s34-t1-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_QUEUE_OVERLOAD
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'precision_at_k', 'load', 'capacity'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["load"] > record["capacity"] else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
invalid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 50, 'capacity': 10}}
uncertain = {**valid}
uncertain.pop("capacity")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'precision_at_k', 'load', 'capacity'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CAPACITY"
    return "CONTINUE" if record["load"] <= record["capacity"] and 0 <= record["precision_at_k"] <= 1 else "REJECT_QUEUE_OVERLOAD"

valid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 8, 'capacity': 10}}
invalid = {"case_id": "CASO-LIM-034-1B", **{'precision_at_k': 0.667, 'load': 50, 'capacity': 10}}
uncertain = {**valid}
uncertain.pop("capacity")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_QUEUE_OVERLOAD", "REQUEST_CAPACITY"]
` ,
          output: `CONTINUE REJECT_QUEUE_OVERLOAD REQUEST_CAPACITY` ,
        },
      },
      {
        id: "S34-T2-A-E1",
        subtopicId: "S34-T2-A",
        kind: "guided",
        instruction: "S34-T2-A-E1 · Calcula el contrato de `class weights y resampling dentro de CV` sobre `CASO-LIM-034-2A`. La entrada es el dict completo del starter; la operación debe demostrar pesos con minority>0 y sin resample global. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_LEAKY_RESAMPLE` en E2.",
        hint: "Relaciona los campos `n0, n1, resample_global` con la regla explicada en S34-T2-A.",
        hints: [
          "Relaciona los campos `n0, n1, resample_global` con la regla explicada en S34-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva pesos con minority>0 y sin resample global; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta n1", "fixture adverso: pesos con minority>0 y sin resample global", "CASO-LIM-034-2A es sintético"],
        tests: "El fixture `CASO-LIM-034-2A` satisface un predicado de dominio real; imprime `S34-T2-A PASS` y el assert booleano pasa.",
        feedback: "S34-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKY_RESAMPLE y por qué faltar n1 exige REQUEST_WEIGHTS.",
        starterCode: {
          language: 'python',
          title: "s34-t2-a-e1.py",
          code: `# CASO-LIM-034 · resample only inside folds
# DEFECT: PASS si resample_global True (leak)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
meets_contract = record["resample_global"] is True
status = "PASS" if meets_contract else "REJECT_LEAKY_RESAMPLE"
print("S34-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
meets_contract = record["resample_global"] is False and record["n1"] > 0 and record["n0"] > record["n1"]
status = "PASS" if meets_contract else "REJECT_LEAKY_RESAMPLE"
print("S34-T2-A", status)
assert meets_contract is True
` ,
          output: `S34-T2-A PASS` ,
        },
      },
      {
        id: "S34-T2-A-E2",
        subtopicId: "S34-T2-A",
        kind: "independent",
        instruction: "S34-T2-A-E2 · Modela tres rutas de `class weights y resampling dentro de CV`: fixture válido, fixture adverso y registro sin `n1`. Entrada: dict con case_id, n0, n1, resample_global. Salidas exactas: `PASS`, `REJECT_LEAKY_RESAMPLE`, `MISSING:n1`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a n1 debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a n1 debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T2-A: pesos con minority>0 y sin resample global. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta n1", "fixture adverso: pesos con minority>0 y sin resample global", "CASO-LIM-034-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `n1` ausente y produce exactamente `PASS REJECT_LEAKY_RESAMPLE MISSING:n1`.",
        feedback: "S34-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKY_RESAMPLE y por qué faltar n1 exige REQUEST_WEIGHTS.",
        starterCode: {
          language: 'python',
          title: "s34-t2-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_LEAKY_RESAMPLE
# DEFECT: PASS con resampling global pre-split
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'n0', 'n1', 'resample_global'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["resample_global"] is True else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
invalid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': True}}
incomplete = {**valid}
incomplete.pop("n1")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'n0', 'n1', 'resample_global'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["resample_global"] is False and record["n1"] > 0 and record["n0"] > record["n1"] else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
invalid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': True}}
incomplete = {**valid}
incomplete.pop("n1")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_LEAKY_RESAMPLE MISSING:n1` ,
        },
      },
      {
        id: "S34-T2-A-E3",
        subtopicId: "S34-T2-A",
        kind: "transfer",
        instruction: "S34-T2-A-E3 · Contrasta fallo cerrado para `class weights y resampling dentro de CV` con tres fixtures distintos. `CASO-LIM-034-2A` debe continuar, el adverso debe devolver `REJECT_LEAKY_RESAMPLE` y la ausencia de `n1` debe devolver `REQUEST_WEIGHTS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_WEIGHTS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_WEIGHTS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró pesos con minority>0 y sin resample global; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta n1", "fixture adverso: pesos con minority>0 y sin resample global", "CASO-LIM-034-2A es sintético"],
        tests: "Fixtures `CASO-LIM-034-2A`, adverso y sin `n1` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKY_RESAMPLE y por qué faltar n1 exige REQUEST_WEIGHTS.",
        starterCode: {
          language: 'python',
          title: "s34-t2-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_LEAKY_RESAMPLE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'n0', 'n1', 'resample_global'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["resample_global"] is True else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
invalid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': True}}
uncertain = {**valid}
uncertain.pop("n1")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'n0', 'n1', 'resample_global'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_WEIGHTS"
    return "CONTINUE" if record["resample_global"] is False and record["n1"] > 0 and record["n0"] > record["n1"] else "REJECT_LEAKY_RESAMPLE"

valid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': False}}
invalid = {"case_id": "CASO-LIM-034-2A", **{'n0': 9, 'n1': 1, 'resample_global': True}}
uncertain = {**valid}
uncertain.pop("n1")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_LEAKY_RESAMPLE", "REQUEST_WEIGHTS"]
` ,
          output: `CONTINUE REJECT_LEAKY_RESAMPLE REQUEST_WEIGHTS` ,
        },
      },
      {
        id: "S34-T2-B-E1",
        subtopicId: "S34-T2-B",
        kind: "guided",
        instruction: "S34-T2-B-E1 · Calcula el contrato de `prevalencia y métricas engañosas` sobre `CASO-LIM-034-2B`. La entrada es el dict completo del starter; la operación debe demostrar base rate baja con accuracy_enough=False. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_PREVALENCE_BLIND` en E2.",
        hint: "Relaciona los campos `prevalence, all_neg_acc, accuracy_enough` con la regla explicada en S34-T2-B.",
        hints: [
          "Relaciona los campos `prevalence, all_neg_acc, accuracy_enough` con la regla explicada en S34-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva base rate baja con accuracy_enough=False; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta prevalence", "fixture adverso: base rate baja con accuracy_enough=False", "CASO-LIM-034-2B es sintético"],
        tests: "El fixture `CASO-LIM-034-2B` satisface un predicado de dominio real; imprime `S34-T2-B PASS` y el assert booleano pasa.",
        feedback: "S34-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PREVALENCE_BLIND y por qué faltar prevalence exige REQUEST_BASE_RATE.",
        starterCode: {
          language: 'python',
          title: "s34-t2-b-e1.py",
          code: `# CASO-LIM-034 · prevalence-aware metrics
# DEFECT: PASS si accuracy_enough True a baja prevalencia
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
meets_contract = record["accuracy_enough"] is True
status = "PASS" if meets_contract else "REJECT_PREVALENCE_BLIND"
print("S34-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
meets_contract = record["accuracy_enough"] is False and 0 < record["prevalence"] < 0.5
status = "PASS" if meets_contract else "REJECT_PREVALENCE_BLIND"
print("S34-T2-B", status)
assert meets_contract is True
` ,
          output: `S34-T2-B PASS` ,
        },
      },
      {
        id: "S34-T2-B-E2",
        subtopicId: "S34-T2-B",
        kind: "independent",
        instruction: "S34-T2-B-E2 · Modela tres rutas de `prevalencia y métricas engañosas`: fixture válido, fixture adverso y registro sin `prevalence`. Entrada: dict con case_id, prevalence, all_neg_acc, accuracy_enough. Salidas exactas: `PASS`, `REJECT_PREVALENCE_BLIND`, `MISSING:prevalence`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a prevalence debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a prevalence debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T2-B: base rate baja con accuracy_enough=False. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta prevalence", "fixture adverso: base rate baja con accuracy_enough=False", "CASO-LIM-034-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `prevalence` ausente y produce exactamente `PASS REJECT_PREVALENCE_BLIND MISSING:prevalence`.",
        feedback: "S34-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PREVALENCE_BLIND y por qué faltar prevalence exige REQUEST_BASE_RATE.",
        starterCode: {
          language: 'python',
          title: "s34-t2-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_PREVALENCE_BLIND
# DEFECT: PASS creyendo accuracy basta con desbalance
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'prevalence', 'all_neg_acc', 'accuracy_enough'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_enough"] is True else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
invalid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': True}}
incomplete = {**valid}
incomplete.pop("prevalence")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'prevalence', 'all_neg_acc', 'accuracy_enough'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["accuracy_enough"] is False and 0 < record["prevalence"] < 0.5 else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
invalid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': True}}
incomplete = {**valid}
incomplete.pop("prevalence")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_PREVALENCE_BLIND MISSING:prevalence` ,
        },
      },
      {
        id: "S34-T2-B-E3",
        subtopicId: "S34-T2-B",
        kind: "transfer",
        instruction: "S34-T2-B-E3 · Contrasta fallo cerrado para `prevalencia y métricas engañosas` con tres fixtures distintos. `CASO-LIM-034-2B` debe continuar, el adverso debe devolver `REJECT_PREVALENCE_BLIND` y la ausencia de `prevalence` debe devolver `REQUEST_BASE_RATE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_BASE_RATE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_BASE_RATE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró base rate baja con accuracy_enough=False; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta prevalence", "fixture adverso: base rate baja con accuracy_enough=False", "CASO-LIM-034-2B es sintético"],
        tests: "Fixtures `CASO-LIM-034-2B`, adverso y sin `prevalence` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PREVALENCE_BLIND y por qué faltar prevalence exige REQUEST_BASE_RATE.",
        starterCode: {
          language: 'python',
          title: "s34-t2-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_PREVALENCE_BLIND
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'prevalence', 'all_neg_acc', 'accuracy_enough'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["accuracy_enough"] is True else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
invalid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': True}}
uncertain = {**valid}
uncertain.pop("prevalence")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'prevalence', 'all_neg_acc', 'accuracy_enough'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_BASE_RATE"
    return "CONTINUE" if record["accuracy_enough"] is False and 0 < record["prevalence"] < 0.5 else "REJECT_PREVALENCE_BLIND"

valid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': False}}
invalid = {"case_id": "CASO-LIM-034-2B", **{'prevalence': 0.025, 'all_neg_acc': 0.975, 'accuracy_enough': True}}
uncertain = {**valid}
uncertain.pop("prevalence")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_PREVALENCE_BLIND", "REQUEST_BASE_RATE"]
` ,
          output: `CONTINUE REJECT_PREVALENCE_BLIND REQUEST_BASE_RATE` ,
        },
      },
      {
        id: "S34-T3-A-E1",
        subtopicId: "S34-T3-A",
        kind: "guided",
        instruction: "S34-T3-A-E1 · Calcula el contrato de `reliability curves y Brier` sobre `CASO-LIM-034-3A`. La entrada es el dict completo del starter; la operación debe demostrar Brier bajo y reliability alineada en el bin. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNCALIBRATED` en E2.",
        hint: "Relaciona los campos `brier, mean_p, freq` con la regla explicada en S34-T3-A.",
        hints: [
          "Relaciona los campos `brier, mean_p, freq` con la regla explicada en S34-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva Brier bajo y reliability alineada en el bin; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta brier", "fixture adverso: Brier bajo y reliability alineada en el bin", "CASO-LIM-034-3A es sintético"],
        tests: "El fixture `CASO-LIM-034-3A` satisface un predicado de dominio real; imprime `S34-T3-A PASS` y el assert booleano pasa.",
        feedback: "S34-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNCALIBRATED y por qué faltar brier exige REQUEST_BRIER.",
        starterCode: {
          language: 'python',
          title: "s34-t3-a-e1.py",
          code: `# CASO-LIM-034 · calibration mean_p vs freq
# DEFECT: PASS si |mean_p-freq| > 0.3
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
meets_contract = abs(record["mean_p"] - record["freq"]) > 0.3
status = "PASS" if meets_contract else "REJECT_UNCALIBRATED"
print("S34-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
meets_contract = abs(record["mean_p"] - record["freq"]) <= 0.1 and record["brier"] <= 0.25
status = "PASS" if meets_contract else "REJECT_UNCALIBRATED"
print("S34-T3-A", status)
assert meets_contract is True
` ,
          output: `S34-T3-A PASS` ,
        },
      },
      {
        id: "S34-T3-A-E2",
        subtopicId: "S34-T3-A",
        kind: "independent",
        instruction: "S34-T3-A-E2 · Modela tres rutas de `reliability curves y Brier`: fixture válido, fixture adverso y registro sin `brier`. Entrada: dict con case_id, brier, mean_p, freq. Salidas exactas: `PASS`, `REJECT_UNCALIBRATED`, `MISSING:brier`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a brier debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a brier debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T3-A: Brier bajo y reliability alineada en el bin. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta brier", "fixture adverso: Brier bajo y reliability alineada en el bin", "CASO-LIM-034-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `brier` ausente y produce exactamente `PASS REJECT_UNCALIBRATED MISSING:brier`.",
        feedback: "S34-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNCALIBRATED y por qué faltar brier exige REQUEST_BRIER.",
        starterCode: {
          language: 'python',
          title: "s34-t3-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_UNCALIBRATED
# DEFECT: PASS con calibración rota
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'brier', 'mean_p', 'freq'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if abs(record["mean_p"] - record["freq"]) > 0.3 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
invalid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.4, 'mean_p': 0.9, 'freq': 0.2}}
incomplete = {**valid}
incomplete.pop("brier")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'brier', 'mean_p', 'freq'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if abs(record["mean_p"] - record["freq"]) <= 0.1 and record["brier"] <= 0.25 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
invalid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.4, 'mean_p': 0.9, 'freq': 0.2}}
incomplete = {**valid}
incomplete.pop("brier")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNCALIBRATED MISSING:brier` ,
        },
      },
      {
        id: "S34-T3-A-E3",
        subtopicId: "S34-T3-A",
        kind: "transfer",
        instruction: "S34-T3-A-E3 · Contrasta fallo cerrado para `reliability curves y Brier` con tres fixtures distintos. `CASO-LIM-034-3A` debe continuar, el adverso debe devolver `REJECT_UNCALIBRATED` y la ausencia de `brier` debe devolver `REQUEST_BRIER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_BRIER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_BRIER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró Brier bajo y reliability alineada en el bin; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta brier", "fixture adverso: Brier bajo y reliability alineada en el bin", "CASO-LIM-034-3A es sintético"],
        tests: "Fixtures `CASO-LIM-034-3A`, adverso y sin `brier` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNCALIBRATED y por qué faltar brier exige REQUEST_BRIER.",
        starterCode: {
          language: 'python',
          title: "s34-t3-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_UNCALIBRATED
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'brier', 'mean_p', 'freq'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if abs(record["mean_p"] - record["freq"]) > 0.3 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
invalid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.4, 'mean_p': 0.9, 'freq': 0.2}}
uncertain = {**valid}
uncertain.pop("brier")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'brier', 'mean_p', 'freq'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_BRIER"
    return "CONTINUE" if abs(record["mean_p"] - record["freq"]) <= 0.1 and record["brier"] <= 0.25 else "REJECT_UNCALIBRATED"

valid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.1, 'mean_p': 0.5, 'freq': 0.5}}
invalid = {"case_id": "CASO-LIM-034-3A", **{'brier': 0.4, 'mean_p': 0.9, 'freq': 0.2}}
uncertain = {**valid}
uncertain.pop("brier")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNCALIBRATED", "REQUEST_BRIER"]
` ,
          output: `CONTINUE REJECT_UNCALIBRATED REQUEST_BRIER` ,
        },
      },
      {
        id: "S34-T3-B-E1",
        subtopicId: "S34-T3-B",
        kind: "guided",
        instruction: "S34-T3-B-E1 · Calcula el contrato de `calibradores y evaluación fuera de muestra` sobre `CASO-LIM-034-3B`. La entrada es el dict completo del starter; la operación debe demostrar calibrator holdout con misma longitud raw/cal. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_IN_SAMPLE_CAL` en E2.",
        hint: "Relaciona los campos `raw, cal, calibrator_set` con la regla explicada en S34-T3-B.",
        hints: [
          "Relaciona los campos `raw, cal, calibrator_set` con la regla explicada en S34-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva calibrator holdout con misma longitud raw/cal; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta calibrator_set", "fixture adverso: calibrator holdout con misma longitud raw/cal", "CASO-LIM-034-3B es sintético"],
        tests: "El fixture `CASO-LIM-034-3B` satisface un predicado de dominio real; imprime `S34-T3-B PASS` y el assert booleano pasa.",
        feedback: "S34-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IN_SAMPLE_CAL y por qué faltar calibrator_set exige REQUEST_CAL_SET.",
        starterCode: {
          language: 'python',
          title: "s34-t3-b-e1.py",
          code: `# CASO-LIM-034 · calibrator on holdout not train
# DEFECT: PASS si calibrator_set train_in_sample
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
meets_contract = record["calibrator_set"] == "train_in_sample"
status = "PASS" if meets_contract else "REJECT_IN_SAMPLE_CAL"
print("S34-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
meets_contract = record["calibrator_set"].startswith("holdout") and len(record["raw"]) == len(record["cal"])
status = "PASS" if meets_contract else "REJECT_IN_SAMPLE_CAL"
print("S34-T3-B", status)
assert meets_contract is True
` ,
          output: `S34-T3-B PASS` ,
        },
      },
      {
        id: "S34-T3-B-E2",
        subtopicId: "S34-T3-B",
        kind: "independent",
        instruction: "S34-T3-B-E2 · Modela tres rutas de `calibradores y evaluación fuera de muestra`: fixture válido, fixture adverso y registro sin `calibrator_set`. Entrada: dict con case_id, raw, cal, calibrator_set. Salidas exactas: `PASS`, `REJECT_IN_SAMPLE_CAL`, `MISSING:calibrator_set`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a calibrator_set debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a calibrator_set debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T3-B: calibrator holdout con misma longitud raw/cal. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta calibrator_set", "fixture adverso: calibrator holdout con misma longitud raw/cal", "CASO-LIM-034-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `calibrator_set` ausente y produce exactamente `PASS REJECT_IN_SAMPLE_CAL MISSING:calibrator_set`.",
        feedback: "S34-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IN_SAMPLE_CAL y por qué faltar calibrator_set exige REQUEST_CAL_SET.",
        starterCode: {
          language: 'python',
          title: "s34-t3-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_IN_SAMPLE_CAL
# DEFECT: PASS con calibración in-sample
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'raw', 'cal', 'calibrator_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["calibrator_set"] == "train_in_sample" else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
invalid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'train_in_sample'}}
incomplete = {**valid}
incomplete.pop("calibrator_set")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'raw', 'cal', 'calibrator_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["calibrator_set"].startswith("holdout") and len(record["raw"]) == len(record["cal"]) else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
invalid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'train_in_sample'}}
incomplete = {**valid}
incomplete.pop("calibrator_set")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_IN_SAMPLE_CAL MISSING:calibrator_set` ,
        },
      },
      {
        id: "S34-T3-B-E3",
        subtopicId: "S34-T3-B",
        kind: "transfer",
        instruction: "S34-T3-B-E3 · Contrasta fallo cerrado para `calibradores y evaluación fuera de muestra` con tres fixtures distintos. `CASO-LIM-034-3B` debe continuar, el adverso debe devolver `REJECT_IN_SAMPLE_CAL` y la ausencia de `calibrator_set` debe devolver `REQUEST_CAL_SET`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CAL_SET` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CAL_SET` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró calibrator holdout con misma longitud raw/cal; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta calibrator_set", "fixture adverso: calibrator holdout con misma longitud raw/cal", "CASO-LIM-034-3B es sintético"],
        tests: "Fixtures `CASO-LIM-034-3B`, adverso y sin `calibrator_set` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_IN_SAMPLE_CAL y por qué faltar calibrator_set exige REQUEST_CAL_SET.",
        starterCode: {
          language: 'python',
          title: "s34-t3-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_IN_SAMPLE_CAL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'raw', 'cal', 'calibrator_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["calibrator_set"] == "train_in_sample" else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
invalid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'train_in_sample'}}
uncertain = {**valid}
uncertain.pop("calibrator_set")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'raw', 'cal', 'calibrator_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CAL_SET"
    return "CONTINUE" if record["calibrator_set"].startswith("holdout") and len(record["raw"]) == len(record["cal"]) else "REJECT_IN_SAMPLE_CAL"

valid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'holdout_v1'}}
invalid = {"case_id": "CASO-LIM-034-3B", **{'raw': [0.2, 0.8], 'cal': [0.25, 0.75], 'calibrator_set': 'train_in_sample'}}
uncertain = {**valid}
uncertain.pop("calibrator_set")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_IN_SAMPLE_CAL", "REQUEST_CAL_SET"]
` ,
          output: `CONTINUE REJECT_IN_SAMPLE_CAL REQUEST_CAL_SET` ,
        },
      },
      {
        id: "S34-T4-A-E1",
        subtopicId: "S34-T4-A",
        kind: "guided",
        instruction: "S34-T4-A-E1 · Calcula el contrato de `threshold por costo/capacidad` sobre `CASO-LIM-034-4A`. La entrada es el dict completo del starter; la operación debe demostrar thr versionado con costo y n_review. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_FIXED_THR` en E2.",
        hint: "Relaciona los campos `thr, n_review, thr_id, cost` con la regla explicada en S34-T4-A.",
        hints: [
          "Relaciona los campos `thr, n_review, thr_id, cost` con la regla explicada en S34-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva thr versionado con costo y n_review; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta cost", "fixture adverso: thr versionado con costo y n_review", "CASO-LIM-034-4A es sintético"],
        tests: "El fixture `CASO-LIM-034-4A` satisface un predicado de dominio real; imprime `S34-T4-A PASS` y el assert booleano pasa.",
        feedback: "S34-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FIXED_THR y por qué faltar cost exige REQUEST_COST_MATRIX.",
        starterCode: {
          language: 'python',
          title: "s34-t4-a-e1.py",
          code: `# CASO-LIM-034 · cost/capacity threshold id
# DEFECT: PASS si thr_id default fijo
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
meets_contract = record["thr_id"] == "default"
status = "PASS" if meets_contract else "REJECT_FIXED_THR"
print("S34-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
meets_contract = record["thr_id"].startswith("thr-v") and record["cost"] is not None and record["n_review"] >= 1
status = "PASS" if meets_contract else "REJECT_FIXED_THR"
print("S34-T4-A", status)
assert meets_contract is True
` ,
          output: `S34-T4-A PASS` ,
        },
      },
      {
        id: "S34-T4-A-E2",
        subtopicId: "S34-T4-A",
        kind: "independent",
        instruction: "S34-T4-A-E2 · Modela tres rutas de `threshold por costo/capacidad`: fixture válido, fixture adverso y registro sin `cost`. Entrada: dict con case_id, thr, n_review, thr_id, cost. Salidas exactas: `PASS`, `REJECT_FIXED_THR`, `MISSING:cost`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T4-A: thr versionado con costo y n_review. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cost", "fixture adverso: thr versionado con costo y n_review", "CASO-LIM-034-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cost` ausente y produce exactamente `PASS REJECT_FIXED_THR MISSING:cost`.",
        feedback: "S34-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FIXED_THR y por qué faltar cost exige REQUEST_COST_MATRIX.",
        starterCode: {
          language: 'python',
          title: "s34-t4-a-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_FIXED_THR
# DEFECT: PASS con umbral fijo sin costo/capacidad
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'thr', 'n_review', 'thr_id', 'cost'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["thr_id"] == "default" else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
invalid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.5, 'n_review': 2, 'thr_id': 'default', 'cost': None}}
incomplete = {**valid}
incomplete.pop("cost")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'thr', 'n_review', 'thr_id', 'cost'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["thr_id"].startswith("thr-v") and record["cost"] is not None and record["n_review"] >= 1 else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
invalid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.5, 'n_review': 2, 'thr_id': 'default', 'cost': None}}
incomplete = {**valid}
incomplete.pop("cost")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_FIXED_THR MISSING:cost` ,
        },
      },
      {
        id: "S34-T4-A-E3",
        subtopicId: "S34-T4-A",
        kind: "transfer",
        instruction: "S34-T4-A-E3 · Contrasta fallo cerrado para `threshold por costo/capacidad` con tres fixtures distintos. `CASO-LIM-034-4A` debe continuar, el adverso debe devolver `REJECT_FIXED_THR` y la ausencia de `cost` debe devolver `REQUEST_COST_MATRIX`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_COST_MATRIX` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_COST_MATRIX` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró thr versionado con costo y n_review; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cost", "fixture adverso: thr versionado con costo y n_review", "CASO-LIM-034-4A es sintético"],
        tests: "Fixtures `CASO-LIM-034-4A`, adverso y sin `cost` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FIXED_THR y por qué faltar cost exige REQUEST_COST_MATRIX.",
        starterCode: {
          language: 'python',
          title: "s34-t4-a-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_FIXED_THR
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'thr', 'n_review', 'thr_id', 'cost'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["thr_id"] == "default" else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
invalid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.5, 'n_review': 2, 'thr_id': 'default', 'cost': None}}
uncertain = {**valid}
uncertain.pop("cost")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'thr', 'n_review', 'thr_id', 'cost'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_COST_MATRIX"
    return "CONTINUE" if record["thr_id"].startswith("thr-v") and record["cost"] is not None and record["n_review"] >= 1 else "REJECT_FIXED_THR"

valid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.6, 'n_review': 2, 'thr_id': 'thr-v1', 'cost': 16}}
invalid = {"case_id": "CASO-LIM-034-4A", **{'thr': 0.5, 'n_review': 2, 'thr_id': 'default', 'cost': None}}
uncertain = {**valid}
uncertain.pop("cost")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FIXED_THR", "REQUEST_COST_MATRIX"]
` ,
          output: `CONTINUE REJECT_FIXED_THR REQUEST_COST_MATRIX` ,
        },
      },
      {
        id: "S34-T4-B-E1",
        subtopicId: "S34-T4-B",
        kind: "guided",
        instruction: "S34-T4-B-E1 · Calcula el contrato de `abstención, slices y sensibilidad` sobre `CASO-LIM-034-4B`. La entrada es el dict completo del starter; la operación debe demostrar score en banda con decision abstain. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S34-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_FORCE_LABEL` en E2.",
        hint: "Relaciona los campos `score, low, high, decision` con la regla explicada en S34-T4-B.",
        hints: [
          "Relaciona los campos `score, low, high, decision` con la regla explicada en S34-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva score en banda con decision abstain; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta low", "fixture adverso: score en banda con decision abstain", "CASO-LIM-034-4B es sintético"],
        tests: "El fixture `CASO-LIM-034-4B` satisface un predicado de dominio real; imprime `S34-T4-B PASS` y el assert booleano pasa.",
        feedback: "S34-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FORCE_LABEL y por qué faltar low exige REQUEST_ABSTAIN_BAND.",
        starterCode: {
          language: 'python',
          title: "s34-t4-b-e1.py",
          code: `# CASO-LIM-034 · abstain band not force label
# DEFECT: PASS si decision force_1
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
meets_contract = record["decision"] == "force_1"
status = "PASS" if meets_contract else "REJECT_FORCE_LABEL"
print("S34-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
meets_contract = record["low"] < record["score"] < record["high"] and record["decision"] == "abstain"
status = "PASS" if meets_contract else "REJECT_FORCE_LABEL"
print("S34-T4-B", status)
assert meets_contract is True
` ,
          output: `S34-T4-B PASS` ,
        },
      },
      {
        id: "S34-T4-B-E2",
        subtopicId: "S34-T4-B",
        kind: "independent",
        instruction: "S34-T4-B-E2 · Modela tres rutas de `abstención, slices y sensibilidad`: fixture válido, fixture adverso y registro sin `low`. Entrada: dict con case_id, score, low, high, decision. Salidas exactas: `PASS`, `REJECT_FORCE_LABEL`, `MISSING:low`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a low debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a low debe ocurrir antes de esa rama.",
          "Después aplica la regla de S34-T4-B: score en banda con decision abstain. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta low", "fixture adverso: score en banda con decision abstain", "CASO-LIM-034-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `low` ausente y produce exactamente `PASS REJECT_FORCE_LABEL MISSING:low`.",
        feedback: "S34-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FORCE_LABEL y por qué faltar low exige REQUEST_ABSTAIN_BAND.",
        starterCode: {
          language: 'python',
          title: "s34-t4-b-e2.py",
          code: `# CASO-LIM-034 · assess REJECT_FORCE_LABEL
# DEFECT: PASS forzando etiqueta en zona de abstención
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'score', 'low', 'high', 'decision'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["decision"] == "force_1" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
invalid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'force_1'}}
incomplete = {**valid}
incomplete.pop("low")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'score', 'low', 'high', 'decision'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["low"] < record["score"] < record["high"] and record["decision"] == "abstain" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
invalid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'force_1'}}
incomplete = {**valid}
incomplete.pop("low")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_FORCE_LABEL MISSING:low` ,
        },
      },
      {
        id: "S34-T4-B-E3",
        subtopicId: "S34-T4-B",
        kind: "transfer",
        instruction: "S34-T4-B-E3 · Contrasta fallo cerrado para `abstención, slices y sensibilidad` con tres fixtures distintos. `CASO-LIM-034-4B` debe continuar, el adverso debe devolver `REJECT_FORCE_LABEL` y la ausencia de `low` debe devolver `REQUEST_ABSTAIN_BAND`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_ABSTAIN_BAND` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_ABSTAIN_BAND` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró score en banda con decision abstain; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta low", "fixture adverso: score en banda con decision abstain", "CASO-LIM-034-4B es sintético"],
        tests: "Fixtures `CASO-LIM-034-4B`, adverso y sin `low` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S34-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FORCE_LABEL y por qué faltar low exige REQUEST_ABSTAIN_BAND.",
        starterCode: {
          language: 'python',
          title: "s34-t4-b-e3.py",
          code: `# CASO-LIM-034 · decide REJECT_FORCE_LABEL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'score', 'low', 'high', 'decision'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["decision"] == "force_1" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
invalid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'force_1'}}
uncertain = {**valid}
uncertain.pop("low")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s34-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'score', 'low', 'high', 'decision'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_ABSTAIN_BAND"
    return "CONTINUE" if record["low"] < record["score"] < record["high"] and record["decision"] == "abstain" else "REJECT_FORCE_LABEL"

valid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'abstain'}}
invalid = {"case_id": "CASO-LIM-034-4B", **{'score': 0.5, 'low': 0.3, 'high': 0.7, 'decision': 'force_1'}}
uncertain = {**valid}
uncertain.pop("low")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FORCE_LABEL", "REQUEST_ABSTAIN_BAND"]
` ,
          output: `CONTINUE REJECT_FORCE_LABEL REQUEST_ABSTAIN_BAND` ,
        },
      }
    ],
  },
  youDo: {
    title: "Workbench: métricas + thr versionado + abstain (cierre CP-N3-B)",
    context:
      "Integra confusion/top-k, prevalencia, Brier, thr-v1 y banda abstain sobre CASO-LIM-034. Sin auto-fraude ni PII real.",
    objectives: [
      "Confusion y precision@k con capacidad",
      "Pesos CV-safe y base rate documentada",
      "Brier/reliability y calibrator holdout",
      "thr versionado y decisión abstain en zona gris",
    ],
    requirements: [
      "accuracy_only=False en reportes",
      "Sin fraud label automático",
      "es-PE sintético; thr con costo",
    ],
    starterCode: `# workbench CP-N3-B — CASO-LIM-034
report = {"confusion": {}, "precision_at_k": None, "thr_id": None, "decision": None}
# Contrato de theory/iDo documentado (sin stubs)
if __name__ == "__main__":
    print(sorted(report.keys()))
`,
    portfolioNote:
      "Cierre CP-N3-B; portfolio: thr-v1 + banda abstain + Brier.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "thr versionado + reliability bin + capacidad", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Con desbalance fuerte, conviene priorizar:",
        options: ["Solo accuracy", "Precision/recall o PR-AUC de la cola", "Solo loss de train", "Color del dashboard"],
        correctIndex: 1,
        explanation:
          "Accuracy engaña con prevalencia baja; P/R y PR-AUC describen mejor la cola de revisión.",
      },
      {
        question: "Resamplear todo el dataset antes de CV:",
        options: ["Es best practice", "Elimina necesidad de thr", "Garantiza calibración", "Introduce leakage y métricas infladas"],
        correctIndex: 3,
        explanation:
          "El resampling debe vivir dentro del fold de train; hacerlo global contamina validación.",
      },
      {
        question: "Un calibrador debe ajustarse:",
        options: ["En un set de calibración fuera de muestra", "En el test final", "En el mismo train del modelo base sin holdout", "Solo en producción sin logs"],
        correctIndex: 0,
        explanation:
          "Fit de calibración en holdout evita autoengaño de reliability.",
      },
      {
        question: "Score en banda low–high debe:",
        options: ["Forzar 1", "Forzar 0", "Abstener según política", "Borrar el caso"],
        correctIndex: 2,
        explanation:
          "La abstención es salida de primera clase para zona gris del workbench.",
      },
      {
        question: "El umbral de cola se elige por…",
        options: ["default 0.5 de la librería", "costo/capacidad y se versiona (thr-vN)", "maximizar solo recall sin carga", "calibrar en el mismo test final"],
        correctIndex: 1,
        explanation:
          "Thr versionado por costo y capacidad; calibración en holdout.",
      }
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
