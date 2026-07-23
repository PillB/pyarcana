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
  icon: "Bot",
  accentColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  jobRelevance:
    "Cerrar el nivel 1 exige un **Familiarity Evidence Dashboard** con entity resolution determinista, señales de relación **separadas** del score ER, fichas pseudonimizadas, revisión humana y límites explícitos (sin parentesco/fraude automático). Esta sección (id de plataforma `rpa-automation` conservado) retematiza a V3 y es la **puerta de salida N1**: cierre **CP-N1-C**, **regresión de nivel 1 (S01–S13)** y artefactos **CF-1**.",
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
      heading: "De “RPA & automatización” al Familiarity Evidence Dashboard (mapa)",
      paragraphs: [
        "En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**. Ese material se reubica al tramo de automatización avanzada. Aquí cierras **CP-N1-C** con un **Familiarity Evidence Dashboard**: ER por reglas, señales de relación separadas, explicación humana y operación responsable.",
        "Promoción de nivel: tres capstones N1, **regresión S01–S13 (level-1)** y **CF-1** aprobados. Solo datos sintéticos pseudonimizados. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Orden: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «De “RPA & automatización” al Familiarity Evidence Dashboard (mapa)»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado RPA/IA de este archivo **no es el camino V3 del estudiante en S13**. Target: dashboard de evidencia + cierre N1. Nunca PII real; nunca auto_fraud/is_family.",
      },
    },
    {
      heading: "Normalización, blocking y entity resolution",
      subtopicId: "S13-T1-A",
      paragraphs: [
        "Normaliza nombres y `document_id` (casefold, quitar espacios/guiones) antes de comparar. **Blocking** reduce pares candidatos (p. ej. apellido+región). En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "ER **determinista por reglas** produce `entity_resolution_score` ∈ [0,1]. No uses ER probabilístico avanzado aquí (S30+). Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "No colapses ER con señales de relación: son scores **separados** en la ficha de caso. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Normalización, blocking y entity resolution»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
    ap = norm_name(rec["name"]).split()[-1]
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
          "entity_resolution_score ≠ relationship_signal_score. La UI debe mostrarlos aparte.",
      },
    },
    {
      heading: "Verdad etiquetada, precision/recall y revisión clerical",
      subtopicId: "S13-T1-B",
      paragraphs: [
        "Con pares etiquetados sintéticos calculas **TP/FP/FN** → precision/recall simples. En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "Scores en **banda de duda** van a **cola clerical** (humano), no a auto-merge. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Un **FP no implica fraude**: es error de matching de identidad, no veredicto legal. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Verdad etiquetada, precision/recall y revisión clerical»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "pr_metrics.py",
        code: `# y_true 1=same entity, y_pred 1=system says match
pairs = [
    (1, 1), (1, 1), (1, 0),  # FN
    (0, 1), (0, 0), (0, 0),
]
tp = sum(1 for t, p in pairs if t == 1 and p == 1)
fp = sum(1 for t, p in pairs if t == 0 and p == 1)
fn = sum(1 for t, p in pairs if t == 1 and p == 0)
precision = tp / (tp + fp)
recall = tp / (tp + fn)
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
        "Señales: mismo email/teléfono/dirección normalizados, distancia geo bajo umbral, solapamiento de tokens de apellido. En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "Agrégalas en `relationship_signal_score` con pesos documentados. **No es veredicto de parentesco**. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Cada señal debe poder listarse en la explicación de la ficha. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Email/teléfono/dirección compartidos, distancia y apellidos»; nunca PII real ni inferencia automática de parentesco/fraude.",
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

a = {"phone": "999111222", "name": "Ana Quispe Rojas", "km": 1.2}
b = {"phone": "999111222", "name": "Luis Quispe Díaz", "km": 1.2}
signals = {
    "shared_phone": shared_contact(a, b, "phone"),
    "geo_close": a["km"] < 2.0,
    "surname_jaccard": round(surname_overlap(a["name"], b["name"]), 3),
}
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
          "Prohibido setear is_family automáticamente en N1.",
      },
    },
    {
      heading: "Transacciones directas y contrapartes comunes",
      subtopicId: "S13-T2-B",
      paragraphs: [
        "Txs directas A↔B y contrapartes comunes (A y C pagan a D) son **evidencia de relación operativa**, no de colusión. En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "Modela un graphlet simple y emite objetos `RelationshipEvidence` con tipo y traza. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Disclaimer obligatorio: common counterparty ≠ collusion claim. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Transacciones directas y contrapartes comunes»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
    {"type": "common_counterparty", "entities": ("A", "C"), "shared": sorted(common)},
]
print(evidence)
print("collusion_claim", False)`,
        output: `[{'type': 'direct_tx', 'pair': ('A', 'B'), 'n': 2}, {'type': 'common_counterparty', 'entities': ('A', 'C'), 'shared': ['D']}]
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
        "Agrega ER + señales de relación con pesos y produce `evidence_score`, banda de **incertidumbre** (low/med/high) y **bullets** legibles. En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "Campos de auditoría: inputs usados, missing fields, versión de reglas. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Señales conflictivas → explicación honesta, no score maquillado. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Score de evidencia, incertidumbre y explicación»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
        "Matriz total y sin huecos: score inválido/no finito o uncertainty desconocida → `invalid_input`; uncertainty high → `needs_review`; score < 0.40 → `abstain`; 0.40 ≤ score < 0.80 → `needs_review`; score ≥ 0.80 → `accept_pair`. **Nunca** `auto_fraud=true` ni `is_family=true`.",
        "Human-in-the-loop: la acción operativa es de **datos** (revisar/aceptar/rechazar par), no veredicto legal. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Auditoría: elimina cualquier path que setee parentesco/fraude automático. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Umbral de revisión, abstención y no inferencia automática»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
        "Scaffold estático (HTML/template o dicts listos para UI): puntos de mapa con coords sintéticas y tooltips de geoseñal trazable. En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "**Pseudonimiza** nombres en vista (`A*** Q***`). Ficha muestra ER score **y** relationship score por separado. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "No es un design system completo (eso es tramo producto/UI posterior). Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Dashboard/mapa pseudonimizado y ficha de caso»; nunca PII real ni inferencia automática de parentesco/fraude.",
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
]
for c in cases:
    print(c["case_id"], c["display_name"], "ER", c["entity_resolution_score"], "REL", c["relationship_signal_score"])`,
        output: `CASE-1 A*** Q*** ER 0.92 REL 0.41
CASE-2 L*** H*** ER 0.55 REL 0.6`,
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
        "**Privacy sheet**: datos sintéticos, retención local, sin egress de PII bancaria, roles de acceso (viewer/reviewer). En entity resolution y evidencia, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta CP-N1-C + CF-1; fail-closed, revisión humana sin inventar hechos sobre personas reales.",
        "**Tests green** de ER, señales y umbrales. **Demo de un comando**. **Runbook** incluye incidente de PII en log. Contrato: entrada explícita → transformación documentada → salida medible; si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. Stack permitido: stdlib + reglas deterministas S01–S13; no ML sklearn, no NumPy/Pandas de S14–S15.",
        "Artefactos **CF-1** + notas de **regresión level-1 (S01–S13)** cierran el nivel. Caso sintético Perú: pares sintéticos C00x, scores ER vs relación separados. Documenta decisión, métrica y límite conocido en el memo del subtema «Privacidad, acceso, pruebas, demo y runbook»; nunca PII real ni inferencia automática de parentesco/fraude.",
      ],
      code: {
        language: 'python',
        title: "ops_cf1.py",
        code: `privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "egress_public_geocoder": "city_address_only",
    "roles": ["viewer", "reviewer"],
}
runbook_steps = [
    "setup venv",
    "load synthetic fixtures",
    "run ER + signals",
    "open dashboard",
    "process review queue",
]
incident = {
    "trigger": "token_or_name_in_log",
    "action": ["rotate_secret", "redact_logs", "postmortem"],
}
print("privacy", privacy)
print("demo_cmd", "python -m demo_n1_dashboard")
print("runbook", runbook_steps)
print("incident", incident)
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
          "CP-N1-C + regresión level-1 + CF-1. Esta lane no marca section_passed ni actualiza ledger.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos del cierre N1: ER por reglas, evaluación+clerical, señales de relación, graphlet de txs, ficha con uncertainty, umbrales sin auto_fraud, scaffold de 3 casos y runbook con regresión level-1.",
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
    ap = r["name"].casefold().strip().split()[-1]
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
random.seed(13)
# synthetic labels and scores
pairs = []
for i in range(20):
    y = 1 if i % 3 == 0 else 0
    score = 0.85 if y == 1 else 0.2
    if i in (4, 9, 15):
        score = 0.55  # gray band
    pairs.append({"id": f"P{i}", "y": y, "score": score, "pred": int(score >= 0.7)})
tp = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 1)
fp = sum(1 for p in pairs if p["y"] == 0 and p["pred"] == 1)
fn = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 0)
review = [p["id"] for p in pairs if 0.4 <= p["score"] <= 0.7][:3]
print("tp", tp, "fp", fp, "fn", fn)
print("precision", round(tp / max(1, tp + fp), 3))
print("recall", round(tp / max(1, tp + fn), 3))
print("clerical_queue", review)`,
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
          code: `a = {"phone": "900111222", "surname": "quispe", "km": 1.2}
b = {"phone": "900111222", "surname": "quispe", "km": 1.2}
signals = []
if a["phone"] == b["phone"]:
    signals.append("shared_phone")
if a["km"] <= 2.0:
    signals.append("geo_distance_km=1.2")
if a["surname"] == b["surname"]:
    signals.append("surname_match")
rel = min(1.0, 0.4 * len(signals))
print("signals", signals)
print("relationship_signal_score", rel)
print("explanation", signals)
print("kinship", None)`,
          output: `signals ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
relationship_signal_score 1.0
explanation ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
kinship None`,
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
          code: `txs = [("A", "B", 1), ("B", "A", 1), ("A", "D", 2), ("C", "D", 2)]
evidence = []
if any({x, y} == {"A", "B"} for x, y, _ in txs):
    evidence.append({"type": "direct_tx", "nodes": ["A", "B"]})
cp_a = {y if x == "A" else x for x, y, _ in txs if "A" in (x, y)}
cp_c = {y if x == "C" else x for x, y, _ in txs if "C" in (x, y)}
shared = sorted(cp_a & cp_c)
evidence.append({"type": "common_counterparty", "nodes": ["A", "C"], "via": shared})
print(evidence)
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
          code: `er, rel = 0.88, 0.45
missing = ["email"]
conflict = abs(er - rel) > 0.5
unc = "high" if conflict or len(missing) >= 2 else ("med" if missing else "low")
card = {
    "evidence_score": round(0.6 * er + 0.4 * rel, 3),
    "uncertainty": unc,
    "bullets": [
        f"entity_resolution_score={er}",
        f"relationship_signal_score={rel}",
        f"missing_fields={missing}",
    ],
}
print(card)`,
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
          code: `steps = [
    "1. setup: python -m venv .venv && pip install -r requirements.txt",
    "2. load synthetic fixtures (no real PII)",
    "3. run ER + relationship signals",
    "4. open dashboard scaffold",
    "5. process clerical review queue",
    "6. level-1 regression notes: re-run critical checks S01-S13",
    "7. CF-1: privacy sheet + demo script + access notes",
]
for s in steps:
    print(s)
print("demo_cmd: python -m demo_n1_dashboard --synthetic")
print("section_passed_written_by_this_lane", False)`,
          output: `1. setup: python -m venv .venv && pip install -r requirements.txt
2. load synthetic fixtures (no real PII)
3. run ER + relationship signals
4. open dashboard scaffold
5. process clerical review queue
6. level-1 regression notes: re-run critical checks S01-S13
7. CF-1: privacy sheet + demo script + access notes
demo_cmd: python -m demo_n1_dashboard --synthetic
section_passed_written_by_this_lane False`,
        },
        why: "Operación N1 completa sin marcar passed en checkpoint/ledger.",
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
          "E1 (guiado) — Concepto: S13-T1-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `norm_name` y `norm_doc`: casefold, colapsar espacios; doc solo [a-z0-9]. Prueba ' Ana  QUISPE ' y 'D-12.34'. Salida/pass: `ana quispe | d1234`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15).",
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
          code: `import re
def norm_name(n):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S13-T1-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `blocking_key(rec)` = primer_apellido|region en casefold. Nombre 'Luis Huamán Soto', region 'Cusco'. Salida/pass: `huamán|cusco`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15 solo stdlib + reglas deterministas S01–S13.",
        hint: "Último token no; usa el segundo token como apellido paterno o el último: documenta. Aquí: split()[1] si hay >=2 else split()[0].",
        hints: [
          "Último token no; usa el segundo token como apellido paterno o el último: documenta. Aquí: split()[1] si hay >=2 else split()[0].",
          "Formato f'{ap}|{region}'",
        ],
        edgeCases: ["un solo token de nombre"],
        tests: "huamán|cusco",
        feedback: "Blocking reduce el espacio de pares antes de reglas finas.",
        starterCode: {
          language: 'python',
          title: "blocking_key.py",
          code: `def blocking_key(rec):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — `er_score(a,b)`: 1.0 si norm_doc igual y mismo blocking_key; 0.5 si solo stdlib + reglas deterministas S01–S13. Documenta el criterio en el memo del ejercicio y no inventes evidencia fuera del fixture sintético.",
        hint: "Combina igualdad de doc y block",
        hints: [
          "Combina igualdad de doc y block",
          "Scores solo 1.0/0.5/0.0",
        ],
        edgeCases: ["doc match sin block → 0.5"],
        tests: "1.0 0.5 0.0",
        feedback: "Score ER documentado y auditable.",
        starterCode: {
          language: 'python',
          title: "er_score_rules.py",
          code: `import re
def norm_doc(d):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "er_score_rules.py",
          code: `import re
def norm_doc(d):
    return re.sub(r"[^a-z0-9]", "", d.casefold())
def bkey(r):
    ap = r["name"].casefold().split()[-1]
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
          code: `tp, fp, fn = 8, 2, 2
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          code: `pairs = [
    {"id": "P1", "score": 0.2},
    {"id": "P2", "score": 0.55},
    {"id": "P3", "score": 0.7},
    {"id": "P4", "score": 0.9},
]
def clerical_queue(pairs, low=0.4, high=0.7):
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T1-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Redacta (print) 2 líneas: por qué un FP de ER no implica fraude; y qué acción operativa tomar (review). Salida/pass: primeros tokens de `fp_not_fraud: False positive de matching no es evi…` según solution. Conserva el contrato del starter (no.",
        hint: "Mensajes fijos cortos",
        hints: [
          "Mensajes fijos cortos",
          "Incluye la palabra review",
        ],
        edgeCases: ["límites éticos"],
        tests: "texto + needs_review",
        feedback: "Límites explícitos son parte del learning outcome.",
        starterCode: {
          language: 'python',
          title: "fp_limits.py",
          code: `# fixture
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "fp_limits.py",
          code: `print("fp_not_fraud:", "False positive de matching no es evidencia de delito")
print("ops_action:", "needs_review")`,
          output: `fp_not_fraud: False positive de matching no es evidencia de delito
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
          code: `def shared_email(a, b):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S13-T2-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `rel_score(km, surname_jaccard)` = 0.6*(1 if km<2 else 0)+0.4*jaccard; round 3. Salida/pass: `0.8 | 0.2`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de S14–S15; solo stdlib + reglas deterministas S01–S13.",
        hint: "Combina distancia y apellido",
        hints: [
          "Combina distancia y apellido",
          "km=1.2, j=0.5 → 0.8",
        ],
        edgeCases: ["km lejos anula geo"],
        tests: "0.8 y 0.2",
        feedback: "Pesos documentados permiten auditar el score de relación.",
        starterCode: {
          language: 'python',
          title: "combine_signals.py",
          code: `def rel_score(km, surname_jaccard):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "combine_signals.py",
          code: `def rel_score(km, surname_jaccard):
    geo = 1.0 if km < 2 else 0.0
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
          "E3 (transferencia) — Concepto: S13-T2-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Imprime disclaimer exacto: 'relationship_signal_score no implica parentesco ni colusión'. Salida/pass: `relationship_signal_score no implica parentesco ni colusión`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn,.",
        hint: "Un solo print",
        hints: [
          "Un solo print",
          "Texto exacto para tests de portfolio",
        ],
        edgeCases: ["disclaimer UI"],
        tests: "frase exacta",
        feedback: "Disclaimer reutilizable en ficha y README.",
        starterCode: {
          language: 'python',
          title: "disclaimer.py",
          code: `pass  # fixture vacío — usa solution contract
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "disclaimer.py",
          code: `print("relationship_signal_score no implica parentesco ni colusión")`,
          output: `relationship_signal_score no implica parentesco ni colusión`,
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
          code: `txs = [("A","B",10), ("C","D",1), ("B","A",5)]
def direct_txs(txs, a, b):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S13-T2-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `common_counterparties(txs, a, c)` devuelve sorted set de nodos que transan con ambos. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de.",
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
          code: `txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]
def neighbors(txs, node):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T2-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Lista 2 cosas que NO debes inferir de contraparte común (print líneas no_collusion y no_kinship). Salida/pass: primeros tokens de `no_collusion: contraparte común no prueba acuerdo …` según solution. Conserva el contrato del starter (no borres.",
        hint: "Mensajes explícitos",
        hints: [
          "Mensajes explícitos",
          "Incluye collusion y kinship en el texto",
        ],
        edgeCases: ["límites de inferencia"],
        tests: "dos disclaimers",
        feedback: "Límites de inferencia son evaluables en rúbrica ética.",
        starterCode: {
          language: 'python',
          title: "no_infer.py",
          code: `# fixture
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
        },
        solutionCode: {
          language: 'python',
          title: "no_infer.py",
          code: `print("no_collusion: contraparte común no prueba acuerdo ilícito")
print("no_kinship: contraparte común no prueba parentesco")`,
          output: `no_collusion: contraparte común no prueba acuerdo ilícito
no_kinship: contraparte común no prueba parentesco`,
        },
      },
      {
        id: "S13-T3-A-E1",
        subtopicId: "S13-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `explanation_bullets(er, rel, missing)` devuelve lista de 3 strings formateados. Salida/pass: primeros tokens de `['entity_resolution_score=0.9', 'relationship_sign…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no ML.",
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
          code: `def explanation_bullets(er, rel, missing):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `uncertainty_band(missing, conflict)` → high si conflict o len(missing)>=2; med si missing; low si no. Salida/pass: `low | med | high | high`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de.",
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
          code: `def uncertainty_band(missing, conflict):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T3-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Caso conflictivo er=0.9 rel=0.1: imprime evidence_score ponderado 0.6/0.4 y uncertainty high + bullet 'señales conflictivas'. Salida/pass: primeros tokens de `evidence_score 0.58 | uncertainty high | note seña…` según solution. Conserva el.",
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
          code: `er, rel = 0.9, 0.1
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S13-T3-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Config dict thresholds: review_low=0.4 y accept_min=0.8. Imprime sorted items; no dejes un hueco review_high→accept_min. Salida/pass: `[('accept_min', 0.8), ('review_low', 0.4)]`. Conserva el contrato del starter (no borres asserts ni datos); no ML.",
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
          code: `thresholds = {
    "accept_min": 0.8,
    "review_low": 0.4,
}
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Implementa la matriz total: input inválido→invalid_input; high→needs_review; score<review_low→abstain; score<accept_min→needs_review; resto→accept_pair. Sin fraud/family labels.",
        hint: "Implementa la matriz de decisión",
        hints: [
          "Implementa la matriz de decisión",
          "Valida tipo, bool, isfinite, rango 0..1 y unc low|med|high antes de comparar",
        ],
        edgeCases: ["0.4", "0.8", "NaN", "bool", "unc desconocida", "high unc → review"],
        tests: "Matriz exacta: -0.1 invalid_input; 0.399 abstain; 0.4 y 0.799 needs_review; 0.8 y 1.0 accept_pair (low); 0.9/high needs_review; NaN y unc='?' invalid_input.",
        feedback: "Estados operativos de par, no veredictos legales.",
        starterCode: {
          language: 'python',
          title: "decide_ops.py",
          code: `from math import isfinite

th = {"accept_min": 0.8, "review_low": 0.4}
def decide_ops_status(score, unc, th):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T3-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Auditoría: dado un dict de campos de salida, elimina claves is_family y auto_fraud si existen; imprime sorted keys restantes. Salida/pass: `['score', 'status']`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no.",
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
          code: `# fixture
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          code: `def pseudonymize(name):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E2 (independiente) — Concepto: S13-T4-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `case_sheet(er, rel)` dict con ambos scores y assert er key != rel key; imprime sheet. Salida/pass: primeros tokens de `{'entity_resolution_score': 0.9, 'relationship_sig…` según solution. Conserva el contrato del starter (no borres asserts ni.",
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
          code: `def case_sheet(er, rel):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T4-A (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: `map_tooltip(lat, lon, km, source)` string con coords y geoseñal trazable. Salida/pass: `lat=-12.04,lon=-77.04,geo_distance_km=1.2,source=mock`. Conserva el contrato del starter (no borres asserts ni datos); no ML sklearn, no NumPy/Pandas de.",
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
          code: `def map_tooltip(lat, lon, km, source):
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E1 (guiado) — Concepto: S13-T4-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Completa privacy sheet dict: data_class=synthetic_only, pii_real=False, roles=['viewer','reviewer']. Imprime json-like sorted keys. Salida/pass: `['data_class', 'pii_real', 'roles'] | False`. Conserva el contrato del starter (no borres asserts ni.",
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
          code: `privacy = {
    "data_class": "synthetic_only",
    "pii_real": False,
    "roles": ["viewer", "reviewer"],
}
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          code: `def demo_command():
    pass  # TODO body
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
          "E3 (transferencia) — Concepto: S13-T4-B (Familiarity Evidence Dashboard). Entrada: fixture sintético del starter (`CASO`/ids C00x) en entity resolution y evidencia. Tarea: Runbook de incidente PII en log: lista de 3 acciones rotate_secret, redact_logs, postmortem. Imprime joined por '|'. Salida/pass: primeros tokens de `rotate_secret|redact_logs|postmortem | level1_regr…` según solution. Conserva el contrato del.",
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
          code: `actions = ["rotate_secret", "redact_logs", "postmortem"]
# TODO: completa la operación de dominio; imprime la salida exacta del contrato (no borres el fixture)
`,
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
      "Cierras el **Familiarity Evidence Dashboard (CP-N1-C)**: ER determinista por reglas, `entity_resolution_score` **separado** de `relationship_signal_score`, geoseñal trazable, fichas pseudonimizadas, umbrales de revisión/abstención **sin** parentesco/fraude automático. Incluye **notas de regresión de nivel 1 (S01–S13)**: re-ejecuta checks críticos de secciones previas (colecciones, texto, archivos, APIs/SQL/geo) sobre fixtures sintéticos y registra resultado en el runbook. Entrega artefactos **CF-1** (privacy sheet, acceso, tests, demo de un comando). Esta lane **no** marca section_passed ni edita checkpoint/ledger.",
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
S13 V3. Datos sintéticos. Sin auto parentesco/fraude.
"""

from __future__ import annotations

import re
from typing import Any


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
    # TODO
    raise NotImplementedError


def blocking_key(rec: dict) -> str:
    # TODO
    raise NotImplementedError


def er_score(a: dict, b: dict) -> float:
    # TODO
    raise NotImplementedError


def relationship_signal_score(a: dict, b: dict) -> float:
    # TODO shared phone / geo / surname — no kinship
    raise NotImplementedError


def decide_ops_status(score: float, uncertainty: str) -> str:
    # TODO invalid_input | abstain | needs_review | accept_pair — never fraud/family
    raise NotImplementedError


def pseudonymize(name: str) -> str:
    # TODO
    raise NotImplementedError


def privacy_sheet() -> dict:
    return {
        "data_class": "synthetic_only",
        "pii_real": False,
        "roles": ["viewer", "reviewer"],
    }


def level1_regression_notes() -> list[str]:
    """Una fila verificable por sección. No marca passed ni edita ledgers."""
    return ["%s: %s" % (row["section"], row["check"]) for row in LEVEL1_REGRESSION_MATRIX]


def main() -> None:
    a = {"name": "Ana Quispe", "document_id": "D-1", "region": "Lima", "phone": "900", "km": 1.0}
    b = {"name": "ANA QUISPE", "document_id": "d1", "region": "Lima", "phone": "900", "km": 1.0}
    print("pseudo", pseudonymize(a["name"]))
    print("privacy", privacy_sheet())
    print("decision_cases", len(DECISION_MATRIX))
    print("regression_notes", level1_regression_notes())


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Portfolio N1: captura del dashboard con 3 casos, ficha con ER≠REL, privacy sheet, salida del demo command y sección **Level-1 regression** del runbook (S01–S13). No afirmes section_passed hasta el proceso de gate del curso.",
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
        options: ["Solo un modelo de deep learning", "Privacy sheet, acceso, tests, demo y runbook", "Hardcodear tokens en el repo", "Marcar section_passed desde el author lane"],
        correctIndex: 1,
        explanation:
          "Artefactos de operación y privacidad del cierre N1.",
      },
      {
        question: "Level-1 regression notes en el You Do exigen…",
        options: ["Re-chequear paths críticos S01–S13 en runbook (sin editar ledger aquí)", "Ignorar S01–S12", "Borrar el dashboard", "Enviar PII a geocoder público"],
        correctIndex: 0,
        explanation:
          "La regresión de nivel se documenta en el runbook de entrega N1.",
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
        note: "Almacén local de evidencias si se integra con S12",
      },
      {
        label: "json — JSON encoder and decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "Export determinista de fichas",
      },
    ],
    books: [
      {
        label: "Data Matching (Peter Christen) — conceptos",
        note: "Blocking y evaluación; aplicar solo reglas deterministas en N1.",
      },
      {
        label: "Practical Data Ethics (selecciones)",
        note: "Límites de inferencia y revisión humana.",
      },
    ],
    courses: [
      {
        label: "Familiarity Evidence Dashboard — entrega del curso",
        url: "https://github.com/PillB/pyarcana",
        note: "Repositorio del curso; documenta la entrega CP-N1-C con demo local sintético.",
      },
    ],
  },
}
