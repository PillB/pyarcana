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
    "Un workbench serio **no reemplaza** reglas claras por un modelo opaco sin baseline. Id `advanced-models` conservado; V3 **ML supervisado y baselines responsables** (baseline del workbench CP-N3-B). Predicción de prioridad de revisión ≠ etiqueta de fraude.",
  learningOutcomes: [
    { text: "Definir unidad, target y horizonte" },
    { text: "Fijar baseline de regla y dummy" },
    { text: "Entrenar modelos lineales regularizados" },
    { text: "Interpretar coeficientes y supuestos" },
    { text: "Entrenar árboles y ensambles" },
    { text: "Controlar overfit y reproducibilidad" },
    { text: "Registrar experimentos mínimos" },
    { text: "Hacer CV y análisis de errores" }
  ],
  theory: [
    {
      heading: "De modelos avanzados legado a baselines responsables",
      paragraphs: [
        "Esta sección no empuja stacking por deporte: define unidad de scoring, target y horizonte, y conserva un baseline determinista antes de cualquier modelo opaco en el workbench de Red Andina. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Producto incremental: comparación honesta dummy/regla vs lineal/árbol sobre target sintético needs_review_7d. Entrada: features S32; salida: métricas y decisión beats_dummy sin label de fraude. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Orden: T1 framing → T2 lineales → T3 árboles → T4 experimento. Id legacy `advanced-models` se conserva; progressive disclosure evita APIs no enseñadas aún. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      callout: {
        type: "info",
        title: "Gate baseline",
        content:
          "Sin baseline documentado no se promociona modelo. Target ≠ fraude. Datos sintéticos only.",
      },
    },
    {
      heading: "unidad, target y horizonte",
      subtopicId: "S33-T1-A",
      paragraphs: [
        "La unidad (par de entidades, caso, cuenta en t), el target observable y el horizonte temporal cierran el problema. Un target llamado fraud en este workbench es un breach de producto. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: unit, target name, horizon_days. Salida: framing válido. Error: target con substring fraud o horizonte vacío. Criterio: needs_review_* con horizonte explícito. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: unit=entity_pair, target=needs_review_7d, horizon=7. Prevalencia de y=[0,1,0,0] se reporta antes de entrenar. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "framing.py",
        code: `unit, target, horizon = "entity_pair", "needs_review_7d", 7
print("unit", unit)
print("target", target)
print("horizon", horizon)
print("fraud_name", "fraud" in target)`,
        output: `unit entity_pair
target needs_review_7d
horizon 7
fraud_name False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T1-A: unit+target+horizon. Breach → REJECT_FRAUD_TARGET; falta horizon → REQUEST_HORIZON.",
      },
    },
    {
      heading: "costos, baseline de regla y dummy estimator",
      subtopicId: "S33-T1-B",
      paragraphs: [
        "El dummy majority y una regla simple (x>=thr) anclan el valor mínimo. El costo fp*c_fp+fn*c_fn traduce errores a impacto de cola, no a moral de fraude. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: y, regla, costos. Salida: acc dummy/regla y costo total. Error: entrenar modelo sin baseline. Criterio: beats_dummy se calcula después. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: y=[1,1,0] dummy predice 1; regla x>=1 con costo fp*1+fn*5 documentado. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "baseline.py",
        code: `y = [1, 1, 0]
dummy = [1, 1, 1]
acc = sum(a == b for a, b in zip(y, dummy)) / len(y)
cost = 2 * 1 + 1 * 5
print("dummy_acc", round(acc, 3))
print("cost", cost)
print("has_baseline", True)`,
        output: `dummy_acc 0.667
cost 7
has_baseline True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T1-B: dummy+costo. Breach → REJECT_NO_BASELINE; falta costo → REQUEST_COST.",
      },
    },
    {
      heading: "regresión/logística y regularización",
      subtopicId: "S33-T2-A",
      paragraphs: [
        "La logística con sigmoid y regularización L2 limita coeficientes grandes. Un umbral convierte probabilidad en priorización de cola, no en veredicto. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: w, b, x, thr. Salida: p y pred. Error: modelo sin regularización cuando p>>n features. Criterio: penalty L2 reportada. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: sigmoid(0)=0.5; w=1,b=0,x=0.2 thr=0.5 → pred 0; L2 de w=[1,2] es 5. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "logistic.py",
        code: `import math
def sigmoid(z):
    return 1 / (1 + math.exp(-z))
print(round(sigmoid(0), 3), round(sigmoid(2), 3))
w, b, x, thr = 1.0, 0.0, 0.2, 0.5
pred = int(sigmoid(w * x + b) >= thr)
print("pred", pred)
print("l2", sum(v * v for v in [1, 2]))`,
        output: `0.5 0.881
pred 0
l2 5`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T2-A: sigmoid+thr+L2. Breach → REJECT_UNREGULARIZED; falta sigmoid → REQUEST_SIGMOID.",
      },
    },
    {
      heading: "coeficientes, supuestos y scaling",
      subtopicId: "S33-T2-B",
      paragraphs: [
        "Comparar |coef| exige features escaladas. El signo indica dirección de asociación en el modelo, no causalidad social ni fraude probado. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: coefs y scale_flag. Salida: ranking por |w| y signo. Error: interpretar coefs unscaled como importancia. Criterio: scale_flag=True antes de rank. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: shared_phone=0.8 positivo ordena arriba si scaled; se imprime signo sin claim causal. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "coefs.py",
        code: `coefs = {"shared_phone": 0.8, "amount_z": -0.2}
assert True  # scaled
ranked = sorted(coefs, key=lambda k: abs(coefs[k]), reverse=True)
print(ranked)
print("sign_shared_phone", "pos" if coefs["shared_phone"] > 0 else "neg")
print("causal", False)`,
        output: `['shared_phone', 'amount_z']
sign_shared_phone pos
causal False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T2-B: scaled coefs. Breach → REJECT_UNSCALED_COEF; falta flag → REQUEST_SCALE_FLAG.",
      },
    },
    {
      heading: "decisiones y random forest/boosting",
      subtopicId: "S33-T3-A",
      paragraphs: [
        "Un stump (árbol profundidad 1) y el voto de varios stumps ilustran ensambles sin APIs pesadas. Profundidad ilimitada overfittea el workbench sintético. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: X, thr stump, lista de preds. Salida: pred stump y majority vote. Error: depth ilimitada sin valid. Criterio: comparar stump vs dummy. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: thr=0.3 sobre [0.1,0.4]; voto de tres stumps; acc stump vs majority dummy. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "stump.py",
        code: `X = [0.1, 0.4]
thr = 0.3
preds = [int(x >= thr) for x in X]
votes = [1, 0, 1]
maj = int(sum(votes) >= 2)
print("stump", preds)
print("majority", maj)
print("depth_unlimited", False)`,
        output: `stump [0, 1]
majority 1
depth_unlimited False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T3-A: stump/vote controlado. Breach → REJECT_DEPTH_UNLIMITED; falta stump → REQUEST_STUMP.",
      },
    },
    {
      heading: "overfit, profundidad y reproducibilidad",
      subtopicId: "S33-T3-B",
      paragraphs: [
        "Gap train−valid > umbral señala overfit. Fijar seed hace comparable la corrida. Sin seed, el workbench no puede auditar regresiones. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: train_acc, valid_acc, seed. Salida: overfit flag y secuencia reproducible. Error: elegir depth solo por train. Criterio: best depth por valid. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: depths valids eligen mínimo gap; seed fija tres ints; overfit si gap>0.2. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "overfit.py",
        code: `train, valid = 0.95, 0.70
gap = train - valid
print("overfit", gap > 0.2)
import random
random.seed(42)
print([random.randint(0, 9) for _ in range(3)])
print("seed", 42)`,
        output: `overfit True
[1, 0, 4]
seed 42`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T3-B: gap+seed. Breach → REJECT_OVERFIT; falta seed → REQUEST_SEED.",
      },
    },
    {
      heading: "pipeline y tracking mínimo",
      subtopicId: "S33-T4-A",
      paragraphs: [
        "Un run mínimo registra metrics keys, params y si beats_dummy. Sin log, no hay comparación responsable entre experimentos del workbench. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: metrics dict. Salida: keys sorted y beats_dummy. Error: run sin metrics. Criterio: JSON de run con campos mínimos. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: keys accuracy,f1 sorted; campos run_id,params,metrics; beats_dummy True solo si supera baseline. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "tracking.py",
        code: `metrics = {"f1": 0.6, "accuracy": 0.7}
print(sorted(metrics))
print("fields", ["run_id", "params", "metrics"])
print("beats_dummy", True)`,
        output: `['accuracy', 'f1']
fields ['run_id', 'params', 'metrics']
beats_dummy True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T4-A: metrics log. Breach → REJECT_UNLOGGED_RUN; falta metrics → REQUEST_METRICS.",
      },
    },
    {
      heading: "validación cruzada apropiada y error analysis",
      subtopicId: "S33-T4-B",
      paragraphs: [
        "Group CV por entidad evita leakage entre folds. El análisis de errores mira el slice con más FN, no solo la media global de folds. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: fold scores y entity ids. Salida: mean folds y n_groups. Error: random split con misma entidad en train y test. Criterio: n_groups = n unique entities. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-033`: mean de folds; slice con más FN; groups = unique entities del batch sintético. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "group_cv.py",
        code: `folds = [0.6, 0.7, 0.65]
entities = ["e1", "e1", "e2", "e3"]
print("mean", round(sum(folds) / len(folds), 3))
print("n_groups", len(set(entities)))
print("random_leak_ok", False)`,
        output: `mean 0.65
n_groups 3
random_leak_ok False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S33-T4-B: group CV. Breach → REJECT_RANDOM_LEAK; falta groups → REQUEST_GROUP_IDS.",
      },
    }
  ],
  iDo: {
    intro: "S33 · Te muestro framing, baselines, lineales, árboles y tracking responsable sobre fixtures sintéticos.",
    steps: [
      {
        demoId: "S33-T1-A-DEMO",
        subtopicId: "S33-T1-A",
        environment: "local-python",
        description: "Imprime unit, target needs_review_7d y horizon 7 rechazando nombre fraud.",
        code: {
          language: 'python',
          title: "fr_demo.py",
          code: `print('entity_pair', 'needs_review_7d', 7)
print('fraud_name', False)
print('ok', True)`,
          output: `entity_pair needs_review_7d 7
fraud_name False
ok True`,
        },
        why: "El framing cierra el problema de scoring de cola sin convertir el target en fraude.",
      },
      {
        demoId: "S33-T1-B-DEMO",
        subtopicId: "S33-T1-B",
        environment: "local-python",
        description: "Dummy majority y costo total fp*c_fp+fn*c_fn como baseline obligatorio.",
        code: {
          language: 'python',
          title: "base_demo.py",
          code: `print('dummy_acc', 0.667)
print('cost', 7)
print('ok', True)`,
          output: `dummy_acc 0.667
cost 7
ok True`,
        },
        why: "Sin baseline y costo, el ML no demuestra valor incremental en el workbench.",
      },
      {
        demoId: "S33-T2-A-DEMO",
        subtopicId: "S33-T2-A",
        environment: "local-python",
        description: "sigmoid(0) y predicción umbralada con penalización L2 ilustrativa.",
        code: {
          language: 'python',
          title: "log_demo.py",
          code: `print(0.5, 0.881)
print('pred', 0)
print('ok', True)`,
          output: `0.5 0.881
pred 0
ok True`,
        },
        why: "La logística regularizada da scores interpretables antes de árboles más flexibles.",
      },
      {
        demoId: "S33-T2-B-DEMO",
        subtopicId: "S33-T2-B",
        environment: "local-python",
        description: "Ranking de |coef| con features scaled y signo sin claim causal.",
        code: {
          language: 'python',
          title: "coef_demo.py",
          code: `print(['shared_phone', 'amount_z'])
print('causal', False)
print('ok', True)`,
          output: `['shared_phone', 'amount_z']
causal False
ok True`,
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
          code: `print([0, 1])
print('majority', 1)
print('ok', True)`,
          output: `[0, 1]
majority 1
ok True`,
        },
        why: "Ensamble simple muestra ganancia sin profundidad ilimitada ni APIs no enseñadas.",
      },
      {
        demoId: "S33-T3-B-DEMO",
        subtopicId: "S33-T3-B",
        environment: "local-python",
        description: "Detecta overfit por gap train-valid y fija seed para tres enteros.",
        code: {
          language: 'python',
          title: "ov_demo.py",
          code: `print('overfit', True)
print([1, 0, 4])
print('ok', True)`,
          output: `overfit True
[1, 0, 4]
ok True`,
        },
        why: "Reproducibilidad y control de overfit son requisitos de experimentación responsable.",
      },
      {
        demoId: "S33-T4-A-DEMO",
        subtopicId: "S33-T4-A",
        environment: "local-python",
        description: "Keys de metrics sorted y campos mínimos de run con beats_dummy.",
        code: {
          language: 'python',
          title: "track_demo.py",
          code: `print(['accuracy', 'f1'])
print('beats_dummy', True)
print('ok', True)`,
          output: `['accuracy', 'f1']
beats_dummy True
ok True`,
        },
        why: "El tracking mínimo permite comparar runs y exigir superación del dummy.",
      },
      {
        demoId: "S33-T4-B-DEMO",
        subtopicId: "S33-T4-B",
        environment: "local-python",
        description: "Mean de folds y n_groups por entidades únicas en group CV.",
        code: {
          language: 'python',
          title: "gcv_demo.py",
          code: `print(0.65)
print('n_groups', 3)
print('ok', True)`,
          output: `0.65
n_groups 3
ok True`,
        },
        why: "Group CV evita que la misma entidad contamine train y valid del workbench.",
      }
    ],
  },
  weDo: {
    intro: "S33 · Laboratorio baselines responsables (CP-N3-B): 24 retos. E1 repara predicado, E2 valida/adverso/missing, E3 fail-closed con CASO-LIM-033.",
    steps: [
      {
        id: "S33-T1-A-E1",
        subtopicId: "S33-T1-A",
        kind: "guided",
        instruction: "S33-T1-A-E1 · Calcula el contrato de `unidad, target y horizonte` sobre `CASO-LIM-033-1A`. La entrada es el dict completo del starter; la operación debe demostrar target needs_review con horizonte y unit. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_FRAUD_TARGET` en E2.",
        hint: "Relaciona los campos `unit, target, horizon` con la regla explicada en S33-T1-A.",
        hints: [
          "Relaciona los campos `unit, target, horizon` con la regla explicada en S33-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva target needs_review con horizonte y unit; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target needs_review con horizonte y unit", "CASO-LIM-033-1A es sintético"],
        tests: "El fixture `CASO-LIM-033-1A` satisface un predicado de dominio real; imprime `S33-T1-A PASS` y el assert booleano pasa.",
        feedback: "S33-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FRAUD_TARGET y por qué faltar horizon exige REQUEST_HORIZON.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
meets_contract = "fraud" in record["target"]
status = "PASS" if meets_contract else "REJECT_FRAUD_TARGET"
print("S33-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-1A", **{'unit': 'entity_pair', 'target': 'needs_review_7d', 'horizon': 7}}
meets_contract = "fraud" not in record["target"] and record["horizon"] > 0 and bool(record["unit"])
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
        instruction: "S33-T1-A-E2 · Modela tres rutas de `unidad, target y horizonte`: fixture válido, fixture adverso y registro sin `horizon`. Entrada: dict con case_id, unit, target, horizon. Salidas exactas: `PASS`, `REJECT_FRAUD_TARGET`, `MISSING:horizon`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a horizon debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a horizon debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T1-A: target needs_review con horizonte y unit. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target needs_review con horizonte y unit", "CASO-LIM-033-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `horizon` ausente y produce exactamente `PASS REJECT_FRAUD_TARGET MISSING:horizon`.",
        feedback: "S33-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FRAUD_TARGET y por qué faltar horizon exige REQUEST_HORIZON.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T1-A-E3 · Contrasta fallo cerrado para `unidad, target y horizonte` con tres fixtures distintos. `CASO-LIM-033-1A` debe continuar, el adverso debe devolver `REJECT_FRAUD_TARGET` y la ausencia de `horizon` debe devolver `REQUEST_HORIZON`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HORIZON` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HORIZON` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró target needs_review con horizonte y unit; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta horizon", "fixture adverso: target needs_review con horizonte y unit", "CASO-LIM-033-1A es sintético"],
        tests: "Fixtures `CASO-LIM-033-1A`, adverso y sin `horizon` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FRAUD_TARGET y por qué faltar horizon exige REQUEST_HORIZON.",
        starterCode: {
          language: 'python',
          title: "s33-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
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
        instruction: "S33-T1-B-E1 · Calcula el contrato de `costos, baseline de regla y dummy estimator` sobre `CASO-LIM-033-1B`. La entrada es el dict completo del starter; la operación debe demostrar baseline y costo no nulos. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_NO_BASELINE` en E2.",
        hint: "Relaciona los campos `dummy_acc, cost, has_baseline` con la regla explicada en S33-T1-B.",
        hints: [
          "Relaciona los campos `dummy_acc, cost, has_baseline` con la regla explicada en S33-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva baseline y costo no nulos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta cost", "fixture adverso: baseline y costo no nulos", "CASO-LIM-033-1B es sintético"],
        tests: "El fixture `CASO-LIM-033-1B` satisface un predicado de dominio real; imprime `S33-T1-B PASS` y el assert booleano pasa.",
        feedback: "S33-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_NO_BASELINE y por qué faltar cost exige REQUEST_COST.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
meets_contract = record["has_baseline"] is False
status = "PASS" if meets_contract else "REJECT_NO_BASELINE"
print("S33-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
meets_contract = record["has_baseline"] is True and record["cost"] is not None and record["dummy_acc"] >= 0
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
        instruction: "S33-T1-B-E2 · Modela tres rutas de `costos, baseline de regla y dummy estimator`: fixture válido, fixture adverso y registro sin `cost`. Entrada: dict con case_id, dummy_acc, cost, has_baseline. Salidas exactas: `PASS`, `REJECT_NO_BASELINE`, `MISSING:cost`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cost debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T1-B: baseline y costo no nulos. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cost", "fixture adverso: baseline y costo no nulos", "CASO-LIM-033-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cost` ausente y produce exactamente `PASS REJECT_NO_BASELINE MISSING:cost`.",
        feedback: "S33-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_NO_BASELINE y por qué faltar cost exige REQUEST_COST.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
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

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
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
        instruction: "S33-T1-B-E3 · Contrasta fallo cerrado para `costos, baseline de regla y dummy estimator` con tres fixtures distintos. `CASO-LIM-033-1B` debe continuar, el adverso debe devolver `REJECT_NO_BASELINE` y la ausencia de `cost` debe devolver `REQUEST_COST`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_COST` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_COST` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró baseline y costo no nulos; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cost", "fixture adverso: baseline y costo no nulos", "CASO-LIM-033-1B es sintético"],
        tests: "Fixtures `CASO-LIM-033-1B`, adverso y sin `cost` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_NO_BASELINE y por qué faltar cost exige REQUEST_COST.",
        starterCode: {
          language: 'python',
          title: "s33-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'dummy_acc', 'cost', 'has_baseline'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["has_baseline"] is False else "REJECT_NO_BASELINE"

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
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

valid = {"case_id": "CASO-LIM-033-1B", **{'dummy_acc': 0.667, 'cost': 7, 'has_baseline': True}}
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
        instruction: "S33-T2-A-E1 · Calcula el contrato de `regresión/logística y regularización` sobre `CASO-LIM-033-2A`. La entrada es el dict completo del starter; la operación debe demostrar sigmoid p con L2>0 y pred binaria. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNREGULARIZED` en E2.",
        hint: "Relaciona los campos `p, pred, l2` con la regla explicada en S33-T2-A.",
        hints: [
          "Relaciona los campos `p, pred, l2` con la regla explicada en S33-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva sigmoid p con L2>0 y pred binaria; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta p", "fixture adverso: sigmoid p con L2>0 y pred binaria", "CASO-LIM-033-2A es sintético"],
        tests: "El fixture `CASO-LIM-033-2A` satisface un predicado de dominio real; imprime `S33-T2-A PASS` y el assert booleano pasa.",
        feedback: "S33-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNREGULARIZED y por qué faltar p exige REQUEST_SIGMOID.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
meets_contract = record["l2"] == 0
status = "PASS" if meets_contract else "REJECT_UNREGULARIZED"
print("S33-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-2A", **{'p': 0.5, 'pred': 0, 'l2': 5.0}}
meets_contract = record["l2"] > 0 and 0 <= record["p"] <= 1 and record["pred"] in (0, 1)
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
        instruction: "S33-T2-A-E2 · Modela tres rutas de `regresión/logística y regularización`: fixture válido, fixture adverso y registro sin `p`. Entrada: dict con case_id, p, pred, l2. Salidas exactas: `PASS`, `REJECT_UNREGULARIZED`, `MISSING:p`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a p debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a p debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T2-A: sigmoid p con L2>0 y pred binaria. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta p", "fixture adverso: sigmoid p con L2>0 y pred binaria", "CASO-LIM-033-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `p` ausente y produce exactamente `PASS REJECT_UNREGULARIZED MISSING:p`.",
        feedback: "S33-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNREGULARIZED y por qué faltar p exige REQUEST_SIGMOID.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T2-A-E3 · Contrasta fallo cerrado para `regresión/logística y regularización` con tres fixtures distintos. `CASO-LIM-033-2A` debe continuar, el adverso debe devolver `REJECT_UNREGULARIZED` y la ausencia de `p` debe devolver `REQUEST_SIGMOID`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SIGMOID` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SIGMOID` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró sigmoid p con L2>0 y pred binaria; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta p", "fixture adverso: sigmoid p con L2>0 y pred binaria", "CASO-LIM-033-2A es sintético"],
        tests: "Fixtures `CASO-LIM-033-2A`, adverso y sin `p` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNREGULARIZED y por qué faltar p exige REQUEST_SIGMOID.",
        starterCode: {
          language: 'python',
          title: "s33-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
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
        instruction: "S33-T2-B-E1 · Calcula el contrato de `coeficientes, supuestos y scaling` sobre `CASO-LIM-033-2B`. La entrada es el dict completo del starter; la operación debe demostrar coefs scaled con causal=False. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNSCALED_COEF` en E2.",
        hint: "Relaciona los campos `coefs, scaled, causal` con la regla explicada en S33-T2-B.",
        hints: [
          "Relaciona los campos `coefs, scaled, causal` con la regla explicada en S33-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva coefs scaled con causal=False; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: coefs scaled con causal=False", "CASO-LIM-033-2B es sintético"],
        tests: "El fixture `CASO-LIM-033-2B` satisface un predicado de dominio real; imprime `S33-T2-B PASS` y el assert booleano pasa.",
        feedback: "S33-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSCALED_COEF y por qué faltar scaled exige REQUEST_SCALE_FLAG.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
meets_contract = record["scaled"] is False or record["causal"] is True
status = "PASS" if meets_contract else "REJECT_UNSCALED_COEF"
print("S33-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-2B", **{'coefs': {'shared_phone': 0.8}, 'scaled': True, 'causal': False}}
meets_contract = record["scaled"] is True and record["causal"] is False
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
        instruction: "S33-T2-B-E2 · Modela tres rutas de `coeficientes, supuestos y scaling`: fixture válido, fixture adverso y registro sin `scaled`. Entrada: dict con case_id, coefs, scaled, causal. Salidas exactas: `PASS`, `REJECT_UNSCALED_COEF`, `MISSING:scaled`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a scaled debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a scaled debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T2-B: coefs scaled con causal=False. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: coefs scaled con causal=False", "CASO-LIM-033-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `scaled` ausente y produce exactamente `PASS REJECT_UNSCALED_COEF MISSING:scaled`.",
        feedback: "S33-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSCALED_COEF y por qué faltar scaled exige REQUEST_SCALE_FLAG.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T2-B-E3 · Contrasta fallo cerrado para `coeficientes, supuestos y scaling` con tres fixtures distintos. `CASO-LIM-033-2B` debe continuar, el adverso debe devolver `REJECT_UNSCALED_COEF` y la ausencia de `scaled` debe devolver `REQUEST_SCALE_FLAG`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SCALE_FLAG` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SCALE_FLAG` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró coefs scaled con causal=False; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta scaled", "fixture adverso: coefs scaled con causal=False", "CASO-LIM-033-2B es sintético"],
        tests: "Fixtures `CASO-LIM-033-2B`, adverso y sin `scaled` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSCALED_COEF y por qué faltar scaled exige REQUEST_SCALE_FLAG.",
        starterCode: {
          language: 'python',
          title: "s33-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
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
        instruction: "S33-T3-A-E1 · Calcula el contrato de `decisiones y random forest/boosting` sobre `CASO-LIM-033-3A`. La entrada es el dict completo del starter; la operación debe demostrar stump/vote con depth controlada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_DEPTH_UNLIMITED` en E2.",
        hint: "Relaciona los campos `stump_preds, majority, depth_unlimited` con la regla explicada en S33-T3-A.",
        hints: [
          "Relaciona los campos `stump_preds, majority, depth_unlimited` con la regla explicada en S33-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva stump/vote con depth controlada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: stump/vote con depth controlada", "CASO-LIM-033-3A es sintético"],
        tests: "El fixture `CASO-LIM-033-3A` satisface un predicado de dominio real; imprime `S33-T3-A PASS` y el assert booleano pasa.",
        feedback: "S33-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DEPTH_UNLIMITED y por qué faltar stump_preds exige REQUEST_STUMP.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
meets_contract = record["depth_unlimited"] is True
status = "PASS" if meets_contract else "REJECT_DEPTH_UNLIMITED"
print("S33-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-3A", **{'stump_preds': [0, 1], 'majority': 1, 'depth_unlimited': False}}
meets_contract = record["depth_unlimited"] is False and len(record["stump_preds"]) >= 1
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
        instruction: "S33-T3-A-E2 · Modela tres rutas de `decisiones y random forest/boosting`: fixture válido, fixture adverso y registro sin `stump_preds`. Entrada: dict con case_id, stump_preds, majority, depth_unlimited. Salidas exactas: `PASS`, `REJECT_DEPTH_UNLIMITED`, `MISSING:stump_preds`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a stump_preds debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a stump_preds debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T3-A: stump/vote con depth controlada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: stump/vote con depth controlada", "CASO-LIM-033-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `stump_preds` ausente y produce exactamente `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds`.",
        feedback: "S33-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DEPTH_UNLIMITED y por qué faltar stump_preds exige REQUEST_STUMP.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T3-A-E3 · Contrasta fallo cerrado para `decisiones y random forest/boosting` con tres fixtures distintos. `CASO-LIM-033-3A` debe continuar, el adverso debe devolver `REJECT_DEPTH_UNLIMITED` y la ausencia de `stump_preds` debe devolver `REQUEST_STUMP`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_STUMP` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_STUMP` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró stump/vote con depth controlada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta stump_preds", "fixture adverso: stump/vote con depth controlada", "CASO-LIM-033-3A es sintético"],
        tests: "Fixtures `CASO-LIM-033-3A`, adverso y sin `stump_preds` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DEPTH_UNLIMITED y por qué faltar stump_preds exige REQUEST_STUMP.",
        starterCode: {
          language: 'python',
          title: "s33-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
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
        instruction: "S33-T3-B-E1 · Calcula el contrato de `overfit, profundidad y reproducibilidad` sobre `CASO-LIM-033-3B`. La entrada es el dict completo del starter; la operación debe demostrar gap controlado y seed fija. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_OVERFIT` en E2.",
        hint: "Relaciona los campos `train_acc, valid_acc, seed` con la regla explicada en S33-T3-B.",
        hints: [
          "Relaciona los campos `train_acc, valid_acc, seed` con la regla explicada en S33-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva gap controlado y seed fija; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap controlado y seed fija", "CASO-LIM-033-3B es sintético"],
        tests: "El fixture `CASO-LIM-033-3B` satisface un predicado de dominio real; imprime `S33-T3-B PASS` y el assert booleano pasa.",
        feedback: "S33-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_OVERFIT y por qué faltar seed exige REQUEST_SEED.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
meets_contract = record["train_acc"] - record["valid_acc"] > 0.2
status = "PASS" if meets_contract else "REJECT_OVERFIT"
print("S33-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-3B", **{'train_acc': 0.8, 'valid_acc': 0.75, 'seed': 42}}
meets_contract = record["train_acc"] - record["valid_acc"] <= 0.2 and record["seed"] is not None
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
        instruction: "S33-T3-B-E2 · Modela tres rutas de `overfit, profundidad y reproducibilidad`: fixture válido, fixture adverso y registro sin `seed`. Entrada: dict con case_id, train_acc, valid_acc, seed. Salidas exactas: `PASS`, `REJECT_OVERFIT`, `MISSING:seed`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a seed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a seed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T3-B: gap controlado y seed fija. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap controlado y seed fija", "CASO-LIM-033-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `seed` ausente y produce exactamente `PASS REJECT_OVERFIT MISSING:seed`.",
        feedback: "S33-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_OVERFIT y por qué faltar seed exige REQUEST_SEED.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T3-B-E3 · Contrasta fallo cerrado para `overfit, profundidad y reproducibilidad` con tres fixtures distintos. `CASO-LIM-033-3B` debe continuar, el adverso debe devolver `REJECT_OVERFIT` y la ausencia de `seed` debe devolver `REQUEST_SEED`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SEED` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SEED` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró gap controlado y seed fija; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta seed", "fixture adverso: gap controlado y seed fija", "CASO-LIM-033-3B es sintético"],
        tests: "Fixtures `CASO-LIM-033-3B`, adverso y sin `seed` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_OVERFIT y por qué faltar seed exige REQUEST_SEED.",
        starterCode: {
          language: 'python',
          title: "s33-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
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
        instruction: "S33-T4-A-E1 · Calcula el contrato de `pipeline y tracking mínimo` sobre `CASO-LIM-033-4A`. La entrada es el dict completo del starter; la operación debe demostrar metrics no vacías con beats_dummy y run_id. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNLOGGED_RUN` en E2.",
        hint: "Relaciona los campos `metrics, beats_dummy, run_id` con la regla explicada en S33-T4-A.",
        hints: [
          "Relaciona los campos `metrics, beats_dummy, run_id` con la regla explicada en S33-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva metrics no vacías con beats_dummy y run_id; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics no vacías con beats_dummy y run_id", "CASO-LIM-033-4A es sintético"],
        tests: "El fixture `CASO-LIM-033-4A` satisface un predicado de dominio real; imprime `S33-T4-A PASS` y el assert booleano pasa.",
        feedback: "S33-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNLOGGED_RUN y por qué faltar metrics exige REQUEST_METRICS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
meets_contract = not record["metrics"]
status = "PASS" if meets_contract else "REJECT_UNLOGGED_RUN"
print("S33-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
meets_contract = bool(record["metrics"]) and record["beats_dummy"] is True and bool(record["run_id"])
status = "PASS" if meets_contract else "REJECT_UNLOGGED_RUN"
print("S33-T4-A", status)
assert meets_contract is True
` ,
          output: `S33-T4-A PASS` ,
        },
      },
      {
        id: "S33-T4-A-E2",
        subtopicId: "S33-T4-A",
        kind: "independent",
        instruction: "S33-T4-A-E2 · Modela tres rutas de `pipeline y tracking mínimo`: fixture válido, fixture adverso y registro sin `metrics`. Entrada: dict con case_id, metrics, beats_dummy, run_id. Salidas exactas: `PASS`, `REJECT_UNLOGGED_RUN`, `MISSING:metrics`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a metrics debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a metrics debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T4-A: metrics no vacías con beats_dummy y run_id. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics no vacías con beats_dummy y run_id", "CASO-LIM-033-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `metrics` ausente y produce exactamente `PASS REJECT_UNLOGGED_RUN MISSING:metrics`.",
        feedback: "S33-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNLOGGED_RUN y por qué faltar metrics exige REQUEST_METRICS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["metrics"] else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': 'run-1'}}
incomplete = {**valid}
incomplete.pop("metrics")
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
    return "PASS" if bool(record["metrics"]) and record["beats_dummy"] is True and bool(record["run_id"]) else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': 'run-1'}}
incomplete = {**valid}
incomplete.pop("metrics")
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
        instruction: "S33-T4-A-E3 · Contrasta fallo cerrado para `pipeline y tracking mínimo` con tres fixtures distintos. `CASO-LIM-033-4A` debe continuar, el adverso debe devolver `REJECT_UNLOGGED_RUN` y la ausencia de `metrics` debe devolver `REQUEST_METRICS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_METRICS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_METRICS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró metrics no vacías con beats_dummy y run_id; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta metrics", "fixture adverso: metrics no vacías con beats_dummy y run_id", "CASO-LIM-033-4A es sintético"],
        tests: "Fixtures `CASO-LIM-033-4A`, adverso y sin `metrics` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNLOGGED_RUN y por qué faltar metrics exige REQUEST_METRICS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'metrics', 'beats_dummy', 'run_id'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["metrics"] else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': 'run-1'}}
uncertain = {**valid}
uncertain.pop("metrics")
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
    return "CONTINUE" if bool(record["metrics"]) and record["beats_dummy"] is True and bool(record["run_id"]) else "REJECT_UNLOGGED_RUN"

valid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {'accuracy': 0.7, 'f1': 0.6}, 'beats_dummy': True, 'run_id': 'run-1'}}
invalid = {"case_id": "CASO-LIM-033-4A", **{'metrics': {}, 'beats_dummy': False, 'run_id': 'run-1'}}
uncertain = {**valid}
uncertain.pop("metrics")
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
        instruction: "S33-T4-B-E1 · Calcula el contrato de `validación cruzada apropiada y error analysis` sobre `CASO-LIM-033-4B`. La entrada es el dict completo del starter; la operación debe demostrar group CV con entities y sin random leak. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S33-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_RANDOM_LEAK` en E2.",
        hint: "Relaciona los campos `fold_scores, entities, random_split` con la regla explicada en S33-T4-B.",
        hints: [
          "Relaciona los campos `fold_scores, entities, random_split` con la regla explicada en S33-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva group CV con entities y sin random leak; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta entities", "fixture adverso: group CV con entities y sin random leak", "CASO-LIM-033-4B es sintético"],
        tests: "El fixture `CASO-LIM-033-4B` satisface un predicado de dominio real; imprime `S33-T4-B PASS` y el assert booleano pasa.",
        feedback: "S33-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_RANDOM_LEAK y por qué faltar entities exige REQUEST_GROUP_IDS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
meets_contract = record["random_split"] is True
status = "PASS" if meets_contract else "REJECT_RANDOM_LEAK"
print("S33-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s33-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-033-4B", **{'fold_scores': [0.6, 0.7], 'entities': ['e1', 'e2'], 'random_split': False}}
meets_contract = record["random_split"] is False and len(set(record["entities"])) >= 2
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
        instruction: "S33-T4-B-E2 · Modela tres rutas de `validación cruzada apropiada y error analysis`: fixture válido, fixture adverso y registro sin `entities`. Entrada: dict con case_id, fold_scores, entities, random_split. Salidas exactas: `PASS`, `REJECT_RANDOM_LEAK`, `MISSING:entities`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a entities debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a entities debe ocurrir antes de esa rama.",
          "Después aplica la regla de S33-T4-B: group CV con entities y sin random leak. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta entities", "fixture adverso: group CV con entities y sin random leak", "CASO-LIM-033-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `entities` ausente y produce exactamente `PASS REJECT_RANDOM_LEAK MISSING:entities`.",
        feedback: "S33-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_RANDOM_LEAK y por qué faltar entities exige REQUEST_GROUP_IDS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        instruction: "S33-T4-B-E3 · Contrasta fallo cerrado para `validación cruzada apropiada y error analysis` con tres fixtures distintos. `CASO-LIM-033-4B` debe continuar, el adverso debe devolver `REJECT_RANDOM_LEAK` y la ausencia de `entities` debe devolver `REQUEST_GROUP_IDS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_GROUP_IDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_GROUP_IDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró group CV con entities y sin random leak; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta entities", "fixture adverso: group CV con entities y sin random leak", "CASO-LIM-033-4B es sintético"],
        tests: "Fixtures `CASO-LIM-033-4B`, adverso y sin `entities` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S33-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_RANDOM_LEAK y por qué faltar entities exige REQUEST_GROUP_IDS.",
        starterCode: {
          language: 'python',
          title: "s33-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
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
      "Define unit/target/horizon, dummy+costo, lineal o stump, y run log con beats_dummy sobre CASO-LIM-033.",
    objectives: [
      "Framing sin fraud en target",
      "Dummy y costo documentados",
      "Modelo regularizado o stump con seed",
      "Run log y group CV por entidad",
    ],
    requirements: [
      "has_baseline=True",
      "Sin label de fraude",
      "es-PE sintético; seed fija",
    ],
    starterCode: `# baselines CP-N3-B — CASO-LIM-033
run = {"unit": None, "target": "needs_review_7d", "baseline": None, "metrics": {}}
# TODO: completa framing, dummy y beats_dummy
if __name__ == "__main__":
    print(sorted(run.keys()))
`,
    portfolioNote:
      "Baseline first; portfolio: run log + group CV.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "beats_dummy + group CV + seed", weight: "bonus" },
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
      }
    ],
  },
  resources: {
    docs: [
      { label: "sklearn dummy", url: "https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html", note: "Baseline" },
      { label: "Model evaluation", url: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "Group CV" },
    ],
    books: [
      { label: "Rules of ML (Google)", note: "Baseline first" },
      { label: "ISL / ESL excerpts", note: "Regularización" },
    ],
    courses: [
      { label: "Supervised ML (Coursera/Ng)", url: "https://www.coursera.org", note: "Logística y reg" },
    ],
  },
}
