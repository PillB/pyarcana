import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: "opensource",
  index: 47,
  title: "MLOps: experimentos, registro y serving",
  shortTitle: "MLOps serving",
  tagline: "Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4",
  estimatedHours: 16,
  level: "Master",
  phase: 3,
  icon: "Github",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **MLOps: experimentos, registro y serving** (id de plataforma `opensource` conservado; legado «Contribución Open Source y Diseño de APIs Públicas»). Contribuye a **CP-N4-B (cierre) + CF-4**: Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta desplegable de los capstones previos. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Trackea experimentos reproducibles" },
    { text: "Compara runs con lineage completo" },
    { text: "Registra con stages y approvals" },
    { text: "Publica artefactos y compatibilidad" },
    { text: "Sirve batch/online con features consistentes" },
    { text: "Controla latency, batching y fallback" },
    { text: "Despliega shadow/canary con monitoring" },
    { text: "Revierte, retira y audita modelos" },
  ],
  theory: [
    {
      heading: "Mapa V3 S47: MLOps: experimentos, registro y serving",
      paragraphs: [
        "En V3, **S47** retematiza el archivo de plataforma `opensource` hacia **MLOps: experimentos, registro y serving**. **FINAL/CLOSE gate** (CLOSE + CF-4).",
        "Incremento: Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta desplegable de los capstones previos.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `opensource`. Capstone: CP-N4-B (cierre) + CF-4.",
      },
    },
    {
      heading: "tracking y reproducibilidad",
      subtopicId: "S47-T1-A",
      paragraphs: [
        "**tracking y reproducibilidad** — outcome del blueprint phase3 para `tracking-reproducibility`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "tracking_reproducibility.py",
        code: `print("r1"); print({"f1":0.81}); print("repro", 42)`,
        output: `r1
{'f1': 0.81}
repro 42`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "data/code/env lineage y comparación",
      subtopicId: "S47-T1-B",
      paragraphs: [
        "**data/code/env lineage y comparación** — outcome del blueprint phase3 para `data-code-env-lineage-compare`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "data_code_env_lineage_compare.py",
        code: `print({"data":"ds-v3","code":"git:abc","env":"locked"}); print("compare", ["f1","latency"]); print("diff", True)`,
        output: `{'data': 'ds-v3', 'code': 'git:abc', 'env': 'locked'}
compare ['f1', 'latency']
diff True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "firmas, stages y approvals",
      subtopicId: "S47-T2-A",
      paragraphs: [
        "**firmas, stages y approvals** — outcome del blueprint phase3 para `signatures-stages-approvals`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "signatures_stages_approvals.py",
        code: `print({"stage":"Staging","approvals":["ml-lead"]}); print("signature", "required"); print("prod_gate", True)`,
        output: `{'stage': 'Staging', 'approvals': ['ml-lead']}
signature required
prod_gate True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "artefactos, model card y compatibilidad",
      subtopicId: "S47-T2-B",
      paragraphs: [
        "**artefactos, model card y compatibilidad** — outcome del blueprint phase3 para `artifacts-card-compat`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "artifacts_card_compat.py",
        code: `print({"model":"er-ranker","version":"1.2.0"}); print("artifact", "model.pkl"); print("card_required", True)`,
        output: `{'model': 'er-ranker', 'version': '1.2.0'}
artifact model.pkl
card_required True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "batch/online y feature consistency",
      subtopicId: "S47-T3-A",
      paragraphs: [
        "**batch/online y feature consistency** — outcome del blueprint phase3 para `batch-online-feature-consistency`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "batch_online_feature_consistency.py",
        code: `print("consistent", True); print("modes", ["batch","online"]); print("skew_risk", "watch")`,
        output: `consistent True
modes ['batch', 'online']
skew_risk watch`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "latency, batching y fallback",
      subtopicId: "S47-T3-B",
      paragraphs: [
        "**latency, batching y fallback** — outcome del blueprint phase3 para `latency-batching-fallback`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "latency_batching_fallback.py",
        code: `print({"p95_ms":50,"fallback":"rules"}); print("on_timeout", "rules"); print("batching", True)`,
        output: `{'p95_ms': 50, 'fallback': 'rules'}
on_timeout rules
batching True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "shadow/canary y monitoring hooks",
      subtopicId: "S47-T4-A",
      paragraphs: [
        "**shadow/canary y monitoring hooks** — outcome del blueprint phase3 para `shadow-canary-monitoring`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "shadow_canary_monitoring.py",
        code: `print("shadow"); print(["f1","latency","drift"]); print("canary_next", True)`,
        output: `shadow
['f1', 'latency', 'drift']
canary_next True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "rollback, retirement y audit",
      subtopicId: "S47-T4-B",
      paragraphs: [
        "**rollback, retirement y audit** — outcome del blueprint phase3 para `rollback-retire-audit`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (cierre) + CF-4** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "rollback_retire_audit.py",
        code: `print({"action":"rollback","to":"1.1.0"}); print("decisions_kept", True); print("cf4", "deployable_path")`,
        output: `{'action': 'rollback', 'to': '1.1.0'}
decisions_kept True
cf4 deployable_path`,
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
    intro: "Te muestro 8 demos de S47 (MLOps: experimentos, registro y serving) alineadas a CP-N4-B (cierre) + CF-4.",
    steps: [
      {
        demoId: "S47-T1-A-DEMO",
        subtopicId: "S47-T1-A",
        environment: "local-python",
        description: "Demo: tracking y reproducibilidad",
        code: {
          language: 'python',
          title: "demo_tracking_reproducibility.py",
          code: `print("tracking", "mlflow_like"); print("params", True); print("seed", 42)`,
          output: `tracking mlflow_like
params True
seed 42`,
        },
        why: "Demuestra el outcome de S47-T1-A con Python verificable.",
      },
      {
        demoId: "S47-T1-B-DEMO",
        subtopicId: "S47-T1-B",
        environment: "local-python",
        description: "Demo: data/code/env lineage y comparación",
        code: {
          language: 'python',
          title: "demo_data_code_env_lineage_compare.py",
          code: `print("data", "ds-v3"); print("code", "git:abc"); print("env", "locked")`,
          output: `data ds-v3
code git:abc
env locked`,
        },
        why: "Demuestra el outcome de S47-T1-B con Python verificable.",
      },
      {
        demoId: "S47-T2-A-DEMO",
        subtopicId: "S47-T2-A",
        environment: "local-python",
        description: "Demo: firmas, stages y approvals",
        code: {
          language: 'python',
          title: "demo_signatures_stages_approvals.py",
          code: `print("stage", "Staging"); print("approve", True); print("signature", True)`,
          output: `stage Staging
approve True
signature True`,
        },
        why: "Demuestra el outcome de S47-T2-A con Python verificable.",
      },
      {
        demoId: "S47-T2-B-DEMO",
        subtopicId: "S47-T2-B",
        environment: "local-python",
        description: "Demo: artefactos, model card y compatibilidad",
        code: {
          language: 'python',
          title: "demo_artifacts_card_compat.py",
          code: `print("compat", "features_v3"); print("version", "1.2.0"); print("artifact_hash", True)`,
          output: `compat features_v3
version 1.2.0
artifact_hash True`,
        },
        why: "Demuestra el outcome de S47-T2-B con Python verificable.",
      },
      {
        demoId: "S47-T3-A-DEMO",
        subtopicId: "S47-T3-A",
        environment: "local-python",
        description: "Demo: batch/online y feature consistency",
        code: {
          language: 'python',
          title: "demo_batch_online_feature_consistency.py",
          code: `print("batch", True); print("online", True); print("same_codepath", True)`,
          output: `batch True
online True
same_codepath True`,
        },
        why: "Demuestra el outcome de S47-T3-A con Python verificable.",
      },
      {
        demoId: "S47-T3-B-DEMO",
        subtopicId: "S47-T3-B",
        environment: "local-python",
        description: "Demo: latency, batching y fallback",
        code: {
          language: 'python',
          title: "demo_latency_batching_fallback.py",
          code: `print("latency_ok", True); print("fallback", "rules"); print("batch", 32)`,
          output: `latency_ok True
fallback rules
batch 32`,
        },
        why: "Demuestra el outcome de S47-T3-B con Python verificable.",
      },
      {
        demoId: "S47-T4-A-DEMO",
        subtopicId: "S47-T4-A",
        environment: "local-python",
        description: "Demo: shadow/canary y monitoring hooks",
        code: {
          language: 'python',
          title: "demo_shadow_canary_monitoring.py",
          code: `print("shadow", True); print("hooks", True); print("promote_if", "gates_green")`,
          output: `shadow True
hooks True
promote_if gates_green`,
        },
        why: "Demuestra el outcome de S47-T4-A con Python verificable.",
      },
      {
        demoId: "S47-T4-B-DEMO",
        subtopicId: "S47-T4-B",
        environment: "local-python",
        description: "Demo: rollback, retirement y audit",
        code: {
          language: 'python',
          title: "demo_rollback_retire_audit.py",
          code: `print("rollback", "1.1.0"); print("retire", "1.0.0"); print("audit", True)`,
          output: `rollback 1.1.0
retire 1.0.0
audit True`,
        },
        why: "Demuestra el outcome de S47-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S47-T1-A-E1",
        subtopicId: "S47-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S47-T1-A-E1: usa el patrón del demo iDo del subtema S47-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("tracking", "mlflow_like"); print("params", True); print("seed", 42)`,
          output: `tracking mlflow_like
params True
seed 42`,
        },
      },
      {
        id: "S47-T1-A-E2",
        subtopicId: "S47-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S47-T1-A-E2: usa el patrón del demo iDo del subtema S47-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("tracking", "mlflow_like"); print("params", True); print("seed", 42)`,
          output: `tracking mlflow_like
params True
seed 42`,
        },
      },
      {
        id: "S47-T1-A-E3",
        subtopicId: "S47-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T1-A-E3: usa el patrón del demo iDo del subtema S47-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("tracking", "mlflow_like"); print("params", True); print("seed", 42)`,
          output: `tracking mlflow_like
params True
seed 42`,
        },
      },
      {
        id: "S47-T1-B-E1",
        subtopicId: "S47-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S47-T1-B-E1: usa el patrón del demo iDo del subtema S47-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("data", "ds-v3"); print("code", "git:abc"); print("env", "locked")`,
          output: `data ds-v3
code git:abc
env locked`,
        },
      },
      {
        id: "S47-T1-B-E2",
        subtopicId: "S47-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S47-T1-B-E2: usa el patrón del demo iDo del subtema S47-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("data", "ds-v3"); print("code", "git:abc"); print("env", "locked")`,
          output: `data ds-v3
code git:abc
env locked`,
        },
      },
      {
        id: "S47-T1-B-E3",
        subtopicId: "S47-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T1-B-E3: usa el patrón del demo iDo del subtema S47-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("data", "ds-v3"); print("code", "git:abc"); print("env", "locked")`,
          output: `data ds-v3
code git:abc
env locked`,
        },
      },
      {
        id: "S47-T2-A-E1",
        subtopicId: "S47-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S47-T2-A-E1: usa el patrón del demo iDo del subtema S47-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("stage", "Staging"); print("approve", True); print("signature", True)`,
          output: `stage Staging
approve True
signature True`,
        },
      },
      {
        id: "S47-T2-A-E2",
        subtopicId: "S47-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S47-T2-A-E2: usa el patrón del demo iDo del subtema S47-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("stage", "Staging"); print("approve", True); print("signature", True)`,
          output: `stage Staging
approve True
signature True`,
        },
      },
      {
        id: "S47-T2-A-E3",
        subtopicId: "S47-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T2-A-E3: usa el patrón del demo iDo del subtema S47-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("stage", "Staging"); print("approve", True); print("signature", True)`,
          output: `stage Staging
approve True
signature True`,
        },
      },
      {
        id: "S47-T2-B-E1",
        subtopicId: "S47-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S47-T2-B-E1: usa el patrón del demo iDo del subtema S47-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compat", "features_v3"); print("version", "1.2.0"); print("artifact_hash", True)`,
          output: `compat features_v3
