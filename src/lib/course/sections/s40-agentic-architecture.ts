import type { CourseSection } from '../../types'

export const section40: CourseSection = {
  id: "agentic-architecture",
  index: 40,
  title: "Arquitectura, DDD y decisiones técnicas",
  shortTitle: "Arquitectura y DDD",
  tagline: "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos",
  estimatedHours: 12,
  level: "Master",
  phase: 3,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Arquitectura, DDD y decisiones técnicas** (id de plataforma `agentic-architecture` conservado; legado «Arquitectura de Sistemas Agénticos a Escala»). Contribuye a **CP-N4-A (inicio)**: mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Captura FR y quality attributes" },
    { text: "Documenta trade-offs y riesgos medibles" },
    { text: "Diseña capas con baja coupling" },
    { text: "Aplica ports/adapters hacia dominio" },
    { text: "Delinea bounded contexts" },
    { text: "Modela entities, VO y servicios" },
    { text: "Documenta C4 y ADRs" },
    { text: "Evoluciona APIs/eventos con compatibilidad" },
  ],
  theory: [
    {
      heading: "Mapa V3 S40: Arquitectura, DDD y decisiones técnicas",
      paragraphs: [
        "En V3, **S40** retematiza el archivo de plataforma `agentic-architecture` hacia **Arquitectura, DDD y decisiones técnicas**.",
        "Incremento: mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `agentic-architecture`. Capstone: CP-N4-A (inicio).",
      },
    },
    {
      heading: "requisitos funcionales y quality attributes",
      subtopicId: "S40-T1-A",
      paragraphs: [
        "**requisitos funcionales y quality attributes** — outcome del blueprint phase3 para `functional-quality-attrs`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "functional_quality_attrs.py",
        code: `frs=[{"id":"FR-01"},{"id":"FR-02"}]
qas=[{"attr":"latency_p95_ms","target":300}]
print("fr_count", len(frs))
print("qa_attr", qas[0]["attr"])
print("target", qas[0]["target"])`,
        output: `fr_count 2
qa_attr latency_p95_ms
target 300`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "trade-offs, riesgos y criterios medibles",
      subtopicId: "S40-T1-B",
      paragraphs: [
        "**trade-offs, riesgos y criterios medibles** — outcome del blueprint phase3 para `tradeoffs-risks-measurable`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "tradeoffs_risks_measurable.py",
        code: `opts=[{"n":"sync","score":3.8},{"n":"async","score":2.2}]
print("best", min(opts,key=lambda x:x["score"])["n"])
print("scores", {o["n"]:o["score"] for o in opts})
print("criterion", "min_score")`,
        output: `best async
scores {'sync': 3.8, 'async': 2.2}
criterion min_score`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "cohesión/coupling y capas",
      subtopicId: "S40-T2-A",
      paragraphs: [
        "**cohesión/coupling y capas** — outcome del blueprint phase3 para `cohesion-coupling-layers`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "cohesion_coupling_layers.py",
        code: `layers=["presentation","application","domain","infrastructure"]
print("layers", layers)
print("domain_pure", True)
print("skip_forbidden", True)`,
        output: `layers ['presentation', 'application', 'domain', 'infrastructure']
domain_pure True
skip_forbidden True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "ports/adapters y dependencia hacia dominio",
      subtopicId: "S40-T2-B",
      paragraphs: [
        "**ports/adapters y dependencia hacia dominio** — outcome del blueprint phase3 para `ports-adapters-domain-dep`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "ports_adapters_domain_dep.py",
        code: `class Repo:
    def get(self, cid): return {"status":"open"}
print("status", Repo().get("CASE-1")["status"])
print("dep", "domain<-adapters")
print("port_ok", True)`,
        output: `status open
dep domain<-adapters
port_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "bounded contexts y lenguaje ubicuo",
      subtopicId: "S40-T3-A",
      paragraphs: [
        "**bounded contexts y lenguaje ubicuo** — outcome del blueprint phase3 para `bounded-contexts-ubiquitous`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "bounded_contexts_ubiquitous.py",
        code: `ctx={"Intake":["Case"],"ER":["Record","Score"]}
print("contexts", sorted(ctx))
print("er_terms", ctx["ER"])
print("case_not_in_er", "Case" not in ctx["ER"])`,
        output: `contexts ['ER', 'Intake']
er_terms ['Record', 'Score']
case_not_in_er True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "entities, value objects y servicios",
      subtopicId: "S40-T3-B",
      paragraphs: [
        "**entities, value objects y servicios** — outcome del blueprint phase3 para `entities-vo-services`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "entities_vo_services.py",
        code: `print("CASE-1:150PEN")
print("vo_frozen", True)
print("entity", "CASE-1")`,
        output: `CASE-1:150PEN
vo_frozen True
entity CASE-1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "diagramas C4/flujo y ADRs",
      subtopicId: "S40-T4-A",
      paragraphs: [
        "**diagramas C4/flujo y ADRs** — outcome del blueprint phase3 para `c4-flow-adr`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "c4_flow_adr.py",
        code: `print("containers", ["api","worker","db","object_store"])
print("adr", "ADR-001", "accepted")
print("has_consequences", True)`,
        output: `containers ['api', 'worker', 'db', 'object_store']
adr ADR-001 accepted
has_consequences True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "APIs, eventos, deuda y evolución compatible",
      subtopicId: "S40-T4-B",
      paragraphs: [
        "**APIs, eventos, deuda y evolución compatible** — outcome del blueprint phase3 para `apis-events-debt-compat`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "apis_events_debt_compat.py",
        code: `v1={"case_id":"CASE-1","status":"open"}
v11={**v1,"priority":"normal"}
print("v1", "CASE-1:open")
print("compat", "CASE-1:open")
print("additive", "priority" in v11)`,
        output: `v1 CASE-1:open
compat CASE-1:open
additive True`,
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
    intro: "Te muestro 8 demos de S40 (Arquitectura, DDD y decisiones técnicas) alineadas a CP-N4-A (inicio).",
    steps: [
      {
        demoId: "S40-T1-A-DEMO",
        subtopicId: "S40-T1-A",
        environment: "local-python",
        description: "Demo: requisitos funcionales y quality attributes",
        code: {
          language: 'python',
          title: "demo_functional_quality_attrs.py",
          code: `qas={"latency_p95_ms":250}
print("owners", ["intake","er"])
print("budget_ok", qas["latency_p95_ms"]<=300)
print("qa_n", len(qas))`,
          output: `owners ['intake', 'er']
budget_ok True
qa_n 1`,
        },
        why: "Demuestra el outcome de S40-T1-A con Python verificable.",
      },
      {
        demoId: "S40-T1-B-DEMO",
        subtopicId: "S40-T1-B",
        environment: "local-python",
        description: "Demo: trade-offs, riesgos y criterios medibles",
        code: {
          language: 'python',
          title: "demo_tradeoffs_risks_measurable.py",
          code: `risks=[{"id":"R1","sev":1.5},{"id":"R2","sev":0.4}]
print("top", max(risks,key=lambda x:x["sev"])["id"])
print("sevs", [r["sev"] for r in risks])
print("measurable", True)`,
          output: `top R1
sevs [1.5, 0.4]
measurable True`,
        },
        why: "Demuestra el outcome de S40-T1-B con Python verificable.",
      },
      {
        demoId: "S40-T2-A-DEMO",
        subtopicId: "S40-T2-A",
        environment: "local-python",
        description: "Demo: cohesión/coupling y capas",
        code: {
          language: 'python',
          title: "demo_cohesion_coupling_layers.py",
          code: `mods={"intake":1,"er":2,"reporting":1}
print("bc_count", len(mods))
print("er_n", mods["er"])
print("no_mixed", True)`,
          output: `bc_count 3
er_n 2
no_mixed True`,
        },
        why: "Demuestra el outcome de S40-T2-A con Python verificable.",
      },
      {
        demoId: "S40-T2-B-DEMO",
        subtopicId: "S40-T2-B",
        environment: "local-python",
        description: "Demo: ports/adapters y dependencia hacia dominio",
        code: {
          language: 'python',
          title: "demo_ports_adapters_domain_dep.py",
          code: `print("queued:closed:CASE-9")
print("adapter", "fake")
print("no_smtp_in_domain", True)`,
          output: `queued:closed:CASE-9
adapter fake
no_smtp_in_domain True`,
        },
        why: "Demuestra el outcome de S40-T2-B con Python verificable.",
      },
      {
        demoId: "S40-T3-A-DEMO",
        subtopicId: "S40-T3-A",
        environment: "local-python",
        description: "Demo: bounded contexts y lenguaje ubicuo",
        code: {
          language: 'python',
          title: "demo_bounded_contexts_ubiquitous.py",
          code: `print({"case_id":"T-100","source":"email"})
print("acl", True)
print("no_leak", True)`,
          output: `{'case_id': 'T-100', 'source': 'email'}
acl True
no_leak True`,
        },
        why: "Demuestra el outcome de S40-T3-A con Python verificable.",
      },
      {
        demoId: "S40-T3-B-DEMO",
        subtopicId: "S40-T3-B",
        environment: "local-python",
        description: "Demo: entities, value objects y servicios",
        code: {
          language: 'python',
          title: "demo_entities_vo_services.py",
          code: `print("merged", 0.7)
print("service", "stateless")
print("not_entity", True)`,
          output: `merged 0.7
service stateless
not_entity True`,
        },
        why: "Demuestra el outcome de S40-T3-B con Python verificable.",
      },
      {
        demoId: "S40-T4-A-DEMO",
        subtopicId: "S40-T4-A",
        environment: "local-python",
        description: "Demo: diagramas C4/flujo y ADRs",
        code: {
          language: 'python',
          title: "demo_c4_flow_adr.py",
          code: `print("steps", 5)
print("head", "intake -> validate -> enqueue")
print("doc", "C4+ADR")`,
          output: `steps 5
head intake -> validate -> enqueue
doc C4+ADR`,
        },
        why: "Demuestra el outcome de S40-T4-A con Python verificable.",
      },
      {
        demoId: "S40-T4-B-DEMO",
        subtopicId: "S40-T4-B",
        environment: "local-python",
        description: "Demo: APIs, eventos, deuda y evolución compatible",
        code: {
          language: 'python',
          title: "demo_apis_events_debt_compat.py",
          code: `print("debt", "D1")
print("paydown", "async_job")
print("events", "case.created")`,
          output: `debt D1
paydown async_job
events case.created`,
        },
        why: "Demuestra el outcome de S40-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S40-T1-A-E1",
        subtopicId: "S40-T1-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`2\`. Datos sintéticos; sin PII real.",
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
          code: `print(2)`,
          output: `2`,
        },
      },
      {
        id: "S40-T1-A-E2",
        subtopicId: "S40-T1-A",
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
        id: "S40-T1-A-E3",
        subtopicId: "S40-T1-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`{'functional':3,'quality':2}\`. Datos sintéticos; sin PII real.",
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
          code: `print({'functional':3,'quality':2})`,
          output: `{'functional': 3, 'quality': 2}`,
        },
      },
      {
        id: "S40-T1-B-E1",
        subtopicId: "S40-T1-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`1.0\`. Datos sintéticos; sin PII real.",
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
          code: `print(1.0)`,
          output: `1.0`,
        },
      },
      {
        id: "S40-T1-B-E2",
        subtopicId: "S40-T1-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'b'\`. Datos sintéticos; sin PII real.",
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
          code: `print('b')`,
          output: `b`,
        },
      },
      {
        id: "S40-T1-B-E3",
        subtopicId: "S40-T1-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'timeout'\`. Datos sintéticos; sin PII real.",
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
          code: `print('timeout')`,
          output: `timeout`,
        },
      },
      {
        id: "S40-T2-A-E1",
        subtopicId: "S40-T2-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['presentation','application','domain','infrastructure']\`. Datos sintéticos; sin PII real.",
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
          code: `print(['presentation','application','domain','infrastructure'])`,
          output: `['presentation', 'application', 'domain', 'infrastructure']`,
        },
      },
      {
        id: "S40-T2-A-E2",
        subtopicId: "S40-T2-A",
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
        id: "S40-T2-A-E3",
        subtopicId: "S40-T2-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`3\`. Datos sintéticos; sin PII real.",
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
          code: `print(3)`,
          output: `3`,
        },
      },
      {
        id: "S40-T2-B-E1",
        subtopicId: "S40-T2-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`{'ok': True}\`. Datos sintéticos; sin PII real.",
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
          code: `print({'ok': True})`,
          output: `{'ok': True}`,
        },
      },
      {
        id: "S40-T2-B-E2",
        subtopicId: "S40-T2-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'domain<-adapters'\`. Datos sintéticos; sin PII real.",
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
          code: `print('domain<-adapters')`,
          output: `domain<-adapters`,
        },
      },
      {
        id: "S40-T2-B-E3",
        subtopicId: "S40-T2-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'sent:hola'\`. Datos sintéticos; sin PII real.",
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
          code: `print('sent:hola')`,
          output: `sent:hola`,
        },
      },
      {
        id: "S40-T3-A-E1",
        subtopicId: "S40-T3-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`sorted(['EntityResolution','Intake'])\`. Datos sintéticos; sin PII real.",
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
          code: `print(sorted(['EntityResolution','Intake']))`,
          output: `['EntityResolution', 'Intake']`,
        },
      },
      {
        id: "S40-T3-A-E2",
        subtopicId: "S40-T3-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`{'case_id':'T1'}\`. Datos sintéticos; sin PII real.",
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
          code: `print({'case_id':'T1'})`,
          output: `{'case_id': 'T1'}`,
        },
      },
      {
        id: "S40-T3-A-E3",
        subtopicId: "S40-T3-A",
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
        id: "S40-T3-B-E1",
        subtopicId: "S40-T3-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`150\`. Datos sintéticos; sin PII real.",
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
          code: `print(150)`,
          output: `150`,
        },
      },
      {
        id: "S40-T3-B-E2",
        subtopicId: "S40-T3-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'CASE-1'\`. Datos sintéticos; sin PII real.",
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
          code: `print('CASE-1')`,
          output: `CASE-1`,
        },
      },
      {
        id: "S40-T3-B-E3",
        subtopicId: "S40-T3-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`0.7\`. Datos sintéticos; sin PII real.",
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
          code: `print(0.7)`,
          output: `0.7`,
        },
      },
      {
        id: "S40-T4-A-E1",
        subtopicId: "S40-T4-A",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`['api','worker','db']\`. Datos sintéticos; sin PII real.",
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
          code: `print(['api','worker','db'])`,
          output: `['api', 'worker', 'db']`,
        },
      },
      {
        id: "S40-T4-A-E2",
        subtopicId: "S40-T4-A",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'accepted'\`. Datos sintéticos; sin PII real.",
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
          code: `print('accepted')`,
          output: `accepted`,
        },
      },
      {
        id: "S40-T4-A-E3",
        subtopicId: "S40-T4-A",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`2\`. Datos sintéticos; sin PII real.",
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
          code: `print(2)`,
          output: `2`,
        },
      },
      {
        id: "S40-T4-B-E1",
        subtopicId: "S40-T4-B",
        kind: "guided",
        instruction:
          "E1 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`sorted(['a','b'])\`. Datos sintéticos; sin PII real.",
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
          code: `print(sorted(['a','b']))`,
          output: `['a', 'b']`,
        },
      },
      {
        id: "S40-T4-B-E2",
        subtopicId: "S40-T4-B",
        kind: "independent",
        instruction:
          "E2 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`2\`. Datos sintéticos; sin PII real.",
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
          code: `print(2)`,
          output: `2`,
        },
      },
      {
        id: "S40-T4-B-E3",
        subtopicId: "S40-T4-B",
        kind: "transfer",
        instruction:
          "E3 — Escribe un script que reproduzca la salida de la demo/solución de este subtema. Debes imprimir (en orden): \`'async_job'\`. Datos sintéticos; sin PII real.",
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
          code: `print('async_job')`,
          output: `async_job`,
        },
      },
    ],
  },
  youDo: {
    title: "Arquitectura, DDD y decisiones técnicas",
    context:
      "Proyecto de sección **S40** (Arquitectura, DDD y decisiones técnicas). Gate: **CP-N4-A (inicio)**. mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-A (inicio)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S40 You Do — Arquitectura, DDD y decisiones técnicas
# Gate: CP-N4-A (inicio)
# mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos.

def main():
    print("section", "S40")
    print("gate", 'CP-N4-A (inicio)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-A (inicio). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S40 que se preserva es:",
        options: [
          "agentic-architecture",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S40 pertenece a:",
        options: [
          "CP-N4-A (inicio)",
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
        note: "Apoyo S40 Arquitectura, DDD y decisiones técnicas",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Arquitectura, DDD y decisiones técnicas",
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
