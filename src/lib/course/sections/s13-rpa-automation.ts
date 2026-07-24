import type { CourseSection } from '../../types'

export const section13: CourseSection = {
  id: "rpa-automation",
  index: 13,
  title: "Familiarity Evidence Dashboard y cierre de nivel",
  shortTitle: "Evidence Dashboard",
  tagline: "ER determinista, señales de relación separadas, dashboard pseudonimizado, CP-N1-C + regresión N1 + CF-1",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "LayoutDashboard",
  accentColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  jobRelevance:
    "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es **saber si dos registros hablan de la misma persona** y, por separado, si hay **señales de familiaridad operativa** — sin inventar parentesco ni fraude. Un analista junior que entrega un **Familiarity Evidence Dashboard** con entity resolution determinista, scores **separados**, fichas pseudonimizadas y cola de revisión humana se vuelve confiable en la mesa de riesgo. Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** (privacidad, demo de un comando, runbook) listos para revisión de portfolio.",
  learningOutcomes: [
    { text: "Aplicar normalización y blocking para ER determinista y entity_resolution_score" },
    { text: "Evaluar ER con etiquetas sintéticas, precision/recall y cola clerical" },
    { text: "Computar relationship_signal_score (shared contact, distancia, apellidos) separado del ER" },
    { text: "Derivar señales de txs directas y contrapartes comunes sin afirmar colusión" },
    { text: "Producir score de evidencia con incertidumbre y explicación legible" },
    { text: "Aplicar umbrales de revisión/abstención; prohibir inferencia automática de parentesco/fraude" },
    { text: "Ensamblar scaffold de dashboard/mapa con fichas de caso pseudonimizadas" },
    { text: "Entregar ficha de privacidad, tests, demo reproducible y runbook de operación N1" },
  ],
  theory: [
    {
      heading: "Mapa del Familiarity Evidence Dashboard y cierre N1",
      paragraphs: [
        "Aquí cierras **CP-N1-C** con un **Familiarity Evidence Dashboard**: entity resolution por reglas, señales de relación **separadas** del score ER, explicación humana y operación responsable. La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores; en N1 el producto es la ficha de evidencia auditable que un revisor puede leer en cinco minutos.",
        "Promoción de nivel: tres capstones N1, **regresión S01–S13 (level-1)** y **CF-1** aprobados. Solo datos sintéticos pseudonimizados (`C00x`, Lima/Arequipa). Si falta evidencia o el schema no cuadra, **falla cerrado** — no auto-merge, no `auto_fraud`. Stack: stdlib + reglas deterministas de S01–S12; **sin** sklearn ni NumPy/Pandas de S14–S15.",
        "Desde **S12** ya traes HTTP con timeout/retry, SQL parametrizado y geoseñal con política de egress (solo ciudad/mock, sin PII cruda a geocoders públicos). En S13 esos ladrillos alimentan **tooltips del mapa** y la ficha: `geo_distance_km=…; source=mock`. No reaprendes el adapter: lo **conectas** a la vista de evidencia.",
        "Orden de estudio: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático. **Diccionario de la sección:** *blocking* acota pares candidatos antes de reglas finas; *cola clerical* es la bandeja humana de duda; *fail-closed* niega el merge si falta evidencia; *uncertainty* (`low`/`med`/`high`) declara qué tan confiable es el score; *CF-1* es el paquete de privacidad + demo + runbook del cierre de nivel. **Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio.",
      ],
      callout: {
        type: "info",
        title: "Enfoque de esta sección",
        content:
          "El objetivo de S13 es el dashboard de evidencia + cierre N1. Solo datos sintéticos; nunca PII real; nunca auto_fraud/is_family. Primero identidad, luego relación, luego decisión, al final producto.",
      },
    },
    {
      heading: "Normalización, blocking y entity resolution",
      subtopicId: "S13-T1-A",
      paragraphs: [
        "**Ancla:** entity resolution (ER) responde *¿es la misma entidad en dos filas?* No responde *¿son familia?* ni *¿hay fraude?* Esas preguntas se tratan con otros scores y con humanos. Sin normalización, `D-12.34` y `d1234` parecen identidades distintas aunque son el mismo documento sintético: por eso casefold y limpieza de no-alfanuméricos van **antes** de cualquier comparación.",
        "**Mecanismo — blocking:** el producto cartesiano de *N* registros es *N×N* pares; con miles de filas es inviable revisarlos a mano. **Blocking** (apellido paterno + región) acota el espacio: solo corres reglas finas dentro del mismo bloque. En nombres peruanos sintéticos del curso: con `Nombre ApellidoPaterno ApellidoMaterno`, toma el **segundo** token (`parts[1]`); si solo hay un token, usa ese. Ejemplo: `Luis Huamán Soto` + Cusco → `huamán|cusco`. Documenta la regla en el memo y **no** mezcles «último token» (materno) con «paterno» en el mismo pipeline.",
        "**Trabajo guiado:** ER **determinista por reglas** produce `entity_resolution_score` ∈ [0,1]. Contrato típico N1: 1.0 si documento normalizado y blocking key coinciden; 0.5 si solo el documento coincide (bloques distintos — sospecha de migración o error de región); 0.0 en otro caso. Caso sintético: `Ana Quispe` / `ANA QUISPE` en Lima con el mismo doc → ER 1.0; el `relationship_signal_score` se calcula en T2 y **no** se suma a ciegas al ER.",
        "**Borde / fail-closed:** si falta `document_id`, el nombre está vacío o el bloque queda sin tokens, **no** inventes score 1.0. No uses embeddings, sklearn ni ER probabilístico aquí (eso es tramo posterior, p. ej. S30). En la ficha del dashboard los dos scores viajan en campos **separados** con etiquetas legibles.",
      ],
      code: {
        language: 'python',
        title: "er_rules.py",
        code: `import re

def norm_doc(d: str) -> str:
    return re.sub(r"[^a-z0-9]", "", d.casefold())

def norm_name(n: str) -> str:
    return re.sub(r"\\s+", " ", n.casefold().strip())

def block_key(rec):
    parts = norm_name(rec["name"]).split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{rec['region'].casefold()}"

a = {"name": "Ana Quispe", "document_id": "D-12.34", "region": "Lima"}
b = {"name": "ANA  QUISPE", "document_id": "d1234", "region": "Lima"}
score = 1.0 if norm_doc(a["document_id"]) == norm_doc(b["document_id"]) and block_key(a) == block_key(b) else 0.0
print("block", block_key(a), block_key(b))
print("entity_resolution_score", score)
print("relationship_signal_score", "SEPARATE")`,
        output: `block quispe|lima quispe|lima
entity_resolution_score 1.0
relationship_signal_score SEPARATE`,
      },
      callout: {
        type: "tip",
        title: "Dos scores, dos historias",
        content:
          "entity_resolution_score ≠ relationship_signal_score. La UI debe mostrarlos aparte. Blocking N1: apellido paterno (parts[1]) + región.",
      },
    },
    {
      heading: "Verdad etiquetada, precision/recall y revisión clerical",
      subtopicId: "S13-T1-B",
      paragraphs: [
        "**Ancla:** sin etiquetas no sabes si tu regla de ER ayuda o daña. Con pares **sintéticos** etiquetados calculas **TP** (dijiste match y era match), **FP** (dijiste match y no lo era) y **FN** (era match y lo dejaste pasar). De ahí: precision = TP/(TP+FP) y recall = TP/(TP+FN). La etiqueta es ground truth de *identidad en el fixture del curso* — **no** es un veredicto legal sobre personas reales.",
        "**Mecanismo y trade-off:** en ER de alto riesgo (crédito, compliance) priorizas **precision**: un merge falso puede unir cuentas de dos personas distintas. El recall imperfecto se compensa con la **cola clerical** (humano revisa la duda). Scores en banda intermedia (p. ej. [0.4, 0.7]) **nunca** auto-mergean: van a revisión. Aceptar solo si score ≥ 0.8 y uncertainty ≠ high. Fail-closed si la etiqueta o el score no son finitos.",
        "**Caso trabajado:** tabla de 6 pares sintéticos con 2 TP, 1 FP y 1 FN → precision 0.667 y recall 0.667. Reportas ambos redondeados a 3 decimales y el flag explícito `fp_means_fraud=False` en el memo del gate. Si solo publicas «accuracy alto» sin desglose TP/FP/FN, el revisor no puede auditar el coste de los errores.",
        "**Borde ético:** un **FP no implica fraude**. Es colisión de identidad estimada (dos personas, un score alto por casualidad o por regla débil). Tratar FP como delito es el error más grave que puedes llevar a un dashboard de N1: por eso la ficha y el runbook repiten la frase hasta que se vuelva reflejo.",
      ],
      code: {
        language: 'python',
        title: "pr_metrics.py",
        code: `def pr_from_pairs(pairs):
    tp = sum(1 for t, p in pairs if t == 1 and p == 1)
    fp = sum(1 for t, p in pairs if t == 0 and p == 1)
    fn = sum(1 for t, p in pairs if t == 1 and p == 0)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    return tp, fp, fn, precision, recall

pairs = [
    (1, 1), (1, 1), (1, 0),
    (0, 1), (0, 0), (0, 0),
]
tp, fp, fn, precision, recall = pr_from_pairs(pairs)
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(precision, 3), "recall", round(recall, 3))
print("fp_means_fraud", False)`,
        output: `tp 2 fp 1 fn 1
precision 0.667 recall 0.667
fp_means_fraud False`,
      },
      callout: {
        type: "warning",
        title: "FP ≠ fraude",
        content:
          "False positive de ER es colisión de identidad estimada, no evidencia de delito.",
      },
    },
    {
      heading: "Email/teléfono/dirección compartidos, distancia y apellidos",
      subtopicId: "S13-T2-A",
      paragraphs: [
        "**Ancla:** el score de **relación** responde *¿hay indicios de familiaridad operativa entre dos entidades?* (contacto compartido, cercanía, apellido). **No** responde *¿son parientes?* ni *¿hay colusión?* Esas inferencias quedan fuera de N1 y de la UI automática. Cada señal es un booleano o parcial con traza legible: `shared_phone`, `geo_close`, `surname_jaccard`.",
        "**Mecanismo — fórmula canónica N1:** `rel = 0.5*shared_phone + 0.3*geo_close + 0.2*surname_jaccard` (pesos fijos en el memo del curso). La distancia de par es **bilateral**: ambos registros deben reportar el mismo `km` sintético y `km ≤ 2.0` (reutiliza la geoseñal de S12). En ejercicios de práctica puedes usar una **variante** (p. ej. solo geo+apellido 0.6/0.4) **si** la instruction lo declara; no inventes una tercera fórmula sin etiquetarla.",
        "**Caso trabajado:** teléfono compartido + `km=1.2` en ambos + Jaccard de tokens de apellido 0.2 → `relationship_signal_score` 0.84. La ficha lista las tres señales en la explicación y fija `kinship_verdict=None`. Si solo imprimes el número 0.84 sin bullets, el revisor no sabe *por qué* subió el score.",
        "**Borde / fail-closed:** si falta el campo de una señal con peso no cero, **no** inventes `True` ni un km «promedio». Apellido compartido + teléfono **no** autoriza `is_family=true`. La salida del demo y del portfolio debe poder afirmar en voz alta: *señal ≠ parentesco*.",
      ],
      code: {
        language: 'python',
        title: "rel_signals.py",
        code: `def shared_contact(a, b, field):
    return a.get(field) and a.get(field) == b.get(field)

def surname_overlap(a, b):
    sa = set(a.casefold().split())
    sb = set(b.casefold().split())
    return len(sa & sb) / max(1, len(sa | sb))

def geo_close_pair(a, b, threshold=2.0):
    # Distancia de par sintética: ambos deben reportar el mismo km de par
    if a.get("km") is None or b.get("km") is None:
        return False
    if a["km"] != b["km"]:
        return False
    return a["km"] <= threshold

a = {"phone": "999111222", "name": "Ana Quispe Rojas", "km": 1.2}
b = {"phone": "999111222", "name": "Luis Quispe Díaz", "km": 1.2}
signals = {
    "shared_phone": shared_contact(a, b, "phone"),
    "geo_close": geo_close_pair(a, b),
    "surname_jaccard": round(surname_overlap(a["name"], b["name"]), 3),
}
# N1 canónico: 0.5 phone + 0.3 geo + 0.2 jaccard
score = 0.5 * signals["shared_phone"] + 0.3 * signals["geo_close"] + 0.2 * signals["surname_jaccard"]
print(signals)
print("relationship_signal_score", round(score, 3))
print("kinship_verdict", None)`,
        output: `{'shared_phone': True, 'geo_close': True, 'surname_jaccard': 0.2}
relationship_signal_score 0.84
kinship_verdict None`,
      },
      callout: {
        type: "danger",
        title: "Señal ≠ parentesco",
        content:
          "Prohibido setear is_family automáticamente en N1. Canónico N1: rel = 0.5*phone + 0.3*geo + 0.2*jaccard.",
      },
    },
    {
      heading: "Transacciones directas y contrapartes comunes",
      subtopicId: "S13-T2-B",
      paragraphs: [
        "**Ancla:** transacciones directas A↔B y **contrapartes comunes** (A y C pagan a D) son evidencia de **relación operativa** en el grafo sintético — no de colusión, lavado ni cartel. El revisor ve *quién pagó a quién* en la ficha; el producto **organiza evidencia** y **nunca** acusa.",
        "**Mecanismo:** modela un graphlet simple (lista de triples emisor–receptor–monto) y emite objetos con `type` (`direct_tx`, `common_counterparty`) y traza (`n` de txs, clave `via` para la contraparte compartida — no `shared`). Reutiliza el espíritu de `RelationshipEvidence` de S11: dato + ids + explicación, **sin** método `is_collusion()` ni score de «riesgo cartel».",
        "**Caso trabajado:** A↔B con 2 txs y A,C→D → lista `[{type: direct_tx, … n:2}, {type: common_counterparty, via:['D']}]` y `collusion_claim=False` fijo en el demo. El disclaimer en UI y runbook es obligatorio: *common counterparty ≠ collusion claim*.",
        "**Borde:** si el grafo está vacío o un nodo no tiene vecinos, devuelve lista vacía o `via=[]` — no inventes contrapartes. Si alguien pide un flag de colusión automática, la respuesta de N1 es redirigir a revisión humana documentada, no añadir un booleano «culpable».",
      ],
      code: {
        language: 'python',
        title: "tx_graphlet.py",
        code: `txs = [
    ("A", "B", 10),
    ("B", "A", 5),
    ("A", "D", 3),
    ("C", "D", 4),
]

def direct_between(x, y):
    return [t for t in txs if {t[0], t[1]} == {x, y}]

def counterparties(entity):
    s = set()
    for a, b, _ in txs:
        if a == entity:
            s.add(b)
        if b == entity:
            s.add(a)
    return s

common = counterparties("A") & counterparties("C")
evidence = [
    {"type": "direct_tx", "pair": ("A", "B"), "n": len(direct_between("A", "B"))},
    {"type": "common_counterparty", "entities": ("A", "C"), "via": sorted(common)},
]
print(evidence)
print("collusion_claim", False)`,
        output: `[{'type': 'direct_tx', 'pair': ('A', 'B'), 'n': 2}, {'type': 'common_counterparty', 'entities': ('A', 'C'), 'via': ['D']}]
collusion_claim False`,
      },
      callout: {
        type: "tip",
        title: "Evidencia, no acusación",
        content:
          "La UI y el runbook deben repetir: sin claim de colusión automática.",
      },
    },
    {
      heading: "Score de evidencia, incertidumbre y explicación",
      subtopicId: "S13-T3-A",
      paragraphs: [
        "**Ancla:** la ficha de caso es el artefacto que lee un humano. No basta con un número: necesitas **tres salidas que viajan juntas** — `evidence_score`, banda de **incertidumbre** (`low`/`med`/`high`) y **bullets** legibles. Si no puedes listar al menos tres bullets honestos (qué inputs usaste y qué falta), **no publiques** el score en la UI.",
        "**Mecanismo:** combina ER y relación con pesos **explícitos** (canónico de ficha: 0.6·ER + 0.4·REL). Uncertainty sube a `high` si hay conflicto fuerte (|ER−REL| > 0.5) o si faltan ≥2 campos; a `med` si falta al menos uno; `low` solo si el input está completo y coherente. Auditoría mínima: lista `missing` + `rules_version` (p. ej. `n1-er-1.0`).",
        "**Caso trabajado:** `explain(0.9, 0.4, [\"phone\"])` → evidence_score 0.7, uncertainty `med` (falta teléfono; el gap |0.9−0.4|=0.5 no supera el umbral de conflicto >0.5 en este contrato), bullets con ER, REL y missing, audit `rules_version=n1-er-1.0`. El revisor debe poder recalcular 0.7 desde el fixture.",
        "**Borde / fail-closed:** si faltan campos obligatorios, eleva uncertainty; **no** inventes un teléfono o km «promedio» para subir el score. Señales conflictivas (ER alto y REL muy baja) se **explican**, no se maquillan hacia el centro. Un score sin bullets es teatro, no evidencia.",
      ],
      code: {
        language: 'python',
        title: "evidence_card.py",
        code: `def uncertainty(missing_fields, conflict):
    if conflict or len(missing_fields) >= 2:
        return "high"
    if missing_fields:
        return "med"
    return "low"

def explain(er, rel, missing):
    bullets = [
        f"ER score={er:.2f}",
        f"relationship_signal_score={rel:.2f}",
        f"missing={missing or 'none'}",
    ]
    evidence_score = round(0.6 * er + 0.4 * rel, 3)
    return {
        "evidence_score": evidence_score,
        "uncertainty": uncertainty(missing, conflict=(abs(er - rel) > 0.5)),
        "explanation": bullets,
        "audit": {"rules_version": "n1-er-1.0"},
    }

print(explain(0.9, 0.4, ["phone"]))`,
        output: `{'evidence_score': 0.7, 'uncertainty': 'med', 'explanation': ['ER score=0.90', 'relationship_signal_score=0.40', "missing=['phone']"], 'audit': {'rules_version': 'n1-er-1.0'}}`,
      },
      callout: {
        type: "tip",
        title: "Explicación primero",
        content:
          "Si no puedes listar 3 bullets honestos, no publiques el score.",
      },
    },
    {
      heading: "Umbral de revisión, abstención y no inferencia automática",
      subtopicId: "S13-T3-B",
      paragraphs: [
        "**Ancla:** el dashboard no «decide culpables». Decide **qué hacer con un par de evidencia**: invalidar entrada, abstenerse, encolar revisión o aceptar el par de identidad. Matriz **total y sin huecos** (todo score finito en [0,1] y toda uncertainty conocida cae en exactamente un estado). **Nunca** `auto_fraud=true` ni `is_family=true`.",
        "**Mecanismo (orden de evaluación):** (1) score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} → `invalid_input`; (2) uncertainty `high` → `needs_review` (aunque el score sea 0.95); (3) score menor que 0.40 → `abstain`; (4) score menor que 0.80 → `needs_review`; (5) resto → `accept_pair`. Los límites **0.40** y **0.80** son exactos: 0.399 → abstain; 0.4 → needs_review; 0.799 → needs_review; 0.8 con uncertainty no-high → accept_pair. No «aproximes» 0.799 a accept.",
        "**Human-in-the-loop:** la acción es de **datos** (revisar / aceptar par / abstenerse), no veredicto legal, no KYC automático y no «lista negra» de personas. El revisor ve la ficha (ER, REL, bullets, uncertainty) y elige; el código solo clasifica el par.",
        "**Borde y auditoría de portfolio:** grepea el repo y elimina cualquier path que setee `is_family` o `auto_fraud`. Las 9 filas de `DECISION_MATRIX` del You Do deben pasar con asserts exactos y **siempre** `auto_fraud=False` en la salida del demo. Si queda un hueco numérico entre umbrales, el gate de N1 no cierra.",
      ],
      code: {
        language: 'python',
        title: "thresholds.py",
        code: `from math import isfinite

def decide_ops_status(score, uncertainty):
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return "invalid_input"
    if not isfinite(score) or not 0.0 <= score <= 1.0:
        return "invalid_input"
    if uncertainty not in {"low", "med", "high"}:
        return "invalid_input"
    if uncertainty == "high":
        return "needs_review"
    if score < 0.4:
        return "abstain"
    if score < 0.8:
        return "needs_review"
    return "accept_pair"

for s, u in [(0.9, "low"), (0.55, "med"), (0.2, "low"), (0.85, "high"), (float("nan"), "low")]:
    print(s, u, decide_ops_status(s, u), "auto_fraud", False)`,
        output: `0.9 low accept_pair auto_fraud False
0.55 med needs_review auto_fraud False
0.2 low abstain auto_fraud False
0.85 high needs_review auto_fraud False
nan low invalid_input auto_fraud False`,
      },
      callout: {
        type: "danger",
        title: "Política N1",
        content:
          "Prohibido inferir parentesco o fraude. Los límites 0.40 y 0.80 son exactos: 0.40 entra a revisión y 0.80 puede aceptarse si uncertainty no es high.",
      },
    },
    {
      heading: "Dashboard/mapa pseudonimizado y ficha de caso",
      subtopicId: "S13-T4-A",
      paragraphs: [
        "**Ancla de producto:** el gate de N1 no pide un design system ni Streamlit de secciones futuras. Pide un **scaffold auditable**: tres fichas + puntos de mapa con coords sintéticas (Lima/Arequipa) y tooltips de geoseñal **trazable** (`geo_distance_km=…; source=mock`). Un revisor debe poder abrir la vista y entender cada caso en cinco minutos.",
        "**Mecanismo de privacidad en UI:** **pseudonimiza** nombres (`A*** Q***`). Reutiliza la política de egress de S12: no mandes PII cruda a un geocoder público. La ficha muestra `entity_resolution_score` **y** `relationship_signal_score` en campos **separados**. Si los mezclas en un solo número sin etiqueta, rompes el gate ético: el revisor ya no sabe si «0.7» es identidad o familiaridad operativa.",
        "**Casos trabajados (mínimo tres):** CASE-1 A*** Q*** con ER 0.92 y REL 0.41 (identidad fuerte, relación moderada); CASE-2 L*** H*** con ER medio y REL más alto — el revisor ve la tensión **sin** auto-etiqueta de parentesco; CASE-3 M*** R*** con ER 0.77 y REL 0.22 (banda de duda / cola clerical). Los tres aparecen en el demo iDo y en el scaffold de teoría.",
        "**Borde:** si un caso no tiene coords o no puede pseudonimizarse, **no** inventes un nombre real ni un lat/lon de un domicilio real. Fuente del tooltip siempre explícita (`mock` / `synthetic`). El portfolio captura pantalla con los tres case_id visibles y scores etiquetados.",
      ],
      code: {
        language: 'python',
        title: "dashboard_scaffold.py",
        code: `def pseudonymize(name: str) -> str:
    parts = name.split()
    return " ".join(p[0] + "***" for p in parts if p)

cases = [
    {
        "case_id": "CASE-1",
        "display_name": pseudonymize("Ana Quispe"),
        "entity_resolution_score": 0.92,
        "relationship_signal_score": 0.41,
        "lat": -12.0464,
        "lon": -77.0428,
        "geo_tooltip": "geo_distance_km=1.2; source=mock",
    },
    {
        "case_id": "CASE-2",
        "display_name": pseudonymize("Luis Huamán"),
        "entity_resolution_score": 0.55,
        "relationship_signal_score": 0.60,
        "lat": -16.4090,
        "lon": -71.5375,
        "geo_tooltip": "shared_phone; source=synthetic",
    },
    {
        "case_id": "CASE-3",
        "display_name": pseudonymize("María Rojas"),
        "entity_resolution_score": 0.77,
        "relationship_signal_score": 0.22,
        "lat": -12.05,
        "lon": -77.12,
        "geo_tooltip": "geo_distance_km=3.5; source=mock; band=review",
    },
]
for c in cases:
    print(c["case_id"], c["display_name"], "ER", c["entity_resolution_score"], "REL", c["relationship_signal_score"])`,
        output: `CASE-1 A*** Q*** ER 0.92 REL 0.41
CASE-2 L*** H*** ER 0.55 REL 0.6
CASE-3 M*** R*** ER 0.77 REL 0.22`,
      },
      callout: {
        type: "tip",
        title: "UI mínima viable N1",
        content:
          "Tres casos sintéticos + mapa de puntos + ficha bastan para el gate de producto.",
      },
    },
    {
      heading: "Privacidad, acceso, pruebas, demo y runbook",
      subtopicId: "S13-T4-B",
      paragraphs: [
        "**Ancla CF-1:** sin operación documentada, el dashboard es un prototipo de laptop, no un cierre de nivel. La **privacy sheet** fija clase de datos `synthetic_only`, retención local, sin egress de PII a geocoders públicos (política S12), y roles mínimos `viewer` / `reviewer`. Documenta qué se guarda, quién ve la ficha y qué **no** sale del entorno de demo. Sin esta hoja, CF-1 no cierra aunque el score «se vea bonito».",
        "**Mecanismo de entrega:** (1) **tests green** de ER, señales y umbrales; (2) **demo de un comando** (`python -m demo_n1_dashboard --synthetic`); (3) **runbook** con setup + playbook de incidente (token o nombre en log → `rotate_secret` / `redact_logs` / `postmortem`). Un compañero en máquina limpia debe poder reproducir la demo con el mismo fixture sintético.",
        "**Regresión level-1 y carga cognitiva:** artefactos CF-1 + checklist **S01–S13** cierran el nivel. En ~30 min re-ejecuta solo los checks críticos de `LEVEL1_REGRESSION_MATRIX` y anota pass/fail; el bloque de producto (dashboard + privacy) es aparte — no intentes rehacer todos los capstones en una sola noche.",
        "**Borde de gate:** tu entrega **documenta evidencia** del producto N1; el progreso del curso se registra por el proceso de gate formal, no por un flag dentro del script de demo. La demo no escribe «aprobado» en ningún ledger: solo prueba que el producto corre y es auditable.",
      ],
      code: {
        language: 'python',
        title: "ops_cf1.py",
        code: `def privacy_sheet():
    return {
        "data_class": "synthetic_only",
        "pii_real": False,
        "egress_public_geocoder": "city_address_only",
        "roles": ["viewer", "reviewer"],
    }

def runbook_steps():
    return [
        "setup venv",
        "load synthetic fixtures",
        "run ER + signals",
        "open dashboard",
        "process review queue",
    ]

def incident_actions():
    return {
        "trigger": "token_or_name_in_log",
        "action": ["rotate_secret", "redact_logs", "postmortem"],
    }

print("privacy", privacy_sheet())
print("demo_cmd", "python -m demo_n1_dashboard")
print("runbook", runbook_steps())
print("incident", incident_actions())
print("level1_regression", "S01-S13 checklist required")`,
        output: `privacy {'data_class': 'synthetic_only', 'pii_real': False, 'egress_public_geocoder': 'city_address_only', 'roles': ['viewer', 'reviewer']}
demo_cmd python -m demo_n1_dashboard
runbook ['setup venv', 'load synthetic fixtures', 'run ER + signals', 'open dashboard', 'process review queue']
incident {'trigger': 'token_or_name_in_log', 'action': ['rotate_secret', 'redact_logs', 'postmortem']}
level1_regression S01-S13 checklist required`,
      },
      callout: {
        type: "info",
        title: "Cierre N1",
        content:
          "CP-N1-C + regresión level-1 + CF-1. La demo evidencia el producto; no sustituye el gate formal del curso.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos del cierre N1 — un demo por subtema, en el mismo orden T1→T4. Observa el código, corre el demo y compara la salida: cada print debe ser reproducible. Cubres ER por reglas, evaluación+clerical, señales de relación (fórmula canónica 0.5/0.3/0.2), graphlet de txs, ficha con uncertainty, umbrales sin auto_fraud, scaffold de 3 casos y runbook con regresión level-1. Después de cada demo, el We Do del mismo subtema te pide arreglar un DEFECT del mismo contrato.",
    steps: [
      {
        demoId: "S13-T1-A-DEMO",
        subtopicId: "S13-T1-A",
        environment: "local-python",
        description: "Emparejar 2 registros sintéticos por documento normalizado + bloque región.",
        code: {
          language: 'python',
          title: "er_pair_demo.py",
          code: `import re

def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())

def block_key(r):
    parts = r["name"].casefold().strip().split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{r['region'].casefold()}"

r1 = {"name": "Ana Quispe", "document_id": "D-7788", "region": "Lima"}
r2 = {"name": "ANA QUISPE", "document_id": "d7788", "region": "Lima"}
match = norm_doc(r1["document_id"]) == norm_doc(r2["document_id"]) and block_key(r1) == block_key(r2)
print("block", block_key(r1))
print("match", match)
print("entity_resolution_score", 1.0 if match else 0.0)`,
          output: `block quispe|lima
match True
entity_resolution_score 1.0`,
        },
        why: "Reglas deterministas transparentes antes de cualquier modelo probabilístico.",
      },
      {
        demoId: "S13-T1-B-DEMO",
        subtopicId: "S13-T1-B",
        environment: "local-python",
        description: "Evaluar 20 pares etiquetados sintéticos; listar 3 para revisión humana por score en duda.",
        code: {
          language: 'python',
          title: "eval_clerical_demo.py",
          code: `import random

def build_pairs(seed=13, n=20):
    random.seed(seed)
    pairs = []
    for i in range(n):
        y = 1 if i % 3 == 0 else 0
        score = 0.85 if y == 1 else 0.2
        if i in (4, 9, 15):
            score = 0.55
        pairs.append({"id": f"P{i}", "y": y, "score": score, "pred": int(score >= 0.7)})
    return pairs

def pr_metrics(pairs):
    tp = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 1)
    fp = sum(1 for p in pairs if p["y"] == 0 and p["pred"] == 1)
    fn = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 0)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    return tp, fp, fn, precision, recall

pairs = build_pairs()
tp, fp, fn, precision, recall = pr_metrics(pairs)
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(precision, 3))
print("recall", round(recall, 3))
print("clerical_queue", [p["id"] for p in pairs if 0.4 <= p["score"] <= 0.7])`,
          output: `tp 5 fp 0 fn 2
precision 1.0
recall 0.714
clerical_queue ['P4', 'P9', 'P15']`,
        },
        why: "Métricas + cola clerical cierran el loop de calidad de ER.",
      },
      {
        demoId: "S13-T2-A-DEMO",
        subtopicId: "S13-T2-A",
        environment: "local-python",
        description: "Dos entidades: shared phone + 1.2 km → señales con explicación.",
        code: {
          language: 'python',
          title: "shared_geo_demo.py",
          code: `def relationship_signals(a, b):
    signals = []
    phone = 1.0 if a.get("phone") and a["phone"] == b.get("phone") else 0.0
    if phone:
        signals.append("shared_phone")
    # Distancia de par: ambos registros reportan el mismo km sintético
    geo = 0.0
    if a.get("km") is not None and b.get("km") is not None and a["km"] == b["km"] and a["km"] <= 2.0:
        geo = 1.0
        signals.append(f"geo_distance_km={a['km']}")
    surname = 1.0 if a.get("surname") and a["surname"] == b.get("surname") else 0.0
    if surname:
        signals.append("surname_match")
    # N1 canónico: 0.5 phone + 0.3 geo + 0.2 surname (match binario aquí)
    rel = round(0.5 * phone + 0.3 * geo + 0.2 * surname, 3)
    return signals, rel

a = {"phone": "900111222", "surname": "quispe", "km": 1.2}
b = {"phone": "900111222", "surname": "quispe", "km": 1.2}
signals, rel = relationship_signals(a, b)
print("signals", signals)
print("relationship_signal_score", rel)
print("explanation", signals)
print("kinship_verdict", None)`,
          output: `signals ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
relationship_signal_score 1.0
explanation ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
kinship_verdict None`,
        },
        why: "Explicación lista para la ficha sin veredicto de parentesco.",
      },
      {
        demoId: "S13-T2-B-DEMO",
        subtopicId: "S13-T2-B",
        environment: "local-python",
        description: "Grafo simple A↔B y contraparte común D → lista RelationshipEvidence.",
        code: {
          language: 'python',
          title: "graphlet_demo.py",
          code: `def graphlet_evidence(txs, a="A", b="B", c="C"):
    evidence = []
    if any({x, y} == {a, b} for x, y, _ in txs):
        evidence.append({"type": "direct_tx", "nodes": [a, b]})
    def neighbors(node):
        s = set()
        for x, y, _ in txs:
            if x == node:
                s.add(y)
            if y == node:
                s.add(x)
        return s
    shared = sorted(neighbors(a) & neighbors(c))
    evidence.append({"type": "common_counterparty", "nodes": [a, c], "via": shared})
    return evidence

txs = [("A", "B", 1), ("B", "A", 1), ("A", "D", 2), ("C", "D", 2)]
print(graphlet_evidence(txs))
print("collusion_claim", False)`,
          output: `[{'type': 'direct_tx', 'nodes': ['A', 'B']}, {'type': 'common_counterparty', 'nodes': ['A', 'C'], 'via': ['D']}]
collusion_claim False`,
        },
        why: "Graphlet mínimo con disclaimers operativos.",
      },
      {
        demoId: "S13-T3-A-DEMO",
        subtopicId: "S13-T3-A",
        environment: "local-python",
        description: "Ficha con score, uncertainty low/med/high y 3 bullets de por qué.",
        code: {
          language: 'python',
          title: "case_card_demo.py",
          code: `def build_case_card(er, rel, missing):
    conflict = abs(er - rel) > 0.5
    unc = "high" if conflict or len(missing) >= 2 else ("med" if missing else "low")
    return {
        "evidence_score": round(0.6 * er + 0.4 * rel, 3),
        "uncertainty": unc,
        "bullets": [
            f"entity_resolution_score={er}",
            f"relationship_signal_score={rel}",
            f"missing_fields={missing}",
        ],
    }

print(build_case_card(0.88, 0.45, ["email"]))`,
          output: `{'evidence_score': 0.708, 'uncertainty': 'med', 'bullets': ['entity_resolution_score=0.88', 'relationship_signal_score=0.45', "missing_fields=['email']"]}`,
        },
        why: "La ficha es el artefacto humano del dashboard.",
      },
      {
        demoId: "S13-T3-B-DEMO",
        subtopicId: "S13-T3-B",
        environment: "local-python",
        description: "Scores en zona gris → status=needs_review; nunca auto_fraud=true.",
        code: {
          language: 'python',
          title: "review_threshold_demo.py",
          code: `from math import isfinite

def decide(score, unc):
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return "invalid_input"
    if not isfinite(score) or not 0.0 <= score <= 1.0 or unc not in {"low", "med", "high"}:
        return "invalid_input"
    if unc == "high":
        return "needs_review"
    if score < 0.4:
        return "abstain"
    if score < 0.8:
        return "needs_review"
    return "accept_pair"

samples = [(0.55, "med"), (0.9, "low"), (0.15, "low"), (float("nan"), "low")]
for sc, u in samples:
    print({"score": sc, "uncertainty": u, "status": decide(sc, u), "auto_fraud": False, "is_family": False})`,
          output: `{'score': 0.55, 'uncertainty': 'med', 'status': 'needs_review', 'auto_fraud': False, 'is_family': False}
{'score': 0.9, 'uncertainty': 'low', 'status': 'accept_pair', 'auto_fraud': False, 'is_family': False}
{'score': 0.15, 'uncertainty': 'low', 'status': 'abstain', 'auto_fraud': False, 'is_family': False}
{'score': nan, 'uncertainty': 'low', 'status': 'invalid_input', 'auto_fraud': False, 'is_family': False}`,
        },
        why: "Política de abstención y revisión protege al estudiante y al usuario final.",
      },
      {
        demoId: "S13-T4-A-DEMO",
        subtopicId: "S13-T4-A",
        environment: "local-python",
        description: "Scaffold de 3 casos sintéticos pseudonimizados listos para dashboard/mapa.",
        code: {
          language: 'python',
          title: "three_cases_demo.py",
          code: `def pseudo(n):
    return " ".join(p[0] + "***" for p in n.split())

cases = [
    ("CASE-1", "Ana Quispe", 0.91, 0.4, -12.0464, -77.0428),
    ("CASE-2", "Luis Huamán", 0.52, 0.66, -16.4090, -71.5375),
    ("CASE-3", "María Rojas", 0.77, 0.22, -12.05, -77.12),
]
for cid, name, er, rel, lat, lon in cases:
    print({
        "case_id": cid,
        "display": pseudo(name),
        "entity_resolution_score": er,
        "relationship_signal_score": rel,
        "map": (lat, lon),
    })`,
          output: `{'case_id': 'CASE-1', 'display': 'A*** Q***', 'entity_resolution_score': 0.91, 'relationship_signal_score': 0.4, 'map': (-12.0464, -77.0428)}
{'case_id': 'CASE-2', 'display': 'L*** H***', 'entity_resolution_score': 0.52, 'relationship_signal_score': 0.66, 'map': (-16.409, -71.5375)}
{'case_id': 'CASE-3', 'display': 'M*** R***', 'entity_resolution_score': 0.77, 'relationship_signal_score': 0.22, 'map': (-12.05, -77.12)}`,
        },
        why: "Producto mínimo: ficha + mapa con scores separados.",
      },
      {
        demoId: "S13-T4-B-DEMO",
        subtopicId: "S13-T4-B",
        environment: "local-python",
        description: "Runbook: setup → load synthetic → run ER → open dashboard → review queue (+ regresión N1).",
        code: {
          language: 'python',
          title: "runbook_demo.py",
          code: `def cf1_runbook():
    return [
        "1. setup: python -m venv .venv && pip install -r requirements.txt",
        "2. load synthetic fixtures (no real PII)",
        "3. run ER + relationship signals",
        "4. open dashboard scaffold",
        "5. process clerical review queue",
        "6. level-1 regression notes: re-run critical checks S01-S13",
        "7. CF-1: privacy sheet + demo script + access notes",
    ]

for s in cf1_runbook():
    print(s)
print("demo_cmd: python -m demo_n1_dashboard --synthetic")
print("demo_writes_course_progress", False)`,
          output: `1. setup: python -m venv .venv && pip install -r requirements.txt
2. load synthetic fixtures (no real PII)
3. run ER + relationship signals
4. open dashboard scaffold
5. process clerical review queue
6. level-1 regression notes: re-run critical checks S01-S13
7. CF-1: privacy sheet + demo script + access notes
demo_cmd: python -m demo_n1_dashboard --synthetic
demo_writes_course_progress False`,
        },
        why: "Operación N1 completa: la demo evidencia el producto; el gate formal del curso registra el progreso.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios E1/E2/E3 en identidad, relación, decisión y producto/ops. Dos pistas cada uno. Datos sintéticos; español peruano.",
    steps: [
      {
        id: "S13-T1-A-E1",
        subtopicId: "S13-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T1-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `norm_name` y `norm_doc`: casefold, colapsar espacios; doc solo [a-z0-9]. Prueba ' Ana  QUISPE ' y 'D-12.34'. Salida/pass: `ana quispe | d1234`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "re.sub para espacios y no alfanuméricos",
        hints: [
          "re.sub para espacios y no alfanuméricos",
          "casefold no solo lower",
        ],
        edgeCases: ["guiones en doc"],
        tests: "ana quispe / d1234",
        feedback: "Normalización estable es el 80% del ER por reglas.",
        starterCode: {
          language: 'python',
          title: "normalize_ids.py",
          code: `# CASO-LIM-013 · norm name/doc
# DEFECT: no casefold; no strip punctuation en doc
import re
def norm_name(n):
    return n.strip()
def norm_doc(d):
    return d
print(norm_name(" Ana  QUISPE "))
print(norm_doc("D-12.34"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "normalize_ids.py",
          code: `import re
def norm_name(n):
    return re.sub(r"\\s+", " ", n.casefold().strip())
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
print(norm_name(" Ana  QUISPE "))
print(norm_doc("D-12.34"))`,
          output: `ana quispe
d1234`,
        },
      },
      {
        id: "S13-T1-A-E2",
        subtopicId: "S13-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T1-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `blocking_key(rec)` = apellido_paterno|region en casefold (segundo token del nombre; si solo hay un token, usa ese). Nombre 'Luis Huamán Soto', region 'Cusco'. Salida/pass: `huamán|cusco`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Apellido paterno = parts[1] si len(parts)>=2 else parts[0]. No uses el último token (materno).",
        hints: [
          "Apellido paterno = parts[1] si len(parts)>=2 else parts[0]. No uses el último token (materno).",
          "Formato f'{ap}|{region}'",
        ],
        edgeCases: ["un solo token de nombre"],
        tests: "huamán|cusco",
        feedback: "Blocking reduce el espacio de pares antes de reglas finas.",
        starterCode: {
          language: 'python',
          title: "blocking_key.py",
          code: `# CASO-LIM-013 · blocking_key
# DEFECT: usa nombre completo sin apellido|region
def blocking_key(rec):
    return rec["name"]
print(blocking_key({"name": "Luis Huamán Soto", "region": "Cusco"}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "blocking_key.py",
          code: `def blocking_key(rec):
    parts = rec["name"].casefold().split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{rec['region'].casefold()}"
print(blocking_key({"name": "Luis Huamán Soto", "region": "Cusco"}))`,
          output: `huamán|cusco`,
        },
      },
      {
        id: "S13-T1-A-E3",
        subtopicId: "S13-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T1-A. Implementa `er_score(a,b)`: 1.0 si `norm_doc` igual y mismo `blocking_key` (apellido paterno|región); 0.5 si solo el documento coincide (bloques distintos); 0.0 en otro caso. Imprime los tres scores del fixture (A-B, A-C, A-D). Salida/pass: `1.0 0.5 0.0`. Solo stdlib + reglas S01–S13; no inventes evidencia fuera del fixture sintético.",
        hint: "Combina igualdad de doc y block (parts[1] paterno)",
        hints: [
          "Combina igualdad de doc y block (parts[1] paterno)",
          "Scores solo 1.0/0.5/0.0",
        ],
        edgeCases: ["doc match sin block → 0.5"],
        tests: "1.0 0.5 0.0",
        feedback: "Score ER documentado y auditable.",
        starterCode: {
          language: 'python',
          title: "er_score_rules.py",
          code: `# CASO-LIM-013 · er_score
# DEFECT: score siempre 1.0
import re
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
def bkey(r):
    parts = r["name"].casefold().split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{r['region'].casefold()}"
def er_score(a, b):
    return 1.0
A = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
B = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
C = {"name": "Ana Other", "document_id": "X1", "region": "Cusco"}
D = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}
print(er_score(A, B), er_score(A, C), er_score(A, D))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "er_score_rules.py",
          code: `import re
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
def bkey(r):
    parts = r["name"].casefold().split()
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{r['region'].casefold()}"
def er_score(a, b):
    same_doc = norm_doc(a["document_id"]) == norm_doc(b["document_id"])
    same_block = bkey(a) == bkey(b)
    if same_doc and same_block:
        return 1.0
    if same_doc:
        return 0.5
    return 0.0
A = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
B = {"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}
C = {"name": "Ana Other", "document_id": "X1", "region": "Cusco"}
D = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}
print(er_score(A, B), er_score(A, C), er_score(A, D))`,
          output: `1.0 0.5 0.0`,
        },
      },
      {
        id: "S13-T1-B-E1",
        subtopicId: "S13-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T1-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: De tp,fp,fn calcula precision y recall; imprime redondeado a 3 decimales. tp=8,fp=2,fn=2. Salida/pass: `precision 0.8 | recall 0.8`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "precision = tp/(tp+fp)",
        hints: [
          "precision = tp/(tp+fp)",
          "recall = tp/(tp+fn)",
        ],
        edgeCases: ["división por cero: no aplica en este fixture"],
        tests: "0.8 y 0.8",
        feedback: "Métricas simples bastan para gate N1.",
        starterCode: {
          language: 'python',
          title: "precision_recall.py",
          code: `# CASO-LIM-013 · precision/recall
# DEFECT: formulas invertidas
tp, fp, fn = 8, 2, 2
print("precision", round(tp / (tp + fn), 3))
print("recall", round(tp / (tp + fp), 3))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "precision_recall.py",
          code: `tp, fp, fn = 8, 2, 2
print("precision", round(tp / (tp + fp), 3))
print("recall", round(tp / (tp + fn), 3))`,
          output: `precision 0.8
recall 0.8`,
        },
      },
      {
        id: "S13-T1-B-E2",
        subtopicId: "S13-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T1-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `clerical_queue(pairs, low=0.4, high=0.7)` devuelve ids con score en [low, high] inclusive. Salida/pass: `['P2', 'P3']`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "list comprehension con filtro de banda",
        hints: [
          "list comprehension con filtro de banda",
          "Orden estable por id",
        ],
        edgeCases: ["inclusive bounds"],
        tests: "['P2','P3']",
        feedback: "La cola clerical es el human-in-the-loop de ER.",
        starterCode: {
          language: 'python',
          title: "clerical_queue.py",
          code: `# CASO-LIM-013 · clerical queue
# DEFECT: cola = scores altos (accept band)
pairs = [
    {"id": "P1", "score": 0.2},
    {"id": "P2", "score": 0.55},
    {"id": "P3", "score": 0.7},
    {"id": "P4", "score": 0.9},
]
def clerical_queue(pairs, low=0.4, high=0.7):
    return [p["id"] for p in pairs if p["score"] >= high]
print(clerical_queue(pairs))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "clerical_queue.py",
          code: `pairs = [
    {"id": "P1", "score": 0.2},
    {"id": "P2", "score": 0.55},
    {"id": "P3", "score": 0.7},
    {"id": "P4", "score": 0.9},
]
def clerical_queue(pairs, low=0.4, high=0.7):
    return [p["id"] for p in pairs if low <= p["score"] <= high]
print(clerical_queue(pairs))`,
          output: `['P2', 'P3']`,
        },
      },
      {
        id: "S13-T1-B-E3",
        subtopicId: "S13-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T1-B (Familiarity Evidence Dashboard). Entrada: métricas sintéticas del starter (tp=5, fp=1, fn=2). Tarea: calcula precision y recall; arma un dict `report` con `precision`, `recall`, `fp_not_fraud` (texto exacto: 'False positive de matching no es evidencia de delito') y `ops_action` = `needs_review`. Imprime las cuatro líneas en ese orden. Salida/pass: `precision 0.833`, `recall 0.714`, `fp_not_fraud: False positive de matching no es evidencia de delito`, `ops_action: needs_review`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "precision=tp/(tp+fp); recall=tp/(tp+fn); round 3; adjunta límites éticos al mismo report",
        hints: [
          "tp=5,fp=1 → precision 0.833; tp=5,fn=2 → recall 0.714",
          "FP no es auto_fraud: ops_action debe ser needs_review",
        ],
        edgeCases: ["métricas y ética viajan juntas en el mismo artefacto de gate"],
        tests: "precision/recall + texto + needs_review",
        feedback: "El reporte de evaluación une números y límites éticos: un FP no autoriza auto_fraud.",
        starterCode: {
          language: 'python',
          title: "fp_limits.py",
          code: `# CASO-LIM-013 · PR + FP ethics
# DEFECT: no calcula PR; trata FP como fraude
tp, fp, fn = 5, 1, 2
report = {
    "precision": 0.0,
    "recall": 0.0,
    "fp_not_fraud": "False positive implica delito",
    "ops_action": "auto_fraud",
}
print("precision", report["precision"])
print("recall", report["recall"])
print("fp_not_fraud:", report["fp_not_fraud"])
print("ops_action:", report["ops_action"])
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "fp_limits.py",
          code: `tp, fp, fn = 5, 1, 2
report = {
    "precision": round(tp / (tp + fp), 3),
    "recall": round(tp / (tp + fn), 3),
    "fp_not_fraud": "False positive de matching no es evidencia de delito",
    "ops_action": "needs_review",
}
print("precision", report["precision"])
print("recall", report["recall"])
print("fp_not_fraud:", report["fp_not_fraud"])
print("ops_action:", report["ops_action"])`,
          output: `precision 0.833
recall 0.714
fp_not_fraud: False positive de matching no es evidencia de delito
ops_action: needs_review`,
        },
      },
      {
        id: "S13-T2-A-E1",
        subtopicId: "S13-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T2-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `shared_email(a,b)` True si emails casefold iguales y no vacíos. Salida/pass: `True | False | False`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "a and b and a.casefold()==b.casefold()",
        hints: [
          "a and b and a.casefold()==b.casefold()",
          "'' no cuenta como shared",
        ],
        edgeCases: ["vacío False"],
        tests: "True False False",
        feedback: "Shared contact es señal fuerte pero no identidad legal.",
        starterCode: {
          language: 'python',
          title: "shared_email.py",
          code: `# CASO-LIM-013 · shared_email
# DEFECT: ''=='' cuenta como shared
def shared_email(a, b):
    return a == b
print(shared_email("Ana@Example.com", "ana@example.com"))
print(shared_email("", ""))
print(shared_email("a@x.com", "b@x.com"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "shared_email.py",
          code: `def shared_email(a, b):
    if not a or not b:
        return False
    return a.casefold() == b.casefold()
print(shared_email("Ana@Example.com", "ana@example.com"))
print(shared_email("", ""))
print(shared_email("a@x.com", "b@x.com"))`,
          output: `True
False
False`,
        },
      },
      {
        id: "S13-T2-A-E2",
        subtopicId: "S13-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T2-A (Familiarity Evidence Dashboard). Variante de práctica (sin teléfono): `rel_score(km, surname_jaccard)` = 0.6*(1 if km<=2 else 0)+0.4*jaccard; round 3. El canónico N1 de teoría es 0.5/0.3/0.2 con tres señales; aquí practicas solo geo+apellido con el mismo umbral inclusivo km≤2.0. Salida/pass: `0.8 | 0.2`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Variante: 0.6 geo + 0.4 apellido (no es el canónico de 3 señales); geo si km<=2",
        hints: [
          "Variante: 0.6 geo + 0.4 apellido (no es el canónico de 3 señales); geo si km<=2",
          "km=1.2, j=0.5 → 0.8",
        ],
        edgeCases: ["km lejos anula geo; km=2.0 sigue contando como geo_close"],
        tests: "0.8 y 0.2",
        feedback: "Pesos documentados permiten auditar el score de relación.",
        starterCode: {
          language: 'python',
          title: "combine_signals.py",
          code: `# CASO-LIM-013 · rel_score
# DEFECT: ignora km; solo surname
def rel_score(km, surname_jaccard):
    return round(surname_jaccard, 3)
print(rel_score(1.2, 0.5))
print(rel_score(5.0, 0.5))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "combine_signals.py",
          code: `def rel_score(km, surname_jaccard):
    geo = 1.0 if km <= 2 else 0.0
    return round(0.6 * geo + 0.4 * surname_jaccard, 3)
print(rel_score(1.2, 0.5))
print(rel_score(5.0, 0.5))`,
          output: `0.8
0.2`,
        },
      },
      {
        id: "S13-T2-A-E3",
        subtopicId: "S13-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T2-A (Familiarity Evidence Dashboard). Tarea: calcula un score de relación con la fórmula canónica N1 (0.5 phone + 0.3 geo + 0.2 surname_match binario) sobre el fixture sintético del starter; arma un dict de ficha con `relationship_signal_score` y `disclaimer` (texto exacto: 'relationship_signal_score no implica parentesco ni colusión'). Imprime score y disclaimer en dos líneas. Salida/pass: `score 1.0` y `disclaimer relationship_signal_score no implica parentesco ni colusión`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Calcula rel con 0.5/0.3/0.2; adjunta disclaimer al dict; no infieras parentesco",
        hints: [
          "phone=geo=surname=1.0 → rel 1.0 con pesos canónicos",
          "Texto exacto del disclaimer para tests de portfolio",
        ],
        edgeCases: ["disclaimer UI debe viajar junto al score, no reemplazarlo"],
        tests: "score 1.0 + frase exacta de disclaimer",
        feedback: "Score calculado + disclaimer adjunto: el revisor ve número y límite ético juntos.",
        starterCode: {
          language: 'python',
          title: "disclaimer.py",
          code: `# CASO-LIM-013 · score + no kinship claim
# DEFECT: hardcodea score y afirma parentesco
phone, geo, surname = 1.0, 1.0, 1.0
rel = 0.0  # debe ser 0.5*phone + 0.3*geo + 0.2*surname
card = {
    "relationship_signal_score": rel,
    "disclaimer": "relationship_signal_score implica parentesco legal",
}
print("score", card["relationship_signal_score"])
print("disclaimer", card["disclaimer"])
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "disclaimer.py",
          code: `phone, geo, surname = 1.0, 1.0, 1.0
rel = round(0.5 * phone + 0.3 * geo + 0.2 * surname, 3)
card = {
    "relationship_signal_score": rel,
    "disclaimer": "relationship_signal_score no implica parentesco ni colusión",
}
print("score", card["relationship_signal_score"])
print("disclaimer", card["disclaimer"])`,
          output: `score 1.0
disclaimer relationship_signal_score no implica parentesco ni colusión`,
        },
      },
      {
        id: "S13-T2-B-E1",
        subtopicId: "S13-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T2-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `direct_txs(txs, a, b)` lista montos de transferencias directas entre a y b (cualquier dirección). Salida/pass: `[10, 5]`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "set equality de endpoints",
        hints: [
          "set equality de endpoints",
          "Orden de aparición",
        ],
        edgeCases: ["bidireccional"],
        tests: "[10, 5]",
        feedback: "Txs directas son RelationshipEvidence tipo direct_tx.",
        starterCode: {
          language: 'python',
          title: "direct_txs.py",
          code: `# CASO-LIM-013 · direct_txs
# DEFECT: solo dirección A→B
txs = [("A","B",10), ("C","D",1), ("B","A",5)]
def direct_txs(txs, a, b):
    return [m for x, y, m in txs if x == a and y == b]
print(direct_txs(txs, "A", "B"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "direct_txs.py",
          code: `txs = [("A","B",10), ("C","D",1), ("B","A",5)]
def direct_txs(txs, a, b):
    return [m for x, y, m in txs if {x, y} == {a, b}]
print(direct_txs(txs, "A", "B"))`,
          output: `[10, 5]`,
        },
      },
      {
        id: "S13-T2-B-E2",
        subtopicId: "S13-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T2-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: `common_counterparties(txs, a, c)` devuelve sorted set de nodos que transan con ambos. Salida/pass: `['D']`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Intersección de vecinos",
        hints: [
          "Intersección de vecinos",
          "Excluye a y c de la salida si aparecen",
        ],
        edgeCases: ["solo D común"],
        tests: "['D']",
        feedback: "Top-k se obtiene ordenando por conteo; aquí k=all del set.",
        starterCode: {
          language: 'python',
          title: "common_cp.py",
          code: `# CASO-LIM-013 · common counterparties
# DEFECT: unión en vez de intersección
txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]
def neighbors(txs, node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
def common_counterparties(txs, a, c):
    return sorted(neighbors(txs, a) | neighbors(txs, c))
print(common_counterparties(txs, "A", "C"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "common_cp.py",
          code: `txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]
def neighbors(txs, node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
def common_counterparties(txs, a, c):
    return sorted(neighbors(txs, a) & neighbors(txs, c))
print(common_counterparties(txs, "A", "C"))`,
          output: `['D']`,
        },
      },
      {
        id: "S13-T2-B-E3",
        subtopicId: "S13-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T2-B (Familiarity Evidence Dashboard). Tarea: a partir del graphlet del starter, calcula la contraparte común A∩C (`via`); arma un dict de evidencia con `type='common_counterparty'`, `via`, y campos `no_collusion` / `no_kinship` (textos exactos de la solution). Imprime `via`, luego las dos líneas de disclaimer. Salida/pass: `via ['D']`, `no_collusion: contraparte común no prueba acuerdo ilícito` y `no_kinship: contraparte común no prueba parentesco`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Calcula via con intersección de vecinos; adjunta disclaimers al dict de evidencia",
        hints: [
          "neighbors(A) & neighbors(C) → via; no hardcodees colusión",
          "Textos exactos: 'no prueba acuerdo ilícito' / 'no prueba parentesco'",
        ],
        edgeCases: ["evidencia de grafo y límites de inferencia viajan juntos"],
        tests: "via ['D'] + dos disclaimers",
        feedback: "El revisor ve la traza (via) y el límite ético en el mismo objeto de evidencia.",
        starterCode: {
          language: 'python',
          title: "no_infer.py",
          code: `# CASO-LIM-013 · graphlet evidence + ethics
# DEFECT: via hardcodeado mal; afirma colusión y parentesco
txs = [("A", "D", 1), ("C", "D", 1), ("A", "E", 1), ("C", "F", 1)]
def neighbors(node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
via = sorted(neighbors("A") & neighbors("B"))  # DEFECT: debe ser A y C
evidence = {
    "type": "common_counterparty",
    "via": via,
    "no_collusion": "contraparte común prueba acuerdo ilícito",
    "no_kinship": "contraparte común prueba parentesco",
}
print("via", evidence["via"])
print("no_collusion:", evidence["no_collusion"])
print("no_kinship:", evidence["no_kinship"])
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "no_infer.py",
          code: `txs = [("A", "D", 1), ("C", "D", 1), ("A", "E", 1), ("C", "F", 1)]
def neighbors(node):
    s = set()
    for x, y, _ in txs:
        if x == node:
            s.add(y)
        if y == node:
            s.add(x)
    return s
via = sorted(neighbors("A") & neighbors("C"))
evidence = {
    "type": "common_counterparty",
    "via": via,
    "no_collusion": "contraparte común no prueba acuerdo ilícito",
    "no_kinship": "contraparte común no prueba parentesco",
}
print("via", evidence["via"])
print("no_collusion:", evidence["no_collusion"])
print("no_kinship:", evidence["no_kinship"])`,
          output: `via ['D']
no_collusion: contraparte común no prueba acuerdo ilícito
no_kinship: contraparte común no prueba parentesco`,
        },
      },
      {
        id: "S13-T3-A-E1",
        subtopicId: "S13-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: `explanation_bullets(er, rel, missing)` devuelve lista de 3 strings formateados. Salida/pass: `['entity_resolution_score=0.9', 'relationship_signal_score=0.4', \"missing=['phone']\"]`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "f-strings con los tres inputs",
        hints: [
          "f-strings con los tres inputs",
          "missing puede ser lista",
        ],
        edgeCases: ["3 bullets"],
        tests: "lista len 3",
        feedback: "Plantilla reutilizable en la ficha de caso.",
        starterCode: {
          language: 'python',
          title: "explain_template.py",
          code: `# CASO-LIM-013 · explanation bullets
# DEFECT: omite missing
def explanation_bullets(er, rel, missing):
    return [f"entity_resolution_score={er}", f"relationship_signal_score={rel}"]
print(explanation_bullets(0.9, 0.4, ["phone"]))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "explain_template.py",
          code: `def explanation_bullets(er, rel, missing):
    return [
        f"entity_resolution_score={er}",
        f"relationship_signal_score={rel}",
        f"missing={missing}",
    ]
print(explanation_bullets(0.9, 0.4, ["phone"]))`,
          output: `['entity_resolution_score=0.9', 'relationship_signal_score=0.4', "missing=['phone']"]`,
        },
      },
      {
        id: "S13-T3-A-E2",
        subtopicId: "S13-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: `uncertainty_band(missing, conflict)` → high si conflict o len(missing)>=2; med si missing; low si no. Salida/pass: `low | med | high | high`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Orden de ifs: conflict primero",
        hints: [
          "Orden de ifs: conflict primero",
          "missing=[] conflict=False → low",
        ],
        edgeCases: ["conflict fuerza high"],
        tests: "low med high high",
        feedback: "Incertidumbre honestifica el evidence_score.",
        starterCode: {
          language: 'python',
          title: "uncertainty.py",
          code: `# CASO-LIM-013 · uncertainty_band
# DEFECT: siempre low
def uncertainty_band(missing, conflict):
    return "low"
print(uncertainty_band([], False))
print(uncertainty_band(["email"], False))
print(uncertainty_band(["email", "phone"], False))
print(uncertainty_band([], True))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "uncertainty.py",
          code: `def uncertainty_band(missing, conflict):
    if conflict or len(missing) >= 2:
        return "high"
    if missing:
        return "med"
    return "low"
print(uncertainty_band([], False))
print(uncertainty_band(["email"], False))
print(uncertainty_band(["email", "phone"], False))
print(uncertainty_band([], True))`,
          output: `low
med
high
high`,
        },
      },
      {
        id: "S13-T3-A-E3",
        subtopicId: "S13-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: caso conflictivo er=0.9 rel=0.1: imprime evidence_score ponderado 0.6/0.4, uncertainty high si abs(er-rel)>0.5, y note 'señales conflictivas'. Salida/pass: `evidence_score 0.58`, `uncertainty high`, `note señales conflictivas`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "abs(er-rel)>0.5 → conflict",
        hints: [
          "abs(er-rel)>0.5 → conflict",
          "No maquilles el score",
        ],
        edgeCases: ["conflicto honesto"],
        tests: "score 0.58 high",
        feedback: "Explicación honesta > score cosmético.",
        starterCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `# CASO-LIM-013 · conflict signals
# DEFECT: no detecta conflicto er vs rel
er, rel = 0.9, 0.1
score = round(0.6 * er + 0.4 * rel, 3)
print("evidence_score", score)
print("uncertainty", "low")
print("note", "ok")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "conflict_case.py",
          code: `er, rel = 0.9, 0.1
score = round(0.6 * er + 0.4 * rel, 3)
conflict = abs(er - rel) > 0.5
print("evidence_score", score)
print("uncertainty", "high" if conflict else "low")
print("note", "señales conflictivas")`,
          output: `evidence_score 0.58
uncertainty high
note señales conflictivas`,
        },
      },
      {
        id: "S13-T3-B-E1",
        subtopicId: "S13-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T3-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: config dict thresholds: review_low=0.4 y accept_min=0.8. Imprime sorted items; no dejes un hueco entre review y accept. Salida/pass: `[('accept_min', 0.8), ('review_low', 0.4)]`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Dos límites forman tres intervalos contiguos",
        hints: [
          "Dos límites forman tres intervalos contiguos",
          "Usarás el dict en E2",
        ],
        edgeCases: ["review_low < accept_min", "config externalizable"],
        tests: "Contrato exacto: sorted items es [('accept_min', 0.8), ('review_low', 0.4)]; assert 0 <= review_low < accept_min <= 1.",
        feedback: "Umbrales fuera de código mágico facilitan auditoría.",
        starterCode: {
          language: 'python',
          title: "thresholds_cfg.py",
          code: `# CASO-LIM-013 · thresholds order
# DEFECT: review_low > accept_min
thresholds = {
    "accept_min": 0.4,
    "review_low": 0.8,
}
assert 0 <= thresholds["review_low"] < thresholds["accept_min"] <= 1
print(sorted(thresholds.items()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "thresholds_cfg.py",
          code: `thresholds = {
    "accept_min": 0.8,
    "review_low": 0.4,
}
assert 0 <= thresholds["review_low"] < thresholds["accept_min"] <= 1
print(sorted(thresholds.items()))`,
          output: `[('accept_min', 0.8), ('review_low', 0.4)]`,
        },
      },
      {
        id: "S13-T3-B-E2",
        subtopicId: "S13-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T3-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter con thresholds `review_low=0.4` y `accept_min=0.8`. Tarea: implementa `decide_ops_status(score, unc, th)` con matriz total y sin huecos: input inválido (tipo, bool, no finito, fuera de [0,1], unc ∉ {low,med,high}) → `invalid_input`; unc `high` → `needs_review`; score < review_low → `abstain`; score < accept_min → `needs_review`; resto → `accept_pair`. Imprime cada fila del loop del starter. Sin labels `auto_fraud`/`is_family`. Salida/pass: las 7 líneas del solution. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Valida tipo/isfinite/unc antes de comparar umbrales; high unc gana sobre score alto",
        hints: [
          "Valida tipo, bool, isfinite, rango 0..1 y unc low|med|high antes de comparar",
          "Orden: invalid → high → abstain → needs_review → accept_pair",
        ],
        edgeCases: ["0.4", "0.8", "NaN", "bool", "unc desconocida", "high unc → review"],
        tests: "Matriz exacta: -0.1 invalid_input; 0.399 abstain; 0.4 y 0.799 needs_review; 0.8 accept_pair (low); 0.9/high needs_review; NaN invalid_input.",
        feedback: "Estados operativos de par, no veredictos legales.",
        starterCode: {
          language: 'python',
          title: "decide_ops.py",
          code: `# CASO-LIM-013 · decide_ops_status
# DEFECT: high unc → accept_pair; no valida nan
from math import isfinite

th = {"accept_min": 0.8, "review_low": 0.4}
def decide_ops_status(score, unc, th):
    if score >= th["accept_min"]:
        return "accept_pair"
    if score >= th["review_low"]:
        return "needs_review"
    return "abstain"
for s, u in [(-0.1, "low"), (0.399, "low"), (0.4, "low"), (0.799, "med"), (0.8, "low"), (0.9, "high"), (float("nan"), "low")]:
    print(s, u, decide_ops_status(s, u, th))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "decide_ops.py",
          code: `from math import isfinite

th = {"accept_min": 0.8, "review_low": 0.4}
def decide_ops_status(score, unc, th):
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return "invalid_input"
    if not isfinite(score) or not 0.0 <= score <= 1.0 or unc not in {"low", "med", "high"}:
        return "invalid_input"
    if unc == "high":
        return "needs_review"
    if score < th["review_low"]:
        return "abstain"
    if score < th["accept_min"]:
        return "needs_review"
    return "accept_pair"
for s, u in [(-0.1, "low"), (0.399, "low"), (0.4, "low"), (0.799, "med"), (0.8, "low"), (0.9, "high"), (float("nan"), "low")]:
    print(s, u, decide_ops_status(s, u, th))`,
          output: `-0.1 low invalid_input
0.399 low abstain
0.4 low needs_review
0.799 med needs_review
0.8 low accept_pair
0.9 high needs_review
nan low invalid_input`,
        },
      },
      {
        id: "S13-T3-B-E3",
        subtopicId: "S13-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T3-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: auditoría: dado un dict de campos de salida, elimina claves is_family y auto_fraud si existen; imprime sorted keys restantes. Salida/pass: `['score', 'status']`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "pop o dict comprehension",
        hints: [
          "pop o dict comprehension",
          "No dejes rastros de esas claves",
        ],
        edgeCases: ["strip policy fields"],
        tests: "['score','status']",
        feedback: "Auditoría de paths prohibidos es requisito de política N1.",
        starterCode: {
          language: 'python',
          title: "audit_strip.py",
          code: `# CASO-LIM-013 · strip forbidden keys
# DEFECT: deja is_family y auto_fraud
out = {"status": "needs_review", "is_family": True, "auto_fraud": True, "score": 0.5}
clean = dict(out)
print(sorted(clean.keys()))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "audit_strip.py",
          code: `out = {"status": "needs_review", "is_family": True, "auto_fraud": True, "score": 0.5}
forbidden = {"is_family", "auto_fraud"}
clean = {k: v for k, v in out.items() if k not in forbidden}
print(sorted(clean.keys()))`,
          output: `['score', 'status']`,
        },
      },
      {
        id: "S13-T4-A-E1",
        subtopicId: "S13-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T4-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `pseudonymize('Ana Quispe Rojas')` → 'A*** Q*** R***'. Salida/pass: `A*** Q*** R***`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "primer char + *** por token",
        hints: [
          "primer char + *** por token",
          "split por espacios",
        ],
        edgeCases: ["multi token"],
        tests: "A*** Q*** R***",
        feedback: "Vista pseudonimizada reduce exposición en demos.",
        starterCode: {
          language: 'python',
          title: "pseudo_names.py",
          code: `# CASO-LIM-013 · pseudonymize
# DEFECT: devuelve nombre completo
def pseudonymize(name):
    return name
print(pseudonymize("Ana Quispe Rojas"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "pseudo_names.py",
          code: `def pseudonymize(name):
    return " ".join(p[0] + "***" for p in name.split() if p)
print(pseudonymize("Ana Quispe Rojas"))`,
          output: `A*** Q*** R***`,
        },
      },
      {
        id: "S13-T4-A-E2",
        subtopicId: "S13-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T4-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: `case_sheet(er, rel)` dict con ambos scores (claves `entity_resolution_score` y `relationship_signal_score`); imprime sheet. Salida/pass: `{'entity_resolution_score': 0.9, 'relationship_signal_score': 0.4}`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Claves entity_resolution_score y relationship_signal_score",
        hints: [
          "Claves entity_resolution_score y relationship_signal_score",
          "No fusionar en un solo score sin etiqueta",
        ],
        edgeCases: ["scores separados"],
        tests: "dos claves distintas",
        feedback: "La ficha educa al revisor sobre dos constructos distintos.",
        starterCode: {
          language: 'python',
          title: "case_sheet.py",
          code: `# CASO-LIM-013 · case_sheet
# DEFECT: claves wrong names
def case_sheet(er, rel):
    return {"er": er, "rel": rel, "is_family": er > 0.5}
print(case_sheet(0.9, 0.4))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "case_sheet.py",
          code: `def case_sheet(er, rel):
    return {
        "entity_resolution_score": er,
        "relationship_signal_score": rel,
    }
print(case_sheet(0.9, 0.4))`,
          output: `{'entity_resolution_score': 0.9, 'relationship_signal_score': 0.4}`,
        },
      },
      {
        id: "S13-T4-A-E3",
        subtopicId: "S13-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T4-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: `map_tooltip(lat, lon, km, source)` string con coords y geoseñal trazable (conecta mapa con provenance S12). Salida/pass: `lat=-12.04,lon=-77.04,geo_distance_km=1.2,source=mock`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Incluye source=",
        hints: [
          "Incluye source=",
          "Formato legible una línea",
        ],
        edgeCases: ["trazabilidad"],
        tests: "source=mock en tooltip",
        feedback: "Tooltip trazable conecta mapa con provenance S12.",
        starterCode: {
          language: 'python',
          title: "map_tooltip.py",
          code: `# CASO-LIM-013 · map_tooltip
# DEFECT: omite source y km
def map_tooltip(lat, lon, km, source):
    return f"lat={lat},lon={lon}"
print(map_tooltip(-12.04, -77.04, 1.2, "mock"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "map_tooltip.py",
          code: `def map_tooltip(lat, lon, km, source):
    return f"lat={lat},lon={lon},geo_distance_km={km},source={source}"
print(map_tooltip(-12.04, -77.04, 1.2, "mock"))`,
          output: `lat=-12.04,lon=-77.04,geo_distance_km=1.2,source=mock`,
        },
      },
      {
        id: "S13-T4-B-E1",
        subtopicId: "S13-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T4-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: completa privacy sheet dict: data_class=synthetic_only, pii_real=False, roles=['viewer','reviewer']. Imprime sorted keys y el valor de pii_real. Salida/pass: `['data_class', 'pii_real', 'roles']` y `False`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Tres campos mínimos CF-1",
        hints: [
          "Tres campos mínimos CF-1",
          "pii_real debe ser False",
        ],
        edgeCases: ["CF-1 privacy"],
        tests: "keys + False",
        feedback: "Privacy sheet es artefacto CF-1 obligatorio.",
        starterCode: {
          language: 'python',
          title: "privacy_sheet.py",
          code: `# CASO-LIM-013 · privacy flags
# DEFECT: pii_real True
privacy = {
    "data_class": "production",
    "pii_real": True,
    "roles": ["viewer", "reviewer"],
}
print(sorted(privacy.keys()))
print(privacy["pii_real"])
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "privacy_sheet.py",
          code: `privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "roles": ["viewer", "reviewer"],
}
print(sorted(privacy.keys()))
print(privacy["pii_real"])`,
          output: `['data_class', 'pii_real', 'roles']
False`,
        },
      },
      {
        id: "S13-T4-B-E2",
        subtopicId: "S13-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S13-T4-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `demo_command()` devuelve 'python -m demo_n1_dashboard --synthetic'. Salida/pass: `python -m demo_n1_dashboard --synthetic`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "String fijo documentado en runbook",
        hints: [
          "String fijo documentado en runbook",
          "Un comando para reproducir",
        ],
        edgeCases: ["reproducibilidad"],
        tests: "comando único",
        feedback: "Demo de un comando reduce fricción de revisión de nivel.",
        starterCode: {
          language: 'python',
          title: "demo_cmd.py",
          code: `# CASO-LIM-013 · demo command
# DEFECT: comando sin --synthetic
def demo_command():
    return "python -m demo_n1_dashboard --live-pii"
print(demo_command())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "demo_cmd.py",
          code: `def demo_command():
    return "python -m demo_n1_dashboard --synthetic"
print(demo_command())`,
          output: `python -m demo_n1_dashboard --synthetic`,
        },
      },
      {
        id: "S13-T4-B-E3",
        subtopicId: "S13-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S13-T4-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x). Tarea: runbook de incidente PII en log: lista de 3 acciones rotate_secret, redact_logs, postmortem; imprime joined por '|'. Segundo print: nota de level-1 regression. Salida/pass: `rotate_secret|redact_logs|postmortem` y `level1_regression: re-check S01-S13 critical paths after incident`. Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
        hint: "Orden fijo de respuesta",
        hints: [
          "Orden fijo de respuesta",
          "También menciona level-1 regression en un segundo print",
        ],
        edgeCases: ["incidente + regresión"],
        tests: "3 acciones + nota regresión",
        feedback: "Incidente y regresión level-1 forman parte del cierre N1.",
        starterCode: {
          language: 'python',
          title: "incident_runbook.py",
          code: `# CASO-LIM-013 · incident actions
# DEFECT: omite rotate_secret
actions = ["ignore", "continue"]
print("|".join(actions))
print("level1_regression: skip")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "incident_runbook.py",
          code: `actions = ["rotate_secret", "redact_logs", "postmortem"]
print("|".join(actions))
print("level1_regression: re-check S01-S13 critical paths after incident")`,
          output: `rotate_secret|redact_logs|postmortem
level1_regression: re-check S01-S13 critical paths after incident`,
        },
      },
    ],
  },
  youDo: {
    title: "Familiarity Evidence Dashboard — cierre CP-N1-C + regresión nivel 1 + CF-1",
    context:
      "Cierras el **Familiarity Evidence Dashboard (CP-N1-C)**: ER determinista por reglas, `entity_resolution_score` **separado** de `relationship_signal_score`, geoseñal trazable, fichas pseudonimizadas, umbrales de revisión/abstención **sin** parentesco/fraude automático. **Antes de este You Do:** completa al menos un E1+E2+E3 de T1 (identidad), T2 (relación) y T3 (decisión); el starter reutiliza esos contratos con DEFECTOS intencionales que debes corregir. Incluye **notas de regresión de nivel 1 (S01–S13)**: en ~30 min re-ejecuta los checks críticos listados en `LEVEL1_REGRESSION_MATRIX` sobre fixtures sintéticos y registra pass/fail en el runbook; el bloque de producto (dashboard + privacy) es aparte. Entrega artefactos **CF-1** (privacy sheet, acceso, tests, demo de un comando). Esta entrega documenta evidencia CF-1 y la regresión N1; no inventes un flag de 'aprobado' dentro del código.",
    objectives: [
      "Pipeline normalize → blocking → entity_resolution_score",
      "Precision/recall + cola clerical sobre pares sintéticos",
      "relationship_signal_score (shared contact, geo, apellidos, txs) separado del ER",
      "Ficha con uncertainty + explicación; decide_ops_status sin auto_fraud/is_family",
      "Matriz de estados exhaustiva con límites 0.40/0.80 e invalid_input",
      "Dashboard scaffold 3 casos + mapa/tooltips",
      "Privacy sheet + demo cmd + runbook de incidente",
      "Level-1 regression notes: checklist S01–S13 en runbook de entrega",
    ],
    requirements: [
      "Datos 100% sintéticos; vista pseudonimizada",
      "ER score y relationship score nunca colapsados en un solo campo sin etiquetar",
      "Prohibido is_family / auto_fraud en salidas",
      "Tests de reglas ER, señales y umbrales en verde",
      "Decision matrix exacta: invalid_input, abstain, needs_review y accept_pair sin intervalos vacíos",
      "Demo: python -m demo_n1_dashboard --synthetic",
      "Runbook con regresión level-1 (S01–S13) y respuesta a PII en log",
      "CF-1: privacy sheet + roles viewer/reviewer + notes de acceso",
    ],
    starterCode: `"""familiarity_dashboard.py — CP-N1-C close + CF-1 + level-1 regression notes
S13. Datos sintéticos. Sin auto parentesco/fraude.

Orden sugerido (ruta verde local):
1) Corrige DEFECT en norm_doc + blocking_key (apellido paterno parts[1]|region)
2) Corrige er_score (1.0 / 0.5 / 0.0) y relationship_signal_score (0.5/0.3/0.2)
3) Corrige decide_ops_status hasta que las 9 filas de DECISION_MATRIX pasen
4) Corrige pseudonymize; privacy_sheet y level1_regression_notes ya están listos
Luego: main() imprime er/rel, decision_matrix_ok y artefactos CF-1.
Pair de demo esperado tras correcciones: er=1.0, rel=1.0, pseudo='A*** Q***'.
"""

from __future__ import annotations

import re
from math import isfinite


DECISION_MATRIX = [
    {"score": -0.1, "uncertainty": "low", "expected": "invalid_input"},
    {"score": 0.399, "uncertainty": "low", "expected": "abstain"},
    {"score": 0.4, "uncertainty": "low", "expected": "needs_review"},
    {"score": 0.799, "uncertainty": "med", "expected": "needs_review"},
    {"score": 0.8, "uncertainty": "low", "expected": "accept_pair"},
    {"score": 1.0, "uncertainty": "low", "expected": "accept_pair"},
    {"score": 0.9, "uncertainty": "high", "expected": "needs_review"},
    {"score": float("nan"), "uncertainty": "low", "expected": "invalid_input"},
    {"score": 0.8, "uncertainty": "?", "expected": "invalid_input"},
]

LEVEL1_REGRESSION_MATRIX = [
    {"section": "S01", "check": "python version + venv + exit code reproducible"},
    {"section": "S02", "check": "Decimal desde texto y raw/clean/errors"},
    {"section": "S03", "check": "reglas de validación cubren normal/borde/error"},
    {"section": "S04", "check": "iteración conserva conteos y acumuladores"},
    {"section": "S05", "check": "funciones respetan firma, retorno y errores"},
    {"section": "S06", "check": "colecciones no comparten estado mutable"},
    {"section": "S07", "check": "Unicode/email/teléfono cumplen contrato exacto"},
    {"section": "S08", "check": "CSV+JSON reconcilian por fuente y Decimal"},
    {"section": "S09", "check": "excepciones encadenan causa y logs no filtran PII"},
    {"section": "S10", "check": "paquete instala; CLI 0/1/2; config precedence"},
    {"section": "S11", "check": "entity_id estable; Decimal/currency/evidence invariants"},
    {"section": "S12", "check": "timeout/retry, SQL params y egress policy"},
    {"section": "S13", "check": "ER != relationship; decision matrix; no auto verdicts"},
]


def norm_doc(d: str) -> str:
    # DEFECT: no casefold y no elimina guiones/puntos — D-1 y d1 deben unificarse
    return d.strip()


def blocking_key(rec: dict) -> str:
    # DEFECT: usa el último token (materno) en vez del paterno parts[1]
    parts = rec["name"].casefold().split()
    ap = parts[-1] if parts else ""
    return f"{ap}|{rec['region'].casefold()}"


def er_score(a: dict, b: dict) -> float:
    # DEFECT: siempre 1.0 — debe ser 1.0 solo si same doc+block; 0.5 same doc only; else 0.0
    return 1.0


def relationship_signal_score(a: dict, b: dict) -> float:
    # DEFECT: suma pesos mal (0.4*n_signals) — usa canónico 0.5 phone + 0.3 geo + 0.2 surname
    n = 0
    if a.get("phone") and a.get("phone") == b.get("phone"):
        n += 1
    if a.get("km") is not None and b.get("km") is not None and a["km"] == b["km"] and a["km"] <= 2.0:
        n += 1
    if a.get("name") and b.get("name"):
        # surname token overlap simplificado: primer apellido si hay ≥2 tokens
        pa = a["name"].casefold().split()
        pb = b["name"].casefold().split()
        if len(pa) >= 2 and len(pb) >= 2 and pa[1] == pb[1]:
            n += 1
    return min(1.0, 0.4 * n)


def decide_ops_status(score: float, uncertainty: str) -> str:
    # DEFECT: no valida input; mezcla umbrales; nunca devuelve invalid_input
    if uncertainty == "high":
        return "needs_review"
    if score < 0.5:
        return "abstain"
    if score < 0.9:
        return "needs_review"
    return "accept_pair"


def pseudonymize(name: str) -> str:
    # DEFECT: devuelve el nombre completo — debe ser primer char + *** por token
    return name


def privacy_sheet() -> dict:
    return {
        "data_class": "synthetic_only",
        "pii_real": False,
        "roles": ["viewer", "reviewer"],
    }


def level1_regression_notes() -> list[str]:
    """Una fila verificable por sección para el runbook de entrega N1."""
    return ["%s: %s" % (row["section"], row["check"]) for row in LEVEL1_REGRESSION_MATRIX]


def main() -> None:
    a = {"name": "Ana Quispe", "document_id": "D-1", "region": "Lima", "phone": "900", "km": 1.0}
    b = {"name": "ANA QUISPE", "document_id": "d1", "region": "Lima", "phone": "900", "km": 1.0}
    print("pseudo", pseudonymize(a["name"]))
    print("er", er_score(a, b))
    print("rel", relationship_signal_score(a, b))
    for row in DECISION_MATRIX:
        got = decide_ops_status(row["score"], row["uncertainty"])
        assert got == row["expected"], (row, got)
    print("decision_matrix_ok", True)
    print("privacy", privacy_sheet())
    print("decision_cases", len(DECISION_MATRIX))
    print("regression_notes", level1_regression_notes())


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Portfolio N1: captura del dashboard con 3 casos, ficha con ER≠REL, privacy sheet, salida del demo command y sección **Level-1 regression** del runbook (S01–S13). No declares el nivel cerrado hasta completar el proceso de gate del curso con la evidencia pedida.",
    rubric: [
      { criterion: "ER determinista: fixtures publicados producen métricas y cola clerical reproducibles", weight: "20%" },
      { criterion: "ER y relationship_signal_score quedan separados, explicados y sin claims legales", weight: "20%" },
      { criterion: "Las 9 filas de DECISION_MATRIX pasan exactamente; no existen auto_fraud/is_family", weight: "20%" },
      { criterion: "Los 3 casos del dashboard están pseudonimizados; ficha y mapa no exponen PII raw", weight: "15%" },
      { criterion: "CF-1 incluye privacy/access/tests/demo/runbook y 13 filas S01–S13 con pass/fail+evidencia", weight: "25%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "entity_resolution_score y relationship_signal_score deben…",
        options: ["Mantenerse separados en la ficha de caso", "Fusionarse siempre en un solo número sin etiqueta", "Reemplazarse por is_family", "Ocultarse al revisor"],
        correctIndex: 0,
        explanation:
          "Son constructos distintos; la UI y el modelo los muestran aparte.",
      },
      {
        question: "Un false positive de ER implica…",
        options: ["Fraude confirmado", "Parentesco automático", "Error de matching; no es veredicto legal de fraude", "Borrar la cola clerical"],
        correctIndex: 2,
        explanation:
          "FP es error de identidad estimada, no delito.",
      },
      {
        question: "En zona gris de score el sistema debe…",
        options: ["Marcar auto_fraud=true", "Setear is_family", "Publicar PII real en el mapa", "Encolar needs_review / abstenerse según política"],
        correctIndex: 3,
        explanation:
          "Human-in-the-loop: revisión o abstención, nunca fraude auto.",
      },
      {
        question: "CF-1 en S13 incluye…",
        options: ["Solo un modelo de deep learning", "Privacy sheet, acceso, tests, demo y runbook", "Hardcodear tokens en el repo", "Omitir la privacy sheet si el demo corre"],
        correctIndex: 1,
        explanation:
          "Artefactos de operación y privacidad del cierre N1.",
      },
      {
        question: "Level-1 regression notes en el You Do exigen…",
        options: ["Re-chequear paths críticos S01–S13 y documentarlos en el runbook de entrega", "Ignorar S01–S12", "Borrar el dashboard", "Enviar PII a geocoder público"],
        correctIndex: 0,
        explanation:
          "La regresión de nivel se documenta en el runbook de entrega N1.",
      },
      {
        question: "Si score=0.4 y uncertainty=low, decide_ops_status debe devolver…",
        options: ["abstain", "accept_pair", "needs_review", "auto_fraud"],
        correctIndex: 2,
        explanation:
          "score < 0.8 y >= 0.4 cae en needs_review; abstain es solo score < 0.4.",
      },
      {
        question: "Blocking en N1 sirve para…",
        options: ["Inferir parentesco automáticamente", "Enviar PII a un geocoder público", "Fusionar ER y relationship en un solo score", "Reducir pares candidatos antes de reglas finas"],
        correctIndex: 3,
        explanation:
          "Blocking acota el espacio de comparación; no es veredicto legal.",
      },
      {
        question: "Con TP=5, FP=1, FN=2, precision y recall redondeados a 3 decimales son…",
        options: ["precision 0.714 y recall 0.833", "precision 0.833 y recall 0.714", "precision 1.0 y recall 1.0", "precision 0.5 y recall 0.5"],
        correctIndex: 1,
        explanation:
          "precision = 5/(5+1) ≈ 0.833; recall = 5/(5+2) ≈ 0.714. No inviertas numerador/denominador.",
      },
      {
        question: "En nombres peruanos sintéticos N1, el token de blocking de apellido es…",
        options: ["El segundo token (paterno) si hay al menos dos; si no, el único token", "Siempre el último token (materno)", "La concatenación de todos los apellidos sin región", "El email en casefold"],
        correctIndex: 0,
        explanation:
          "parts[1] = apellido paterno; documenta la regla y no la mezcles con «último token».",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "re — Regular expression operations",
        url: "https://docs.python.org/3/library/re.html",
        note: "Normalización de docs/nombres",
      },
      {
        label: "sqlite3 — SQLite databases",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "Almacén local de evidencias (S12)",
      },
      {
        label: "json — JSON encoder and decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "Export determinista de fichas",
      },
      {
        label: "math — isfinite",
        url: "https://docs.python.org/3/library/math.html",
        note: "Validar scores finitos en umbrales",
      },
      {
        label: "statistics — precision/recall helpers",
        url: "https://docs.python.org/3/library/statistics.html",
        note: "Agregados simples si evalúas batches",
      },
      {
        label: "NIST — Digital Identity Guidelines",
        url: "https://pages.nist.gov/800-63-3/",
        note: "Identidad vs prueba; no sobreclaim en ER",
      },
    ],
    books: [
      {
        label: "Data Matching (Peter Christen) — conceptos",
        note: "Blocking y evaluación; solo reglas deterministas en N1.",
      },
      {
        label: "Practical Data Ethics (selecciones)",
        note: "Límites de inferencia y revisión humana.",
      },
    ],
    courses: [
      {
        label: "PyArcana live — Familiarity Evidence Dashboard",
        url: "https://pillb.github.io/pyarcana/",
        note: "Sección en vivo: Familiarity Evidence Dashboard y cierre N1.",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Fundamentos de datos/strings reutilizados en normalización.",
      },
      {
        label: "MIT 6.100L — Intro CS Python",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Estructuras y pruebas de lógica.",
      },
      {
        label: "GitHub — PillB/pyarcana",
        url: "https://github.com/PillB/pyarcana",
        note: "Repo del curso; entrega CP-N1-C local sintética.",
      },
      {
        label: "Awesome Python Learning",
        url: "https://github.com/skupriienko/Awesome-Python-Learning",
        note: "Mapa de recursos complementarios.",
      },
    ],
  },
}