version 1.2.0
artifact_hash True`,
        },
      },
      {
        id: "S47-T2-B-E2",
        subtopicId: "S47-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S47-T2-B-E2: usa el patrón del demo iDo del subtema S47-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compat", "features_v3"); print("version", "1.2.0"); print("artifact_hash", True)`,
          output: `compat features_v3
version 1.2.0
artifact_hash True`,
        },
      },
      {
        id: "S47-T2-B-E3",
        subtopicId: "S47-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T2-B-E3: usa el patrón del demo iDo del subtema S47-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("compat", "features_v3"); print("version", "1.2.0"); print("artifact_hash", True)`,
          output: `compat features_v3
version 1.2.0
artifact_hash True`,
        },
      },
      {
        id: "S47-T3-A-E1",
        subtopicId: "S47-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S47-T3-A-E1: usa el patrón del demo iDo del subtema S47-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("batch", True); print("online", True); print("same_codepath", True)`,
          output: `batch True
online True
same_codepath True`,
        },
      },
      {
        id: "S47-T3-A-E2",
        subtopicId: "S47-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S47-T3-A-E2: usa el patrón del demo iDo del subtema S47-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("batch", True); print("online", True); print("same_codepath", True)`,
          output: `batch True
online True
same_codepath True`,
        },
      },
      {
        id: "S47-T3-A-E3",
        subtopicId: "S47-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T3-A-E3: usa el patrón del demo iDo del subtema S47-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("batch", True); print("online", True); print("same_codepath", True)`,
          output: `batch True
online True
same_codepath True`,
        },
      },
      {
        id: "S47-T3-B-E1",
        subtopicId: "S47-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S47-T3-B-E1: usa el patrón del demo iDo del subtema S47-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("latency_ok", True); print("fallback", "rules"); print("batch", 32)`,
          output: `latency_ok True
fallback rules
batch 32`,
        },
      },
      {
        id: "S47-T3-B-E2",
        subtopicId: "S47-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S47-T3-B-E2: usa el patrón del demo iDo del subtema S47-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("latency_ok", True); print("fallback", "rules"); print("batch", 32)`,
          output: `latency_ok True
fallback rules
batch 32`,
        },
      },
      {
        id: "S47-T3-B-E3",
        subtopicId: "S47-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T3-B-E3: usa el patrón del demo iDo del subtema S47-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("latency_ok", True); print("fallback", "rules"); print("batch", 32)`,
          output: `latency_ok True
fallback rules
batch 32`,
        },
      },
      {
        id: "S47-T4-A-E1",
        subtopicId: "S47-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S47-T4-A-E1: usa el patrón del demo iDo del subtema S47-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("shadow", True); print("hooks", True); print("promote_if", "gates_green")`,
          output: `shadow True
hooks True
promote_if gates_green`,
        },
      },
      {
        id: "S47-T4-A-E2",
        subtopicId: "S47-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S47-T4-A-E2: usa el patrón del demo iDo del subtema S47-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("shadow", True); print("hooks", True); print("promote_if", "gates_green")`,
          output: `shadow True
hooks True
promote_if gates_green`,
        },
      },
      {
        id: "S47-T4-A-E3",
        subtopicId: "S47-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T4-A-E3: usa el patrón del demo iDo del subtema S47-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("shadow", True); print("hooks", True); print("promote_if", "gates_green")`,
          output: `shadow True
hooks True
promote_if gates_green`,
        },
      },
      {
        id: "S47-T4-B-E1",
        subtopicId: "S47-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S47-T4-B-E1: usa el patrón del demo iDo del subtema S47-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("rollback", "1.1.0"); print("retire", "1.0.0"); print("audit", True)`,
          output: `rollback 1.1.0
retire 1.0.0
audit True`,
        },
      },
      {
        id: "S47-T4-B-E2",
        subtopicId: "S47-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S47-T4-B-E2: usa el patrón del demo iDo del subtema S47-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S47-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("rollback", "1.1.0"); print("retire", "1.0.0"); print("audit", True)`,
          output: `rollback 1.1.0
retire 1.0.0
audit True`,
        },
      },
      {
        id: "S47-T4-B-E3",
        subtopicId: "S47-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S47-T4-B-E3: usa el patrón del demo iDo del subtema S47-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S47-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S47-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: escribe el print final como en el demo iDo del mismo subtopicId
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("rollback", "1.1.0"); print("retire", "1.0.0"); print("audit", True)`,
          output: `rollback 1.1.0
retire 1.0.0
audit True`,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] MLOps: experimentos, registro y serving (CP-N4-B (cierre) + CF-4)",
    context:
      "Proyecto de sección **S47** (MLOps: experimentos, registro y serving). Gate: **CP-N4-B (cierre) + CF-4**. Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta desplegable de los capstones previos. **FINAL — CP-N4-B CLOSE + CF-4**: Production Data/ML Platform (experimento→servicio con gates, lineage y rollback). CF-4 valida ruta desplegable. Nota FINAL de cierre N4-B. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "FINAL: Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revierte sin perder decisiones. CF-4 valida la ruta desplegable de los capstones previos.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-B (cierre) + CF-4",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S47 You Do — MLOps: experimentos, registro y serving
# Gate: CP-N4-B (cierre) + CF-4
# Production Data/ML Platform promueve un modelo desde experimento hasta servicio solo tras gates, conserva lineage y revi

def main():
    print("section", "S47")
    print("gate", 'CP-N4-B (cierre) + CF-4')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "FINAL. Entrega alineada a CP-N4-B (cierre) + CF-4. Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Nota FINAL de gate: CLOSE + CF-4", weight: "gate FINAL" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S47 que se preserva es:",
        options: [
          "opensource",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S47 pertenece a:",
        options: [
          "CP-N4-B (cierre) + CF-4",
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
        note: "Apoyo S47 MLOps: experimentos, registro y serving",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a MLOps: experimentos, registro y serving",
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
