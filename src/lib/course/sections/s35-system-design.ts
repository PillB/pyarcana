import type { CourseSection } from '../../types'

export const section35: CourseSection = {
  id: "system-design",
  index: 35,
  title: "Explicabilidad, equidad e incertidumbre",
  shortTitle: "Explainability y equidad",
  tagline: "ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana",
  estimatedHours: 19,
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
    { text: "Operar aprobación, override y retiro" }
  ],
  theory: [
    {
      heading: "Inicio CP-N3-C: ficha de caso responsable",
      paragraphs: [
        "Esta sección parte de S34 y usa únicamente métricas, umbrales y baselines ya presentados. El caso sintético `CASO-LIM-035` de Red Andina (organización ficticia en Lima) se ejecuta sin credenciales ni servicios externos.",
        "Producto incremental: ficha de caso que separa evidencia observada, contribución del modelo, incertidumbre y decisión humana. Entrada: score, features y cohorte; salida: plantilla auditables sin auto-etiqueta de fraude.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach o incertidumbre. Id legacy `system-design` se conserva."
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-C",
        content:
          "Inicio CP-N3-C: la ficha distingue capas; explicar no es acusar. Sin section_passed automático si falta evidencia o audit trail.",
      },
    },
    {
      heading: "coeficientes e importancia por permutación",
      subtopicId: "S35-T1-A",
      paragraphs: [
        "Los coeficientes de un modelo lineal y la importancia por permutación miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature. Son mapas globales del modelo, no veredictos sobre una persona real.",
        "Contrato operativo. Entrada: dict de drops por feature y métrica de cola. Salida: ranking top_feature con drop numérico y flag means_fraud=False. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: misma métrica de negocio en train y en permutación.",
        "Aplicación de importancia por permutación a `CASO-LIM-035`: shared_phone cae más que amount_7d en precision@k sintético; documentas sensibilidad del modelo sobre datos ficticios y nunca emites label de fraude/parentesco."
      ],
      code: {
        language: 'python',
        title: "perm_imp.py",
        code: `base = 0.80
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
        title: "Contrato local",
        content:
          "Evidencia mínima S35-T1-A: ranking de drops con means_fraud=False. Breach → REJECT_CAUSAL_CLAIM; falta drops → REQUEST_METRIC_DROP.",
      },
    },
    {
      heading: "explicación local, correlación y límites",
      subtopicId: "S35-T1-B",
      paragraphs: [
        "La explicación local asigna contribución de features al score del caso (p.ej. valor × peso). Correlación entre variables no implica que la contribución sea causa del comportamiento humano ni prueba legal.",
        "Contrato operativo. Entrada: pares (valor, peso) por feature. Salida: contribuciones, suma y plantilla de 4 capas (evidencia|modelo|incertidumbre|humano). Error: omitir límites o declarar causal=True. Criterio: cada capa tiene flag explícito.",
        "Aplicación de explicación local a `CASO-LIM-035`: shared_phone aporta 0.9 al score de cola; la ficha marca causal=False y deja la decisión al analista con override auditable. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
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
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S35-T1-B: 4 capas + causal=False. Breach → REJECT_CAUSAL_CLAIM; falta capas → REQUEST_LAYER_FIELDS.",
      },
    },
    {
      heading: "cohortes y métricas por slice",
      subtopicId: "S35-T2-A",
      paragraphs: [
        "Cortar por región, canal o tipo de enlace revela si la cola de revisión daña de forma desigual. Compara precision/recall o tasa de queue reportando siempre el tamaño muestral n del slice. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: dict slice→{n, precision}. Salida: flag low_n si n<30 y comparación documentada. Error: gritar inequidad con n=3 o esconder n. Criterio: n visible junto a cada métrica. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación de slices a `CASO-LIM-035`: LIM n=100 precision=0.6 (ok_n) vs AQP n=8 precision=0.9 (low_n). No se afirma paridad de fraude; solo daño diferencial potencial en revisión. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
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
        title: "Contrato local",
        content:
          "Antes de promover S35-T2-A, audita n por slice. low_n no prueba inequidad; breach de claim → REJECT_LOW_N_CLAIM.",
      },
    },
    {
      heading: "proxies, sample size y daño diferencial",
      subtopicId: "S35-T2-B",
      paragraphs: [
        "Un proxy es una variable que correlaciona con atributos sensibles (distrito, canal, idioma de nota). Su uso puede elevar falsos positivos en un grupo y generar fricción injustificada en la cola. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: features candidatas con risk tags. Salida: lista high-risk y acción mitigate/review. Error: silenciar proxy o convertirlo en label. Criterio: daño medido como delta de FP rate entre grupos sintéticos.",
        "Aplicación de proxies a `CASO-LIM-035`: district_code se marca high y se retira del set de features de ranking; se documenta sample size bajo en AQP antes de cualquier claim de paridad. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "proxies.py",
        code: `feats = {"shared_phone": "med", "district_code": "high", "amount_7d": "low"}
high = [k for k, v in feats.items() if v == "high"]
print(high)
print("action", "review")
print("means_fraud", False)`,
        output: `['district_code']
action review
means_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T2-B: lista high + action. Breach → REJECT_PROXY_FEATURE; falta audit → REQUEST_PROXY_AUDIT.",
      },
    },
    {
      heading: "calibración, intervalos/conformal conceptualmente",
      subtopicId: "S35-T3-A",
      paragraphs: [
        "Un score puntual engaña; comunicar intervalo o cobertura conceptual (p±q toy o conformal a alto nivel) deja claro qué tan estable es la señal de cola. Brier e intervalos son complementarios, no rivales.",
        "Contrato operativo. Entrada: p y q de incertidumbre. Salida: (lo, hi) y label de nivel. Error: publicar solo p sin ancho. Criterio: todo score de ficha lleva banda o flag de no-cobertura. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación a `CASO-LIM-035`: p=0.6 con q=0.1 produce [0.5, 0.7] nivel toy; el analista ve incertidumbre antes de override. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "interval.py",
        code: `p, q = 0.6, 0.1
print(round(p - q, 2), round(p + q, 2))
print("level", "toy")
print("point_only", False)`,
        output: `0.5 0.7
level toy
point_only False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T3-A: intervalo + level. Breach → REJECT_POINT_ONLY; falta q → REQUEST_INTERVAL.",
      },
    },
    {
      heading: "out-of-distribution y abstención",
      subtopicId: "S35-T3-B",
      paragraphs: [
        "Cuando un caso se sale del soporte visto en train (canal nuevo, z-score extremo), la política correcta es abstener y escalar, no forzar pred=1 ni inventar fraude. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: vector z y política ood. Salida: ood bool y action abstain|score. Error: auto-label en OOD. Criterio: fail-closed hacia humano. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación OOD a `CASO-LIM-035`: z=[1,2,3.5] dispara ood; action=abstain y la ficha registra uncertainty.reason=ood sin label de fraude. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "ood.py",
        code: `zs = [1, 2, 3.5]
ood = max(abs(x) for x in zs) > 3
print(ood)
print("action", "abstain" if ood else "score")
print("auto_fraud", False)`,
        output: `True
action abstain
auto_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T3-B: abstain en OOD. Breach → REJECT_AUTO_LABEL; falta política → REQUEST_OOD_POLICY.",
      },
    },
    {
      heading: "model card y contestabilidad",
      subtopicId: "S35-T4-A",
      paragraphs: [
        "La model card documenta uso permitido, out_of_scope, métricas y dueño. Contestabilidad exige canal para que un humano impugne el ranking sin borrar el audit trail. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: keys mínimas de card. Salida: card válida con out_of_scope que incluye fraud_label. Error: card vacía o uso prohibido habilitado. Criterio: contestability=True en ficha. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Aplicación model card a `CASO-LIM-035`: use=queue_rank, out_of_scope=fraud_label, owner=risk_ops; el caso puede apelar sin reescribir score histórico. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
      ],
      code: {
        language: 'python',
        title: "model_card.py",
        code: `card = {
    "use": "queue_rank",
    "out_of_scope": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
print("out_of_scope", card["out_of_scope"][0])
print("use", card["use"])
print("card", True)`,
        output: `out_of_scope fraud_label
use queue_rank
card True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T4-A: keys + out_of_scope. Breach → REJECT_SCOPE_BREACH; falta keys → REQUEST_CARD_KEYS.",
      },
    },
    {
      heading: "aprobación, override, apelación y retiro",
      subtopicId: "S35-T4-B",
      paragraphs: [
        "El ciclo de vida del modelo (proposed→approved→production→retired) y los overrides humanos deben dejar by, timestamp y razón. Sin audit no hay gobernanza. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail.",
        "Contrato operativo. Entrada: evento de override o retiro. Salida: log con case, human action, by. Error: override silencioso o retiro sin flag de drift. Criterio: toda decisión humana es reconstruible.",
        "Aplicación gobernanza a `CASO-LIM-035`: analyst_7 hace override_skip; el log guarda by y case; retiro por drift_flag=True mueve a retired sin borrar histórico. En el workbench sintético de Red Andina (Lima/Arequipa) documentas contrato, evidencia y límites: sin PII real, sin auto-etiqueta de fraude y con fail-closed cuando falta dueño, n del slice o audit trail."
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
        title: "Contrato local",
        content:
          "S35-T4-B: audit by/timestamp. Breach → REJECT_SILENT_OVERRIDE; falta fields → REQUEST_AUDIT_FIELDS.",
      },
    }
  ],
  iDo: {
    intro: "S35 · Te muestro explicación, equidad, incertidumbre y gobernanza de la ficha de caso sobre fixtures sintéticos de Red Andina (Lima).",
    steps: [
      {
        demoId: "S35-T1-A-DEMO",
        subtopicId: "S35-T1-A",
        environment: "local-python",
        description: "Ranking de importance por drop en métrica de cola sobre dict sintético de features del workbench.",
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
        why: "La importancia global orienta sensibilidad del modelo; nunca se traduce a veredicto de fraude en la ficha de caso.",
      },
      {
        demoId: "S35-T1-B-DEMO",
        subtopicId: "S35-T1-B",
        environment: "local-python",
        description: "Suma de contribuciones locales value×weight y marca causal=False para límites de explicación.",
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
        why: "La explicación local resume el score del caso; correlación o contribución no demuestran causalidad legal.",
      },
      {
        demoId: "S35-T2-A-DEMO",
        subtopicId: "S35-T2-A",
        environment: "local-python",
        description: "Flag low_n cuando el slice tiene n<30 para no gritar inequidad con muestra chica.",
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
        why: "Reportar n por cohorte evita claims de equidad estadísticamente vacíos en regiones con poco tráfico.",
      },
      {
        demoId: "S35-T2-B-DEMO",
        subtopicId: "S35-T2-B",
        environment: "local-python",
        description: "Lista proxies high-risk (district_code) y acción review sin emitir fraud label.",
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
        why: "Detectar proxies reduce daño diferencial en la cola; la mitigación es retirar o auditar, no acusar.",
      },
      {
        demoId: "S35-T3-A-DEMO",
        subtopicId: "S35-T3-A",
        environment: "local-python",
        description: "Intervalo toy p±q alrededor del score para comunicar incertidumbre en la ficha.",
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
        why: "Un punto sin ancho oculta inestabilidad; la banda conceptual prepara abstención y override humano.",
      },
      {
        demoId: "S35-T3-B-DEMO",
        subtopicId: "S35-T3-B",
        environment: "local-python",
        description: "Detección OOD por max |z|>3 y política de abstención fail-closed hacia humano.",
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
        why: "Fuera de distribución no se fuerza label; se abstiene y se escala con razón ood en uncertainty.",
      },
      {
        demoId: "S35-T4-A-DEMO",
        subtopicId: "S35-T4-A",
        environment: "local-python",
        description: "Model card mínima con out_of_scope=fraud_label y use=queue_rank para contestabilidad.",
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
        why: "Documentar usos prohibidos evita que el score se convierta en etiqueta automática de fraude.",
      },
      {
        demoId: "S35-T4-B-DEMO",
        subtopicId: "S35-T4-B",
        environment: "local-python",
        description: "Override audit con campos case, human y by para reconstruir la decisión humana.",
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
        why: "Sin by/timestamp no hay gobernanza; el override silencioso es un breach del ciclo de vida.",
      }
    ],
  },
  weDo: {
    intro: "S35 · Laboratorio ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S35-T1-A-E1",
        subtopicId: "S35-T1-A",
        kind: "guided",
        instruction: "S35-T1-A-E1 · Calcula el contrato de `coeficientes e importancia por permutación` sobre `CASO-LIM-035-1A`. La entrada es el dict completo del starter; la operación debe demostrar ranking de drops con means_fraud=False y métrica de negocio. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_CAUSAL_CLAIM` en E2.",
        hint: "Relaciona los campos `drops, metric, means_fraud` con la regla explicada en S35-T1-A.",
        hints: [
          "Relaciona los campos `drops, metric, means_fraud` con la regla explicada en S35-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ranking de drops con means_fraud=False y métrica de negocio; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta drops", "fixture adverso: ranking de drops con means_fraud=False y métrica de negocio", "CASO-LIM-035-1A es sintético"],
        tests: "El fixture `CASO-LIM-035-1A` satisface un predicado de dominio real; imprime `S35-T1-A PASS` y el assert booleano pasa.",
        feedback: "S35-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar drops exige REQUEST_METRIC_DROP.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
meets_contract = record["means_fraud"] is True
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
meets_contract = record["means_fraud"] is False and record["metric"] == "precision_at_k" and max(record["drops"].values()) > 0
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-A", status)
assert meets_contract is True
` ,
          output: `S35-T1-A PASS` ,
        },
      },
      {
        id: "S35-T1-A-E2",
        subtopicId: "S35-T1-A",
        kind: "independent",
        instruction: "S35-T1-A-E2 · Modela tres rutas de `coeficientes e importancia por permutación`: fixture válido, fixture adverso y registro sin `drops`. Entrada: dict con case_id, drops, metric, means_fraud. Salidas exactas: `PASS`, `REJECT_CAUSAL_CLAIM`, `MISSING:drops`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a drops debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a drops debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T1-A: ranking de drops con means_fraud=False y métrica de negocio. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta drops", "fixture adverso: ranking de drops con means_fraud=False y métrica de negocio", "CASO-LIM-035-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `drops` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:drops`.",
        feedback: "S35-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar drops exige REQUEST_METRIC_DROP.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'drops', 'metric', 'means_fraud'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["means_fraud"] is True else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
invalid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1}, 'metric': 'precision_at_k', 'means_fraud': True}}
incomplete = {**valid}
incomplete.pop("drops")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'drops', 'metric', 'means_fraud'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["means_fraud"] is False and record["metric"] == "precision_at_k" and max(record["drops"].values()) > 0 else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
invalid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1}, 'metric': 'precision_at_k', 'means_fraud': True}}
incomplete = {**valid}
incomplete.pop("drops")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_CAUSAL_CLAIM MISSING:drops` ,
        },
      },
      {
        id: "S35-T1-A-E3",
        subtopicId: "S35-T1-A",
        kind: "transfer",
        instruction: "S35-T1-A-E3 · Contrasta fallo cerrado para `coeficientes e importancia por permutación` con tres fixtures distintos. `CASO-LIM-035-1A` debe continuar, el adverso debe devolver `REJECT_CAUSAL_CLAIM` y la ausencia de `drops` debe devolver `REQUEST_METRIC_DROP`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ranking de drops con means_fraud=False y métrica de negocio; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta drops", "fixture adverso: ranking de drops con means_fraud=False y métrica de negocio", "CASO-LIM-035-1A es sintético"],
        tests: "Fixtures `CASO-LIM-035-1A`, adverso y sin `drops` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar drops exige REQUEST_METRIC_DROP.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'drops', 'metric', 'means_fraud'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["means_fraud"] is True else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
invalid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1}, 'metric': 'precision_at_k', 'means_fraud': True}}
uncertain = {**valid}
uncertain.pop("drops")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'drops', 'metric', 'means_fraud'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_METRIC_DROP"
    return "CONTINUE" if record["means_fraud"] is False and record["metric"] == "precision_at_k" and max(record["drops"].values()) > 0 else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1, 'amount_7d': 0.03}, 'metric': 'precision_at_k', 'means_fraud': False}}
invalid = {"case_id": "CASO-LIM-035-1A", **{'drops': {'shared_phone': 0.1}, 'metric': 'precision_at_k', 'means_fraud': True}}
uncertain = {**valid}
uncertain.pop("drops")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_CAUSAL_CLAIM", "REQUEST_METRIC_DROP"]
` ,
          output: `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_METRIC_DROP` ,
        },
      },
      {
        id: "S35-T1-B-E1",
        subtopicId: "S35-T1-B",
        kind: "guided",
        instruction: "S35-T1-B-E1 · Calcula el contrato de `explicación local, correlación y límites` sobre `CASO-LIM-035-1B`. La entrada es el dict completo del starter; la operación debe demostrar cuatro capas y causal=False en la ficha. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_CAUSAL_CLAIM` en E2.",
        hint: "Relaciona los campos `contrib, layers, causal` con la regla explicada en S35-T1-B.",
        hints: [
          "Relaciona los campos `contrib, layers, causal` con la regla explicada en S35-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva cuatro capas y causal=False en la ficha; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta layers", "fixture adverso: cuatro capas y causal=False en la ficha", "CASO-LIM-035-1B es sintético"],
        tests: "El fixture `CASO-LIM-035-1B` satisface un predicado de dominio real; imprime `S35-T1-B PASS` y el assert booleano pasa.",
        feedback: "S35-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar layers exige REQUEST_LAYER_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
meets_contract = record["causal"] is True
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
meets_contract = record["causal"] is False and set(record["layers"]) == {"evidence", "model", "uncertainty", "human"}
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-B", status)
assert meets_contract is True
` ,
          output: `S35-T1-B PASS` ,
        },
      },
      {
        id: "S35-T1-B-E2",
        subtopicId: "S35-T1-B",
        kind: "independent",
        instruction: "S35-T1-B-E2 · Modela tres rutas de `explicación local, correlación y límites`: fixture válido, fixture adverso y registro sin `layers`. Entrada: dict con case_id, contrib, layers, causal. Salidas exactas: `PASS`, `REJECT_CAUSAL_CLAIM`, `MISSING:layers`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T1-B: cuatro capas y causal=False en la ficha. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta layers", "fixture adverso: cuatro capas y causal=False en la ficha", "CASO-LIM-035-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `layers` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:layers`.",
        feedback: "S35-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar layers exige REQUEST_LAYER_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'contrib', 'layers', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["causal"] is True else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
invalid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9}, 'layers': ['evidence', 'model'], 'causal': True}}
incomplete = {**valid}
incomplete.pop("layers")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'contrib', 'layers', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["causal"] is False and set(record["layers"]) == {"evidence", "model", "uncertainty", "human"} else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
invalid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9}, 'layers': ['evidence', 'model'], 'causal': True}}
incomplete = {**valid}
incomplete.pop("layers")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_CAUSAL_CLAIM MISSING:layers` ,
        },
      },
      {
        id: "S35-T1-B-E3",
        subtopicId: "S35-T1-B",
        kind: "transfer",
        instruction: "S35-T1-B-E3 · Contrasta fallo cerrado para `explicación local, correlación y límites` con tres fixtures distintos. `CASO-LIM-035-1B` debe continuar, el adverso debe devolver `REJECT_CAUSAL_CLAIM` y la ausencia de `layers` debe devolver `REQUEST_LAYER_FIELDS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_LAYER_FIELDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_LAYER_FIELDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cuatro capas y causal=False en la ficha; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta layers", "fixture adverso: cuatro capas y causal=False en la ficha", "CASO-LIM-035-1B es sintético"],
        tests: "Fixtures `CASO-LIM-035-1B`, adverso y sin `layers` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar layers exige REQUEST_LAYER_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'contrib', 'layers', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["causal"] is True else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
