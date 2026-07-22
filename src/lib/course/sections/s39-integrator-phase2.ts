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
    "Cierras **CP-N3-C** con **Responsible ML Case Triage**: intake→ER→relación→features→modelo→cola humana, con cards, monitoreo y control humano. Id `integrator-phase2` conservado. Promoción de nivel requiere CP-N3-A/B/C, **regresión S27–S39** y **CF-3** (otra lane califica PASS). ER≠fraude≠parentesco.",
  learningOutcomes: [
    { text: "Ensamblar el flujo intake→modelo" },
    { text: "Versionar contratos y ownership" },
    { text: "Armar cola y evidence packet" },
    { text: "Operar decisión, override y apelación" },
    { text: "Mitigar privacidad/fairness/seguridad" },
    { text: "Monitoreo, incidentes y control humano" },
    { text: "Cumplir aceptación y demo" },
    { text: "Publicar cards, valor y postmortem" },
  ],
  theory: [
    {
      heading: "Cierre CP-N3-C + regresión N3 + CF-3",
      paragraphs: [
        "En V3, **S39 cierra el nivel 3** con **Responsible ML Case Triage**. Integra S27–S38 en un sistema demoable.",
        "**Promoción (conceptual):** CP-N3-A, CP-N3-B, CP-N3-C, **regresión S27–S39**, **CF-3**. CF-3 integra contratos ER/grafo/triage y regresión cruzada. **Esta lane de autoría no marca PASS** ni edita ledger/checkpoint/seed.",
        "Orden: **T1 Arquitectura** → **T2 Revisor** → **T3 Riesgo** → **T4 Producto**.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N3-C + regresión",
        content:
          "Entregable: triage responsable. Calificación de promoción y CF-3 es lane separada.",
      },
    },
    {
      heading: "intake → ER → relación → features → modelo",
      subtopicId: "S39-T1-A",
      paragraphs: [
        "Flujo canónico N3: intake de registros → ER (misma entidad) → grafo relacional → features sin leakage → score de prioridad.",
        "Cada etapa tiene contrato de I/O y version. Fallas se aíslan.",
        "ER no infiere relación familiar ni fraude; grafo no culpa; score no es veredicto legal.",
      ],
      code: {
        language: 'python',
        title: "pipeline.py",
        code: `stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
payload = {"run_id": "n3-reg-001", "stage": "model_score", "score": 0.66, "label_space": "needs_review"}
print("pipeline", " > ".join(stages))
print("label_space", payload["label_space"])
print("auto_fraud", False)`,
        output: `pipeline intake > er > relation_graph > features > model_score > queue
label_space needs_review
auto_fraud False`,
      },
      callout: {
        type: "tip",
        title: "Contratos por etapa",
        content:
          "Schema in/out versionado.",
      },
    },
    {
      heading: "contratos, versiones y ownership",
      subtopicId: "S39-T1-B",
      paragraphs: [
        "Cada artefacto: owner, version, compatibility policy. feature_set, model, thr, graph_schema.",
        "Breaking change → bump major y plan de migración.",
        "Ownership claro evita 'nadie on-call'.",
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
          "No hay escalamiento de incidentes.",
      },
    },
    {
      heading: "queue, evidence packet y explicación",
      subtopicId: "S39-T2-A",
      paragraphs: [
        "Cola ordenada por score calibrado/capacidad. Evidence packet: hechos, path de grafo, features top, incertidumbre.",
        "Explicación en 4 capas (S35). UI/CLI didáctica en dicts.",
        "El revisor ve evidencia, no solo un número.",
      ],
      code: {
        language: 'python',
        title: "evidence_packet.py",
        code: `packet = {
    "case_id": "case-77",
    "score": 0.81,
    "evidence": ["shared_phone_synth", "tx_path_len_2"],
    "graph_path": ["E1", "ph:900", "E2"],
    "uncertainty": "in_distribution",
    "model_contrib": {"shared_phone": 0.4},
}
print(packet["case_id"], packet["score"])
print("path", packet["graph_path"])
print("layers", 4)`,
        output: `case-77 0.81
path ['E1', 'ph:900', 'E2']
layers 4`,
      },
      callout: {
        type: "tip",
        title: "Packet mínimo",
        content:
          "Sin path/evidencia no hay workbench.",
      },
    },
    {
      heading: "decisión, override, feedback y apelación",
      subtopicId: "S39-T2-B",
      paragraphs: [
        "Decisiones: queue_action, skip, escalate. Override humano gana y se loguea.",
        "Feedback reentrena o corrige reglas con cuidado (sin leakage).",
        "Apelación reabre con nuevo reviewer o supervisor.",
      ],
      code: {
        language: 'python',
        title: "decisions.py",
        code: `log = []
def decide(case_id, score, human=None):
    auto = "queue" if score >= 0.7 else "skip"
    final = human or auto
    log.append({"case_id": case_id, "auto": auto, "final": final, "override": human is not None})
    return final
print(decide("c1", 0.9))
print(decide("c2", 0.9, human="skip"))
print("overrides", sum(1 for e in log if e["override"]))`,
        output: `queue
skip
overrides 1`,
      },
      callout: {
        type: "danger",
        title: "Sin audit",
        content:
          "Override sin log es riesgo de gobernanza.",
      },
    },
    {
      heading: "privacidad, fairness y seguridad",
      subtopicId: "S39-T3-A",
      paragraphs: [
        "Minimización PII, RBAC al packet, sin secretos en repo. Fairness: slices de daño de revisión.",
        "Seguridad: validar inputs, límites de tamaño, no SSRF a URLs de evidence.",
        "Checklist de release del triage.",
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
    checklist["pii_minimized"], checklist["rbac"], not checklist["secrets_in_repo"],
    checklist["slice_metrics"], checklist["input_limits"],
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
          "Checklist firmado por owner.",
      },
    },
    {
      heading: "drift, incidentes, rollback y human control",
      subtopicId: "S39-T3-B",
      paragraphs: [
        "Monitorea score dist, prevalencia proxy, calibration, latency. Drift → alerta.",
        "Incidente: severidad, rollback de model/thr, human-only mode.",
        "Control humano nunca se 'optimiza' fuera del sistema.",
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
          "Interruptor documentado en runbook.",
      },
    },
    {
      heading: "aceptación y demo",
      subtopicId: "S39-T4-A",
      paragraphs: [
        "Criterios de aceptación: flujo e2e sintético, baseline visible, abstención, audit log, sin auto-fraude.",
        "Demo: un caso feliz, un override, un OOD abstain, métricas de cola.",
        "Regresión N3: smoke de contratos S27–S39 (lista de checks).",
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
          "PASS de promoción no se escribe en esta autoría.",
      },
    },
    {
      heading: "model/data/system cards, métricas de valor y postmortem",
      subtopicId: "S39-T4-B",
      paragraphs: [
        "Cards de modelo, datos y sistema. Métricas de valor: tiempo de review, precisión de cola, % overrides.",
        "Postmortem blameless tras incidentes: timeline, causas, acciones.",
        "Cierre de nivel: documentación lista para CF-3 y regresión formal.",
      ],
      code: {
        language: 'python',
        title: "value_pm.py",
        code: `value = {"precision_at_k": 0.55, "override_rate": 0.12, "median_review_s": 90}
postmortem = {"severity": "T0-T3", "root_cause": "calib_drift", "actions": ["rollback", "recalibrate"]}
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
          "Negocio entiende overrides y tiempo, no solo AUC.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el cierre del nivel: pipeline N3, packet, decisiones, riesgo, demo y regresión/CF-3 (sin auto-PASS).",
    steps: [
      {
        demoId: "S39-T1-A-DEMO",
        subtopicId: "S39-T1-A",
        environment: "local-python",
        description: "Pipeline stages join.",
        code: {
          language: 'python',
          title: "pipe_demo.py",
          code: `print(' > '.join(['intake','er','graph','features','model','queue']))
print('label_space', 'needs_review')
print('auto_fraud', False)`,
          output: `intake > er > graph > features > model > queue
label_space needs_review
auto_fraud False`,
        },
        why: "Flujo N3.",
      },
      {
        demoId: "S39-T1-B-DEMO",
        subtopicId: "S39-T1-B",
        environment: "local-python",
        description: "Registry owners count.",
        code: {
          language: 'python',
          title: "reg_demo.py",
          code: `print(2)
print('semver', True)
print('ok', True)`,
          output: `2
semver True
ok True`,
        },
        why: "Ownership.",
      },
      {
        demoId: "S39-T2-A-DEMO",
        subtopicId: "S39-T2-A",
        environment: "local-python",
        description: "Evidence packet keys.",
        code: {
          language: 'python',
          title: "pkt_demo.py",
          code: `print(sorted(['case_id','score','evidence','graph_path']))
print('layers', 4)
print('ok', True)`,
          output: `['case_id', 'evidence', 'graph_path', 'score']
layers 4
ok True`,
        },
        why: "Packet.",
      },
      {
        demoId: "S39-T2-B-DEMO",
        subtopicId: "S39-T2-B",
        environment: "local-python",
        description: "Override logged.",
        code: {
          language: 'python',
          title: "dec_demo.py",
          code: `print({'final':'skip','override':True})
print('n_overrides', 1)
print('ok', True)`,
          output: `{'final': 'skip', 'override': True}
n_overrides 1
ok True`,
        },
        why: "Decision log.",
      },
      {
        demoId: "S39-T3-A-DEMO",
        subtopicId: "S39-T3-A",
        environment: "local-python",
        description: "Release checklist ok.",
        code: {
          language: 'python',
          title: "risk_demo.py",
          code: `print(True)
print('secrets_in_repo', False)
print('auto_fraud', False)`,
          output: `True
secrets_in_repo False
auto_fraud False`,
        },
        why: "Riesgo.",
      },
      {
        demoId: "S39-T3-B-DEMO",
        subtopicId: "S39-T3-B",
        environment: "local-python",
        description: "human_only on incident.",
        code: {
          language: 'python',
          title: "ops_demo.py",
          code: `print('human_only')
print('rollback', 'prev_model')
print('ok', True)`,
          output: `human_only
rollback prev_model
ok True`,
        },
        why: "Modos ops.",
      },
      {
        demoId: "S39-T4-A-DEMO",
        subtopicId: "S39-T4-A",
        environment: "local-python",
        description: "Acceptance count + regression note.",
        code: {
          language: 'python',
          title: "acc_demo.py",
          code: `print(6)
print('regression', 'S27-S39')
print('cf3_pass_lane', 'separate')`,
          output: `6
regression S27-S39
cf3_pass_lane separate`,
        },
        why: "Aceptación y regresión.",
      },
      {
        demoId: "S39-T4-B-DEMO",
        subtopicId: "S39-T4-B",
        environment: "local-python",
        description: "Value metrics + cards.",
        code: {
          language: 'python',
          title: "val_demo.py",
          code: `print(['precision_at_k','override_rate','median_review_s'])
print(sorted(['model','data','system']))
print('postmortem', True)`,
          output: `['precision_at_k', 'override_rate', 'median_review_s']
['data', 'model', 'system']
postmortem True`,
        },
        why: "Valor y cards.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de arquitectura, contratos, queue, overrides, riesgo, drift, aceptación y cards.",
    steps: [
      {
        id: "S39-T1-A-E1",
        subtopicId: "S39-T1-A",
        kind: "guided",
        instruction:
          "Lista stages en orden.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['intake','er','relation_graph','features','model_score','queue'])
print('n', 6)
print('auto_fraud', False)`,
          output: `['intake', 'er', 'relation_graph', 'features', 'model_score', 'queue']
n 6
auto_fraud False`,
        },
      },
      {
        id: "S39-T1-A-E2",
        subtopicId: "S39-T1-A",
        kind: "independent",
        instruction:
          "label_space needs_review.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('needs_review')
print('not', 'fraud')
print('ok', True)`,
          output: `needs_review
not fraud
ok True`,
        },
      },
      {
        id: "S39-T1-A-E3",
        subtopicId: "S39-T1-A",
        kind: "transfer",
        instruction:
          "ER no parentesco.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('er_is_parentesco', False)
print('er_is_fraud', False)
print('er_is_same_entity', True)`,
          output: `er_is_parentesco False
er_is_fraud False
er_is_same_entity True`,
        },
      },
      {
        id: "S39-T1-B-E1",
        subtopicId: "S39-T1-B",
        kind: "guided",
        instruction:
          "semver major bump on break.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('major')
print('ok', True)
print('policy', 'compat')`,
          output: `major
ok True
policy compat`,
        },
      },
      {
        id: "S39-T1-B-E2",
        subtopicId: "S39-T1-B",
        kind: "independent",
        instruction:
          "owner required.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('artifact', 'ranker')
print('ok', True)`,
          output: `True
artifact ranker
ok True`,
        },
      },
      {
        id: "S39-T1-B-E3",
        subtopicId: "S39-T1-B",
        kind: "transfer",
        instruction:
          "registry size.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(4)
print('ok', True)
print('n_art', 4)`,
          output: `4
ok True
n_art 4`,
        },
      },
      {
        id: "S39-T2-A-E1",
        subtopicId: "S39-T2-A",
        kind: "guided",
        instruction:
          "packet must include graph_path.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('keys_min', 4)
print('ok', True)`,
          output: `True
keys_min 4
ok True`,
        },
      },
      {
        id: "S39-T2-A-E2",
        subtopicId: "S39-T2-A",
        kind: "independent",
        instruction:
          "score alone insufficient.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)
print('need', 'evidence')
print('ok', True)`,
          output: `False
need evidence
ok True`,
        },
      },
      {
        id: "S39-T2-A-E3",
        subtopicId: "S39-T2-A",
        kind: "transfer",
        instruction:
          "4 capas explicación.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(4)
print('ok', True)
print('s35', True)`,
          output: `4
ok True
s35 True`,
        },
      },
      {
        id: "S39-T2-B-E1",
        subtopicId: "S39-T2-B",
        kind: "guided",
        instruction:
          "override final skip.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('skip')
print('override', True)
print('ok', True)`,
          output: `skip
override True
ok True`,
        },
      },
      {
        id: "S39-T2-B-E2",
        subtopicId: "S39-T2-B",
        kind: "independent",
        instruction:
          "appeal reopens.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('reopen')
print('ok', True)
print('audit', True)`,
          output: `reopen
ok True
audit True`,
        },
      },
      {
        id: "S39-T2-B-E3",
        subtopicId: "S39-T2-B",
        kind: "transfer",
        instruction:
          "feedback logged.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('leakage_care', True)
print('ok', True)`,
          output: `True
leakage_care True
ok True`,
        },
      },
      {
        id: "S39-T3-A-E1",
        subtopicId: "S39-T3-A",
        kind: "guided",
        instruction:
          "secrets_in_repo false required.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)
print('release_blocker', True)
print('ok', True)`,
          output: `False
release_blocker True
ok True`,
        },
      },
      {
        id: "S39-T3-A-E2",
        subtopicId: "S39-T3-A",
        kind: "independent",
        instruction:
          "rbac on packet.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('ok', True)
print('min_role', 'reviewer')`,
          output: `True
ok True
min_role reviewer`,
        },
      },
      {
        id: "S39-T3-A-E3",
        subtopicId: "S39-T3-A",
        kind: "transfer",
        instruction:
          "fairness slices present.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('ok', True)
print('metric', 'fp_rate')`,
          output: `True
ok True
metric fp_rate`,
        },
      },
      {
        id: "S39-T3-B-E1",
        subtopicId: "S39-T3-B",
        kind: "guided",
        instruction:
          "incident → human_only.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('human_only')
print('ok', True)
print('n', 1)`,
          output: `human_only
ok True
n 1`,
        },
      },
      {
        id: "S39-T3-B-E2",
        subtopicId: "S39-T3-B",
        kind: "independent",
        instruction:
          "drift → abstain_more.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('abstain_more')
print('ok', True)
print('monitor', True)`,
          output: `abstain_more
ok True
monitor True`,
        },
      },
      {
        id: "S39-T3-B-E3",
        subtopicId: "S39-T3-B",
        kind: "transfer",
        instruction:
          "rollback target.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('previous_model')
print('ok', True)
print('thr', 'previous')`,
          output: `previous_model
ok True
thr previous`,
        },
      },
      {
        id: "S39-T4-A-E1",
        subtopicId: "S39-T4-A",
        kind: "guided",
        instruction:
          "acceptance includes no_auto_fraud.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('criterion', 'no_auto_fraud_label')
print('ok', True)`,
          output: `True
criterion no_auto_fraud_label
ok True`,
        },
      },
      {
        id: "S39-T4-A-E2",
        subtopicId: "S39-T4-A",
        kind: "independent",
        instruction:
          "regression scope S27-S39.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('S27-S39')
print('cf3', 'separate_lane')
print('section_passed', False)`,
          output: `S27-S39
cf3 separate_lane
section_passed False`,
        },
      },
      {
        id: "S39-T4-A-E3",
        subtopicId: "S39-T4-A",
        kind: "transfer",
        instruction:
          "demo paths 3.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(3)
print('paths', ['happy','override','ood'])
print('ok', True)`,
          output: `3
paths ['happy', 'override', 'ood']
ok True`,
        },
      },
      {
        id: "S39-T4-B-E1",
        subtopicId: "S39-T4-B",
        kind: "guided",
        instruction:
          "three cards.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['model','data','system'])
print('ok', True)
print('n', 3)`,
          output: `['model', 'data', 'system']
ok True
n 3`,
        },
      },
      {
        id: "S39-T4-B-E2",
        subtopicId: "S39-T4-B",
        kind: "independent",
        instruction:
          "value metric override_rate.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('override_rate')
print('ok', True)
print('business', True)`,
          output: `override_rate
ok True
business True`,
        },
      },
      {
        id: "S39-T4-B-E3",
        subtopicId: "S39-T4-B",
        kind: "transfer",
        instruction:
          "postmortem blameless flag.",
        hint: "Revisa la demo.",
        hints: [
          "Revisa la demo.",
          "Alinea prints.",
        ],
        edgeCases: ["sintético"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)
print('root_cause_field', True)
print('ok', True)`,
          output: `True
root_cause_field True
ok True`,
        },
      },
    ],
  },
  youDo: {
    title: "Responsible ML Case Triage (cierre CP-N3-C) + notas regresión N3/CF-3",
    context:
      "Entrega el sistema e2e sintético de triage: contratos versionados, evidence packet, decisiones/overrides, checklist de riesgo, modos human_only, demo de aceptación, cards y postmortem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. No auto-fraude. Platform id integrator-phase2 conservado. **No** marcar section_passed ni editar seed/checkpoint/ledger; PASS de gates es otra lane.",
    objectives: [
      "Pipeline intake→queue con label_space needs_review",
      "Registry de versiones/owners",
      "Evidence packet + overrides auditados",
      "Privacidad/fairness/seguridad checklist",
      "Drift/incident modes + rollback",
      "Aceptación, demo, cards, valor, postmortem",
      "Notas de regresión N3 y CF-3 (sin auto-PASS)",
    ],
    requirements: [
      "E2e sintético reproducible",
      "Cero auto-label fraude/parentesco",
      "Audit log de decisiones",
      "Checklist regresión S27–S39 documentado",
      "es-PE; sin secretos/PII real",
      "section_passed permanece false en esta lane",
    ],
    starterCode: `# CP-N3-C — bundle local de Responsible ML Case Triage
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
        {"case_id": "c-001", "shared_signal": True, "graph_path": ["entity:a", "phone:x", "entity:b"]},
        {"case_id": "c-002", "shared_signal": False, "graph_path": ["entity:c"]},
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
        (out / "model-card.md").write_text("# Model card\\nLabel: needs_review; no auto-fraud.\\n", encoding="utf-8")
        (out / "data-card.md").write_text("# Data card\\nOnly synthetic fixtures.\\n", encoding="utf-8")
        status = "ready_for_human_acceptance"
    except Exception as exc:
        append_audit(audit, {"action": "rollback", "reason": type(exc).__name__})
        status = "human_only"
    files = sorted(p.name for p in out.iterdir())
    manifest = {"status": status, "files": files, "stages": list(STAGES)}
    manifest["sha256"] = sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest

# Acceptance: run normal and forced-failure paths; inspect manifest, packets,
# audit, model card and data card. A human validator records promotion results.
`,
    portfolioNote:
      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. No escribe PASS en ledger/checkpoint; calificación es lane separada.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
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
          "Cola de revisión.",
      },
      {
        question: "CF-3 y regresión S27–S39 en esta lane de autoría:",
        options: ["Se documentan; PASS lo califica otra lane", "Marcan PASS solos", "Se borran", "Solo aplican a S01"],
        correctIndex: 0,
        explanation:
          "Sin auto-PASS.",
      },
      {
        question: "Evidence packet debe incluir:",
        options: ["Solo el score", "Evidencia y path además del score", "Solo el owner del repo", "Claves de API"],
        correctIndex: 1,
        explanation:
          "Explicabilidad.",
      },
      {
        question: "Ante incidente grave el modo seguro es:",
        options: ["Ignorar", "Subir contamination", "Etiquetar fraude masivo", "human_only / rollback"],
        correctIndex: 3,
        explanation:
          "Control humano.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "Cards",
      },
      {
        label: "SRE / error budgets",
        url: "https://sre.google/sre-book/embracing-risk/",
        note: "Ops",
      },
    ],
    books: [
      {
        label: "Building ML Powered Applications",
        note: "Sistemas ML",
      },
      {
        label: "Incident management handbooks",
        note: "Postmortems",
      },
    ],
    courses: [
      {
        label: "Responsible AI overview",
        url: "https://www.tensorflow.org/responsible_ai",
        note: "Prácticas",
      },
    ],
  },
}
