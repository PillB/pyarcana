import type { CourseSection } from '../../types'

export const section35: CourseSection = {
  id: "system-design",
  index: 35,
  title: "Explicabilidad, equidad e incertidumbre",
  shortTitle: "Explicabilidad y equidad",
  tagline: "Ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "Scale",
  accentColor: "bg-gradient-to-br from-violet-400 to-purple-800",
  jobRelevance:
    "En un workbench de **riesgo operativo** (p. ej. cola de revisión en Lima, datos sintéticos de Red Andina) el analista no solo mira un score: arma una **ficha de caso** que separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Inicias **CP-N3-C**: explicar un score **no** es acusar de fraude ni de parentesco, y sin audit trail el override no es gobernanza.",
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
      heading: "Inicio CP-N3-C: ficha de caso responsable",
      paragraphs: [
        "Esta sección **inicia CP-N3-C** y parte de S34: reutilizas métricas, umbrales y baselines ya presentados en el workbench. El caso sintético `CASO-LIM-035` de Red Andina (organización ficticia en Lima) se ejecuta **sin** credenciales, servicios externos ni PII real: es el laboratorio donde la ficha de caso se vuelve producto, no un diagrama abstracto.",
        "Producto incremental: **ficha de caso** que separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Entrada: score, features y cohorte; salida: plantilla auditable **sin** auto-etiqueta de fraude (`means_fraud=False`). Taxonomía que usarás en T1–T4: **global** (importancia del modelo en todo el batch) vs. **local** (contribución al score de *este* caso); **equidad** (slices y proxies) vs. **incertidumbre** (banda y OOD); **gobernanza** (card + override). Pregunta guía de la semana: ¿qué capa del caso estoy mirando y qué **no** puedo afirmar desde ella?",
        "Orden de la sección: **T1 explicación** (global y local) → **T2 equidad/slices y proxies** → **T3 incertidumbre y abstención OOD** → **T4 model card, contestabilidad y override**. Cada bloque cierra con un puente al siguiente: el mapa global no basta sin explicación del caso; la explicación del caso no basta sin slices; los slices no bastan sin banda/OOD; la incertidumbre no basta sin card y audit. El producto es la ficha auditable; explicar **no** es acusar.",
        "Glosario mínimo de la ficha: **evidencia** = hechos del caso; **modelo** = score y contribuciones (no veredicto); **incertidumbre** = banda/OOD; **humano** = decisión con `by` auditable. Códigos de política: `REJECT_*` = incumplimiento del contrato; `REQUEST_*` = falta dato para decidir; `CONTINUE`/`PASS` = contrato satisfecho en el lab. No memorices la lista entera: cada subtema introduce el código que usa."
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-C",
        content:
          "Inicio CP-N3-C: la ficha distingue las cuatro capas; explicar no es acusar. No des por cerrada la sección si falta evidencia, banda de incertidumbre o audit trail del override.",
      },
    },
    {
      heading: "Coeficientes e importancia por permutación",
      subtopicId: "S35-T1-A",
      paragraphs: [
        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` reevalúa la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el train lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2).",
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
        "Un **score puntual engaña**; comunicar un **intervalo** deja claro qué tan estable es la señal de cola. En producción, la **predicción conformal** (p. ej. MAPIE) usa un **set de calibración** y busca **cobertura** empírica: que el valor verdadero caiga en la banda con la frecuencia prometida (p. ej. 90 %). El lab **no** implementa calibración: practicas una **banda ilustrativa** `p±q` con `level=\"toy\"` y `coverage_claim=False`. El hábito de **no publicar solo el punto** es el gate de la ficha; el algoritmo conformal queda en recursos.",
        "Contrato: entrada `p`, `q` y (en portfolio) `q_source`; salida `(lo, hi)`, label de nivel y flag de no-cobertura. Error: publicar solo `p` **sin** ancho (`q==0` o `level=point`) o afirmar cobertura real con banda toy. Criterio: todo score de ficha lleva banda o flag de no-cobertura. Brier y bandas son **complementarios**, no rivales.",
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
        "Aunque la banda esté bien comunicada, si un caso se sale del soporte visto en train (**canal nuevo**, z-score extremo), la política correcta es **abstener y escalar**, no forzar `pred=1` ni inventar fraude. La banda describe incertidumbre *dentro* del dominio; OOD es **cambio de dominio** (otra capa de la ficha, otro verbo de política).",
        "Contrato: entrada vector z, umbral y **procedencia del escalado** (`reference_split=train`); salida `ood` bool y action `abstain|score`. El lab usa una heurística univariante `max(|z|) > thr`: **no** es un detector OOD general ni captura novedad multivariante. Error: **auto-label en OOD** (`action=auto_fraud`). Criterio: fail-closed hacia humano con razón en `uncertainty.reason` (p. ej. `ood`).",
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
    intro: "S35 · Te muestro explicación, equidad, incertidumbre y gobernanza de la ficha de caso sobre fixtures sintéticos de Red Andina (Lima).",
    steps: [
      {
        demoId: "S35-T1-A-DEMO",
        subtopicId: "S35-T1-A",
        environment: "local-python",
        description: "Ranking de importancia por drop en precision@k sobre features sintéticas del workbench (shared_phone, amount_7d).",
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
        why: "La importancia global orienta sensibilidad del modelo sobre la métrica de cola; nunca se traduce a veredicto de fraude en la ficha de caso.",
      },
      {
        demoId: "S35-T1-B-DEMO",
        subtopicId: "S35-T1-B",
        environment: "local-python",
        description: "Contribuciones locales value×weight de shared_phone/amount_z y marca causal=False en la ficha.",
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
        why: "La explicación local resume el score del caso en un aditivo de lab (baseline=0); correlación o contribución no demuestran causalidad legal ni equivalen a SHAP.",
      },
      {
        demoId: "S35-T2-A-DEMO",
        subtopicId: "S35-T2-A",
        environment: "local-python",
        description: "Flag low_n en slice AQP (n=8) frente a LIM (n=100) para no afirmar inequidad con muestra chica.",
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
        why: "Reportar n por cohorte evita afirmaciones de equidad estadísticamente vacías en regiones con poco tráfico. min_n=30 es política del lab, no un umbral universal.",
      },
      {
        demoId: "S35-T2-B-DEMO",
        subtopicId: "S35-T2-B",
        environment: "local-python",
        description: "Deriva tag high desde gaps de evidencia (district_code) y acción review sin emitir fraud label.",
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
        why: "El tag high se justifica con evidencia de gap; la mitigación es retirar o auditar, no acusar.",
      },
      {
        demoId: "S35-T3-A-DEMO",
        subtopicId: "S35-T3-A",
        environment: "local-python",
        description: "Banda ilustrativa p±q (coverage_claim=False); conformal real queda en recursos.",
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
        why: "Un punto sin ancho oculta inestabilidad; la banda toy no afirma cobertura real, pero prepara abstención y override.",
      },
      {
        demoId: "S35-T3-B-DEMO",
        subtopicId: "S35-T3-B",
        environment: "local-python",
        description: "Heurística OOD univariante (max |z|>3, scaler de train) y abstención fail-closed.",
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
        why: "Fuera de distribución no se fuerza label; se abstiene y se escala con razón ood en uncertainty.",
      },
      {
        demoId: "S35-T4-A-DEMO",
        subtopicId: "S35-T4-A",
        environment: "local-python",
        description: "Model card mínima con owner, out_of_scope=fraud_label y use=queue_rank para contestabilidad.",
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
        why: "Documentar usos prohibidos y dueño evita que el score se convierta en etiqueta automática de fraude.",
      },
      {
        demoId: "S35-T4-B-DEMO",
        subtopicId: "S35-T4-B",
        environment: "local-python",
        description: "Override audit mínimo (case/human/by) más ts y reason de portfolio.",
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
        why: "Sin by no hay gobernanza; el override silencioso es breach. ts y reason habilitan reconstrucción real en portfolio.",
      }
    ],
  },
  weDo: {
    intro: "S35 · Laboratorio de ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales sobre el hilo sintético CASO-LIM-035.\n\n**E1** repara una operación de dominio (ranking, contrib, flag n, proxy, banda, OOD, card o audit).\n**E2** separa válido / inválido / missing.\n**E3** entrena fail-closed; en T1-B, T2-A, T2-B, T3-B y T4-A hay **transferencia real**: construyes ficha, reporte de slice, audit de proxies, capa de incertidumbre o model card desde campos crudos.\n\nLos ocho componentes del caso (1A…4B) se reutilizan en E1–E3: no son 24 historias de negocio distintas, sino 24 predicados de política sobre el mismo hilo.",
    steps: [
      {
        id: "S35-T1-A-E1",
        subtopicId: "S35-T1-A",
        kind: "guided",
        instruction: "S35-T1-A-E1 · Sobre `CASO-LIM-035-1A`, calcula el **ranking por drop** (top_feature = argmax del dict `drops`) con `metric=precision_at_k` y `means_fraud=False`. El starter elige el drop mínimo y trata la importancia como fraude: corrige la dirección del ranking y el flag ético, sin cambiar los datos. Salida exacta: `S35-T1-A PASS`. El adverso con means_fraud=True activa `REJECT_CAUSAL_CLAIM` en E2.",
        hint: "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
        hints: [
          "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
          "Un drop alto mide sensibilidad de la métrica de cola, no prueba de fraude. Si usas min() o means_fraud=True, el contrato falla.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "El fixture `CASO-LIM-035-1A` satisface ranking real + flags éticos; imprime `S35-T1-A PASS` y el assert booleano pasa.",
        feedback: "S35-T1-A-E1: el ranking se calcula (argmax de drops), no se inventa; means_fraud=False evita convertir importancia en acusación.",
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
        instruction: "S35-T1-A-E2 · Tres rutas para importancia por permutación: válido (argmax de drops + means_fraud=False + metric), adverso (means_fraud=True) y sin `drops`. Salidas exactas: `PASS`, `REJECT_CAUSAL_CLAIM`, `MISSING:drops`. Primero valida schema; luego exige top_feature calculable y flag ético — no basta un booleano suelto.",
        hint: "Primero `missing`; solo con drops presentes calcula top = max(drops, key=drops.get) y exige means_fraud is False.",
        hints: [
          "Primero `missing`; solo con drops presentes calcula top = max(drops, key=drops.get) y exige means_fraud is False.",
          "El adverso falla por means_fraud=True (contenido), no por schema. Sin drops → MISSING:drops antes de tocar el ranking.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `drops` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:drops`.",
        feedback: "S35-T1-A-E2: schema primero, ranking después; means_fraud=True es breach de contenido, no de keys.",
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
        instruction: "S35-T1-A-E3 · Contrasta fallo cerrado para `Coeficientes e importancia por permutación` con tres fixtures distintos. `CASO-LIM-035-1A` debe continuar, el adverso debe devolver `REJECT_CAUSAL_CLAIM` y la ausencia de `drops` debe devolver `REQUEST_METRIC_DROP`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_METRIC_DROP` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ranking de drops con means_fraud=False y métrica de negocio; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
        tests: "Fixtures `CASO-LIM-035-1A`, adverso y sin `drops` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar drops exige REQUEST_METRIC_DROP.",
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
        instruction: "S35-T1-B-E1 · Sobre `CASO-LIM-035-1B`, **calcula** contribuciones locales value×weight desde pares (valor, peso), arma las 4 capas y exige `causal=False`. El starter ya trae contrib inventada y marca causal=True como si bastara: reescribe `local_contrib` y el predicado (capas + causal), sin inventar fraude. Salida exacta: `S35-T1-B PASS`. El adverso con causal=True o layers incompletas activa `REJECT_CAUSAL_CLAIM` en E2.",
        hint: "local_contrib: {k: v*w for k, (v, w) in feats.items()}. layers debe ser el set de 4 capas; causal is False.",
        hints: [
          "local_contrib: {k: v*w for k, (v, w) in feats.items()}. layers debe ser el set de 4 capas; causal is False.",
          "shared_phone→0.9 y amount_z→0.1; sum ≈ 1.0. Contribución local no es causa legal ni label de fraude.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "El fixture `CASO-LIM-035-1B` obtiene contrib calculada, 4 capas y causal=False; imprime `S35-T1-B PASS`.",
        feedback: "S35-T1-B-E1: la contribución se calcula (value×weight); causal=False evita convertir la explicación local en acusación.",
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
        instruction: "S35-T1-B-E2 · Modela tres rutas de `Explicación local, correlación y límites`: fixture válido, fixture adverso y registro sin `layers`. Entrada: dict con case_id, contrib, layers, causal. Salidas exactas: `PASS`, `REJECT_CAUSAL_CLAIM`, `MISSING:layers`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a layers debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T1-B: cuatro capas y causal=False en la ficha. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `layers` ausente y produce exactamente `PASS REJECT_CAUSAL_CLAIM MISSING:layers`.",
        feedback: "S35-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_CAUSAL_CLAIM y por qué faltar layers exige REQUEST_LAYER_FIELDS.",
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
        instruction: "S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) **construye** la ficha de 4 capas y decide.\n1) `build_ficha` devuelve un dict con keys evidence|model|uncertainty|human.\n2) `decide` → `CONTINUE` solo si las cuatro capas existen y `model.causal is False`.\n3) Adverso (causal=True) → `REJECT_CAUSAL_CLAIM`; sin evidence → `REQUEST_LAYER_FIELDS`.\nNo rellenes evidencia inventada.",
        hint: "Primero monta la ficha con las cuatro claves; después evalúa causal y presencia de capas — no inviertas el orden.",
        hints: [
          "Primero monta la ficha con las cuatro claves; después evalúa causal y presencia de capas — no inviertas el orden.",
          "model debe llevar contrib y causal=False; uncertainty puede ser un dict vacío o con interval/ood; human lleva decision y by. CONTINUE solo si set(ficha.keys()) tiene las 4 capas y causal es False.",
        ],
        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
        tests: "Tres entradas crudas: válida → CONTINUE; causal=True → REJECT_CAUSAL_CLAIM; sin evidence → REQUEST_LAYER_FIELDS.",
        feedback: "S35-T1-B-E3: la transferencia no es solo flip de PASS/REJECT — debes ensamblar la ficha 4 capas desde campos crudos y luego aplicar el gate.",
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
        instruction: "S35-T2-A-E1 · Sobre `CASO-LIM-035-2A` (LIM n=100, precision=0.6), calcula `slice_flag` (`ok_n` si n≥min_n else `low_n`) y solo da PASS si el flag es `ok_n` y la precision está en [0,1]. El starter invierte el umbral (pasa con low_n). Salida exacta: `S35-T2-A PASS`. Claim con n bajo → `REJECT_LOW_N_CLAIM` en E2.",
        hint: "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100.",
        hints: [
          "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100.",
          "PASS solo con flag ok_n y precision en [0,1]. Un n chico con precision alta no es paridad: es low_n claim.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "El fixture `CASO-LIM-035-2A` obtiene ok_n e imprime `S35-T2-A PASS`.",
        feedback: "S35-T2-A-E1: el flag se calcula desde n; no afirmes equidad con low_n aunque precision se vea alta.",
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
        instruction: "S35-T2-A-E2 · Modela tres rutas de `Cohortes y métricas por slice`: fixture válido, fixture adverso y registro sin `slice_n`. Entrada: dict con case_id, slice_n, precision, min_n. Salidas exactas: `PASS`, `REJECT_LOW_N_CLAIM`, `MISSING:slice_n`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a slice_n debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-A: n suficiente junto a precision de slice. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `slice_n` ausente y produce exactamente `PASS REJECT_LOW_N_CLAIM MISSING:slice_n`.",
        feedback: "S35-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LOW_N_CLAIM y por qué faltar slice_n exige REQUEST_SLICE_N.",
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
        instruction: "S35-T2-A-E3 · Transferencia: a partir de campos crudos (`region`, `n`, `precision`, `min_n`, `claim`) **construye** un reporte de slice y decide.\n1) `build_slice_report` → `{region, n, precision, flag, claim}` con `flag=low_n` si `n < min_n`, si no `ok_n`.\n2) `decide` → `CONTINUE` solo si flag es `ok_n` y precision ∈ [0,1].\n3) Adverso (n bajo + `claim=parity`) → `REJECT_LOW_N_CLAIM`; sin `n` → `REQUEST_SLICE_N`.\nNo inventes n ni afirmes paridad con muestra chica. `min_n` es política del lab.",
        hint: "Primero monta el reporte con flag desde n/min_n; después evalúa claim y precision — no inviertas el orden.",
        hints: [
          "Primero monta el reporte con flag desde n/min_n; después evalúa claim y precision — no inviertas el orden.",
          "flag = 'low_n' si n < min_n else 'ok_n'. CONTINUE solo con ok_n y precision en [0,1]. claim=parity con low_n → REJECT_LOW_N_CLAIM. Sin n → REQUEST_SLICE_N.",
        ],
        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
        tests: "Tres entradas crudas: LIM n=100 → CONTINUE; AQP n=5 claim=parity → REJECT_LOW_N_CLAIM; sin n → REQUEST_SLICE_N.",
        feedback: "S35-T2-A-E3: la transferencia ensambla el reporte de equity (n + flag + claim) desde campos crudos; no basta flip de PASS/REJECT sobre un record ya armado.",
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
        instruction: "S35-T2-B-E1 · Sobre `CASO-LIM-035-2B`, **lista** proxies high-risk con `high_risk_proxies` y exige `action` en `{review, mitigate, drop}` (nunca `auto_label`). El starter marca high mal (risk==\"low\") y da PASS con `auto_label`: corrige la detección y la acción de mitigación. Salida exacta: `S35-T2-B PASS`. El adverso con action=auto_label activa `REJECT_PROXY_FEATURE` en E2.",
        hint: "high_risk_proxies: return [k for k, v in feats.items() if v == \"high\"]. district_code debe salir en la lista; action no puede ser auto_label.",
        hints: [
          "high_risk_proxies: return [k for k, v in feats.items() if v == \"high\"]. district_code debe salir en la lista; action no puede ser auto_label.",
          "Mitigar proxy ≠ acusar: action review/mitigate/drop documenta daño diferencial potencial, no fraud_label.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review e imprime `S35-T2-B PASS`.",
        feedback: "S35-T2-B-E1: el proxy se detecta (tag high) y se mitiga con review/mitigate/drop; auto_label sobre proxy es breach.",
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
        instruction: "S35-T2-B-E2 · Modela tres rutas de `Proxies, tamaño muestral y daño diferencial`: fixture válido, fixture adverso y registro sin `action`. Entrada: dict con case_id, feature, risk, action. Salidas exactas: `PASS`, `REJECT_PROXY_FEATURE`, `MISSING:action`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T2-B: proxy high con acción de mitigación o review. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_PROXY_FEATURE MISSING:action`.",
        feedback: "S35-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_PROXY_FEATURE y por qué faltar action exige REQUEST_PROXY_AUDIT.",
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
        instruction: "S35-T2-B-E3 · Transferencia: a partir de campos crudos (`features` con risk tags y `proposed_action`) **construye** el audit de proxies y decide.\n1) `build_proxy_audit` → `{high_risk, action, means_fraud}` con high-risk = keys cuyo tag es `\"high\"`.\n2) `decide` → `CONTINUE` si hay high-risk, action ∈ {review, mitigate, drop} y means_fraud is False.\n3) Adverso (`action=auto_label`) → `REJECT_PROXY_FEATURE`; sin `features` → `REQUEST_PROXY_AUDIT`.\nNo conviertas proxy en label de fraude. En teoría ya viste cómo se deriva el tag desde gaps; aquí el contrato opera sobre tags ya etiquetados.",
        hint: "Primero lista high_risk desde features; después evalúa action y means_fraud — no inviertas el orden.",
        hints: [
          "Primero lista high_risk desde features; después evalúa action y means_fraud — no inviertas el orden.",
          "high_risk = [k for k, v in features.items() if v == 'high']. auto_label o means_fraud=True → REJECT_PROXY_FEATURE. Sin features → REQUEST_PROXY_AUDIT.",
        ],
        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
        tests: "Tres entradas crudas: district_code high + review → CONTINUE; auto_label → REJECT_PROXY_FEATURE; sin features → REQUEST_PROXY_AUDIT.",
        feedback: "S35-T2-B-E3: la transferencia construye la lista high-risk y la acción de mitigación desde tags crudos; no basta flip de booleano sobre un record ya armado.",
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
        instruction: "S35-T3-A-E1 · Sobre `CASO-LIM-035-3A`, **calcula** la banda simétrica toy `lo=p-q`, `hi=p+q` y solo da PASS si `q>0`, `level != \"point\"` y el ancho de banda es positivo. El starter publica solo el punto (`lo=hi=p`, level=point) aunque `q` esté en el record: corrige el cálculo de la banda (no solo el booleano). Salida exacta: `S35-T3-A PASS`. El adverso con q==0 y level=point activa `REJECT_POINT_ONLY` en E2.",
        hint: "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
        hints: [
          "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
          "El lab usa level=toy (conformal real = cobertura en recursos/MAPIE). Publicar solo el punto (q==0 o lo==hi) es REJECT_POINT_ONLY.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] e imprime `S35-T3-A PASS`.",
        feedback: "S35-T3-A-E1: la banda se calcula (p±q), no se inventa; level=toy es honesto — no digas 'conformal calibrado' en el lab.",
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
        instruction: "S35-T3-A-E2 · Modela tres rutas de `Calibración e intervalos (conformal a alto nivel)`: fixture válido, fixture adverso y registro sin `q`. Entrada: dict con case_id, p, q, level. Salidas exactas: `PASS`, `REJECT_POINT_ONLY`, `MISSING:q`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a q debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-A: intervalo con q>0 y level distinto de point. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `q` ausente y produce exactamente `PASS REJECT_POINT_ONLY MISSING:q`.",
        feedback: "S35-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_POINT_ONLY y por qué faltar q exige REQUEST_INTERVAL.",
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
        instruction: "S35-T3-A-E3 · Contrasta fallo cerrado para `Calibración e intervalos (conformal a alto nivel)` con tres fixtures distintos. `CASO-LIM-035-3A` debe continuar, el adverso debe devolver `REJECT_POINT_ONLY` y la ausencia de `q` debe devolver `REQUEST_INTERVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INTERVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró intervalo con q>0 y level distinto de point; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
        tests: "Fixtures `CASO-LIM-035-3A`, adverso y sin `q` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_POINT_ONLY y por qué faltar q exige REQUEST_INTERVAL.",
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
        instruction: "S35-T3-B-E1 · Sobre `CASO-LIM-035-3B`, **detecta OOD** con `max(|z|) > threshold` y solo da PASS si hay OOD y `action=abstain` (sin auto-label). El starter fuerza `action=auto_fraud` cuando detecta OOD: corrige la política fail-closed. Salida exacta: `S35-T3-B PASS`. El adverso con action=auto_fraud activa `REJECT_AUTO_LABEL` en E2.",
        hint: "is_ood = max(abs(z) for z in zs) > thr. Si ood → action debe ser abstain, nunca auto_fraud.",
        hints: [
          "is_ood = max(abs(z) for z in zs) > thr. Si ood → action debe ser abstain, nunca auto_fraud.",
          "z=[1,2,3.5] con thr=3 dispara OOD. Forzar pred/label en OOD es breach del contrato de la ficha.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain e imprime `S35-T3-B PASS`.",
        feedback: "S35-T3-B-E1: OOD se calcula (max |z|); la política correcta es abstain hacia humano, no auto_fraud.",
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
        instruction: "S35-T3-B-E2 · Modela tres rutas de `Out-of-distribution y abstención`: fixture válido, fixture adverso y registro sin `action`. Entrada: dict con case_id, zs, threshold, action. Salidas exactas: `PASS`, `REJECT_AUTO_LABEL`, `MISSING:action`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a action debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T3-B: OOD detectado con action abstain y sin auto-label. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `action` ausente y produce exactamente `PASS REJECT_AUTO_LABEL MISSING:action`.",
        feedback: "S35-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_AUTO_LABEL y por qué faltar action exige REQUEST_OOD_POLICY.",
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
        instruction: "S35-T3-B-E3 · Transferencia: a partir de campos crudos (`zs`, `threshold`, `proposed_action`) **construye** la capa `uncertainty` y decide.\n1) `build_uncertainty` → `{ood, action, reason}` con `ood = max(|z|) > thr` (heurística univariante de lab).\n2) Si ood y action=abstain → `CONTINUE`.\n3) Si ood y proposed_action no es abstain → `REJECT_AUTO_LABEL`; sin `zs` → `REQUEST_OOD_POLICY`.\nNo fuerces label de fraude ni rellenes zs inventados.",
        hint: "Primero monta uncertainty desde zs/threshold/proposed_action; después evalúa ood y action — no inviertas el orden.",
        hints: [
          "Primero monta uncertainty desde zs/threshold/proposed_action; después evalúa ood y action — no inviertas el orden.",
          "ood = max(abs(z) for z in zs) > thr. reason='ood' si ood else None. CONTINUE solo si ood y action=='abstain'. Adverso con auto_fraud → REJECT_AUTO_LABEL.",
        ],
        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
        tests: "Tres entradas crudas: OOD+abstain → CONTINUE; OOD+auto_fraud → REJECT_AUTO_LABEL; sin zs → REQUEST_OOD_POLICY.",
        feedback: "S35-T3-B-E3: la transferencia ensambla uncertainty desde z-scores crudos y aplica fail-closed; no basta flip de PASS/REJECT sobre un record ya armado.",
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
        instruction: "S35-T4-A-E1 · Sobre `CASO-LIM-035-4A`, implementa `card_ok`: exige keys mínimas, `use=queue_rank`, `fraud_label` en `out_of_scope` y `contestability=True`. El starter acepta `use=fraud_label` y contestability=False: corrige el validador (no solo un booleano suelto). Salida exacta: `S35-T4-A PASS`. El adverso con use=fraud_label y contestability=False activa `REJECT_SCOPE_BREACH` en E2.",
        hint: "need = {use, out_of_scope, owner, contestability}; card_ok = need ⊆ card y \"fraud_label\" en out_of_scope y contestability is True y use == queue_rank.",
        hints: [
          "need = {use, out_of_scope, owner, contestability}; card_ok = need ⊆ card y \"fraud_label\" en out_of_scope y contestability is True y use == queue_rank.",
          "out_of_scope documenta usos prohibidos del score; no es un campo decorativo.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "El fixture `CASO-LIM-035-4A` pasa card_ok e imprime `S35-T4-A PASS`.",
        feedback: "S35-T4-A-E1: la card se valida por scope y contestabilidad; use=fraud_label es breach de producto.",
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
        instruction: "S35-T4-A-E2 · Modela tres rutas de `Model card y contestabilidad`: fixture válido, fixture adverso y registro sin `out_of_scope`. Entrada: dict con case_id, use, out_of_scope, contestability. Salidas exactas: `PASS`, `REJECT_SCOPE_BREACH`, `MISSING:out_of_scope`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a out_of_scope debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-A: card con use queue_rank, out_of_scope fraud_label y contestability. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `out_of_scope` ausente y produce exactamente `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope`.",
        feedback: "S35-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SCOPE_BREACH y por qué faltar out_of_scope exige REQUEST_CARD_KEYS.",
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
        instruction: "S35-T4-A-E3 · Transferencia: a partir de campos crudos (`use`, `prohibited`, `owner`, `contestability`) **construye** la model card y decide.\n1) `build_card` → dict con `use`, `out_of_scope` (desde prohibited), `owner` y `contestability`.\n2) `decide` → `CONTINUE` solo si `use==queue_rank`, `fraud_label` ∈ out_of_scope y contestability es True.\n3) Adverso (use=fraud_label) → `REJECT_SCOPE_BREACH`; sin `prohibited` → `REQUEST_CARD_KEYS`.\nNo inventes out_of_scope vacío como válido.",
        hint: "Primero arma la card con out_of_scope = list(prohibited); después valida scope y contestability.",
        hints: [
          "Primero arma la card con out_of_scope = list(prohibited); después valida scope y contestability.",
          "card_ok mental: use queue_rank, fraud_label en out_of_scope, contestability True. Falta prohibited → REQUEST_CARD_KEYS antes de mirar use.",
        ],
        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
        tests: "Tres entradas crudas: card válida → CONTINUE; use=fraud_label → REJECT_SCOPE_BREACH; sin prohibited → REQUEST_CARD_KEYS.",
        feedback: "S35-T4-A-E3: la transferencia construye la card desde keys crudas (estilo Mitchell mínimo) y luego aplica el gate de scope — no solo flip de booleano.",
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
        instruction: "S35-T4-B-E1 · Sobre `CASO-LIM-035-4B`, implementa `audit_event`: exige keys `case`, `human`, `by` y `by` no vacío. El starter da PASS cuando `by` está vacío (override silencioso): corrige el validador. Salida exacta: `S35-T4-B PASS`. El adverso con by vacío activa `REJECT_SILENT_OVERRIDE` en E2. Timestamp es recomendado en portfolio; no se exige en este demo mínimo.",
        hint: "audit_event: all(k in event for k in (\"case\", \"human\", \"by\")) and bool(event.get(\"by\")).",
        hints: [
          "audit_event: all(k in event for k in (\"case\", \"human\", \"by\")) and bool(event.get(\"by\")).",
          "Sin by no hay gobernanza: el override silencioso es breach aunque el score se vea correcto.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "El fixture `CASO-LIM-035-4B` pasa audit_event con by=analyst_7 e imprime `S35-T4-B PASS`.",
        feedback: "S35-T4-B-E1: el audit se valida con case/human/by; by vacío es override silencioso.",
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
        instruction: "S35-T4-B-E2 · Modela tres rutas de `Aprobación, override, apelación y retiro`: fixture válido, fixture adverso y registro sin `by`. Entrada: dict con case_id, case, human, by. Salidas exactas: `PASS`, `REJECT_SILENT_OVERRIDE`, `MISSING:by`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a by debe ocurrir antes de esa rama.",
          "Después aplica la regla de S35-T4-B: override con case, human y by no vacío. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `by` ausente y produce exactamente `PASS REJECT_SILENT_OVERRIDE MISSING:by`.",
        feedback: "S35-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_OVERRIDE y por qué faltar by exige REQUEST_AUDIT_FIELDS.",
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
        instruction: "S35-T4-B-E3 · Contrasta fallo cerrado para `Aprobación, override, apelación y retiro` con tres fixtures distintos. `CASO-LIM-035-4B` debe continuar, el adverso debe devolver `REJECT_SILENT_OVERRIDE` y la ausencia de `by` debe devolver `REQUEST_AUDIT_FIELDS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_AUDIT_FIELDS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró override con case, human y by no vacío; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
        tests: "Fixtures `CASO-LIM-035-4B`, adverso y sin `by` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S35-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_OVERRIDE y por qué faltar by exige REQUEST_AUDIT_FIELDS.",
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
      "Calcular contrib local value×weight (baseline=0 de lab) y dejar means_fraud=False y causal=False",
      "Publicar banda p±q con coverage_claim implícito False y, si OOD, action=abstain con reason=ood",
      "Completar model card (use=queue_rank, owner, out_of_scope con fraud_label, contestability=True)",
      "Registrar decisión humana con by no vacío; en portfolio extendido: ts, reason y model_version",
      "Documentar en la nota un slice con n/flag y un proxy justificado (no solo tag inventado)",
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
        options: [
          "Convertirlo en auto_label de fraude para maximizar recall",
          "Ignorarlo si el promedio global de precision es alto",
          "Justificar el riesgo con evidencia (gaps/n) y aplicar review, mitigate o drop",
          "Borrar el model card para no dejar rastro del feature",
        ],
        correctIndex: 2,
        explanation:
          "El proxy se audita con evidencia y se mitiga; no se convierte en etiqueta de fraude ni se oculta la gobernanza.",
      },
      {
        question: "El audit mínimo de un override en el lab exige, como mínimo:",
        options: [
          "Solo el emoji del analista en el chat del equipo",
          "case, human y by no vacío (ts y reason se recomiendan en portfolio)",
          "Reentrenar el modelo en silencio sin logs",
          "Publicar el score puntual sin banda ni capa humana",
        ],
        correctIndex: 1,
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