invalid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9}, 'layers': ['evidence', 'model'], 'causal': True}}
uncertain = {**valid}
uncertain.pop("layers")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'contrib', 'layers', 'causal'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_LAYER_FIELDS"
    return "CONTINUE" if record["causal"] is False and set(record["layers"]) == {"evidence", "model", "uncertainty", "human"} else "REJECT_CAUSAL_CLAIM"

valid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'layers': ['evidence', 'model', 'uncertainty', 'human'], 'causal': False}}
invalid = {"case_id": "CASO-LIM-035-1B", **{'contrib': {'shared_phone': 0.9}, 'layers': ['evidence', 'model'], 'causal': True}}
uncertain = {**valid}
uncertain.pop("layers")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_CAUSAL_CLAIM", "REQUEST_LAYER_FIELDS"]
` ,
          output: `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_LAYER_FIELDS` ,
        },
      },
      {
        id: "S35-T2-A-E1",
        subtopicId: "S35-T2-A",
        kind: "guided",
        instruction: "S35-T2-A-E1 · Calcula el contrato de `cohortes y métricas por slice` sobre `CASO-LIM-035-2A`. La entrada es el dict completo del starter; la operación debe demostrar n suficiente junto a precision de slice. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_LOW_N_CLAIM` en E2.",
        hint: "Relaciona los campos `slice_n, precision, min_n` con la regla explicada en S35-T2-A.",
        hints: [
          "Relaciona los campos `slice_n, precision, min_n` con la regla explicada en S35-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva n suficiente junto a precision de slice; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: n suficiente junto a precision de slice", "CASO-LIM-035-2A es sintético"],
        tests: "El fixture `CASO-LIM-035-2A` satisface un predicado de dominio real; imprime `S35-T2-A PASS` y el assert booleano pasa.",
        feedback: "S35-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LOW_N_CLAIM y por qué faltar slice_n exige REQUEST_SLICE_N.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
