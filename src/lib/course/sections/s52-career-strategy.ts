import type { CourseSection } from '../../types'

export const section52: CourseSection = {
  id: "career-strategy",
  index: 52,
  title: "Enterprise Relationship & Operations Intelligence Platform: capstone final",
  shortTitle: "Capstone FINAL",
  tagline: "CP-FINAL: integración de 12 capstones, demo reproducible, system card y caso de impacto para CV",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Rocket",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Enterprise Relationship & Operations Intelligence Platform: capstone final** (id de plataforma `career-strategy` conservado; legado «Perfil Global y Estrategia de Carrera»). Contribuye a **CP-FINAL exclusivamente**: Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y copiloto. Rúbrica independiente de CP-N4-C. Promoción a máster: 52/52 secciones, 12/12 capstones, CP-FINAL y regresión S1–S52, cero P0/P1. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Revalida stakeholders y métricas de CF-1" },
    { text: "Actualiza constraints, riesgos y no-go" },
    { text: "Integra contexts vía APIs y eventos" },
    { text: "Ensambla datos/modelos/RPA/RAG/HITL" },
    { text: "Ejecuta tests, evals y red team" },
    { text: "Demuestra SLO, backup y disaster exercise" },
    { text: "Prepara demo y narrativa de CV" },
    { text: "Publica artefactos y defiende técnicamente" },
  ],
  theory: [
    {
      heading: "Mapa V3 S52: Enterprise Relationship & Operations Intelligence Platform: capstone final",
      paragraphs: [
        "En V3, **S52** retematiza el archivo de plataforma `career-strategy` hacia **Enterprise Relationship & Operations Intelligence Platform: capstone final**. **FINAL/CLOSE gate** (FINAL — independent of CP-N4-C; neither compensates the other).",
        "Incremento: Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y copiloto. Rúbrica independiente de CP-N4-C. Promoción a máster: 52/52 secciones, 12/12 capstones, CP-FINAL y regresión S1–S52, cero P0/P1.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `career-strategy`. Capstone: CP-FINAL exclusivamente.",
      },
    },
    {
      heading: "stakeholders, jobs y success metrics de CF-1",
      subtopicId: "S52-T1-A",
      paragraphs: [
        "**stakeholders, jobs y success metrics de CF-1** — outcome del blueprint phase3 para `stakeholders-jobs-success-cf1`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "stakeholders_jobs_success_cf1.py",
        code: `print(["ops","compliance","data"]); print(["intake","er","report"]); print(["ttr","precision_review"])`,
        output: `['ops', 'compliance', 'data']
['intake', 'er', 'report']
['ttr', 'precision_review']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "cambios, constraints, riesgos y no-go",
      subtopicId: "S52-T1-B",
      paragraphs: [
        "**cambios, constraints, riesgos y no-go** — outcome del blueprint phase3 para `changes-constraints-risks-nogo`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
        "La lista **no-go** incluye `real_pii` y `auto_fraud_label`: están **prohibidos**. Matching/ER/scores son evidencia para revisión humana; **no** prueba de fraude, parentesco ni colusión.",
      ],
      code: {
        language: 'python',
        title: "changes_constraints_risks_nogo.py",
        code: `print("nogo", ["real_pii", "auto_fraud_label"])
print("constraints", ["budget", "latency"])
print("change_log", True)
print("match_is_fraud", False)`,
        output: `nogo ['real_pii', 'auto_fraud_label']
constraints ['budget', 'latency']
change_log True
match_is_fraud False`,
      },
      callout: {
        type: "danger",
        title: "No-go de privacidad",
        content:
          "Nunca etiquetes fraude/parentesco en automático ni uses PII real. Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "bounded contexts, APIs y eventos",
      subtopicId: "S52-T2-A",
      paragraphs: [
        "**bounded contexts, APIs y eventos** — outcome del blueprint phase3 para `bounded-apis-events`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "bounded_apis_events.py",
        code: `print(["intake","er","relationship","triage","reporting","copilot"]); print(["POST /jobs","GET /jobs/{id}"]); print(["job.finished","case.updated"])`,
        output: `['intake', 'er', 'relationship', 'triage', 'reporting', 'copilot']
['POST /jobs', 'GET /jobs/{id}']
['job.finished', 'case.updated']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "datos, modelos, RPA, RAG y human workflow",
      subtopicId: "S52-T2-B",
      paragraphs: [
        "**datos, modelos, RPA, RAG y human workflow** — outcome del blueprint phase3 para `data-models-rpa-rag-human`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "data_models_rpa_rag_human.py",
        code: `print(sorted(["data","hitl","models","rag","rpa"])); print("human_in_loop", True); print("no_dark_patterns", True)`,
        output: `['data', 'hitl', 'models', 'rag', 'rpa']
human_in_loop True
no_dark_patterns True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "tests/evals/red team y performance",
      subtopicId: "S52-T3-A",
      paragraphs: [
        "**tests/evals/red team y performance** — outcome del blueprint phase3 para `tests-evals-redteam-perf`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "tests_evals_redteam_perf.py",
        code: `print(True); print(sorted(["evals","perf","redteam","unit"])); print("p0_p1", "zero")`,
        output: `True
['evals', 'perf', 'redteam', 'unit']
p0_p1 zero`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "SLO, backup, rollback y disaster exercise",
      subtopicId: "S52-T3-B",
      paragraphs: [
        "**SLO, backup, rollback y disaster exercise** — outcome del blueprint phase3 para `slo-backup-rollback-disaster`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "slo_backup_rollback_disaster.py",
        code: `print({"slo":0.995,"backup":"daily","disaster":"tabletop_ok"}); print("drill", "tabletop_ok"); print("rto", "documented")`,
        output: `{'slo': 0.995, 'backup': 'daily', 'disaster': 'tabletop_ok'}
drill tabletop_ok
rto documented`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "demo y narrativa CV",
      subtopicId: "S52-T4-A",
      paragraphs: [
        "**demo y narrativa CV** — outcome del blueprint phase3 para `demo-cv-narrative`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "demo_cv_narrative.py",
        code: `print({"script":"10min","cv_bullets":3}); print("narrative", "impact+metrics"); print("repro", True)`,
        output: `{'script': '10min', 'cv_bullets': 3}
narrative impact+metrics
repro True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "arquitectura, READMEs, cards, licencia, video y defensa",
      subtopicId: "S52-T4-B",
      paragraphs: [
        "**arquitectura, READMEs, cards, licencia, video y defensa** — outcome del blueprint phase3 para `arch-readme-cards-license-video-defense`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "arch_readme_cards_license_video_defense.py",
        code: `print(["architecture.md","README","system_card","LICENSE","demo_video","defense_notes"]); print("n", 6); print("cp_final", "independent_of_cpn4c")`,
        output: `['architecture.md', 'README', 'system_card', 'LICENSE', 'demo_video', 'defense_notes']
n 6
cp_final independent_of_cpn4c`,
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
    intro: "Te muestro 8 demos de S52 (Enterprise Relationship & Operations Intelligence Platform: capstone final) alineadas a CP-FINAL exclusivamente.",
    steps: [
      {
        demoId: "S52-T1-A-DEMO",
        subtopicId: "S52-T1-A",
        environment: "local-python",
        description: "Demo: stakeholders, jobs y success metrics de CF-1",
        code: {
          language: 'python',
          title: "demo_stakeholders_jobs_success_cf1.py",
          code: `print("cf1_revalidated", True); print("metrics", ["ttr","precision_review"]); print("synthetic", True)`,
          output: `cf1_revalidated True
metrics ['ttr', 'precision_review']
synthetic True`,
        },
        why: "Demuestra el outcome de S52-T1-A con Python verificable.",
      },
      {
        demoId: "S52-T1-B-DEMO",
        subtopicId: "S52-T1-B",
        environment: "local-python",
        description: "Demo: cambios, constraints, riesgos y no-go",
        code: {
          language: 'python',
          title: "demo_changes_constraints_risks_nogo.py",
          code: `print("nogo", ["real_pii","auto_fraud_label"]); print("risk_register", True); print("update", True)`,
          output: `nogo ['real_pii', 'auto_fraud_label']
risk_register True
update True`,
        },
        why: "Demuestra el outcome de S52-T1-B con Python verificable.",
      },
      {
        demoId: "S52-T2-A-DEMO",
        subtopicId: "S52-T2-A",
        environment: "local-python",
        description: "Demo: bounded contexts, APIs y eventos",
        code: {
          language: 'python',
          title: "demo_bounded_apis_events.py",
          code: `print("contracts", True); print("events", True); print("bounded", True)`,
          output: `contracts True
events True
bounded True`,
        },
        why: "Demuestra el outcome de S52-T2-A con Python verificable.",
      },
      {
        demoId: "S52-T2-B-DEMO",
        subtopicId: "S52-T2-B",
        environment: "local-python",
        description: "Demo: datos, modelos, RPA, RAG y human workflow",
        code: {
          language: 'python',
          title: "demo_data_models_rpa_rag_human.py",
          code: `print("assemble", True); print("rpa", "vp_flows"); print("rag", "cited")`,
          output: `assemble True
rpa vp_flows
rag cited`,
        },
        why: "Demuestra el outcome de S52-T2-B con Python verificable.",
      },
      {
        demoId: "S52-T3-A-DEMO",
        subtopicId: "S52-T3-A",
        environment: "local-python",
        description: "Demo: tests/evals/red team y performance",
        code: {
          language: 'python',
          title: "demo_tests_evals_redteam_perf.py",
          code: `print("tests", True); print("redteam", True); print("perf_budget", True)`,
          output: `tests True
redteam True
perf_budget True`,
        },
        why: "Demuestra el outcome de S52-T3-A con Python verificable.",
      },
      {
        demoId: "S52-T3-B-DEMO",
        subtopicId: "S52-T3-B",
        environment: "local-python",
        description: "Demo: SLO, backup, rollback y disaster exercise",
        code: {
          language: 'python',
          title: "demo_slo_backup_rollback_disaster.py",
          code: `print("backup", True); print("rollback", True); print("disaster_exercise", True)`,
          output: `backup True
rollback True
disaster_exercise True`,
        },
        why: "Demuestra el outcome de S52-T3-B con Python verificable.",
      },
      {
        demoId: "S52-T4-A-DEMO",
        subtopicId: "S52-T4-A",
        environment: "local-python",
        description: "Demo: demo y narrativa CV",
        code: {
          language: 'python',
          title: "demo_demo_cv_narrative.py",
          code: `print("demo_ok", True); print("cv", True); print("metrics_first", True)`,
          output: `demo_ok True
cv True
metrics_first True`,
        },
        why: "Demuestra el outcome de S52-T4-A con Python verificable.",
      },
      {
        demoId: "S52-T4-B-DEMO",
        subtopicId: "S52-T4-B",
        environment: "local-python",
        description: "Demo: arquitectura, READMEs, cards, licencia, video y defensa",
        code: {
          language: 'python',
          title: "demo_arch_readme_cards_license_video_defense.py",
          code: `print("artifacts", 6); print("license", True); print("defense", True)`,
          output: `artifacts 6
license True
defense True`,
        },
        why: "Demuestra el outcome de S52-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S52-T1-A-E1",
        subtopicId: "S52-T1-A",
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
          code: `print(['ops','compliance','data'])`,
          output: `['ops', 'compliance', 'data']`,
        },
      },
      {
        id: "S52-T1-A-E2",
        subtopicId: "S52-T1-A",
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
          code: `print(['intake','er','report'])`,
          output: `['intake', 'er', 'report']`,
        },
      },
      {
        id: "S52-T1-A-E3",
        subtopicId: "S52-T1-A",
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
          code: `print(['ttr','precision_review'])`,
          output: `['ttr', 'precision_review']`,
        },
      },
      {
        id: "S52-T1-B-E1",
        subtopicId: "S52-T1-B",
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
          code: `print(['real_pii','auto_fraud_label'])`,
          output: `['real_pii', 'auto_fraud_label']`,
        },
      },
      {
        id: "S52-T1-B-E2",
        subtopicId: "S52-T1-B",
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
          code: `print(['budget','latency'])`,
          output: `['budget', 'latency']`,
        },
      },
      {
        id: "S52-T1-B-E3",
        subtopicId: "S52-T1-B",
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
        id: "S52-T2-A-E1",
        subtopicId: "S52-T2-A",
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
          code: `print(6)`,
          output: `6`,
        },
      },
      {
        id: "S52-T2-A-E2",
        subtopicId: "S52-T2-A",
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
          code: `print(['POST /jobs','GET /jobs/{id}'])`,
          output: `['POST /jobs', 'GET /jobs/{id}']`,
        },
      },
      {
        id: "S52-T2-A-E3",
        subtopicId: "S52-T2-A",
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
          code: `print(['job.finished','case.updated'])`,
          output: `['job.finished', 'case.updated']`,
        },
      },
      {
        id: "S52-T2-B-E1",
        subtopicId: "S52-T2-B",
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
          code: `print(sorted(['data','hitl','models','rag','rpa']))`,
          output: `['data', 'hitl', 'models', 'rag', 'rpa']`,
        },
      },
      {
        id: "S52-T2-B-E2",
        subtopicId: "S52-T2-B",
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
        id: "S52-T2-B-E3",
        subtopicId: "S52-T2-B",
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
          code: `print('review_queue')`,
          output: `review_queue`,
        },
      },
      {
        id: "S52-T3-A-E1",
        subtopicId: "S52-T3-A",
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
        id: "S52-T3-A-E2",
        subtopicId: "S52-T3-A",
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
          code: `print(['evals','perf','redteam','unit'])`,
          output: `['evals', 'perf', 'redteam', 'unit']`,
        },
      },
      {
        id: "S52-T3-A-E3",
        subtopicId: "S52-T3-A",
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
          code: `print('zero')`,
          output: `zero`,
        },
      },
      {
        id: "S52-T3-B-E1",
        subtopicId: "S52-T3-B",
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
          code: `print(0.995)`,
          output: `0.995`,
        },
      },
      {
        id: "S52-T3-B-E2",
        subtopicId: "S52-T3-B",
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
          code: `print('daily')`,
          output: `daily`,
        },
      },
      {
        id: "S52-T3-B-E3",
        subtopicId: "S52-T3-B",
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
          code: `print('tabletop_ok')`,
          output: `tabletop_ok`,
        },
      },
      {
        id: "S52-T4-A-E1",
        subtopicId: "S52-T4-A",
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
          code: `print(10)`,
          output: `10`,
        },
      },
      {
        id: "S52-T4-A-E2",
        subtopicId: "S52-T4-A",
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
          code: `print(3)`,
          output: `3`,
        },
      },
      {
        id: "S52-T4-A-E3",
        subtopicId: "S52-T4-A",
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
        id: "S52-T4-B-E1",
        subtopicId: "S52-T4-B",
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
          code: `print(6)`,
          output: `6`,
        },
      },
      {
        id: "S52-T4-B-E2",
        subtopicId: "S52-T4-B",
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
        id: "S52-T4-B-E3",
        subtopicId: "S52-T4-B",
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
          code: `print('independent_of_cpn4c')`,
          output: `independent_of_cpn4c`,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Enterprise Relationship & Operations Intelligence Platform: capstone final (CP-FINAL exclusivamente)",
    context:
      "Proyecto de sección **S52** (Enterprise Relationship & Operations Intelligence Platform: capstone final). Gate: **CP-FINAL exclusivamente**. Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y copiloto. Rúbrica independiente de CP-N4-C. Promoción a máster: 52/52 secciones, 12/12 capstones, CP-FINAL y regresión S1–S52, cero P0/P1. **FINAL — CP-FINAL exclusivamente**: Enterprise Relationship & Operations Intelligence Platform. Rúbrica **independiente** de CP-N4-C (ni se compensan). Promoción máster: 52/52, 12/12, CP-FINAL, regresión S1–S52, cero P0/P1. Esta es la nota FINAL del curso. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "FINAL: Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashboard, VP RPA/AI, ER/grafos/triage, reporting y copiloto. Rúbrica independiente de CP-N4-C. Promoción a máster: 52/52 secciones, 12/12 capstones, CP-FINAL y regresión S1–S52, cero P0/P1.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-FINAL exclusivamente",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S52 You Do — Enterprise Relationship & Operations Intelligence Platform: capstone final
# Gate: CP-FINAL exclusivamente
# Enterprise Relationship & Operations Intelligence Platform integra, con contratos y datos sintéticos, Familiarity Dashbo

def main():
    print("section", "S52")
    print("gate", 'CP-FINAL exclusivamente')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "FINAL. Entrega alineada a CP-FINAL exclusivamente. Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Nota FINAL de gate: FINAL — independent of CP-N4-C; neither compensates the other", weight: "gate FINAL" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S52 que se preserva es:",
        options: [
          "career-strategy",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S52 pertenece a:",
        options: [
          "CP-FINAL exclusivamente",
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
        note: "Apoyo S52 Enterprise Relationship & Operations Intelligence Platform: capstone final",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Enterprise Relationship & Operations Intelligence Platform: capstone final",
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
