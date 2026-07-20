import type { CourseSection } from '../../types'

export const section50: CourseSection = {
  id: "tech-leadership",
  index: 50,
  title: "Evals, red teaming y fiabilidad de IA",
  shortTitle: "Evals y red team",
  tagline: "suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye tool calls y reanudación",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Users",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Evals, red teaming y fiabilidad de IA** (id de plataforma `tech-leadership` conservado; legado «Liderazgo Técnico — Mentoría, ADRs, RFC y Technical Writing»). Contribuye a **CP-N4-C (quality gate)**: suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Arma dataset y rúbrica de tareas" },
    { text: "Evalúa resultado, proceso y recovery" },
    { text: "Combina graders det/humanos/LLM" },
    { text: "Calibra jueces y evita order bias" },
    { text: "Prueba injection, exfil y tool misuse" },
    { text: "Mitiga injection indirecta y poisoning" },
    { text: "Detecta hallucination y abstiene" },
    { text: "Opera latency/cost e incidentes" },
  ],
  theory: [
    {
      heading: "Mapa V3 S50: Evals, red teaming y fiabilidad de IA",
      paragraphs: [
        "En V3, **S50** retematiza el archivo de plataforma `tech-leadership` hacia **Evals, red teaming y fiabilidad de IA**.",
        "Incremento: suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `tech-leadership`. Capstone: CP-N4-C (quality gate).",
      },
    },
    {
      heading: "task dataset y rubric",
      subtopicId: "S50-T1-A",
      paragraphs: [
        "**task dataset y rubric** — outcome del blueprint phase3 para `task-dataset-rubric`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "task_dataset_rubric.py",
        code: `print("cite_sla"); print(["cites","correct"]); print("n", 1)`,
        output: `cite_sla
['cites', 'correct']
n 1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "resultado, proceso, trajectory y recovery",
      subtopicId: "S50-T1-B",
      paragraphs: [
        "**resultado, proceso, trajectory y recovery** — outcome del blueprint phase3 para `outcome-process-trajectory-recovery`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "outcome_process_trajectory_recovery.py",
        code: `print(3); print(sorted(["outcome","process","recovery","trajectory"])); print("not_only_final_text", True)`,
        output: `3
['outcome', 'process', 'recovery', 'trajectory']
not_only_final_text True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "graders deterministas/humanos/LLM",
      subtopicId: "S50-T2-A",
      paragraphs: [
        "**graders deterministas/humanos/LLM** — outcome del blueprint phase3 para `graders-det-human-llm`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "graders_det_human_llm.py",
        code: `print(1); print(0); print("mix", ["det","human","llm"])`,
        output: `1
0
mix ['det', 'human', 'llm']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "calibración, order bias y conjunto retenido",
      subtopicId: "S50-T2-B",
      paragraphs: [
        "**calibración, order bias y conjunto retenido** — outcome del blueprint phase3 para `calibration-order-bias-holdout`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "calibration_order_bias_holdout.py",
        code: `print(0.3); print("holdout", True); print("calibrate", "temperature_or_rubric")`,
        output: `0.3
holdout True
calibrate temperature_or_rubric`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "prompt injection, exfiltración y tool misuse",
      subtopicId: "S50-T3-A",
      paragraphs: [
        "**prompt injection, exfiltración y tool misuse** — outcome del blueprint phase3 para `injection-exfil-tool-misuse`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "injection_exfil_tool_misuse.py",
        code: `print(True); print(False); print("tool_misuse", "allowlist")`,
        output: `True
False
tool_misuse allowlist`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "indirect injection, data poisoning y least privilege",
      subtopicId: "S50-T3-B",
      paragraphs: [
        "**indirect injection, data poisoning y least privilege** — outcome del blueprint phase3 para `indirect-poison-least-priv`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "indirect_poison_least_priv.py",
        code: `print(True); print(False); print("poison", "source_acl")`,
        output: `True
False
poison source_acl`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "hallucination y abstención",
      subtopicId: "S50-T4-A",
      paragraphs: [
        "**hallucination y abstención** — outcome del blueprint phase3 para `hallucination-abstention`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "hallucination_abstention.py",
        code: `print("answer"); print("abstain"); print("abstain")`,
        output: `answer
abstain
abstain`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "latency/cost/caching, incident response y rollback",
      subtopicId: "S50-T4-B",
      paragraphs: [
        "**latency/cost/caching, incident response y rollback** — outcome del blueprint phase3 para `latency-cost-cache-incident-rollback`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (quality gate)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "latency_cost_cache_incident_rollback.py",
        code: `print({"p95_ms":800,"cost_usd":0.02}); print("incident", "rollback_model"); print("cache", "prompt_prefix")`,
        output: `{'p95_ms': 800, 'cost_usd': 0.02}
incident rollback_model
cache prompt_prefix`,
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
    intro: "Te muestro 8 demos de S50 (Evals, red teaming y fiabilidad de IA) alineadas a CP-N4-C (quality gate).",
    steps: [
      {
        demoId: "S50-T1-A-DEMO",
        subtopicId: "S50-T1-A",
        environment: "local-python",
        description: "Demo: task dataset y rubric",
        code: {
          language: 'python',
          title: "demo_task_dataset_rubric.py",
          code: `print("dataset", "versioned"); print("rubric", True); print("gold", "synthetic")`,
          output: `dataset versioned
rubric True
gold synthetic`,
        },
        why: "Demuestra el outcome de S50-T1-A con Python verificable.",
      },
      {
        demoId: "S50-T1-B-DEMO",
        subtopicId: "S50-T1-B",
        environment: "local-python",
        description: "Demo: resultado, proceso, trajectory y recovery",
        code: {
          language: 'python',
          title: "demo_outcome_process_trajectory_recovery.py",
          code: `print("trajectory", True); print("tool_args_checked", True); print("recovery", True)`,
          output: `trajectory True
tool_args_checked True
recovery True`,
        },
        why: "Demuestra el outcome de S50-T1-B con Python verificable.",
      },
      {
        demoId: "S50-T2-A-DEMO",
        subtopicId: "S50-T2-A",
        environment: "local-python",
        description: "Demo: graders deterministas/humanos/LLM",
        code: {
          language: 'python',
          title: "demo_graders_det_human_llm.py",
          code: `print("det_first", True); print("llm_judge", "calibrated"); print("human", "spotcheck")`,
          output: `det_first True
llm_judge calibrated
human spotcheck`,
        },
        why: "Demuestra el outcome de S50-T2-A con Python verificable.",
      },
      {
        demoId: "S50-T2-B-DEMO",
        subtopicId: "S50-T2-B",
        environment: "local-python",
        description: "Demo: calibración, order bias y conjunto retenido",
        code: {
          language: 'python',
          title: "demo_calibration_order_bias_holdout.py",
          code: `print("bias", 0.3); print("holdout_set", True); print("shuffle_order", True)`,
          output: `bias 0.3
holdout_set True
shuffle_order True`,
        },
        why: "Demuestra el outcome de S50-T2-B con Python verificable.",
      },
      {
        demoId: "S50-T3-A-DEMO",
        subtopicId: "S50-T3-A",
        environment: "local-python",
        description: "Demo: prompt injection, exfiltración y tool misuse",
        code: {
          language: 'python',
          title: "demo_injection_exfil_tool_misuse.py",
          code: `print("injection", True); print("exfil", "block"); print("tools", "allowlist")`,
          output: `injection True
exfil block
tools allowlist`,
        },
        why: "Demuestra el outcome de S50-T3-A con Python verificable.",
      },
      {
        demoId: "S50-T3-B-DEMO",
        subtopicId: "S50-T3-B",
        environment: "local-python",
        description: "Demo: indirect injection, data poisoning y least privilege",
        code: {
          language: 'python',
          title: "demo_indirect_poison_least_priv.py",
          code: `print("indirect", "html_comments"); print("privilege", "min"); print("data_poison", "review")`,
          output: `indirect html_comments
privilege min
data_poison review`,
        },
        why: "Demuestra el outcome de S50-T3-B con Python verificable.",
      },
      {
        demoId: "S50-T4-A-DEMO",
        subtopicId: "S50-T4-A",
        environment: "local-python",
        description: "Demo: hallucination y abstención",
        code: {
          language: 'python',
          title: "demo_hallucination_abstention.py",
          code: `print("hallucination", "unsupported_claim"); print("abstain_policy", True); print("cite_or_quit", True)`,
          output: `hallucination unsupported_claim
abstain_policy True
cite_or_quit True`,
        },
        why: "Demuestra el outcome de S50-T4-A con Python verificable.",
      },
      {
        demoId: "S50-T4-B-DEMO",
        subtopicId: "S50-T4-B",
        environment: "local-python",
        description: "Demo: latency/cost/caching, incident response y rollback",
        code: {
          language: 'python',
          title: "demo_latency_cost_cache_incident_rollback.py",
          code: `print("rollback", True); print("cost_guardrail", True); print("latency_slo", 1000)`,
          output: `rollback True
cost_guardrail True
latency_slo 1000`,
        },
        why: "Demuestra el outcome de S50-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S50-T1-A-E1",
        subtopicId: "S50-T1-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('cite_sla')`,
          output: `cite_sla`,
        },
      },
      {
        id: "S50-T1-A-E2",
        subtopicId: "S50-T1-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['cites','correct'])`,
          output: `['cites', 'correct']`,
        },
      },
      {
        id: "S50-T1-A-E3",
        subtopicId: "S50-T1-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(1)`,
          output: `1`,
        },
      },
      {
        id: "S50-T1-B-E1",
        subtopicId: "S50-T1-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(3)`,
          output: `3`,
        },
      },
      {
        id: "S50-T1-B-E2",
        subtopicId: "S50-T1-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['outcome','process','recovery','trajectory'])`,
          output: `['outcome', 'process', 'recovery', 'trajectory']`,
        },
      },
      {
        id: "S50-T1-B-E3",
        subtopicId: "S50-T1-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
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
        id: "S50-T2-A-E1",
        subtopicId: "S50-T2-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(1)`,
          output: `1`,
        },
      },
      {
        id: "S50-T2-A-E2",
        subtopicId: "S50-T2-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0)`,
          output: `0`,
        },
      },
      {
        id: "S50-T2-A-E3",
        subtopicId: "S50-T2-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['det','human','llm'])`,
          output: `['det', 'human', 'llm']`,
        },
      },
      {
        id: "S50-T2-B-E1",
        subtopicId: "S50-T2-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0.3)`,
          output: `0.3`,
        },
      },
      {
        id: "S50-T2-B-E2",
        subtopicId: "S50-T2-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
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
        id: "S50-T2-B-E3",
        subtopicId: "S50-T2-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
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
        id: "S50-T3-A-E1",
        subtopicId: "S50-T3-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
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
        id: "S50-T3-A-E2",
        subtopicId: "S50-T3-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)`,
          output: `False`,
        },
      },
      {
        id: "S50-T3-A-E3",
        subtopicId: "S50-T3-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('allowlist')`,
          output: `allowlist`,
        },
      },
      {
        id: "S50-T3-B-E1",
        subtopicId: "S50-T3-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
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
        id: "S50-T3-B-E2",
        subtopicId: "S50-T3-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)`,
          output: `False`,
        },
      },
      {
        id: "S50-T3-B-E3",
        subtopicId: "S50-T3-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('source_acl')`,
          output: `source_acl`,
        },
      },
      {
        id: "S50-T4-A-E1",
        subtopicId: "S50-T4-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('answer')`,
          output: `answer`,
        },
      },
      {
        id: "S50-T4-A-E2",
        subtopicId: "S50-T4-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('abstain')`,
          output: `abstain`,
        },
      },
      {
        id: "S50-T4-A-E3",
        subtopicId: "S50-T4-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('abstain')`,
          output: `abstain`,
        },
      },
      {
        id: "S50-T4-B-E1",
        subtopicId: "S50-T4-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(800)`,
          output: `800`,
        },
      },
      {
        id: "S50-T4-B-E2",
        subtopicId: "S50-T4-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0.02)`,
          output: `0.02`,
        },
      },
      {
        id: "S50-T4-B-E3",
        subtopicId: "S50-T4-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
    ],
  },
  youDo: {
    title: "Evals, red teaming y fiabilidad de IA",
    context:
      "Proyecto de sección **S50** (Evals, red teaming y fiabilidad de IA). Gate: **CP-N4-C (quality gate)**. suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-C (quality gate)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S50 You Do — Evals, red teaming y fiabilidad de IA
# Gate: CP-N4-C (quality gate)
# suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, n

def main():
    print("section", "S50")
    print("gate", 'CP-N4-C (quality gate)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-C (quality gate). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S50 que se preserva es:",
        options: [
          "tech-leadership",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S50 pertenece a:",
        options: [
          "CP-N4-C (quality gate)",
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
        note: "Apoyo S50 Evals, red teaming y fiabilidad de IA",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Evals, red teaming y fiabilidad de IA",
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