meets_contract = record["slice_n"] < record["min_n"]
status = "PASS" if meets_contract else "REJECT_LOW_N_CLAIM"
print("S35-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
meets_contract = record["slice_n"] >= record["min_n"] and 0 <= record["precision"] <= 1
status = "PASS" if meets_contract else "REJECT_LOW_N_CLAIM"
print("S35-T2-A", status)
assert meets_contract is True
` ,
          output: `S35-T2-A PASS` ,
        },
      },
      {
        id: "S35-T2-A-E2",
        subtopicId: "S35-T2-A",
        kind: "independent",
        instruction: "S35-T2-A-E2 · Modela tres rutas de `cohortes y métricas por slice`: fixture válido, fixture adverso y registro sin `slice_n`. Entrada: dict con case_id, slice_n, precision, min_n. Salidas exactas: `PASS`, `REJECT_LOW_N_CLAIM`, `MISSING:slice_n`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-A: n suficiente junto a precision de slice. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: n suficiente junto a precision de slice", "CASO-LIM-035-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `slice_n` ausente y produce exactamente `PASS REJECT_LOW_N_CLAIM MISSING:slice_n`.",
        feedback: "S35-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LOW_N_CLAIM y por qué faltar slice_n exige REQUEST_SLICE_N.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'slice_n', 'precision', 'min_n'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["slice_n"] < record["min_n"] else "REJECT_LOW_N_CLAIM"

valid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
invalid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 5, 'precision': 0.95, 'min_n': 30}}
incomplete = {**valid}
incomplete.pop("slice_n")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'slice_n', 'precision', 'min_n'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["slice_n"] >= record["min_n"] and 0 <= record["precision"] <= 1 else "REJECT_LOW_N_CLAIM"

valid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
invalid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 5, 'precision': 0.95, 'min_n': 30}}
incomplete = {**valid}
incomplete.pop("slice_n")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_LOW_N_CLAIM MISSING:slice_n` ,
        },
      },
      {
        id: "S35-T2-A-E3",
        subtopicId: "S35-T2-A",
        kind: "transfer",
        instruction: "S35-T2-A-E3 · Contrasta fallo cerrado para `cohortes y métricas por slice` con tres fixtures distintos. `CASO-LIM-035-2A` debe continuar, el adverso debe devolver `REJECT_LOW_N_CLAIM` y la ausencia de `slice_n` debe devolver `REQUEST_SLICE_N`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SLICE_N` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SLICE_N` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró n suficiente junto a precision de slice; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: n suficiente junto a precision de slice", "CASO-LIM-035-2A es sintético"],
        tests: "Fixtures `CASO-LIM-035-2A`, adverso y sin `slice_n` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LOW_N_CLAIM y por qué faltar slice_n exige REQUEST_SLICE_N.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'slice_n', 'precision', 'min_n'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["slice_n"] < record["min_n"] else "REJECT_LOW_N_CLAIM"

