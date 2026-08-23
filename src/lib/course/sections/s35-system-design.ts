import type { CourseSection } from '../../types'

export const section35: CourseSection = {
  id: "system-design",
  index: 35,
  title: "Explicabilidad, equidad e incertidumbre",
  shortTitle: "Explicabilidad y equidad",
  tagline: "Ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana",
  estimatedHours: 18,
  level: "Integración avanzada",
  phase: 2,
  icon: "Scale",
  accentColor: "bg-gradient-to-br from-violet-400 to-purple-800",
  jobRelevance:
    "En un workbench de riesgo operativo (cola de fraude en Lima, datos sintéticos) el analista no solo mira un score: arma una ficha de caso que separa evidencia observada, contribución del modelo, incertidumbre y decisión humana. Aquí aprendes a explicar un score sin acusar de fraude ni de parentesco, y a dejar un audit trail (rastro de quién decidió qué). Sin ese rastro, el override (decisión humana que reemplaza al modelo) no es gobernanza, es opacidad.",
  learningOutcomes: [
    { text: "Calcular ranking de importancia por permutación (drop de métrica) con means_fraud=False" },
    { text: "Construir explicación local value×weight y ficha de 4 capas con causal=False" },
    { text: "Comparar métricas por cohorte/slice reportando siempre n y low_n" },
    { text: "Listar proxies high-risk y proponer mitigate/review sin auto-label de fraude" },
    { text: "Comunicar incertidumbre con banda p±q (conformal solo a nivel conceptual)" },
    { text: "Detectar OOD y aplicar abstención fail-closed hacia humano" },
    { text: "Completar model card (use, out_of_scope, contestability) y validar scope" },
    { text: "Registrar override/aprobación/retiro con case, human y by reconstruibles" }
  ],
  theory: [
    {
            heading: "Explicar no es acusar, y la diferencia hay que dejarla escrita",
      paragraphs: [
        "Un caso llega a la cola con un score alto. El revisor abre la ficha y encuentra un número, una lista de features y nada más. Con eso no puede decidir bien: no distingue qué es un hecho comprobado del expediente, qué es una inferencia del modelo y qué tan seguro está el modelo de su propia inferencia. Esta sección construye la ficha que sí permite decidir.",
        "La estructura tiene cuatro capas que no deben mezclarse. La **evidencia** son hechos del caso: esta cuenta existe, esta transferencia ocurrió en esta fecha. La **contribución del modelo** es qué features empujaron el score y en qué dirección — una explicación de la aritmética, no una acusación. La **incertidumbre** dice cuánta confianza cabe en eso. Y la **decisión humana** es de una persona con nombre, registrada como tal.",
        "Confundir la segunda capa con la primera es el error que esta sección existe para prevenir. Que una feature contribuya al score significa que el modelo la pesó, no que sea la causa de nada. Escribir «el sistema detectó que el cliente…» convierte una contribución numérica en una afirmación sobre una persona, y es exactamente el paso que no se puede dar.",
        "Después está la pregunta de a quién le va peor. Un modelo puede tener buena métrica global y comportarse notablemente peor con un grupo concreto; el promedio lo esconde. Y hay que vigilar las **proxies** — una variable que no es el atributo sensible pero lo predice bien, como un distrito, y que reintroduce por la ventana lo que se sacó por la puerta.",
        "Falta la salida honesta. Cuando un caso no se parece a nada de lo que el modelo vio, la respuesta correcta no es un score con dos decimales, es abstenerse. La pregunta que atraviesa la sección junta las cuatro capas: **¿qué parte de esto es evidencia, qué parte es el modelo, cuánta duda hay y quién firma la decisión?**",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-C",
        content:
          "Inicio CP-N3-C: la ficha distingue las cuatro capas; explicar no es acusar. No des por cerrada la sección si falta evidencia, banda de incertidumbre o audit trail del override.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Entregable, orden de los subtemas y códigos de política.",
        "**Producto incremental.** Una ficha de caso que separa evidencia observada, contribución del modelo, incertidumbre y decisión humana. Recibe score, features y cohorte; entrega una plantilla auditable sin auto-etiquetado.",
        "**Orden de los subtemas.** T1 cubre la explicación global y local. T2 pasa a equidad, slices y proxies. T3 trata la incertidumbre y la abstención ante casos fuera de distribución. T4 cierra con la ficha de modelo, la contestabilidad y el override.",
        "**Cierre.** No des la sección por cerrada si falta evidencia, banda de incertidumbre o rastro de auditoría del override.",
      ],
    },
    {
      heading: "Coeficientes e importancia por permutación",
      subtopicId: "S35-T1-A",
      paragraphs: [
        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** no miden lo mismo. Un coeficiente es el peso de la feature en la combinación lineal: cuánto se mueve la salida del modelo si esa variable sube una unidad, con las demás fijas. La importancia por permutación mide otra cosa: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` reevalúa la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el train lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2).",
        "Contrato: entrada dict de drops por feature y nombre de métrica de cola; salida ranking `top_feature` con drop numérico, métrica usada y flag `means_fraud=False`. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: **misma métrica** de negocio en baseline y en permutación (p. ej. `precision_at_k`). Comparación rápida: coeficientes asumen modelo lineal; permutación aplica a cajas negras, pero **depende** de la métrica y de colinealidad (no es «la verdad» de la feature).",
        "Aplicación a `CASO-LIM-035`: `shared_phone` cae más que `amount_7d` en precision@k sintético; documentas sensibilidad sobre datos ficticios y **nunca** emites label de fraude/parentesco. El mapa global orienta la cola; **no** decide el caso individual. Por eso en T1-B pasas de mapa global a explicación **local** del caso en cola."
      ],
      code: {
        language: 'python',
        title: "perm_imp.py",
        code: `def rank_by_drop(drops, metric):
    ranked = sorted(drops.items(), key=lambda kv: kv[1], reverse=True)
    top_feat, top_drop = ranked[0]
    return {
        "metric": metric,
        "top_feature": top_feat,
        "drop": top_drop,
        "means_fraud": False,
    }

report = rank_by_drop(
    {"shared_phone": 0.10, "amount_7d": 0.03, "region": 0.01},
    "precision_at_k",
)
print(report)`,
        output: `{'metric': 'precision_at_k', 'top_feature': 'shared_phone', 'drop': 0.1, 'means_fraud': False}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima S35-T1-A: ranking de drops con means_fraud=False. Breach → REJECT_CAUSAL_CLAIM; falta drops → REQUEST_METRIC_DROP.",
      },
    },
    {
      heading: "Explicación local, correlación y límites",
      subtopicId: "S35-T1-B",
      paragraphs: [
        "Después del mapa global, la **explicación local** asigna contribución de features al score de **este** caso. En literatura, **SHAP** (aditividad con *baseline*/valor esperado) y **LIME** (modelo local lineal) son familias distintas con trade-offs de costo y estabilidad. Aquí el lab usa un aditivo mínimo `contrib = valor × peso` en espacio lineal, con **baseline = 0** solo como andamiaje: **no** es SHAP ni LIME, y no asume escala de probabilidad. En un modelo real conviene documentar dominio de salida (p. ej. log-odds) y verificar `baseline + Σ contrib ≈ salida del modelo`. **Correlación ≠ causalidad**: la contribución no es causa del comportamiento humano ni prueba legal.",
        "Contrato: entrada pares (valor, peso) por feature; salida contribuciones, suma y plantilla de **4 capas** (evidencia|modelo|incertidumbre|humano). Error: omitir límites o declarar `causal=True`. Criterio: cada capa tiene flag explícito y el modelo no se confunde con la decisión humana. Si solo miras el top local, es fácil «acusar» al feature dominante: por eso `causal=False` es obligatorio en la capa modelo.",
        "Aplicación a `CASO-LIM-035`: `shared_phone` aporta 0.9 al score de cola; la ficha marca `causal=False` y deja la decisión al analista con **override auditable**. Con la explicación local en la mano, T2 pregunta si la cola daña de forma desigual por cohorte (métrica + n, no solo el feature del caso)."
      ],
      code: {
        language: 'python',
        title: "local_exp.py",
        code: `def local_contrib(feats, baseline=0.0):
    """Aditivo de lab en espacio lineal; no es SHAP. baseline + Σcontrib = linear_score."""
    contrib = {k: v * w for k, (v, w) in feats.items()}
    linear_score = baseline + sum(contrib.values())
    return contrib, linear_score

contrib, score = local_contrib({"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}, baseline=0.0)
print("contrib", {k: round(v, 3) for k, v in contrib.items()})
print("linear_score", round(score, 3))
print("causal", False)`,
        output: `contrib {'shared_phone': 0.9, 'amount_z': 0.1}
linear_score 1.0
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
      heading: "Cohortes y métricas por slice",
      subtopicId: "S35-T2-A",
      paragraphs: [
        "Cortar por **región, canal o tipo de enlace** revela si la cola de revisión daña de forma desigual. En fairness group-aware se miran gaps de grupo: p. ej. **TPR gap** (diferencia de true positive rate entre grupos) o **precision@slice**. El contrato mínimo del lab exige **métrica + n** por slice antes de cualquier afirmación fuerte: sin n no hay reporte de equidad defendible. Compara precision/recall o tasa de queue reportando siempre el **tamaño muestral n** del slice.",
        "Contrato: entrada dict `slice→{n, precision}`; salida flag `low_n` si `n < min_n` (en este lab, `min_n=30` es **política del ejercicio**, no un estándar estadístico universal). Error: afirmar inequidad con n=3 o **esconder n**. Criterio: n visible junto a cada métrica; `low_n` **no** prueba inequidad por sí solo (tampoco «paridad a favor» del slice chico). En producción la suficiencia de n depende de prevalencia, denominadores y tamaño del efecto.",
        "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs. AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si la afirmación es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
      ],
      code: {
        language: 'python',
        title: "slices.py",
        code: `def slice_flag(n, min_n=30):
    return "low_n" if n < min_n else "ok_n"

slices = {
    "LIM": {"n": 100, "precision": 0.6},
    "AQP": {"n": 8, "precision": 0.9},
}
for s, m in slices.items():
    print(s, m["precision"], slice_flag(m["n"]))
print("compared", True)`,
        output: `LIM 0.6 ok_n
AQP 0.9 low_n
compared True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S35-T2-A, audita n por slice. low_n no prueba inequidad; afirmación con n bajo → REJECT_LOW_N_CLAIM; falta n → REQUEST_SLICE_N. min_n=30 es política del lab.",
      },
    },
    {
      heading: "Proxies, tamaño muestral y daño diferencial",
      subtopicId: "S35-T2-B",
      paragraphs: [
        "Un **proxy** es una variable que correlaciona con atributos sensibles (distrito, canal, idioma de nota). Su uso puede elevar **falsos positivos** en un grupo y generar fricción injustificada en la cola, sin ser prueba de culpa. Tras ver slices con n, T2-B pregunta *qué features* pueden empujar el daño y **con qué evidencia** (no solo una etiqueta mágica).",
        "Contrato: entrada features con evidencia de riesgo (p. ej. `association_gap`, `fp_rate_gap`, `n_by_group`); salida lista high-risk y acción `mitigate|review`. En We Do, un helper filtra tags `high|med|low` **después** de esa lectura. Error: silenciar proxy o convertirlo en **label de fraude** (`action=auto_label`). Criterio: daño como delta de FP entre grupos sintéticos, no acusación individual.",
        "Aplicación a `CASO-LIM-035`: `district_code` muestra gaps de asociación y de FP con n por grupo; se marca high, se **retira** del ranking y se documenta n bajo en AQP antes de cualquier afirmación de paridad. Con proxies mitigados, T3 comunica qué tan estable es el score restante."
      ],
      code: {
        language: 'python',
        title: "proxies.py",
        code: `def tag_from_evidence(ev, min_gap=0.15):
    """Deriva risk tag desde evidencia de gap — no inventes 'high' sin datos."""
    if ev.get("fp_rate_gap", 0) >= min_gap or ev.get("association_gap", 0) >= min_gap:
        return "high"
    if ev.get("fp_rate_gap", 0) >= min_gap / 2:
        return "med"
    return "low"

evidence = {
    "shared_phone": {"association_gap": 0.08, "fp_rate_gap": 0.04, "n_by_group": {"LIM": 100, "AQP": 40}},
    "district_code": {"association_gap": 0.31, "fp_rate_gap": 0.18, "n_by_group": {"LIM": 100, "AQP": 40}},
    "amount_7d": {"association_gap": 0.02, "fp_rate_gap": 0.01, "n_by_group": {"LIM": 100, "AQP": 40}},
}
tags = {k: tag_from_evidence(v) for k, v in evidence.items()}
high_risk = [k for k, t in tags.items() if t == "high"]
print(high_risk)
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
      heading: "Calibración e intervalos (conformal a alto nivel)",
      subtopicId: "S35-T3-A",
      paragraphs: [
        "Un **score puntual engaña**; comunicar un **intervalo** deja claro qué tan estable es la señal de cola. En producción, la **predicción conformal** (p. ej. MAPIE) usa un **set de calibración** y busca **cobertura** empírica: que el resultado verdadero caiga dentro de lo predicho con la frecuencia prometida (p. ej. 90 %). Conviene saber qué forma toma «lo predicho» según la tarea, porque no siempre es una banda: en regresión sí es un intervalo alrededor del valor, pero en clasificación —que es el caso de esta sección— el objeto conformal es un **conjunto de etiquetas**, que puede traer una, varias o ninguna, y decir «ninguna» es precisamente la abstención honesta. El lab **no** implementa calibración: practicas una **banda ilustrativa** `p±q` con `level=\"toy\"` y `coverage_claim=False`. El hábito de **no publicar solo el punto** es el gate de la ficha; el algoritmo conformal queda en recursos.",
        "Contrato: entrada `p`, `q` y (en portfolio) `q_source`; salida `(lo, hi)`, label de nivel y flag de no-cobertura. Error: publicar solo `p` **sin** ancho (`q==0` o `level=point`) o afirmar cobertura real con banda toy. Criterio: todo score de ficha lleva banda o flag de no-cobertura. Brier (score de calibración de probabilidades) y bandas son **complementarios**, no rivales.",
        "Aplicación a `CASO-LIM-035`: `p=0.6` con `q=0.1` produce `[0.5, 0.7]` nivel toy **sin** claim de cobertura; el analista ve incertidumbre **antes** de override. Si el caso sale del soporte de train, la banda *dentro* del dominio no basta: T3-B fuerza abstención por OOD."
      ],
      code: {
        language: 'python',
        title: "interval.py",
        code: `def score_interval(p, q, q_source="illustrative"):
    """Banda ilustrativa p±q. Conformal real: calibración + cobertura (MAPIE)."""
    return {
        "lo": round(p - q, 2),
        "hi": round(p + q, 2),
        "level": "toy",
        "point_only": q <= 0,
        "coverage_claim": False,
        "q_source": q_source,
    }

band = score_interval(0.6, 0.1)
print(band["lo"], band["hi"])
print("level", band["level"])
print("coverage_claim", band["coverage_claim"])
print("point_only", band["point_only"])`,
        output: `0.5 0.7
level toy
coverage_claim False
point_only False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T3-A: intervalo + level. Breach → REJECT_POINT_ONLY; falta q → REQUEST_INTERVAL. Conformal: conceptual (cobertura); código del lab es banda toy.",
      },
    },
    {
      heading: "Out-of-distribution y abstención",
      subtopicId: "S35-T3-B",
      paragraphs: [
        "Aunque la banda esté bien comunicada, si un caso se sale del soporte visto en train (**canal nuevo**, z-score extremo), la política correcta es **abstener y escalar**, no forzar `pred=1` ni inventar fraude. La banda describe incertidumbre *dentro* del dominio; estar fuera de distribución es otra cosa. Y conviene separar dos casos que la frase «se sale del soporte» junta: un z-score extremo sigue siendo el mismo dominio, solo que en su cola —un cliente inusualmente grande, no un mundo nuevo—, mientras que un canal que no existía en train sí es un cambio de dominio. Ninguno de los dos añade una quinta capa a la ficha: la ficha tiene cuatro, y esto se registra dentro de la de **incertidumbre**, como el `reason` que la acompaña. Lo que cambia no es la estructura, es el verbo de política: abstenerse y escalar en lugar de decidir.",
        "Contrato: entrada vector z, umbral y **procedencia del escalado** (`reference_split=train`); salida `ood` bool y action `abstain|score`. El lab usa una heurística univariante `max(|z|) > thr`: **no** es un detector OOD general ni captura novedad multivariante. Error: **auto-label en OOD** (`action=auto_fraud`). Criterio: fail-closed (ante la duda, escalar a humano) con razón en `uncertainty.reason` (p. ej. `ood`).",
        "Aplicación a `CASO-LIM-035`: z estandarizados con media/desvío de train; `z=[1,2,3.5]` dispara ood; `action=abstain` y la ficha registra `uncertainty.reason=ood` **sin** label de fraude. Con incertidumbre gobernada, T4 documenta usos permitidos (model card) y el rastro del override: sin card y audit, la abstención no cierra el caso."
      ],
      code: {
        language: 'python',
        title: "ood.py",
        code: `def is_ood(zs, thr=3, reference_split="train"):
    """Heurística de rango univariante; z debe venir de scaler fit solo en train."""
    assert reference_split == "train", "no reuses stats de test/producción"
    return max(abs(x) for x in zs) > thr

ood = is_ood([1, 2, 3.5], thr=3, reference_split="train")
print(ood)
print("action", "abstain" if ood else "score")
print("auto_fraud", False)
print("detector", "univariate_z_range")`,
        output: `True
action abstain
auto_fraud False
detector univariate_z_range`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T3-B: abstain en OOD. Breach → REJECT_AUTO_LABEL; falta política → REQUEST_OOD_POLICY.",
      },
    },
    {
      heading: "Model card y contestabilidad",
      subtopicId: "S35-T4-A",
      paragraphs: [
        "La **model card** (Mitchell et al.) documenta, como mínimo, **uso permitido**, **out_of_scope**, métricas de evaluación y **dueño**. **Contestabilidad** exige un canal para que un humano impugne el ranking **sin** borrar el audit trail. Tras T1–T3, la card es el contrato de producto que dice qué *no* puede hacer el score (p. ej. convertirse en `fraud_label` automático).",
        "Contrato: entrada keys mínimas de card; salida card válida con `out_of_scope` que incluye `fraud_label`. Error: card vacía, `use=fraud_label` o `contestability=False`. Criterio: `contestability=True` y scope explícito en ficha. Sin card, la ficha de caso flota: no hay límite de producto escrito.",
        "Aplicación a `CASO-LIM-035`: `use=queue_rank`, `out_of_scope` incluye `fraud_label`, `owner=risk_ops`; el caso puede **apelar** sin reescribir score histórico. T4-B cierra el ciclo: override y retiro con rastro reconstruible (`case`, `human`, `by`)."
      ],
      code: {
        language: 'python',
        title: "model_card.py",
        code: `def card_ok(card):
    need = {"use", "out_of_scope", "owner", "contestability"}
    return need.issubset(card) and "fraud_label" in card.get("out_of_scope", [])

card = {
    "use": "queue_rank",
    "out_of_scope": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
print("out_of_scope", card["out_of_scope"][0])
print("use", card["use"])
print("card", card_ok(card))`,
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
      heading: "Aprobación, override, apelación y retiro",
      subtopicId: "S35-T4-B",
      paragraphs: [
        "El ciclo de vida del modelo (`proposed→approved→production→retired`) y los **overrides humanos** deben dejar rastro. El demo mínimo exige `case`, `human` y `by` no vacío (quién actuó y sobre qué caso). Eso **no** basta para reconstrucción forense completa: en portfolio añade `ts`, `reason`, `model_version` y estados previo/nuevo. **Sin audit no hay gobernanza**.",
        "Contrato: entrada evento de override o retiro; salida log con case, human action, by (lab) y campos de reconstrucción (portfolio). Error: override **silencioso** (`by` vacío) o retiro sin flag de drift. Criterio del lab: actor y acción presentes; criterio de portfolio: evento ordenable en el tiempo y justificable.",
        "Aplicación a `CASO-LIM-035`: `analyst_7` hace `override_skip` con razón documentada; el log guarda by, case y ts; retiro por `drift_flag=True` mueve a retired **sin** borrar histórico. Con card + audit, la ficha CP-N3-C queda lista para el portfolio."
      ],
      code: {
        language: 'python',
        title: "governance.py",
        code: `def audit_event(event, require_ts=False):
    base = ("case", "human", "by")
    if not (all(k in event for k in base) and bool(event.get("by"))):
        return False
    if require_ts and not event.get("ts"):
        return False
    return True

states = ["proposed", "approved", "production", "retired"]
event = {
    "case": "CASO-LIM-035-4B",
    "model_score": 0.82,
    "model_version": "ranker-v3.2",
    "human": "override_skip",
    "by": "analyst_7",
    "reason": "evidence_mismatch",
    "ts": "2026-07-24T12:00:00Z",
}
print("lifecycle", " > ".join(states))
print("override", event["human"])
print("audit_min", audit_event(event))
print("audit_portfolio", audit_event(event, require_ts=True))`,
        output: `lifecycle proposed > approved > production > retired
override override_skip
audit_min True
audit_portfolio True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S35-T4-B: audit mínimo con case, human y by no vacío. Breach → REJECT_SILENT_OVERRIDE; falta fields → REQUEST_AUDIT_FIELDS. Portfolio: añade ts, reason y model_version para reconstrucción real.",
      },
    }
  ],
  iDo: {
    intro: "S35 · Te muestro explicación, equidad, incertidumbre y gobernanza de la ficha de caso sobre fixtures sintéticos de Red Andina (Lima). Observa cada demo; en We Do reparas el mismo contrato.",
    steps: [
      {
        demoId: "S35-T1-A-DEMO",
        subtopicId: "S35-T1-A",
        environment: "local-python",
        description: "Ranking de importancia por drop en precision@k sobre features sintéticas del workbench (shared_phone, amount_7d).",
        preamble:
          "En la cola sintética de Red Andina, el mapa global de sensibilidad orienta qué features barajar primero, no a quién acusar. En esta demo tres drops ficticios (`shared_phone`, `amount_7d`, `region`) se ordenan por caída de `precision_at_k`. No escribas aún: predice el top y el flag `means_fraud`, y comprueba por qué un drop de 0.1 no es prueba de fraude. Si confundes ranking con veredicto, la ficha de caso se vuelve acusación.",
        code: {
          language: 'python',
          title: "imp_demo.py",
          code: `def rank_by_drop(drops, metric):
    top = max(drops, key=drops.get)
    return {"metric": metric, "top_feature": top, "drop": drops[top], "means_fraud": False}

report = rank_by_drop({"shared_phone": 0.10, "amount_7d": 0.03, "region": 0.01}, "precision_at_k")
print(report["top_feature"], report["drop"])
print("means_fraud", report["means_fraud"])
print("ok", True)`,
          output: `shared_phone 0.1
means_fraud False
ok True`,
        },
        why: "`max(drops, key=drops.get)` elige la feature cuya permutación daña más la métrica de cola; la misma métrica debe usarse en baseline y en drop. `means_fraud=False` es contrato ético del lab, no un booleano decorativo: un drop alto mide sensibilidad, no culpa. En We Do corregirás `min` invertido y el assert que exige `means_fraud=True`.",
        retrospective:
          "Si puedes explicar por qué `shared_phone` gana el ranking *sin* decir «es fraude», ya separas sensibilidad del modelo de la decisión humana. El error clásico es traducir top_feature a label. En We Do repararás dirección del ranking y el flag ético.",
      },
      {
        demoId: "S35-T1-B-DEMO",
        subtopicId: "S35-T1-B",
        environment: "local-python",
        description: "Contribuciones locales value×weight de shared_phone/amount_z y marca causal=False en la ficha.",
        preamble:
          "Después del mapa global, la ficha necesita contribución **local** al score de este caso. En la demo, `shared_phone` y `amount_z` se multiplican valor×peso; la suma es 1.0 y el flag `causal` queda en False. No escribas: predice contrib y suma, y fíjate que el lab no afirma causa legal ni implementa SHAP. Si omites `causal=False`, la capa modelo se confunde con veredicto.",
        code: {
          language: 'python',
          title: "loc_demo.py",
          code: `def local_contrib(feats):
    return {k: v * w for k, (v, w) in feats.items()}

contrib = local_contrib({"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)})
print("sum", round(sum(contrib.values()), 3))
print("causal", False)
print("ok", True)`,
          output: `sum 1.0
causal False
ok True`,
        },
        why: "El aditivo `v*w` con baseline 0 es andamiaje de lab; correlación o contribución no demuestran causalidad legal ni equivalen a SHAP. Las 4 capas de la ficha (evidencia|modelo|incertidumbre|humano) se preparan aquí con el flag ético. En We Do reescribirás `local_contrib` y el predicado de capas.",
        retrospective:
          "Explicar el score no es acusar a la persona. El error clásico es leer el top local como fraude. Pregunta: si `shared_phone` aporta 0.9, ¿qué frase de la ficha sigue siendo falsa si escribes «causó el riesgo»? We Do: calcular contrib, armar capas y rechazar `causal=True`.",
      },
      {
        demoId: "S35-T2-A-DEMO",
        subtopicId: "S35-T2-A",
        environment: "local-python",
        description: "Flag low_n en slice AQP (n=8) frente a LIM (n=100) para no afirmar inequidad con muestra chica.",
        preamble:
          "Cortar por región revela daño diferencial potencial, pero sin n el reporte de equidad miente. En esta demo LIM (n=100) y AQP (n=8) se marcan con `ok_n` / `low_n` bajo `min_n=30` (política del lab). No escribas: predice los flags y explica por qué un precision 0.9 en AQP no autoriza gritar paridad. Si omites n, el slice es marketing, no auditoría.",
        code: {
          language: 'python',
          title: "slice_demo.py",
          code: `def slice_flag(n, min_n=30):
    return "low_n" if n < min_n else "ok_n"

slices = {"LIM": 100, "AQP": 8}
for name, n in slices.items():
    print(name, n, slice_flag(n))
print("ok", True)`,
          output: `LIM 100 ok_n
AQP 8 low_n
ok True`,
        },
        why: "Reportar n por cohorte evita afirmaciones vacías; `low_n` no prueba inequidad ni paridad a favor del slice chico. `min_n=30` es política del ejercicio, no un estándar universal. En We Do invertirás el umbral del flag y rechazarás claims con n bajo.",
        retrospective:
          "Métrica sin n no es equidad defendible. El error clásico es celebrar precision alta en muestra chica. Pregunta: con AQP n=8 y precision 0.9, ¿qué puedes afirmar y qué no? We Do: flag desde n, tri-ruta y reporte de slice.",
      },
      {
        demoId: "S35-T2-B-DEMO",
        subtopicId: "S35-T2-B",
        environment: "local-python",
        description: "Deriva tag high desde gaps de evidencia (district_code) y acción review sin emitir fraud label.",
        preamble:
          "Un proxy (p. ej. `district_code`) puede correlacionar con grupos y elevar FP en la cola sin ser prueba de culpa. En esta demo se deriva tag high desde gaps sintéticos y se elige `action=review` con `means_fraud=False`. No escribas: predice la lista high y por qué no aparece `auto_label`. Si conviertes proxy en etiqueta, rompes el contrato de daño diferencial.",
        code: {
          language: 'python',
          title: "proxy_demo.py",
          code: `def tag_from_evidence(ev, min_gap=0.15):
    if ev.get("fp_rate_gap", 0) >= min_gap or ev.get("association_gap", 0) >= min_gap:
        return "high"
    return "low"

ev = {
    "district_code": {"association_gap": 0.31, "fp_rate_gap": 0.18},
    "amount_7d": {"association_gap": 0.02, "fp_rate_gap": 0.01},
}
high = [k for k, e in ev.items() if tag_from_evidence(e) == "high"]
print(high)
print("action", "review")
print("means_fraud", False)
print("ok", True)`,
          output: `['district_code']
action review
means_fraud False
ok True`,
        },
        why: "El tag high se justifica con evidencia de gap (asociación o FP entre grupos sintéticos); mitigar es review, mitigate o drop — nunca auto_label. `means_fraud=False` cierra el contrato ético: el proxy documenta daño diferencial potencial, no culpa individual. En We Do filtrarás high bien y prohibirás auto_label.",
        retrospective:
          "Mitigar proxy documenta daño potencial; no acusa al individuo. Pregunta: ¿por qué `district_code` high + review es compatible con `means_fraud=False`? We Do: lista high, gate de action y audit desde tags crudos.",
      },
      {
        demoId: "S35-T3-A-DEMO",
        subtopicId: "S35-T3-A",
        environment: "local-python",
        description: "Banda ilustrativa p±q (coverage_claim=False); conformal real queda en recursos.",
        preamble:
          "Un score puntual de 0.6 en la ficha se ve «seguro» hasta que publicas el ancho. En esta demo `p=0.6`, `q=0.1` producen [0.5, 0.7] con `level=toy` y `coverage_claim=False`. No escribas: predice lo/hi y por qué no puedes afirmar cobertura conformal del lab. Si publicas solo el punto, el analista no ve inestabilidad antes del override.",
        code: {
          language: 'python',
          title: "int_demo.py",
          code: `def score_interval(p, q):
    return round(p - q, 2), round(p + q, 2), "toy", False

lo, hi, level, coverage_claim = score_interval(0.6, 0.1)
print(lo, hi)
print("level", level)
print("coverage_claim", coverage_claim)
print("ok", True)`,
          output: `0.5 0.7
level toy
coverage_claim False
ok True`,
        },
        why: "La banda toy entrena el hábito de no publicar solo p; conformal real (MAPIE/cobertura empírica) queda en recursos y **no** se afirma con `level=toy`. `q==0` o `level=point` es REJECT_POINT_ONLY. En We Do calcularás lo/hi de verdad, no inventarás el punto.",
        retrospective:
          "Intervalo honesto (aunque toy) prepara abstención y override. El error clásico es vender «conformal calibrado» con banda ilustrativa. Pregunta: si q=0.1 y level=toy, ¿qué puedes decir al analista y qué no? We Do: score_band y fail-closed por q.",
      },
      {
        demoId: "S35-T3-B-DEMO",
        subtopicId: "S35-T3-B",
        environment: "local-python",
        description: "Heurística OOD univariante (max |z|>3, scaler de train) y abstención fail-closed.",
        preamble:
          "Aunque la banda esté bien, un z extremo o canal nuevo puede salir del soporte de train. En esta demo `z=[1,2,3.5]` con thr=3 dispara OOD; la acción es `abstain`, nunca `auto_fraud`. No escribas: predice ood y action, y nota que el detector es univariante de lab (no OOD multivariante de producción). Si fuerzas label en OOD, la ficha miente.",
        code: {
          language: 'python',
          title: "ood_demo.py",
          code: `def is_ood(zs, thr=3, reference_split="train"):
    assert reference_split == "train"
    return max(abs(x) for x in zs) > thr

ood = is_ood([1.0, 2.0, 3.5], reference_split="train")
print(ood)
print("action", "abstain" if ood else "score")
print("auto_fraud", False)
print("detector", "univariate_z_range")
print("ok", True)`,
          output: `True
action abstain
auto_fraud False
detector univariate_z_range
ok True`,
        },
        why: "Fail-closed hacia humano con `reason=ood`; z debe venir de scaler fit en train. `auto_fraud` en OOD es REJECT_AUTO_LABEL. La banda *dentro* del dominio no basta si el caso cambió de soporte. En We Do detectarás OOD y corregirás la política de acción.",
        retrospective:
          "OOD cambia de dominio; no se «arregla» con más confianza en el score. Pregunta: si z max=3.5 y thr=3, ¿por qué `auto_fraud` miente aunque el score «se vea seguro»? We Do: abstain obligatorio y capa uncertainty ensamblada.",
      },
      {
        demoId: "S35-T4-A-DEMO",
        subtopicId: "S35-T4-A",
        environment: "local-python",
        description: "Model card mínima con owner, out_of_scope=fraud_label y use=queue_rank para contestabilidad.",
        preamble:
          "Sin model card, la ficha flota: no hay límite escrito de lo que el score *no* puede hacer. En esta demo `use=queue_rank`, `out_of_scope` incluye `fraud_label`, `owner=risk_ops` y `contestability=True`. No escribas: predice por qué `card_ok` es True y qué fallaría si use fuera fraud_label. Si omites out_of_scope, el score se cuela como etiqueta automática.",
        code: {
          language: 'python',
          title: "card_demo.py",
          code: `def card_ok(card):
    need = {"use", "out_of_scope", "owner", "contestability"}
    return need.issubset(card) and "fraud_label" in card["out_of_scope"]

card = {
    "use": "queue_rank",
    "out_of_scope": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
print("out_of_scope", card["out_of_scope"][0])
print("use", card["use"])
print("card", card_ok(card))`,
          output: `out_of_scope fraud_label
use queue_rank
card True`,
        },
        why: "Keys mínimas + fraud_label fuera de scope + contestability habilitan apelación sin borrar histórico. `use=queue_rank` es el único uso permitido del ranker de cola en este lab: si use fuera fraud_label, el score se cuela como etiqueta automática. En We Do validarás la card y la construirás desde `prohibited` crudo.",
        retrospective:
          "La card es contrato de producto, no un README decorativo. Pregunta: si `contestability=False`, ¿qué derecho del caso se pierde aunque out_of_scope esté bien? We Do: card_ok, gate de scope y build_card.",
      },
      {
        demoId: "S35-T4-B-DEMO",
        subtopicId: "S35-T4-B",
        environment: "local-python",
        description: "Override audit mínimo (case/human/by) más ts y reason de portfolio.",
        preamble:
          "Un override sin actor no se puede reconstruir: no hay gobernanza. En esta demo `analyst_7` hace `override_skip` con case, human, by, reason y ts; `audit_min` y `audit_portfolio` deben ser True. No escribas: predice por qué by vacío rompería el lab y por qué ts/reason importan al portfolio. Si omites by, la decisión humana desaparece del audit trail.",
        code: {
          language: 'python',
          title: "gov_demo.py",
          code: `def audit_event(event, require_ts=False):
    ok = all(k in event for k in ("case", "human", "by")) and bool(event["by"])
    if require_ts:
        ok = ok and bool(event.get("ts"))
    return ok

event = {
    "case": "CASO-LIM-035-4B",
    "human": "override_skip",
    "by": "analyst_7",
    "reason": "evidence_mismatch",
    "ts": "2026-07-24T12:00:00Z",
}
print("audit_min", audit_event(event))
print("audit_portfolio", audit_event(event, require_ts=True))
print("ok", True)`,
          output: `audit_min True
audit_portfolio True
ok True`,
        },
        why: "Mínimo case/human/by no vacío; portfolio añade ts, reason y model_version para reconstrucción forense. Sin by el override es silencioso aunque el score se vea «correcto»: no hay gobernanza reconstruible. En We Do corregirás el validador que acepta by vacío.",
        retrospective:
          "Sin by no hay gobernanza. El error clásico es «el score ya era bueno, no hace falta actor». Pregunta: ¿qué falla de audit_min si by=\"\" y qué añade ts al portfolio? We Do: audit_event, tri-ruta y fail-closed de override silencioso.",
      }
    ],
  },
  weDo: {
    intro: "S35 · Laboratorio de ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales sobre el hilo sintético CASO-LIM-035.\n\nLee el **preamble** (contexto, meta, éxito, límites), ejecuta solo la **instruction**, y cierra con la **retrospective** junto a la solución.\n\n**E1** repara una operación de dominio (ranking, contrib, flag n, proxy, banda, OOD, card o audit).\n**E2** separa válido / inválido / missing.\n**E3** entrena fail-closed; en T1-B, T2-A, T2-B, T3-B y T4-A hay **transferencia real**: construyes ficha, reporte de slice, audit de proxies, capa de incertidumbre o model card desde campos crudos.\n\nLos ocho componentes del caso (1A…4B) se reutilizan en E1–E3: no son 24 historias de negocio distintas, sino 24 predicados de política sobre el mismo hilo.",
    steps: [
      {
        id: "S35-T1-A-E1",
        subtopicId: "S35-T1-A",
        kind: "guided",
        title: "Ranking por drop, no por min",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-1A` el workbench publica drops de permutación; el ranking debe elegir la feature más sensible a `precision_at_k`.\n- **Meta:** calcular `top_feature` con argmax de drops y dejar `means_fraud=False`.\n- **Éxito:** una línea `S35-T1-A PASS` (assert del contrato).\n- **Límites:** no uses `min`; no trates importancia como prueba de fraude; solo datos sintéticos.",
        instruction:
          "1. Abre el starter: `top_feature` usa `min` y el predicado exige `means_fraud is True` (doble DEFECT).\n2. Cambia a `max(drops, key=drops.get)`.\n3. Exige `top == \"shared_phone\"`, drop 0.1, métrica `precision_at_k` y `means_fraud is False`.\n4. Imprime `S35-T1-A` y el status; el assert debe pasar.",
        hint: "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
        hints: [
          "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
          "Un drop alto mide sensibilidad de la métrica de cola, no prueba de fraude. Si usas min() o means_fraud=True, el contrato falla.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "El fixture `CASO-LIM-035-1A` satisface ranking real + flags éticos; imprime `S35-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "El ranking se calcula (argmax), no se inventa. Un drop alto mide sensibilidad de la métrica de cola; marcarlo como fraude convierte el mapa global en acusación y rompe la ficha CP-N3-C.",
        retrospective:
          "Dirección del ranking + flag ético son el primer ladrillo de explicación **global**. Un drop alto no «demuestra» culpa: solo mide sensibilidad de la métrica de cola. Pregunta: si `amount_7d` tuviera drop 0.2, ¿cambiaría el top y seguirías con `means_fraud=False`? Siguiente (E2): tres rutas schema / contenido / missing.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e1.py",
          code: `# CASO-LIM-035 · permutation importance ≠ fraud
# DEFECT: ranking con min (dirección invertida) y means_fraud como prueba
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def top_feature(drops):
    return min(drops, key=drops.get)

record = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1, "amount_7d": 0.03},
    "metric": "precision_at_k",
    "means_fraud": False,
}
top = top_feature(record["drops"])
meets_contract = (
    top == "shared_phone"
    and record["metric"] == "precision_at_k"
    and record["means_fraud"] is True
)
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-a-e1.py",
          code: `def top_feature(drops):
    return max(drops, key=drops.get)

record = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1, "amount_7d": 0.03},
    "metric": "precision_at_k",
    "means_fraud": False,
}
top = top_feature(record["drops"])
meets_contract = (
    top == "shared_phone"
    and record["drops"][top] == 0.1
    and record["metric"] == "precision_at_k"
    and record["means_fraud"] is False
)
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
        title: "Tres rutas de importancia ética",
        preamble:
          "- **Contexto:** el gate de T1-A debe rechazar importancia leída como fraude y pedir drops si faltan, sin confundir schema con breach de contenido.\n- **Meta:** implementar `assess` con missing primero, luego ranking usable y `means_fraud is False`.\n- **Éxito:** una línea `PASS REJECT_CAUSAL_CLAIM MISSING:drops`.\n- **Límites:** no des PASS al adverso; no evalúes ranking sin `drops`.",
        instruction:
          "1. Revisa el starter: PASS si `means_fraud is True` (bug de contenido).\n2. Si faltan keys → `MISSING:…`.\n3. Con datos: top calculable, métrica de cola y `means_fraud is False` → PASS; si no → `REJECT_CAUSAL_CLAIM`.\n4. Imprime las tres rutas en una línea.",
        hint: "Primero `missing`; solo con drops presentes calcula top = max(drops, key=drops.get) y exige means_fraud is False.",
        hints: [
          "Primero `missing`; solo con drops presentes calcula top = max(drops, key=drops.get) y exige means_fraud is False.",
          "El adverso falla por means_fraud=True (contenido), no por schema. Sin drops → MISSING:drops antes de tocar el ranking.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `drops` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:drops`.",
        feedback:
          "Schema primero, ética después: en la cola de Lima, `means_fraud=True` es breach de contenido que convierte el mapa en acusación; faltar drops es otro código.",
        retrospective:
          "Faltar `drops` es incertidumbre de schema; `means_fraud=True` con drops presentes es breach de **contenido**. No son el mismo ticket en la cola. Pregunta: ¿por qué un drop de 0.1 con flag malo no se «arregla» inventando un `MISSING`? Luego (E3): REQUEST vs. REJECT en fail-closed de cola.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_CAUSAL_CLAIM
# DEFECT: PASS si means_fraud True (interpreta importancia como fraude)
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
    required = {"case_id", "drops", "metric", "means_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["means_fraud"] is True else "REJECT_CAUSAL_CLAIM"

valid = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1, "amount_7d": 0.03},
    "metric": "precision_at_k",
    "means_fraud": False,
}
invalid = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1},
    "metric": "precision_at_k",
    "means_fraud": True,
}
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
    required = {"case_id", "drops", "metric", "means_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    top = max(record["drops"], key=record["drops"].get)
    ok = (
        record["means_fraud"] is False
        and record["metric"] == "precision_at_k"
        and record["drops"][top] > 0
    )
    return "PASS" if ok else "REJECT_CAUSAL_CLAIM"

valid = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1, "amount_7d": 0.03},
    "metric": "precision_at_k",
    "means_fraud": False,
}
invalid = {
    "case_id": "CASO-LIM-035-1A",
    "drops": {"shared_phone": 0.1},
    "metric": "precision_at_k",
    "means_fraud": True,
}
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
        title: "Fail-closed: CONTINUE o pedir drops",
        preamble:
          "- **Contexto:** en la cola de revisión, un caso sin drops no se «aprueba en silencio»: se pide la métrica; un caso con `means_fraud=True` se rechaza.\n- **Meta:** enrutar ausencia a `REQUEST_METRIC_DROP` y breach ético a `REJECT_CAUSAL_CLAIM`.\n- **Éxito:** `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_METRIC_DROP`.\n- **Límites:** no trates missing como CONTINUE; no rellenes drops inventados.",
        instruction:
          "1. Lee el starter: missing devuelve CONTINUE y el pred está invertido.\n2. Missing → `REQUEST_METRIC_DROP`.\n3. Completo y ético (`means_fraud=False`, métrica de cola, drop > 0) → `CONTINUE`; si no → `REJECT_CAUSAL_CLAIM`.\n4. Imprime las tres decisiones en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ranking de drops con means_fraud=False y métrica de negocio; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "Fixtures `CASO-LIM-035-1A`, adverso y sin `drops` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "REQUEST no es PASS disfrazado: sin drops la cola de Red Andina pide la métrica. El adverso con flag de fraude activa REJECT, no un CONTINUE optimista.",
        retrospective:
          "REQUEST no es PASS disfrazado: es «no decido sin evidencia». El error clásico es continuar cuando faltan drops. En T1-B pasarás del mapa global a la ficha local de *este* caso.",
        starterCode: {
          language: 'python',
          title: "s35-t1-a-e3.py",
          code: `# CASO-LIM-035 · decide REJECT_CAUSAL_CLAIM
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def decide(record: dict) -> str:
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
        title: "Contrib local y causal=False",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-1B` el analista arma la capa modelo con contribuciones value×weight y cuatro capas de ficha.\n- **Meta:** implementar `local_contrib`, exigir capas completas y `causal is False`.\n- **Éxito:** `S35-T1-B PASS`.\n- **Límites:** no hardcodees contrib; no marques causal=True; no inventes fraude.",
        instruction:
          "1. Abre el starter: `local_contrib` devuelve ceros y el predicado exige `causal is True`.\n2. Calcula `{k: v * w for k, (v, w) in feats.items()}`.\n3. Exige set de 4 capas, `shared_phone==0.9` y suma ≈ 1.0.\n4. Imprime `S35-T1-B` y el status.",
        hint: "local_contrib: {k: v*w for k, (v, w) in feats.items()}. layers debe ser el set de 4 capas; causal is False.",
        hints: [
          "local_contrib: {k: v*w for k, (v, w) in feats.items()}. layers debe ser el set de 4 capas; causal is False.",
          "shared_phone→0.9 y amount_z→0.1; sum ≈ 1.0. Contribución local no es causa legal ni label de fraude.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "El fixture `CASO-LIM-035-1B` obtiene contrib calculada, 4 capas y causal=False; imprime `S35-T1-B PASS`.",
        feedback:
          "La contribución se calcula (value×weight); `causal=False` evita que el analista de Lima lea el top local como veredicto de fraude en la ficha.",
        retrospective:
          "La contribución se **calcula** (value×weight); `causal=False` evita que la capa modelo se confunda con veredicto. El error clásico del starter es «arreglar» el PASS invirtiendo solo el booleano y dejar contrib en cero. Pregunta: ¿por qué `shared_phone==0.9` y suma ≈1.0 demuestran cálculo, no hardcode? Siguiente (E2): PASS/REJECT/MISSING sobre layers.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e1.py",
          code: `# CASO-LIM-035 · local explanation layers no causal
# DEFECT: contrib hardcodeada; PASS si causal True
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def local_contrib(feats):
    return {k: 0.0 for k in feats}

feats = {"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}
contrib = local_contrib(feats)
record = {
    "case_id": "CASO-LIM-035-1B",
    "contrib": contrib,
    "layers": ["evidence", "model", "uncertainty", "human"],
    "causal": False,
}
meets_contract = record["causal"] is True
status = "PASS" if meets_contract else "REJECT_CAUSAL_CLAIM"
print("S35-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-b-e1.py",
          code: `def local_contrib(feats):
    return {k: v * w for k, (v, w) in feats.items()}

feats = {"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}
contrib = local_contrib(feats)
record = {
    "case_id": "CASO-LIM-035-1B",
    "contrib": contrib,
    "layers": ["evidence", "model", "uncertainty", "human"],
    "causal": False,
}
meets_contract = (
    record["causal"] is False
    and set(record["layers"]) == {"evidence", "model", "uncertainty", "human"}
    and contrib.get("shared_phone") == 0.9
    and abs(sum(contrib.values()) - 1.0) < 1e-9
)
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
        title: "Gate local: capas y no-causal",
        preamble:
          "- **Contexto:** el gate de explicación local debe aceptar ficha completa con `causal=False`, rechazar claim causal y reportar layers ausentes.\n- **Meta:** `assess` con missing primero y predicado de 4 capas + causal.\n- **Éxito:** `PASS REJECT_CAUSAL_CLAIM MISSING:layers`.\n- **Límites:** no des PASS si `causal=True` o layers incompletas.",
        instruction:
          "1. Starter da PASS con `causal is True`.\n2. Campo ausente → `MISSING:…`.\n3. PASS solo si `causal is False` y set(layers) es el de 4 capas.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T1-B: cuatro capas y causal=False en la ficha. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `layers` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:layers`.",
        feedback:
          "Capas incompletas o `causal=True` son breach de la ficha CP-N3-C: el adverso falla por contenido, no por keys ausentes.",
        retrospective:
          "Capas incompletas no se «arreglan» con un booleano suelto. El adverso falla por contenido (causal/layers), no por schema. Luego (E3) **construyes** la ficha desde campos crudos.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_CAUSAL_CLAIM local
# DEFECT: PASS con claim causal en explicación local
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Armar ficha de 4 capas",
        preamble:
          "- **Contexto:** el portfolio no recibe un record ya armado: llegan campos crudos del caso y debes montar la ficha.\n- **Meta:** `build_ficha` con evidence|model|uncertainty|human; `decide` con CONTINUE / REJECT_CAUSAL_CLAIM / REQUEST_LAYER_FIELDS.\n- **Éxito:** `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_LAYER_FIELDS`.\n- **Límites:** no rellenes evidence inventada; no dejes causal=True en CONTINUE.",
        instruction:
          "1. Si falta evidence → ficha None → `REQUEST_LAYER_FIELDS`.\n2. Monta las 4 claves; model lleva contrib y causal.\n3. Si causal no es False → `REJECT_CAUSAL_CLAIM`.\n4. Si no, `CONTINUE`. Imprime las tres rutas.",
        hint: "Primero monta la ficha con las cuatro claves; después evalúa causal y presencia de capas — no inviertas el orden.",
        hints: [
          "Primero monta la ficha con las cuatro claves; después evalúa causal y presencia de capas — no inviertas el orden.",
          "model debe llevar contrib y causal=False; uncertainty puede ser un dict vacío o con interval/ood; human lleva decision y by. CONTINUE solo si set(ficha.keys()) tiene las 4 capas y causal es False.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "Tres entradas crudas: válida → CONTINUE; causal=True → REJECT_CAUSAL_CLAIM; sin evidence → REQUEST_LAYER_FIELDS.",
        feedback:
          "Transferir es ensamblar el producto y luego aplicar el gate: la ficha de Red Andina no se «aprueba» con un flip de booleano sobre un dict ya listo.",
        retrospective:
          "Transferir es montar evidence|model|uncertainty|human **antes** de aplicar el gate. El error clásico es flip de CONTINUE/REJECT sobre un dict ya listo. Pregunta: sin `evidence` en raw, ¿por qué REQUEST y no inventar `[\"shared_phone\"]`? En el You Do reutilizarás este hábito en `fill_*`.",
        starterCode: {
          language: 'python',
          title: "s35-t1-b-e3.py",
          code: `# CASO-LIM-035 · transfer: build 4-layer ficha then gate
# DEFECT: build omite capas; decide siempre CONTINUE
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
NEED = {"evidence", "model", "uncertainty", "human"}

def build_ficha(raw):
    if "evidence" not in raw:
        return None
    # DEFECT: solo copia model, no arma 4 capas
    return {"model": {"contrib": raw.get("contrib", {}), "causal": raw.get("causal", True)}}

def decide(raw):
    ficha = build_ficha(raw)
    if ficha is None:
        return "CONTINUE"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-1B",
    "evidence": ["shared_phone"],
    "contrib": {"shared_phone": 0.9, "amount_z": 0.1},
    "causal": False,
    "decision": "review",
    "by": "analyst_7",
}
invalid = {**valid, "causal": True}
uncertain = {k: v for k, v in valid.items() if k != "evidence"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t1-b-e3.py",
          code: `NEED = {"evidence", "model", "uncertainty", "human"}

def build_ficha(raw):
    if "evidence" not in raw:
        return None
    return {
        "evidence": raw["evidence"],
        "model": {"contrib": raw.get("contrib", {}), "causal": raw.get("causal", True)},
        "uncertainty": raw.get("uncertainty", {"interval": None, "ood": False}),
        "human": {"decision": raw.get("decision"), "by": raw.get("by")},
    }

def decide(raw):
    ficha = build_ficha(raw)
    if ficha is None or not NEED.issubset(ficha.keys()):
        return "REQUEST_LAYER_FIELDS"
    if ficha["model"].get("causal") is not False:
        return "REJECT_CAUSAL_CLAIM"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-1B",
    "evidence": ["shared_phone"],
    "contrib": {"shared_phone": 0.9, "amount_z": 0.1},
    "causal": False,
    "decision": "review",
    "by": "analyst_7",
}
invalid = {**valid, "causal": True}
uncertain = {k: v for k, v in valid.items() if k != "evidence"}
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
        title: "Flag low_n desde n y min_n",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-2A` (LIM n=100, precision=0.6) el reporte de slice debe marcar si la muestra basta para hablar.\n- **Meta:** implementar `slice_flag` y PASS solo con `ok_n` y precision en [0,1].\n- **Éxito:** `S35-T2-A PASS`.\n- **Límites:** no pases con low_n; `min_n` es política del lab.",
        instruction:
          "1. Starter: `ok_n` si n < min_n (invertido).\n2. Corrige a `low_n` si n < min_n, si no `ok_n`.\n3. PASS si flag es `ok_n` y precision ∈ [0,1].\n4. Imprime `S35-T2-A` y el status.",
        hint: "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100.",
        hints: [
          "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100.",
          "PASS solo con flag ok_n y precision en [0,1]. Un n chico con precision alta no es paridad: es low_n claim.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "El fixture `CASO-LIM-035-2A` obtiene ok_n e imprime `S35-T2-A PASS`.",
        feedback:
          "El flag se calcula desde n; precision alta no salva low_n. En equity de cola, un n chico no autoriza paridad ni inequidad a gritos.",
        retrospective:
          "El flag se deriva de **n vs. min_n**, no del brillo de la precision. Un n chico con 0.95 no «mejora» el reporte: lo vuelve `low_n`. Pregunta: con n=100 y precision 0.6, ¿por qué PASS no es un juicio de «buena equity» sino de muestra usable? Siguiente (E2): rechazar claim con n=5.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e1.py",
          code: `# CASO-LIM-035 · slice metrics min_n
# DEFECT: flag invertido (PASS cuando low_n)
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def slice_flag(n, min_n=30):
    return "ok_n" if n < min_n else "low_n"

record = {
    "case_id": "CASO-LIM-035-2A",
    "slice_n": 100,
    "precision": 0.6,
    "min_n": 30,
}
flag = slice_flag(record["slice_n"], record["min_n"])
meets_contract = flag == "ok_n" and 0 <= record["precision"] <= 1
status = "PASS" if meets_contract else "REJECT_LOW_N_CLAIM"
print("S35-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-a-e1.py",
          code: `def slice_flag(n, min_n=30):
    return "low_n" if n < min_n else "ok_n"

record = {
    "case_id": "CASO-LIM-035-2A",
    "slice_n": 100,
    "precision": 0.6,
    "min_n": 30,
}
flag = slice_flag(record["slice_n"], record["min_n"])
meets_contract = flag == "ok_n" and 0 <= record["precision"] <= 1
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
        title: "Rechazar claim con n insuficiente",
        preamble:
          "- **Contexto:** un slice AQP sintético con n=5 y precision 0.95 no autoriza afirmación fuerte de equidad.\n- **Meta:** `assess` → PASS / REJECT_LOW_N_CLAIM / MISSING:slice_n.\n- **Éxito:** `PASS REJECT_LOW_N_CLAIM MISSING:slice_n`.\n- **Límites:** schema primero; no des PASS al adverso de n bajo.",
        instruction:
          "1. Starter da PASS si slice_n < min_n (invertido).\n2. Campo ausente → `MISSING`.\n3. PASS si n ≥ min_n y precision en [0,1]; si no REJECT_LOW_N_CLAIM.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-A: n suficiente junto a precision de slice. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `slice_n` ausente y produce exactamente `PASS REJECT_LOW_N_CLAIM MISSING:slice_n`.",
        feedback:
          "low_n + claim fuerte es breach de equity reportable en Red Andina: no celebres precision 0.95 con n=5.",
        retrospective:
          "low_n + claim fuerte = breach de equity reportable. Faltar n es REQUEST en E3, no REJECT silencioso. Luego montarás el reporte desde campos crudos.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_LOW_N_CLAIM
# DEFECT: PASS con claim de equidad en n bajo
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Reporte de slice con flag y claim",
        preamble:
          "- **Contexto:** el portfolio pide un mini-reporte de equity: región, n, precision, flag y claim.\n- **Meta:** construir el reporte y enrutar CONTINUE / REJECT_LOW_N_CLAIM / REQUEST_SLICE_N.\n- **Éxito:** `CONTINUE REJECT_LOW_N_CLAIM REQUEST_SLICE_N`.\n- **Límites:** no inventes n; no afirmes parity con low_n.",
        instruction:
          "1. Sin n → None → REQUEST_SLICE_N.\n2. flag = low_n si n < min_n else ok_n; retiene claim.\n3. low_n + claim parity → REJECT; ok_n + precision válida → CONTINUE.\n4. Imprime las tres decisiones.",
        hint: "Primero monta el reporte con flag desde n/min_n; después evalúa claim y precision — no inviertas el orden.",
        hints: [
          "Primero monta el reporte con flag desde n/min_n; después evalúa claim y precision — no inviertas el orden.",
          "flag = 'low_n' si n < min_n else 'ok_n'. CONTINUE solo con ok_n y precision en [0,1]. claim=parity con low_n → REJECT_LOW_N_CLAIM. Sin n → REQUEST_SLICE_N.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "Tres entradas crudas: LIM n=100 → CONTINUE; AQP n=5 claim=parity → REJECT_LOW_N_CLAIM; sin n → REQUEST_SLICE_N.",
        feedback:
          "El reporte de slice es un producto de portfolio: n + flag + claim se ensamblan desde campos crudos, no con un flip de PASS/REJECT.",
        retrospective:
          "El reporte de slice es un producto, no un flip de booleano. El error clásico es gritar paridad con n=5. En T2-B preguntas qué proxies empujan el daño.",
        starterCode: {
          language: 'python',
          title: "s35-t2-a-e3.py",
          code: `# CASO-LIM-035 · transfer: build slice report then gate low_n
# DEFECT: build omite flag; decide siempre CONTINUE
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def build_slice_report(raw):
    if "n" not in raw:
        return None
    # DEFECT: no calcula flag ni retiene claim
    return {"region": raw.get("region"), "n": raw["n"], "precision": raw.get("precision")}

def decide(raw):
    rep = build_slice_report(raw)
    if rep is None:
        return "CONTINUE"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-2A",
    "region": "LIM",
    "n": 100,
    "precision": 0.6,
    "min_n": 30,
    "claim": "report_only",
}
invalid = {
    "case_id": "CASO-LIM-035-2A",
    "region": "AQP",
    "n": 5,
    "precision": 0.95,
    "min_n": 30,
    "claim": "parity",
}
uncertain = {k: v for k, v in valid.items() if k != "n"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-a-e3.py",
          code: `def build_slice_report(raw):
    if "n" not in raw:
        return None
    min_n = raw.get("min_n", 30)
    n = raw["n"]
    return {
        "region": raw.get("region"),
        "n": n,
        "precision": raw.get("precision"),
        "flag": "low_n" if n < min_n else "ok_n",
        "claim": raw.get("claim"),
    }

def decide(raw):
    rep = build_slice_report(raw)
    if rep is None:
        return "REQUEST_SLICE_N"
    prec = rep.get("precision")
    if prec is None or not (0 <= prec <= 1):
        return "REJECT_LOW_N_CLAIM"
    if rep["flag"] == "low_n" and rep.get("claim") == "parity":
        return "REJECT_LOW_N_CLAIM"
    if rep["flag"] == "ok_n":
        return "CONTINUE"
    return "REJECT_LOW_N_CLAIM"

valid = {
    "case_id": "CASO-LIM-035-2A",
    "region": "LIM",
    "n": 100,
    "precision": 0.6,
    "min_n": 30,
    "claim": "report_only",
}
invalid = {
    "case_id": "CASO-LIM-035-2A",
    "region": "AQP",
    "n": 5,
    "precision": 0.95,
    "min_n": 30,
    "claim": "parity",
}
uncertain = {k: v for k, v in valid.items() if k != "n"}
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
        title: "Proxy high y action de mitigación",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-2B`, `district_code` llega con tag high; la acción no puede ser auto_label.\n- **Meta:** listar high-risk correctamente y exigir action ∈ {review, mitigate, drop}.\n- **Éxito:** `S35-T2-B PASS`.\n- **Límites:** no filtres por `\"low\"`; no auto-etiquetes fraude.",
        instruction:
          "1. Starter: high_risk usa `\"low\"` y action es auto_label.\n2. Filtra `v == \"high\"`.\n3. Cambia action a review (u otra de mitigación).\n4. PASS si district_code ∈ high y action válida.",
        hint: "high_risk_proxies: return [k for k, v in feats.items() if v == \"high\"]. district_code debe salir en la lista; action no puede ser auto_label.",
        hints: [
          "high_risk_proxies: return [k for k, v in feats.items() if v == \"high\"]. district_code debe salir en la lista; action no puede ser auto_label.",
          "Mitigar proxy ≠ acusar: action review/mitigate/drop documenta daño diferencial potencial, no fraud_label.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review e imprime `S35-T2-B PASS`.",
        feedback:
          "Detectar high y mitigar son dos mitades: auto_label sobre proxy convierte daño diferencial en acusación y rompe la ficha.",
        retrospective:
          "Detectar high y elegir acción de mitigación son mitades distintas: listar mal el proxy deja `district_code` fuera; auto_label lo convierte en acusación. Pregunta: si filtras `\"med\"`, ¿qué falla del contrato? Siguiente (E2): tres rutas de action.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e1.py",
          code: `# CASO-LIM-035 · proxy features no auto_label
# DEFECT: high_risk mal (risk=="low"); PASS con action=auto_label
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def high_risk_proxies(feats):
    return [k for k, v in feats.items() if v == "low"]

feats = {"shared_phone": "med", "district_code": "high", "amount_7d": "low"}
high = high_risk_proxies(feats)
record = {
    "case_id": "CASO-LIM-035-2B",
    "feature": "district_code",
    "risk": "high",
    "action": "auto_label",
}
meets_contract = (
    "district_code" in high
    and record["action"] == "auto_label"
)
status = "PASS" if meets_contract else "REJECT_PROXY_FEATURE"
print("S35-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-b-e1.py",
          code: `def high_risk_proxies(feats):
    return [k for k, v in feats.items() if v == "high"]

feats = {"shared_phone": "med", "district_code": "high", "amount_7d": "low"}
high = high_risk_proxies(feats)
record = {
    "case_id": "CASO-LIM-035-2B",
    "feature": "district_code",
    "risk": "high",
    "action": "review",
}
meets_contract = (
    "district_code" in high
    and record["risk"] == "high"
    and record["action"] in {"review", "mitigate", "drop"}
)
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
        title: "Gate de proxy: review, no auto_label",
        preamble:
          "- **Contexto:** el gate de T2-B acepta proxy high con mitigación y rechaza auto_label o action ausente.\n- **Meta:** `assess` → PASS / REJECT_PROXY_FEATURE / MISSING:action.\n- **Éxito:** `PASS REJECT_PROXY_FEATURE MISSING:action`.\n- **Límites:** schema primero; auto_label siempre REJECT.",
        instruction:
          "1. Starter da PASS si action == auto_label.\n2. Campo ausente → `MISSING`.\n3. PASS si risk high y action en {review, mitigate, drop}.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-B: proxy high con acción de mitigación o review. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_PROXY_FEATURE MISSING:action`.",
        feedback:
          "auto_label es breach de producto en la cola, no un atajo de recall: el proxy se mitiga, no se convierte en label de fraude.",
        retrospective:
          "auto_label es breach de producto, no un atajo de recall. Faltar action pide audit (REQUEST en E3). Luego construirás el audit desde features crudas.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_PROXY_FEATURE
# DEFECT: PASS auto-etiquetando con proxy sensible
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Audit de proxies desde tags",
        preamble:
          "- **Contexto:** el portfolio documenta proxies con lista high-risk y acción de mitigación, no con un tag inventado a mano.\n- **Meta:** construir audit y enrutar CONTINUE / REJECT_PROXY_FEATURE / REQUEST_PROXY_AUDIT.\n- **Éxito:** `CONTINUE REJECT_PROXY_FEATURE REQUEST_PROXY_AUDIT`.\n- **Límites:** means_fraud=False; no auto_label; no inventes features.",
        instruction:
          "1. Sin features → REQUEST_PROXY_AUDIT.\n2. high_risk = keys con tag high; means_fraud=False.\n3. auto_label o means_fraud True → REJECT; high + action válida → CONTINUE.\n4. Imprime las tres decisiones.",
        hint: "Primero lista high_risk desde features; después evalúa action y means_fraud — no inviertas el orden.",
        hints: [
          "Primero lista high_risk desde features; después evalúa action y means_fraud — no inviertas el orden.",
          "high_risk = [k for k, v in features.items() if v == 'high']. auto_label o means_fraud=True → REJECT_PROXY_FEATURE. Sin features → REQUEST_PROXY_AUDIT.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "Tres entradas crudas: district_code high + review → CONTINUE; auto_label → REJECT_PROXY_FEATURE; sin features → REQUEST_PROXY_AUDIT.",
        feedback:
          "El audit se arma desde tags y luego se gatea: el portfolio de Red Andina no acepta un flip de booleano sobre un record prearmado.",
        retrospective:
          "El audit se arma desde tags; el gate viene después. El error clásico es devolver CONTINUE sin listar `high_risk` o con `means_fraud=True`. Pregunta: sin `features` en raw, ¿por qué REQUEST_PROXY_AUDIT y no inventar `district_code`? En T3 comunicas incertidumbre del score restante tras mitigar proxies.",
        starterCode: {
          language: 'python',
          title: "s35-t2-b-e3.py",
          code: `# CASO-LIM-035 · transfer: build proxy audit then gate auto_label
# DEFECT: build omite high_risk; decide siempre CONTINUE
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def build_proxy_audit(raw):
    if "features" not in raw:
        return None
    # DEFECT: no lista high-risk ni fija means_fraud=False
    return {"action": raw.get("proposed_action"), "means_fraud": True}

def decide(raw):
    audit = build_proxy_audit(raw)
    if audit is None:
        return "CONTINUE"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-2B",
    "features": {"shared_phone": "med", "district_code": "high", "amount_7d": "low"},
    "proposed_action": "review",
}
invalid = {
    "case_id": "CASO-LIM-035-2B",
    "features": {"district_code": "high"},
    "proposed_action": "auto_label",
}
uncertain = {k: v for k, v in valid.items() if k != "features"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t2-b-e3.py",
          code: `def build_proxy_audit(raw):
    if "features" not in raw:
        return None
    feats = raw["features"]
    return {
        "high_risk": [k for k, v in feats.items() if v == "high"],
        "action": raw.get("proposed_action"),
        "means_fraud": False,
    }

def decide(raw):
    audit = build_proxy_audit(raw)
    if audit is None:
        return "REQUEST_PROXY_AUDIT"
    if audit.get("means_fraud") is True or audit.get("action") == "auto_label":
        return "REJECT_PROXY_FEATURE"
    if audit.get("high_risk") and audit.get("action") in {"review", "mitigate", "drop"}:
        return "CONTINUE"
    return "REJECT_PROXY_FEATURE"

valid = {
    "case_id": "CASO-LIM-035-2B",
    "features": {"shared_phone": "med", "district_code": "high", "amount_7d": "low"},
    "proposed_action": "review",
}
invalid = {
    "case_id": "CASO-LIM-035-2B",
    "features": {"district_code": "high"},
    "proposed_action": "auto_label",
}
uncertain = {k: v for k, v in valid.items() if k != "features"}
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
        title: "Banda p±q, no solo el punto",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-3A` el score 0.6 debe salir con ancho q=0.1 en la ficha.\n- **Meta:** implementar `score_band` simétrica y PASS si q>0, level ≠ point e hi > lo.\n- **Éxito:** `S35-T3-A PASS` (banda [0.5, 0.7]).\n- **Límites:** no publiques solo el punto; no digas cobertura real en level toy.",
        instruction:
          "1. Starter: lo=hi=p, level=point.\n2. lo, hi = round(p±q, 2); level del record si q>0.\n3. Exige hi>lo y valores 0.5/0.7.\n4. Imprime `S35-T3-A` y el status.",
        hint: "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
        hints: [
          "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
          "El lab usa level=toy (conformal real = cobertura en recursos/MAPIE). Publicar solo el punto (q==0 o lo==hi) es REJECT_POINT_ONLY.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] e imprime `S35-T3-A PASS`.",
        feedback:
          "La banda se calcula (p±q); level=toy es honesto. Publicar solo el punto oculta inestabilidad al analista antes del override.",
        retrospective:
          "La banda se **calcula** (p±q); `level=toy` es honesto, no un atajo para afirmar cobertura. El error clásico del starter es dejar lo=hi=p aunque q>0. Pregunta: con p=0.6 y q=0.1, ¿por qué hi debe ser 0.7 y no «cualquier número mayor»? Siguiente (E2): tri-ruta con q==0 adverso.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e1.py",
          code: `# CASO-LIM-035 · uncertainty band p±q (toy, no conformal calibrado)
# DEFECT: publica solo el punto (lo=hi=p, level=point) aunque q>0
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def score_band(p, q, level):
    return {"lo": p, "hi": p, "level": "point", "point_only": True}

record = {"case_id": "CASO-LIM-035-3A", "p": 0.6, "q": 0.1, "level": "toy"}
band = score_band(record["p"], record["q"], record["level"])
meets_contract = (
    record["q"] > 0
    and band["level"] != "point"
    and band["hi"] > band["lo"]
    and 0 <= record["p"] <= 1
)
status = "PASS" if meets_contract else "REJECT_POINT_ONLY"
print("S35-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-a-e1.py",
          code: `def score_band(p, q, level):
    lo, hi = round(p - q, 2), round(p + q, 2)
    return {
        "lo": lo,
        "hi": hi,
        "level": level if q > 0 else "point",
        "point_only": q <= 0 or lo == hi,
    }

record = {"case_id": "CASO-LIM-035-3A", "p": 0.6, "q": 0.1, "level": "toy"}
band = score_band(record["p"], record["q"], record["level"])
meets_contract = (
    record["q"] > 0
    and band["level"] != "point"
    and band["hi"] > band["lo"]
    and band["lo"] == 0.5
    and band["hi"] == 0.7
    and 0 <= record["p"] <= 1
)
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
        title: "Tres rutas de intervalo",
        preamble:
          "- **Contexto:** el gate de incertidumbre debe rechazar punto solo y pedir q si falta.\n- **Meta:** `assess` con missing primero y q>0 + level ≠ point.\n- **Éxito:** `PASS REJECT_POINT_ONLY MISSING:q`.\n- **Límites:** no des PASS si q==0 o level=point.",
        instruction:
          "1. Starter da PASS si q==0.\n2. Campo ausente → `MISSING`.\n3. PASS si q>0, level ≠ point y p en [0,1].\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-A: intervalo con q>0 y level distinto de point. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `q` ausente y produce exactamente `PASS REJECT_POINT_ONLY MISSING:q`.",
        feedback:
          "q==0 es breach de contenido en la ficha; faltar q es schema. No confundas ambos al auditar la cola de Lima.",
        retrospective:
          "Un punto solo (q==0, level=point) es breach de **contenido** de la ficha; faltar la key `q` es schema. Pregunta: si alguien hardcodea q=0.1 en el adverso, ¿qué invariante rompes? En E3 la misma lógica se enruta a CONTINUE/REJECT/REQUEST para la cola.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_POINT_ONLY
# DEFECT: PASS sin intervalo/conformal
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Fail-closed de banda en cola",
        preamble:
          "- **Contexto:** en la cola, un caso sin q no se scorea a ciegas; un caso punto-solo se rechaza.\n- **Meta:** CONTINUE / REJECT_POINT_ONLY / REQUEST_INTERVAL.\n- **Éxito:** `CONTINUE REJECT_POINT_ONLY REQUEST_INTERVAL`.\n- **Límites:** missing → REQUEST, no CONTINUE; no rellenes q.",
        instruction:
          "1. Starter: missing→CONTINUE y pred invertido.\n2. Missing → REQUEST_INTERVAL.\n3. Completo con q>0 y level ≠ point → CONTINUE; si no REJECT_POINT_ONLY.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró intervalo con q>0 y level distinto de point; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "Fixtures `CASO-LIM-035-3A`, adverso y sin `q` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Sin q la cola pide intervalo; con punto solo rechaza. Distinto de pedir drops (T1-A): aquí la evidencia es el ancho de banda.",
        retrospective:
          "La banda comunica incertidumbre *dentro* del dominio. En T3-B, si el caso es OOD, ni la mejor banda basta: se abstiene.",
        starterCode: {
          language: 'python',
          title: "s35-t3-a-e3.py",
          code: `# CASO-LIM-035 · decide REJECT_POINT_ONLY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def decide(record: dict) -> str:
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
        title: "OOD implica abstain, no auto_fraud",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-3B` el vector z supera el umbral; la política de ficha es abstener.\n- **Meta:** PASS solo si ood y action=abstain.\n- **Éxito:** `S35-T3-B PASS`.\n- **Límites:** no fuerces auto_fraud; no inventes zs.",
        instruction:
          "1. Starter: action=auto_fraud y predicado lo exige.\n2. Cambia action a abstain.\n3. meets_contract = ood and action == \"abstain\".\n4. Imprime `S35-T3-B` y el status.",
        hint: "is_ood = max(abs(z) for z in zs) > thr. Si ood → action debe ser abstain, nunca auto_fraud.",
        hints: [
          "is_ood = max(abs(z) for z in zs) > thr. Si ood → action debe ser abstain, nunca auto_fraud.",
          "z=[1,2,3.5] con thr=3 dispara OOD. Forzar pred/label en OOD es breach del contrato de la ficha.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain e imprime `S35-T3-B PASS`.",
        feedback:
          "Detectar OOD no basta: en la cola de Red Andina la acción correcta es fail-closed hacia humano, no auto_fraud.",
        retrospective:
          "Detectar OOD no basta: la **acción** de ficha es fail-closed hacia humano (`abstain`). El starter ya calcula ood bien y aún falla el contrato por `auto_fraud`. Pregunta: ¿qué capa de la ficha mientes si fuerzas label fuera de soporte? Siguiente (E2): tri-ruta de action.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e1.py",
          code: `# CASO-LIM-035 · OOD abstain not auto_fraud
# DEFECT: is_ood correcto pero action=auto_fraud (forzar label)
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def is_ood(zs, thr):
    return max(abs(z) for z in zs) > thr

record = {
    "case_id": "CASO-LIM-035-3B",
    "zs": [1.0, 2.0, 3.5],
    "threshold": 3.0,
    "action": "auto_fraud",
}
ood = is_ood(record["zs"], record["threshold"])
meets_contract = ood and record["action"] == "auto_fraud"
status = "PASS" if meets_contract else "REJECT_AUTO_LABEL"
print("S35-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-b-e1.py",
          code: `def is_ood(zs, thr):
    return max(abs(z) for z in zs) > thr

record = {
    "case_id": "CASO-LIM-035-3B",
    "zs": [1.0, 2.0, 3.5],
    "threshold": 3.0,
    "action": "abstain",
}
ood = is_ood(record["zs"], record["threshold"])
meets_contract = ood is True and record["action"] == "abstain"
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
        title: "Gate OOD: abstain o breach",
        preamble:
          "- **Contexto:** el gate de T3-B acepta OOD+abstain, rechaza auto_fraud y reporta action ausente.\n- **Meta:** `assess` con missing primero y predicado de OOD+abstain.\n- **Éxito:** `PASS REJECT_AUTO_LABEL MISSING:action`.\n- **Límites:** schema primero; auto_fraud siempre REJECT.",
        instruction:
          "1. Starter da PASS si action == auto_fraud.\n2. Campo ausente → `MISSING`.\n3. PASS si max|z| > thr y action == abstain.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-B: OOD detectado con action abstain y sin auto-label. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_AUTO_LABEL MISSING:action`.",
        feedback:
          "auto_fraud en OOD es breach de la ficha: la capa uncertainty debe registrar abstain, no un label inventado.",
        retrospective:
          "Faltar action es REQUEST de política en E3, no un PASS silencioso. Luego armarás la capa uncertainty desde zs crudos.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_AUTO_LABEL
# DEFECT: PASS auto-fraude en OOD
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Capa uncertainty desde z-scores",
        preamble:
          "- **Contexto:** la ficha CP-N3-C guarda incertidumbre como capa, no como print suelto.\n- **Meta:** construir `{ood, action, reason}` y enrutar CONTINUE / REJECT_AUTO_LABEL / REQUEST_OOD_POLICY.\n- **Éxito:** `CONTINUE REJECT_AUTO_LABEL REQUEST_OOD_POLICY`.\n- **Límites:** no rellenes zs; no dejes auto_fraud en OOD.",
        instruction:
          "1. Sin zs → REQUEST_OOD_POLICY.\n2. ood = max|z| > thr; reason='ood' si aplica.\n3. ood y action ≠ abstain → REJECT; ood y abstain → CONTINUE.\n4. Imprime las tres decisiones.",
        hint: "Primero monta uncertainty desde zs/threshold/proposed_action; después evalúa ood y action — no inviertas el orden.",
        hints: [
          "Primero monta uncertainty desde zs/threshold/proposed_action; después evalúa ood y action — no inviertas el orden.",
          "ood = max(abs(z) for z in zs) > thr. reason='ood' si ood else None. CONTINUE solo si ood y action=='abstain'. Adverso con auto_fraud → REJECT_AUTO_LABEL.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "Tres entradas crudas: OOD+abstain → CONTINUE; OOD+auto_fraud → REJECT_AUTO_LABEL; sin zs → REQUEST_OOD_POLICY.",
        feedback:
          "reason=ood hace auditable la abstención en el portfolio; ensamblar la capa es el hábito que reutilizas en fill_uncertainty.",
        retrospective:
          "`reason=ood` hace auditable la abstención: no es un print suelto, es capa de ficha. El error clásico es CONTINUE con action≠abstain en OOD. Pregunta: sin `zs`, ¿por qué REQUEST_OOD_POLICY y no inventar z=0? En T4 documentas usos permitidos (card) y el rastro del override humano.",
        starterCode: {
          language: 'python',
          title: "s35-t3-b-e3.py",
          code: `# CASO-LIM-035 · transfer: build uncertainty layer then gate OOD
# DEFECT: build ignora ood; decide siempre CONTINUE
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def build_uncertainty(raw):
    if "zs" not in raw:
        return None
    # DEFECT: no calcula ood ni fija action de política
    return {"ood": False, "action": raw.get("proposed_action"), "reason": None}

def decide(raw):
    unc = build_uncertainty(raw)
    if unc is None:
        return "CONTINUE"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-3B",
    "zs": [1.0, 2.0, 3.5],
    "threshold": 3.0,
    "proposed_action": "abstain",
}
invalid = {**valid, "proposed_action": "auto_fraud"}
uncertain = {k: v for k, v in valid.items() if k != "zs"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t3-b-e3.py",
          code: `def build_uncertainty(raw):
    if "zs" not in raw:
        return None
    thr = raw.get("threshold", 3.0)
    ood = max(abs(z) for z in raw["zs"]) > thr
    action = raw.get("proposed_action")
    return {
        "ood": ood,
        "action": action,
        "reason": "ood" if ood else None,
    }

def decide(raw):
    unc = build_uncertainty(raw)
    if unc is None:
        return "REQUEST_OOD_POLICY"
    if unc["ood"] and unc["action"] != "abstain":
        return "REJECT_AUTO_LABEL"
    if unc["ood"] and unc["action"] == "abstain":
        return "CONTINUE"
    return "REQUEST_OOD_POLICY"

valid = {
    "case_id": "CASO-LIM-035-3B",
    "zs": [1.0, 2.0, 3.5],
    "threshold": 3.0,
    "proposed_action": "abstain",
}
invalid = {**valid, "proposed_action": "auto_fraud"}
uncertain = {k: v for k, v in valid.items() if k != "zs"}
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
        title: "Card válida: queue_rank y scope",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-4A` la card del ranker de cola debe prohibir fraud_label y permitir contestabilidad.\n- **Meta:** implementar `card_ok` con keys, use, out_of_scope y contestability.\n- **Éxito:** `S35-T4-A PASS`.\n- **Límites:** no aceptes use=fraud_label ni contestability=False.",
        instruction:
          "1. Starter: card_ok True solo si use==fraud_label.\n2. need = {use, out_of_scope, owner, contestability}.\n3. Exige queue_rank, fraud_label en out_of_scope y contestability True.\n4. Imprime `S35-T4-A` y el status.",
        hint: "need = {use, out_of_scope, owner, contestability}; card_ok = need ⊆ card y \"fraud_label\" en out_of_scope y contestability is True y use == queue_rank.",
        hints: [
          "need = {use, out_of_scope, owner, contestability}; card_ok = need ⊆ card y \"fraud_label\" en out_of_scope y contestability is True y use == queue_rank.",
          "out_of_scope documenta usos prohibidos del score; no es un campo decorativo.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "El fixture `CASO-LIM-035-4A` pasa card_ok e imprime `S35-T4-A PASS`.",
        feedback:
          "out_of_scope no es decorativo: es el límite de producto. use=fraud_label convierte el ranker de cola en etiqueta automática.",
        retrospective:
          "`out_of_scope` fija el límite de producto: fraud_label **fuera** del ranker de cola. El error clásico del starter es invertir el predicado y «aceptar» el uso prohibido. Pregunta: ¿por qué hace falta **también** contestability=True, no solo el set de keys? Siguiente (E2): tri-ruta de scope.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e1.py",
          code: `# CASO-LIM-035 · model card use queue_rank not fraud
# DEFECT: card_ok True si use=fraud_label (scope invertido)
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def card_ok(card):
    return card.get("use") == "fraud_label"

card = {
    "use": "queue_rank",
    "out_of_scope": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
record = {"case_id": "CASO-LIM-035-4A", **card}
meets_contract = card_ok(card)
status = "PASS" if meets_contract else "REJECT_SCOPE_BREACH"
print("S35-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-a-e1.py",
          code: `def card_ok(card):
    need = {"use", "out_of_scope", "owner", "contestability"}
    return (
        need.issubset(card)
        and card.get("use") == "queue_rank"
        and "fraud_label" in card.get("out_of_scope", [])
        and card.get("contestability") is True
    )

card = {
    "use": "queue_rank",
    "out_of_scope": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
record = {"case_id": "CASO-LIM-035-4A", **card}
meets_contract = card_ok(card)
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
        title: "Gate de scope de model card",
        preamble:
          "- **Contexto:** el gate de T4-A acepta card de cola con contestabilidad y rechaza use=fraud_label o scope vacío.\n- **Meta:** `assess` → PASS / REJECT_SCOPE_BREACH / MISSING:out_of_scope.\n- **Éxito:** `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope`.\n- **Límites:** schema primero; adverso por contenido.",
        instruction:
          "1. Starter da PASS si use==fraud_label.\n2. Campo ausente → `MISSING`.\n3. PASS si queue_rank, fraud_label en out_of_scope y contestability True.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-A: card con use queue_rank, out_of_scope fraud_label y contestability. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `out_of_scope` ausente y produce exactamente `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope`.",
        feedback:
          "use=fraud_label es breach de producto aunque el score sea «preciso»: la card de Red Andina fija queue_rank como único uso de cola.",
        retrospective:
          "use=fraud_label es breach de producto aunque el score sea «preciso». Faltar `out_of_scope` es schema, no un «casi PASS». Pregunta: con out_of_scope=[] y use=queue_rank, ¿PASS o REJECT y por qué? Luego construirás la card desde `prohibited` crudo.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_SCOPE_BREACH
# DEFECT: PASS usando modelo fuera de scope
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Construir card desde usos prohibidos",
        preamble:
          "- **Contexto:** el portfolio no recibe out_of_scope listo: llega `prohibited` y debes armar la card.\n- **Meta:** build_card + decide CONTINUE / REJECT_SCOPE_BREACH / REQUEST_CARD_KEYS.\n- **Éxito:** `CONTINUE REJECT_SCOPE_BREACH REQUEST_CARD_KEYS`.\n- **Límites:** no inventes out_of_scope vacío como válido; no dejes use=fraud_label en CONTINUE.",
        instruction:
          "1. Sin prohibited → REQUEST_CARD_KEYS.\n2. out_of_scope = list(prohibited); copia use/owner/contestability.\n3. Gate: queue_rank + fraud_label en scope + contestability.\n4. Imprime las tres decisiones.",
        hint: "Primero arma la card con out_of_scope = list(prohibited); después valida scope y contestability.",
        hints: [
          "Primero arma la card con out_of_scope = list(prohibited); después valida scope y contestability.",
          "card_ok mental: use queue_rank, fraud_label en out_of_scope, contestability True. Falta prohibited → REQUEST_CARD_KEYS antes de mirar use.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "Tres entradas crudas: card válida → CONTINUE; use=fraud_label → REJECT_SCOPE_BREACH; sin prohibited → REQUEST_CARD_KEYS.",
        feedback:
          "Construir la card y validar scope son dos pasos: saltar el build deja la ficha de Red Andina sin contrato de producto.",
        retrospective:
          "Construir la card (`out_of_scope = list(prohibited)`) y validar scope son dos pasos: saltar el build deja la ficha sin contrato. Pregunta: si prohibited=[], ¿por qué no puedes «inventar» fraud_label en out_of_scope para forzar CONTINUE? En T4-B cierras con audit del override humano.",
        starterCode: {
          language: 'python',
          title: "s35-t4-a-e3.py",
          code: `# CASO-LIM-035 · transfer: build model card then gate scope
# DEFECT: build omite out_of_scope; decide siempre CONTINUE
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def build_card(raw):
    if "prohibited" not in raw:
        return None
    # DEFECT: no copia prohibited a out_of_scope
    return {"use": raw.get("use"), "owner": raw.get("owner"), "contestability": raw.get("contestability")}

def decide(raw):
    card = build_card(raw)
    if card is None:
        return "CONTINUE"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-035-4A",
    "use": "queue_rank",
    "prohibited": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
invalid = {**valid, "use": "fraud_label", "contestability": False, "prohibited": []}
uncertain = {k: v for k, v in valid.items() if k != "prohibited"}
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-a-e3.py",
          code: `def build_card(raw):
    if "prohibited" not in raw:
        return None
    return {
        "use": raw.get("use"),
        "out_of_scope": list(raw["prohibited"]),
        "owner": raw.get("owner"),
        "contestability": raw.get("contestability"),
    }

def decide(raw):
    card = build_card(raw)
    if card is None:
        return "REQUEST_CARD_KEYS"
    ok = (
        card.get("use") == "queue_rank"
        and "fraud_label" in card.get("out_of_scope", [])
        and card.get("contestability") is True
    )
    return "CONTINUE" if ok else "REJECT_SCOPE_BREACH"

valid = {
    "case_id": "CASO-LIM-035-4A",
    "use": "queue_rank",
    "prohibited": ["fraud_label"],
    "owner": "risk_ops",
    "contestability": True,
}
invalid = {**valid, "use": "fraud_label", "contestability": False, "prohibited": []}
uncertain = {k: v for k, v in valid.items() if k != "prohibited"}
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
        title: "Override con by no vacío",
        preamble:
          "- **Contexto:** en `CASO-LIM-035-4B` el override debe dejar actor reconstruible.\n- **Meta:** `audit_event` exige case, human y by no vacío.\n- **Éxito:** `S35-T4-B PASS`.\n- **Límites:** no des PASS con by vacío; ts es portfolio, no gate mínimo de este E1.",
        instruction:
          "1. Starter: return True cuando by está vacío.\n2. Exige keys case/human/by y bool(by), bool(case), bool(human).\n3. Imprime `S35-T4-B` y el status; el assert debe pasar con by=analyst_7.",
        hint: "audit_event: all(k in event for k in (\"case\", \"human\", \"by\")) and bool(event.get(\"by\")).",
        hints: [
          "audit_event: all(k in event for k in (\"case\", \"human\", \"by\")) and bool(event.get(\"by\")).",
          "Sin by no hay gobernanza: el override silencioso es breach aunque el score se vea correcto.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "El fixture `CASO-LIM-035-4B` pasa audit_event con by=analyst_7 e imprime `S35-T4-B PASS`.",
        feedback:
          "by vacío es override silencioso aunque el score se vea «correcto»: sin actor no hay gobernanza en la cola de Lima.",
        retrospective:
          "by vacío es override silencioso: no hay actor reconstruible aunque el score se vea «correcto». El error clásico del starter es premiar la ausencia de by. Pregunta: ¿por qué bool(by) no es lo mismo que `\"by\" in event`? Siguiente (E2): tres rutas de audit.",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e1.py",
          code: `# CASO-LIM-035 · override must record actor
# DEFECT: audit_event True cuando by está vacío
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def audit_event(event):
    return "case" in event and not event.get("by")

event = {
    "case": "CASO-LIM-035-4B",
    "human": "override_skip",
    "by": "analyst_7",
}
record = {"case_id": "CASO-LIM-035-4B", **event}
meets_contract = audit_event(event)
status = "PASS" if meets_contract else "REJECT_SILENT_OVERRIDE"
print("S35-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s35-t4-b-e1.py",
          code: `def audit_event(event):
    return (
        all(k in event for k in ("case", "human", "by"))
        and bool(event.get("by"))
        and bool(event.get("case"))
        and bool(event.get("human"))
    )

event = {
    "case": "CASO-LIM-035-4B",
    "human": "override_skip",
    "by": "analyst_7",
}
record = {"case_id": "CASO-LIM-035-4B", **event}
meets_contract = audit_event(event)
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
        title: "Gate de audit de override",
        preamble:
          "- **Contexto:** el gate de T4-B acepta override con actor, rechaza by vacío y reporta by ausente.\n- **Meta:** `assess` → PASS / REJECT_SILENT_OVERRIDE / MISSING:by.\n- **Éxito:** `PASS REJECT_SILENT_OVERRIDE MISSING:by`.\n- **Límites:** schema primero; by vacío es breach de contenido.",
        instruction:
          "1. Starter da PASS si not by.\n2. Campo ausente → `MISSING`.\n3. PASS si by, case y human son truthy.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-B: override con case, human y by no vacío. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `by` ausente y produce exactamente `PASS REJECT_SILENT_OVERRIDE MISSING:by`.",
        feedback:
          "Faltar by (MISSING) no es lo mismo que by=\"\" (REJECT): el audit trail de Red Andina distingue schema de override silencioso.",
        retrospective:
          "Faltar la key `by` (MISSING) no es lo mismo que `by=\"\"` (REJECT): schema vs. override silencioso. Pregunta: ¿qué código devuelve cada uno y por qué la cola no los trata igual? En E3 enrutas missing a REQUEST_AUDIT_FIELDS.",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e2.py",
          code: `# CASO-LIM-035 · assess REJECT_SILENT_OVERRIDE
# DEFECT: PASS con override sin auditor
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def assess(record: dict) -> str:
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
        title: "Fail-closed de override en cola",
        preamble:
          "- **Contexto:** en la cola de Red Andina, un override sin by no se «aprueba»: se pide audit; un by vacío se rechaza.\n- **Meta:** CONTINUE / REJECT_SILENT_OVERRIDE / REQUEST_AUDIT_FIELDS.\n- **Éxito:** `CONTINUE REJECT_SILENT_OVERRIDE REQUEST_AUDIT_FIELDS`.\n- **Límites:** missing → REQUEST, no CONTINUE; no inventes by.",
        instruction:
          "1. Starter: missing→CONTINUE y pred invertido.\n2. Missing → REQUEST_AUDIT_FIELDS.\n3. Completo con by/case/human truthy → CONTINUE; si no REJECT_SILENT_OVERRIDE.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró override con case, human y by no vacío; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "Fixtures `CASO-LIM-035-4B`, adverso y sin `by` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Sin by la cola pide campos de audit; con by vacío rechaza override silencioso. Distinto de pedir drops o q: aquí la evidencia es el actor humano.",
        retrospective:
          "Con card + audit, la ficha CP-N3-C queda lista para el portfolio. Pregunta: ¿qué añadirías (ts, reason, model_version) para reconstrucción forense real?",
        starterCode: {
          language: 'python',
          title: "s35-t4-b-e3.py",
          code: `# CASO-LIM-035 · decide REJECT_SILENT_OVERRIDE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio
def decide(record: dict) -> str:
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
      "Como analista de riesgo operativo en la cola sintética de Red Andina (Lima), arma la plantilla de ficha de caso con explicación local, banda ilustrativa de incertidumbre, abstención OOD y model card sobre CASO-LIM-035. En la nota de portfolio documenta además un mini-reporte de slice (n + flag) y un proxy con evidencia de gap. Sin PII real ni auto-etiqueta de fraude: el código debe llegar a `portfolio_ready True` reparando los tres `fill_*`.",
    objectives: [
      "Calcular contrib local value×weight (baseline=0 de lab) y dejar means_fraud=False y causal=False.",
      "Publicar banda p±q con coverage_claim implícito False y, si OOD, action=abstain con reason=ood.",
      "Completar model card (use=queue_rank, owner, out_of_scope con fraud_label, contestability=True).",
      "Registrar decisión humana con by no vacío; en portfolio extendido: ts, reason y model_version.",
      "Documentar en la nota un slice con n/flag y un proxy justificado (no solo tag inventado).",
    ],
    requirements: [
      "4 capas en ficha (evidence|model|uncertainty|human) más card",
      "Sin acusación de fraude ni parentesco; ethics_ok + uncertainty_ok + governance_ok",
      "es-PE sintético; fail-closed ante OOD o missing audit; portfolio_ready True",
      "Nota de portfolio: slice (n + low_n/ok_n) + proxy con evidencia o acción mitigate/review",
    ],
    starterCode: `# ficha de caso CP-N3-C — CASO-LIM-035
# DEFECT: fill_* incompletos o con flags éticos invertidos. Corrige sin inventar fraude.
from copy import deepcopy

case = {
    "evidence": ["shared_phone", "amount_z"],
    "model": {"contrib": {}, "means_fraud": False, "causal": False},
    "uncertainty": {"interval": None, "ood": False, "reason": None, "action": None},
    "human": {"decision": None, "by": None},
    "card": {"use": None, "out_of_scope": [], "contestability": False, "owner": None},
}

def fill_local_contrib(case, feats):
    """feats: feature -> (value, weight). Rellena model.contrib (value*weight)."""
    # DEFECT: no multiplica y marca means_fraud/causal como si fueran prueba
    case["model"]["contrib"] = {k: 0.0 for k in feats}
    case["model"]["means_fraud"] = True
    case["model"]["causal"] = True
    return case

def fill_uncertainty(case, p, q, zs, thr=3.0):
    """Banda p±q; si OOD -> action abstain y reason=ood; nunca auto-label."""
    # DEFECT: publica solo el punto y fuerza auto_fraud en OOD
    case["uncertainty"]["interval"] = (p, p)
    case["uncertainty"]["ood"] = max(abs(z) for z in zs) > thr
    case["uncertainty"]["reason"] = None
    case["uncertainty"]["action"] = "auto_fraud" if case["uncertainty"]["ood"] else "score"
    return case

def fill_card_and_audit(case, owner="risk_ops"):
    """use=queue_rank, out_of_scope incluye fraud_label, human.by si hay decisión."""
    # DEFECT: use fuera de scope y override silencioso (by vacío)
    case["card"] = {
        "use": "fraud_label",
        "out_of_scope": [],
        "contestability": False,
        "owner": owner,
    }
    case["human"] = {"decision": "override_skip", "by": ""}
    return case

if __name__ == "__main__":
    c = deepcopy(case)
    feats = {"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}
    fill_local_contrib(c, feats)
    fill_uncertainty(c, p=0.6, q=0.1, zs=[1.0, 2.0, 3.5], thr=3.0)
    fill_card_and_audit(c, owner="risk_ops")
    # Tras corregir, estos asserts deben pasar:
    ok_layers = set(c) >= {"evidence", "model", "uncertainty", "human", "card"}
    ok_ethics = (
        c["model"]["means_fraud"] is False
        and c["model"]["causal"] is False
        and c["model"]["contrib"].get("shared_phone") == 0.9
    )
    lo, hi = c["uncertainty"]["interval"]
    ok_unc = hi > lo and c["uncertainty"]["ood"] is True and c["uncertainty"]["action"] == "abstain"
    ok_gov = (
        c["card"]["use"] == "queue_rank"
        and "fraud_label" in c["card"]["out_of_scope"]
        and c["card"]["contestability"] is True
        and bool(c["human"]["by"])
    )
    print("capas", sorted(k for k in ("evidence", "model", "uncertainty", "human") if k in c))
    print("ethics_ok", ok_ethics)
    print("uncertainty_ok", ok_unc)
    print("governance_ok", ok_gov)
    print("portfolio_ready", ok_layers and ok_ethics and ok_unc and ok_gov)
`,
    portfolioNote:
      "Inicio CP-N3-C: no des por cerrada la sección sin ficha 4 capas + card out_of_scope + audit de override. Portfolio: repara los tres fill_* hasta portfolio_ready True; documenta un caso adverso (OOD o by vacío); incluye mini-reporte de slice (n/flag) y un proxy con gap o acción de mitigación.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante de la ficha demuestras con `portfolio_ready` (capas + ética + OOD + card/by)? (2) ¿qué caso adverso documentas en la nota (OOD, by vacío, low_n o proxy) y por qué no rellenas evidencia inventada? (3) Escribe una frase de impacto medible para el README: *antes* el score se leía como veredicto; *después* la cola separa evidencia, modelo, incertidumbre y humano con audit. ¿Puedes defender en 30 segundos por qué explicar no es acusar?",
    rubric: [
      { criterion: "Ficha CP-N3-C: cuatro capas + límites causal/means_fraud", weight: "25%" },
      { criterion: "Correctitud técnica (contrib, banda toy sin coverage_claim, OOD)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Bordes documentados (OOD, low_n, proxy, by vacío)", weight: "15%" },
      { criterion: "Código legible y límites claros (toy vs. producción)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "card out_of_scope + override audit (case/human/by; ts/reason en portfolio)", weight: "bonus" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Las cuatro capas de la ficha de caso son:",
        options: ["Solo el score puntual del modelo", "Solo importancia global (permutación) sin decisión humana", "Evidencia, modelo, incertidumbre y decisión humana", "Solo la interfaz de la cola de revisión"],
        correctIndex: 2,
        explanation:
          "Las cuatro capas evitan confundir evidencia observada con score del modelo, incertidumbre y decisión humana auditable.",
      },
      {
        question: "La importancia por permutación, con la misma métrica de negocio, mide:",
        options: ["Sensibilidad del modelo al barajar una feature (drop de métrica)", "La causa legal del comportamiento de una persona en el caso", "Que el top_feature implica etiqueta de fraude", "Paridad perfecta entre regiones sin reportar n"],
        correctIndex: 0,
        explanation:
          "La caída de métrica al permutar mide sensibilidad del modelo; no prueba causa, fraude ni parentesco.",
      },
      {
        question: "Ante un caso OOD (z extremo o canal nuevo), la política correcta es:",
        options: ["Forzar pred=1 para no perder recall de fraude", "Abstener, escalar a humano y registrar reason=ood", "Borrar el audit trail del score previo", "Publicar solo el score puntual sin banda ni flag"],
        correctIndex: 1,
        explanation:
          "Fuera de distribución la política fail-closed es abstener y escalar a humano, sin auto-label.",
      },
      {
        question: "En la model card, out_of_scope debe incluir sobre todo:",
        options: ["Nada: la card solo lista accuracy global", "El email personal del owner como único campo", "Métricas de slice sin n ni low_n", "Usos prohibidos (p. ej. fraud_label) y límites de producto"],
        correctIndex: 3,
        explanation:
          "out_of_scope documenta usos prohibidos (p. ej. fraud_label) para contestabilidad y límites de producto.",
      },
      {
        question: "Un slice AQP con n=8 y precision=0.9 frente a LIM n=100 precision=0.6 implica:",
        options: ["Paridad de fraude demostrada a favor de AQP", "Que district_code puede auto-etiquetarse como fraude", "low_n en AQP: no afirmar inequidad ni paridad sin más evidencia", "Que se puede omitir n en el reporte de equity"],
        correctIndex: 2,
        explanation:
          "low_n no prueba inequidad ni paridad; reportar n y evitar afirmaciones fuertes con muestra chica es el contrato de slices. min_n=30 es política del lab.",
      },
      {
        question: "En la ficha de caso, una explicación local correcta:",
        options: ["Separa evidencia, modelo, incertidumbre y humano, con causal=False", "Convierte la mayor contribución local en prueba de fraude", "Omite el campo by si el analista hace override_skip", "Fuerza pred=1 cuando el vector z es OOD para no perder recall"],
        correctIndex: 0,
        explanation:
          "Explicar no es acusar: causal=False, OOD abstain y audit de override (by) son obligatorios en la ficha.",
      },
      {
        question: "Un proxy high-risk en la cola de revisión se gestiona mejor así:",
        options: ["Convertirlo en auto_label de fraude para maximizar recall", "Justificar el riesgo con evidencia (gaps/n) y aplicar review, mitigate o drop", "Ignorarlo si el promedio global de precision es alto", "Borrar el model card para no dejar rastro del feature"],
        correctIndex: 1,
        explanation:
          "El proxy se audita con evidencia y se mitiga; no se convierte en etiqueta de fraude ni se oculta la gobernanza.",
      },
      {
        question: "El audit mínimo de un override en el lab exige, como mínimo:",
        options: ["Solo el emoji del analista en el chat del equipo", "Reentrenar el modelo en silencio sin logs", "Publicar el score puntual sin banda ni capa humana", "case, human y by no vacío (ts y reason se recomiendan en portfolio)"],
        correctIndex: 3,
        explanation:
          "Sin actor (by) y acción humana el override es silencioso. ts/reason/model_version completan la reconstrucción en portfolio.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Model Cards (Mitchell et al.)",
        url: "https://arxiv.org/abs/1810.03993",
        note: "Plantilla de model card",
      },
      {
        label: "sklearn inspection",
        url: "https://scikit-learn.org/stable/inspection.html",
        note: "API real de permutation_importance (shuffle + re-score)",
      },
      {
        label: "Interpretable ML book (Molnar) online",
        url: "https://christophm.github.io/interpretable-ml-book/",
        note: "Taxonomía global/local, SHAP/LIME y límites",
      },
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "System/model cards",
      },
      {
        label: "NIST AI RMF",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Riesgo y gobernanza",
      },
      {
        label: "Fairness and Machine Learning (book site)",
        url: "https://fairmlbook.org/",
        note: "Group fairness, proxies y TPR/precision gaps",
      },
      {
        label: "Conformal prediction (mapie docs)",
        url: "https://mapie.readthedocs.io/",
        note: "Calibración + cobertura (más allá de la banda toy del lab)",
      },
    ],
    books: [
      { label: "Interpretable Machine Learning (Molnar)", note: "Límites de explicación" },
      { label: "Fairness and Machine Learning (Barocas et al.)", note: "Equidad y proxies" },
    ],
    courses: [
      {
        label: "TensorFlow Responsible AI",
        url: "https://www.tensorflow.org/responsible_ai",
        note: "Prácticas de IA responsable",
      },
      {
        label: "Coursera — responsible AI / fairness",
        url: "https://www.coursera.org/courses?query=responsible%20ai%20fairness",
        note: "Equidad y model cards",
      },
      {
        label: "Google PAIR — People + AI Research",
        url: "https://pair.withgoogle.com/",
        note: "Guías de fairness, explainability y human-AI",
      },
      {
        label: "Aequitas (bias audit toolkit)",
        url: "https://github.com/dssg/aequitas",
        note: "Auditoría de sesgo y métricas de grupo",
      },
    ],
  },
}
