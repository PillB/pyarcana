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
    "En equipos de datos de banca, telco o fintech en Perú, el cuello de botella no es «tener un modelo»: es saber si dos registros hablan de la misma persona y, por separado, si hay señales de familiaridad operativa, todo sin inventar parentesco ni fraude. Aquí aprendes a entregar un dashboard de evidencia con entity resolution determinista, scores separados, fichas pseudonimizadas y cola de revisión humana. Quien logra eso se vuelve confiable en la mesa de riesgo y deja un portfolio defendible.",
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
        "Aquí cierras **CP-N1-C** (el gate práctico del Nivel 1) con un **Familiarity Evidence Dashboard**: entity resolution por reglas —esto es, decidir si dos filas hablan de la misma persona—, señales de relación **separadas** del score ER, explicación humana y operación responsable. La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores; en N1 el producto es la ficha de evidencia auditable que un revisor puede leer en cinco minutos.",
        "Promoción de nivel: tres capstones N1, **regresión S01–S13 (level-1)** y **CF-1** aprobados. Solo datos sintéticos pseudonimizados (`C00x`, Lima/Arequipa). Si falta evidencia o el schema no cuadra, **falla cerrado** — no auto-merge, no `auto_fraud`. Stack: stdlib + reglas deterministas de S01–S12; **sin** sklearn ni NumPy/Pandas de S14–S15.",
        "Desde **S12** ya traes HTTP con timeout/retry, SQL parametrizado y geoseñal con política de egress (solo ciudad/mock, sin PII cruda a geocoders públicos). En S13 esos ladrillos alimentan **tooltips del mapa** y la ficha: `geo_distance_km=…; source=mock`. No reaprendes el adapter: lo **conectas** a la vista de evidencia.",
        "Orden de estudio: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático.",
        "**Diccionario de la sección:**",
        "- *entity resolution (ER)*: decide si dos filas hablan de la misma entidad; no de parentesco ni fraude.",
        "- *blocking*: acota pares candidatos antes de reglas finas.",
        "- *cola clerical*: la bandeja humana de duda.",
        "- *fail-closed*: niega el merge si falta evidencia.",
        "- *uncertainty* (`low`/`med`/`high`): declara qué tan confiable es el score.",
        "- *CP-N1-C*: el gate práctico de cierre del Nivel 1; pide dashboard, regresión S01–S13 y CF-1.",
        "- *CF-1*: el paquete de privacidad + demo + runbook del cierre de nivel.",
        "**Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio.",
      ],
      callout: {
        type: "info",
        title: "Enfoque de esta sección",
        content:
          "El objetivo de S13 es el dashboard de evidencia + cierre N1. Solo datos sintéticos; nunca PII real; nunca auto_fraud/is_family. Primero la identidad, luego la relación, luego la decisión y, al final, el producto.",
      },
    },
    {
      heading: "Normalización, blocking y entity resolution",
      subtopicId: "S13-T1-A",
      paragraphs: [
        "**Ancla:** entity resolution (ER) responde *¿es la misma entidad en dos filas?* No responde *¿son familia?* ni *¿hay fraude?* Esas preguntas se tratan con otros scores y con humanos. Sin normalización, `D-12.34` y `d1234` parecen identidades distintas aunque son el mismo documento sintético: por eso casefold (pasar todo a minúsculas) y limpieza de no-alfanuméricos van **antes** de cualquier comparación.",
        "**Mecanismo — blocking:** el producto cartesiano de *N* registros es *N×N* pares (todas las combinaciones posibles); con miles de filas es inviable revisarlos a mano. **Blocking** (apellido paterno + región) acota el espacio: solo corres reglas finas dentro del mismo bloque. En nombres peruanos sintéticos del curso: con `Nombre ApellidoPaterno ApellidoMaterno`, toma el **segundo** token (`parts[1]`, el apellido paterno); si solo hay un token, usa ese. Ejemplo: `Luis Huamán Soto` + Cusco → `huamán|cusco`. Documenta la regla en el memo y **no** mezcles «último token» (materno) con «paterno» en el mismo pipeline.",
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
        "**Ancla:** sin etiquetas no sabes si tu regla de ER ayuda o daña. Con pares **sintéticos** etiquetados calculas **TP** (dijiste match y era match), **FP** (dijiste match y no lo era) y **FN** (era match y lo dejaste pasar). De ahí: precision = TP/(TP+FP) y recall = TP/(TP+FN). La etiqueta es ground truth (verdad de referencia) de *identidad en el fixture del curso* — **no** es un veredicto legal sobre personas reales.",
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
        "**Ancla:** el score de **relación** responde *¿hay indicios de familiaridad operativa entre dos entidades?* (contacto compartido, cercanía, apellido). **No** responde *¿son parientes?* ni *¿hay colusión?* Esas inferencias quedan fuera de N1 y de la UI automática. Cada señal es un booleano o parcial con traza legible: `shared_phone` (teléfono compartido), `geo_close` (cercanía geográfica), `surname_jaccard` (similitud de apellidos).",
        "**Mecanismo — fórmula canónica N1:** `rel = 0.5*shared_phone + 0.3*geo_close + 0.2*surname_jaccard` (pesos fijos en el memo del curso). La distancia de par es **bilateral**: ambos registros deben reportar el mismo `km` sintético y `km ≤ 2.0` (reutiliza la geoseñal de S12). En ejercicios de práctica puedes usar una **variante** (p. ej. solo geo+apellido 0.6/0.4) **si** la consigna del ejercicio lo declara; no inventes una tercera fórmula sin etiquetarla.",
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
          "Prohibido establecer `is_family` automáticamente en N1. Canónico N1: rel = 0.5*phone + 0.3*geo + 0.2*jaccard.",
      },
    },
    {
      heading: "Transacciones directas y contrapartes comunes",
      subtopicId: "S13-T2-B",
      paragraphs: [
        "**Ancla:** transacciones directas A↔B y **contrapartes comunes** (A y C pagan a D) son evidencia de **relación operativa** en el grafo sintético — no de colusión, lavado ni cartel. El revisor ve *quién pagó a quién* en la ficha; el producto **organiza evidencia** y **nunca** acusa.",
        "**Mecanismo:** modela un graphlet simple (lista de triples emisor–receptor–monto) y emite objetos con `type` (`direct_tx`, `common_counterparty`) y traza (`n` de txs, clave `via` para la contraparte compartida — no `shared`). Reutiliza el espíritu de `RelationshipEvidence` de S11: dato + ids + explicación, **sin** método `is_collusion()` ni score de «riesgo cartel».",
        "**Caso trabajado:** A↔B con 2 txs y A, C→D → lista `[{type: direct_tx, … n:2}, {type: common_counterparty, via:['D']}]` y `collusion_claim=False` fijo en el demo. El disclaimer en UI y runbook es obligatorio: *common counterparty ≠ collusion claim*.",
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
        "**Ancla:** la ficha de caso es el artefacto que lee un humano. No basta con un número: necesitas **tres salidas que viajan juntas** — `evidence_score` (score de evidencia), banda de **incertidumbre** (`low`/`med`/`high`) y **bullets** legibles (viñetas con la traza del cálculo). Si no puedes listar al menos tres bullets honestos (qué inputs usaste y qué falta), **no publiques** el score en la UI.",
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
        "**Ancla:** el dashboard no «decide culpables». Decide **qué hacer con un par de evidencia**: invalidar entrada (`invalid_input`), abstenerse (`abstain`), encolar revisión (`needs_review`) o aceptar el par de identidad (`accept_pair`). Matriz **total y sin huecos** (todo score finito en [0,1] y toda uncertainty conocida cae en exactamente un estado). **Nunca** `auto_fraud=true` ni `is_family=true`.",
        "**Mecanismo (orden de evaluación):** la función `decide_ops_status(score, uncertainty)` recorre cinco reglas en orden y devuelve el primer estado que aplica:",
        "| # | Condición | Estado |",
        "|---|-----------|--------|",
        "| 1 | score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} | `invalid_input` |",
        "| 2 | uncertainty = `high` (aunque el score sea 0.95) | `needs_review` |",
        "| 3 | score < 0.40 | `abstain` |",
        "| 4 | score < 0.80 | `needs_review` |",
        "| 5 | resto | `accept_pair` |",
        "Los límites **0.40** y **0.80** son exactos. Ejemplos: 0.399 → `abstain`; 0.4 → `needs_review`; 0.799 → `needs_review`; 0.8 con uncertainty distinta de high → `accept_pair`. No «aproximes» 0.799 a `accept_pair`.",
        "**Human-in-the-loop** (un humano revisa la duda): la acción es de **datos** (revisar / aceptar par / abstenerse), no veredicto legal, no KYC automático (verificación de identidad del cliente) y no «lista negra» de personas. El revisor ve la ficha (ER, REL, bullets, uncertainty) y elige; el código solo clasifica el par.",
        "**Borde y auditoría de portfolio:** busca con `grep` (la herramienta de búsqueda en texto del repo) y elimina cualquier path que establezca `is_family` o `auto_fraud`. Las 9 filas de `DECISION_MATRIX` del You Do deben pasar con asserts exactos y **siempre** `auto_fraud=False` en la salida del demo. Si queda un hueco numérico entre umbrales, el gate de N1 no cierra.",
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
        "**Ancla de producto:** el gate de N1 no pide un design system (sistema visual completo) ni Streamlit (framework de UI de secciones futuras). Pide un **scaffold auditable** —un andamiaje mínimo que se puede revisar—: tres fichas + puntos de mapa con coords sintéticas (Lima/Arequipa) y tooltips de geoseñal **trazable** (`geo_distance_km=…; source=mock`). Un revisor debe poder abrir la vista y entender cada caso en cinco minutos.",
        "**Mecanismo de privacidad en UI:** **pseudonimiza** nombres (por ejemplo `A*** Q***`). Reutiliza la política de egress de S12 (egress es lo que sale del sistema): no mandes PII cruda (datos personales identificables) a un geocoder público (servicio de coordenadas). La ficha muestra `entity_resolution_score` **y** `relationship_signal_score` en campos **separados**. Si los mezclas en un solo número sin etiqueta, rompes el gate ético: el revisor ya no sabe si «0.7» es identidad o familiaridad operativa.",
        "**Casos trabajados (mínimo tres):**",
        "- **CASE-1** `A*** Q***` — ER 0.92, REL 0.41: identidad fuerte, relación moderada.",
        "- **CASE-2** `L*** H***` — ER medio, REL más alto: el revisor ve la tensión **sin** autoetiqueta de parentesco.",
        "- **CASE-3** `M*** R***` — ER 0.77, REL 0.22: banda de duda / cola clerical.",
        "Los tres aparecen en el demo I Do y en el scaffold de teoría.",
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
        "**Ancla CF-1:** sin operación documentada, el dashboard es un prototipo de laptop, no un cierre de nivel. La **privacy sheet** —la hoja de privacidad del cierre— fija clase de datos `synthetic_only`, retención local, sin egress de PII a geocoders públicos (política S12), y roles mínimos `viewer` / `reviewer` (lectura / revisión). Documenta qué se guarda, quién ve la ficha y qué **no** sale del entorno de demo. Sin esta hoja, CF-1 no cierra aunque el score «se vea bonito».",
        "**Mecanismo de entrega:** (1) **tests en verde** (pruebas automáticas que pasan sin fallos) de ER, señales y umbrales; (2) **demo de un comando** (`python -m demo_n1_dashboard --synthetic`); (3) **runbook** (manual de operación) con setup + playbook de incidente (token o nombre en log → `rotate_secret` / `redact_logs` / post mortem). Un compañero en máquina limpia debe poder reproducir la demo con el mismo fixture sintético.",
        "**Regresión level-1 y carga cognitiva:** artefactos CF-1 + checklist **S01–S13** cierran el nivel. En ~30 min re-ejecuta solo los checks críticos de `LEVEL1_REGRESSION_MATRIX` y anota pass/fail. El bloque de producto (dashboard + privacy) es aparte: no intentes rehacer todos los capstones en una sola noche.",
        "**Borde de gate:** tu entrega **documenta evidencia** del producto N1; el progreso del curso se registra por el proceso de gate formal (la revisión humana del portafolio), no por un flag dentro del script de demo. La demo no escribe «aprobado» en ningún ledger (registro interno): solo prueba que el producto corre y es auditable.",
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
print("demo_cmd", "python -m demo_n1_dashboard --synthetic")
print("runbook", runbook_steps())
print("incident", incident_actions())
print("level1_regression", "S01-S13 checklist required")`,
        output: `privacy {'data_class': 'synthetic_only', 'pii_real': False, 'egress_public_geocoder': 'city_address_only', 'roles': ['viewer', 'reviewer']}
demo_cmd python -m demo_n1_dashboard --synthetic
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
    intro:
      "Ocho demos del cierre N1 — uno por subtema, en el mismo orden T1→T4. Observa el código, córrelo y compara la salida: **cada print debe ser reproducible** (sin teatro, esto es, sin líneas que el código no produce). En los demos cubres ER por reglas, evaluación con precision/recall y cola clerical. También modelas señales de relación con la fórmula canónica 0.5/0.3/0.2 y un graphlet (un mini-grafo de transacciones). Para cerrar, ficha con uncertainty, umbrales sin `auto_fraud`, scaffold de 3 casos y runbook con regresión level-1. Después de cada demo, el We Do del mismo subtema te pide arreglar un **DEFECT** —un defecto intencional que debes corregir— del mismo contrato. Ese es el puente I Do → We Do antes del You Do del portfolio.",
    steps: [
      {
        demoId: "S13-T1-A-DEMO",
        subtopicId: "S13-T1-A",
        environment: "local-python",
        description: "Emparejar dos registros sintéticos: doc normalizado + bloque paterno|región",
        preamble:
          "En la mesa de onboarding sintético, la primera pregunta es *¿son la misma persona en dos filas?*, no *¿son familia?*. Observa cómo `norm_doc` unifica `D-7788` y `d7788`, y cómo `block_key` toma el **segundo** token del nombre + región. No escribas aún: predice `block`, `match` y el score antes de mirar la salida. Solo datos sintéticos; stdlib.",
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
        why: "Las reglas deterministas son auditables: un revisor puede recalcular el score a mano. Blocking (paterno|región) acota pares antes de reglas finas; el `entity_resolution_score` no se mezcla con señales de relación — viajan en campos separados en la ficha.",
        retrospective:
          "Si puedes explicar por qué `D-7788` y `d7788` son el mismo doc sin mirar el código, ya tienes el hábito de normalizar antes de comparar. El error clásico es usar el apellido materno (último token) como bloque. En We Do arreglarás `norm_*`, `blocking_key` y el score 1.0/0.5/0.0.",
      },
      {
        demoId: "S13-T1-B-DEMO",
        subtopicId: "S13-T1-B",
        environment: "local-python",
        description: "Evaluar 20 pares etiquetados sintéticos; listar 3 para revisión humana por score en duda.",
        preamble:
          "Sin etiquetas sintéticas no sabes si tu regla de ER ayuda o daña. Esta demo arma 20 pares con seed fijo, calcula precision/recall y lista la **cola clerical** (scores en [0.4, 0.7]). Observa que precision alta no borra los FN, y que la banda gris va a humano — no a auto-merge. Predice la cola antes de leer la salida.",
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
        why: "Métricas + cola clerical cierran el loop de calidad de ER. Un FP es colisión de matching, no fraude; la banda intermedia nunca auto-mergea. En crédito/compliance priorizas precision y empujas la duda al humano.",
        retrospective:
          "Si puedes decir por qué un score 0.55 no debe auto-aceptarse, ya internalizaste human-in-the-loop. Un FP es colisión de matching, no delito. Pregunta de auto-chequeo: ¿precision 1.0 borra los FN de la cola? We Do: formulas precision/recall, cola inclusive y reporte ético `fp_not_fraud`.",
      },
      {
        demoId: "S13-T2-A-DEMO",
        subtopicId: "S13-T2-A",
        environment: "local-python",
        description: "Señales phone + geo + surname y score de relación sin veredicto de parentesco",
        preamble:
          "La segunda pregunta del dashboard es *¿hay indicios de familiaridad operativa?*, no *¿son parientes?*. Sigue cómo se arman las señales (teléfono compartido, km≤2 bilateral, apellido) y el peso canónico 0.5/0.3/0.2. Observa `kinship_verdict=None` al final: el producto **no** cierra parentesco. Predice el score antes de la salida.",
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
        why: "La lista de señales es la traza legible de la ficha: pesos fijos del memo N1 (0.5/0.3/0.2). Si falta km, fail-closed (geo=0), no inventes distancia. El score de relación nunca autoriza `is_family=true`.",
        retrospective:
          "Si puedes listar las tres señales sin mirar el código, ya tienes traza legible. We Do: email compartido sin vacíos, variante geo+apellido, y disclaimer adjunto al score.",
      },
      {
        demoId: "S13-T2-B-DEMO",
        subtopicId: "S13-T2-B",
        environment: "local-python",
        description: "Grafo simple A↔B y contraparte común D → lista RelationshipEvidence.",
        preamble:
          "En el grafo sintético de txs, el producto **organiza evidencia** (quién pagó a quién) y **nunca** acusa de colusión. Observa el graphlet: arista directa A–B y contraparte común D entre A y C. Predice la lista de objetos y el flag `collusion_claim False`. Sin redes ni sklearn; solo listas de triples.",
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
        why: "Graphlet mínimo con disclaimers operativos: reutiliza el espíritu de RelationshipEvidence de S11. El campo `via` nombra la contraparte compartida sin ambigüedad; `collusion_claim` queda en False de forma fija.",
        retrospective:
          "Si puedes decir por qué common counterparty no prueba cartel, ya internalizaste el límite de N1. We Do: txs bidireccionales, intersección de vecinos y disclaimers de no colusión/no parentesco.",
      },
      {
        demoId: "S13-T3-A-DEMO",
        subtopicId: "S13-T3-A",
        environment: "local-python",
        description: "Ficha con score, uncertainty low/med/high y 3 bullets de por qué.",
        preamble:
          "La ficha de caso es lo que lee un humano en cinco minutos. Observa la combinación 0.6·ER + 0.4·REL, la banda de uncertainty (falta `email` → med) y los tres bullets. No escribas aún: predice si el gap |0.88−0.45| dispara high (no: el umbral es >0.5). Solo stdlib; sin maquillar el score.",
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
        why: "Tres salidas viajan juntas: evidence_score, uncertainty y bullets. Si faltan campos, elevas uncertainty (fail-closed); no inventes un email «promedio». Un score sin bullets es teatro, no evidencia.",
        retrospective:
          "Si puedes recalcular 0.708 a mano y decir por qué falta `email` pone uncertainty en med (no high), confías en la ficha. El error clásico es esconder missing o maquillar el score. We Do: plantilla de tres bullets, bandas low/med/high y caso conflictivo ER vs REL sin cosméticos.",
      },
      {
        demoId: "S13-T3-B-DEMO",
        subtopicId: "S13-T3-B",
        environment: "local-python",
        description: "Scores en zona gris → status=needs_review; nunca auto_fraud=true.",
        preamble:
          "El dashboard no decide culpables: clasifica el **par de evidencia** (invalidar, abstenerse, revisar, aceptar par). Sigue el orden: input inválido → high unc → abstain <0.4 → review <0.8 → accept. Observa que 0.85 con high **no** acepta, y que NaN es `invalid_input`. Predice cada línea; nunca `auto_fraud`/`is_family` true.",
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
        why: "Política de abstención y revisión protege al estudiante y al usuario final. Los límites 0.40 y 0.80 son exactos; la matriz es total (sin huecos). Estados de par de datos, no veredictos legales ni lista negra.",
        retrospective:
          "Si puedes explicar por qué 0.4 es review y 0.399 abstain, ya tienes el contrato de umbrales. We Do: config externalizable, `decide_ops_status` completo y strip de claves prohibidas.",
      },
      {
        demoId: "S13-T4-A-DEMO",
        subtopicId: "S13-T4-A",
        environment: "local-python",
        description: "Scaffold de 3 casos sintéticos pseudonimizados listos para dashboard/mapa.",
        preamble:
          "El gate de producto N1 no pide un design system: pide **tres fichas** + puntos de mapa sintéticos con scores **etiquetados**. Observa CASE-1/2/3: ER y REL viajan separados; el nombre se muestra como `A*** Q***`. Predice los tres prints. Sin geocoder público ni PII real.",
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
        why: "Producto mínimo auditable: tres casos + mapa. Fusionar ER y REL en un solo número sin etiqueta rompe el gate ético — el revisor ya no sabe si «0.7» es identidad o familiaridad operativa.",
        retrospective:
          "Si puedes decir qué historia cuenta CASE-2 (ER medio, REL alto) sin autoetiqueta de parentesco, ya lees la ficha como revisor. We Do: pseudonimizar, case_sheet con claves canónicas y tooltip con `source=`.",
      },
      {
        demoId: "S13-T4-B-DEMO",
        subtopicId: "S13-T4-B",
        environment: "local-python",
        description: "Runbook: setup → load synthetic → run ER → open dashboard → review queue (+ regresión N1).",
        preamble:
          "Sin operación documentada, el dashboard es un prototipo de laptop, no un cierre de nivel. Observa el runbook: setup, fixtures sintéticos, ER+señales, dashboard, cola, regresión S01–S13 y artefactos CF-1. Nota el comando de un solo shot y que la demo **no** escribe «aprobado» en el ledger del curso. Predice las líneas finales.",
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
        why: "CF-1 = privacy sheet + demo de un comando + runbook. La regresión level-1 (S01–S13) se anota en ~30 min. La demo evidencia el producto; el gate formal del curso es un proceso aparte y no se escribe desde el script.",
        retrospective:
          "Si puedes listar los artefactos CF-1 sin mirar el código, ya sabes qué entregar. We Do: privacy sheet, demo command sintético y playbook de incidente + nota de regresión.",
      },
    ],
  },
  weDo: {
    intro:
      "Andamiaje decreciente por subtema: **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, ids `S13-T*-E*`). Cada starter —el código inicial que recibes— trae **un DEFECT** (un defecto intencional que debes corregir): no reescribas el fixture; corrígelo hasta que la salida/pass coincida. Orden recomendado: cierra T1 (identidad) antes de T2 (relación), luego T3 (decisión) y T4 (producto/ops + CF-1). Los demos del I Do ya modelaron el contrato canónico (blocking paterno `parts[1]`, rel 0.5/0.3/0.2, umbrales 0.40/0.80); aquí lo practicas con fixtures sintéticos. Dos pistas por ejercicio; mira la solución solo si te trabas. Al final, el You Do ensambla el dashboard completo y la regresión N1.",
    steps: [
      {
        id: "S13-T1-A-E1",
        subtopicId: "S13-T1-A",
        kind: "guided",
        title: "Normalizar nombre y documento sintético",
        preamble:
          "- **Contexto:** en el pipeline de ER del dashboard, sin normalización ` Ana  QUISPE ` y `D-12.34` no se unen a su par.\n- **Meta:** implementar `norm_name` y `norm_doc` estables (casefold, espacios, solo alfanuméricos en doc).\n- **Éxito:** dos líneas — `ana quispe` y `d1234`.\n- **Límites:** solo stdlib + `re`; no borres el fixture; sin PII real.",
        instruction:
          "1. Abre el starter: `norm_name` solo hace `strip`; `norm_doc` devuelve el string crudo — ese es el DEFECT.\n2. En nombre: `casefold`, colapsa espacios con `re.sub`.\n3. En doc: `casefold` y deja solo `[a-z0-9]`.\n4. Imprime las dos salidas (sin texto extra que tape el valor).",
        hint: "re.sub para espacios y no alfanuméricos",
        hints: [
          "re.sub para espacios y no alfanuméricos",
          "casefold no solo lower",
        ],
        edgeCases: ["guiones en doc"],
        tests: "ana quispe / d1234",
        feedback:
          "Si `D-12.34` y `d1234` siguen distintos, la normalización no limpia puntuación o no hace casefold. Sin esta base, el score ER miente aunque el blocking sea correcto.",
        retrospective:
          "Normalizar *antes* de comparar es el 80 % del ER por reglas: casefold + colapsar espacios + doc solo alfanumérico. El error clásico es `strip` solo o dejar `D-12.34` «bonito». El mismo hábito aplica a emails y teléfonos en T2. Siguiente: armar la clave de blocking paterno|región.",
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
        title: "Blocking key paterno y región",
        preamble:
          "- **Contexto:** el producto cartesiano de pares es inviable; blocking acota candidatos en el fixture sintético.\n- **Meta:** construir `apellido_paterno|region` en casefold (segundo token; si hay uno solo, ese).\n- **Éxito:** una línea `huamán|cusco` para `Luis Huamán Soto` / Cusco.\n- **Límites:** no uses el último token (materno); solo stdlib; no inventes tokens.",
        instruction:
          "1. El starter devuelve `rec[\"name\"]` crudo — corrige a clave de bloque.\n2. Parte el nombre en casefold; toma `parts[1]` si hay ≥2 tokens.\n3. Concatena con `region` en casefold y `|`.\n4. Imprime solo la clave.",
        hint: "Apellido paterno = parts[1] si len(parts)>=2 else parts[0]. No uses el último token (materno).",
        hints: [
          "Apellido paterno = parts[1] si len(parts)>=2 else parts[0]. No uses el último token (materno).",
          "Formato f'{ap}|{region}'",
        ],
        edgeCases: ["un solo token de nombre"],
        tests: "huamán|cusco",
        feedback:
          "Si la salida es el nombre completo o `soto|cusco`, estás usando el string crudo o el materno (último token). En nombres sintéticos N1 el paterno es el **segundo** token; sin casefold en región tampoco matcheas el fixture de la demo.",
        retrospective:
          "Blocking no es veredicto de identidad: solo reduce el espacio de pares. Confundir paterno con materno rompe el contrato N1 del memo y desalineas el dashboard con el I Do. Pregunta de auto-chequeo: ¿qué clave sale con un solo token de nombre? Siguiente: combinar doc + bloque en score 1.0/0.5/0.0.",
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
        title: "Score ER 1.0, 0.5 o 0.0",
        preamble:
          "- **Contexto:** en la ficha del dashboard el revisor necesita un `entity_resolution_score` auditable, no un «siempre match».\n- **Meta:** implementar `er_score(a,b)` con el contrato N1: doc+block → 1.0; solo doc → 0.5; resto → 0.0.\n- **Éxito:** tres números en una línea — `1.0 0.5 0.0` (pares A-B, A-C, A-D del fixture).\n- **Límites:** solo stdlib; blocking paterno `parts[1]`; no inventes evidencia fuera del fixture.",
        instruction:
          "1. El starter siempre devuelve `1.0` — ese es el DEFECT.\n2. Compara `norm_doc` y `bkey` (ya dados).\n3. Aplica la cascada 1.0 / 0.5 / 0.0.\n4. Imprime los tres scores del fixture sin reescribir los dicts.",
        hint: "Combina igualdad de doc y block (parts[1] paterno)",
        hints: [
          "Combina igualdad de doc y block (parts[1] paterno)",
          "Scores solo 1.0/0.5/0.0",
        ],
        edgeCases: ["doc match sin block → 0.5"],
        tests: "1.0 0.5 0.0",
        feedback:
          "Si los tres pares imprimen `1.0`, no estás mirando `same_doc` y `same_block` por separado. Doc igual + bloque distinto debe ser 0.5 (migración/error de región), no auto-match; doc distinto es 0.0 aunque el nombre se parezca.",
        retrospective:
          "Un score de tres niveles documenta *por qué* un par es dudoso sin inventar parentesco ni fraude. Es identidad estimada en el fixture. En T1-B medirás si la regla ayuda con precision/recall y empujarás la banda gris a la cola clerical.",
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
        title: "Precision y recall sin invertir",
        preamble:
          "- **Contexto:** en el gate N1 reportas si el matching sintético es confiable antes de ensanchar reglas.\n- **Meta:** calcular precision y recall a partir de tp/fp/fn (sin invertir denominadores).\n- **Éxito:** `precision 0.8` y `recall 0.8` con tp=8, fp=2, fn=2.\n- **Límites:** solo stdlib; redondeo a 3 decimales; no uses sklearn.",
        instruction:
          "1. El starter invierte las formulas — ese es el DEFECT.\n2. precision = tp/(tp+fp); recall = tp/(tp+fn).\n3. Imprime con `round(..., 3)` y las etiquetas del solution.\n4. No cambies los conteos del fixture.",
        hint: "precision = tp/(tp+fp)",
        hints: [
          "precision = tp/(tp+fp)",
          "recall = tp/(tp+fn)",
        ],
        edgeCases: ["división por cero: no aplica en este fixture"],
        tests: "0.8 y 0.8",
        feedback:
          "Si precision «baja» al subir FN o recall al subir FP, invertiste los denominadores. Precision castiga falsos match; recall castiga matches perdidos — en alto riesgo sueles priorizar precision y empujar duda a la cola.",
        retrospective:
          "Métricas simples bastan para N1 si son correctas y auditables. El error clásico es confiar en «accuracy alto» sin TP/FP/FN, o invertir denominadores bajo presión. En alto riesgo priorizas precision y empujas duda a la cola. Siguiente: la cola clerical de la banda gris.",
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
        title: "Cola clerical en banda de duda",
        preamble:
          "- **Contexto:** el dashboard no decide solo: la **cola clerical** es la bandeja humana de scores intermedios.\n- **Meta:** devolver ids con score en [0.4, 0.7] **inclusive**.\n- **Éxito:** `['P2', 'P3']` (P1=0.2 fuera; P4=0.9 fuera).\n- **Límites:** no encoles la banda de accept; orden estable del fixture; solo stdlib.",
        instruction:
          "1. El starter encola la banda de accept (`score >= high`) — ese es el DEFECT.\n2. Cambia el filtro a la **banda de duda** inclusiva definida en la meta (low…high).\n3. Conserva el orden de aparición de `pairs`.\n4. Imprime la lista de ids; no borres P1–P4.",
        hint: "list comprehension con filtro de banda",
        hints: [
          "list comprehension con filtro de banda",
          "Orden estable por id",
        ],
        edgeCases: ["inclusive bounds"],
        tests: "['P2','P3']",
        feedback:
          "Si ves `['P4']` o `['P3','P4']`, estás encolando accept o el borde alto mal. Si falta `P3` (0.7), el bound no es inclusive. La cola es para duda humana, no para celebrar scores altos.",
        retrospective:
          "Human-in-the-loop es un **filtro de banda**, no «todo lo alto». Encolar accept desperdicia al revisor; ignorar 0.7 pierde el borde que el humano debe ver. Siguiente: unir métricas y límites éticos en un mismo report (FP ≠ fraude).",
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
        title: "Reporte PR sin convertir FP en fraude",
        preamble:
          "- **Contexto:** un revisor de compliance lee el reporte de evaluación del matching sintético; un FP no es veredicto de delito.\n- **Meta:** calcular precision/recall (tp=5, fp=1, fn=2) y adjuntar disclaimer + `ops_action=needs_review`.\n- **Éxito:** cuatro líneas — precision 0.833, recall 0.714, frase exacta `fp_not_fraud`, y `ops_action: needs_review`.\n- **Límites:** no `auto_fraud`; texto exacto del solution; solo stdlib.",
        instruction:
          "1. El starter deja PR en 0.0 y trata FP como delito — corrige ambos.\n2. Calcula PR con round 3.\n3. Texto exacto: *False positive de matching no es evidencia de delito*.\n4. `ops_action` debe ser `needs_review`, no `auto_fraud`.",
        hint: "precision=tp/(tp+fp); recall=tp/(tp+fn); round 3; adjunta límites éticos al mismo report.",
        hints: [
          "tp=5,fp=1 → precision 0.833; tp=5,fn=2 → recall 0.714",
          "FP no es auto_fraud: ops_action debe ser needs_review.",
        ],
        edgeCases: ["métricas y ética viajan juntas en el mismo artefacto de gate"],
        tests: "precision/recall + texto + needs_review",
        feedback:
          "Si precision/recall siguen en 0.0, no calculaste desde tp/fp/fn. Si `ops_action` queda `auto_fraud` o el texto dice que el FP «implica delito», estás convirtiendo un error de matching en acusación — el harness y el revisor de portfolio lo rechazan.",
        retrospective:
          "El artefacto de gate une **número** y **límite ético** en el mismo reporte. Tratar FP como fraude es el error más grave de N1. Pregunta de auto-chequeo: ¿qué `ops_action` defiendes en la demo si hay un FP? En T2 practicarás señales de relación con el mismo espíritu: señal ≠ parentesco.",
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
        title: "Email compartido sin vacíos",
        preamble:
          "- **Contexto:** en señales de relación, un email igual y no vacío empuja familiaridad operativa en el fixture sintético.\n- **Meta:** `shared_email(a,b)` con casefold y rechazo de strings vacíos.\n- **Éxito:** tres booleanos — `True`, `False`, `False` (match, vacío-vacío, distintos).\n- **Límites:** solo stdlib; `''` no es shared; sin PII real.",
        instruction:
          "1. El starter usa `a == b` y trata `''==''` como True — DEFECT.\n2. Si falta o está vacío cualquiera de los dos, retorna False.\n3. Compara en casefold.\n4. Imprime los tres casos del starter.",
        hint: "a and b and a.casefold()==b.casefold()",
        hints: [
          "a and b and a.casefold()==b.casefold()",
          "'' no cuenta como shared",
        ],
        edgeCases: ["vacío False"],
        tests: "True False False",
        feedback:
          "Dos vacíos iguales no son un contacto real: son ausencia de dato. Si no filtras `''` o no haces casefold, inflas señales (`True` espurio) y engañas la ficha del revisor aunque el email «parezca» match.",
        retrospective:
          "Shared contact es señal fuerte, no identidad legal ni parentesco. El mismo rigor (no inventar True) aplica a teléfono y dirección. Siguiente: combinar geo + apellido con pesos documentados.",
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
        title: "Combinar geo y apellido (variante)",
        preamble:
          "- **Contexto:** en práctica de T2 usas una **variante** geo+apellido (0.6/0.4); el canónico de tres señales queda para la ficha y E3.\n- **Meta:** `rel_score(km, surname_jaccard)` con geo si km≤2.0 inclusive.\n- **Éxito:** `0.8` (km=1.2, j=0.5) y `0.2` (km=5.0, j=0.5).\n- **Límites:** no uses la fórmula de tres señales aquí; documenta pesos; solo stdlib.",
        instruction:
          "1. El starter solo devuelve el jaccard — añade el término geo.\n2. geo = 1.0 si km ≤ 2, si no 0.0.\n3. score = round(0.6*geo + 0.4*jaccard, 3).\n4. Imprime ambos casos del fixture.",
        hint: "Variante: 0.6 geo + 0.4 apellido (no es el canónico de 3 señales); geo si km<=2.",
        hints: [
          "Variante: 0.6 geo + 0.4 apellido (no es el canónico de 3 señales); geo si km<=2.",
          "km=1.2, j=0.5 → 0.8",
        ],
        edgeCases: ["km lejos anula geo; km=2.0 sigue contando como geo_close"],
        tests: "0.8 y 0.2",
        feedback:
          "Si ambos casos imprimen `0.5`, ignoraste km y solo devolviste el jaccard. Si `km=5.0` no baja el score, el término geo no está en cero. Esta es **variante de práctica**, no el canónico 0.5/0.3/0.2 de la ficha.",
        retrospective:
          "Pesos documentados permiten auditar el score; confundir variante de práctica con canónico de producto rompe el memo del curso. El revisor debe poder decir *qué* pesos usaste. Siguiente: score canónico de tres señales + disclaimer de no parentesco.",
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
        title: "Score de relación con disclaimer",
        preamble:
          "- **Contexto:** la ficha de caso muestra `relationship_signal_score` **junto** a un disclaimer; el revisor no debe leer «1.0» como parentesco.\n- **Meta:** calcular rel canónico 0.5·phone + 0.3·geo + 0.2·surname y adjuntar el disclaimer exacto.\n- **Éxito:** `score 1.0` y la frase *relationship_signal_score no implica parentesco ni colusión*.\n- **Límites:** no hardcodees parentesco legal; pesos fijos; solo stdlib.",
        instruction:
          "1. Calcula `rel` con los tres factores del starter (todos 1.0).\n2. Arma el dict de ficha con score y disclaimer.\n3. Texto exacto del solution (tests de portfolio).\n4. Imprime score y disclaimer en dos líneas.",
        hint: "Calcula rel con 0.5/0.3/0.2; adjunta disclaimer al dict; no infieras parentesco.",
        hints: [
          "phone=geo=surname=1.0 → rel 1.0 con pesos canónicos",
          "Texto exacto del disclaimer para tests de portfolio",
        ],
        edgeCases: ["disclaimer UI debe viajar junto al score, no reemplazarlo."],
        tests: "score 1.0 + frase exacta de disclaimer",
        feedback:
          "Score calculado + disclaimer adjunto: el revisor ve número y límite ético juntos. Si el disclaimer afirma parentesco, rompes el gate ético de N1 aunque el score sea correcto.",
        retrospective:
          "Señal ≠ parentesco: si el disclaimer no viaja con el número, la UI miente por omisión. En T2-B el mismo principio aplica a contrapartes comunes y colusión.",
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
        title: "Transferencias directas en ambas direcciones",
        preamble:
          "- **Contexto:** en la ficha de relación operativa, A→B y B→A son la misma evidencia de par.\n- **Meta:** listar montos de txs directas entre a y b sin importar el sentido.\n- **Éxito:** `[10, 5]` sobre el fixture del starter.\n- **Límites:** no inventes txs; conserva orden de aparición; solo stdlib.",
        instruction:
          "1. El filtro `x == a and y == b` es el DEFECT (pierde B→A).\n2. Usa igualdad de conjuntos de endpoints `{x,y} == {a,b}`.\n3. Devuelve los montos en orden del fixture.\n4. Imprime la lista.",
        hint: "set equality de endpoints",
        hints: [
          "set equality de endpoints",
          "Orden de aparición",
        ],
        edgeCases: ["bidireccional"],
        tests: "[10, 5]",
        feedback:
          "Si solo ves `[10]`, estás modelando dirección, no par. La evidencia `direct_tx` es simétrica en N1: A→B y B→A cuentan juntas.",
        retrospective:
          "El patrón de sets de endpoints modela el **par**, no la dirección del wire. El error clásico es filtrar solo A→B y perder B→A en la ficha. Reaparece en tests de grafo y en el You Do. Siguiente: contrapartes comunes por **intersección** de vecinos (no unión).",
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
        title: "Contrapartes comunes por intersección",
        preamble:
          "- **Contexto:** A y C «se tocan» si comparten un nodo D en el grafo sintético de pagos.\n- **Meta:** devolver la lista ordenada de contrapartes comunes (intersección de vecinos).\n- **Éxito:** `['D']` (E y F no son comunes).\n- **Límites:** intersección, no unión; solo stdlib; no inventes nodos.",
        instruction:
          "1. El starter arma un conjunto de vecinos «demasiado amplio» — lee el DEFECT y el resultado esperado.\n2. Reutiliza `neighbors` del starter.\n3. Devuelve solo nodos que son vecinos de **ambos** extremos; ordena con `sorted`.\n4. Imprime el resultado para A y C (no inventes nodos).",
        hint: "Intersección de vecinos",
        hints: [
          "Intersección de vecinos",
          "Excluye a y c de la salida si aparecen",
        ],
        edgeCases: ["solo D común"],
        tests: "['D']",
        feedback:
          "Si la lista incluye E y F, usaste unión (o listaste todo lo tocado por A o C). Intersección responde *quién es puente entre ambos* — ese es el `via` de la ficha. No hardcodees `['D']`.",
        retrospective:
          "Common counterparty es traza operativa, no cartel. El error clásico es unión o hardcodear `via` sin calcular. Pregunta de auto-chequeo: ¿qué imprime si A y C no comparten nodos? Siguiente: adjuntar disclaimers de no colusión/no parentesco al objeto de evidencia.",
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
        title: "Evidencia de grafo sin acusación",
        preamble:
          "- **Contexto:** el revisor ve `via` y debe leer al lado que **no** prueba acuerdo ilícito ni parentesco.\n- **Meta:** calcular `via` = vecinos(A) ∩ vecinos(C) y adjuntar dos disclaimers exactos.\n- **Éxito:** `via ['D']` más las dos frases `no_collusion` / `no_kinship` del solution.\n- **Límites:** no hardcodees colusión; textos exactos; solo stdlib.",
        instruction:
          "1. Corrige `neighbors(\"B\")` → `neighbors(\"C\")`.\n2. Arma el dict `type=common_counterparty` con `via` y disclaimers.\n3. Textos: *no prueba acuerdo ilícito* / *no prueba parentesco*.\n4. Imprime via y las dos líneas de disclaimer.",
        hint: "Calcula via con intersección de vecinos; adjunta disclaimers al dict de evidencia",
        hints: [
          "neighbors(A) & neighbors(C) → via; no hardcodees colusión",
          "Textos exactos: 'no prueba acuerdo ilícito' / 'no prueba parentesco'",
        ],
        edgeCases: ["evidencia de grafo y límites de inferencia viajan juntos"],
        tests: "via ['D'] + dos disclaimers",
        feedback:
          "El revisor ve la traza (`via`) y el límite ético en el mismo objeto. Si afirmas colusión o parentesco, conviertes evidencia operativa en acusación — fuera de N1.",
        retrospective:
          "Evidencia de grafo y límites de inferencia viajan juntos: si solo imprimes `via`, alguien «completa» la acusación. En T3 pasarás a ficha con uncertainty y bullets honestos.",
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
        title: "Tres bullets de explicación de ficha",
        preamble:
          "- **Contexto:** sin bullets el revisor ve un número huérfano en el dashboard.\n- **Meta:** devolver exactamente 3 strings: ER, REL y missing.\n- **Éxito:** lista con `entity_resolution_score=0.9`, `relationship_signal_score=0.4` y `missing=['phone']`.\n- **Límites:** no omitas missing; no inventes campos; solo stdlib.",
        instruction:
          "1. El starter devuelve solo 2 bullets — añade missing.\n2. Usa f-strings con los tres inputs.\n3. No reformatees nombres de claves.\n4. Imprime la lista completa.",
        hint: "f-strings con los tres inputs",
        hints: [
          "f-strings con los tres inputs",
          "missing puede ser lista",
        ],
        edgeCases: ["3 bullets"],
        tests: "lista len 3",
        feedback:
          "Si la lista tiene len 2, omitiste `missing`. El revisor confía en un score incompleto cuando no ve `phone`/`email` ausentes. No reformatees los nombres de claves del f-string.",
        retrospective:
          "Plantilla de tres bullets es reutilizable en el You Do y en el portfolio. El error clásico es esconder missing para «verse más limpio». Siguiente: la banda de uncertainty.",
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
        title: "Banda de incertidumbre low/med/high",
        preamble:
          "- **Contexto:** un evidence_score sin uncertainty engaña al revisor en la cola.\n- **Meta:** `uncertainty_band(missing, conflict)` — high si conflicto o ≥2 missing; med si hay missing; low si no.\n- **Éxito:** cuatro líneas — `low`, `med`, `high`, `high`.\n- **Límites:** conflicto gana aunque missing esté vacío; solo stdlib.",
        instruction:
          "1. Reemplaza el return fijo `\"low\"`.\n2. Implementa la cascada de la meta: conflicto y/o muchos missing elevan la banda; un missing eleva a med; vacío y sin conflicto → low.\n3. Imprime los cuatro casos del starter.\n4. No cambies los argumentos de prueba.",
        hint: "Orden de ifs: conflict primero",
        hints: [
          "Orden de ifs: conflict primero",
          "missing=[] conflict=False → low",
        ],
        edgeCases: ["conflict fuerza high"],
        tests: "low med high high",
        feedback:
          "Si un conflicto queda en low, el orden de ifs está mal o ignoras el flag. Uncertainty high fuerza revisión aunque el número se vea «bonito».",
        retrospective:
          "Incertidumbre es honestidad operativa, no un adorno. El mismo contrato alimenta `decide_ops_status` en T3-B. Siguiente: caso conflictivo ER vs REL sin maquillar el score.",
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
        title: "Conflicto ER vs REL sin maquillaje",
        preamble:
          "- **Contexto:** identidad fuerte y relación muy débil es una **tensión** que el revisor debe ver, no un promedio cosmético.\n- **Meta:** imprimir evidence_score 0.6/0.4, uncertainty high si |er−rel|>0.5, y note `señales conflictivas`.\n- **Éxito:** `evidence_score 0.58`, `uncertainty high`, `note señales conflictivas`.\n- **Límites:** no inventes campos; no suavices el score; solo stdlib.",
        instruction:
          "1. Mantén el cálculo del score del starter.\n2. Detecta conflicto con `abs(er - rel) > 0.5`.\n3. Cambia uncertainty y note según el solution.\n4. Imprime las tres líneas etiquetadas.",
        hint: "abs(er-rel)>0.5 → conflict",
        hints: [
          "abs(er-rel)>0.5 → conflict",
          "No maquilles el score",
        ],
        edgeCases: ["conflicto honesto"],
        tests: "score 0.58 high",
        feedback:
          "Si uncertainty queda en `low` o la note dice `ok`, no detectaste `|er−rel| > 0.5`. El score 0.58 puede «verse normal»; sin high + note de conflicto el revisor no ve la tensión 0.9 vs 0.1.",
        retrospective:
          "Explicación honesta > score cosmético: no suavices hacia 0.5 ni escondas el gap. La ficha debe hacer visible la tensión ER vs REL. En T3-B traducirás score+uncertainty a estados operativos sin `auto_fraud` ni `is_family`.",
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
        title: "Umbrales review_low y accept_min",
        preamble:
          "- **Contexto:** umbrales mágicos enterrados en ifs no se auditan en el portfolio N1.\n- **Meta:** config dict con `review_low=0.4` y `accept_min=0.8` (orden correcto).\n- **Éxito:** `sorted(items)` → `[('accept_min', 0.8), ('review_low', 0.4)]` y assert de orden.\n- **Límites:** review_low < accept_min; sin huecos conceptuales; solo stdlib.",
        instruction:
          "1. El starter tiene los valores intercambiados — DEFECT.\n2. Corrige a accept_min=0.8 y review_low=0.4.\n3. Conserva el assert de orden.\n4. Imprime `sorted(thresholds.items())`.",
        hint: "Dos límites forman tres intervalos contiguos",
        hints: [
          "Dos límites forman tres intervalos contiguos",
          "Usarás el dict en E2",
        ],
        edgeCases: ["review_low < accept_min", "config externalizable"],
        tests: "Contrato exacto: sorted items es [('accept_min', 0.8), ('review_low', 0.4)]; assert 0 <= review_low < accept_min <= 1.",
        feedback:
          "Si `review_low > accept_min`, el assert falla y la matriz queda con huecos o intervalos invertidos. Dos límites bien ordenados forman tres bandas: abstain / review / accept.",
        retrospective:
          "Dos límites forman tres intervalos (abstain / review / accept). Config fuera de «números sueltos» facilita el You Do. Siguiente: implementar la matriz completa con validación de input.",
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
        title: "Matriz decide_ops_status sin huecos",
        preamble:
          "- **Contexto:** el runbook N1 exige que todo score finito y toda uncertainty caigan en **exactamente un** estado operativo.\n- **Meta:** implementar `decide_ops_status(score, unc, th)` con validación, high→review, y umbrales del dict.\n- **Éxito:** las 7 líneas del solution (de invalid_input a nan invalid_input).\n- **Límites:** sin `auto_fraud`/`is_family`; bool no es score válido; solo stdlib + `isfinite`.",
        instruction:
          "1. El starter no valida y prioriza accept — reescribe la cascada.\n2. Orden: invalid (tipo/bool/rango/unc) → high → score < review_low → score < accept_min → accept_pair.\n3. Imprime cada fila del loop del starter.\n4. No cambies `th` ni la lista de casos.",
        hint: "Valida tipo/isfinite/unc antes de comparar umbrales; high unc gana sobre score alto",
        hints: [
          "Valida tipo, bool, isfinite, rango 0..1 y unc low|med|high antes de comparar.",
          "Orden: invalid → high → abstain → needs_review → accept_pair",
        ],
        edgeCases: ["0.4", "0.8", "NaN", "bool", "unc desconocida", "high unc → review"],
        tests: "Matriz exacta: -0.1 invalid_input; 0.399 abstain; 0.4 y 0.799 needs_review; 0.8 accept_pair (low); 0.9/high needs_review; NaN invalid_input.",
        feedback:
          "Si 0.9/high acepta, high no gana sobre el score. Si NaN cae en abstain, falta `isfinite`. Los bordes 0.4 y 0.8 son exactos (`score <` en el código canónico): no «aproximes» 0.799 a accept.",
        retrospective:
          "Estados operativos de par ≠ veredictos legales. Esta función es el corazón del You Do (`DECISION_MATRIX` de 9 filas). Siguiente: auditoría que borra `is_family`/`auto_fraud` de la salida.",
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
        title: "Quitar is_family y auto_fraud de la salida",
        preamble:
          "- **Contexto:** en auditoría de portfolio N1, cualquier path que emita `is_family` o `auto_fraud` cierra mal el gate.\n- **Meta:** limpiar un dict de salida dejando solo claves permitidas.\n- **Éxito:** `['score', 'status']` (sorted keys).\n- **Límites:** elimina ambas claves si existen; no inventes campos; solo stdlib.",
        instruction:
          "1. El starter copia `out` sin filtrar — DEFECT.\n2. Filtra con set de forbidden o `pop`.\n3. Imprime `sorted(clean.keys())`.\n4. No dejes rastros de las claves prohibidas.",
        hint: "pop o dict comprehension",
        hints: [
          "pop o dict comprehension",
          "No dejes rastros de esas claves",
        ],
        edgeCases: ["strip policy fields"],
        tests: "['score','status']",
        feedback:
          "Si `sorted(keys)` aún muestra `is_family` o `auto_fraud`, copiaste el dict sin filtrar. `pop` o un set `forbidden` deben dejar solo lo permitido (`score`, `status` en este fixture). Un status correcto no salva claves prohibidas.",
        retrospective:
          "Política N1 se demuestra en código ejecutable, no solo en el README. El mismo checklist de «grep de portfolio» aparece en el You Do y en CF-1. En T4 pasarás a UI pseudonimizada y artefactos de ops (privacy, demo, incidente).",
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
        title: "Pseudonimizar nombre en la vista",
        preamble:
          "- **Contexto:** en demos y capturas de portfolio, el nombre completo no debe lucir en pantalla.\n- **Meta:** `pseudonymize` → primer carácter + `***` por token.\n- **Éxito:** `A*** Q*** R***` para `Ana Quispe Rojas`.\n- **Límites:** solo stdlib; no inventes un nombre real; no dejes el string crudo.",
        instruction:
          "1. El starter devuelve `name` intacto — DEFECT.\n2. Parte por espacios y transforma cada token.\n3. Une con espacio.\n4. Imprime el resultado.",
        hint: "primer char + *** por token",
        hints: [
          "primer char + *** por token",
          "split por espacios",
        ],
        edgeCases: ["multi token"],
        tests: "A*** Q*** R***",
        feedback:
          "Vista pseudonimizada reduce exposición en capturas de portfolio. Si dejas el nombre completo, la demo viola el contrato de privacidad aunque el score sea correcto.",
        retrospective:
          "Vista pseudonimizada reduce exposición en capturas. El mismo helper alimenta el You Do y CASE-1/2/3. Siguiente: ficha con dos scores etiquetados (no `er`/`rel` opacos ni `is_family`).",
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
        title: "Ficha con ER y REL separados",
        preamble:
          "- **Contexto:** si la UI muestra un solo «0.7» sin etiqueta, el revisor no sabe si es identidad o familiaridad.\n- **Meta:** `case_sheet(er, rel)` con claves canónicas y **sin** `is_family`.\n- **Éxito:** dict exacto con `entity_resolution_score` 0.9 y `relationship_signal_score` 0.4.\n- **Límites:** no fusionar; no añadir veredictos; solo stdlib.",
        instruction:
          "1. Sustituye claves `er`/`rel` por nombres canónicos.\n2. Elimina `is_family`.\n3. Imprime el dict.\n4. No inventes campos extra.",
        hint: "Claves entity_resolution_score y relationship_signal_score",
        hints: [
          "Claves entity_resolution_score y relationship_signal_score",
          "No fusionar en un solo score sin etiqueta",
        ],
        edgeCases: ["scores separados"],
        tests: "dos claves distintas",
        feedback:
          "Claves cortas y un booleano de parentesco son el anti-patrón de producto N1. La ficha educa al revisor solo si los dos scores se leen por separado.",
        retrospective:
          "Dos scores, dos historias: el mismo principio del callout de teoría. En el You Do la ficha y el mapa deben respetarlo. Siguiente: tooltip de mapa con provenance.",
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
        title: "Tooltip de mapa con source",
        preamble:
          "- **Contexto:** el mapa del dashboard hereda la política de egress de S12: geoseñal **trazable**, no PII cruda a geocoders públicos.\n- **Meta:** `map_tooltip(lat, lon, km, source)` en una línea legible.\n- **Éxito:** `lat=-12.04,lon=-77.04,geo_distance_km=1.2,source=mock`.\n- **Límites:** incluye `source=`; no inventes coords reales de domicilio; solo stdlib.",
        instruction:
          "1. Amplía el f-string del starter con km y source.\n2. Formato exacto del solution (orden de campos).\n3. Imprime una sola línea.\n4. No llames APIs externas.",
        hint: "Incluye source=",
        hints: [
          "Incluye source=",
          "Formato legible una línea",
        ],
        edgeCases: ["trazabilidad"],
        tests: "source=mock en tooltip",
        feedback:
          "Si la línea solo tiene lat/lon, faltan `geo_distance_km` y `source`. Sin `source=mock` el revisor no distingue geoseñal de curso de un egress real a geocoder público (política S12).",
        retrospective:
          "Provenance en el tooltip cierra el puente S12→S13: el mapa es auditable, no decorativo. En T4-B cierras el nivel con privacy sheet, demo de un comando y playbook de incidente + regresión S01–S13.",
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
        title: "Privacy sheet: synthetic_only y pii_real",
        preamble:
          "- **Contexto:** CF-1 exige declarar clase de datos y que no hay PII real en el demo N1.\n- **Meta:** dict con `data_class=synthetic_only`, `pii_real=False`, roles viewer/reviewer.\n- **Éxito:** keys ordenadas + `False` en pii_real.\n- **Límites:** no marques production; no roles inventados; solo stdlib.",
        instruction:
          "1. Corrige `data_class` y `pii_real` del starter.\n2. Conserva roles canónicos.\n3. Imprime `sorted(keys)` y el valor de pii_real.\n4. No borres campos del contrato.",
        hint: "Tres campos mínimos CF-1",
        hints: [
          "Tres campos mínimos CF-1",
          "pii_real debe ser False",
        ],
        edgeCases: ["CF-1 privacy"],
        tests: "keys + False",
        feedback:
          "Si imprimes `True` o `data_class` es `production`, no corregiste el DEFECT. CF-1 exige `synthetic_only` + `pii_real=False` + roles viewer/reviewer; un score «bonito» no compensa privacy roto.",
        retrospective:
          "Privacy sheet es artefacto de gate, no un print decorativo. Si `pii_real` queda True, el portfolio N1 se rechaza. Pregunta de auto-chequeo: ¿qué roles listas en el sheet? Siguiente: el comando de demo reproducible con `--synthetic`.",
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
        title: "Demo de un comando sintético",
        preamble:
          "- **Contexto:** el revisor de nivel debe reproducir el producto en máquina limpia con un solo comando.\n- **Meta:** `demo_command()` → string fijo con `--synthetic`.\n- **Éxito:** `python -m demo_n1_dashboard --synthetic`.\n- **Límites:** nunca `--live-pii`; no inventes flags; solo stdlib.",
        instruction:
          "1. Sustituye el flag del starter.\n2. Conserva el módulo `demo_n1_dashboard`.\n3. Imprime el string exacto.\n4. No añadas argumentos extra.",
        hint: "String fijo documentado en runbook",
        hints: [
          "String fijo documentado en runbook",
          "Un comando para reproducir",
        ],
        edgeCases: ["reproducibilidad"],
        tests: "comando único",
        feedback:
          "Un demo con PII real no es «más realista»: es un fail de CF-1. El flag `--synthetic` es contrato de runbook y de gate.",
        retrospective:
          "Reproducibilidad de un comando reduce fricción de revisión de nivel. El mismo string aparece en el I Do y en el You Do. Siguiente: incidente PII en log + regresión S01–S13.",
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
        title: "Incidente PII y regresión N1",
        preamble:
          "- **Contexto:** si un token o nombre aparece en un log del demo, la respuesta es playbook — no «seguir como si nada».\n- **Meta:** tres acciones en orden (`rotate_secret`, `redact_logs`, `postmortem`) y nota de revisión S01–S13.\n- **Éxito:** `rotate_secret|redact_logs|postmortem` y la línea exacta de `level1_regression`.\n- **Límites:** orden fijo; no `ignore`; solo stdlib.",
        instruction:
          "1. Reemplaza la lista `ignore/continue`.\n2. Une con `|` en el orden del solution.\n3. Segundo print: texto exacto de regresión level-1.\n4. No inventes pasos extra.",
        hint: "Orden fijo de respuesta",
        hints: [
          "Orden fijo de respuesta",
          "También menciona level-1 regression en un segundo print",
        ],
        edgeCases: ["incidente + regresión"],
        tests: "3 acciones + nota regresión",
        feedback:
          "Si ves `ignore|continue` o `level1_regression: skip`, no implementaste el playbook. El orden fijo es `rotate_secret` → `redact_logs` → `postmortem`; el segundo print debe volver a verificar S01–S13, no «saltar» la regresión.",
        retrospective:
          "Incidente y regresión forman parte del cierre N1: no basta con que el dashboard «corra otra vez». En el You Do ensamblas ER, REL, matriz de decisión, privacy y las 13 filas de regresión en un solo entregable que puedas defender en el gate.",
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
      "Cierras el **Familiarity Evidence Dashboard (CP-N1-C)** —el gate práctico del Nivel 1—: ER determinista por reglas, `entity_resolution_score` **separado** de `relationship_signal_score` (esto es, identidad y familiaridad operativa nunca se mezclan en un solo número), geoseñal trazable, fichas pseudonimizadas y umbrales de revisión/abstención **sin** parentesco/fraude automático. **Antes de este You Do:** completa al menos un E1+E2+E3 de T1 (identidad), T2 (relación) y T3 (decisión); el starter —el código inicial que recibes— reutiliza esos contratos con DEFECTOS intencionales que debes corregir. Incluye **notas de regresión de nivel 1 (S01–S13)**: en ~30 min re-ejecuta los checks críticos listados en `LEVEL1_REGRESSION_MATRIX` sobre fixtures sintéticos y registra pass/fail en el runbook. El bloque de producto (dashboard + privacy) es aparte. Entrega artefactos **CF-1** (privacy sheet, acceso, tests, demo de un comando). Esta entrega documenta evidencia CF-1 y la regresión N1; no inventes un flag de «aprobado» dentro del código.",
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
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con las 9 filas de `DECISION_MATRIX` y los scores ER≠REL del par demo? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, egress, roles viewer/reviewer)? (3) En el README, una frase de impacto medible (antes/después: cola clerical, precision reportada, demo de un comando) que puedas defender en 30 segundos en el gate N1. No declares el nivel cerrado solo porque `main()` imprime `decision_matrix_ok`.",
  },
  selfCheck: {
    questions: [
      {
        question: "entity_resolution_score y relationship_signal_score deben…",
        options: ["Mantenerse separados en la ficha de caso", "Fusionarse siempre en un solo número sin etiqueta", "Reemplazarse por is_family", "Ocultarse al revisor"],
        correctIndex: 0,
        explanation:
          "Son constructos distintos —la identidad y la familiaridad operativa son preguntas separadas—; la UI y el modelo los muestran aparte.",
      },
      {
        question: "Un false positive de ER implica…",
        options: ["Fraude confirmado", "Parentesco automático", "Error de matching; no es veredicto legal de fraude", "Borrar la cola clerical"],
        correctIndex: 2,
        explanation:
          "FP (falso positivo) es error de identidad estimada, no delito.",
      },
      {
        question: "En la zona gris del score el sistema debe…",
        options: ["Marcar auto_fraud=true", "Asignar is_family=true", "Publicar PII real en el mapa", "Encolar needs_review / abstenerse según política"],
        correctIndex: 3,
        explanation:
          "Human-in-the-loop (un humano revisa la duda): revisión o abstención, nunca fraude automático.",
      },
      {
        question: "CF-1 en S13 incluye…",
        options: ["Solo un modelo de deep learning", "Privacy sheet, acceso, tests, demo y runbook", "Hardcodear tokens en el repo", "Omitir la privacy sheet si el demo corre"],
        correctIndex: 1,
        explanation:
          "CF-1 reúne los artefactos de operación y privacidad del cierre N1: privacy sheet, acceso, tests, demo y runbook.",
      },
      {
        question: "Level-1 regression notes en el You Do exigen…",
        options: ["Re-chequear paths críticos S01–S13 y documentarlos en el runbook de entrega", "Ignorar S01–S12", "Borrar el dashboard", "Enviar PII a geocoder público"],
        correctIndex: 0,
        explanation:
          "La regresión de nivel —volver a verificar los paths críticos S01–S13— se documenta en el runbook de entrega N1.",
      },
      {
        question: "Si score=0.4 y uncertainty=low, decide_ops_status debe devolver…",
        options: ["abstain", "accept_pair", "needs_review", "auto_fraud"],
        correctIndex: 2,
        explanation:
          "score < 0.8 y >= 0.4 cae en `needs_review` (revisión humana); `abstain` (abstenerse) es solo score < 0.4.",
      },
      {
        question: "Blocking en N1 sirve para…",
        options: ["Inferir parentesco automáticamente", "Enviar PII a un geocoder público", "Fusionar ER y relationship en un solo score", "Reducir pares candidatos antes de reglas finas"],
        correctIndex: 3,
        explanation:
          "`Blocking` (acotar pares candidatos por bloque paterno|región) reduce el espacio de comparación; no es veredicto legal.",
      },
      {
        question: "Con TP=5, FP=1, FN=2, precision y recall redondeados a 3 decimales son…",
        options: ["precision 0.714 y recall 0.833", "precision 0.833 y recall 0.714", "precision 1.0 y recall 1.0", "precision 0.5 y recall 0.5"],
        correctIndex: 1,
        explanation:
          "precision = 5/(5+1) ≈ 0.833; recall = 5/(5+2) ≈ 0.714. No inviertas numerador/denominador: precision castiga falsos positivos, recall castiga falsos negativos.",
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
        note: "Identidad vs. prueba; no sobreafirmes en ER",
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