valid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
invalid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 5, 'precision': 0.95, 'min_n': 30}}
uncertain = {**valid}
uncertain.pop("slice_n")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'slice_n', 'precision', 'min_n'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SLICE_N"
    return "CONTINUE" if record["slice_n"] >= record["min_n"] and 0 <= record["precision"] <= 1 else "REJECT_LOW_N_CLAIM"

valid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 100, 'precision': 0.6, 'min_n': 30}}
invalid = {"case_id": "CASO-LIM-035-2A", **{'slice_n': 5, 'precision': 0.95, 'min_n': 30}}
uncertain = {**valid}
uncertain.pop("slice_n")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_LOW_N_CLAIM", "REQUEST_SLICE_N"]
` ,
          output: `CONTINUE REJECT_LOW_N_CLAIM REQUEST_SLICE_N` ,
        },
      },
      {
        id: "S35-T2-B-E1",
        subtopicId: "S35-T2-B",
        kind: "guided",
        instruction: "S35-T2-B-E1 · Calcula el contrato de `proxies, sample size y daño diferencial` sobre `CASO-LIM-035-2B`. La entrada es el dict completo del starter; la operación debe demostrar proxy high con acción de mitigación o review. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_PROXY_FEATURE` en E2.",
        hint: "Relaciona los campos `feature, risk, action` con la regla explicada en S35-T2-B.",
        hints: [
          "Relaciona los campos `feature, risk, action` con la regla explicada en S35-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva proxy high con acción de mitigación o review; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta action", "fixture adverso: proxy high con acción de mitigación o review", "CASO-LIM-035-2B es sintético"],
        tests: "El fixture `CASO-LIM-035-2B` satisface un predicado de dominio real; imprime `S35-T2-B PASS` y el assert booleano pasa.",
        feedback: "S35-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PROXY_FEATURE y por qué faltar action exige REQUEST_PROXY_AUDIT.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
