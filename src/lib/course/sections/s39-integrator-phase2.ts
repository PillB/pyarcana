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
    "En operaciones de riesgo y calidad de datos en fintech, banca y retail en Perú, aquí integras un Responsible ML Case Triage completo: intake → entity resolution → relación → features → modelo → cola humana, con model cards, monitoreo y control humano. El score solo prioriza revisión; no declara fraude ni parentesco. Entregas evidencia reproducible lista para revisión externa, sin autodeclarar el cierre.",
  learningOutcomes: [
    { text: "Ensamblar el flujo canónico intake→ER→grafo→features→score→cola con contratos versionados" },
    { text: "Registrar ownership, semver y política de compatibilidad por artefacto del triage" },
    { text: "Armar cola, evidence packet y explicación en capas sin exponer solo un número" },
    { text: "Operar decisión automática, override humano, feedback y apelación con audit log" },
    { text: "Aplicar checklist de privacidad, fairness por slices y seguridad de inputs del packet" },
    { text: "Monitorear drift, activar human_only, rollback de modelo/umbral y abstención" },
    { text: "Definir criterios de aceptación, demo e2e sintético y smoke de regresión S27–S39" },
    { text: "Publicar model/data/system cards, métricas de valor operativo y post mórtem blameless" },
    { text: "Documentar el expediente CF-3 y los gates N3 con evidencia reproducible, sin autodeclarar la promoción de nivel" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-C + regresión N3 + CF-3",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Responsible ML Case Triage:** flujo intake→ER→grafo→features→score→cola humana. **Evidence packet:** hechos + path + features + incertidumbre (no un número suelto). **Abstención / human_only:** modos que priorizan control humano. **Model/data/system card:** límites y ownership publicados. **CF-3:** gate de contratos del nivel 3 revisado por un evaluador externo. **auto_fraud=False:** el score prioriza revisión; nunca declara fraude ni parentesco.",
        "En operaciones de riesgo de una fintech o banco en Lima, el día a día no es reentrenar el ranker: es **triage de casos** con evidencia citable, cola humana y auditoría. **S39 cierra el nivel 3** con el sistema demoable **Responsible ML Case Triage**. No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38 (calidad, ER, grafo, features, ranking, calibración, explicación, monitoreo y colas) en un recorrido que un revisor humano puede auditar de punta a punta con fixtures sintéticos peruanos. Esta sección se autoincluye en el smoke de regresión **S27–S39**.",
        "Qué entregas aquí (contrato de promoción, conceptual). Entrada: CP-N3-A, CP-N3-B y **CP-N3-C**, más smoke de regresión S27–S39 y el expediente **CF-3**. Salida de esta sección: bundle e2e con packets, audit, cards y notas de gate. Error: autodeclarar promoción sin revisión externa. Criterio: dejas evidencia reproducible; la decisión de cierre del nivel la registra un revisor, no tu script.",
        "Orden pedagógico: **T1 Arquitectura del flujo** (pipeline y ownership) → **T2 Workbench del revisor** (packet, decisión y apelación) → **T3 Riesgo y ops** (privacidad, fairness, drift y human_only) → **T4 Producto y cierre** (aceptación, demo, cards, valor y post mórtem). El caso sintético `CASO-LIM-039` modela una cola de onboarding digital en una fintech ficticia en Lima: datos inventados, sin PII real y sin etiqueta automática de fraude. Si el mapa se siente denso, avanza T1→T4 en ese orden; el You Do ensambla todo al final.",
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
          "Entregable de S39: triage responsable demoable. Promoción N3 = CP-N3-A/B/C + regresión S27–S39 + CF-3 con revisión externa. Tú dejas el expediente; no autodeclaras el cierre del nivel.",
      },
    },
    {
      heading: "Pipeline canónico: intake → ER → relación → features → modelo",
      subtopicId: "S39-T1-A",
      paragraphs: [
        "El flujo canónico N3 es una cadena con fronteras claras entre etapas. **Intake** normaliza los registros sintéticos y **ER** decide si dos registros son la misma entidad (no familia ni culpa). El **grafo relacional** expone paths de co-ocurrencia y **features** se materializan sin leakage de labels futuros. El **modelo** emite un score de prioridad y la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score **nunca** es veredicto de conducta indebida.",
        "Por qué importa este orden: si ER se ejecuta después del grafo, los features pueden filtrar una identidad mal resuelta. Si features se ejecuta después del score, el modelo puede usar labels futuros de la cola. La cola al final fuerza **HITL** (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear el score a veredicto legal. Éxito: las fallas se aíslan por frontera y el score solo ordena trabajo humano.",
        "Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia). Dos registros comparten un teléfono sintético; ER puede proponer la misma entidad; el grafo muestra un path de longitud 2; el score 0.66 sugiere prioridad media de cola. Nada de eso prueba fraude, parentesco ni intención: solo justifica que un revisor mire el evidence packet con sus citas y path.",
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
      heading: "Contratos, versiones y ownership (SemVer)",
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
      heading: "Cola, evidence packet y explicación usable",
      subtopicId: "S39-T2-A",
      paragraphs: [
        "La cola ordena casos por score calibrado y por capacidad del equipo. El **evidence packet** es lo que el revisor ve: hechos sintéticos, path de grafo, top features, incertidumbre (in/out of distribution) y contribuciones del modelo. Un número suelto no es un workbench: sin path ni evidencia, el caso no debe entrar a cola humana como «listo». **Calibración** aquí significa que el umbral se eligió en validación (S34) para una tasa de cola sostenible y una confiabilidad razonable del ranking. No es que el score sea probabilidad de fraude ni veredicto legal.",
        "El packet mínimo no es un dump del modelo: es el set de hechos que un revisor puede citar. Entrada: case_id, score, evidence[], graph_path[], uncertainty y opcional model_contrib. Salida: packet auditable + capas de explicación (S35) + bucket de prioridad por umbrales. Error: score solo o path omitido cuando el modelo usó señales relacionales. Éxito: el revisor reconstruye por qué el caso llegó a cola sin magia del modelo.",
        "Para `CASO-LIM-039-T2A`, el packet incluye score 0.81, evidencia `shared_phone_synth`, path `E1 → ph:900 → E2` e incertidumbre `in_distribution`. Con thr_hi=0.75 y thr_lo=0.40 el bucket es `queue_now`; 0.55 iría a `queue_batch` y 0.20 a `skip`. En un batch sintético de cinco scores, thr_hi=0.75 deja dos casos en cola inmediata: si la capacidad del turno es 3, el umbral es viable; si fuera 1, habría que subir thr o batchar más. La UI didáctica puede ser un dict en CLI: lo importante es la estructura. El revisor decide; el modelo solo prioriza.",
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

def queue_load(scores: list, thr_hi: float, capacity: int) -> dict:
    # Micro-check de calibración operativa: tasa de cola frente a capacidad del turno
    n_now = sum(1 for s in scores if s >= thr_hi)
    return {"n_queue_now": n_now, "within_capacity": n_now <= capacity}

packet = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth", "tx_path_len_2"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
    "model_contrib": {"shared_phone": 0.4},
}
batch_scores = [0.81, 0.55, 0.20, 0.92, 0.40]
layers = sum([
    bool(packet.get("case_id")),
    "score" in packet,
    bool(packet.get("evidence")),
    bool(packet.get("graph_path")),
])
load = queue_load(batch_scores, 0.75, capacity=3)
print(packet["case_id"], packet["score"])
print("path", packet["graph_path"])
print("layers", layers if packet_ok(packet) else 0)
print("bucket", priority_bucket(packet["score"], 0.75, 0.40))
print("load", load)`,
        output: `CASO-LIM-039-T2A 0.81
path ['E1', 'ph:900', 'E2']
layers 4
bucket queue_now
load {'n_queue_now': 2, 'within_capacity': True}`,
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
        "Antes de abrir el triage a revisores, aplica minimización de PII (solo campos necesarios del packet), **RBAC** por rol (reviewer frente a admin) y prohíbe secretos o tokens en el repo. Fairness operativa: mide tasas de envío a cola y de override por slices sintéticos de producto o canal, no para afirmar culpa de un grupo real.",
        "Un AUC alto no «compensa» un secreto en el repo ni la falta de RBAC: son blockers duros de release. Entrada: checklist con pii_minimized, rbac, secrets_in_repo, slice_metrics e input_limits. Salida: `release_ok` y blockers nominados. Error: secrets_in_repo True, packet sin control de rol o sin métricas por slice. Éxito: el owner de riesgo firma el checklist antes de la demo de aceptación.",
        "Para `CASO-LIM-039-T3A`, el release de la cola en un entorno de laboratorio limeño exige tres controles. Primero, límites de tamaño en los adjuntos sintéticos del packet. Segundo, validación de URL (sin **SSRF**: el servidor no debe abrir URL arbitrarias de evidence remota). Tercero, slice metrics de false-queue rate. El checklist no declara «sistema justo para siempre»: solo evidencia mínima de release responsable.",
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
          "El checklist queda firmado por el owner: secrets_in_repo o falta de RBAC son blockers duros; no se «compensa» con un AUC alto.",
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
      heading: "Aceptación, demo e2e y regresión N3 (cierre)",
      subtopicId: "S39-T4-A",
      paragraphs: [
        "La aceptación de CP-N3-C no es un screenshot: es una lista de criterios ejecutables sobre fixtures sintéticos. Mínimo: corrida e2e, baseline visible en métricas, camino de abstención, audit log de decisiones, prohibición de auto-label de fraude y smoke de regresión S27–S39 documentado.",
        "Una demo creíble cubre tres caminos, no solo el feliz: happy, override y ood_abstain. Entrada: checklist de aceptación + rutas de demo. Salida: criterios en verde y expediente CF-3 listo para revisor externo. Error: demo solo happy o autodeclarar promoción. Éxito: un evaluador externo repite la demo sin secretos ni datos reales.",
        "Para `CASO-LIM-039-T4A`, la demo en laboratorio muestra (1) caso con packet completo y queue, (2) override humano a skip con audit, (3) entrada **OOD** (out-of-distribution: el caso cae fuera de la distribución de validación) que abstiene. La regresión N3 es una lista de checks de contratos, no un reentrenamiento completo. Dejas el expediente listo; no autodeclaras el cierre del nivel ni el PASS de CF-3.",
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
          "Documenta smoke S27–S39 y deja el expediente CF-3 listo. La promoción la confirma un revisor externo; tu script no autodeclara el cierre del nivel.",
      },
    },
    {
      heading: "Model/data/system cards, métricas de valor y post mórtem",
      subtopicId: "S39-T4-B",
      paragraphs: [
        "El cierre de nivel exige **cards** legibles. **Model card:** intended use, `label_space`, límites, no autofraude, oversight y métricas por slice. **Data card:** fuentes sintéticas, ventanas, minimización de PII y gaps conocidos. **System card:** modos ops, owners, rollback y demo paths. Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides y tiempo mediano de review — no solo AUC offline.",
        "Cards y post mórtem cierran el aprendizaje del sistema, no la cacería de culpables. Una card útil nombra al owner de monitoreo y lo que no mide el score. Un post mórtem blameless separa timeline, root_cause de proceso y actions (p. ej. rollback frente a recalibrar). Entrada: métricas de valor + plantillas. Salida: tres cards publicables + post mórtem con acciones. Error: card de una línea, solo AUC offline, o root_cause con nombres de personas. Éxito: un stakeholder no-ML entiende el score y cuándo interviene un humano.",
        "En `CASO-LIM-039-T4B`, precision_at_k=0.55, override_rate=0.12 y median_review_s=90 cuentan la historia de la cola limeña de laboratorio; por slice sintético, canal_app muestra false_queue≈0.08 y canal_web≈0.11. Tras un incidente de calibración, el post mórtem blameless lista rollback y recalibración — sin culpar al on-call. Con cards, métricas de valor y notas de regresión, el expediente queda listo para revisión CF-3; tú no autodeclaras la promoción.",
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
    intro: "Te muestro el cierre del nivel N3 en ocho demos: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor. Todo con fixtures sintéticos; sin autodeclarar promoción ni CF-3.",
    steps: [
      {
        demoId: "S39-T1-A-DEMO",
        subtopicId: "S39-T1-A",
        environment: "local-python",
        description: "Pipeline canónico N3: stages derivados del run, label_space needs_review y auto_fraud en false sobre CASO-LIM-039.",
        preamble:
          "Antes de ensamblar el workbench del revisor, el equipo de la fintech sintética en Lima fija el **orden de etapas** del triage N3. En esta demo `build_run` arma stages `intake → er → relation_graph → features → model_score → queue` sobre `CASO-LIM-039` con score 0.66. No escribas aún: predice las tres líneas de salida y fíjate en `label_space` y `auto_fraud`. Si reordenas ER después del grafo, o lees el score como culpa, rompes el contrato del nivel.",
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
        why: "Cada stage es una frontera de contrato: intake normaliza, ER resuelve identidad, el grafo expone paths, features materializan señales y el score solo ordena trabajo humano en cola. Los flags `label_space=needs_review` y `auto_fraud=False` evitan mapear el ranking a veredicto legal o de parentesco. Si saltas una frontera, los features o el packet mienten al revisor. En We Do repararás el predicado de orden y el alcance de ER.",
        retrospective:
          "Si puedes explicar por qué el pipeline termina en cola y no en «fraude detectado», ya tienes el hábito de fronteras. El error clásico es saltar ER o tratar el score como sanción. En We Do practicarás el predicado de orden y el rechazo de parentesco inventado.",
      },
      {
        demoId: "S39-T1-B-DEMO",
        subtopicId: "S39-T1-B",
        environment: "local-python",
        description: "Registry mínimo: conteo de owners y política semver derivados de metadatos de artefactos.",
        preamble:
          "Sin dueño contactable no hay on-call del triage; sin semver no hay regresión confiable. Esta demo arma un registry mínimo (`er_engine`, `ranker`) con owners distintos y un flag `breaking` que fuerza política major. Observa el conteo de owners, el print de `semver_policy` y `owner_required`. No escribas: predice si un artefacto sin owner pasaría `registry_ok`.",
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
        why: "Ownership y bump major en breaking evitan packets de cola con paths de grafo obsoletos o rankers huérfanos. Un patch silencioso ante cambio de schema rompe la regresión S27–S39: el revisor sigue citando paths que ya no existen. Cada artefacto del triage necesita dueño y política de versión antes de liberar. En We Do practicarás major ante breaking y escalamiento si falta owner.",
        retrospective:
          "Owner + semver = contrato de evolución del triage. Confundir patch con major deja packets de cola con paths de grafo muertos. Pregunta: si `graph_schema` elimina un tipo de nodo, ¿qué bump firmas ante investigations? We Do: predicado major, tres rutas y registry de cuatro artefactos.",
      },
      {
        demoId: "S39-T2-A-DEMO",
        subtopicId: "S39-T2-A",
        environment: "local-python",
        description: "Evidence packet: claves mínimas, capas contadas, bucket por umbrales calibrados y carga de cola frente a capacidad.",
        preamble:
          "El revisor de onboarding no puede trabajar con un número suelto. Esta demo ordena las claves del packet (`case_id`, `evidence`, `graph_path`, `score`), cuenta capas, marca que score solo no basta, calcula bucket con umbrales 0.75/0.40 y carga de cola frente a capacidad 3. Observa `score_alone_ok False` y `within_capacity True`. No escribas: predice bucket para score 0.81.",
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

def queue_load(scores: list, thr_hi: float, capacity: int) -> dict:
    n_now = sum(1 for s in scores if s >= thr_hi)
    return {"n_queue_now": n_now, "within_capacity": n_now <= capacity}

keys = packet_keys(["case_id", "score", "evidence", "graph_path"])
layers = len(keys)
score_alone_ok = keys == ["score"]
load = queue_load([0.81, 0.55, 0.20, 0.92, 0.40], 0.75, capacity=3)
print(keys)
print("layers", layers)
print("score_alone_ok", score_alone_ok)
print("bucket", priority_bucket(0.81, 0.75, 0.40))
print("load", load)`,
          output: `['case_id', 'evidence', 'graph_path', 'score']
layers 4
score_alone_ok False
bucket queue_now
load {'n_queue_now': 2, 'within_capacity': True}`,
        },
        why: "El umbral calibrado (S34) ordena capacidad de cola sin convertir el score en fraude. Path y evidencia citables son el workbench del revisor: sin ellos el caso es un número huérfano. `score_alone_ok=False` es política del producto, no un detalle de UI. En We Do repararás el predicado «score > 0» y el fail-closed de gaps en el packet.",
        retrospective:
          "Packet = hechos + path + score (+ incertidumbre). El error clásico es encolar solo con 0.99 y llamar eso workbench. Pregunta: con thr_hi=0.75 y capacity=3, ¿por qué `within_capacity True` con dos `queue_now`? We Do: predicado mínimo, empty vs. missing, capas + uncertainty.",
      },
      {
        demoId: "S39-T2-B-DEMO",
        subtopicId: "S39-T2-B",
        environment: "local-python",
        description: "Override humano a skip con flag de audit y conteo de overrides derivados del log.",
        preamble:
          "El modelo prioriza; el revisor decide. En esta demo score 0.9 haría queue automático, pero el humano elige `skip` y el log marca override con audit. Observa la acción final, `n_overrides` y que todos los overrides tienen `audit True`. No escribas: predice qué pasa si `human=None`.",
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
        why: "Override sin audit no es control humano verificable: el score no ordena al revisor y el expediente miente. La precedencia humana es el núcleo del HITL en triage responsable. Si `human=None`, gana el auto por umbral; si hay acción humana, gana el humano y queda rastro. En We Do practicarás precedencia, apelación con segundo revisor y fail-closed de audit.",
        retrospective:
          "Humano gana al auto y deja rastro auditado. El error clásico es override silencioso (HITL cosmético). Pregunta: si `human=None` y score=0.9, ¿qué acción final ves y por qué? We Do: precedencia, apelación con segundo revisor y fail-closed de audit.",
      },
      {
        demoId: "S39-T3-A-DEMO",
        subtopicId: "S39-T3-A",
        environment: "local-python",
        description: "Checklist de liberación: `release_ok` se deriva de flags (sin secretos, sin autofraude).",
        preamble:
          "Liberar el triage no es «el modelo midió bien»: es un checklist firmable. Esta demo exige sin secretos en repo, sin autofraude, con RBAC y PII minimizada. Observa que `risk_release_ok` es True solo con el paquete limpio. No escribas: predice el resultado si `secrets_in_repo` fuera True.",
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
        why: "Blockers duros (secretos en repo, autofraude) no se compensan con un buen AUC. Controles positivos (RBAC, minimización de PII) deben estar en verde antes del release. El checklist es el contrato de seguridad del triage hacia CF-3. En We Do practicarás negar secrets, separar missing de reject y fairness por slice.",
        retrospective:
          "Release del triage es política firmable, no solo métrica de modelo. El error clásico es tratar secrets como «detalle de DevOps» compensable con AUC. Pregunta: si `secrets_in_repo=True` y todo lo demás verde, ¿`risk_release_ok`? We Do: predicado, missing vs. reject y fairness por slice.",
      },
      {
        demoId: "S39-T3-B-DEMO",
        subtopicId: "S39-T3-B",
        environment: "local-python",
        description: "Modo human_only ante incidente y target de rollback derivado del artefacto previo.",
        preamble:
          "Ante incidente, el throughput no manda: se corta automatización. Esta demo devuelve `human_only`, apunta rollback a `prev_model` y demuestra que incident gana aunque drift también esté alto. Observa las tres líneas. No escribas: predice el modo si solo hubiera drift.",
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
        why: "Fail-closed a humano y artefacto versionado previo protegen la cola cuando hay fuego. Drift alto pide más abstención; incidente corta el auto-skip. Confundir ambos deja el sistema en «casi normal» con riesgo activo. En We Do codificarás la prioridad de modo, la tabla de tres escenarios y el rollback frente al monitor.",
        retrospective:
          "Incident → human_only; drift → más abstención. Confundirlos deja el sistema en «casi normal» con fuego real. Pregunta: con solo drift alto, ¿rollback de modelo o `abstain_more`? We Do: prioridad, tabla de tres modos y rollback versionado.",
      },
      {
        demoId: "S39-T4-A-DEMO",
        subtopicId: "S39-T4-A",
        environment: "local-python",
        description: "Seis criterios de aceptación contados, scope de regresión S27–S39 y CF-3 con revisión externa.",
        preamble:
          "Cerrar el nivel no es imprimir OK en un script. Esta demo cuenta seis criterios de aceptación, fija regresión `S27-S39`, revisión CF-3 externa y prohíbe autodeclarar promoción. Observa las cuatro líneas de salida. No escribas: predice qué diría un revisor si `self_declared_promotion` fuera True.",
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
        why: "Aceptación medible y regresión documentada no bastan para cerrar el nivel: la promoción la confirma un evaluador externo sobre el expediente CF-3. `self_declared_promotion=False` es política de producto, no un detalle de metadata. En We Do practicarás `no_auto_fraud_label`, notas de gate y demo paths.",
        retrospective:
          "Expediente listo ≠ nivel cerrado: la promoción la confirma un evaluador externo. El error clásico es auto-PASS de promoción en el script. Pregunta: si `self_declared_promotion` fuera True, ¿qué diría el revisor de CF-3? We Do: membership de aceptación, gate_notes y demo paths.",
      },
      {
        demoId: "S39-T4-B-DEMO",
        subtopicId: "S39-T4-B",
        environment: "local-python",
        description: "Métricas de valor operativo, tres cards y post mórtem blameless derivados de estructuras.",
        preamble:
          "El negocio no lee solo AUC: lee overrides, tiempo de review y si el post mórtem es blameless. Esta demo lista claves de valor, ordena cards model/data/system y valida un post mórtem con root_cause y actions. Observa las tres líneas. No escribas: predice si un post mórtem con blameless=False pasaría.",
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
        why: "Cierre de nivel con valor operativo (override_rate, tiempo de review), cards de límites y aprendizaje sin cacería de brujas. El revisor externo de CF-3 mira ese paquete, no solo un AUC offline. En We Do codificarás el set de cards, las métricas de valor y los tokens del post mórtem.",
        retrospective:
          "Cards y valor operativo cierran el producto; el post mórtem cierra el incidente sin cacería de brujas. El error clásico es publicar solo AUC. Pregunta: ¿un post mórtem con `blameless=False` pasa `postmortem_ready`? We Do: set de cards, métricas de valor y tokens del post mórtem.",
      },
    ],
  },
  weDo: {
    intro: "S39 · Laboratorio Responsible ML Case Triage (`CASO-LIM-039`, sintético Perú): 24 retos locales. **E1** repara un predicado de dominio; **E2** separa válido, adverso y missing; **E3** demuestra fail-closed con tokens de error exactos. Sin autofraude ni autodeclarar promoción de nivel.",
    steps: [
      {
        id: "S39-T1-A-E1",
        subtopicId: "S39-T1-A",
        kind: "guided",
        title: "Orden canónico del pipeline N3",
        preamble:
          "- **Contexto:** en `CASO-LIM-039-T1A` la cola de onboarding solo es auditable si las etapas siguen el orden intake→ER→grafo→features→score→queue.\n- **Meta:** corregir el predicado que hoy compara stages con la lista invertida.\n- **Éxito:** imprimes `S39-T1-A PASS` con fixture válido (`needs_review`, `auto_fraud False`).\n- **Límites:** no inviertas el orden a mano; no marques fraude automático; no cambies el fixture.",
        instruction:
          "1. Abre el starter: `meets` usa `reversed(CANON)` (bug).\n2. Compara `record[\"stages\"]` con `CANON` en el orden correcto.\n3. Exige también `label_space == \"needs_review\"` y `auto_fraud is False`.\n4. Conserva el print `S39-T1-A` + status.",
        hint: "Compara stages con la tupla canónica; no inviertas el orden ni cambies los datos del fixture.",
        hints: [
          "Compara stages con la tupla canónica; no inviertas el orden ni cambies los datos del fixture.",
          "label_space debe ser exactamente needs_review y auto_fraud debe ser False (score ≠ fraude).",
        ],
        edgeCases: ["stages en orden inverso", "label_space fraud_certainty", "CASO-LIM-039-T1A sintético"],
        tests: "Fixture válido imprime `S39-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "El orden de stages es el contrato del run: si ER va después del grafo, los features mienten. `needs_review` y `auto_fraud False` impiden que el score se lea como veredicto de conducta.",
        retrospective:
          "Orden canónico + `needs_review` + `auto_fraud False` = frontera del triage: el score solo prioriza cola. El error clásico es invertir la comparación o «arreglar» el fixture. Pregunta: si ER va después del grafo, ¿qué miente — features o el revisor? Siguiente (E2): separar orden malo de schema incompleto.",
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
        title: "Schema incompleto vs. orden adverso",
        preamble:
          "- **Contexto:** en operaciones de Lima, un registro sin `label_space` no se «arregla» inventando fraude; se reporta como missing.\n- **Meta:** implementar `assess` que priorice campos faltantes y luego valide orden + política.\n- **Éxito:** línea exacta `PASS REJECT_STAGE_ORDER MISSING:label_space`.\n- **Límites:** no evalúes stages si falta clave; no uses un solo token genérico para todo fallo.",
        instruction:
          "1. Revisa el starter: acepta orden invertido como OK (bug).\n2. Primero calcula `missing` de `case_id`, `stages`, `label_space`, `auto_fraud`.\n3. Si hay missing, devuelve `MISSING:…`; si no, valida CANON + `needs_review` + `auto_fraud is False`.\n4. Imprime las tres evaluaciones en una línea.",
        hint: "Primero calcula missing de campos requeridos; no evalúes stages si falta label_space.",
        hints: [
          "Primero calcula missing de campos requeridos; no evalúes stages si falta label_space.",
          "El adverso tiene stages al revés: debe fallar por contenido (REJECT_STAGE_ORDER), no por schema.",
        ],
        edgeCases: ["stages invertidos", "falta label_space", "auto_fraud True es adverso de política"],
        tests: "Salida exacta: PASS REJECT_STAGE_ORDER MISSING:label_space",
        feedback:
          "Missing y contenido adverso bloquean la cola con señales distintas: el revisor de onboarding arregla schema o corrige orden, no el mismo ticket genérico.",
        retrospective:
          "Tres tokens distintos protegen tres tickets distintos: schema incompleto, orden adverso y política de score. El error clásico es un solo `REJECT` genérico. Pregunta: si falta `label_space`, ¿por qué no inventar `fraud_certainty`? Luego (E3): alcance de ER sin parentesco.",
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
        title: "ER sin parentesco: fail-closed del pipeline",
        preamble:
          "- **Contexto:** en el triage sintético, ER solo decide si dos registros son la **misma entidad**; nunca familia ni culpa.\n- **Meta:** enrutar cuatro fixtures con tokens exactos de fail-closed.\n- **Éxito:** `CONTINUE REJECT_STAGE_ORDER REJECT_ER_SCOPE REQUEST_STAGE_LIST`.\n- **Límites:** no inventes stages ni evidencia; incertidumbre (missing) ≠ breach de parentesco.",
        instruction:
          "1. Si falta `stages` → `REQUEST_STAGE_LIST`.\n2. Si `er_claims_parentesco` → `REJECT_ER_SCOPE`.\n3. Si orden o política incorrectos → `REJECT_STAGE_ORDER`.\n4. Si no, `CONTINUE`. Imprime los cuatro resultados.",
        hint: "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
        hints: [
          "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
          "ER solo habla de la misma entidad; er_claims_parentesco True es REJECT_ER_SCOPE aunque el orden de stages sea correcto.",
        ],
        edgeCases: ["er_claims_parentesco", "stages faltantes", "orden invertido"],
        tests: "Salida: CONTINUE REJECT_STAGE_ORDER REJECT_ER_SCOPE REQUEST_STAGE_LIST",
        feedback:
          "El alcance de ER es la misma entidad: parentesco y fraude no se infieren del pipeline. Un `CONTINUE` silencioso ante parentesco inventado envenena el packet del revisor.",
        retrospective:
          "Fail-closed protege al revisor: pide lo que falta y rechaza parentesco inventado. El error clásico es `CONTINUE` silencioso. Pregunta: ¿missing de stages es lo mismo que claim de familia? En el You Do el mismo principio vive en packet y audit.",
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
        title: "Breaking change exige bump major",
        preamble:
          "- **Contexto:** en `CASO-LIM-039-T1B` el `graph_schema` rompe paths ya guardados en packets; el bump debe ser major.\n- **Meta:** corregir el predicado que hoy exige `minor` ante `breaking=True`.\n- **Éxito:** `S39-T1-B PASS` con owner presente y bump major.\n- **Límites:** no borres el fixture; no aceptes owner vacío.",
        instruction:
          "1. Localiza el DEFECTO: `bump == \"minor\"`.\n2. Cambia a `bump == \"major\"` cuando `breaking` es True.\n3. Mantén `bool(record[\"owner\"])`.\n4. Imprime `S39-T1-B` + status.",
        hint: "Breaking change → major. Owner vacío o None falla el contrato aunque el bump sea correcto.",
        hints: [
          "Breaking change → major. Owner vacío o None falla el contrato aunque el bump sea correcto.",
          "No alteres el fixture; corrige solo la expresión booleana del predicado.",
        ],
        edgeCases: ["breaking con bump minor", "owner vacío", "CASO-LIM-039-T1B sintético"],
        tests: "Imprime `S39-T1-B PASS` cuando bump=major, owner presente y breaking True.",
        feedback:
          "Semver major comunica breaking al equipo de investigations y a la regresión S27–S39. Un minor silencioso deja packets huérfanos en cola.",
        retrospective:
          "Breaking → major + owner contactable. El error clásico es «es solo un campo del grafo» y publicar patch. Pregunta: ¿quién recibe el semver en el on-call de la cola? Siguiente (E2): tres rutas (política vs. missing de owner).",
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
        title: "Owner faltante vs. política de bump",
        preamble:
          "- **Contexto:** el ranker de `ml-risk` no puede ir a producción sin owner ni con bump incorrecto ante breaking.\n- **Meta:** `assess` con missing-antes-de-contenido y rechazo de política.\n- **Éxito:** `PASS REJECT_BUMP_POLICY MISSING:owner`.\n- **Límites:** no mires bump si falta owner; no inventes owner por defecto.",
        instruction:
          "1. Calcula missing de claves requeridas.\n2. Si owner vacío o ausente → `MISSING:owner`.\n3. Si `breaking` y `bump != \"major\"` → `REJECT_BUMP_POLICY`.\n4. Imprime las tres rutas.",
        hint: "Si falta owner, devuelve MISSING:owner sin mirar bump.",
        hints: [
          "Si falta owner, devuelve MISSING:owner sin mirar bump.",
          "Si breaking y bump != major → REJECT_BUMP_POLICY aunque haya owner.",
        ],
        edgeCases: ["owner ausente", "breaking con patch", "registry de 4 artefactos conceptuales"],
        tests: "Salida: PASS REJECT_BUMP_POLICY MISSING:owner",
        feedback:
          "Owner y major bump son chequeos independientes: uno es gente de on-call, el otro es contrato de evolución. Confundirlos retrasa el release del triage.",
        retrospective:
          "Gente (owner) y contrato (bump) se fallan por caminos distintos: un ticket de staffing no es un ticket de semver. El error clásico es inventar owner por defecto para «pasar» el release. Pregunta: si el owner está vacío pero el bump es major, ¿qué token gana? Luego: registry de cuatro artefactos como conjunto.",
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
        title: "Registry completo o escala",
        preamble:
          "- **Contexto:** el triage de Lima no se libera «por partes»: basta un artefacto sin owner para escalar.\n- **Meta:** `decide` sobre registry happy, sin owner en ranker y breaking con minor en graph_schema.\n- **Éxito:** `CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY`.\n- **Límites:** corrige el off-by-one; no ignores owners vacíos.",
        instruction:
          "1. Recorre todos los artefactos en `decide`.\n2. Sin owner → `ESCALATE_NO_OWNER`; breaking sin major → `REJECT_BUMP_POLICY`.\n3. Imprime `CONTINUE`, `len(registry)` (=4), y las dos rutas adversas.\n4. No uses `len - 1`.",
        hint: "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea el registry entero.",
        hints: [
          "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea el registry entero.",
          "n_art es len(registry) (=4). Corrige el off-by-one del starter y valida owner + bump major ante breaking.",
        ],
        edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto"],
        tests: "Salida: CONTINUE 4 ESCALATE_NO_OWNER REJECT_BUMP_POLICY",
        feedback:
          "El registry es un conjunto: un hueco bloquea el release del triage. El off-by-one miente sobre cobertura ante el revisor de CF-3.",
        retrospective:
          "El registry se libera entero o se escala: un hueco de owner no se «compensa» con tres artefactos verdes. El off-by-one miente sobre cobertura ante auditoría. Pregunta: ¿qué miraría primero un revisor de CF-3 — happy path o owners vacíos? En el You Do el mismo conjunto vive en system-card y manifest.",
        starterCode: {
          language: 'python',
          title: "s39-t1-b-e3.py",
          code: `# Tarea: registry con owners y bump major
# DEFECTO: decide no valida owners ni bump
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "Packet mínimo con path y evidencia",
        preamble:
          "- **Contexto:** en `CASO-LIM-039-T2A` el revisor necesita path `E1 → ph:900 → E2` y evidencia de teléfono sintético, no solo 0.81.\n- **Meta:** exigir case_id, score, evidence y graph_path no vacíos.\n- **Éxito:** `S39-T2-A PASS`.\n- **Límites:** no aceptes score solo; no inventes path si faltara.",
        instruction:
          "1. Reemplaza `score > 0` por chequeos de las cuatro claves.\n2. Verifica listas `evidence` y `graph_path` con longitud > 0.\n3. Status PASS o REJECT_PACKET_INCOMPLETE.\n4. Conserva el print del subtema.",
        hint: "evidence y graph_path deben ser listas con al menos un elemento; score solo no basta.",
        hints: [
          "evidence y graph_path deben ser listas con al menos un elemento; score solo no basta.",
          "No cambies los datos del fixture feliz; corrige el predicado meets_contract.",
        ],
        edgeCases: ["evidence vacía", "sin graph_path", "solo score"],
        tests: "Imprime `S39-T2-A PASS` cuando el packet tiene las cuatro claves mínimas útiles.",
        feedback:
          "Sin path ni evidencia el caso no es «listo para cola»: es un score huérfano. El packet mínimo es el workbench mínimo del revisor de onboarding.",
        retrospective:
          "Cuatro piezas mínimas del packet: sin path ni evidencia el revisor no puede citar. El error clásico es confiar en un score alto. Pregunta: ¿`score=0.99` con `evidence=[]` es PASS? Siguiente: distinguir lista vacía de clave ausente.",
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
        title: "Evidence vacía vs. path ausente",
        preamble:
          "- **Contexto:** en la cola de Lima, evidence vacía y path omitido se diagnostican distinto: uno es contenido inválido, el otro es schema incompleto.\n- **Meta:** tokens `PASS`, `REJECT_PACKET_INCOMPLETE`, `MISSING:graph_path`.\n- **Éxito:** esa línea exacta de tres tokens.\n- **Límites:** score 0.99 sin path nunca es PASS.",
        instruction:
          "1. Primero missing de claves requeridas.\n2. Luego rechaza listas vacías de evidence o graph_path.\n3. Imprime las tres evaluaciones.\n4. No hardcodees tokens sin evaluar fixtures.",
        hint: "Missing de clave ≠ lista vacía: tokens distintos (MISSING frente a REJECT_PACKET_INCOMPLETE).",
        hints: [
          "Missing de clave ≠ lista vacía: tokens distintos (MISSING frente a REJECT_PACKET_INCOMPLETE).",
          "score alone nunca es PASS aunque sea 0.99.",
        ],
        edgeCases: ["evidence vacía", "graph_path ausente", "score alto sin path"],
        tests: "Salida: PASS REJECT_PACKET_INCOMPLETE MISSING:graph_path",
        feedback:
          "El revisor no puede trabajar con score huérfano ni path omitido. Tokens distintos aceleran la remediación en la cola HITL.",
        retrospective:
          "Missing pide schema; incomplete rechaza basura. El revisor gana tiempo si el token es honesto. Pregunta: evidence `[]` y path omitido — ¿mismo ticket de remediación? Luego: uncertainty y capas de explicación (S35).",
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
        title: "Capas de explicación o rechazo",
        preamble:
          "- **Contexto:** la explicación usable (S35) solo tiene sentido con packet completo e incertidumbre declarada.\n- **Meta:** devolver status + layers (4 solo si OK).\n- **Éxito:** `CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY`.\n- **Límites:** no inventes `in_distribution` ni path en el adverso score-only.",
        instruction:
          "1. Score-only (solo case_id+score) → REJECT_SCORE_ALONE.\n2. Sin `uncertainty` → REQUEST_UNCERTAINTY.\n3. Packet OK → CONTINUE, layers 4.\n4. Imprime unpack del happy y los status de adversarios.",
        hint: "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
        hints: [
          "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
          "uncertainty ausente es incertidumbre de contrato → REQUEST_UNCERTAINTY, no inventes in_distribution.",
        ],
        edgeCases: ["solo score", "sin uncertainty", "evidence vacía"],
        tests: "Salida: CONTINUE 4 REJECT_SCORE_ALONE REQUEST_UNCERTAINTY",
        feedback:
          "Explicación en capas exige evidencia: no enmascares gaps del packet con layers=1. Capas sin hechos son teatro para el revisor.",
        retrospective:
          "Capas sin evidencia son teatro. El error clásico es CONTINUE con layers=1. Pregunta: ¿puedes inventar `in_distribution` para «completar» capas? En el You Do packet y cards deben contar la misma historia.",
        starterCode: {
          language: 'python',
          title: "s39-t2-a-e3.py",
          code: `def decide(packet: dict):
    # DEFECTO: siempre continúa con layers=1; debe validar packet mínimo
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
# Tres rutas visibles: OK / score-only / sin uncertainty
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
        title: "Override humano gana al auto",
        preamble:
          "- **Contexto:** en `CASO-LIM-039-T2B` el auto pondría queue (0.9 ≥ 0.7); el revisor de Lima hace skip por evidencia insuficiente.\n- **Meta:** que final=human_action y override=True cuando hay humano.\n- **Éxito:** `S39-T2-B PASS`.\n- **Límites:** no borres el score; no ignores human_action.",
        instruction:
          "1. Calcula auto por umbral.\n2. Si `human_action` no es None, final = human_action y override True.\n3. Verifica final skip + override True.\n4. Imprime status del subtema.",
        hint: "human_action no nulo gana siempre; debe setear override True en el evento de audit conceptual.",
        hints: [
          "human_action no nulo gana siempre; debe setear override True en el evento de audit conceptual.",
          "No borres el score; solo corrige la precedencia de la decisión final.",
        ],
        edgeCases: ["human skip con score alto", "sin human → auto queue", "sin audit conceptual"],
        tests: "Imprime `S39-T2-B PASS` con final skip y override True.",
        feedback:
          "El score solo sugiere prioridad. Si el humano no puede ganar al auto, el HITL es cosmético y el audit miente.",
        retrospective:
          "Precedencia humana es el núcleo del triage responsable: el score sugiere, no ordena al revisor. El error clásico es dejar `final = auto` aunque haya skip humano. Pregunta: ¿override sin cambiar la acción final engaña al audit? Siguiente: apelación exige segundo revisor.",
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
        title: "Apelación con segundo revisor",
        preamble:
          "- **Contexto:** si el cliente apela, el caso reabre con **otro** revisor; no con el mismo criterio silencioso.\n- **Meta:** devolver `queue`, `skip` o `MISSING:second_reviewer` según el fixture.\n- **Éxito:** línea `queue skip MISSING:second_reviewer`.\n- **Límites:** appeal sin second_reviewer no cierra; override solo con human_action.",
        instruction:
          "1. Si appeal y no hay second_reviewer → MISSING.\n2. Si hay human_action → devuélvelo.\n3. Si no, auto por umbral.\n4. Imprime las tres salidas de assess.",
        hint: "Si appeal True y no hay second_reviewer → MISSING:second_reviewer antes de cerrar.",
        hints: [
          "Si appeal True y no hay second_reviewer → MISSING:second_reviewer antes de cerrar.",
          "Override solo aplica cuando human_action no es None; imprime la acción final o el missing.",
        ],
        edgeCases: ["apelación sin segundo revisor", "override a skip", "auto por umbral"],
        tests: "Salida: queue skip MISSING:second_reviewer",
        feedback:
          "Apelación exige segundo par de ojos documentado; override exige acción humana explícita. Un reopen sin control no es HITL verificable.",
        retrospective:
          "Apelación = segundo par de ojos documentado, no un `reopen` mágico. El error clásico es reabrir sin `second_reviewer`. Pregunta: ¿por qué el mismo revisor no basta para el expediente? Luego: audit de feedback sin leakage.",
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
        title: "Feedback solo con audit completo",
        preamble:
          "- **Contexto:** el feedback del revisor puede mejorar reglas o datasets, pero sin audit ni id se reinyecta basura o se pierde la cadena de custodia.\n- **Meta:** fail-closed en tres eventos de log.\n- **Éxito:** `LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID`.\n- **Límites:** sin audit_entry no hay override válido; feedback sin id no se loguea; cuida leakage temporal.",
        instruction:
          "1. Override sin audit_entry → REJECT_NO_AUDIT.\n2. Feedback sin feedback_id → REQUEST_FEEDBACK_ID.\n3. Happy con leakage_care → LOGGED True.\n4. Imprime unpack del happy + tokens adversarios.",
        hint: "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
        hints: [
          "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
          "leakage_care True es obligatorio al loguear feedback hacia datasets o reglas.",
        ],
        edgeCases: ["override sin audit", "feedback sin id", "leakage_care False"],
        tests: "Salida: LOGGED True REJECT_NO_AUDIT REQUEST_FEEDBACK_ID",
        feedback:
          "Feedback y override solo cuentan si el audit es completo y sin leakage. «LOGGED siempre» envenena el train set y el expediente CF-3.",
        retrospective:
          "Audit y feedback_id hacen al feedback reutilizable sin leakage. El error clásico es «LOGGED siempre». En el You Do el audit.jsonl es la prueba del HITL.",
        starterCode: {
          language: 'python',
          title: "s39-t2-b-e3.py",
          code: `def decide(event: dict):
    # DEFECTO: siempre loguea; debe exigir audit_entry y feedback_id
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
# Tres rutas visibles: happy / sin audit / sin feedback_id
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
        title: "Secretos bloquean el release",
        preamble:
          "- **Contexto:** en el release de `CASO-LIM-039-T3A`, un secreto en el repo es blocker duro aunque el resto del checklist esté verde.\n- **Meta:** `release_ok` con `not secrets_in_repo` y demás flags True.\n- **Éxito:** `S39-T3-A PASS` en el fixture limpio.\n- **Límites:** no borres campos; no trates True de secrets como «OK».",
        instruction:
          "1. Abre el DEFECTO: incluye `checklist[\"secrets_in_repo\"]` en el `all` sin negar.\n2. Usa `not checklist[\"secrets_in_repo\"]`.\n3. Mantén pii, rbac, slice_metrics, input_limits.\n4. Imprime status del subtema.",
        hint: "not secrets_in_repo es obligatorio; un True bloquea aunque el resto esté verde.",
        hints: [
          "not secrets_in_repo es obligatorio; un True bloquea aunque el resto esté verde.",
          "No borres campos del checklist; corrige solo el predicado all(...).",
        ],
        edgeCases: ["secrets_in_repo True", "rbac False", "sin slice_metrics"],
        tests: "Imprime `S39-T3-A PASS` cuando el checklist limpio cumple el contrato.",
        feedback:
          "Secretos en repo invalidan el expediente de seguridad del triage. No se «compensan» con un buen AUC ni con RBAC verde.",
        retrospective:
          "`not secrets_in_repo` es hábito de release: un True bloquea aunque RBAC y PII estén verdes. El error clásico es leer el flag «en positivo» dentro del `all`. Pregunta: ¿un buen AUC limpia un secreto en el repo? Siguiente: secrets activos vs. controles ausentes.",
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
        title: "Missing de control vs. secrets activos",
        preamble:
          "- **Contexto:** falta de RBAC y secrets en repo no se arreglan igual: uno pide el control, el otro rechaza la violación.\n- **Meta:** tres tokens exactos en una línea.\n- **Éxito:** `PASS REJECT_SECRETS MISSING:rbac`.\n- **Límites:** no confundes missing con reject genérico.",
        instruction:
          "1. Missing de claves requeridas primero.\n2. Si secrets_in_repo True → REJECT_SECRETS.\n3. Si no, valida resto y PASS/REJECT_RELEASE.\n4. Imprime las tres rutas.",
        hint: "Missing de rbac se detecta por claves; secrets True es breach de contenido.",
        hints: [
          "Missing de rbac se detecta por claves; secrets True es breach de contenido.",
          "min_role conceptual del packet es reviewer; aquí solo validas flags del checklist.",
        ],
        edgeCases: ["secrets en repo", "rbac ausente", "pii no minimizada"],
        tests: "Salida: PASS REJECT_SECRETS MISSING:rbac",
        feedback:
          "Separa ausencia de control (missing) de violación activa (secrets): el ticket de remediación y el bloqueo de release no son el mismo.",
        retrospective:
          "Tokens distintos aceleran remediación: missing pide el control; secrets rechaza la violación. El error clásico es un `REJECT_RELEASE` genérico para ambos. Pregunta: ¿falta de RBAC se arregla igual que una API key en el repo? Luego: fairness de cola por slice, no culpa grupal.",
        starterCode: {
          language: 'python',
          title: "s39-t3-a-e2.py",
          code: `# Tarea: bloquear secrets_in_repo en el release
# DEFECTO: assess PASS sin bloquear secrets_in_repo
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "Fairness de cola por slice, no culpa",
        preamble:
          "- **Contexto:** en el batch sintético, un `fp_rate` alto en `canal_app` significa **demasiado daño de revisión** en ese canal, no «ese canal es culpable».\n- **Meta:** CONTINUE con métrica `fp_rate`, o REQUEST/REJECT según slices.\n- **Éxito:** `CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP`.\n- **Límites:** no uses el score para afirmar fraude en un slice; no inventes slices.",
        instruction:
          "1. Slices vacíos o ausentes → REQUEST_SLICE_METRICS.\n2. Si algún fp_rate > umbral → REJECT_SLICE_FP.\n3. Si no → CONTINUE, métrica `fp_rate` (no auc).\n4. Imprime las tres rutas.",
        hint: "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
        hints: [
          "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
          "REQUEST_SLICE_METRICS cuando la clave slices no existe o está vacía.",
        ],
        edgeCases: ["sin slices", "fp_rate sobre umbral", "metric nombre fp_rate"],
        tests: "Salida: CONTINUE fp_rate REQUEST_SLICE_METRICS REJECT_SLICE_FP",
        feedback:
          "Fairness operativa mide daño de revisión por slice, no culpa grupal. Un AUC global verde no limpia un canal con cola injusta.",
        retrospective:
          "Fairness operativa protege a usuarios de revisión injusta por canal. El error clásico es mirar solo AUC global. En cards del You Do documentas slices sintéticos sin PII real.",
        starterCode: {
          language: 'python',
          title: "s39-t3-a-e3.py",
          code: `def decide(payload: dict):
    # DEFECTO: ignora slices y devuelve auc; debe validar fp_rate por slice
    return "CONTINUE", "auc"

happy = {
    "case_id": "CASO-LIM-039-T3A",
    "slices": [{"name": "canal_app", "fp_rate": 0.08}],
    "fp_threshold": 0.15,
}
empty = {**happy, "slices": []}
high_fp = {**happy, "slices": [{"name": "canal_app", "fp_rate": 0.4}]}
# Tres rutas visibles: OK / slices vacíos / fp_rate alto
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
        title: "Incidente manda sobre drift",
        preamble:
          "- **Contexto:** en `CASO-LIM-039-T3B` hay incidente y drift a la vez; el modo seguro es human_only, no «abstener un poco más».\n- **Meta:** corregir la prioridad de `mode(drift_high, incident)`.\n- **Éxito:** `S39-T3-B PASS`.\n- **Límites:** no devuelvas abstain_more si incident es True.",
        instruction:
          "1. Primero `if incident: return \"human_only\"`.\n2. Luego drift → abstain_more.\n3. Si no, normal.\n4. Imprime status del assert del fixture.",
        hint: "incident gana siempre sobre drift; no devuelvas abstain_more si incident es True.",
        hints: [
          "incident gana siempre sobre drift; no devuelvas abstain_more si incident es True.",
          "Corrige solo la función mode; el fixture de assert usa incident=True.",
        ],
        edgeCases: ["incident y drift simultáneos", "solo drift", "normal"],
        tests: "Imprime `S39-T3-B PASS` si mode(incident=True)=human_only.",
        feedback:
          "human_only es fail-closed de incidente: el revisor manda y el modelo deja de auto-saltar casos. El throughput espera.",
        retrospective:
          "Orden de `if`s = política de seguridad: incident gana aunque drift también esté alto. El error clásico es «abstener un poco más» en pleno incidente. Pregunta: ¿por qué el throughput espera en human_only? Siguiente: tabla completa normal / drift / incident.",
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
        title: "Tabla de modos ops del triage",
        preamble:
          "- **Contexto:** el runbook de ops de la fintech sintética necesita la tabla completa, no solo el caso de incidente.\n- **Meta:** (F,F)→normal, (T,F)→abstain_more, (F,T)→human_only.\n- **Éxito:** `normal abstain_more human_only`.\n- **Límites:** no inventes labels de fraude al subir abstención; no intercambies ramas.",
        instruction:
          "1. Corrige las ramas invertidas del starter.\n2. Prioriza incident sobre drift.\n3. Imprime las tres combinaciones del enunciado.\n4. No hardcodees la línea sin llamar a `mode`.",
        hint: "Tabla de verdad simple: (F, F) = normal; (T, F) = abstain_more; (F, T) = human_only.",
        hints: [
          "Tabla de verdad simple: (F, F) = normal; (T, F) = abstain_more; (F, T) = human_only.",
          "Si ambos True, human_only (cubierto por la prioridad de incident).",
        ],
        edgeCases: ["ambos True", "flags ausentes conceptualmente", "rollback target aparte"],
        tests: "Salida: normal abstain_more human_only",
        feedback:
          "Drift reduce automatización; incident la corta. Invertir los modos deja el runbook mentiroso cuando hay fuego real.",
        retrospective:
          "La tabla del runbook es el contrato de ops: (F,F) normal, drift abstain_more, incident human_only. El error clásico es intercambiar ramas y mentir cuando hay fuego. Pregunta: con ambos True, ¿qué fila gana y por qué no basta «solo drift»? Luego: rollback versionado vs. monitor de drift.",
        starterCode: {
          language: 'python',
          title: "s39-t3-b-e2.py",
          code: `# Tarea: modos drift e incidente
# DEFECTO: ramas invertidas human_only/abstain
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "Rollback versionado o monitor de drift",
        preamble:
          "- **Contexto:** rollback no es «reiniciar la laptop»: apunta a `prev_model_id` versionado. Drift sin incidente no revierte el modelo a ciegas.\n- **Meta:** tres respuestas ops exactas.\n- **Éxito:** `ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more`.\n- **Límites:** sin prev no inventes id; no mezcles STAY con human_only.",
        instruction:
          "1. Incident con prev → ROLLBACK + id.\n2. Incident sin prev → REQUEST_PREV_MODEL.\n3. Solo drift → MONITOR abstain_more.\n4. Imprime las tres rutas.",
        hint: "Rollback apunta a artefacto versionado previo, no al working tree local.",
        hints: [
          "Rollback apunta a artefacto versionado previo, no al working tree local.",
          "Sin prev_model_id no inventes un id; pide REQUEST_PREV_MODEL.",
        ],
        edgeCases: ["sin prev_model_id", "solo drift", "incident con prev"],
        tests: "Salida: ROLLBACK previous_model REQUEST_PREV_MODEL MONITOR abstain_more",
        feedback:
          "Rollback y abstención son controles distintos: no te quedes en current_model en pleno incidente ni reviertas el modelo por un drift leve.",
        retrospective:
          "Rollback apunta a `prev_model_id` versionado; drift sin incidente no revierte a ciegas. El error clásico es STAY en current_model con incidente. Pregunta: sin prev, ¿inventas un id o pides REQUEST? En el You Do `force_failure` empuja a human_only con audit.",
        starterCode: {
          language: 'python',
          title: "s39-t3-b-e3.py",
          code: `def decide(ops: dict):
    # DEFECTO: siempre STAY; debe ROLLBACK en incident y MONITOR en drift
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
# Tres rutas visibles: incident con prev / sin prev / solo drift
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
        title: "Aceptación sin auto-label de fraude",
        preamble:
          "- **Contexto:** el checklist de `CASO-LIM-039-T4A` debe incluir el string exacto `no_auto_fraud_label`: el score no etiqueta fraude.\n- **Meta:** membership correcto en la lista de aceptación.\n- **Éxito:** `S39-T4-A PASS`.\n- **Límites:** no inventes alias `auto_fraud_ok`; no reescribas la lista.",
        instruction:
          "1. Reemplaza `\"auto_fraud_ok\" in acceptance` por `\"no_auto_fraud_label\"`.\n2. Exige también e2e_synthetic_run y audit_log.\n3. Imprime status del subtema.\n4. No hardcodees PASS sin membership.",
        hint: "Busca el string exacto no_auto_fraud_label dentro de la lista acceptance.",
        hints: [
          "Busca el string exacto no_auto_fraud_label dentro de la lista acceptance.",
          "No reescribas la lista; corrige la condición membership.",
        ],
        edgeCases: ["falta no_auto_fraud_label", "lista vacía", "typo fraud_auto"],
        tests: "Imprime `S39-T4-A PASS` si el checklist de aceptación es completo en lo esencial.",
        feedback:
          "Sin la prohibición explícita de auto-label, el e2e puede «pasar» y aun así declarar fraude. El string del criterio es el contrato del producto.",
        retrospective:
          "Aceptación = criterios citables con el string exacto del producto, no alias «casi iguales». El error clásico es un e2e verde que aún declara fraude. Pregunta: ¿por qué no basta `auto_fraud_ok` como sinónimo? Siguiente: regresión y CF-3 sin autodeclarar promoción.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e1.py",
          code: `# Tarea: aceptación sin etiqueta auto_fraud
# DEFECTO: clave auto_fraud_ok incorrecta
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "CF-3 externo, sin auto-promoción",
        preamble:
          "- **Contexto:** documentas smoke S27–S39 y CF-3; un revisor externo confirma. Autodeclarar promoción es rechazo de política.\n- **Meta:** assess de gate_notes con tres rutas.\n- **Éxito:** `PASS REJECT_AUTO_PASS MISSING:regression_scope`.\n- **Límites:** self_declared_promotion True nunca es PASS; scope debe ser exacto `S27-S39`.",
        instruction:
          "1. Missing de claves primero.\n2. Si self_declared_promotion True → REJECT_AUTO_PASS.\n3. Valida scope y cf3_review external.\n4. Imprime las tres rutas.",
        hint: "No autodeclares promoción: self_declared_promotion True es rechazo de política. CF-3 se confirma con revisión externa.",
        hints: [
          "No autodeclares promoción: self_declared_promotion True es rechazo de política. CF-3 se confirma con revisión externa.",
          "cf3_review external recuerda que un evaluador externo cierra el gate.",
        ],
        edgeCases: ["self_declared_promotion True", "scope incompleto", "cf3_review no external"],
        tests: "Salida: PASS REJECT_AUTO_PASS MISSING:regression_scope",
        feedback:
          "Regresión y expediente se documentan; la promoción la confirma un revisor externo. Un auto-PASS en el manifest no cierra el nivel.",
        retrospective:
          "Tú dejas evidencia; otro cierra el nivel. El error clásico es `promotion=True` en el manifest. En el You Do el manifest ya trae `self_declared_promotion: false`.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e2.py",
          code: `# Tarea: notas de regresión y CF-3
# DEFECTO: acepta self_declared_promotion True (auto pass)
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
def assess(notes: dict) -> str:
    required = {"regression_scope", "cf3_review", "self_declared_promotion"}
    missing = sorted(required - notes.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: acepta autodeclarar promoción
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
        title: "Demo e2e: happy, override y abstención",
        preamble:
          "- **Contexto:** la demo de aceptación del triage debe mostrar override humano y abstención OOD, no solo el caso feliz.\n- **Meta:** conjunto canónico de tres paths.\n- **Éxito:** `CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH`.\n- **Límites:** usa el token `ood_abstain` (no un alias vago); no inventes paths.",
        instruction:
          "1. Conjunto vacío o incompleto (sin ood_abstain) → REQUEST_DEMO_PATH.\n2. Solo happy → REJECT_HAPPY_ONLY.\n3. Happy+override+ood_abstain → CONTINUE 3.\n4. Imprime las tres rutas.",
        hint: "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
        hints: [
          "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
          "ood_abstain es distinto de ood; usa el token canónico del theory block.",
        ],
        edgeCases: ["solo happy", "path mal nombrado", "lista vacía"],
        tests: "Salida: CONTINUE 3 REJECT_HAPPY_ONLY REQUEST_DEMO_PATH",
        feedback:
          "La demo de triage debe cubrir override y abstención, no solo el caso feliz. Una demo de marketing no es demo de aceptación del HITL.",
        retrospective:
          "La demo demuestra control humano y abstención OOD, no solo que el score «funciona». Pregunta: ¿por qué `ood_abstain` y no un alias vago `ood`? En el You Do los tres `demo_cases` son ese contrato.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e3.py",
          code: `# Tarea: matriz de caminos e2e
# DEFECTO: decide CONTINUE sin validar paths
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
def decide(paths: list):
    # DEFECTO: acepta cualquier lista; debe exigir happy+override+ood_abstain
    return "CONTINUE", len(paths)

full = ["happy", "override", "ood_abstain"]
happy_only = ["happy"]
partial = ["happy", "override"]
# Tres rutas visibles: completo / solo happy / sin ood_abstain
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
        title: "Tres cards: model, data, system",
        preamble:
          "- **Contexto:** el paquete mínimo de cierre de `CASO-LIM-039-T4B` son model, data y system cards — límites y ownership publicados.\n- **Meta:** igualdad de sets con esas tres.\n- **Éxito:** `S39-T4-B PASS`.\n- **Límites:** no exijas `ops`; no omitas `system`.",
        instruction:
          "1. Corrige el set que incluye `\"ops\"`.\n2. `set(cards) == {\"model\", \"data\", \"system\"}`.\n3. Imprime status.\n4. No rellenes una cuarta card para «compensar».",
        hint: "Conjunto {model, data, system}; ni de más ni de menos para el contrato mínimo de S39.",
        hints: [
          "Conjunto {model, data, system}; ni de más ni de menos para el contrato mínimo de S39.",
          "Orden de impresión puede ser sorted; el predicado usa igualdad de sets.",
        ],
        edgeCases: ["falta system", "card extra no compensa falta", "lista vacía"],
        tests: "Imprime `S39-T4-B PASS` cuando las tres cards mínimas están presentes.",
        feedback:
          "Las tres cards son el mínimo legible para un revisor externo de CF-3. Una card inventada no sustituye system.",
        retrospective:
          "model/data/system = paquete mínimo de límites y ownership. El error clásico es inventar una card `ops` o omitir `system` «porque sobra». Pregunta: ¿una card extra compensa la falta de system ante CF-3? Siguiente: métricas de valor que negocio sí lee.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e1.py",
          code: `# Tarea: model/data/system cards
# DEFECTO: exige ops extra innecesariamente
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "Valor operativo, no solo AUC",
        preamble:
          "- **Contexto:** en la cola de onboarding, override_rate y tiempo de review cuentan más para el cierre que un AUC offline suelto.\n- **Meta:** exigir clave `value` con al menos `override_rate`.\n- **Éxito:** `PASS REJECT_VALUE_METRICS MISSING:value`.\n- **Límites:** auc solo → REJECT; sin dict value → MISSING.",
        instruction:
          "1. Si falta clave value → MISSING:value.\n2. Si no hay override_rate → REJECT_VALUE_METRICS.\n3. Si no → PASS.\n4. Imprime las tres rutas.",
        hint: "Valor operativo del triage ≠ solo AUC; override_rate es la métrica canónica de este ejercicio.",
        hints: [
          "Valor operativo del triage ≠ solo AUC; override_rate es la métrica canónica de este ejercicio.",
          "MISSING:value cuando el payload no trae la clave value.",
        ],
        edgeCases: ["solo auc", "value ausente", "override_rate 0.12 válido"],
        tests: "Salida: PASS REJECT_VALUE_METRICS MISSING:value",
        feedback:
          "Negocio lee overrides y tiempo de review; AUC no basta para el cierre del triage. Valor = cómo opera la cola, no solo ranking offline.",
        retrospective:
          "Valor operativo del triage = cómo opera la cola (override_rate, tiempo de review), no un AUC offline suelto. El error clásico es enorgullecerse del ranking y omitir overrides. Pregunta: con solo `auc=0.91`, ¿qué token devuelves? Luego: post mórtem blameless con root_cause y actions.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e2.py",
          code: `# Tarea: métricas de valor (no solo AUC)
# DEFECTO: acepta auc solo como value
# Corrige el defecto del predicado; la salida debe coincidir con el enunciado
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
        title: "Post mórtem blameless con acciones",
        preamble:
          "- **Contexto:** el aprendizaje del incidente del triage es de sistemas y procesos, no de cacería de brujas.\n- **Meta:** validar blameless, root_cause no vacío y actions no vacía.\n- **Éxito:** `CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS`.\n- **Límites:** no uses nombres de personas como root_cause; no dejes actions=[].",
        instruction:
          "1. blameless no True → REJECT_BLAMEFUL.\n2. root_cause vacío → REQUEST_ROOT_CAUSE.\n3. actions vacía → REQUEST_ACTIONS.\n4. Happy → CONTINUE True. Imprime las cuatro rutas.",
        hint: "Blameless mira procesos y sistemas; no nombres de personas como root_cause. Actions vacía tiene token propio (REQUEST_ACTIONS).",
        hints: [
          "Blameless mira procesos y sistemas; no nombres de personas como root_cause.",
          "actions debe ser lista con al menos un ítem (rollback, recalibrate, etc.); si falta → REQUEST_ACTIONS.",
        ],
        edgeCases: ["blameless False", "root_cause vacío", "actions []"],
        tests: "Salida: CONTINUE True REJECT_BLAMEFUL REQUEST_ROOT_CAUSE REQUEST_ACTIONS",
        feedback:
          "El post mórtem cierra el aprendizaje del incidente sin cacería de brujas; root_cause y actions no se confunden ni se dejan vacíos.",
        retrospective:
          "Post mórtem cierra el ciclo: causa + acciones + sin culpa personal. El error clásico es CONTINUE con lista vacía. En el You Do documenta un post mórtem sintético alineado a este contrato.",
        starterCode: {
          language: 'python',
          title: "s39-t4-b-e3.py",
          code: `def decide(pm: dict):
    # DEFECTO: siempre CONTINUE; debe separar blame / root_cause / actions
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
# Cuatro rutas visibles: OK / blameful / sin root_cause / sin actions
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
      "Entrega el sistema e2e sintético de triage para `CASO-LIM-039`. El bundle incluye: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos `human_only`, demo de aceptación, cards y post mórtem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. Sin autofraude ni parentesco automático. Deja evidencia para revisión externa; no autodeclares la promoción de nivel.",
    objectives: [
      "Pipeline intake→queue con label_space needs_review y auto_fraud False",
      "Registry de versiones/owners con semver y bump major en breaking",
      "Evidence packet mínimo + explicación usable por revisor",
      "Overrides y apelaciones con audit log y cuidado de leakage en feedback",
      "Checklist de privacidad/fairness/seguridad firmable",
      "Modos drift/incident + rollback versionado",
      "Aceptación, tres demo paths, cards, métricas de valor y post mórtem blameless",
      "Notas de regresión N3 y CF-3 sin autodeclarar promoción",
    ],
    requirements: [
      "E2e sintético reproducible en local-python",
      "Cero auto-label de fraude o parentesco",
      "Audit log de decisiones y overrides (incluyendo queue frente a skip por umbral)",
      "Checklist regresión S27–S39 documentado",
      "es-PE en prosa; sin secretos ni PII real",
      "manifest declara self_declared_promotion=false hasta revisión externa",
    ],
    starterCode: `# CP-N3-C — bundle local de Responsible ML Case Triage (CASO-LIM-039)
from dataclasses import asdict, dataclass
from hashlib import sha256
from pathlib import Path
from typing import Optional, Tuple
import json
import shutil

STAGES = ("intake", "er", "relation_graph", "features", "model_score", "queue")

@dataclass(frozen=True)
class EvidencePacket:
    case_id: str
    score: Optional[float]
    graph_path: list
    evidence: list
    label_space: str = "needs_review"
    auto_fraud: bool = False

def triage(
    case: dict,
    *,
    threshold: float,
    human_only: bool = False,
    human_action: Optional[str] = None,
) -> Tuple:
    """Prioriza cola. Score ≠ fraude. human_only nunca hace skip automático."""
    required = {"case_id", "shared_signal", "graph_path"}
    missing = required - case.keys()
    if missing:
        raise ValueError(f"missing fields: {sorted(missing)}")
    # Camino OOD: abstener sin declarar fraude
    if case.get("ood"):
        packet = EvidencePacket(
            case_id=case["case_id"],
            score=None,
            graph_path=list(case["graph_path"]),
            evidence=["ood_flag"],
        )
        return packet, "ood_abstain", False
    if human_only:
        # Modo seguro: score no decide; el caso entra a revisión humana
        packet = EvidencePacket(
            case_id=case["case_id"],
            score=None,
            graph_path=list(case["graph_path"]),
            evidence=["shared_signal"] if case["shared_signal"] else ["manual_review"],
        )
        action = human_action or "queued_for_human"
        return packet, action, human_action is not None
    score = min(1.0, 0.35 + 0.45 * bool(case["shared_signal"]))
    packet = EvidencePacket(
        case_id=case["case_id"],
        score=score,
        graph_path=list(case["graph_path"]),
        evidence=["shared_signal"] if case["shared_signal"] else [],
    )
    if human_action is not None:
        return packet, human_action, True
    action = "queued_for_review" if score >= threshold else "skip_low_priority"
    return packet, action, False

def append_audit(path: Path, event: dict) -> None:
    with path.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(event, sort_keys=True) + "\\n")

def file_digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest()

def build_bundle(out: Path, *, force_failure: bool = False, run_id: str = "run-001") -> dict:
    # Idempotencia de corrida: directorio limpio por run (no mezcla artefactos viejos)
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    audit = out / "audit.jsonl"
    thr = 0.70
    # Tres caminos de demo: happy, override, ood_abstain
    demo_cases = [
        {
            "case_id": "CASO-LIM-039-c001",
            "shared_signal": True,
            "graph_path": ["entity:a", "phone:x", "entity:b"],
            "path": "happy",
        },
        {
            "case_id": "CASO-LIM-039-c002",
            "shared_signal": True,
            "graph_path": ["entity:d"],
            "path": "override",
            "human_action": "skip",
        },
        {
            "case_id": "CASO-LIM-039-c003",
            "shared_signal": False,
            "graph_path": ["entity:e"],
            "path": "ood_abstain",
            "ood": True,
        },
    ]
    packets = []
    try:
        human_only = force_failure
        for case in demo_cases:
            human_action = case.get("human_action")
            packet, action, override = triage(
                case,
                threshold=thr,
                human_only=human_only,
                human_action=human_action,
            )
            packets.append(asdict(packet))
            append_audit(
                audit,
                {
                    "run_id": run_id,
                    "case_id": packet.case_id,
                    "demo_path": case["path"],
                    "action": action,
                    "score": packet.score,
                    "override": override,
                    "human_only": human_only,
                },
            )
        if force_failure:
            raise RuntimeError("forced regression failure")
        (out / "packets.json").write_text(json.dumps(packets, indent=2), encoding="utf-8")
        (out / "model-card.md").write_text(
            "# Model card\\n"
            "Intended use: priorizar cola de revisión (label_space=needs_review).\\n"
            "Out of scope: declarar fraude, parentesco o culpabilidad.\\n"
            "Limitations: score ≠ probabilidad de fraude; umbral thr=0.70 de validación (S34).\\n"
            "Human oversight: override + audit + apelación con segundo revisor.\\n"
            "Metrics by slice (sintético): canal_app false_queue=0.08 override=0.10; "
            "canal_web false_queue=0.11 override=0.14.\\n"
            "Operational value: precision_at_k≈0.55; median_review_s≈90.\\n"
            "Monitoring owner: ml-risk; alertas de drift de score y calibración.\\n",
            encoding="utf-8",
        )
        (out / "data-card.md").write_text(
            "# Data card\\n"
            "Sources: fixtures sintéticos CASO-LIM-039 (sin PII real).\\n"
            "Windows: batch de laboratorio; no reutilizar labels de cola como features.\\n"
            "Minimización: solo shared_signal + graph_path en packet.\\n"
            "Known gaps: cobertura de canales sintéticos incompleta; OOD → abstener.\\n",
            encoding="utf-8",
        )
        (out / "system-card.md").write_text(
            "# System card\\n"
            "Modes: normal | abstain_more | human_only (incident > drift).\\n"
            "Owners: ml-risk (ranker), data-quality (ER), investigations (graph).\\n"
            "Rollback: prev_model versionado; force_failure → human_only (sin skip auto).\\n"
            "Acceptance demo paths: happy, override, ood_abstain.\\n",
            encoding="utf-8",
        )
        status = "ready_for_human_acceptance"
    except Exception as exc:
        append_audit(
            audit,
            {"run_id": run_id, "action": "rollback", "reason": type(exc).__name__, "mode": "human_only"},
        )
        status = "human_only"
    artifact_names = [
        "packets.json",
        "audit.jsonl",
        "model-card.md",
        "data-card.md",
        "system-card.md",
    ]
    digests = {
        name: file_digest(out / name)
        for name in artifact_names
        if (out / name).exists()
    }
    files = sorted(p.name for p in out.iterdir() if p.name != "manifest.json")
    manifest = {
        "run_id": run_id,
        "status": status,
        "files": files,
        "stages": list(STAGES),
        "demo_paths": ["happy", "override", "ood_abstain"],
        "regression_scope": "S27-S39",
        "cf3_review": "external",
        "self_declared_promotion": False,
        "threshold": thr,
        "artifact_sha256": digests,
    }
    # Digest del mapa de artefactos (no solo metadata del wrapper)
    manifest["bundle_sha256"] = sha256(
        json.dumps(digests, sort_keys=True).encode()
    ).hexdigest()
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest

# Aceptación: corre camino normal y force_failure; inspecciona manifest, packets,
# audit y model/data/system cards. Deja el expediente listo; no autodeclares promoción
# — un revisor externo evalúa la evidencia.
# Ejemplo:
#   build_bundle(Path("out/normal"), run_id="demo-ok")
#   build_bundle(Path("out/incident"), force_failure=True, run_id="demo-incident")
`,
    portfolioNote:
      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. El expediente queda listo para revisión externa; no autodeclares promoción.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con el audit (override, ood_abstain o human_only) y un digest del bundle? (2) ¿dónde queda escrito `auto_fraud=False` y `self_declared_promotion=false` para un revisor externo de CF-3? (3) Escribe en el README una frase de impacto medible (p. ej. paths de demo + tasa de override sintética) defendible en 30 segundos. No autodeclares la promoción de nivel.",
    rubric: [
      { criterion: "Alineación al entregable CP-N3-C (triage e2e responsable)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno local-python", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin autofraude ni parentesco", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (override, OOD, incident)", weight: "15%" },
      { criterion: "Código legible y límites claros por etapa", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE)", weight: "10%" },
      { criterion: "E2e triage + evidence packet + audit overrides", weight: "bonus checklist" },
      { criterion: "Regresión N3/CF-3 documentada sin autodeclarar promoción", weight: "gate process" },
      { criterion: "Sin fraude/parentesco automático; ER=la misma entidad", weight: "gate privacy" },
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
        options: ["Documentas smoke y expediente; la promoción la confirma un revisor externo", "Tu script marca promoción automáticamente si el e2e imprime OK", "Borras el checklist al exportar el bundle", "Solo aplican a la sección 01"],
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
          "Semver major + owner + regresión de contratos (incluyendo paths del grafo) evitan packets incompatibles en cola humana.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "Límites del score, label_space y no autofraude",
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
        note: "Cultura de post mórtem blameless del triage",
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
        note: "Post mórtem blameless y runbooks",
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
