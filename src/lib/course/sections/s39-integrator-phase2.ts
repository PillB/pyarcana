import type { CourseSection } from '../../types'

export const section39: CourseSection = {
  id: "integrator-phase2",
  index: 39,
  title: "Responsible ML Case Triage y cierre de nivel",
  shortTitle: "Case Triage N3",
  tagline: "Responsible ML Case Triage con baseline, calibración, abstención, monitoreo y revisión; promoción N3 con regresión S27–S39 y CF-3",
  estimatedHours: 19,
  level: "Competente a experto",
  phase: 2,
  icon: "Award",
  accentColor: "bg-gradient-to-br from-violet-500 to-fuchsia-900",
  jobRelevance:
    "En operaciones de riesgo y calidad de datos en fintech, banca y retail en el Perú, cierras el entregable **CP-N3-C** con **Responsible ML Case Triage**: intake→ER→relación→features→modelo→cola humana, con cards, monitoreo y control humano. El score solo prioriza revisión; no declara fraude ni parentesco. Para la promoción de nivel documentas CP-N3-A/B/C, un **smoke de regresión S27–S39** y el expediente **CF-3** listo para revisión externa: dejas evidencia reproducible, sin auto-declarar el cierre del nivel.",
  learningOutcomes: [
    { text: "Ensamblar el flujo canónico intake→ER→grafo→features→score→cola con contratos versionados" },
    { text: "Registrar ownership, semver y política de compatibilidad por artefacto del triage" },
    { text: "Armar cola, evidence packet y explicación en capas sin exponer solo un número" },
    { text: "Operar decisión automática, override humano, feedback y apelación con audit log" },
    { text: "Aplicar checklist de privacidad, fairness por slices y seguridad de inputs del packet" },
    { text: "Monitorear drift, activar human_only, rollback de modelo/umbral y abstención" },
    { text: "Definir criterios de aceptación, demo e2e sintético y smoke de regresión S27–S39" },
    { text: "Publicar model/data/system cards, métricas de valor operativo y postmortem blameless" },
    { text: "Documentar el expediente CF-3 y los gates N3 con evidencia reproducible, sin auto-declarar la promoción de nivel" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-C + regresión N3 + CF-3",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Responsible ML Case Triage:** flujo intake→ER→grafo→features→score→cola humana. **Evidence packet:** hechos + path + features + incertidumbre (no un número suelto). **Abstención / human_only:** modos que priorizan control humano. **Model/data/system card:** límites y ownership publicados. **CF-3:** gate de contratos del nivel 3 revisado por un evaluador externo. **auto_fraud=False:** el score prioriza revisión; nunca declara fraude ni parentesco.",
        "**S39 cierra el nivel 3** con el sistema demoable **Responsible ML Case Triage**. No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38 (calidad, ER, grafo, features, ranking, calibración, explicación, monitoreo y colas) en un recorrido que un revisor humano puede auditar de punta a punta con fixtures sintéticos peruanos.",
        "Contrato de promoción (conceptual). Entrada: entregables CP-N3-A, CP-N3-B y CP-N3-C, más smoke de regresión S27–S39 y el expediente de **CF-3**. Salida esperada de esta sección: bundle e2e con packets, audit, cards y notas de gate. Error: auto-declarar promoción sin revisión externa. Criterio: dejas evidencia reproducible; la decisión de cierre del nivel la registra un revisor, no tu script.",
        "Orden pedagógico de esta sección: **T1 Arquitectura del flujo** (pipeline y ownership) → **T2 Workbench del revisor** (packet, decisión y apelación) → **T3 Riesgo y ops** (privacidad, fairness, drift y human_only) → **T4 Producto y cierre** (aceptación, demo, cards, valor y postmortem). El caso sintético `CASO-LIM-039` modela una cola de revisión para una fintech ficticia en Lima: datos inventados, sin PII real y sin etiqueta automática de fraude.",
      ],
      code: {
        language: 'python',
        title: "s39_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-LIM-039",
        "gates": ["CP-N3-C", "regression_S27_S39", "CF-3_external_review"],
        "auto_fraud": False,
        "self_declared_promotion": False,
    }

c = section_contract()
print("case", c["case"])
print("auto_fraud", c["auto_fraud"])
print("self_declared_promotion", c["self_declared_promotion"])
`,
        output: `case CASO-LIM-039
auto_fraud False
self_declared_promotion False`,
      },
      callout: {
        type: "info",
        title: "Gate CP-N3-C + regresión",
        content:
          "Entregable de S39: triage responsable demoable. Promoción N3 = CP-N3-A/B/C + regresión S27–S39 + CF-3 con revisión externa. Tú dejas el expediente; no auto-declaras el cierre del nivel.",
      },
    },
    {
      heading: "Pipeline canónico: intake → ER → relación → features → modelo",
      subtopicId: "S39-T1-A",
      paragraphs: [
        "El flujo canónico N3 es una cadena con fronteras claras: **intake** normaliza registros sintéticos; **ER** decide misma entidad (no familia ni culpa); el **grafo relacional** expone paths de co-ocurrencia; **features** se materializan sin leakage de labels futuros; el **modelo** emite un score de prioridad; la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score **nunca** es veredicto de conducta indebida.",
        "Por qué este orden importa: ER antes del grafo evita filtrar features con una identidad mal resuelta; features antes del score impiden que el modelo use labels futuros de la cola; la cola al final fuerza **HITL** (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear score a veredicto legal. Éxito: fallas se aíslan por frontera y el score solo ordena trabajo humano.",
        "Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia): dos registros comparten un teléfono sintético; ER puede proponer misma entidad; el grafo muestra un path de longitud 2; el score 0.66 sugiere prioridad media de cola. Nada de eso prueba fraude, parentesco ni intención: solo justifica que un revisor mire el evidence packet con citas y path.",
      ],
      code: {
        language: 'python',
        title: "pipeline.py",
        code: `def build_pipeline_payload(case_id: str, score: float) -> dict:
    stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
    return {
        "stages": stages,
        "run_id": "n3-reg-001",
        "case_id": case_id,
        "stage": "model_score",
        "score": score,
        "label_space": "needs_review",
        "auto_fraud": False,
    }

payload = build_pipeline_payload("CASO-LIM-039-T1A", 0.66)
print("pipeline", " > ".join(payload["stages"]))
print("label_space", payload["label_space"])
print("auto_fraud", payload["auto_fraud"])`,
        output: `pipeline intake > er > relation_graph > features > model_score > queue
label_space needs_review
auto_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Contratos por etapa",
        content:
          "Schema in/out versionado por stage. Si ER falla, no inventes features ni score: falla cerrada en esa frontera y registra el error en el audit del run.",
      },
    },
    {
      heading: "Contratos, versiones y ownership (semver)",
      subtopicId: "S39-T1-B",
      paragraphs: [
        "Cada artefacto del triage — motor de ER, `graph_schema`, `feature_set`, ranker, umbral y plantilla de packet — debe tener **owner**, **versión semver** y **política de compatibilidad**. Sin owner no hay on-call; sin versión no hay regresión; sin política de breaking change el revisor recibe un packet que el modelo ya no entiende.",
        "Semver no es adorno: un breaking change en el schema del grafo invalida paths ya guardados en packets de cola. Entrada: registry con `ver`, `owner` y flag de breaking. Salida: inventario, owners distintos y bump major/minor. Error: publicar breaking como patch o artefacto sin owner. Éxito: cada artefacto en producción tiene dueño contactable y major documentado cuando el contrato se rompe.",
        "En `CASO-LIM-039-T1B`, el equipo de plataforma en Lima versiona `er_engine 1.2.0` (data-quality), `graph_schema 3.0.0` (investigations), `feature_set 3.0.0` (ml-platform) y `ranker 2.1.0` (ml-risk). Si el schema del grafo elimina un tipo de nodo, el bump es major y la regresión S27–S39 debe revalidar paths antes de reabrir la cola automática.",
      ],
      code: {
        language: 'python',
        title: "registry.py",
        code: `def owner_count(registry: dict) -> int:
    return len({v["owner"] for v in registry.values()})

registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations"},
    "feature_set": {"ver": "3.0.0", "owner": "ml-platform"},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk"},
}
compat = "semver" if all("." in meta["ver"] for meta in registry.values()) else "unknown"
print(sorted(registry))
print("owners", owner_count(registry))
print("compat", compat)`,
        output: `['er_engine', 'feature_set', 'graph_schema', 'ranker']
owners 4
compat semver`,
      },
      callout: {
        type: "warning",
        title: "Sin owner",
        content:
          "Artefacto sin owner bloquea release del triage: no hay escalamiento de incidentes ni firmante del checklist de riesgo.",
      },
    },
    {
      heading: "Cola, evidence packet y explicación",
      subtopicId: "S39-T2-A",
      paragraphs: [
        "La cola ordena casos por score calibrado y capacidad del equipo; el **evidence packet** es lo que el revisor ve: hechos sintéticos, path de grafo, top features, incertidumbre (in/out of distribution) y contribuciones del modelo. Un número suelto no es un workbench: sin path ni evidencia el caso no debe entrar a cola humana como «listo». **Calibración** aquí significa que el umbral se eligió para una tasa de cola sostenible (S34), no que el score sea probabilidad de fraude.",
        "El packet mínimo no es un dump del modelo: es el set de hechos que un revisor puede citar. Entrada: case_id, score, evidence[], graph_path[], uncertainty y opcional model_contrib. Salida: packet auditable + capas de explicación (S35) + bucket de prioridad por umbrales. Error: score solo o path omitido cuando el modelo usó señales relacionales. Éxito: el revisor reconstruye por qué el caso llegó a cola sin magia del modelo.",
        "Para `CASO-LIM-039-T2A`, el packet incluye score 0.81, evidencia `shared_phone_synth`, path `E1 → ph:900 → E2` e incertidumbre `in_distribution`. Con thr_hi=0.75 y thr_lo=0.40 el bucket es `queue_now`; un score 0.55 iría a `queue_batch` y 0.20 a `skip`. La UI didáctica puede ser un dict en CLI: lo importante es la estructura. El revisor decide; el modelo solo prioriza.",
      ],
      code: {
        language: 'python',
        title: "evidence_packet.py",
        code: `def packet_ok(packet):
    need = ("case_id", "score", "evidence", "graph_path")
    return all(k in packet and packet[k] for k in need)

def priority_bucket(score: float, thr_hi: float, thr_lo: float) -> str:
    # Umbrales de validación (S34), no «a ojo»
    if score >= thr_hi:
        return "queue_now"
    if score >= thr_lo:
        return "queue_batch"
    return "skip"

packet = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth", "tx_path_len_2"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
    "model_contrib": {"shared_phone": 0.4},
}
layers = sum([
    bool(packet.get("case_id")),
    "score" in packet,
    bool(packet.get("evidence")),
    bool(packet.get("graph_path")),
])
print(packet["case_id"], packet["score"])
print("path", packet["graph_path"])
print("layers", layers if packet_ok(packet) else 0)
print("bucket", priority_bucket(packet["score"], 0.75, 0.40))`,
        output: `CASO-LIM-039-T2A 0.81
path ['E1', 'ph:900', 'E2']
layers 4
bucket queue_now`,
      },
      callout: {
        type: "tip",
        title: "Packet mínimo",
        content:
          "Mínimo: case_id, score, evidence, graph_path. Sin path/evidencia no hay workbench; deriva a REQUEST_PACKET_EVIDENCE en vez de auto-cerrar.",
      },
    },
    {
      heading: "Decisión, override, feedback y apelación",
      subtopicId: "S39-T2-B",
      paragraphs: [
        "Las acciones de cola típicas son **queue** (priorizar revisión), **skip** (baja prioridad o sin señal accionable) y **escalate**. La política automática sugiere; el **override humano gana** y debe quedar en audit log con actor, razón y timestamp. Sin audit, el override es un riesgo de gobernanza, no un control.",
        "El audit no es un log de debug: es la prueba de que un humano mandó sobre el auto. Entrada: case_id, score, umbral, opcional decisión humana y canal de apelación. Salida: acción final, flag de override y evento con actor/razón/timestamp. Error: override sin registro, o feedback reinyectado al training con leakage temporal. Éxito: cada cambio es reconstruible y la apelación reabre con otro revisor.",
        "En `CASO-LIM-039-T2B`, el auto sugiere queue por score 0.9; un revisor en Lima hace skip por evidencia insuficiente y se loguea override. Si el cliente apela, el caso reabre con reviewer distinto. El feedback mejora reglas o datasets con cuidado de ventana temporal: nunca uses el label de cola como feature del mismo score que la generó.",
      ],
      code: {
        language: 'python',
        title: "decisions.py",
        code: `log = []
def decide(case_id, score, human=None):
    auto = "queue" if score >= 0.7 else "skip"
    final = human or auto
    log.append({
        "case_id": case_id,
        "auto": auto,
        "final": final,
        "override": human is not None,
    })
    return final
print(decide("CASO-LIM-039-T2B", 0.9))
print(decide("CASO-LIM-039-T2B", 0.9, human="skip"))
print("overrides", sum(1 for e in log if e["override"]))`,
        output: `queue
skip
overrides 1`,
      },
      callout: {
        type: "danger",
        title: "Sin audit",
        content:
          "Override sin log es riesgo de gobernanza. Apelación sin segundo par de ojos invalida el control humano del triage.",
      },
    },
    {
      heading: "Privacidad, fairness y seguridad",
      subtopicId: "S39-T3-A",
      paragraphs: [
        "Antes de abrir el triage a revisores, aplica minimización de PII (solo campos necesarios del packet), **RBAC** por rol (reviewer vs admin), y prohíbe secretos o tokens en el repo. Fairness operativa: mide tasas de envío a cola y de override por slices sintéticos de producto o canal, no para afirmar culpa de un grupo real.",
        "Un AUC alto no «compensa» un secreto en el repo ni la falta de RBAC: son blockers duros de release. Entrada: checklist con pii_minimized, rbac, secrets_in_repo, slice_metrics e input_limits. Salida: `release_ok` y blockers nominados. Error: secrets_in_repo True, packet sin control de rol o sin métricas por slice. Éxito: owner de riesgo firma el checklist antes de la demo de aceptación.",
        "Para `CASO-LIM-039-T3A`, el release de la cola en un entorno de laboratorio limeño exige límites de tamaño en adjuntos sintéticos del packet, validación de URLs (sin **SSRF**: el servidor no debe abrir URLs arbitrarias de evidence remota) y slice metrics de false-queue rate. El checklist no declara «sistema justo para siempre»: solo evidencia mínima de release responsable.",
      ],
      code: {
        language: 'python',
        title: "risk_checklist.py",
        code: `def release_ok(checklist: dict) -> bool:
    return all([
        checklist["pii_minimized"],
        checklist["rbac"],
        not checklist["secrets_in_repo"],
        checklist["slice_metrics"],
        checklist["input_limits"],
    ])

checklist = {
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
    "auto_fraud": False,
}
print("release_ok", release_ok(checklist))
print("items", len([k for k in checklist if k != "auto_fraud"]))
print("fraud_auto", checklist["auto_fraud"])`,
        output: `release_ok True
items 5
fraud_auto False`,
      },
      callout: {
        type: "tip",
        title: "Release gate",
        content:
          "Checklist firmado por owner. secrets_in_repo o falta de RBAC son blockers duros: no se «compensa» con un AUC alto.",
      },
    },
    {
      heading: "Drift, incidentes, rollback y control humano",
      subtopicId: "S39-T3-B",
      paragraphs: [
        "En producción del triage monitoreas distribución de scores, prevalencia proxy de cola, calibración, latencia del packet y tasa de overrides. **Drift** no es un veredicto moral: es una señal de que el ranking puede estar desalineado y hay que abstener más o recalibrar. El control humano no se optimiza fuera del sistema para «subir throughput».",
        "Prioridad de modos: incident > drift > normal. Si hay incidente de política o seguridad, el throughput se sacrifica. Entrada: flags drift_high/incident, versión de modelo/umbral y runbook. Salida: `normal` | `abstain_more` | `human_only` + target de rollback versionado. Error: seguir en auto durante incidente. Éxito: interruptor human_only documentado y alertas accionables.",
        "En `CASO-LIM-039-T3B`, un pico de score medio sin cambio de intake dispara alerta de calibración: el modo pasa a abstain_more. Si hay incidente T0 de exposición de campos, se fuerza human_only y rollback al ranker anterior. El score nunca se convierte en etiqueta masiva de fraude mientras se investiga.",
      ],
      code: {
        language: 'python',
        title: "ops_modes.py",
        code: `def mode(drift_high, incident):
    if incident:
        return "human_only"
    if drift_high:
        return "abstain_more"
    return "normal"

def rollback_target(prev_model_id):
    return prev_model_id if prev_model_id else "REQUEST_PREV_MODEL"

print(mode(False, True))
print(mode(True, False))
print("rollback", rollback_target("model_previous"))`,
        output: `human_only
abstain_more
rollback model_previous`,
      },
      callout: {
        type: "warning",
        title: "Human-only",
        content:
          "Interruptor documentado en runbook. Prioridad: incident > drift > normal. Rollback apunta a artefacto versionado, no a «el último commit que funcionaba en mi laptop».",
      },
    },
    {
      heading: "Aceptación, demo e2e y regresión N3",
      subtopicId: "S39-T4-A",
      paragraphs: [
        "La aceptación de CP-N3-C no es un screenshot: es una lista de criterios ejecutables sobre fixtures sintéticos. Mínimo: corrida e2e, baseline visible en métricas, camino de abstención, audit log de decisiones, prohibición de auto-label de fraude y smoke de regresión S27–S39 documentado.",
        "Una demo creíble cubre tres caminos, no solo el feliz: happy, override y ood_abstain. Entrada: checklist de aceptación + rutas de demo. Salida: criterios en verde y expediente CF-3 listo para revisor externo. Error: demo solo happy o auto-declarar promoción. Éxito: un evaluador externo repite la demo sin secretos ni datos reales.",
        "Para `CASO-LIM-039-T4A`, la demo en laboratorio muestra (1) caso con packet completo y queue, (2) override humano a skip con audit, (3) entrada **OOD** (out-of-distribution: el caso cae fuera de la distribución de validación) que abstiene. La regresión N3 es una lista de checks de contratos, no un reentrenamiento completo. Dejas el expediente listo; no auto-declaras el cierre del nivel ni el PASS de CF-3.",
      ],
      code: {
        language: 'python',
        title: "acceptance.py",
        code: `def acceptance_bundle() -> dict:
    criteria = [
        "e2e_synthetic_run",
        "baseline_in_metrics",
        "abstention_path",
        "audit_log",
        "no_auto_fraud_label",
        "regression_smoke_s27_s39",
    ]
    return {
        "n_criteria": len(criteria),
        "demo_paths": ["happy", "override", "ood_abstain"],
        "cf3_review": "external",
        "self_declared_promotion": False,
    }

bundle = acceptance_bundle()
print("n_criteria", bundle["n_criteria"])
print("demo_paths", bundle["demo_paths"])
print("cf3_review", bundle["cf3_review"])
print("self_declared_promotion", bundle["self_declared_promotion"])`,
        output: `n_criteria 6
demo_paths ['happy', 'override', 'ood_abstain']
cf3_review external
self_declared_promotion False`,
      },
      callout: {
        type: "info",
        title: "CF-3 / regresión",
        content:
          "Documenta smoke S27–S39 y deja el expediente CF-3 listo. La promoción la confirma un revisor externo; tu script no auto-declara el cierre del nivel.",
      },
    },
    {
      heading: "Model/data/system cards, métricas de valor y postmortem",
      subtopicId: "S39-T4-B",
      paragraphs: [
        "El cierre de nivel exige **cards** legibles: model card (label_space, límites, no auto-fraude), data card (fixtures sintéticos, ventanas, PII minimizada) y system card (modos ops, owners, rollback). Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides, tiempo mediano de review — no solo AUC offline.",
        "Cards y postmortem cierran el aprendizaje del sistema, no la cacería de culpables. Entrada: métricas de valor, plantillas de cards y de postmortem. Salida: tres cards publicables + postmortem blameless (timeline, root_cause, actions). Error: card vacía, solo AUC offline o postmortem con nombres de personas como causa. Éxito: un stakeholder no-ML entiende el score y cuándo interviene un humano.",
        "En `CASO-LIM-039-T4B`, precision_at_k=0.55, override_rate=0.12 y median_review_s=90 cuentan la historia de la cola. Tras un incidente de calibración, el postmortem blameless lista rollback y recalibración. Con cards y notas de regresión, el expediente queda listo para revisión CF-3 — sin auto-declarar promoción.",
      ],
      code: {
        language: 'python',
        title: "value_pm.py",
        code: `def value_metrics(value):
    keys = ("precision_at_k", "override_rate", "median_review_s")
    return all(k in value for k in keys)

def postmortem_ok(pm):
    return (
        pm.get("blameless") is True
        and bool(pm.get("root_cause"))
        and bool(pm.get("actions"))
    )

value = {
    "precision_at_k": 0.55,
    "override_rate": 0.12,
    "median_review_s": 90,
}
postmortem = {
    "timeline": "T0-T3",
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
    "blameless": True,
}
card_types = sorted(["model", "data", "system"])
print(value if value_metrics(value) else {})
print(postmortem["root_cause"] if postmortem_ok(postmortem) else "missing")
print("cards", card_types)`,
        output: `{'precision_at_k': 0.55, 'override_rate': 0.12, 'median_review_s': 90}
calib_drift
cards ['data', 'model', 'system']`,
      },
      callout: {
        type: "tip",
        title: "Valor",
        content:
          "Negocio entiende overrides y tiempo de review, no solo AUC. Cards sin límites del label_space son incompletas.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre del nivel N3: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor — siempre con fixtures sintéticos y sin auto-declarar promoción ni CF-3.",
    steps: [
      {
        demoId: "S39-T1-A-DEMO",
        subtopicId: "S39-T1-A",
        environment: "local-python",
        description: "Pipeline canónico N3: stages derivados del run, label_space needs_review y auto_fraud en false sobre CASO-LIM-039.",
        code: {
          language: 'python',
          title: "pipe_demo.py",
          code: `def build_run(case_id: str, score: float) -> dict:
    stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
    return {
        "case_id": case_id,
        "stages": stages,
        "score": score,
        "label_space": "needs_review",
        "auto_fraud": False,
    }

run = build_run("CASO-LIM-039", 0.66)
print(" > ".join(run["stages"]))
print("label_space", run["label_space"])
print("auto_fraud", run["auto_fraud"])`,
          output: `intake > er > relation_graph > features > model_score > queue
label_space needs_review
auto_fraud False`,
        },
        why: "Hace observable el flujo intake→cola con el label correcto: prioridad de revisión, no veredicto de fraude ni parentesco.",
      },
      {
        demoId: "S39-T1-B-DEMO",
        subtopicId: "S39-T1-B",
        environment: "local-python",
        description: "Registry mínimo: conteo de owners y política semver derivados de metadatos de artefactos.",
        code: {
          language: 'python',
          title: "reg_demo.py",
          code: `def registry_ok(reg: dict) -> bool:
    return all(meta.get("owner") for meta in reg.values()) and len(reg) >= 2

def semver_policy(breaking: bool) -> str:
    return "major_on_breaking" if breaking else "patch_or_minor"

reg = {
    "er_engine": {"ver": "1.2.0", "owner": "dq", "breaking": False},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk", "breaking": True},
}
print(len({m["owner"] for m in reg.values()}))
print("semver_policy", semver_policy(any(m.get("breaking") for m in reg.values())))
print("owner_required", registry_ok(reg))`,
          output: `2
semver_policy major_on_breaking
owner_required True`,
        },
        why: "Ownership y semver son el contrato de evolución del triage: sin ellos no hay on-call ni regresión confiable.",
      },
      {
        demoId: "S39-T2-A-DEMO",
        subtopicId: "S39-T2-A",
        environment: "local-python",
        description: "Evidence packet: claves mínimas, capas contadas y bucket de prioridad por umbrales calibrados.",
        code: {
          language: 'python',
          title: "pkt_demo.py",
          code: `def packet_keys(keys):
    return sorted(keys)

def priority_bucket(score: float, thr_hi: float, thr_lo: float) -> str:
    if score >= thr_hi:
        return "queue_now"
    if score >= thr_lo:
        return "queue_batch"
    return "skip"

keys = packet_keys(["case_id", "score", "evidence", "graph_path"])
layers = len(keys)
score_alone_ok = keys == ["score"]
print(keys)
print("layers", layers)
print("score_alone_ok", score_alone_ok)
print("bucket", priority_bucket(0.81, 0.75, 0.40))`,
          output: `['case_id', 'evidence', 'graph_path', 'score']
layers 4
score_alone_ok False
bucket queue_now`,
        },
        why: "El revisor necesita path y evidencia; el score solo no constituye workbench. El umbral calibrado ordena capacidad de cola.",
      },
      {
        demoId: "S39-T2-B-DEMO",
        subtopicId: "S39-T2-B",
        environment: "local-python",
        description: "Override humano a skip con flag de audit y conteo de overrides derivados del log.",
        code: {
          language: 'python',
          title: "dec_demo.py",
          code: `log = []

def decide(case_id: str, score: float, human=None) -> str:
    auto = "queue" if score >= 0.7 else "skip"
    final = human if human is not None else auto
    log.append({"case_id": case_id, "final": final, "override": human is not None, "audit": True})
    return final

print(decide("CASO-LIM-039-T2B", 0.9, human="skip"))
print("n_overrides", sum(1 for e in log if e["override"]))
print("audit", all(e["audit"] for e in log if e["override"]))`,
          output: `skip
n_overrides 1
audit True`,
        },
        why: "El override gana al auto y debe quedar auditado; sin log no hay control humano verificable.",
      },
      {
        demoId: "S39-T3-A-DEMO",
        subtopicId: "S39-T3-A",
        environment: "local-python",
        description: "Checklist de release: release_ok derivado de flags (sin secretos, sin auto-fraude).",
        code: {
          language: 'python',
          title: "risk_demo.py",
          code: `checklist = {
    "secrets_in_repo": False,
    "auto_fraud": False,
    "rbac": True,
    "pii_minimized": True,
}

def risk_release_ok(c: dict) -> bool:
    return (not c["secrets_in_repo"]) and (not c["auto_fraud"]) and c["rbac"] and c["pii_minimized"]

print(risk_release_ok(checklist))
print("secrets_in_repo", checklist["secrets_in_repo"])
print("auto_fraud", checklist["auto_fraud"])`,
          output: `True
secrets_in_repo False
auto_fraud False`,
        },
        why: "Release responsable del triage bloquea secretos y prohíbe etiquetas automáticas de fraude.",
      },
      {
        demoId: "S39-T3-B-DEMO",
        subtopicId: "S39-T3-B",
        environment: "local-python",
        description: "Modo human_only ante incidente y target de rollback derivado del artefacto previo.",
        code: {
          language: 'python',
          title: "ops_demo.py",
          code: `def ops_mode(incident: bool, drift_high: bool) -> str:
    if incident:
        return "human_only"
    if drift_high:
        return "abstain_more"
    return "normal"

ops = {"incident": True, "drift_high": False, "prev_model": "prev_model"}
mode = ops_mode(ops["incident"], ops["drift_high"])
rollback = ops["prev_model"] if mode == "human_only" else "n/a"
priority = "incident_over_drift" if ops_mode(True, True) == "human_only" else "drift_first"
print(mode)
print("rollback", rollback)
print("priority", priority)`,
          output: `human_only
rollback prev_model
priority incident_over_drift`,
        },
        why: "Ante incidente, fail-closed a human_only y rollback versionado; el throughput no manda sobre seguridad.",
      },
      {
        demoId: "S39-T4-A-DEMO",
        subtopicId: "S39-T4-A",
        environment: "local-python",
        description: "Seis criterios de aceptación contados, scope de regresión S27–S39 y CF-3 con revisión externa.",
        code: {
          language: 'python',
          title: "acc_demo.py",
          code: `criteria = [
    "e2e_synthetic_run",
    "baseline_in_metrics",
    "abstention_path",
    "audit_log",
    "no_auto_fraud_label",
    "regression_smoke_s27_s39",
]
gate_notes = {
    "regression_scope": "S27-S39",
    "cf3_review": "external",
    "self_declared_promotion": False,
}
print(len(criteria))
print("regression", gate_notes["regression_scope"])
print("cf3_review", gate_notes["cf3_review"])
print("self_declared_promotion", gate_notes["self_declared_promotion"])`,
          output: `6
regression S27-S39
cf3_review external
self_declared_promotion False`,
        },
        why: "Aceptación medible y regresión documentada; la promoción la confirma un revisor externo sobre el expediente.",
      },
      {
        demoId: "S39-T4-B-DEMO",
        subtopicId: "S39-T4-B",
        environment: "local-python",
        description: "Métricas de valor operativo, tres cards y postmortem blameless derivados de estructuras.",
        code: {
          language: 'python',
          title: "val_demo.py",
          code: `def postmortem_ready(pm: dict) -> bool:
    return (
        pm.get("blameless") is True
        and bool(pm.get("root_cause"))
        and bool(pm.get("actions"))
    )

value = {
    "precision_at_k": 0.55,
    "override_rate": 0.12,
    "median_review_s": 90,
}
cards = sorted(["model", "data", "system"])
postmortem = {
    "blameless": True,
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
}
print(list(value.keys()))
print(cards)
print("postmortem", postmortem_ready(postmortem))`,
          output: `['precision_at_k', 'override_rate', 'median_review_s']
['data', 'model', 'system']
postmortem True`,
        },
        why: "Cierre de nivel con valor de negocio, cards y postmortem blameless listos para CF-3.",
      },
    ],
  },
  weDo: {
    intro: "S39 · Laboratorio Responsible ML Case Triage (CASO-LIM-039, sintético Perú): 24 retos locales. E1 repara un predicado de dominio, E2 separa válido/adverso/missing y E3 demuestra fail-closed con tokens de error exactos. Sin auto-fraude ni auto-declarar promoción de nivel.",
    steps: [
      {
        id: "S39-T1-A-E1",
        subtopicId: "S39-T1-A",
        kind: "guided",
        instruction:
          "S39-T1-A-E1 · Valida el contrato del pipeline canónico N3 sobre `CASO-LIM-039-T1A`. Entrada: dict con stages (lista ordenada), label_space y auto_fraud. Debe exigir el orden intake→er→relation_graph→features→model_score→queue, label_space needs_review y auto_fraud False. El starter compara el orden al revés (defecto). Salida exacta: `S39-T1-A PASS`. El fixture adverso de E2 activará `REJECT_STAGE_ORDER`.",
        hint: "Compara stages con la tupla canónica; no inviertas el orden ni cambies los datos del fixture.",
        hints: [
          "Compara stages con la tupla canónica; no inviertas el orden ni cambies los datos del fixture.",
          "label_space debe ser exactamente needs_review y auto_fraud debe ser False (score ≠ fraude).",
        ],
        edgeCases: ["stages en orden inverso", "label_space fraud_certainty", "CASO-LIM-039-T1A sintético"],
        tests: "Fixture válido imprime `S39-T1-A PASS` y el assert booleano pasa.",
        feedback: "S39-T1-A-E1: el orden de stages y el label_space definen el contrato; el score no autoriza auto_fraud.",
        starterCode: {
          language: 'python',
          title: "s39-t1-a-e1.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
record = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
}
# DEFECTO: compara contra el orden invertido
meets = record["stages"] == list(reversed(CANON)) and record["label_space"] == "needs_review"
status = "PASS" if meets else "REJECT_STAGE_ORDER"
print("S39-T1-A", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-a-e1.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
record = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
}
meets = (
    record["stages"] == CANON
    and record["label_space"] == "needs_review"
    and record["auto_fraud"] is False
)
status = "PASS" if meets else "REJECT_STAGE_ORDER"
print("S39-T1-A", status)
assert meets is True
`,
          output: `S39-T1-A PASS`,
        },
      },
      {
        id: "S39-T1-A-E2",
        subtopicId: "S39-T1-A",
        kind: "independent",
        instruction:
          "S39-T1-A-E2 · Modela tres rutas del pipeline N3: fixture válido, stages en orden adverso y registro sin label_space. Entrada: dict con case_id, stages, label_space, auto_fraud. Salidas exactas: `PASS`, `REJECT_STAGE_ORDER`, `MISSING:label_space`. El starter invierte la comparación de orden; corrige solo la decisión de dominio y conserva el chequeo de missing.",
        hint: "Primero calcula missing de campos requeridos; no evalúes stages si falta label_space.",
        hints: [
          "Primero calcula missing de campos requeridos; no evalúes stages si falta label_space.",
          "El adverso tiene stages al revés: debe fallar por contenido (REJECT_STAGE_ORDER), no por schema.",
        ],
        edgeCases: ["stages invertidos", "falta label_space", "auto_fraud True es adverso de política"],
        tests: "Salida exacta: PASS REJECT_STAGE_ORDER MISSING:label_space",
        feedback: "S39-T1-A-E2: separa schema incompleto de orden incorrecto; ambos bloquean cola, con tokens distintos.",
        starterCode: {
          language: 'python',
          title: "s39-t1-a-e2.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]

def assess(record: dict) -> str:
    required = {"case_id", "stages", "label_space", "auto_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: acepta el orden invertido
    ok = record["stages"] == list(reversed(CANON)) and record["label_space"] == "needs_review"
    return "PASS" if ok else "REJECT_STAGE_ORDER"

valid = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
}
invalid = {**valid, "stages": list(reversed(CANON))}
incomplete = {k: v for k, v in valid.items() if k != "label_space"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-a-e2.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]

def assess(record: dict) -> str:
    required = {"case_id", "stages", "label_space", "auto_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record["stages"] == CANON
        and record["label_space"] == "needs_review"
        and record["auto_fraud"] is False
    )
    return "PASS" if ok else "REJECT_STAGE_ORDER"

valid = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
}
invalid = {**valid, "stages": list(reversed(CANON))}
incomplete = {k: v for k, v in valid.items() if k != "label_space"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_STAGE_ORDER MISSING:label_space`,
        },
      },
      {
        id: "S39-T1-A-E3",
        subtopicId: "S39-T1-A",
        kind: "transfer",
        instruction:
          "S39-T1-A-E3 · Fail-closed del pipeline: válido → `CONTINUE`, stages adversos → `REJECT_STAGE_ORDER`, ER pretendiendo parentesco (`er_claims_parentesco=True`) → `REJECT_ER_SCOPE`, y falta de stages → `REQUEST_STAGE_LIST`. El starter continúa en todos los casos y no detecta el abuso de alcance de ER. Corrige sin rellenar evidencia inventada.",
        hint: "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
        hints: [
          "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
          "ER solo habla de misma entidad; er_claims_parentesco True es REJECT_ER_SCOPE aunque el orden de stages sea correcto.",
        ],
        edgeCases: ["er_claims_parentesco", "stages faltantes", "orden invertido"],
        tests: "Salida: CONTINUE REJECT_STAGE_ORDER REJECT_ER_SCOPE REQUEST_STAGE_LIST",
        feedback: "S39-T1-A-E3: el alcance de ER es misma entidad; parentesco y fraude no se infieren del pipeline.",
        starterCode: {
          language: 'python',
          title: "s39-t1-a-e3.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]

def decide(record: dict) -> str:
    if "stages" not in record:
        return "CONTINUE"  # DEFECTO: debería pedir lista
    if record.get("er_claims_parentesco"):
        return "CONTINUE"  # DEFECTO: debería rechazar alcance
    return "CONTINUE" if record["stages"] != CANON else "CONTINUE"

valid = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
    "er_claims_parentesco": False,
}
bad_order = {**valid, "stages": list(reversed(CANON))}
bad_scope = {**valid, "er_claims_parentesco": True}
missing = {"case_id": "CASO-LIM-039-T1A", "label_space": "needs_review"}
print(*[decide(r) for r in (valid, bad_order, bad_scope, missing)])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-a-e3.py",
          code: `CANON = ["intake", "er", "relation_graph", "features", "model_score", "queue"]

def decide(record: dict) -> str:
    if "stages" not in record:
        return "REQUEST_STAGE_LIST"
    if record.get("er_claims_parentesco"):
        return "REJECT_ER_SCOPE"
    if record["stages"] != CANON:
        return "REJECT_STAGE_ORDER"
    if record.get("label_space") != "needs_review" or record.get("auto_fraud"):
        return "REJECT_STAGE_ORDER"
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-039-T1A",
    "stages": list(CANON),
    "label_space": "needs_review",
    "auto_fraud": False,
    "er_claims_parentesco": False,
}
bad_order = {**valid, "stages": list(reversed(CANON))}
bad_scope = {**valid, "er_claims_parentesco": True}
missing = {"case_id": "CASO-LIM-039-T1A", "label_space": "needs_review"}
results = [decide(r) for r in (valid, bad_order, bad_scope, missing)]
print(*results)
assert results == [
    "CONTINUE",
    "REJECT_STAGE_ORDER",
    "REJECT_ER_SCOPE",
    "REQUEST_STAGE_LIST",
]
`,
          output: `CONTINUE REJECT_STAGE_ORDER REJECT_ER_SCOPE REQUEST_STAGE_LIST`,
        },
      },
      {
        id: "S39-T1-B-E1",
        subtopicId: "S39-T1-B",
        kind: "guided",
        instruction:
          "S39-T1-B-E1 · Valida el contrato de ownership y semver sobre `CASO-LIM-039-T1B`. Entrada: dict artifact con name, ver, owner y breaking. Si breaking es True, bump debe ser `major`; owner no vacío. El starter exige bump `minor` ante breaking (defecto). Salida exacta: `S39-T1-B PASS`. El adverso de E2 activará `REJECT_BUMP_POLICY`.",
        hint: "Breaking change → major. Owner vacío o None falla el contrato aunque el bump sea correcto.",
        hints: [
          "Breaking change → major. Owner vacío o None falla el contrato aunque el bump sea correcto.",
          "No alteres el fixture; corrige solo la expresión booleana del predicado.",
        ],
        edgeCases: ["breaking con bump minor", "owner vacío", "CASO-LIM-039-T1B sintético"],
        tests: "Imprime `S39-T1-B PASS` cuando bump=major, owner presente y breaking True.",
        feedback: "S39-T1-B-E1: semver y owner son el contrato de evolución; patch/minor no cubren breaking.",
        starterCode: {
          language: 'python',
          title: "s39-t1-b-e1.py",
          code: `record = {
    "case_id": "CASO-LIM-039-T1B",
    "name": "graph_schema",
    "ver": "3.0.0",
    "owner": "investigations",
    "breaking": True,
    "bump": "major",
}
# DEFECTO: exige minor ante breaking
meets = record["breaking"] and record["bump"] == "minor" and bool(record["owner"])
status = "PASS" if meets else "REJECT_BUMP_POLICY"
print("S39-T1-B", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-b-e1.py",
          code: `record = {
    "case_id": "CASO-LIM-039-T1B",
    "name": "graph_schema",
    "ver": "3.0.0",
    "owner": "investigations",
    "breaking": True,
    "bump": "major",
}
meets = record["breaking"] is True and record["bump"] == "major" and bool(record["owner"])
status = "PASS" if meets else "REJECT_BUMP_POLICY"
print("S39-T1-B", status)
assert meets is True
`,
          output: `S39-T1-B PASS`,
        },
      },
      {
        id: "S39-T1-B-E2",
        subtopicId: "S39-T1-B",
        kind: "independent",
        instruction:
          "S39-T1-B-E2 · Tres rutas de registry: artefacto válido (breaking+major+owner), adverso (breaking+minor) y sin owner. Entrada: name, ver, owner, breaking, bump. Salidas exactas: `PASS`, `REJECT_BUMP_POLICY`, `MISSING:owner`. Corrige el predicado invertido del starter y mantén el orden missing-antes-de-contenido.",
        hint: "Si falta owner, devuelve MISSING:owner sin mirar bump.",
        hints: [
          "Si falta owner, devuelve MISSING:owner sin mirar bump.",
          "Si breaking y bump != major → REJECT_BUMP_POLICY aunque haya owner.",
        ],
        edgeCases: ["owner ausente", "breaking con patch", "registry de 4 artefactos conceptual"],
        tests: "Salida: PASS REJECT_BUMP_POLICY MISSING:owner",
        feedback: "S39-T1-B-E2: owner y major bump son independientes; faltantes y políticas no se confunden.",
        starterCode: {
          language: 'python',
          title: "s39-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"name", "ver", "owner", "breaking", "bump"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: acepta minor ante breaking
    ok = (not record["breaking"]) or record["bump"] == "minor"
    return "PASS" if ok and bool(record["owner"]) else "REJECT_BUMP_POLICY"

valid = {
    "case_id": "CASO-LIM-039-T1B",
    "name": "ranker",
    "ver": "2.1.0",
    "owner": "ml-risk",
    "breaking": True,
    "bump": "major",
}
invalid = {**valid, "bump": "minor"}
incomplete = {k: v for k, v in valid.items() if k != "owner"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"name", "ver", "owner", "breaking", "bump"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if not record["owner"]:
        return "MISSING:owner"
    if record["breaking"] and record["bump"] != "major":
        return "REJECT_BUMP_POLICY"
    return "PASS"

valid = {
    "case_id": "CASO-LIM-039-T1B",
    "name": "ranker",
    "ver": "2.1.0",
    "owner": "ml-risk",
    "breaking": True,
    "bump": "major",
}
invalid = {**valid, "bump": "minor"}
incomplete = {k: v for k, v in valid.items() if k != "owner"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_BUMP_POLICY MISSING:owner`,
        },
      },
      {
        id: "S39-T1-B-E3",
        subtopicId: "S39-T1-B",
        kind: "transfer",
        instruction:
          "S39-T1-B-E3 · Evalúa un registry de cuatro artefactos sintéticos en tres rutas visibles. Happy: todos con owner y bump correcto → imprime `CONTINUE` y `n_art=4`. Adverso sin owner en `ranker` → `ESCALATE_NO_OWNER`. Breaking con bump `minor` en `graph_schema` → `REJECT_BUMP_POLICY`. El starter ignora owners vacíos y usa `len(registry) - 1` (off-by-one). Salida exacta: `CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY`.",
        hint: "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea el registry entero.",
        hints: [
          "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea el registry entero.",
          "n_art es len(registry) (=4). Corrige el off-by-one del starter y valida owner + bump major ante breaking.",
        ],
        edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto"],
        tests: "Salida: CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY",
        feedback: "S39-T1-B-E3: el registry es un conjunto: basta un artefacto sin owner para escalar.",
        starterCode: {
          language: 'python',
          title: "s39-t1-b-e3.py",
          code: `# CASO-LIM-039 · registry owners+bump
# DEFECTO: decide no valida owners ni bump
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality", "breaking": False, "bump": "patch"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations", "breaking": True, "bump": "major"},
    "feature_set": {"ver": "3.0.0", "owner": "ml-platform", "breaking": False, "bump": "minor"},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk", "breaking": False, "bump": "patch"},
}

def decide(reg: dict) -> str:
    # DEFECTO: no valida owners ni bump
    return "CONTINUE"

# Tres rutas visibles: happy (CONTINUE 4), sin owner, breaking sin major
no_owner = {**registry, "ranker": {**registry["ranker"], "owner": ""}}
bad_bump = {**registry, "graph_schema": {**registry["graph_schema"], "bump": "minor"}}
# Happy path: imprime CONTINUE 4 (corrige el off-by-one y las validaciones)
print(decide(registry), len(registry) - 1, decide(no_owner), decide(bad_bump))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-b-e3.py",
          code: `registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality", "breaking": False, "bump": "patch"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations", "breaking": True, "bump": "major"},
    "feature_set": {"ver": "3.0.0", "owner": "ml-platform", "breaking": False, "bump": "minor"},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk", "breaking": False, "bump": "patch"},
}

def decide(reg: dict) -> str:
    for meta in reg.values():
        if not meta.get("owner"):
            return "ESCALATE_NO_OWNER"
        if meta.get("breaking") and meta.get("bump") != "major":
            return "REJECT_BUMP_POLICY"
    return "CONTINUE"

status = decide(registry)
n_art = len(registry)
no_owner = {**registry, "ranker": {**registry["ranker"], "owner": ""}}
bad_bump = {**registry, "graph_schema": {**registry["graph_schema"], "bump": "minor"}}
assert status == "CONTINUE" and n_art == 4
assert decide(no_owner) == "ESCALATE_NO_OWNER"
assert decide(bad_bump) == "REJECT_BUMP_POLICY"
print(status, n_art, decide(no_owner), decide(bad_bump))
`,
          output: `CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY`,
        },
      },
      {
        id: "S39-T2-A-E1",
        subtopicId: "S39-T2-A",
        kind: "guided",
        instruction:
          "S39-T2-A-E1 · Valida el evidence packet mínimo de `CASO-LIM-039-T2A`. Entrada: dict con case_id, score, evidence (lista no vacía) y graph_path (lista no vacía). El starter solo exige score > 0 (defecto: score alone). Salida exacta: `S39-T2-A PASS`. El adverso de E2 activará `REJECT_PACKET_INCOMPLETE`.",
        hint: "evidence y graph_path deben ser listas con al menos un elemento; score solo no basta.",
        hints: [
          "evidence y graph_path deben ser listas con al menos un elemento; score solo no basta.",
          "No cambies los datos del fixture feliz; corrige el predicado meets_contract.",
        ],
        edgeCases: ["evidence vacía", "sin graph_path", "solo score"],
        tests: "Imprime `S39-T2-A PASS` cuando el packet tiene las cuatro claves mínimas útiles.",
        feedback: "S39-T2-A-E1: packet mínimo = case_id + score + evidence + graph_path accionables.",
        starterCode: {
          language: 'python',
          title: "s39-t2-a-e1.py",
          code: `packet = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
}
# DEFECTO: solo mira el score
meets = packet.get("score", 0) > 0
status = "PASS" if meets else "REJECT_PACKET_INCOMPLETE"
print("S39-T2-A", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-a-e1.py",
          code: `packet = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
}
meets = (
    bool(packet.get("case_id"))
    and "score" in packet
    and isinstance(packet.get("evidence"), list)
    and len(packet["evidence"]) > 0
    and isinstance(packet.get("graph_path"), list)
    and len(packet["graph_path"]) > 0
)
status = "PASS" if meets else "REJECT_PACKET_INCOMPLETE"
print("S39-T2-A", status)
assert meets is True
`,
          output: `S39-T2-A PASS`,
        },
      },
      {
        id: "S39-T2-A-E2",
        subtopicId: "S39-T2-A",
        kind: "independent",
        instruction:
          "S39-T2-A-E2 · Tres packets: completo, adverso (evidence=[]), y sin graph_path. Entrada: case_id, score, evidence, graph_path. Salidas exactas: `PASS`, `REJECT_PACKET_INCOMPLETE`, `MISSING:graph_path`. El starter trata evidence vacía como PASS; corrige el predicado y el missing check.",
        hint: "Missing de clave ≠ lista vacía: tokens distintos (MISSING vs REJECT_PACKET_INCOMPLETE).",
        hints: [
          "Missing de clave ≠ lista vacía: tokens distintos (MISSING vs REJECT_PACKET_INCOMPLETE).",
          "score alone nunca es PASS aunque sea 0.99.",
        ],
        edgeCases: ["evidence vacía", "graph_path ausente", "score alto sin path"],
        tests: "Salida: PASS REJECT_PACKET_INCOMPLETE MISSING:graph_path",
        feedback: "S39-T2-A-E2: el revisor no puede trabajar con score huérfano ni path omitido.",
        starterCode: {
          language: 'python',
          title: "s39-t2-a-e2.py",
          code: `def assess(packet: dict) -> str:
    required = {"case_id", "score", "evidence", "graph_path"}
    missing = sorted(required - packet.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: no valida listas no vacías
    return "PASS"

valid = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
}
invalid = {**valid, "evidence": []}
incomplete = {k: v for k, v in valid.items() if k != "graph_path"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-a-e2.py",
          code: `def assess(packet: dict) -> str:
    required = {"case_id", "score", "evidence", "graph_path"}
    missing = sorted(required - packet.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if not packet["evidence"] or not packet["graph_path"]:
        return "REJECT_PACKET_INCOMPLETE"
    return "PASS"

valid = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
}
invalid = {**valid, "evidence": []}
incomplete = {k: v for k, v in valid.items() if k != "graph_path"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_PACKET_INCOMPLETE MISSING:graph_path`,
        },
      },
      {
        id: "S39-T2-A-E3",
        subtopicId: "S39-T2-A",
        kind: "transfer",
        instruction:
          "S39-T2-A-E3 · Workbench fail-closed sobre tres fixtures: packet OK → `CONTINUE` y layers=4; score-only → `REJECT_SCORE_ALONE`; sin uncertainty → `REQUEST_UNCERTAINTY`. El starter siempre continúa y reporta layers=1. Salida exacta de la línea: `CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY`. No inventes path si no viene en el fixture adverso.",
        hint: "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
        hints: [
          "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
          "uncertainty ausente es incertidumbre de contrato → REQUEST_UNCERTAINTY, no inventes in_distribution.",
        ],
        edgeCases: ["solo score", "sin uncertainty", "evidence vacía"],
        tests: "Salida: CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY",
        feedback: "S39-T2-A-E3: explicación en capas exige evidencia; no enmascares gaps del packet.",
        starterCode: {
          language: 'python',
          title: "s39-t2-a-e3.py",
          code: `def decide(packet: dict):
    # DEFECTO: siempre continúa
    return "CONTINUE", 1

ok = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
}
score_only = {"case_id": "CASO-LIM-039-T2A", "score": 0.99}
no_unc = {k: v for k, v in ok.items() if k != "uncertainty"}
# Tres rutas visibles: corrige decide() para happy/adverso/missing
print(*decide(ok), decide(score_only)[0], decide(no_unc)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-a-e3.py",
          code: `def decide(packet: dict):
    if set(packet.keys()) <= {"case_id", "score"} or (
        "evidence" not in packet and "graph_path" not in packet
    ):
        return "REJECT_SCORE_ALONE", 0
    if "uncertainty" not in packet:
        return "REQUEST_UNCERTAINTY", 0
    if not packet.get("evidence") or not packet.get("graph_path"):
        return "REJECT_SCORE_ALONE", 0
    return "CONTINUE", 4

ok = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
}
score_only = {"case_id": "CASO-LIM-039-T2A", "score": 0.99}
no_unc = {k: v for k, v in ok.items() if k != "uncertainty"}
assert decide(ok) == ("CONTINUE", 4)
assert decide(score_only)[0] == "REJECT_SCORE_ALONE"
assert decide(no_unc)[0] == "REQUEST_UNCERTAINTY"
print(*decide(ok), decide(score_only)[0], decide(no_unc)[0])
`,
          output: `CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY`,
        },
      },
      {
        id: "S39-T2-B-E1",
        subtopicId: "S39-T2-B",
        kind: "guided",
        instruction:
          "S39-T2-B-E1 · Aplica override humano sobre `CASO-LIM-039-T2B`. Entrada: score, threshold, human_action. Si hay human_action, final=human_action y override=True; si no, auto queue/skip por umbral. El starter ignora el humano y siempre usa auto (defecto). Salida exacta: `S39-T2-B PASS` cuando final es skip con override True ante human_action=skip.",
        hint: "human_action no nulo gana siempre; debe setear override True en el evento de audit conceptual.",
        hints: [
          "human_action no nulo gana siempre; debe setear override True en el evento de audit conceptual.",
          "No borres el score; solo corrige la precedencia de la decisión final.",
        ],
        edgeCases: ["human skip con score alto", "sin human → auto queue", "sin audit conceptual"],
        tests: "Imprime `S39-T2-B PASS` con final skip y override True.",
        feedback: "S39-T2-B-E1: override humano gana al auto; el score solo sugiere, no ordena al revisor.",
        starterCode: {
          language: 'python',
          title: "s39-t2-b-e1.py",
          code: `record = {
    "case_id": "CASO-LIM-039-T2B",
    "score": 0.9,
    "threshold": 0.7,
    "human_action": "skip",
}
auto = "queue" if record["score"] >= record["threshold"] else "skip"
# DEFECTO: ignora humano
final = auto
override = False
meets = final == "skip" and override is True
status = "PASS" if meets else "REJECT_OVERRIDE"
print("S39-T2-B", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-b-e1.py",
          code: `record = {
    "case_id": "CASO-LIM-039-T2B",
    "score": 0.9,
    "threshold": 0.7,
    "human_action": "skip",
}
auto = "queue" if record["score"] >= record["threshold"] else "skip"
final = record["human_action"] if record["human_action"] is not None else auto
override = record["human_action"] is not None
meets = final == "skip" and override is True
status = "PASS" if meets else "REJECT_OVERRIDE"
print("S39-T2-B", status)
assert meets is True
`,
          output: `S39-T2-B PASS`,
        },
      },
      {
        id: "S39-T2-B-E2",
        subtopicId: "S39-T2-B",
        kind: "independent",
        instruction:
          "S39-T2-B-E2 · Tres decisiones: auto queue sin humano (`PASS` con final queue), override a skip (`PASS` con override), y apelación sin second_reviewer (`MISSING:second_reviewer`). Entrada: score, threshold, human_action, appeal, second_reviewer. El starter no exige second_reviewer en apelación. Salidas: `queue`, `skip`, `MISSING:second_reviewer` en la línea impresa de resultados de acción/estado.",
        hint: "Si appeal True y no hay second_reviewer → MISSING:second_reviewer antes de cerrar.",
        hints: [
          "Si appeal True y no hay second_reviewer → MISSING:second_reviewer antes de cerrar.",
          "Override solo aplica cuando human_action no es None; imprime la acción final o el missing.",
        ],
        edgeCases: ["apelación sin segundo revisor", "override a skip", "auto por umbral"],
        tests: "Salida: queue skip MISSING:second_reviewer",
        feedback: "S39-T2-B-E2: apelación exige segundo par de ojos; override exige acción humana explícita.",
        starterCode: {
          language: 'python',
          title: "s39-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    if record.get("appeal"):
        return "reopen"  # DEFECTO: no exige second_reviewer
    auto = "queue" if record["score"] >= record["threshold"] else "skip"
    if record.get("human_action") is not None:
        return record["human_action"]
    return auto

base = {"case_id": "CASO-LIM-039-T2B", "score": 0.9, "threshold": 0.7, "human_action": None, "appeal": False}
auto_q = dict(base)
override = {**base, "human_action": "skip"}
appeal = {**base, "appeal": True}
print(assess(auto_q), assess(override), assess(appeal))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    if record.get("appeal"):
        if not record.get("second_reviewer"):
            return "MISSING:second_reviewer"
        return "reopen"
    auto = "queue" if record["score"] >= record["threshold"] else "skip"
    if record.get("human_action") is not None:
        return record["human_action"]
    return auto

base = {
    "case_id": "CASO-LIM-039-T2B",
    "score": 0.9,
    "threshold": 0.7,
    "human_action": None,
    "appeal": False,
}
auto_q = dict(base)
override = {**base, "human_action": "skip"}
appeal = {**base, "appeal": True}
print(assess(auto_q), assess(override), assess(appeal))
`,
          output: `queue skip MISSING:second_reviewer`,
        },
      },
      {
        id: "S39-T2-B-E3",
        subtopicId: "S39-T2-B",
        kind: "transfer",
        instruction:
          "S39-T2-B-E3 · Audit log de feedback sobre tres eventos: happy con leakage_care → `LOGGED True`; override sin audit_entry → `REJECT_NO_AUDIT`; feedback sin feedback_id → `REQUEST_FEEDBACK_ID`. El starter marca LOGGED aunque no haya audit. Salida exacta: `LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID`.",
        hint: "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
        hints: [
          "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
          "leakage_care True es obligatorio al loguear feedback hacia datasets o reglas.",
        ],
        edgeCases: ["override sin audit", "feedback sin id", "leakage_care False"],
        tests: "Salida: LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID",
        feedback: "S39-T2-B-E3: feedback y override solo cuentan si el audit es completo y sin leakage.",
        starterCode: {
          language: 'python',
          title: "s39-t2-b-e3.py",
          code: `def decide(event: dict):
    # DEFECTO: siempre loguea
    return "LOGGED", True

happy = {
    "case_id": "CASO-LIM-039-T2B",
    "override": True,
    "audit_entry": True,
    "feedback": True,
    "feedback_id": "fb-01",
    "leakage_care": True,
}
no_audit = {**happy, "audit_entry": False}
no_fb_id = {**happy, "feedback_id": None}
print(*decide(happy), decide(no_audit)[0], decide(no_fb_id)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t2-b-e3.py",
          code: `def decide(event: dict):
    if event.get("override") and not event.get("audit_entry"):
        return "REJECT_NO_AUDIT", False
    if event.get("feedback") and not event.get("feedback_id"):
        return "REQUEST_FEEDBACK_ID", False
    if event.get("feedback") and not event.get("leakage_care"):
        return "REJECT_NO_AUDIT", False
    return "LOGGED", True

happy = {
    "case_id": "CASO-LIM-039-T2B",
    "override": True,
    "audit_entry": True,
    "feedback": True,
    "feedback_id": "fb-01",
    "leakage_care": True,
}
no_audit = {**happy, "audit_entry": False}
no_fb_id = {**happy, "feedback_id": None}
assert decide(happy) == ("LOGGED", True)
assert decide(no_audit)[0] == "REJECT_NO_AUDIT"
assert decide(no_fb_id)[0] == "REQUEST_FEEDBACK_ID"
print(*decide(happy), decide(no_audit)[0], decide(no_fb_id)[0])
`,
          output: `LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID`,
        },
      },
      {
        id: "S39-T3-A-E1",
        subtopicId: "S39-T3-A",
        kind: "guided",
        instruction:
          "S39-T3-A-E1 · Evalúa el checklist de release de `CASO-LIM-039-T3A`. Entrada: dict con pii_minimized, rbac, secrets_in_repo, slice_metrics, input_limits. release_ok exige todos True salvo secrets_in_repo que debe ser False. El starter trata secrets_in_repo True como aceptable (defecto grave). Salida exacta: `S39-T3-A PASS` en el fixture limpio.",
        hint: "not secrets_in_repo es obligatorio; un True bloquea aunque el resto esté verde.",
        hints: [
          "not secrets_in_repo es obligatorio; un True bloquea aunque el resto esté verde.",
          "No borres campos del checklist; corrige solo el predicado all(...).",
        ],
        edgeCases: ["secrets_in_repo True", "rbac False", "sin slice_metrics"],
        tests: "Imprime `S39-T3-A PASS` cuando el checklist limpio cumple el contrato.",
        feedback: "S39-T3-A-E1: secretos en repo son blocker duro del release del triage.",
        starterCode: {
          language: 'python',
          title: "s39-t3-a-e1.py",
          code: `checklist = {
    "case_id": "CASO-LIM-039-T3A",
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
}
# DEFECTO: no niega secrets_in_repo
meets = all([
    checklist["pii_minimized"],
    checklist["rbac"],
    checklist["secrets_in_repo"],
    checklist["slice_metrics"],
    checklist["input_limits"],
])
status = "PASS" if meets else "REJECT_RELEASE"
print("S39-T3-A", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-a-e1.py",
          code: `checklist = {
    "case_id": "CASO-LIM-039-T3A",
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
}
meets = all([
    checklist["pii_minimized"],
    checklist["rbac"],
    not checklist["secrets_in_repo"],
    checklist["slice_metrics"],
    checklist["input_limits"],
])
status = "PASS" if meets else "REJECT_RELEASE"
print("S39-T3-A", status)
assert meets is True
`,
          output: `S39-T3-A PASS`,
        },
      },
      {
        id: "S39-T3-A-E2",
        subtopicId: "S39-T3-A",
        kind: "independent",
        instruction:
          "S39-T3-A-E2 · Tres checklists: limpio → `PASS`, secrets_in_repo True → `REJECT_SECRETS`, sin rbac (clave ausente) → `MISSING:rbac`. Entrada: flags del checklist de riesgo. El starter no niega secrets y confunde missing con reject. Salida exacta de la línea: `PASS REJECT_SECRETS MISSING:rbac`.",
        hint: "Missing de rbac se detecta por claves; secrets True es breach de contenido.",
        hints: [
          "Missing de rbac se detecta por claves; secrets True es breach de contenido.",
          "min_role conceptual del packet es reviewer; aquí solo validas flags del checklist.",
        ],
        edgeCases: ["secrets en repo", "rbac ausente", "pii no minimizada"],
        tests: "Salida: PASS REJECT_SECRETS MISSING:rbac",
        feedback: "S39-T3-A-E2: separa ausencia de control (missing) de violación activa (secrets).",
        starterCode: {
          language: 'python',
          title: "s39-t3-a-e2.py",
          code: `# CASO-LIM-039 · secrets_in_repo block
# DEFECTO: assess PASS sin bloquear secrets_in_repo
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
def assess(c: dict) -> str:
    required = {"pii_minimized", "rbac", "secrets_in_repo", "slice_metrics", "input_limits"}
    missing = sorted(required - c.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: no bloquea secrets
    return "PASS"

valid = {
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
}
invalid = {**valid, "secrets_in_repo": True}
incomplete = {k: v for k, v in valid.items() if k != "rbac"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-a-e2.py",
          code: `def assess(c: dict) -> str:
    required = {"pii_minimized", "rbac", "secrets_in_repo", "slice_metrics", "input_limits"}
    missing = sorted(required - c.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if c["secrets_in_repo"]:
        return "REJECT_SECRETS"
    ok = all([
        c["pii_minimized"],
        c["rbac"],
        c["slice_metrics"],
        c["input_limits"],
    ])
    return "PASS" if ok else "REJECT_RELEASE"

valid = {
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
}
invalid = {**valid, "secrets_in_repo": True}
incomplete = {k: v for k, v in valid.items() if k != "rbac"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_SECRETS MISSING:rbac`,
        },
      },
      {
        id: "S39-T3-A-E3",
        subtopicId: "S39-T3-A",
        kind: "transfer",
        instruction:
          "S39-T3-A-E3 · Fairness de cola sobre tres payloads: OK → `CONTINUE fp_rate`; slices vacíos → `REQUEST_SLICE_METRICS`; fp_rate sobre umbral → `REJECT_SLICE_FP`. El starter siempre continúa y no lee slices. Salida exacta: `CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP`. No uses el score para afirmar fraude en un slice.",
        hint: "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
        hints: [
          "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
          "REQUEST_SLICE_METRICS cuando la clave slices no existe o está vacía.",
        ],
        edgeCases: ["sin slices", "fp_rate sobre umbral", "metric nombre fp_rate"],
        tests: "Salida: CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP",
        feedback: "S39-T3-A-E3: fairness operativa mide daño de revisión por slice, no culpa grupal.",
        starterCode: {
          language: 'python',
          title: "s39-t3-a-e3.py",
          code: `def decide(payload: dict):
    # DEFECTO
    return "CONTINUE", "auc"

happy = {
    "case_id": "CASO-LIM-039-T3A",
    "slices": [{"name": "canal_app", "fp_rate": 0.08}],
    "fp_threshold": 0.15,
}
empty = {**happy, "slices": []}
high_fp = {**happy, "slices": [{"name": "canal_app", "fp_rate": 0.4}]}
print(*decide(happy), decide(empty)[0], decide(high_fp)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-a-e3.py",
          code: `def decide(payload: dict):
    slices = payload.get("slices")
    if not slices:
        return "REQUEST_SLICE_METRICS", None
    thr = payload.get("fp_threshold", 0.15)
    for s in slices:
        if s.get("fp_rate", 0) > thr:
            return "REJECT_SLICE_FP", "fp_rate"
    return "CONTINUE", "fp_rate"

happy = {
    "case_id": "CASO-LIM-039-T3A",
    "slices": [{"name": "canal_app", "fp_rate": 0.08}],
    "fp_threshold": 0.15,
}
empty = {**happy, "slices": []}
high_fp = {**happy, "slices": [{"name": "canal_app", "fp_rate": 0.4}]}
assert decide(happy) == ("CONTINUE", "fp_rate")
assert decide(empty)[0] == "REQUEST_SLICE_METRICS"
assert decide(high_fp)[0] == "REJECT_SLICE_FP"
print(*decide(happy), decide(empty)[0], decide(high_fp)[0])
`,
          output: `CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP`,
        },
      },
      {
        id: "S39-T3-B-E1",
        subtopicId: "S39-T3-B",
        kind: "guided",
        instruction:
          "S39-T3-B-E1 · Calcula el modo ops de `CASO-LIM-039-T3B`. Entrada: drift_high (bool), incident (bool). Prioridad: incident → human_only; si no, drift_high → abstain_more; si no, normal. El starter invierte prioridades (defecto). Salida exacta: `S39-T3-B PASS` cuando incident True produce human_only.",
        hint: "incident gana siempre sobre drift; no devuelvas abstain_more si incident es True.",
        hints: [
          "incident gana siempre sobre drift; no devuelvas abstain_more si incident es True.",
          "Corrige solo la función mode; el fixture de assert usa incident=True.",
        ],
        edgeCases: ["incident y drift simultáneos", "solo drift", "normal"],
        tests: "Imprime `S39-T3-B PASS` si mode(incident=True)=human_only.",
        feedback: "S39-T3-B-E1: human_only es el fail-closed de incidente; el throughput no manda.",
        starterCode: {
          language: 'python',
          title: "s39-t3-b-e1.py",
          code: `def mode(drift_high, incident):
    # DEFECTO: prioriza drift
    if drift_high:
        return "abstain_more"
    if incident:
        return "human_only"
    return "normal"

record = {"case_id": "CASO-LIM-039-T3B", "drift_high": True, "incident": True}
m = mode(record["drift_high"], record["incident"])
meets = m == "human_only"
status = "PASS" if meets else "REJECT_MODE"
print("S39-T3-B", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-b-e1.py",
          code: `def mode(drift_high, incident):
    if incident:
        return "human_only"
    if drift_high:
        return "abstain_more"
    return "normal"

record = {"case_id": "CASO-LIM-039-T3B", "drift_high": True, "incident": True}
m = mode(record["drift_high"], record["incident"])
meets = m == "human_only"
status = "PASS" if meets else "REJECT_MODE"
print("S39-T3-B", status)
assert meets is True
`,
          output: `S39-T3-B PASS`,
        },
      },
      {
        id: "S39-T3-B-E2",
        subtopicId: "S39-T3-B",
        kind: "independent",
        instruction:
          "S39-T3-B-E2 · Tres escenarios ops: normal, solo drift → `abstain_more`, solo incident → `human_only`. Entrada: drift_high, incident. Salidas exactas en una línea: `normal abstain_more human_only`. El starter intercambia drift e incident. No inventes labels de fraude al subir abstención.",
        hint: "Tabla de verdad simple: (F,F)=normal, (T,F)=abstain_more, (F,T)=human_only.",
        hints: [
          "Tabla de verdad simple: (F,F)=normal, (T,F)=abstain_more, (F,T)=human_only.",
          "Si ambos True, human_only (cubierto por la prioridad de incident).",
        ],
        edgeCases: ["ambos True", "flags ausentes conceptualmente", "rollback target aparte"],
        tests: "Salida: normal abstain_more human_only",
        feedback: "S39-T3-B-E2: drift reduce automatización; incident la corta.",
        starterCode: {
          language: 'python',
          title: "s39-t3-b-e2.py",
          code: `# CASO-LIM-039 · drift/incident modes
# DEFECTO: ramas invertidas human_only/abstain
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
def mode(drift_high, incident):
    # DEFECTO: ramas invertidas
    if drift_high:
        return "human_only"
    if incident:
        return "abstain_more"
    return "normal"

print(mode(False, False), mode(True, False), mode(False, True))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-b-e2.py",
          code: `def mode(drift_high, incident):
    if incident:
        return "human_only"
    if drift_high:
        return "abstain_more"
    return "normal"

print(mode(False, False), mode(True, False), mode(False, True))
`,
          output: `normal abstain_more human_only`,
        },
      },
      {
        id: "S39-T3-B-E3",
        subtopicId: "S39-T3-B",
        kind: "transfer",
        instruction:
          "S39-T3-B-E3 · Rollback versionado sobre tres escenarios: incident con prev → `ROLLBACK previous_model`; falta prev_model_id → `REQUEST_PREV_MODEL`; solo drift → `MONITOR abstain_more`. El starter siempre imprime current_model. Salida exacta: `ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more`.",
        hint: "Rollback apunta a artefacto versionado previo, no al working tree local.",
        hints: [
          "Rollback apunta a artefacto versionado previo, no al working tree local.",
          "Sin prev_model_id no inventes un id; pide REQUEST_PREV_MODEL.",
        ],
        edgeCases: ["sin prev_model_id", "solo drift", "incident con prev"],
        tests: "Salida: ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more",
        feedback: "S39-T3-B-E3: rollback y abstención son controles distintos; no los mezcles.",
        starterCode: {
          language: 'python',
          title: "s39-t3-b-e3.py",
          code: `def decide(ops: dict):
    # DEFECTO
    return "STAY", "current_model"

happy = {
    "case_id": "CASO-LIM-039-T3B",
    "incident": True,
    "drift_high": False,
    "prev_model_id": "previous_model",
    "prev_thr": "previous",
}
missing = {**happy, "prev_model_id": None}
drift_only = {"incident": False, "drift_high": True}
print(*decide(happy), decide(missing)[0], *decide(drift_only))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t3-b-e3.py",
          code: `def decide(ops: dict):
    if ops.get("incident"):
        if not ops.get("prev_model_id"):
            return "REQUEST_PREV_MODEL", None
        return "ROLLBACK", ops["prev_model_id"]
    if ops.get("drift_high"):
        return "MONITOR", "abstain_more"
    return "STAY", "current_model"

happy = {
    "case_id": "CASO-LIM-039-T3B",
    "incident": True,
    "drift_high": False,
    "prev_model_id": "previous_model",
    "prev_thr": "previous",
}
missing = {**happy, "prev_model_id": None}
drift_only = {"incident": False, "drift_high": True}
assert decide(happy) == ("ROLLBACK", "previous_model")
assert decide(missing)[0] == "REQUEST_PREV_MODEL"
assert decide(drift_only) == ("MONITOR", "abstain_more")
print(*decide(happy), decide(missing)[0], *decide(drift_only))
`,
          output: `ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more`,
        },
      },
      {
        id: "S39-T4-A-E1",
        subtopicId: "S39-T4-A",
        kind: "guided",
        instruction:
          "S39-T4-A-E1 · Verifica criterios de aceptación de `CASO-LIM-039-T4A`. Entrada: lista acceptance de strings. Debe incluir `no_auto_fraud_label` y al menos e2e_synthetic_run, audit_log. El starter busca la clave equivocada `auto_fraud_ok` (defecto). Salida exacta: `S39-T4-A PASS` cuando el criterio correcto está presente.",
        hint: "Busca el string exacto no_auto_fraud_label dentro de la lista acceptance.",
        hints: [
          "Busca el string exacto no_auto_fraud_label dentro de la lista acceptance.",
          "No reescribas la lista; corrige la condición membership.",
        ],
        edgeCases: ["falta no_auto_fraud_label", "lista vacía", "typo fraud_auto"],
        tests: "Imprime `S39-T4-A PASS` si el checklist de aceptación es completo en lo esencial.",
        feedback: "S39-T4-A-E1: aceptar el triage exige prohibir auto-label de fraude de forma explícita.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e1.py",
          code: `# CASO-LIM-039 · acceptance no auto_fraud
# DEFECTO: clave auto_fraud_ok incorrecta
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
acceptance = [
    "e2e_synthetic_run",
    "baseline_in_metrics",
    "abstention_path",
    "audit_log",
    "no_auto_fraud_label",
    "regression_smoke_s27_s39",
]
# DEFECTO: clave incorrecta
meets = "auto_fraud_ok" in acceptance and "audit_log" in acceptance
status = "PASS" if meets else "REJECT_ACCEPTANCE"
print("S39-T4-A", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-a-e1.py",
          code: `acceptance = [
    "e2e_synthetic_run",
    "baseline_in_metrics",
    "abstention_path",
    "audit_log",
    "no_auto_fraud_label",
    "regression_smoke_s27_s39",
]
meets = (
    "no_auto_fraud_label" in acceptance
    and "e2e_synthetic_run" in acceptance
    and "audit_log" in acceptance
)
status = "PASS" if meets else "REJECT_ACCEPTANCE"
print("S39-T4-A", status)
assert meets is True
`,
          output: `S39-T4-A PASS`,
        },
      },
      {
        id: "S39-T4-A-E2",
        subtopicId: "S39-T4-A",
        kind: "independent",
        instruction:
          "S39-T4-A-E2 · Documenta regresión y CF-3: scope debe ser `S27-S39`, cf3_review=`external`, self_declared_promotion debe ser False. Entrada: dict gate_notes. Adverso: self_declared_promotion True → `REJECT_AUTO_PASS`. Missing scope → `MISSING:regression_scope`. Salidas: `PASS REJECT_AUTO_PASS MISSING:regression_scope`. El starter permite auto-declarar promoción.",
        hint: "No auto-declares promoción: self_declared_promotion True es rechazo de política. CF-3 se confirma con revisión externa.",
        hints: [
          "No auto-declares promoción: self_declared_promotion True es rechazo de política. CF-3 se confirma con revisión externa.",
          "cf3_review external recuerda que un evaluador externo cierra el gate.",
        ],
        edgeCases: ["self_declared_promotion True", "scope incompleto", "cf3_review no external"],
        tests: "Salida: PASS REJECT_AUTO_PASS MISSING:regression_scope",
        feedback: "S39-T4-A-E2: regresión y expediente se documentan; la promoción la confirma un revisor externo.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e2.py",
          code: `# CASO-LIM-039 · regression notes gate
# DEFECTO: acepta self_declared_promotion True (auto pass)
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
def assess(notes: dict) -> str:
    required = {"regression_scope", "cf3_review", "self_declared_promotion"}
    missing = sorted(required - notes.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: acepta auto-declarar promoción
    return "PASS"

valid = {
    "regression_scope": "S27-S39",
    "cf3_review": "external",
    "self_declared_promotion": False,
}
invalid = {**valid, "self_declared_promotion": True}
incomplete = {k: v for k, v in valid.items() if k != "regression_scope"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-a-e2.py",
          code: `def assess(notes: dict) -> str:
    required = {"regression_scope", "cf3_review", "self_declared_promotion"}
    missing = sorted(required - notes.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if notes["self_declared_promotion"] is True:
        return "REJECT_AUTO_PASS"
    if notes["regression_scope"] != "S27-S39" or notes["cf3_review"] != "external":
        return "REJECT_AUTO_PASS"
    return "PASS"

valid = {
    "regression_scope": "S27-S39",
    "cf3_review": "external",
    "self_declared_promotion": False,
}
invalid = {**valid, "self_declared_promotion": True}
incomplete = {k: v for k, v in valid.items() if k != "regression_scope"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_AUTO_PASS MISSING:regression_scope`,
        },
      },
      {
        id: "S39-T4-A-E3",
        subtopicId: "S39-T4-A",
        kind: "transfer",
        instruction:
          "S39-T4-A-E3 · Demo paths sobre tres listas: completo → `CONTINUE 3`; solo happy → `REJECT_HAPPY_ONLY`; falta ood_abstain → `REQUEST_DEMO_PATH`. El starter cuenta mal y acepta cualquier lista. Salida exacta: `CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH`.",
        hint: "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
        hints: [
          "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
          "ood_abstain es distinto de ood; usa el token canónico del theory block.",
        ],
        edgeCases: ["solo happy", "path mal nombrado", "lista vacía"],
        tests: "Salida: CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH",
        feedback: "S39-T4-A-E3: la demo de triage debe cubrir override y abstención, no solo el caso feliz.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e3.py",
          code: `# CASO-LIM-039 · e2e path matrix
# DEFECTO: decide CONTINUE sin validar paths
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
def decide(paths: list):
    # DEFECTO
    return "CONTINUE", len(paths)

full = ["happy", "override", "ood_abstain"]
happy_only = ["happy"]
partial = ["happy", "override"]
print(*decide(full), decide(happy_only)[0], decide(partial)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-a-e3.py",
          code: `CANON = {"happy", "override", "ood_abstain"}

def decide(paths: list):
    s = set(paths)
    if not s:
        return "REQUEST_DEMO_PATH", 0
    if s == {"happy"}:
        return "REJECT_HAPPY_ONLY", 1
    if not CANON.issubset(s):
        return "REQUEST_DEMO_PATH", len(s)
    return "CONTINUE", 3

full = ["happy", "override", "ood_abstain"]
happy_only = ["happy"]
partial = ["happy", "override"]
assert decide(full) == ("CONTINUE", 3)
assert decide(happy_only)[0] == "REJECT_HAPPY_ONLY"
assert decide(partial)[0] == "REQUEST_DEMO_PATH"
print(*decide(full), decide(happy_only)[0], decide(partial)[0])
`,
          output: `CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH`,
        },
      },
      {
        id: "S39-T4-B-E1",
        subtopicId: "S39-T4-B",
        kind: "guided",
        instruction:
          "S39-T4-B-E1 · Valida las tres cards de cierre sobre `CASO-LIM-039-T4B`. Entrada: lista cards. Debe contener exactamente model, data y system (como conjunto). El starter exige cuatro cards incluyendo 'ops' (defecto). Salida exacta: `S39-T4-B PASS`. El adverso de E2 activará `REJECT_CARDS`.",
        hint: "Conjunto {model, data, system}; ni de más ni de menos para el contrato mínimo de S39.",
        hints: [
          "Conjunto {model, data, system}; ni de más ni de menos para el contrato mínimo de S39.",
          "Orden de impresión puede ser sorted; el predicado usa igualdad de sets.",
        ],
        edgeCases: ["falta system", "card extra no compensa falta", "lista vacía"],
        tests: "Imprime `S39-T4-B PASS` cuando las tres cards mínimas están presentes.",
        feedback: "S39-T4-B-E1: model/data/system cards son el paquete mínimo de cierre de nivel.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e1.py",
          code: `# CASO-LIM-039 · model/data/system cards
# DEFECTO: exige ops extra innecesariamente
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
cards = ["model", "data", "system"]
# DEFECTO: exige ops
meets = set(cards) == {"model", "data", "system", "ops"}
status = "PASS" if meets else "REJECT_CARDS"
print("S39-T4-B", status)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-b-e1.py",
          code: `cards = ["model", "data", "system"]
meets = set(cards) == {"model", "data", "system"}
status = "PASS" if meets else "REJECT_CARDS"
print("S39-T4-B", status)
assert meets is True
`,
          output: `S39-T4-B PASS`,
        },
      },
      {
        id: "S39-T4-B-E2",
        subtopicId: "S39-T4-B",
        kind: "independent",
        instruction:
          "S39-T4-B-E2 · Métricas de valor: debe existir override_rate (y preferible precision_at_k, median_review_s). Válido → `PASS`; solo auc offline → `REJECT_VALUE_METRICS`; sin dict de métricas → `MISSING:value`. El starter acepta auc como suficiente. Salida: `PASS REJECT_VALUE_METRICS MISSING:value`.",
        hint: "Valor operativo del triage ≠ solo AUC; override_rate es la métrica canónica de este ejercicio.",
        hints: [
          "Valor operativo del triage ≠ solo AUC; override_rate es la métrica canónica de este ejercicio.",
          "MISSING:value cuando el payload no trae la clave value.",
        ],
        edgeCases: ["solo auc", "value ausente", "override_rate 0.12 válido"],
        tests: "Salida: PASS REJECT_VALUE_METRICS MISSING:value",
        feedback: "S39-T4-B-E2: negocio lee overrides y tiempo de review; AUC no basta para el cierre.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e2.py",
          code: `# CASO-LIM-039 · value metrics not only auc
# DEFECTO: acepta auc solo como value
# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
def assess(payload: dict) -> str:
    if "value" not in payload:
        return "MISSING:value"
    # DEFECTO: acepta solo auc
    return "PASS" if "auc" in payload["value"] or "override_rate" in payload["value"] else "REJECT_VALUE_METRICS"

valid = {"value": {"precision_at_k": 0.55, "override_rate": 0.12, "median_review_s": 90}}
invalid = {"value": {"auc": 0.91}}
incomplete = {"cards": ["model"]}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-b-e2.py",
          code: `def assess(payload: dict) -> str:
    if "value" not in payload:
        return "MISSING:value"
    v = payload["value"]
    if "override_rate" not in v:
        return "REJECT_VALUE_METRICS"
    return "PASS"

valid = {"value": {"precision_at_k": 0.55, "override_rate": 0.12, "median_review_s": 90}}
invalid = {"value": {"auc": 0.91}}
incomplete = {"cards": ["model"]}
print(assess(valid), assess(invalid), assess(incomplete))
`,
          output: `PASS REJECT_VALUE_METRICS MISSING:value`,
        },
      },
      {
        id: "S39-T4-B-E3",
        subtopicId: "S39-T4-B",
        kind: "transfer",
        instruction:
          "S39-T4-B-E3 · Postmortem blameless sobre cuatro fixtures: OK → `CONTINUE True`; blameless False → `REJECT_BLAMEFUL`; root_cause vacío → `REQUEST_ROOT_CAUSE`; actions vacía → `REQUEST_ACTIONS`. El starter acepta postmortems con culpa personal y sin acciones. Salida exacta: `CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS`.",
        hint: "Blameless mira procesos y sistemas; no nombres de personas como root_cause. actions vacía tiene token propio (REQUEST_ACTIONS).",
        hints: [
          "Blameless mira procesos y sistemas; no nombres de personas como root_cause.",
          "actions debe ser lista con al menos un ítem (rollback, recalibrate, etc.); si falta → REQUEST_ACTIONS.",
        ],
        edgeCases: ["blameless False", "root_cause vacío", "actions []"],
        tests: "Salida: CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS",
        feedback: "S39-T4-B-E3: el postmortem cierra el aprendizaje del incidente sin cacería de brujas; root_cause y actions no se confunden.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e3.py",
          code: `def decide(pm: dict):
    # DEFECTO
    return "CONTINUE", True

happy = {
    "case_id": "CASO-LIM-039-T4B",
    "blameless": True,
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
}
blameful = {**happy, "blameless": False}
no_rc = {**happy, "root_cause": ""}
no_actions = {**happy, "actions": []}
print(*decide(happy), decide(blameful)[0], decide(no_rc)[0], decide(no_actions)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-b-e3.py",
          code: `def decide(pm: dict):
    if pm.get("blameless") is not True:
        return "REJECT_BLAMEFUL", False
    if not pm.get("root_cause"):
        return "REQUEST_ROOT_CAUSE", False
    if not pm.get("actions"):
        return "REQUEST_ACTIONS", False
    return "CONTINUE", True

happy = {
    "case_id": "CASO-LIM-039-T4B",
    "blameless": True,
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
}
blameful = {**happy, "blameless": False}
no_rc = {**happy, "root_cause": ""}
no_actions = {**happy, "actions": []}
assert decide(happy) == ("CONTINUE", True)
assert decide(blameful)[0] == "REJECT_BLAMEFUL"
assert decide(no_rc)[0] == "REQUEST_ROOT_CAUSE"
assert decide(no_actions)[0] == "REQUEST_ACTIONS"
print(*decide(happy), decide(blameful)[0], decide(no_rc)[0], decide(no_actions)[0])
`,
          output: `CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS`,
        },
      },
    ],
  },
  youDo: {
    title: "Responsible ML Case Triage (cierre CP-N3-C) + notas regresión N3/CF-3",
    context:
      "Entrega el sistema e2e sintético de triage para `CASO-LIM-039`: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos human_only, demo de aceptación, cards y postmortem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. No auto-fraude ni parentesco automático. Deja evidencia para revisión externa; no auto-declares la promoción de nivel.",
    objectives: [
      "Pipeline intake→queue con label_space needs_review y auto_fraud False",
      "Registry de versiones/owners con semver y bump major en breaking",
      "Evidence packet mínimo + explicación usable por revisor",
      "Overrides y apelaciones con audit log y cuidado de leakage en feedback",
      "Checklist de privacidad/fairness/seguridad firmable",
      "Modos drift/incident + rollback versionado",
      "Aceptación, tres demo paths, cards, métricas de valor y postmortem blameless",
      "Notas de regresión N3 y CF-3 sin auto-declarar promoción",
    ],
    requirements: [
      "E2e sintético reproducible en local-python",
      "Cero auto-label de fraude o parentesco",
      "Audit log de decisiones y overrides (incl. queue vs skip por umbral)",
      "Checklist regresión S27–S39 documentado",
      "es-PE en prosa; sin secretos ni PII real",
      "manifest declara self_declared_promotion=false hasta revisión externa",
    ],
    starterCode: `# CP-N3-C — bundle local de Responsible ML Case Triage (CASO-LIM-039)
from dataclasses import asdict, dataclass
from hashlib import sha256
from pathlib import Path
import json

STAGES = ("intake", "er", "relation_graph", "features", "model_score", "queue")

@dataclass(frozen=True)
class EvidencePacket:
    case_id: str
    score: float
    graph_path: list[str]
    evidence: list[str]
    label_space: str = "needs_review"
    auto_fraud: bool = False

def triage(case: dict, *, threshold: float, human_only: bool) -> tuple:
    """Score + acción de cola por umbral calibrado (threshold). Score ≠ fraude."""
    required = {"case_id", "shared_signal", "graph_path"}
    missing = required - case.keys()
    if missing:
        raise ValueError(f"missing fields: {sorted(missing)}")
    if human_only:
        score = 0.0
    else:
        score = min(1.0, 0.35 + 0.45 * bool(case["shared_signal"]))
    packet = EvidencePacket(
        case_id=case["case_id"],
        score=score,
        graph_path=list(case["graph_path"]),
        evidence=["shared_signal"] if case["shared_signal"] else [],
    )
    action = "queued_for_review" if packet.score >= threshold else "skip_low_priority"
    return packet, action

def append_audit(path: Path, event: dict) -> None:
    with path.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(event, sort_keys=True) + "\\n")

def build_bundle(out: Path, *, force_failure: bool = False) -> dict:
    out.mkdir(parents=True, exist_ok=True)
    audit = out / "audit.jsonl"
    cases = [
        {"case_id": "CASO-LIM-039-c001", "shared_signal": True, "graph_path": ["entity:a", "phone:x", "entity:b"]},
        {"case_id": "CASO-LIM-039-c002", "shared_signal": False, "graph_path": ["entity:c"]},
    ]
    thr = 0.70
    packets = []
    try:
        for case in cases:
            packet, action = triage(case, threshold=thr, human_only=False)
            packets.append(asdict(packet))
            append_audit(audit, {"case_id": packet.case_id, "action": action, "score": packet.score})
        if force_failure:
            raise RuntimeError("forced regression failure")
        (out / "packets.json").write_text(json.dumps(packets, indent=2), encoding="utf-8")
        (out / "model-card.md").write_text(
            "# Model card\\n"
            "Intended use: priorizar cola de revisión (label_space=needs_review).\\n"
            "Limitations: score ≠ fraude/parentesco; no auto-fraud.\\n"
            "Human oversight: override + audit obligatorios.\\n"
            "Monitoring: override_rate, precision@k, drift de score.\\n",
            encoding="utf-8",
        )
        (out / "data-card.md").write_text(
            "# Data card\\n"
            "Sources: fixtures sintéticos CASO-LIM-039 (sin PII real).\\n"
            "Windows: batch de laboratorio; no training labels de cola.\\n"
            "Minimización: solo shared_signal + graph_path en packet.\\n",
            encoding="utf-8",
        )
        (out / "system-card.md").write_text(
            "# System card\\n"
            "Modes: normal | abstain_more | human_only.\\n"
            "Owners: ml-risk (ranker), data-quality (ER).\\n"
            "Rollback: prev_model versionado; force_failure → human_only.\\n",
            encoding="utf-8",
        )
        status = "ready_for_human_acceptance"
    except Exception as exc:
        append_audit(audit, {"action": "rollback", "reason": type(exc).__name__})
        status = "human_only"
    files = sorted(p.name for p in out.iterdir())
    manifest = {
        "status": status,
        "files": files,
        "stages": list(STAGES),
        "regression_scope": "S27-S39",
        "cf3_review": "external",
        "self_declared_promotion": False,
        "threshold": thr,
    }
    manifest["sha256"] = sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest

# Aceptación: corre caminos normal y force_failure; inspecciona manifest, packets,
# audit y model/data/system cards. Deja el expediente listo; no auto-declares promoción
# — un revisor externo evalúa la evidencia.
`,
    portfolioNote:
      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. El expediente queda listo para revisión externa; no auto-declares promoción.",
    rubric: [
      { criterion: "Alineación al entregable CP-N3-C (triage e2e responsable)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno local-python", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin auto-fraude ni parentesco", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (override, OOD, incident)", weight: "15%" },
      { criterion: "Código legible y límites claros por etapa", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE)", weight: "10%" },
      { criterion: "E2e triage + evidence packet + audit overrides", weight: "bonus checklist" },
      { criterion: "Regresión N3/CF-3 documentada sin auto-declarar promoción", weight: "gate process" },
      { criterion: "Sin fraude/parentesco automático; ER=misma entidad", weight: "gate privacy" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El label_space del triage N3 es preferentemente:",
        options: ["fraud_certainty", "parentesco", "needs_review / prioridad de cola", "culpable"],
        correctIndex: 2,
        explanation:
          "El score ordena trabajo humano en la cola; needs_review (o prioridad de cola) es el espacio de etiquetas correcto. No declares fraude, parentesco ni culpabilidad automática a partir del ranking.",
      },
      {
        question: "Sobre regresión S27–S39 y CF-3 en tu entrega de S39:",
        options: [
          "Documentas smoke y expediente; la promoción la confirma un revisor externo",
          "Tu script marca promoción automáticamente si el e2e imprime OK",
          "Borras el checklist al exportar el bundle",
          "Solo aplican a la sección 01",
        ],
        correctIndex: 0,
        explanation:
          "Dejas smoke de regresión y el expediente CF-3 listos. La confirmación de promoción es una revisión externa sobre esa evidencia, no un auto-PASS del script.",
      },
      {
        question: "Evidence packet debe incluir:",
        options: ["Solo el score del modelo", "Evidencia y path además del score", "Solo el owner del repo de ML", "Claves de API de producción"],
        correctIndex: 1,
        explanation:
          "Sin evidence y graph_path el revisor no tiene workbench. El score solo es insuficiente y las claves de API no pertenecen al packet.",
      },
      {
        question: "Ante incidente grave el modo seguro es:",
        options: ["Ignorar y subir throughput", "Subir contamination del training set", "Etiquetar fraude masivo con el score", "human_only / rollback a artefacto previo"],
        correctIndex: 3,
        explanation:
          "Fail-closed: human_only y rollback versionado. No conviertas el score en etiqueta masiva de fraude ni «arregles» el incidente contaminando datos.",
      },
      {
        question: "Un breaking change en graph_schema del triage exige:",
        options: ["Bump patch silencioso", "Borrar el registry", "Bump major, owner contactable y revalidación de paths", "Desactivar el audit log"],
        correctIndex: 2,
        explanation:
          "Semver major + owner + regresión de contratos (incl. paths del grafo) evitan packets incompatibles en cola humana.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "Límites del score, label_space y no auto-fraude",
      },
      {
        label: "NIST AI RMF",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Gobernanza y riesgo de sistemas de IA",
      },
      {
        label: "SRE / embracing risk",
        url: "https://sre.google/sre-book/embracing-risk/",
        note: "Error budget, incidentes y trade-offs ops",
      },
      {
        label: "SRE postmortem culture",
        url: "https://sre.google/sre-book/postmortem-culture/",
        note: "Postmortems blameless del triage",
      },
      {
        label: "sklearn model evaluation",
        url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        note: "Métricas y calibración conceptual del ranker",
      },
      {
        label: "sklearn calibration",
        url: "https://scikit-learn.org/stable/modules/calibration.html",
        note: "Confiabilidad de scores de prioridad",
      },
      {
        label: "Python logging (audit trail)",
        url: "https://docs.python.org/3/library/logging.html",
        note: "Audit log sin PII real",
      },
      {
        label: "Twelve-Factor App",
        url: "https://12factor.net/",
        note: "Contratos ops del control plane",
      },
    ],
    books: [
      {
        label: "Building ML Powered Applications",
        note: "Sistemas ML end-to-end y feedback humano",
      },
      {
        label: "Incident management handbooks",
        note: "Postmortems blameless y runbooks",
      },
    ],
    courses: [
      {
        label: "TensorFlow Responsible AI",
        url: "https://www.tensorflow.org/responsible_ai",
        note: "Oversight, fairness y documentación",
      },
      {
        label: "Coursera Machine Learning (Andrew Ng)",
        url: "https://www.coursera.org/learn/machine-learning",
        note: "Baselines y evaluación responsable",
      },
      {
        label: "deeplearning.ai — AI For Everyone",
        url: "https://www.deeplearning.ai/courses/ai-for-everyone/",
        note: "Framing responsable de IA en producto",
      },
      {
        label: "MIT 6.036 Intro ML",
        url: "https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/",
        note: "Fundamentos ML del score de prioridad",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python",
        note: "Pedagogía progresiva",
      },
      {
        label: "Py4E",
        url: "https://www.py4e.com",
        note: "Stdlib-first progressive disclosure",
      },
    ],
  },
}