meets_contract = record["action"] == "auto_label"
status = "PASS" if meets_contract else "REJECT_PROXY_FEATURE"
print("S35-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
meets_contract = record["risk"] == "high" and record["action"] in {"review", "mitigate", "drop"}
status = "PASS" if meets_contract else "REJECT_PROXY_FEATURE"
print("S35-T2-B", status)
assert meets_contract is True
` ,
          output: `S35-T2-B PASS` ,
        },
      },
      {
        id: "S35-T2-B-E2",
        subtopicId: "S35-T2-B",
        kind: "independent",
        instruction: "S35-T2-B-E2 · Modela tres rutas de `proxies, sample size y daño diferencial`: fixture válido, fixture adverso y registro sin `action`. Entrada: dict con case_id, feature, risk, action. Salidas exactas: `PASS`, `REJECT_PROXY_FEATURE`, `MISSING:action`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-B: proxy high con acción de mitigación o review. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: proxy high con acción de mitigación o review", "CASO-LIM-035-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_PROXY_FEATURE MISSING:action`.",
        feedback: "S35-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PROXY_FEATURE y por qué faltar action exige REQUEST_PROXY_AUDIT.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'feature', 'risk', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["action"] == "auto_label" else "REJECT_PROXY_FEATURE"

valid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
invalid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'auto_label'}}
incomplete = {**valid}
incomplete.pop("action")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'feature', 'risk', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["risk"] == "high" and record["action"] in {"review", "mitigate", "drop"} else "REJECT_PROXY_FEATURE"

valid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
invalid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'auto_label'}}
incomplete = {**valid}
incomplete.pop("action")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_PROXY_FEATURE MISSING:action` ,
        },
      },
      {
        id: "S35-T2-B-E3",
        subtopicId: "S35-T2-B",
        kind: "transfer",
        instruction: "S35-T2-B-E3 · Contrasta fallo cerrado para `proxies, sample size y daño diferencial` con tres fixtures distintos. `CASO-LIM-035-2B` debe continuar, el adverso debe devolver `REJECT_PROXY_FEATURE` y la ausencia de `action` debe devolver `REQUEST_PROXY_AUDIT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_PROXY_AUDIT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_PROXY_AUDIT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró proxy high con acción de mitigación o review; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta action", "fixture adverso: proxy high con acción de mitigación o review", "CASO-LIM-035-2B es sintético"],
        tests: "Fixtures `CASO-LIM-035-2B`, adverso y sin `action` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PROXY_FEATURE y por qué faltar action exige REQUEST_PROXY_AUDIT.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'feature', 'risk', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["action"] == "auto_label" else "REJECT_PROXY_FEATURE"

valid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
invalid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'auto_label'}}
uncertain = {**valid}
uncertain.pop("action")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'feature', 'risk', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_PROXY_AUDIT"
    return "CONTINUE" if record["risk"] == "high" and record["action"] in {"review", "mitigate", "drop"} else "REJECT_PROXY_FEATURE"

valid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'review'}}
invalid = {"case_id": "CASO-LIM-035-2B", **{'feature': 'district_code', 'risk': 'high', 'action': 'auto_label'}}
uncertain = {**valid}
uncertain.pop("action")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_PROXY_FEATURE", "REQUEST_PROXY_AUDIT"]
` ,
          output: `CONTINUE REJECT_PROXY_FEATURE REQUEST_PROXY_AUDIT` ,
        },
      },
      {
        id: "S35-T3-A-E1",
        subtopicId: "S35-T3-A",
        kind: "guided",
        instruction: "S35-T3-A-E1 · Calcula el contrato de `calibración, intervalos/conformal conceptualmente` sobre `CASO-LIM-035-3A`. La entrada es el dict completo del starter; la operación debe demostrar intervalo con q>0 y level distinto de point. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_POINT_ONLY` en E2.",
        hint: "Relaciona los campos `p, q, level` con la regla explicada en S35-T3-A.",
        hints: [
          "Relaciona los campos `p, q, level` con la regla explicada en S35-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva intervalo con q>0 y level distinto de point; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta q", "fixture adverso: intervalo con q>0 y level distinto de point", "CASO-LIM-035-3A es sintético"],
        tests: "El fixture `CASO-LIM-035-3A` satisface un predicado de dominio real; imprime `S35-T3-A PASS` y el assert booleano pasa.",
        feedback: "S35-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_POINT_ONLY y por qué faltar q exige REQUEST_INTERVAL.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
