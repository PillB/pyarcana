import type { CourseSection } from '../../types'

export const section51: CourseSection = {
  id: "integrator-final",
  index: 51,
  title: "Observabilidad, gobernanza y UX del copiloto",
  shortTitle: "Obs y UX copiloto",
  tagline: "Auditable AI Operations Copilot con system card y dashboard; CF-5 congela artefactos e interfaces",
  estimatedHours: 16,
  level: "Master",
  phase: 3,
  icon: "Crown",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Observabilidad, gobernanza y UX del copiloto** (id de plataforma `integrator-final` conservado; legado «Proyecto Integrador Final — Sistema AI Production-Grade»). Contribuye a **CP-N4-C (cierre) + CF-5 + Level-4 regression**: Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo revertirla. CF-5 congela artefactos e interfaces para integración final. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Traza prompts, retrieval y tools" },
    { text: "Mide tokens/costo/latency con redacción" },
    { text: "Registra modelo/prompt/dataset" },
    { text: "Controla cambios, acceso y auditoría" },
    { text: "Opera SLO, feedback y drift" },
    { text: "Responde incidentes y postmortems" },
    { text: "Muestra incertidumbre, citas y confirmaciones" },
    { text: "Diseña a11y, corrección y contestabilidad" },
  ],
  theory: [
    {
      heading: "Mapa V3 S51: Observabilidad, gobernanza y UX del copiloto",
      paragraphs: [
        "En V3, **S51** retematiza el archivo de plataforma `integrator-final` hacia **Observabilidad, gobernanza y UX del copiloto**. **FINAL/CLOSE gate** (CLOSE + Level-4 regression + CF-5).",
        "Incremento: Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo revertirla. CF-5 congela artefactos e interfaces para integración final.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `integrator-final`. Capstone: CP-N4-C (cierre) + CF-5 + Level-4 regression.",
      },
    },
    {
      heading: "traces de prompts/retrieval/tools",
      subtopicId: "S51-T1-A",
      paragraphs: [
        "**traces de prompts/retrieval/tools** — outcome del blueprint phase3 para `traces-prompts-retrieval-tools`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "traces_prompts_retrieval_tools.py",
        code: `print("p3"); print(["c1"]); print("get_case")`,
        output: `p3
['c1']
get_case`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "tokens, costo, latency y redacción",
      subtopicId: "S51-T1-B",
      paragraphs: [
        "**tokens, costo, latency y redacción** — outcome del blueprint phase3 para `tokens-cost-latency-redaction`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "tokens_cost_latency_redaction.py",
        code: `print("ana@[redacted]"); print({"tokens":1200,"cost":0.01,"latency_ms":900}); print("no_raw_pii", True)`,
        output: `ana@[redacted]
{'tokens': 1200, 'cost': 0.01, 'latency_ms': 900}
no_raw_pii True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "registro de modelo/prompt/dataset",
      subtopicId: "S51-T2-A",
      paragraphs: [
        "**registro de modelo/prompt/dataset** — outcome del blueprint phase3 para `registry-model-prompt-dataset`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "registry_model_prompt_dataset.py",
        code: `print([("dataset","eval-v4"),("model","m-2"),("prompt","p3")]); print("immutable", True); print("system_card_link", True)`,
        output: `[('dataset', 'eval-v4'), ('model', 'm-2'), ('prompt', 'p3')]
immutable True
system_card_link True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "cambio, acceso, retención y auditoría",
      subtopicId: "S51-T2-B",
      paragraphs: [
        "**cambio, acceso, retención y auditoría** — outcome del blueprint phase3 para `change-access-retention-audit`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "change_access_retention_audit.py",
        code: `print({"change":"rfc+approve","retention_days":180}); print("who_changed", "required"); print("cf5", "freeze_interfaces")`,
        output: `{'change': 'rfc+approve', 'retention_days': 180}
who_changed required
cf5 freeze_interfaces`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "SLO, feedback y drift",
      subtopicId: "S51-T3-A",
      paragraphs: [
        "**SLO, feedback y drift** — outcome del blueprint phase3 para `slo-feedback-drift`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "slo_feedback_drift.py",
        code: `print({"availability":0.995}); print("drift_ok", True); print("feedback", "thumbs+labels")`,
        output: `{'availability': 0.995}
drift_ok True
feedback thumbs+labels`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "incidents, rollback y postmortem",
      subtopicId: "S51-T3-B",
      paragraphs: [
        "**incidents, rollback y postmortem** — outcome del blueprint phase3 para `incidents-rollback-postmortem`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "incidents_rollback_postmortem.py",
        code: `print({"sev":"P1","rollback_to":"m-1"}); print("page", True); print("timeline", "required")`,
        output: `{'sev': 'P1', 'rollback_to': 'm-1'}
page True
timeline required`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "incertidumbre, citas y confirmaciones",
      subtopicId: "S51-T4-A",
      paragraphs: [
        "**incertidumbre, citas y confirmaciones** — outcome del blueprint phase3 para `uncertainty-cites-confirm`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "uncertainty_cites_confirm.py",
        code: `print({"uncertainty":"low/med/high","cites":True}); print("show_cites", True); print("confirm", "before_side_effects")`,
        output: `{'uncertainty': 'low/med/high', 'cites': True}
show_cites True
confirm before_side_effects`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "accesibilidad, corrección y contestabilidad",
      subtopicId: "S51-T4-B",
      paragraphs: [
        "**accesibilidad, corrección y contestabilidad** — outcome del blueprint phase3 para `a11y-correction-contestability`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (cierre) + CF-5 + Level-4 regression** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "a11y_correction_contestability.py",
        code: `print({"contrast":"AA","keyboard":True}); print({"edit":True,"contest":True}); print("human_rights", "contestability")`,
        output: `{'contrast': 'AA', 'keyboard': True}
{'edit': True, 'contest': True}
human_rights contestability`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C (cierre) + CF-5 + Level-4 regression.",
    steps: [
      {
        demoId: "S51-T1-A-DEMO",
        subtopicId: "S51-T1-A",
        environment: "local-python",
        description: "Demo: traces de prompts/retrieval/tools",
        code: {
          language: 'python',
          title: "demo_traces_prompts_retrieval_tools.py",
          code: `print("trace_id", "t-1"); print("spans", ["prompt","retrieve","tool"]); print("audit", True)`,
          output: `trace_id t-1
spans ['prompt', 'retrieve', 'tool']
audit True`,
        },
        why: "Demuestra el outcome de S51-T1-A con Python verificable.",
      },
      {
        demoId: "S51-T1-B-DEMO",
        subtopicId: "S51-T1-B",
        environment: "local-python",
        description: "Demo: tokens, costo, latency y redacción",
        code: {
          language: 'python',
          title: "demo_tokens_cost_latency_redaction.py",
          code: `print("tokens", 1200); print("redaction", True); print("latency_ms", 900)`,
          output: `tokens 1200
redaction True
latency_ms 900`,
        },
        why: "Demuestra el outcome de S51-T1-B con Python verificable.",
      },
      {
        demoId: "S51-T2-A-DEMO",
        subtopicId: "S51-T2-A",
        environment: "local-python",
        description: "Demo: registro de modelo/prompt/dataset",
        code: {
          language: 'python',
          title: "demo_registry_model_prompt_dataset.py",
          code: `print("registry", True); print("versions", {"model":"m-2"}); print("pin", True)`,
          output: `registry True
versions {'model': 'm-2'}
pin True`,
        },
        why: "Demuestra el outcome de S51-T2-A con Python verificable.",
      },
      {
        demoId: "S51-T2-B-DEMO",
        subtopicId: "S51-T2-B",
        environment: "local-python",
        description: "Demo: cambio, acceso, retención y auditoría",
        code: {
          language: 'python',
          title: "demo_change_access_retention_audit.py",
          code: `print("access_log", True); print("retention", 180); print("change_control", True)`,
          output: `access_log True
retention 180
change_control True`,
        },
        why: "Demuestra el outcome de S51-T2-B con Python verificable.",
      },
      {
        demoId: "S51-T3-A-DEMO",
        subtopicId: "S51-T3-A",
        environment: "local-python",
        description: "Demo: SLO, feedback y drift",
        code: {
          language: 'python',
          title: "demo_slo_feedback_drift.py",
          code: `print("slo", True); print("drift_watch", True); print("feedback_loop", True)`,
          output: `slo True
drift_watch True
feedback_loop True`,
        },
        why: "Demuestra el outcome de S51-T3-A con Python verificable.",
      },
      {
        demoId: "S51-T3-B-DEMO",
        subtopicId: "S51-T3-B",
        environment: "local-python",
        description: "Demo: incidents, rollback y postmortem",
        code: {
          language: 'python',
          title: "demo_incidents_rollback_postmortem.py",
          code: `print("rollback", "m-1"); print("postmortem", True); print("action_items", True)`,
          output: `rollback m-1
postmortem True
action_items True`,
        },
        why: "Demuestra el outcome de S51-T3-B con Python verificable.",
      },
      {
        demoId: "S51-T4-A-DEMO",
        subtopicId: "S51-T4-A",
        environment: "local-python",
        description: "Demo: incertidumbre, citas y confirmaciones",
        code: {
          language: 'python',
          title: "demo_uncertainty_cites_confirm.py",
          code: `print("uncertainty", True); print("cites", True); print("confirm_gate", True)`,
          output: `uncertainty True
cites True
confirm_gate True`,
        },
        why: "Demuestra el outcome de S51-T4-A con Python verificable.",
      },
      {
        demoId: "S51-T4-B-DEMO",
        subtopicId: "S51-T4-B",
        environment: "local-python",
        description: "Demo: accesibilidad, corrección y contestabilidad",
        code: {
          language: 'python',
          title: "demo_a11y_correction_contestability.py",
          code: `print("a11y", True); print("correction", True); print("contest", True)`,
          output: `a11y True
correction True
contest True`,
        },
        why: "Demuestra el outcome de S51-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S51-T1-A-E1",
        subtopicId: "S51-T1-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'p3'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('p3')`,
          output: `p3`,
        },
      },
      {
        id: "S51-T1-A-E2",
        subtopicId: "S51-T1-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['c1']\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['c1'])`,
          output: `['c1']`,
        },
      },
      {
        id: "S51-T1-A-E3",
        subtopicId: "S51-T1-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'get_case'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('get_case')`,
          output: `get_case`,
        },
      },
      {
        id: "S51-T1-B-E1",
        subtopicId: "S51-T1-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'ana@[redacted]'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ana@[redacted]')`,
          output: `ana@[redacted]`,
        },
      },
      {
        id: "S51-T1-B-E2",
        subtopicId: "S51-T1-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`0.01\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0.01)`,
          output: `0.01`,
        },
      },
      {
        id: "S51-T1-B-E3",
        subtopicId: "S51-T1-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T2-A-E1",
        subtopicId: "S51-T2-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`[('dataset','eval-v4'),('model','m-2'),('prompt','p3')]\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print([('dataset','eval-v4'),('model','m-2'),('prompt','p3')])`,
          output: `[('dataset', 'eval-v4'), ('model', 'm-2'), ('prompt', 'p3')]`,
        },
      },
      {
        id: "S51-T2-A-E2",
        subtopicId: "S51-T2-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T2-A-E3",
        subtopicId: "S51-T2-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'m-2'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('m-2')`,
          output: `m-2`,
        },
      },
      {
        id: "S51-T2-B-E1",
        subtopicId: "S51-T2-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`180\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(180)`,
          output: `180`,
        },
      },
      {
        id: "S51-T2-B-E2",
        subtopicId: "S51-T2-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T2-B-E3",
        subtopicId: "S51-T2-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'rfc+approve'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('rfc+approve')`,
          output: `rfc+approve`,
        },
      },
      {
        id: "S51-T3-A-E1",
        subtopicId: "S51-T3-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`0.995\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0.995)`,
          output: `0.995`,
        },
      },
      {
        id: "S51-T3-A-E2",
        subtopicId: "S51-T3-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T3-A-E3",
        subtopicId: "S51-T3-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`0.05\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0.05)`,
          output: `0.05`,
        },
      },
      {
        id: "S51-T3-B-E1",
        subtopicId: "S51-T3-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'P1'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('P1')`,
          output: `P1`,
        },
      },
      {
        id: "S51-T3-B-E2",
        subtopicId: "S51-T3-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'m-1'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('m-1')`,
          output: `m-1`,
        },
      },
      {
        id: "S51-T3-B-E3",
        subtopicId: "S51-T3-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'blameless'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('blameless')`,
          output: `blameless`,
        },
      },
      {
        id: "S51-T4-A-E1",
        subtopicId: "S51-T4-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T4-A-E2",
        subtopicId: "S51-T4-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T4-A-E3",
        subtopicId: "S51-T4-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'before_side_effects'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('before_side_effects')`,
          output: `before_side_effects`,
        },
      },
      {
        id: "S51-T4-B-E1",
        subtopicId: "S51-T4-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T4-B-E2",
        subtopicId: "S51-T4-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`True\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S51-T4-B-E3",
        subtopicId: "S51-T4-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'contestability'\`. Datos sintéticos; sin PII real.",
        hint: "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
        hints: [
          "Revisa el demo iDo del mismo subtopicId y copia la estructura mínima.",
          "Compara cada print con el output esperado del solution/demo.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa los print / lógica
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('contestability')`,
          output: `contestability`,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Observabilidad, gobernanza y UX del copiloto (CP-N4-C (cierre) + CF-5 + Level-4 regression)",
    context:
      "Proyecto de sección **S51** (Observabilidad, gobernanza y UX del copiloto). Gate: **CP-N4-C (cierre) + CF-5 + Level-4 regression**. Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo revertirla. CF-5 congela artefactos e interfaces para integración final. **FINAL — CP-N4-C CLOSE + CF-5 + Level-4 regression**: Auditable AI Operations Copilot (system card + dashboard; qué versión, evidencia, tools, rollback). CF-5 congela interfaces. Nota FINAL. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "FINAL: Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió, qué evidencia usó, qué tool llamó y cómo revertirla. CF-5 congela artefactos e interfaces para integración final.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-C (cierre) + CF-5 + Level-4 regression",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S51 You Do — Observabilidad, gobernanza y UX del copiloto
# Gate: CP-N4-C (cierre) + CF-5 + Level-4 regression
# Auditable AI Operations Copilot aprobado con system card y dashboard operativo que permiten saber qué versión respondió,

def main():
    print("section", "S51")
    print("gate", 'CP-N4-C (cierre) + CF-5 + Level-4 regression')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "FINAL. Entrega alineada a CP-N4-C (cierre) + CF-5 + Level-4 regression. Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Nota FINAL de gate: CLOSE + Level-4 regression + CF-5", weight: "gate FINAL" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S51 que se preserva es:",
        options: [
          "integrator-final",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S51 pertenece a:",
        options: [
          "CP-N4-C (cierre) + CF-5 + Level-4 regression",
          "CP-N1-A",
          "solo marketing",
          "sin capstone",
        ],
        correctIndex: 0,
        explanation:
          "Blueprint phase3 capstone_notes.",
      },
      {
        question: "Los ejemplos del curso deben usar:",
        options: [
          "PII real de clientes",
          "Datos sintéticos",
          "Secretos de prod",
          "Claves API reales",
        ],
        correctIndex: 1,
        explanation:
          "Synthetic data only.",
      },
      {
        question: "Entity resolution (si aparece) decide:",
        options: [
          "Fraude",
          "Parentesco",
          "Misma entidad cuando aplique",
          "Sentimiento",
        ],
        correctIndex: 2,
        explanation:
          "ER ≠ relación ≠ fraude.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python docs",
        url: "https://docs.python.org/3/",
        note: "Referencia stdlib",
      },
      {
        label: "V3 section support",
        url: "https://docs.python.org/3/library/",
        note: "Apoyo S51 Observabilidad, gobernanza y UX del copiloto",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Observabilidad, gobernanza y UX del copiloto",
      },
      {
        label: "Site Reliability / Security basics",
        note: "Operación y privacidad",
      },
    ],
    courses: [
      {
        label: "MDN / cloud / MLOps primers",
        url: "https://developer.mozilla.org/",
        note: "Complemento conceptual",
      },
    ],
  },
}
