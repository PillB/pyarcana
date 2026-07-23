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
    "En operaciones de riesgo y calidad de datos en fintech, banca y retail en el Perú, cierras **CP-N3-C** con **Responsible ML Case Triage**: intake→ER→relación→features→modelo→cola humana, con cards, monitoreo y control humano. El score solo prioriza revisión; no declara fraude ni parentesco. Id de plataforma `integrator-phase2` se conserva. La promoción de nivel requiere CP-N3-A/B/C, **regresión S27–S39** y **CF-3** calificada en otra lane (esta autoría no escribe PASS en ledger ni seed).",
  learningOutcomes: [
    { text: "Ensamblar el flujo canónico intake→ER→grafo→features→score→cola con contratos versionados" },
    { text: "Registrar ownership, semver y política de compatibilidad por artefacto del triage" },
    { text: "Armar cola, evidence packet y explicación en capas sin exponer solo un número" },
    { text: "Operar decisión automática, override humano, feedback y apelación con audit log" },
    { text: "Aplicar checklist de privacidad, fairness por slices y seguridad de inputs del packet" },
    { text: "Monitorear drift, activar human_only, rollback de modelo/umbral y abstención" },
    { text: "Definir criterios de aceptación, demo e2e sintético y smoke de regresión S27–S39" },
    { text: "Publicar model/data/system cards, métricas de valor operativo y postmortem blameless" },
    { text: "Documentar CF-3 y gates N3 sin auto-marcar section_passed en la lane de autoría" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-C + regresión N3 + CF-3",
      paragraphs: [
        "En V3, **S39 cierra el nivel 3** con el sistema demoable **Responsible ML Case Triage**. No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38 (calidad, ER, grafo, features, ranking, calibración, explicación, monitoreo y colas) en un recorrido que un revisor humano puede auditar de punta a punta con fixtures sintéticos peruanos.",
        "Contrato de promoción (conceptual, no auto-ejecutado aquí). Entrada: entregables CP-N3-A, CP-N3-B y CP-N3-C, más smoke de regresión S27–S39 y el expediente de **CF-3**. Salida esperada de esta sección: bundle e2e con packets, audit, cards y notas de gate. Error: reclamar PASS en ledger, seed o checkpoint desde la lane de autoría. Criterio: la calificación de promoción y CF-3 ocurre en lane separada; aquí solo dejas evidencia reproducible.",
        "Orden pedagógico de esta sección: **T1 Arquitectura del flujo** (pipeline y ownership) → **T2 Workbench del revisor** (packet, decisión y apelación) → **T3 Riesgo y ops** (privacidad, fairness, drift y human_only) → **T4 Producto y cierre** (aceptación, demo, cards, valor y postmortem). El caso sintético `CASO-LIM-039` modela una cola de revisión para una fintech ficticia en Lima: datos inventados, sin PII real y sin etiqueta automática de fraude.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-C + regresión",
        content:
          "Entregable de S39: triage responsable demoable. Promoción N3 = CP-N3-A/B/C + regresión S27–S39 + CF-3 en lane de calificación. Esta autoría no escribe section_passed ni edita seed/checkpoint/ledger.",
      },
    },
    {
      heading: "intake → ER → relación → features → modelo",
      subtopicId: "S39-T1-A",
      paragraphs: [
        "El flujo canónico N3 es una cadena con fronteras claras: **intake** normaliza registros sintéticos; **ER** decide misma entidad (no familia ni culpa); el **grafo relacional** expone paths de co-ocurrencia; **features** se materializan sin leakage de labels futuros; el **modelo** emite un score de prioridad; la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato.",
        "Contrato operativo. Entrada: payload con `run_id`, registros de intake y configuración de umbral. Salida de este subtema: stages ordenados, `label_space` en `needs_review` y bandera `auto_fraud=False`. Error: reordenar etapas, saltar ER, o mapear score a veredicto legal. Criterio de éxito: el pipeline es reproducible, fallas se aíslan por etapa y el score solo ordena trabajo humano.",
        "Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima): dos registros comparten un teléfono sintético; ER puede proponer misma entidad; el grafo muestra un path de longitud 2; el score 0.66 sugiere prioridad media de cola. Nada de eso prueba fraude, parentesco ni intención: solo justifica que un revisor mire el evidence packet.",
      ],
      code: {
        language: 'python',
        title: "pipeline.py",
        code: `stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
payload = {
    "run_id": "n3-reg-001",
    "case_id": "CASO-LIM-039-T1A",
    "stage": "model_score",
    "score": 0.66,
    "label_space": "needs_review",
    "auto_fraud": False,
}
print("pipeline", " > ".join(stages))
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
      heading: "contratos, versiones y ownership",
      subtopicId: "S39-T1-B",
      paragraphs: [
        "Cada artefacto del triage — motor de ER, `graph_schema`, `feature_set`, ranker, umbral y plantilla de packet — debe tener **owner**, **versión semver** y **política de compatibilidad**. Sin owner no hay on-call; sin versión no hay regresión; sin política de breaking change el revisor recibe un packet que el modelo ya no entiende.",
        "Contrato operativo. Entrada: registry de artefactos con `ver`, `owner` y flag de breaking change. Salida: inventario ordenado, conteo de owners distintos y decisión major/minor. Error: publicar un breaking change como patch o dejar un artefacto sin owner. Criterio de éxito: todo artefacto en producción del triage tiene dueño contactable y bump major documentado cuando el contrato se rompe.",
        "En `CASO-LIM-039-T1B`, el equipo de plataforma en Lima versiona `er_engine 1.2.0` (data-quality), `graph_schema 3.0.0` (investigations), `feature_set fs-v3` (ml-platform) y `ranker 2.1.0` (ml-risk). Si el schema del grafo elimina un tipo de nodo, el bump es major y la regresión S27–S39 debe revalidar paths antes de reabrir la cola automática.",
      ],
      code: {
        language: 'python',
        title: "registry.py",
        code: `registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations"},
    "feature_set": {"ver": "fs-v3", "owner": "ml-platform"},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk"},
}
print(sorted(registry))
print("owners", len({v["owner"] for v in registry.values()}))
print("compat", "semver")`,
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
      heading: "queue, evidence packet y explicación",
      subtopicId: "S39-T2-A",
      paragraphs: [
        "La cola ordena casos por score calibrado y capacidad del equipo; el **evidence packet** es lo que el revisor ve: hechos sintéticos, path de grafo, top features, incertidumbre (in/out of distribution) y contribuciones del modelo. Un número suelto no es un workbench: sin path ni evidencia el caso no debe entrar a cola humana como «listo».",
        "Contrato operativo. Entrada: case_id, score, evidence[], graph_path[], uncertainty y opcionalmente model_contrib. Salida: packet mínimo con claves auditables y capas de explicación (S35). Error: packet con solo score o sin graph_path cuando el modelo usó señales relacionales. Criterio de éxito: el revisor puede reconstruir por qué el caso llegó a cola sin confiar en magia del modelo.",
        "Para `CASO-LIM-039-T2A`, el packet incluye score 0.81, evidencia `shared_phone_synth`, path `E1 → ph:900 → E2` e incertidumbre `in_distribution`. La UI didáctica puede ser un dict en CLI: lo importante es la estructura, no el framework. El revisor decide; el modelo solo prioriza.",
      ],
      code: {
        language: 'python',
        title: "evidence_packet.py",
        code: `packet = {
    "case_id": "CASO-LIM-039-T2A",
    "score": 0.81,
    "evidence": ["shared_phone_synth", "tx_path_len_2"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
    "model_contrib": {"shared_phone": 0.4},
}
print(packet["case_id"], packet["score"])
print("path", packet["graph_path"])
print("layers", 4)`,
        output: `CASO-LIM-039-T2A 0.81
path ['E1', 'ph:900', 'E2']
layers 4`,
      },
      callout: {
        type: "tip",
        title: "Packet mínimo",
        content:
          "Mínimo: case_id, score, evidence, graph_path. Sin path/evidencia no hay workbench; deriva a REQUEST_PACKET_EVIDENCE en vez de auto-cerrar.",
      },
    },
    {
      heading: "decisión, override, feedback y apelación",
      subtopicId: "S39-T2-B",
      paragraphs: [
        "Las acciones de cola típicas son **queue** (priorizar revisión), **skip** (baja prioridad o sin señal accionable) y **escalate**. La política automática sugiere; el **override humano gana** y debe quedar en audit log con actor, razón y timestamp. Sin audit, el override es un riesgo de gobernanza, no un control.",
        "Contrato operativo. Entrada: case_id, score, umbral, opcional decisión humana y canal de apelación. Salida: acción final, flag de override y evento en log. Error: override sin registro, o feedback de revisor reinyectado al training set con leakage. Criterio de éxito: cada cambio de decisión es reconstruible y la apelación reabre con otro revisor o supervisor.",
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
      heading: "privacidad, fairness y seguridad",
      subtopicId: "S39-T3-A",
      paragraphs: [
        "Antes de abrir el triage a revisores, aplica minimización de PII (solo campos necesarios del packet), **RBAC** por rol (reviewer vs admin), y prohíbe secretos o tokens en el repo. Fairness operativa: mide tasas de envío a cola y de override por slices sintéticos de producto o canal, no para afirmar culpa de un grupo real.",
        "Contrato operativo. Entrada: checklist con pii_minimized, rbac, secrets_in_repo, slice_metrics e input_limits. Salida: `release_ok` booleano y blockers nominados. Error: secrets_in_repo True, packet sin control de rol, o ausencia de métricas por slice. Criterio de éxito: checklist firmado por owner de riesgo antes de promover el flujo a demo de aceptación.",
        "Para `CASO-LIM-039-T3A`, el release de la cola en un entorno de laboratorio limeño exige límites de tamaño en adjuntos sintéticos del packet, validación de URLs (sin SSRF a evidence remota) y slice metrics de false-queue rate. El checklist no declara «sistema justo para siempre»: solo evidencia mínima de release responsable.",
      ],
      code: {
        language: 'python',
        title: "risk_checklist.py",
        code: `checklist = {
    "pii_minimized": True,
    "rbac": True,
    "secrets_in_repo": False,
    "slice_metrics": True,
    "input_limits": True,
}
print("release_ok", all([
    checklist["pii_minimized"],
    checklist["rbac"],
    not checklist["secrets_in_repo"],
    checklist["slice_metrics"],
    checklist["input_limits"],
]))
print("items", len(checklist))
print("fraud_auto", False)`,
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
      heading: "drift, incidentes, rollback y human control",
      subtopicId: "S39-T3-B",
      paragraphs: [
        "En producción del triage monitoreas distribución de scores, prevalencia proxy de cola, calibración, latencia del packet y tasa de overrides. **Drift** no es un veredicto moral: es una señal de que el ranking puede estar desalineado y hay que abstener más o recalibrar. El control humano no se optimiza fuera del sistema para «subir throughput».",
        "Contrato operativo. Entrada: flags de drift_high e incident, versión de modelo/umbral y runbook. Salida: modo `normal`, `abstain_more` o `human_only`, más target de rollback. Error: seguir en auto cuando hay incidente de política o de seguridad. Criterio de éxito: interruptor human_only documentado, rollback a modelo/umbral previos y alertas accionables.",
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
print(mode(False, True))
print(mode(True, False))
print("rollback", "model_previous")`,
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
      heading: "aceptación y demo",
      subtopicId: "S39-T4-A",
      paragraphs: [
        "La aceptación de CP-N3-C no es un screenshot: es una lista de criterios ejecutables sobre fixtures sintéticos. Mínimo: corrida e2e, baseline visible en métricas, camino de abstención, audit log de decisiones, prohibición de auto-label de fraude y smoke de regresión S27–S39 documentado.",
        "Contrato operativo. Entrada: checklist de aceptación y tres rutas de demo (happy, override, ood_abstain). Salida: conteo de criterios en verde y nota de que CF-3/PASS de promoción es lane separada. Error: demo solo del camino feliz o auto-marcar section_passed. Criterio de éxito: un revisor externo puede repetir la demo sin secretos ni datos reales.",
        "Para `CASO-LIM-039-T4A`, la demo en laboratorio muestra (1) caso con packet completo y queue, (2) override humano a skip con audit, (3) entrada OOD que abstiene. La regresión N3 es una lista de checks de contratos, no un reentrenamiento completo. Esta lane deja el expediente listo; no escribe el PASS de CF-3.",
      ],
      code: {
        language: 'python',
        title: "acceptance.py",
        code: `acceptance = [
    "e2e_synthetic_run",
    "baseline_in_metrics",
    "abstention_path",
    "audit_log",
    "no_auto_fraud_label",
    "regression_smoke_s27_s39",
]
print("n_criteria", len(acceptance))
print("demo_paths", ["happy", "override", "ood_abstain"])
print("cf3_note", "separate_lane_for_pass")`,
        output: `n_criteria 6
demo_paths ['happy', 'override', 'ood_abstain']
cf3_note separate_lane_for_pass`,
      },
      callout: {
        type: "info",
        title: "CF-3 / regresión",
        content:
          "PASS de promoción y CF-3 no se escriben en esta autoría. Documenta smoke S27–S39 y deja section_passed en false hasta la lane de calificación.",
      },
    },
    {
      heading: "model/data/system cards, métricas de valor y postmortem",
      subtopicId: "S39-T4-B",
      paragraphs: [
        "El cierre de nivel exige **cards** legibles: model card (label_space, límites, no auto-fraude), data card (fixtures sintéticos, ventanas, PII minimizada) y system card (modos ops, owners, rollback). Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides, tiempo mediano de review — no solo AUC offline.",
        "Contrato operativo. Entrada: métricas de valor, plantillas de cards y plantilla de postmortem. Salida: tres cards publicables y un postmortem blameless con timeline, root_cause y actions. Error: card vacía, métrica de negocio ausente o postmortem que busca culpables en lugar de causas de sistema. Criterio de éxito: un stakeholder no-ML entiende qué hace el score y cuándo interviene un humano.",
        "En `CASO-LIM-039-T4B`, precision_at_k=0.55, override_rate=0.12 y median_review_s=90 cuentan la historia de la cola. Tras un incidente de calibración, el postmortem blameless lista rollback y recalibración. Con cards y notas de regresión, el expediente queda listo para la lane de CF-3 — sin auto-declarar promoción.",
      ],
      code: {
        language: 'python',
        title: "value_pm.py",
        code: `value = {
    "precision_at_k": 0.55,
    "override_rate": 0.12,
    "median_review_s": 90,
}
postmortem = {
    "severity": "T0-T3",
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
    "blameless": True,
}
print(value)
print(postmortem["root_cause"])
print("cards", ["model", "data", "system"])`,
        output: `{'precision_at_k': 0.55, 'override_rate': 0.12, 'median_review_s': 90}
calib_drift
cards ['model', 'data', 'system']`,
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
    intro: "Te muestro el cierre del nivel N3: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor — siempre con fixtures sintéticos y sin auto-PASS de CF-3.",
    steps: [
      {
        demoId: "S39-T1-A-DEMO",
        subtopicId: "S39-T1-A",
        environment: "local-python",
        description: "Pipeline canónico N3: stages unidos, label_space needs_review y auto_fraud en false sobre CASO-LIM-039.",
        code: {
          language: 'python',
          title: "pipe_demo.py",
          code: `stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
print(" > ".join(stages))
print("label_space", "needs_review")
print("auto_fraud", False)`,
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
        description: "Registry mínimo: conteo de owners y política semver para artefactos del triage.",
        code: {
          language: 'python',
          title: "reg_demo.py",
          code: `reg = {"er_engine": "dq", "ranker": "ml-risk"}
print(len({v for v in reg.values()}))
print("semver", True)
print("owner_required", True)`,
          output: `2
semver True
owner_required True`,
        },
        why: "Ownership y semver son el contrato de evolución del triage: sin ellos no hay on-call ni regresión confiable.",
      },
      {
        demoId: "S39-T2-A-DEMO",
        subtopicId: "S39-T2-A",
        environment: "local-python",
        description: "Evidence packet: claves mínimas ordenadas y cuatro capas de explicación.",
        code: {
          language: 'python',
          title: "pkt_demo.py",
          code: `keys = sorted(["case_id", "score", "evidence", "graph_path"])
print(keys)
print("layers", 4)
print("score_alone_ok", False)`,
          output: `['case_id', 'evidence', 'graph_path', 'score']
layers 4
score_alone_ok False`,
        },
        why: "El revisor necesita path y evidencia; el score solo no constituye workbench ni justificación de cola.",
      },
      {
        demoId: "S39-T2-B-DEMO",
        subtopicId: "S39-T2-B",
        environment: "local-python",
        description: "Override humano a skip con flag de audit y conteo de overrides.",
        code: {
          language: 'python',
          title: "dec_demo.py",
          code: `event = {"final": "skip", "override": True}
print(event)
print("n_overrides", 1)
print("audit", True)`,
          output: `{'final': 'skip', 'override': True}
n_overrides 1
audit True`,
        },
        why: "El override gana al auto y debe quedar auditado; sin log no hay control humano verificable.",
      },
      {
        demoId: "S39-T3-A-DEMO",
        subtopicId: "S39-T3-A",
        environment: "local-python",
        description: "Checklist de release: sin secretos en repo y sin auto-fraude.",
        code: {
          language: 'python',
          title: "risk_demo.py",
          code: `print(True)
print("secrets_in_repo", False)
print("auto_fraud", False)`,
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
        description: "Modo human_only ante incidente y target de rollback al modelo previo.",
        code: {
          language: 'python',
          title: "ops_demo.py",
          code: `print("human_only")
print("rollback", "prev_model")
print("priority", "incident_over_drift")`,
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
        description: "Seis criterios de aceptación, scope de regresión S27–S39 y CF-3 en lane separada.",
        code: {
          language: 'python',
          title: "acc_demo.py",
          code: `print(6)
print("regression", "S27-S39")
print("cf3_pass_lane", "separate")`,
          output: `6
regression S27-S39
cf3_pass_lane separate`,
        },
        why: "Aceptación medible y regresión documentada; el PASS de CF-3 no se auto-escribe en esta lane.",
      },
      {
        demoId: "S39-T4-B-DEMO",
        subtopicId: "S39-T4-B",
        environment: "local-python",
        description: "Métricas de valor operativo, tres cards y flag de postmortem blameless.",
        code: {
          language: 'python',
          title: "val_demo.py",
          code: `print(["precision_at_k", "override_rate", "median_review_s"])
print(sorted(["model", "data", "system"]))
print("postmortem", True)`,
          output: `['precision_at_k', 'override_rate', 'median_review_s']
['data', 'model', 'system']
postmortem True`,
        },
        why: "Cierre de nivel con valor de negocio, cards y postmortem blameless listos para CF-3.",
      },
    ],
  },
  weDo: {
    intro: "S39 · Laboratorio Responsible ML Case Triage (CASO-LIM-039, sintético Perú): 24 retos locales. E1 repara un predicado de dominio, E2 separa válido/adverso/missing y E3 demuestra fail-closed con tokens de error exactos. Sin auto-fraude ni PASS de CF-3.",
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
          "S39-T1-B-E3 · Evalúa un registry de cuatro artefactos sintéticos. Si algún artefacto carece de owner → `ESCALATE_NO_OWNER`; si hay breaking con bump distinto de major → `REJECT_BUMP_POLICY`; si todos OK → `CONTINUE` y reporta `n_art` = 4. El starter ignora owners vacíos y cuenta mal el tamaño. Salida de la línea principal: `CONTINUE 4` en el happy path del fixture base.",
        hint: "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea.",
        hints: [
          "Recorre todos los artefactos antes de CONTINUE; un solo fallo de política bloquea.",
          "n_art es len(registry); no hardcodees 3 por error de off-by-one del starter.",
        ],
        edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto"],
        tests: "Happy path imprime CONTINUE 4; fixtures adversos cubiertos en asserts de solución.",
        feedback: "S39-T1-B-E3: el registry es un conjunto: basta un artefacto sin owner para escalar.",
        starterCode: {
          language: 'python',
          title: "s39-t1-b-e3.py",
          code: `registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality", "breaking": False, "bump": "patch"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations", "breaking": True, "bump": "major"},
    "feature_set": {"ver": "fs-v3", "owner": "ml-platform", "breaking": False, "bump": "minor"},
    "ranker": {"ver": "2.1.0", "owner": "ml-risk", "breaking": False, "bump": "patch"},
}

def decide(reg: dict) -> str:
    # DEFECTO: no valida owners ni bump
    return "CONTINUE"

print(decide(registry), len(registry) - 1)
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t1-b-e3.py",
          code: `registry = {
    "er_engine": {"ver": "1.2.0", "owner": "data-quality", "breaking": False, "bump": "patch"},
    "graph_schema": {"ver": "3.0.0", "owner": "investigations", "breaking": True, "bump": "major"},
    "feature_set": {"ver": "fs-v3", "owner": "ml-platform", "breaking": False, "bump": "minor"},
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
print(status, n_art)
assert status == "CONTINUE" and n_art == 4
`,
          output: `CONTINUE 4`,
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
          "S39-T2-A-E3 · Workbench fail-closed: packet OK → `CONTINUE` y reporta layers=4; score-only → `REJECT_SCORE_ALONE`; sin uncertainty → `REQUEST_UNCERTAINTY`. El starter siempre continúa y reporta layers=1. Salida happy path: `CONTINUE 4`. No inventes path si no viene en el fixture adverso.",
        hint: "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
        hints: [
          "Las 4 capas de explicación (S35) se asumen cuando el packet está completo; score-only no las habilita.",
          "uncertainty ausente es incertidumbre de contrato → REQUEST_UNCERTAINTY, no inventes in_distribution.",
        ],
        edgeCases: ["solo score", "sin uncertainty", "evidence vacía"],
        tests: "Happy: CONTINUE 4; adversos: REJECT_SCORE_ALONE y REQUEST_UNCERTAINTY",
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
print(*decide(ok))
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
print(*decide(ok))
`,
          output: `CONTINUE 4`,
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
          "S39-T2-B-E3 · Audit log de feedback: si se registra feedback de revisor, debe incluir leakage_care=True y action logged; si override sin audit_entry → `REJECT_NO_AUDIT`; si falta feedback_id cuando feedback=True → `REQUEST_FEEDBACK_ID`. Happy path imprime `LOGGED True`. El starter marca LOGGED aunque no haya audit.",
        hint: "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
        hints: [
          "Fail-closed: sin audit_entry no hay override válido; feedback sin id no se reinyecta.",
          "leakage_care True es obligatorio al loguear feedback hacia datasets o reglas.",
        ],
        edgeCases: ["override sin audit", "feedback sin id", "leakage_care False"],
        tests: "Happy: LOGGED True; adversos con tokens REJECT_NO_AUDIT y REQUEST_FEEDBACK_ID",
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
print(*decide(happy))
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
assert decide(happy) == ("LOGGED", True)
assert decide({**happy, "audit_entry": False})[0] == "REJECT_NO_AUDIT"
assert decide({**happy, "feedback_id": None})[0] == "REQUEST_FEEDBACK_ID"
print(*decide(happy))
`,
          output: `LOGGED True`,
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
          code: `def assess(c: dict) -> str:
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
          "S39-T3-A-E3 · Fairness de cola: si slice_metrics falta → `REQUEST_SLICE_METRICS`; si fp_rate de un slice sintético supera umbral → `REJECT_SLICE_FP`; si OK → `CONTINUE` con metric `fp_rate`. El starter siempre continúa y no lee slices. Happy path: `CONTINUE fp_rate`. No uses el score para afirmar fraude en un slice.",
        hint: "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
        hints: [
          "Los slices son sintéticos de canal/producto; fp_rate alto reabre el release, no etiqueta personas.",
          "REQUEST_SLICE_METRICS cuando la clave slices no existe o está vacía.",
        ],
        edgeCases: ["sin slices", "fp_rate sobre umbral", "metric nombre fp_rate"],
        tests: "Happy CONTINUE fp_rate; adversos REQUEST_SLICE_METRICS y REJECT_SLICE_FP",
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
print(*decide(happy))
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
assert decide(happy) == ("CONTINUE", "fp_rate")
assert decide({**happy, "slices": []})[0] == "REQUEST_SLICE_METRICS"
assert decide({**happy, "slices": [{"name": "canal_app", "fp_rate": 0.4}]})[0] == "REJECT_SLICE_FP"
print(*decide(happy))
`,
          output: `CONTINUE fp_rate`,
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
          code: `def mode(drift_high, incident):
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
          "S39-T3-B-E3 · Rollback versionado: si incident, target=`previous_model` y thr=`previous`; si falta prev_model_id → `REQUEST_PREV_MODEL`; si solo drift → modo abstain_more sin rollback forzado (`MONITOR`). Happy path incidente: `ROLLBACK previous_model`. El starter siempre imprime current_model.",
        hint: "Rollback apunta a artefacto versionado previo, no al working tree local.",
        hints: [
          "Rollback apunta a artefacto versionado previo, no al working tree local.",
          "Sin prev_model_id no inventes un id; pide REQUEST_PREV_MODEL.",
        ],
        edgeCases: ["sin prev_model_id", "solo drift", "incident con prev"],
        tests: "Happy: ROLLBACK previous_model; missing y drift con tokens propios",
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
print(*decide(happy))
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
assert decide(happy) == ("ROLLBACK", "previous_model")
assert decide({**happy, "prev_model_id": None})[0] == "REQUEST_PREV_MODEL"
assert decide({"incident": False, "drift_high": True}) == ("MONITOR", "abstain_more")
print(*decide(happy))
`,
          output: `ROLLBACK previous_model`,
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
          code: `acceptance = [
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
          "S39-T4-A-E2 · Documenta regresión y CF-3: scope debe ser `S27-S39`, cf3_lane=`separate_lane`, section_passed debe ser False en esta autoría. Entrada: dict gate_notes. Adverso: section_passed True → `REJECT_AUTO_PASS`. Missing scope → `MISSING:regression_scope`. Salidas: `PASS REJECT_AUTO_PASS MISSING:regression_scope`. El starter permite section_passed True.",
        hint: "Esta lane nunca auto-marca PASS; section_passed True es rechazo de política de autoría.",
        hints: [
          "Esta lane nunca auto-marca PASS; section_passed True es rechazo de política de autoría.",
          "cf3_lane separate_lane es el recordatorio de calificación externa.",
        ],
        edgeCases: ["section_passed True", "scope incompleto", "cf3 en misma lane"],
        tests: "Salida: PASS REJECT_AUTO_PASS MISSING:regression_scope",
        feedback: "S39-T4-A-E2: regresión se documenta; PASS lo escribe otra lane.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e2.py",
          code: `def assess(notes: dict) -> str:
    required = {"regression_scope", "cf3_lane", "section_passed"}
    missing = sorted(required - notes.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECTO: acepta auto pass
    return "PASS"

valid = {
    "regression_scope": "S27-S39",
    "cf3_lane": "separate_lane",
    "section_passed": False,
}
invalid = {**valid, "section_passed": True}
incomplete = {k: v for k, v in valid.items() if k != "regression_scope"}
print(assess(valid), assess(invalid), assess(incomplete))
`,
        },
        solutionCode: {
          language: 'python',
          title: "s39-t4-a-e2.py",
          code: `def assess(notes: dict) -> str:
    required = {"regression_scope", "cf3_lane", "section_passed"}
    missing = sorted(required - notes.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if notes["section_passed"] is True:
        return "REJECT_AUTO_PASS"
    if notes["regression_scope"] != "S27-S39" or notes["cf3_lane"] != "separate_lane":
        return "REJECT_AUTO_PASS"
    return "PASS"

valid = {
    "regression_scope": "S27-S39",
    "cf3_lane": "separate_lane",
    "section_passed": False,
}
invalid = {**valid, "section_passed": True}
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
          "S39-T4-A-E3 · Demo paths: debe haber exactamente las tres rutas happy, override y ood_abstain (nombres canónicos). Si falta una → `REQUEST_DEMO_PATH`; si hay solo happy → `REJECT_HAPPY_ONLY`; si completo → `CONTINUE 3`. El starter cuenta mal y acepta un solo path. Salida happy: `CONTINUE 3`.",
        hint: "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
        hints: [
          "Compara como conjunto los nombres canónicos; el orden de la lista no importa.",
          "ood_abstain es distinto de ood; usa el token canónico del theory block.",
        ],
        edgeCases: ["solo happy", "path mal nombrado", "lista vacía"],
        tests: "Happy CONTINUE 3; adversos REQUEST_DEMO_PATH / REJECT_HAPPY_ONLY",
        feedback: "S39-T4-A-E3: la demo de triage debe cubrir override y abstención, no solo el caso feliz.",
        starterCode: {
          language: 'python',
          title: "s39-t4-a-e3.py",
          code: `def decide(paths: list):
    # DEFECTO
    return "CONTINUE", len(paths)

print(*decide(["happy", "override", "ood_abstain"]))
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

assert decide(["happy", "override", "ood_abstain"]) == ("CONTINUE", 3)
assert decide(["happy"])[0] == "REJECT_HAPPY_ONLY"
assert decide(["happy", "override"])[0] == "REQUEST_DEMO_PATH"
print(*decide(["happy", "override", "ood_abstain"]))
`,
          output: `CONTINUE 3`,
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
          code: `cards = ["model", "data", "system"]
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
          code: `def assess(payload: dict) -> str:
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
          "S39-T4-B-E3 · Postmortem blameless: requiere blameless=True, root_cause no vacío y actions no vacía. Si blameless False → `REJECT_BLAMEFUL`; si falta root_cause → `REQUEST_ROOT_CAUSE`; si OK → `CONTINUE`. Happy path imprime `CONTINUE True`. El starter acepta postmortems con culpa personal y sin acciones.",
        hint: "Blameless mira procesos y sistemas; no nombres de personas como root_cause.",
        hints: [
          "Blameless mira procesos y sistemas; no nombres de personas como root_cause.",
          "actions debe ser lista con al menos un ítem (rollback, recalibrate, etc.).",
        ],
        edgeCases: ["blameless False", "root_cause vacío", "actions []"],
        tests: "Happy CONTINUE True; adversos REJECT_BLAMEFUL y REQUEST_ROOT_CAUSE",
        feedback: "S39-T4-B-E3: el postmortem cierra el aprendizaje del incidente sin cacería de brujas.",
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
print(*decide(happy))
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
        return "REQUEST_ROOT_CAUSE", False
    return "CONTINUE", True

happy = {
    "case_id": "CASO-LIM-039-T4B",
    "blameless": True,
    "root_cause": "calib_drift",
    "actions": ["rollback", "recalibrate"],
}
assert decide(happy) == ("CONTINUE", True)
assert decide({**happy, "blameless": False})[0] == "REJECT_BLAMEFUL"
assert decide({**happy, "root_cause": ""})[0] == "REQUEST_ROOT_CAUSE"
print(*decide(happy))
`,
          output: `CONTINUE True`,
        },
      },
    ],
  },
  youDo: {
    title: "Responsible ML Case Triage (cierre CP-N3-C) + notas regresión N3/CF-3",
    context:
      "Entrega el sistema e2e sintético de triage para `CASO-LIM-039`: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos human_only, demo de aceptación, cards y postmortem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. No auto-fraude ni parentesco automático. Platform id `integrator-phase2` conservado. **No** marcar section_passed ni editar seed/checkpoint/ledger; PASS de gates es otra lane.",
    objectives: [
      "Pipeline intake→queue con label_space needs_review y auto_fraud False",
      "Registry de versiones/owners con semver y bump major en breaking",
      "Evidence packet mínimo + explicación usable por revisor",
      "Overrides y apelaciones con audit log y cuidado de leakage en feedback",
      "Checklist de privacidad/fairness/seguridad firmable",
      "Modos drift/incident + rollback versionado",
      "Aceptación, tres demo paths, cards, métricas de valor y postmortem blameless",
      "Notas de regresión N3 y CF-3 sin auto-PASS",
    ],
    requirements: [
      "E2e sintético reproducible en local-python",
      "Cero auto-label de fraude o parentesco",
      "Audit log de decisiones y overrides",
      "Checklist regresión S27–S39 documentado",
      "es-PE en prosa; sin secretos ni PII real",
      "section_passed permanece false en esta lane de autoría",
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

def triage(case: dict, *, threshold: float, human_only: bool) -> EvidencePacket:
    required = {"case_id", "shared_signal", "graph_path"}
    missing = required - case.keys()
    if missing:
        raise ValueError(f"missing fields: {sorted(missing)}")
    score = 0.0 if human_only else min(1.0, 0.35 + 0.45 * bool(case["shared_signal"]))
    return EvidencePacket(
        case_id=case["case_id"],
        score=score,
        graph_path=list(case["graph_path"]),
        evidence=["shared_signal"] if case["shared_signal"] else [],
    )

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
    packets = []
    try:
        for case in cases:
            packet = triage(case, threshold=0.70, human_only=False)
            packets.append(asdict(packet))
            append_audit(audit, {"case_id": packet.case_id, "action": "queued_for_review"})
        if force_failure:
            raise RuntimeError("forced regression failure")
        (out / "packets.json").write_text(json.dumps(packets, indent=2), encoding="utf-8")
        (out / "model-card.md").write_text(
            "# Model card\\nLabel: needs_review; no auto-fraud.\\n", encoding="utf-8"
        )
        (out / "data-card.md").write_text(
            "# Data card\\nOnly synthetic fixtures (CASO-LIM-039).\\n", encoding="utf-8"
        )
        (out / "system-card.md").write_text(
            "# System card\\nModes: normal | abstain_more | human_only. Rollback versioned.\\n",
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
        "cf3_lane": "separate_lane",
        "section_passed": False,
    }
    manifest["sha256"] = sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest

# Acceptance: run normal and forced-failure paths; inspect manifest, packets,
# audit, model/data/system cards. A human validator records promotion results.
# No escribas PASS en ledger/seed/checkpoint desde esta lane.
`,
    portfolioNote:
      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. No escribe PASS en ledger/checkpoint; calificación es lane separada.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección (CP-N3-C)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno local-python", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin auto-fraude ni parentesco", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (override, OOD, incident)", weight: "15%" },
      { criterion: "Código legible y límites claros por etapa", weight: "10%" },
      { criterion: "Documentación en español profesional (es-PE)", weight: "10%" },
      { criterion: "E2e triage + evidence packet + audit overrides", weight: "bonus checklist" },
      { criterion: "Regresión N3/CF-3 documentada sin auto-PASS", weight: "gate process" },
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
        question: "CF-3 y regresión S27–S39 en esta lane de autoría:",
        options: [
          "Se documentan; PASS lo califica otra lane",
          "Marcan PASS solos en el ledger",
          "Se borran al exportar el bundle",
          "Solo aplican a S01",
        ],
        correctIndex: 0,
        explanation:
          "Dejas smoke de regresión y expediente listos, pero section_passed y el PASS de CF-3/promoción se escriben en una lane de calificación separada, no en la autoría del material.",
      },
      {
        question: "Evidence packet debe incluir:",
        options: [
          "Solo el score del modelo",
          "Evidencia y path además del score",
          "Solo el owner del repo de ML",
          "Claves de API de producción",
        ],
        correctIndex: 1,
        explanation:
          "Sin evidence y graph_path el revisor no tiene workbench. El score solo es insuficiente y las claves de API no pertenecen al packet.",
      },
      {
        question: "Ante incidente grave el modo seguro es:",
        options: [
          "Ignorar y subir throughput",
          "Subir contamination del training set",
          "Etiquetar fraude masivo con el score",
          "human_only / rollback a artefacto previo",
        ],
        correctIndex: 3,
        explanation:
          "Fail-closed: human_only y rollback versionado. No conviertas el score en etiqueta masiva de fraude ni «arregles» el incidente contaminando datos.",
      },
      {
        question: "Un breaking change en graph_schema del triage exige:",
        options: [
          "Bump patch silencioso",
          "Bump major, owner contactable y revalidación de paths",
          "Borrar el registry",
          "Desactivar el audit log",
        ],
        correctIndex: 1,
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
        note: "Plantilla de model cards para límites del score y label_space",
      },
      {
        label: "SRE / error budgets",
        url: "https://sre.google/sre-book/embracing-risk/",
        note: "Ops, incidentes y trade-offs de confiabilidad",
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
        label: "Responsible AI overview",
        url: "https://www.tensorflow.org/responsible_ai",
        note: "Prácticas de oversight y documentación",
      },
    ],
  },
}