meets_contract = record["q"] == 0
status = "PASS" if meets_contract else "REJECT_POINT_ONLY"
print("S35-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
meets_contract = record["q"] > 0 and record["level"] != "point" and 0 <= record["p"] <= 1
status = "PASS" if meets_contract else "REJECT_POINT_ONLY"
print("S35-T3-A", status)
assert meets_contract is True
` ,
          output: `S35-T3-A PASS` ,
        },
      },
      {
        id: "S35-T3-A-E2",
        subtopicId: "S35-T3-A",
        kind: "independent",
        instruction: "S35-T3-A-E2 · Modela tres rutas de `calibración, intervalos/conformal conceptualmente`: fixture válido, fixture adverso y registro sin `q`. Entrada: dict con case_id, p, q, level. Salidas exactas: `PASS`, `REJECT_POINT_ONLY`, `MISSING:q`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-A: intervalo con q>0 y level distinto de point. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta q", "fixture adverso: intervalo con q>0 y level distinto de point", "CASO-LIM-035-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `q` ausente y produce exactamente `PASS REJECT_POINT_ONLY MISSING:q`.",
        feedback: "S35-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_POINT_ONLY y por qué faltar q exige REQUEST_INTERVAL.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'p', 'q', 'level'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["q"] == 0 else "REJECT_POINT_ONLY"

valid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
invalid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.0, 'level': 'point'}}
incomplete = {**valid}
incomplete.pop("q")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'p', 'q', 'level'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["q"] > 0 and record["level"] != "point" and 0 <= record["p"] <= 1 else "REJECT_POINT_ONLY"

valid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
invalid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.0, 'level': 'point'}}
incomplete = {**valid}
incomplete.pop("q")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_POINT_ONLY MISSING:q` ,
        },
      },
      {
        id: "S35-T3-A-E3",
        subtopicId: "S35-T3-A",
        kind: "transfer",
        instruction: "S35-T3-A-E3 · Contrasta fallo cerrado para `calibración, intervalos/conformal conceptualmente` con tres fixtures distintos. `CASO-LIM-035-3A` debe continuar, el adverso debe devolver `REJECT_POINT_ONLY` y la ausencia de `q` debe devolver `REQUEST_INTERVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró intervalo con q>0 y level distinto de point; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta q", "fixture adverso: intervalo con q>0 y level distinto de point", "CASO-LIM-035-3A es sintético"],
        tests: "Fixtures `CASO-LIM-035-3A`, adverso y sin `q` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_POINT_ONLY y por qué faltar q exige REQUEST_INTERVAL.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'p', 'q', 'level'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["q"] == 0 else "REJECT_POINT_ONLY"

valid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
invalid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.0, 'level': 'point'}}
uncertain = {**valid}
uncertain.pop("q")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'p', 'q', 'level'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_INTERVAL"
    return "CONTINUE" if record["q"] > 0 and record["level"] != "point" and 0 <= record["p"] <= 1 else "REJECT_POINT_ONLY"

valid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.1, 'level': 'toy'}}
invalid = {"case_id": "CASO-LIM-035-3A", **{'p': 0.6, 'q': 0.0, 'level': 'point'}}
uncertain = {**valid}
uncertain.pop("q")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_POINT_ONLY", "REQUEST_INTERVAL"]
` ,
          output: `CONTINUE REJECT_POINT_ONLY REQUEST_INTERVAL` ,
        },
      },
      {
        id: "S35-T3-B-E1",
        subtopicId: "S35-T3-B",
        kind: "guided",
        instruction: "S35-T3-B-E1 · Calcula el contrato de `out-of-distribution y abstención` sobre `CASO-LIM-035-3B`. La entrada es el dict completo del starter; la operación debe demostrar OOD detectado con action abstain y sin auto-label. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_AUTO_LABEL` en E2.",
        hint: "Relaciona los campos `zs, threshold, action` con la regla explicada en S35-T3-B.",
        hints: [
          "Relaciona los campos `zs, threshold, action` con la regla explicada en S35-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva OOD detectado con action abstain y sin auto-label; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD detectado con action abstain y sin auto-label", "CASO-LIM-035-3B es sintético"],
        tests: "El fixture `CASO-LIM-035-3B` satisface un predicado de dominio real; imprime `S35-T3-B PASS` y el assert booleano pasa.",
        feedback: "S35-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AUTO_LABEL y por qué faltar action exige REQUEST_OOD_POLICY.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
meets_contract = record["action"] == "auto_fraud"
status = "PASS" if meets_contract else "REJECT_AUTO_LABEL"
print("S35-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
meets_contract = max(abs(z) for z in record["zs"]) > record["threshold"] and record["action"] == "abstain"
status = "PASS" if meets_contract else "REJECT_AUTO_LABEL"
print("S35-T3-B", status)
assert meets_contract is True
` ,
          output: `S35-T3-B PASS` ,
        },
      },
      {
        id: "S35-T3-B-E2",
        subtopicId: "S35-T3-B",
        kind: "independent",
        instruction: "S35-T3-B-E2 · Modela tres rutas de `out-of-distribution y abstención`: fixture válido, fixture adverso y registro sin `action`. Entrada: dict con case_id, zs, threshold, action. Salidas exactas: `PASS`, `REJECT_AUTO_LABEL`, `MISSING:action`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-B: OOD detectado con action abstain y sin auto-label. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD detectado con action abstain y sin auto-label", "CASO-LIM-035-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_AUTO_LABEL MISSING:action`.",
        feedback: "S35-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AUTO_LABEL y por qué faltar action exige REQUEST_OOD_POLICY.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'zs', 'threshold', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["action"] == "auto_fraud" else "REJECT_AUTO_LABEL"

valid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
invalid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'auto_fraud'}}
incomplete = {**valid}
incomplete.pop("action")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'zs', 'threshold', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if max(abs(z) for z in record["zs"]) > record["threshold"] and record["action"] == "abstain" else "REJECT_AUTO_LABEL"

valid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
invalid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'auto_fraud'}}
incomplete = {**valid}
incomplete.pop("action")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_AUTO_LABEL MISSING:action` ,
        },
      },
      {
        id: "S35-T3-B-E3",
        subtopicId: "S35-T3-B",
        kind: "transfer",
        instruction: "S35-T3-B-E3 · Contrasta fallo cerrado para `out-of-distribution y abstención` con tres fixtures distintos. `CASO-LIM-035-3B` debe continuar, el adverso debe devolver `REJECT_AUTO_LABEL` y la ausencia de `action` debe devolver `REQUEST_OOD_POLICY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_OOD_POLICY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_OOD_POLICY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró OOD detectado con action abstain y sin auto-label; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD detectado con action abstain y sin auto-label", "CASO-LIM-035-3B es sintético"],
        tests: "Fixtures `CASO-LIM-035-3B`, adverso y sin `action` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AUTO_LABEL y por qué faltar action exige REQUEST_OOD_POLICY.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'zs', 'threshold', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["action"] == "auto_fraud" else "REJECT_AUTO_LABEL"

valid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
invalid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'auto_fraud'}}
uncertain = {**valid}
uncertain.pop("action")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'zs', 'threshold', 'action'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_OOD_POLICY"
    return "CONTINUE" if max(abs(z) for z in record["zs"]) > record["threshold"] and record["action"] == "abstain" else "REJECT_AUTO_LABEL"

valid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'abstain'}}
invalid = {"case_id": "CASO-LIM-035-3B", **{'zs': [1.0, 2.0, 3.5], 'threshold': 3.0, 'action': 'auto_fraud'}}
uncertain = {**valid}
uncertain.pop("action")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_AUTO_LABEL", "REQUEST_OOD_POLICY"]
` ,
          output: `CONTINUE REJECT_AUTO_LABEL REQUEST_OOD_POLICY` ,
        },
      },
      {
        id: "S35-T4-A-E1",
        subtopicId: "S35-T4-A",
        kind: "guided",
        instruction: "S35-T4-A-E1 · Calcula el contrato de `model card y contestabilidad` sobre `CASO-LIM-035-4A`. La entrada es el dict completo del starter; la operación debe demostrar card con use queue_rank, out_of_scope fraud_label y contestability. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_SCOPE_BREACH` en E2.",
        hint: "Relaciona los campos `use, out_of_scope, contestability` con la regla explicada en S35-T4-A.",
        hints: [
          "Relaciona los campos `use, out_of_scope, contestability` con la regla explicada en S35-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva card con use queue_rank, out_of_scope fraud_label y contestability; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: card con use queue_rank, out_of_scope fraud_label y contestability", "CASO-LIM-035-4A es sintético"],
        tests: "El fixture `CASO-LIM-035-4A` satisface un predicado de dominio real; imprime `S35-T4-A PASS` y el assert booleano pasa.",
        feedback: "S35-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCOPE_BREACH y por qué faltar out_of_scope exige REQUEST_CARD_KEYS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
meets_contract = record["use"] == "fraud_label"
status = "PASS" if meets_contract else "REJECT_SCOPE_BREACH"
print("S35-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
meets_contract = record["use"] == "queue_rank" and "fraud_label" in record["out_of_scope"] and record["contestability"] is True
status = "PASS" if meets_contract else "REJECT_SCOPE_BREACH"
print("S35-T4-A", status)
assert meets_contract is True
` ,
          output: `S35-T4-A PASS` ,
        },
      },
      {
        id: "S35-T4-A-E2",
        subtopicId: "S35-T4-A",
        kind: "independent",
        instruction: "S35-T4-A-E2 · Modela tres rutas de `model card y contestabilidad`: fixture válido, fixture adverso y registro sin `out_of_scope`. Entrada: dict con case_id, use, out_of_scope, contestability. Salidas exactas: `PASS`, `REJECT_SCOPE_BREACH`, `MISSING:out_of_scope`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-A: card con use queue_rank, out_of_scope fraud_label y contestability. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: card con use queue_rank, out_of_scope fraud_label y contestability", "CASO-LIM-035-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `out_of_scope` ausente y produce exactamente `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope`.",
        feedback: "S35-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCOPE_BREACH y por qué faltar out_of_scope exige REQUEST_CARD_KEYS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'use', 'out_of_scope', 'contestability'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["use"] == "fraud_label" else "REJECT_SCOPE_BREACH"

valid = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
invalid = {"case_id": "CASO-LIM-035-4A", **{'use': 'fraud_label', 'out_of_scope': [], 'contestability': False}}
incomplete = {**valid}
incomplete.pop("out_of_scope")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'use', 'out_of_scope', 'contestability'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["use"] == "queue_rank" and "fraud_label" in record["out_of_scope"] and record["contestability"] is True else "REJECT_SCOPE_BREACH"

valid = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
invalid = {"case_id": "CASO-LIM-035-4A", **{'use': 'fraud_label', 'out_of_scope': [], 'contestability': False}}
incomplete = {**valid}
incomplete.pop("out_of_scope")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope` ,
        },
      },
      {
        id: "S35-T4-A-E3",
        subtopicId: "S35-T4-A",
        kind: "transfer",
        instruction: "S35-T4-A-E3 · Contrasta fallo cerrado para `model card y contestabilidad` con tres fixtures distintos. `CASO-LIM-035-4A` debe continuar, el adverso debe devolver `REJECT_SCOPE_BREACH` y la ausencia de `out_of_scope` debe devolver `REQUEST_CARD_KEYS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CARD_KEYS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CARD_KEYS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró card con use queue_rank, out_of_scope fraud_label y contestability; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: card con use queue_rank, out_of_scope fraud_label y contestability", "CASO-LIM-035-4A es sintético"],
        tests: "Fixtures `CASO-LIM-035-4A`, adverso y sin `out_of_scope` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCOPE_BREACH y por qué faltar out_of_scope exige REQUEST_CARD_KEYS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'use', 'out_of_scope', 'contestability'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["use"] == "fraud_label" else "REJECT_SCOPE_BREACH"

valid = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
invalid = {"case_id": "CASO-LIM-035-4A", **{'use': 'fraud_label', 'out_of_scope': [], 'contestability': False}}
uncertain = {**valid}
uncertain.pop("out_of_scope")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'use', 'out_of_scope', 'contestability'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CARD_KEYS"
    return "CONTINUE" if record["use"] == "queue_rank" and "fraud_label" in record["out_of_scope"] and record["contestability"] is True else "REJECT_SCOPE_BREACH"

valid = {"case_id": "CASO-LIM-035-4A", **{'use': 'queue_rank', 'out_of_scope': ['fraud_label'], 'contestability': True}}
invalid = {"case_id": "CASO-LIM-035-4A", **{'use': 'fraud_label', 'out_of_scope': [], 'contestability': False}}
uncertain = {**valid}
uncertain.pop("out_of_scope")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_SCOPE_BREACH", "REQUEST_CARD_KEYS"]
` ,
          output: `CONTINUE REJECT_SCOPE_BREACH REQUEST_CARD_KEYS` ,
        },
      },
      {
        id: "S35-T4-B-E1",
        subtopicId: "S35-T4-B",
        kind: "guided",
        instruction: "S35-T4-B-E1 · Calcula el contrato de `aprobación, override, apelación y retiro` sobre `CASO-LIM-035-4B`. La entrada es el dict completo del starter; la operación debe demostrar override con case, human y by no vacío. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S35-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_SILENT_OVERRIDE` en E2.",
        hint: "Relaciona los campos `case, human, by` con la regla explicada en S35-T4-B.",
        hints: [
          "Relaciona los campos `case, human, by` con la regla explicada en S35-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva override con case, human y by no vacío; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta by", "fixture adverso: override con case, human y by no vacío", "CASO-LIM-035-4B es sintético"],
        tests: "El fixture `CASO-LIM-035-4B` satisface un predicado de dominio real; imprime `S35-T4-B PASS` y el assert booleano pasa.",
        feedback: "S35-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_OVERRIDE y por qué faltar by exige REQUEST_AUDIT_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
meets_contract = not record["by"]
status = "PASS" if meets_contract else "REJECT_SILENT_OVERRIDE"
print("S35-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
meets_contract = bool(record["by"]) and bool(record["case"]) and bool(record["human"])
status = "PASS" if meets_contract else "REJECT_SILENT_OVERRIDE"
print("S35-T4-B", status)
assert meets_contract is True
` ,
          output: `S35-T4-B PASS` ,
        },
      },
      {
        id: "S35-T4-B-E2",
        subtopicId: "S35-T4-B",
        kind: "independent",
        instruction: "S35-T4-B-E2 · Modela tres rutas de `aprobación, override, apelación y retiro`: fixture válido, fixture adverso y registro sin `by`. Entrada: dict con case_id, case, human, by. Salidas exactas: `PASS`, `REJECT_SILENT_OVERRIDE`, `MISSING:by`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-B: override con case, human y by no vacío. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta by", "fixture adverso: override con case, human y by no vacío", "CASO-LIM-035-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `by` ausente y produce exactamente `PASS REJECT_SILENT_OVERRIDE MISSING:by`.",
        feedback: "S35-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_OVERRIDE y por qué faltar by exige REQUEST_AUDIT_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'case', 'human', 'by'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["by"] else "REJECT_SILENT_OVERRIDE"

valid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
invalid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': ''}}
incomplete = {**valid}
incomplete.pop("by")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'case', 'human', 'by'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bool(record["by"]) and bool(record["case"]) and bool(record["human"]) else "REJECT_SILENT_OVERRIDE"

valid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
invalid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': ''}}
incomplete = {**valid}
incomplete.pop("by")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_SILENT_OVERRIDE MISSING:by` ,
        },
      },
      {
        id: "S35-T4-B-E3",
        subtopicId: "S35-T4-B",
        kind: "transfer",
        instruction: "S35-T4-B-E3 · Contrasta fallo cerrado para `aprobación, override, apelación y retiro` con tres fixtures distintos. `CASO-LIM-035-4B` debe continuar, el adverso debe devolver `REJECT_SILENT_OVERRIDE` y la ausencia de `by` debe devolver `REQUEST_AUDIT_FIELDS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró override con case, human y by no vacío; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta by", "fixture adverso: override con case, human y by no vacío", "CASO-LIM-035-4B es sintético"],
        tests: "Fixtures `CASO-LIM-035-4B`, adverso y sin `by` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_OVERRIDE y por qué faltar by exige REQUEST_AUDIT_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'case', 'human', 'by'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["by"] else "REJECT_SILENT_OVERRIDE"

valid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
invalid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': ''}}
uncertain = {**valid}
uncertain.pop("by")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'case', 'human', 'by'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_AUDIT_FIELDS"
    return "CONTINUE" if bool(record["by"]) and bool(record["case"]) and bool(record["human"]) else "REJECT_SILENT_OVERRIDE"

valid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': 'analyst_7'}}
invalid = {"case_id": "CASO-LIM-035-4B", **{'case': 'c1', 'human': 'override_skip', 'by': ''}}
uncertain = {**valid}
uncertain.pop("by")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_SILENT_OVERRIDE", "REQUEST_AUDIT_FIELDS"]
` ,
          output: `CONTINUE REJECT_SILENT_OVERRIDE REQUEST_AUDIT_FIELDS` ,
        },
      }
    ],
  },
  youDo: {
    title: "Ficha de caso: evidencia | modelo | incertidumbre | humano (CP-N3-C inicio)",
    context:
      "Arma plantilla de ficha de caso con explicación local, slices, OOD abstain y model card sobre CASO-LIM-035. Id system-design conservado. Sin PII real ni auto-etiqueta de fraude.",
    objectives: [
      "Importancia y explicación local con límites causal=False",
      "Slices con n y proxies high-risk documentados",
      "Incertidumbre/intervalo y abstención OOD",
      "Model card out_of_scope + override audit by/timestamp",
    ],
    requirements: [
      "4 capas en ficha (evidence|model|uncertainty|human)",
      "Sin acusación de fraude ni parentesco",
      "es-PE sintético; fail-closed ante OOD o missing audit",
    ],
    starterCode: `# ficha de caso CP-N3-C — CASO-LIM-035
case = {
    "evidence": ["shared_phone"],
    "model": {"contrib": {}, "means_fraud": False},
    "uncertainty": {"interval": None, "ood": False},
    "human": {"decision": None, "by": None},
}
# TODO: completa capas, OOD abstain y audit fields
if __name__ == "__main__":
    print(sorted(case.keys()))
`,
    portfolioNote:
      "Inicio CP-N3-C; no PASS automático. Portfolio: ficha 4 capas + card out_of_scope.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Ficha 4 capas + out_of_scope + override audit completo", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "La ficha de caso debe separar:",
        options: ["Solo score", "Solo SHAP global", "Evidencia, modelo, incertidumbre y decisión humana", "Solo UI"],
        correctIndex: 2,
        explanation:
          "Las cuatro capas evitan confundir evidencia observada con score del modelo, incertidumbre y decisión humana auditable.",
      },
      {
        question: "Perm importance prueba:",
        options: ["Sensibilidad del modelo a barajar features", "Fraude", "Parentesco", "Causalidad legal"],
        correctIndex: 0,
        explanation:
          "La caída de métrica al permutar mide sensibilidad del modelo; no prueba causa, fraude ni parentesco.",
      },
      {
        question: "Ante OOD conviene:",
        options: ["Forzar pred 1", "Abstener y escalar", "Borrar logs", "Ignorar"],
        correctIndex: 1,
        explanation:
          "Fuera de distribución la política fail-closed es abstener y escalar a humano, sin auto-label.",
      },
      {
        question: "Model card out_of_scope incluye:",
        options: ["Nada", "Solo accuracy", "Solo owner email personal", "Usos prohibidos p.ej. etiqueta de fraude"],
        correctIndex: 3,
        explanation:
          "out_of_scope documenta usos prohibidos (p.ej. fraud_label) para contestabilidad y límites de producto.",
      }
    ],
  },
  resources: {
    docs: [
      { label: "Model Cards (Mitchell et al.)", url: "https://arxiv.org/abs/1810.03993", note: "Plantilla" },
      { label: "sklearn inspection", url: "https://scikit-learn.org/stable/inspection.html", note: "Permutation importance" },
    ],
    books: [
      { label: "Interpretable Machine Learning (Molnar)", note: "Límites de explicación" },
      { label: "Fairness concepts", note: "Slices y daño" },
    ],
    courses: [
      { label: "Responsible AI practices", url: "https://www.tensorflow.org/responsible_ai", note: "Referencia amplia" },
    ],
  },
}
