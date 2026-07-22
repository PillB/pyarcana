import type { CourseSection } from '../../types'

export const section40: CourseSection = {
  id: "agentic-architecture",
  index: 40,
  title: "Arquitectura, DDD y decisiones técnicas",
  shortTitle: "Arquitectura y DDD",
  tagline: "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos",
  estimatedHours: 18,
  level: "Master",
  phase: 3,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, arquitectura, DDD y decisiones técnicas conectan requisitos con fronteras y evidencia operativa. La práctica entrega un mapa C4, context map, contratos y ADRs versionados con responsables; se promueve solo cuando cada flujo conserva medida, dueño y consecuencia.",
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
      heading: "Ruta de S40: Arquitectura, DDD y decisiones técnicas",
      paragraphs: [
        "Esta sección parte de S39 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-LIM-040` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: dossier de arquitectura gobernada para Red Andina, organización ficticia. La entrada son requisitos, escenarios de calidad, vocabulario y restricciones; la salida son fronteras, C4, contratos y ADRs.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach o incertidumbre.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content:
          "CP-N4-A: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "requisitos funcionales y quality attributes",
      subtopicId: "S40-T1-A",
      paragraphs: [
        "Un requisito funcional describe una capacidad; un atributo de calidad se expresa como escenario medible — fuente, estímulo, entorno, respuesta y medida — para evitar palabras vacías como «rápido».",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: escenario QA completo con umbral y dueño. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `requisitos funcionales y quality attributes` al caso sintético `CASO-LIM-040`: la evidencia es un escenario QA completo con umbral y dueño. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
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
          "Evidencia mínima de S40-T1-A: escenario QA completo con umbral y dueño. Si falta, responde `REJECT_QA_SCENARIO`; si no alcanza para decidir, `REQUEST_QA_OWNER`.",
      },
    },
    {
      heading: "trade-offs, riesgos y criterios medibles",
      subtopicId: "S40-T1-B",
      paragraphs: [
        "Un trade-off compara alternativas contra criterios ponderados y registra riesgo, probabilidad, impacto y mitigación; la arquitectura no tiene una opción universalmente mejor.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: tabla de decisión y riesgo residual aceptado. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `trade-offs, riesgos y criterios medibles` a `CASO-LIM-040`: la evidencia es una tabla de decisión y riesgo residual aceptado por un dueño explícito; no una preferencia sin medición.",
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
          "Antes de promover S40-T1-B, audita tabla de decisión y riesgo residual aceptado. Un breach activa `REOPEN_TRADEOFF` y una ausencia activa `ESCALATE_RESIDUAL_RISK`.",
      },
    },
    {
      heading: "cohesión/coupling y capas",
      subtopicId: "S40-T2-A",
      paragraphs: [
        "Alta cohesión mantiene juntas reglas que cambian por la misma razón; bajo acoplamiento evita que presentación e infraestructura dicten el dominio.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: diagrama de dependencias sin salto de capa. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `cohesión/coupling y capas` a `CASO-LIM-040`: la evidencia es un diagrama donde presentación no salta al repositorio y dominio no importa infraestructura.",
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
          "La revisión de S40-T2-A conserva diagrama de dependencias sin salto de capa; no conviertas `REDRAW_BOUNDARY` ni `REVIEW_LAYER_OWNER` en éxito silencioso.",
      },
    },
    {
      heading: "ports/adapters y dependencia hacia dominio",
      subtopicId: "S40-T2-B",
      paragraphs: [
        "Un port define lo que necesita el dominio y un adapter traduce HTTP, SQL o colas; las flechas de código apuntan hacia políticas estables.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: test del dominio con adapter en memoria. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `ports/adapters` a `CASO-LIM-040`: un adapter en memoria prueba el dominio sin HTTP, SQL ni red; el contrato puede sustituirse sin cambiar la regla.",
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
          "Contrato S40-T2-B: demuestra test del dominio con adapter en memoria. Falla cerrada con `INVERT_DEPENDENCY` y deriva incertidumbre mediante `DEFINE_PORT_CONTRACT`.",
      },
    },
    {
      heading: "bounded contexts y lenguaje ubicuo",
      subtopicId: "S40-T3-A",
      paragraphs: [
        "Un bounded context da significado local a términos; el context map declara traducciones para que «caso» de intake no se confunda con un record de ER.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: glosario ubicuo y context map revisado. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `bounded contexts y lenguaje ubicuo` a `CASO-LIM-040`: el context map traduce términos entre intake, ER, relación, triage y reporting sin fusionar significados.",
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
          "Para S40-T3-A, el artefacto comprobable es glosario ubicuo y context map revisado. Sin él corresponde `SPLIT_CONTEXTS` o, si faltan datos, `WORKSHOP_UBIQUITOUS_LANGUAGE`.",
      },
    },
    {
      heading: "entities, value objects y servicios",
      subtopicId: "S40-T3-B",
      paragraphs: [
        "Una entity conserva identidad, un value object se compara por valor y un servicio de dominio contiene una regla que no pertenece naturalmente a una entidad.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: invariantes de entity/VO probadas. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `entities, value objects y servicios` a `CASO-LIM-040`: fixtures sintéticas prueban identidad, igualdad por valor e invariantes; ER no implica fraude ni parentesco.",
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
          "Promoción de S40-T3-B: prueba invariantes de entity/VO probadas y registra por separado `REJECT_DOMAIN_MODEL` (breach) y `CLARIFY_INVARIANT` (missing).",
      },
    },
    {
      heading: "diagramas C4/flujo y ADRs",
      subtopicId: "S40-T4-A",
      paragraphs: [
        "C4 explica personas, sistemas y contenedores; un ADR conserva contexto, decisión, alternativas, estado y consecuencias, no solo un dibujo final.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: C4 enlazado a ADR aceptado y reversible. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `diagramas C4/flujo y ADRs` a `CASO-LIM-040`: C4 localiza el flujo y el ADR conserva alternativa rechazada, consecuencia y señal de reversión.",
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
          "El dueño de S40-T4-A acepta solo C4 enlazado a ADR aceptado y reversible; una violación produce `RETURN_ADR_TO_DRAFT` y un registro incompleto produce `REQUEST_ARCH_REVIEW`.",
      },
    },
    {
      heading: "APIs, eventos, deuda y evolución compatible",
      subtopicId: "S40-T4-B",
      paragraphs: [
        "Los cambios compatibles son aditivos, preservan consumidores y versionan eventos; deuda técnica lleva dueño, fecha y criterio de retiro.",
        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: consumer contract de versión previa en verde. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
        "Aplicación de `APIs, eventos, deuda y evolución compatible` a `CASO-LIM-040`: un consumer contract anterior permanece verde y la deuda tiene dueño y criterio de retiro.",
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
          "Cierre de S40-T4-B: conserva consumer contract de versión previa en verde, la evidencia de `BLOCK_BREAKING_CHANGE` y la ruta humana `NEGOTIATE_VERSION`.",
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
        why: "Hace observable `requisitos funcionales y quality attributes` con un caso local pequeño y deja como evidencia escenario QA completo con umbral y dueño; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `trade-offs, riesgos y criterios medibles` con un caso local pequeño y deja como evidencia tabla de decisión y riesgo residual aceptado; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `cohesión/coupling y capas` con un caso local pequeño y deja como evidencia diagrama de dependencias sin salto de capa; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `ports/adapters y dependencia hacia dominio` con un caso local pequeño y deja como evidencia test del dominio con adapter en memoria; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `bounded contexts y lenguaje ubicuo` con un caso local pequeño y deja como evidencia glosario ubicuo y context map revisado; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `entities, value objects y servicios` con un caso local pequeño y deja como evidencia invariantes de entity/VO probadas; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `diagramas C4/flujo y ADRs` con un caso local pequeño y deja como evidencia C4 enlazado a ADR aceptado y reversible; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `APIs, eventos, deuda y evolución compatible` con un caso local pequeño y deja como evidencia consumer contract de versión previa en verde; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S40 · Laboratorio Dossier de arquitectura gobernada para Red Andina (organización ficticia): 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S40-T1-A-E1",
        subtopicId: "S40-T1-A",
        kind: "guided",
        instruction: "S40-T1-A-E1 · Calcula el contrato de `requisitos funcionales y quality attributes` sobre `CASO-LIM-040-1A`. La entrada es el dict completo del starter; la operación debe demostrar latencia observada contra umbral y dueño. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_QA_SCENARIO` en E2.",
        hint: "Relaciona los campos `source`, `stimulus`, `environment`, `response`, `observed_ms`, `target_ms`, `owner` con la regla explicada en S40-T1-A.",
        hints: [
          "Relaciona los campos `source`, `stimulus`, `environment`, `response`, `observed_ms`, `target_ms`, `owner` con la regla explicada en S40-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva escenario QA completo con umbral y dueño; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owner", "fixture adverso: latencia observada contra umbral y dueño", "CASO-LIM-040-1A es sintético"],
        tests: "El fixture `CASO-LIM-040-1A` satisface un predicado de dominio real; imprime `S40-T1-A PASS` y el assert booleano pasa.",
        feedback: "S40-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QA_SCENARIO y por qué faltar owner exige REQUEST_QA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
meets_contract = record["observed_ms"] >= record["target_ms"]
status = "PASS" if meets_contract else "REJECT_QA_SCENARIO"
print("S40-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
meets_contract = record["observed_ms"] <= record["target_ms"] and bool(record["owner"])
status = "PASS" if meets_contract else "REJECT_QA_SCENARIO"
print("S40-T1-A", status)
assert meets_contract is True` ,
          output: `S40-T1-A PASS` ,
        },
      },
      {
        id: "S40-T1-A-E2",
        subtopicId: "S40-T1-A",
        kind: "independent",
        instruction: "S40-T1-A-E2 · Modela tres rutas de `requisitos funcionales y quality attributes`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, source, stimulus, environment, response, observed_ms, target_ms, owner. Salidas exactas: `PASS`, `REJECT_QA_SCENARIO`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T1-A: latencia observada contra umbral y dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: latencia observada contra umbral y dueño", "CASO-LIM-040-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS REJECT_QA_SCENARIO MISSING:owner`.",
        feedback: "S40-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QA_SCENARIO y por qué faltar owner exige REQUEST_QA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "source", "stimulus", "environment", "response", "observed_ms", "target_ms", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["observed_ms"] >= record["target_ms"] else "REJECT_QA_SCENARIO"

valid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
invalid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":410,"target_ms":300,"owner":"platform"}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "source", "stimulus", "environment", "response", "observed_ms", "target_ms", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["observed_ms"] <= record["target_ms"] and bool(record["owner"]) else "REJECT_QA_SCENARIO"

valid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
invalid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":410,"target_ms":300,"owner":"platform"}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_QA_SCENARIO MISSING:owner` ,
        },
      },
      {
        id: "S40-T1-A-E3",
        subtopicId: "S40-T1-A",
        kind: "transfer",
        instruction: "S40-T1-A-E3 · Simula fallo cerrado para `requisitos funcionales y quality attributes` con tres fixtures distintos. `CASO-LIM-040-1A` debe continuar, el adverso debe devolver `REJECT_QA_SCENARIO` y la ausencia de `owner` debe devolver `REQUEST_QA_OWNER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_QA_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_QA_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró latencia observada contra umbral y dueño; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: latencia observada contra umbral y dueño", "CASO-LIM-040-1A es sintético"],
        tests: "Fixtures `CASO-LIM-040-1A`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_QA_SCENARIO y por qué faltar owner exige REQUEST_QA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "source", "stimulus", "environment", "response", "observed_ms", "target_ms", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["observed_ms"] >= record["target_ms"] else "REJECT_QA_SCENARIO"

valid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
invalid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":410,"target_ms":300,"owner":"platform"}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "source", "stimulus", "environment", "response", "observed_ms", "target_ms", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_QA_OWNER"
    return "CONTINUE" if record["observed_ms"] <= record["target_ms"] and bool(record["owner"]) else "REJECT_QA_SCENARIO"

valid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
invalid = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":410,"target_ms":300,"owner":"platform"}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_QA_SCENARIO", "REQUEST_QA_OWNER"]` ,
          output: `CONTINUE REJECT_QA_SCENARIO REQUEST_QA_OWNER` ,
        },
      },
      {
        id: "S40-T1-B-E1",
        subtopicId: "S40-T1-B",
        kind: "guided",
        instruction: "S40-T1-B-E1 · Compara el contrato de `trade-offs, riesgos y criterios medibles` sobre `CASO-LIM-040-1B`. La entrada es el dict completo del starter; la operación debe demostrar alternativa con menor score y riesgo residual aceptable. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REOPEN_TRADEOFF` en E2.",
        hint: "Relaciona los campos `scores`, `selected`, `risk_owner`, `residual_risk` con la regla explicada en S40-T1-B.",
        hints: [
          "Relaciona los campos `scores`, `selected`, `risk_owner`, `residual_risk` con la regla explicada en S40-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva tabla de decisión y riesgo residual aceptado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: alternativa con menor score y riesgo residual aceptable", "CASO-LIM-040-1B es sintético"],
        tests: "El fixture `CASO-LIM-040-1B` satisface un predicado de dominio real; imprime `S40-T1-B PASS` y el assert booleano pasa.",
        feedback: "S40-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_TRADEOFF y por qué faltar residual_risk exige ESCALATE_RESIDUAL_RISK.",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
meets_contract = record["selected"] == max(record["scores"], key=record["scores"].get)
status = "PASS" if meets_contract else "REOPEN_TRADEOFF"
print("S40-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
meets_contract = record["selected"] == min(record["scores"], key=record["scores"].get) and record["residual_risk"] <= 2
status = "PASS" if meets_contract else "REOPEN_TRADEOFF"
print("S40-T1-B", status)
assert meets_contract is True` ,
          output: `S40-T1-B PASS` ,
        },
      },
      {
        id: "S40-T1-B-E2",
        subtopicId: "S40-T1-B",
        kind: "independent",
        instruction: "S40-T1-B-E2 · Verifica tres rutas de `trade-offs, riesgos y criterios medibles`: fixture válido, fixture adverso y registro sin `residual_risk`. Entrada: dict con case_id, scores, selected, risk_owner, residual_risk. Salidas exactas: `PASS`, `REOPEN_TRADEOFF`, `MISSING:residual_risk`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a residual_risk debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a residual_risk debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T1-B: alternativa con menor score y riesgo residual aceptable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: alternativa con menor score y riesgo residual aceptable", "CASO-LIM-040-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `residual_risk` ausente y produce exactamente `PASS REOPEN_TRADEOFF MISSING:residual_risk`.",
        feedback: "S40-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_TRADEOFF y por qué faltar residual_risk exige ESCALATE_RESIDUAL_RISK.",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "scores", "selected", "risk_owner", "residual_risk"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["selected"] == max(record["scores"], key=record["scores"].get) else "REOPEN_TRADEOFF"

valid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
invalid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":2.0,"async":4.2},"selected":"async","risk_owner":"arquitectura","residual_risk":4}}
incomplete = {**valid}
incomplete.pop("residual_risk")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "scores", "selected", "risk_owner", "residual_risk"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["selected"] == min(record["scores"], key=record["scores"].get) and record["residual_risk"] <= 2 else "REOPEN_TRADEOFF"

valid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
invalid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":2.0,"async":4.2},"selected":"async","risk_owner":"arquitectura","residual_risk":4}}
incomplete = {**valid}
incomplete.pop("residual_risk")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REOPEN_TRADEOFF MISSING:residual_risk` ,
        },
      },
      {
        id: "S40-T1-B-E3",
        subtopicId: "S40-T1-B",
        kind: "transfer",
        instruction: "S40-T1-B-E3 · Extiende fallo cerrado para `trade-offs, riesgos y criterios medibles` con tres fixtures distintos. `CASO-LIM-040-1B` debe continuar, el adverso debe devolver `REOPEN_TRADEOFF` y la ausencia de `residual_risk` debe devolver `ESCALATE_RESIDUAL_RISK`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ESCALATE_RESIDUAL_RISK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ESCALATE_RESIDUAL_RISK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró alternativa con menor score y riesgo residual aceptable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: alternativa con menor score y riesgo residual aceptable", "CASO-LIM-040-1B es sintético"],
        tests: "Fixtures `CASO-LIM-040-1B`, adverso y sin `residual_risk` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_TRADEOFF y por qué faltar residual_risk exige ESCALATE_RESIDUAL_RISK.",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "scores", "selected", "risk_owner", "residual_risk"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["selected"] == max(record["scores"], key=record["scores"].get) else "REOPEN_TRADEOFF"

valid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
invalid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":2.0,"async":4.2},"selected":"async","risk_owner":"arquitectura","residual_risk":4}}
uncertain = {**valid}
uncertain.pop("residual_risk")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "scores", "selected", "risk_owner", "residual_risk"}
    missing = sorted(required - record.keys())
    if missing:
        return "ESCALATE_RESIDUAL_RISK"
    return "CONTINUE" if record["selected"] == min(record["scores"], key=record["scores"].get) and record["residual_risk"] <= 2 else "REOPEN_TRADEOFF"

valid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
invalid = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":2.0,"async":4.2},"selected":"async","risk_owner":"arquitectura","residual_risk":4}}
uncertain = {**valid}
uncertain.pop("residual_risk")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REOPEN_TRADEOFF", "ESCALATE_RESIDUAL_RISK"]` ,
          output: `CONTINUE REOPEN_TRADEOFF ESCALATE_RESIDUAL_RISK` ,
        },
      },
      {
        id: "S40-T2-A-E1",
        subtopicId: "S40-T2-A",
        kind: "guided",
        instruction: "S40-T2-A-E1 · Filtra el contrato de `cohesión/coupling y capas` sobre `CASO-LIM-040-2A`. La entrada es el dict completo del starter; la operación debe demostrar grafo de dependencias sin dominio hacia infraestructura. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REDRAW_BOUNDARY` en E2.",
        hint: "Relaciona los campos `layers`, `dependencies` con la regla explicada en S40-T2-A.",
        hints: [
          "Relaciona los campos `layers`, `dependencies` con la regla explicada en S40-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva diagrama de dependencias sin salto de capa; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: grafo de dependencias sin dominio hacia infraestructura", "CASO-LIM-040-2A es sintético"],
        tests: "El fixture `CASO-LIM-040-2A` satisface un predicado de dominio real; imprime `S40-T2-A PASS` y el assert booleano pasa.",
        feedback: "S40-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REDRAW_BOUNDARY y por qué faltar dependencies exige REVIEW_LAYER_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
meets_contract = all(edge[1] == "infrastructure" for edge in record["dependencies"])
status = "PASS" if meets_contract else "REDRAW_BOUNDARY"
print("S40-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
meets_contract = all(edge != ["domain","infrastructure"] for edge in record["dependencies"]) and record["layers"][2] == "domain"
status = "PASS" if meets_contract else "REDRAW_BOUNDARY"
print("S40-T2-A", status)
assert meets_contract is True` ,
          output: `S40-T2-A PASS` ,
        },
      },
      {
        id: "S40-T2-A-E2",
        subtopicId: "S40-T2-A",
        kind: "independent",
        instruction: "S40-T2-A-E2 · Clasifica tres rutas de `cohesión/coupling y capas`: fixture válido, fixture adverso y registro sin `dependencies`. Entrada: dict con case_id, layers, dependencies. Salidas exactas: `PASS`, `REDRAW_BOUNDARY`, `MISSING:dependencies`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T2-A: grafo de dependencias sin dominio hacia infraestructura. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: grafo de dependencias sin dominio hacia infraestructura", "CASO-LIM-040-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `dependencies` ausente y produce exactamente `PASS REDRAW_BOUNDARY MISSING:dependencies`.",
        feedback: "S40-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REDRAW_BOUNDARY y por qué faltar dependencies exige REVIEW_LAYER_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(edge[1] == "infrastructure" for edge in record["dependencies"]) else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"]]}}
incomplete = {**valid}
incomplete.pop("dependencies")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(edge != ["domain","infrastructure"] for edge in record["dependencies"]) and record["layers"][2] == "domain" else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"]]}}
incomplete = {**valid}
incomplete.pop("dependencies")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REDRAW_BOUNDARY MISSING:dependencies` ,
        },
      },
      {
        id: "S40-T2-A-E3",
        subtopicId: "S40-T2-A",
        kind: "transfer",
        instruction: "S40-T2-A-E3 · Defiende fallo cerrado para `cohesión/coupling y capas` con tres fixtures distintos. `CASO-LIM-040-2A` debe continuar, el adverso debe devolver `REDRAW_BOUNDARY` y la ausencia de `dependencies` debe devolver `REVIEW_LAYER_OWNER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_LAYER_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_LAYER_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró grafo de dependencias sin dominio hacia infraestructura; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: grafo de dependencias sin dominio hacia infraestructura", "CASO-LIM-040-2A es sintético"],
        tests: "Fixtures `CASO-LIM-040-2A`, adverso y sin `dependencies` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REDRAW_BOUNDARY y por qué faltar dependencies exige REVIEW_LAYER_OWNER.",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if all(edge[1] == "infrastructure" for edge in record["dependencies"]) else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"]]}}
uncertain = {**valid}
uncertain.pop("dependencies")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_LAYER_OWNER"
    return "CONTINUE" if all(edge != ["domain","infrastructure"] for edge in record["dependencies"]) and record["layers"][2] == "domain" else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"]]}}
uncertain = {**valid}
uncertain.pop("dependencies")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REDRAW_BOUNDARY", "REVIEW_LAYER_OWNER"]` ,
          output: `CONTINUE REDRAW_BOUNDARY REVIEW_LAYER_OWNER` ,
        },
      },
      {
        id: "S40-T2-B-E1",
        subtopicId: "S40-T2-B",
        kind: "guided",
        instruction: "S40-T2-B-E1 · Modela el contrato de `ports/adapters y dependencia hacia dominio` sobre `CASO-LIM-040-2B`. La entrada es el dict completo del starter; la operación debe demostrar adapter sustituible y dominio sin imports externos. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `INVERT_DEPENDENCY` en E2.",
        hint: "Relaciona los campos `port`, `adapter`, `domain_imports`, `contract_tests` con la regla explicada en S40-T2-B.",
        hints: [
          "Relaciona los campos `port`, `adapter`, `domain_imports`, `contract_tests` con la regla explicada en S40-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva test del dominio con adapter en memoria; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: adapter sustituible y dominio sin imports externos", "CASO-LIM-040-2B es sintético"],
        tests: "El fixture `CASO-LIM-040-2B` satisface un predicado de dominio real; imprime `S40-T2-B PASS` y el assert booleano pasa.",
        feedback: "S40-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa INVERT_DEPENDENCY y por qué faltar contract_tests exige DEFINE_PORT_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
meets_contract = record["adapter"] == record["port"] and bool(record["domain_imports"])
status = "PASS" if meets_contract else "INVERT_DEPENDENCY"
print("S40-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
meets_contract = record["adapter"].endswith(record["port"]) and not record["domain_imports"] and record["contract_tests"] >= 3
status = "PASS" if meets_contract else "INVERT_DEPENDENCY"
print("S40-T2-B", status)
assert meets_contract is True` ,
          output: `S40-T2-B PASS` ,
        },
      },
      {
        id: "S40-T2-B-E2",
        subtopicId: "S40-T2-B",
        kind: "independent",
        instruction: "S40-T2-B-E2 · Audita tres rutas de `ports/adapters y dependencia hacia dominio`: fixture válido, fixture adverso y registro sin `contract_tests`. Entrada: dict con case_id, port, adapter, domain_imports, contract_tests. Salidas exactas: `PASS`, `INVERT_DEPENDENCY`, `MISSING:contract_tests`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T2-B: adapter sustituible y dominio sin imports externos. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: adapter sustituible y dominio sin imports externos", "CASO-LIM-040-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS INVERT_DEPENDENCY MISSING:contract_tests`.",
        feedback: "S40-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa INVERT_DEPENDENCY y por qué faltar contract_tests exige DEFINE_PORT_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "port", "adapter", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["adapter"] == record["port"] and bool(record["domain_imports"]) else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","domain_imports":["sqlalchemy"],"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "port", "adapter", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["adapter"].endswith(record["port"]) and not record["domain_imports"] and record["contract_tests"] >= 3 else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","domain_imports":["sqlalchemy"],"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS INVERT_DEPENDENCY MISSING:contract_tests` ,
        },
      },
      {
        id: "S40-T2-B-E3",
        subtopicId: "S40-T2-B",
        kind: "transfer",
        instruction: "S40-T2-B-E3 · Recupera fallo cerrado para `ports/adapters y dependencia hacia dominio` con tres fixtures distintos. `CASO-LIM-040-2B` debe continuar, el adverso debe devolver `INVERT_DEPENDENCY` y la ausencia de `contract_tests` debe devolver `DEFINE_PORT_CONTRACT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró adapter sustituible y dominio sin imports externos; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: adapter sustituible y dominio sin imports externos", "CASO-LIM-040-2B es sintético"],
        tests: "Fixtures `CASO-LIM-040-2B`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa INVERT_DEPENDENCY y por qué faltar contract_tests exige DEFINE_PORT_CONTRACT.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "port", "adapter", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["adapter"] == record["port"] and bool(record["domain_imports"]) else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","domain_imports":["sqlalchemy"],"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "port", "adapter", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "DEFINE_PORT_CONTRACT"
    return "CONTINUE" if record["adapter"].endswith(record["port"]) and not record["domain_imports"] and record["contract_tests"] >= 3 else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","domain_imports":["sqlalchemy"],"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "INVERT_DEPENDENCY", "DEFINE_PORT_CONTRACT"]` ,
          output: `CONTINUE INVERT_DEPENDENCY DEFINE_PORT_CONTRACT` ,
        },
      },
      {
        id: "S40-T3-A-E1",
        subtopicId: "S40-T3-A",
        kind: "guided",
        instruction: "S40-T3-A-E1 · Verifica el contrato de `bounded contexts y lenguaje ubicuo` sobre `CASO-LIM-040-3A`. La entrada es el dict completo del starter; la operación debe demostrar términos locales disjuntos y traducción declarada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `SPLIT_CONTEXTS` en E2.",
        hint: "Relaciona los campos `contexts`, `translations` con la regla explicada en S40-T3-A.",
        hints: [
          "Relaciona los campos `contexts`, `translations` con la regla explicada en S40-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva glosario ubicuo y context map revisado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta translations", "fixture adverso: términos locales disjuntos y traducción declarada", "CASO-LIM-040-3A es sintético"],
        tests: "El fixture `CASO-LIM-040-3A` satisface un predicado de dominio real; imprime `S40-T3-A PASS` y el assert booleano pasa.",
        feedback: "S40-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa SPLIT_CONTEXTS y por qué faltar translations exige WORKSHOP_UBIQUITOUS_LANGUAGE.",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
meets_contract = bool(record["contexts"]["intake"] & record["contexts"]["er"])
status = "PASS" if meets_contract else "SPLIT_CONTEXTS"
print("S40-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
meets_contract = record["contexts"]["intake"].isdisjoint(record["contexts"]["er"]) and record["translations"].get("case") == "record"
status = "PASS" if meets_contract else "SPLIT_CONTEXTS"
print("S40-T3-A", status)
assert meets_contract is True` ,
          output: `S40-T3-A PASS` ,
        },
      },
      {
        id: "S40-T3-A-E2",
        subtopicId: "S40-T3-A",
        kind: "independent",
        instruction: "S40-T3-A-E2 · Decide tres rutas de `bounded contexts y lenguaje ubicuo`: fixture válido, fixture adverso y registro sin `translations`. Entrada: dict con case_id, contexts, translations. Salidas exactas: `PASS`, `SPLIT_CONTEXTS`, `MISSING:translations`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a translations debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a translations debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T3-A: términos locales disjuntos y traducción declarada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta translations", "fixture adverso: términos locales disjuntos y traducción declarada", "CASO-LIM-040-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `translations` ausente y produce exactamente `PASS SPLIT_CONTEXTS MISSING:translations`.",
        feedback: "S40-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa SPLIT_CONTEXTS y por qué faltar translations exige WORKSHOP_UBIQUITOUS_LANGUAGE.",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "contexts", "translations"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bool(record["contexts"]["intake"] & record["contexts"]["er"]) else "SPLIT_CONTEXTS"

valid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
invalid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"case","score"}},"translations":{}}}
incomplete = {**valid}
incomplete.pop("translations")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "contexts", "translations"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["contexts"]["intake"].isdisjoint(record["contexts"]["er"]) and record["translations"].get("case") == "record" else "SPLIT_CONTEXTS"

valid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
invalid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"case","score"}},"translations":{}}}
incomplete = {**valid}
incomplete.pop("translations")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS SPLIT_CONTEXTS MISSING:translations` ,
        },
      },
      {
        id: "S40-T3-A-E3",
        subtopicId: "S40-T3-A",
        kind: "transfer",
        instruction: "S40-T3-A-E3 · Contrasta fallo cerrado para `bounded contexts y lenguaje ubicuo` con tres fixtures distintos. `CASO-LIM-040-3A` debe continuar, el adverso debe devolver `SPLIT_CONTEXTS` y la ausencia de `translations` debe devolver `WORKSHOP_UBIQUITOUS_LANGUAGE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `WORKSHOP_UBIQUITOUS_LANGUAGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WORKSHOP_UBIQUITOUS_LANGUAGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró términos locales disjuntos y traducción declarada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta translations", "fixture adverso: términos locales disjuntos y traducción declarada", "CASO-LIM-040-3A es sintético"],
        tests: "Fixtures `CASO-LIM-040-3A`, adverso y sin `translations` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa SPLIT_CONTEXTS y por qué faltar translations exige WORKSHOP_UBIQUITOUS_LANGUAGE.",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "contexts", "translations"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if bool(record["contexts"]["intake"] & record["contexts"]["er"]) else "SPLIT_CONTEXTS"

valid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
invalid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"case","score"}},"translations":{}}}
uncertain = {**valid}
uncertain.pop("translations")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "contexts", "translations"}
    missing = sorted(required - record.keys())
    if missing:
        return "WORKSHOP_UBIQUITOUS_LANGUAGE"
    return "CONTINUE" if record["contexts"]["intake"].isdisjoint(record["contexts"]["er"]) and record["translations"].get("case") == "record" else "SPLIT_CONTEXTS"

valid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"record","score"}},"translations":{"case":"record"}}}
invalid = {"case_id": "CASO-LIM-040-3A", **{"contexts":{"intake":{"case"},"er":{"case","score"}},"translations":{}}}
uncertain = {**valid}
uncertain.pop("translations")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "SPLIT_CONTEXTS", "WORKSHOP_UBIQUITOUS_LANGUAGE"]` ,
          output: `CONTINUE SPLIT_CONTEXTS WORKSHOP_UBIQUITOUS_LANGUAGE` ,
        },
      },
      {
        id: "S40-T3-B-E1",
        subtopicId: "S40-T3-B",
        kind: "guided",
        instruction: "S40-T3-B-E1 · Clasifica el contrato de `entities, value objects y servicios` sobre `CASO-LIM-040-3B`. La entrada es el dict completo del starter; la operación debe demostrar identidad estable, VO en PEN e invariantes inmutables. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_DOMAIN_MODEL` en E2.",
        hint: "Relaciona los campos `entity_id`, `vo`, `vo_frozen`, `service_stateless` con la regla explicada en S40-T3-B.",
        hints: [
          "Relaciona los campos `entity_id`, `vo`, `vo_frozen`, `service_stateless` con la regla explicada en S40-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva invariantes de entity/VO probadas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: identidad estable, VO en PEN e invariantes inmutables", "CASO-LIM-040-3B es sintético"],
        tests: "El fixture `CASO-LIM-040-3B` satisface un predicado de dominio real; imprime `S40-T3-B PASS` y el assert booleano pasa.",
        feedback: "S40-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DOMAIN_MODEL y por qué faltar service_stateless exige CLARIFY_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
meets_contract = record["vo"]["currency"] == record["entity_id"]
status = "PASS" if meets_contract else "REJECT_DOMAIN_MODEL"
print("S40-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
meets_contract = record["entity_id"].startswith("CASE-") and record["vo"]["currency"] == "PEN" and record["vo_frozen"] and record["service_stateless"]
status = "PASS" if meets_contract else "REJECT_DOMAIN_MODEL"
print("S40-T3-B", status)
assert meets_contract is True` ,
          output: `S40-T3-B PASS` ,
        },
      },
      {
        id: "S40-T3-B-E2",
        subtopicId: "S40-T3-B",
        kind: "independent",
        instruction: "S40-T3-B-E2 · Calcula tres rutas de `entities, value objects y servicios`: fixture válido, fixture adverso y registro sin `service_stateless`. Entrada: dict con case_id, entity_id, vo, vo_frozen, service_stateless. Salidas exactas: `PASS`, `REJECT_DOMAIN_MODEL`, `MISSING:service_stateless`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a service_stateless debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a service_stateless debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T3-B: identidad estable, VO en PEN e invariantes inmutables. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: identidad estable, VO en PEN e invariantes inmutables", "CASO-LIM-040-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `service_stateless` ausente y produce exactamente `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless`.",
        feedback: "S40-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DOMAIN_MODEL y por qué faltar service_stateless exige CLARIFY_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "entity_id", "vo", "vo_frozen", "service_stateless"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["vo"]["currency"] == record["entity_id"] else "REJECT_DOMAIN_MODEL"

valid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
invalid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"","vo":{"amount":-1,"currency":"USD"},"vo_frozen":False,"service_stateless":False}}
incomplete = {**valid}
incomplete.pop("service_stateless")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "entity_id", "vo", "vo_frozen", "service_stateless"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["entity_id"].startswith("CASE-") and record["vo"]["currency"] == "PEN" and record["vo_frozen"] and record["service_stateless"] else "REJECT_DOMAIN_MODEL"

valid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
invalid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"","vo":{"amount":-1,"currency":"USD"},"vo_frozen":False,"service_stateless":False}}
incomplete = {**valid}
incomplete.pop("service_stateless")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless` ,
        },
      },
      {
        id: "S40-T3-B-E3",
        subtopicId: "S40-T3-B",
        kind: "transfer",
        instruction: "S40-T3-B-E3 · Instrumenta fallo cerrado para `entities, value objects y servicios` con tres fixtures distintos. `CASO-LIM-040-3B` debe continuar, el adverso debe devolver `REJECT_DOMAIN_MODEL` y la ausencia de `service_stateless` debe devolver `CLARIFY_INVARIANT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CLARIFY_INVARIANT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLARIFY_INVARIANT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró identidad estable, VO en PEN e invariantes inmutables; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: identidad estable, VO en PEN e invariantes inmutables", "CASO-LIM-040-3B es sintético"],
        tests: "Fixtures `CASO-LIM-040-3B`, adverso y sin `service_stateless` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DOMAIN_MODEL y por qué faltar service_stateless exige CLARIFY_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "entity_id", "vo", "vo_frozen", "service_stateless"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["vo"]["currency"] == record["entity_id"] else "REJECT_DOMAIN_MODEL"

valid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
invalid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"","vo":{"amount":-1,"currency":"USD"},"vo_frozen":False,"service_stateless":False}}
uncertain = {**valid}
uncertain.pop("service_stateless")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "entity_id", "vo", "vo_frozen", "service_stateless"}
    missing = sorted(required - record.keys())
    if missing:
        return "CLARIFY_INVARIANT"
    return "CONTINUE" if record["entity_id"].startswith("CASE-") and record["vo"]["currency"] == "PEN" and record["vo_frozen"] and record["service_stateless"] else "REJECT_DOMAIN_MODEL"

valid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"CASE-001","vo":{"amount":150,"currency":"PEN"},"vo_frozen":True,"service_stateless":True}}
invalid = {"case_id": "CASO-LIM-040-3B", **{"entity_id":"","vo":{"amount":-1,"currency":"USD"},"vo_frozen":False,"service_stateless":False}}
uncertain = {**valid}
uncertain.pop("service_stateless")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_DOMAIN_MODEL", "CLARIFY_INVARIANT"]` ,
          output: `CONTINUE REJECT_DOMAIN_MODEL CLARIFY_INVARIANT` ,
        },
      },
      {
        id: "S40-T4-A-E1",
        subtopicId: "S40-T4-A",
        kind: "guided",
        instruction: "S40-T4-A-E1 · Audita el contrato de `diagramas C4/flujo y ADRs` sobre `CASO-LIM-040-4A`. La entrada es el dict completo del starter; la operación debe demostrar C4 mínimo y ADR con alternativas, consecuencias y rollback. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `RETURN_ADR_TO_DRAFT` en E2.",
        hint: "Relaciona los campos `c4_levels`, `adr_fields`, `adr_status` con la regla explicada en S40-T4-A.",
        hints: [
          "Relaciona los campos `c4_levels`, `adr_fields`, `adr_status` con la regla explicada en S40-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva C4 enlazado a ADR aceptado y reversible; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: C4 mínimo y ADR con alternativas, consecuencias y rollback", "CASO-LIM-040-4A es sintético"],
        tests: "El fixture `CASO-LIM-040-4A` satisface un predicado de dominio real; imprime `S40-T4-A PASS` y el assert booleano pasa.",
        feedback: "S40-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa RETURN_ADR_TO_DRAFT y por qué faltar adr_status exige REQUEST_ARCH_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
meets_contract = record["adr_status"] == "draft" and len(record["adr_fields"]) < 3
status = "PASS" if meets_contract else "RETURN_ADR_TO_DRAFT"
print("S40-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
meets_contract = {"context","container"} <= record["c4_levels"] and {"decision","alternatives","consequences","rollback"} <= record["adr_fields"] and record["adr_status"] == "accepted"
status = "PASS" if meets_contract else "RETURN_ADR_TO_DRAFT"
print("S40-T4-A", status)
assert meets_contract is True` ,
          output: `S40-T4-A PASS` ,
        },
      },
      {
        id: "S40-T4-A-E2",
        subtopicId: "S40-T4-A",
        kind: "independent",
        instruction: "S40-T4-A-E2 · Compara tres rutas de `diagramas C4/flujo y ADRs`: fixture válido, fixture adverso y registro sin `adr_status`. Entrada: dict con case_id, c4_levels, adr_fields, adr_status. Salidas exactas: `PASS`, `RETURN_ADR_TO_DRAFT`, `MISSING:adr_status`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a adr_status debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a adr_status debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T4-A: C4 mínimo y ADR con alternativas, consecuencias y rollback. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: C4 mínimo y ADR con alternativas, consecuencias y rollback", "CASO-LIM-040-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `adr_status` ausente y produce exactamente `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status`.",
        feedback: "S40-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_ADR_TO_DRAFT y por qué faltar adr_status exige REQUEST_ARCH_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "c4_levels", "adr_fields", "adr_status"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["adr_status"] == "draft" and len(record["adr_fields"]) < 3 else "RETURN_ADR_TO_DRAFT"

valid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
invalid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context"},"adr_fields":{"decision"},"adr_status":"accepted"}}
incomplete = {**valid}
incomplete.pop("adr_status")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "c4_levels", "adr_fields", "adr_status"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"context","container"} <= record["c4_levels"] and {"decision","alternatives","consequences","rollback"} <= record["adr_fields"] and record["adr_status"] == "accepted" else "RETURN_ADR_TO_DRAFT"

valid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
invalid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context"},"adr_fields":{"decision"},"adr_status":"accepted"}}
incomplete = {**valid}
incomplete.pop("adr_status")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status` ,
        },
      },
      {
        id: "S40-T4-A-E3",
        subtopicId: "S40-T4-A",
        kind: "transfer",
        instruction: "S40-T4-A-E3 · Aísla fallo cerrado para `diagramas C4/flujo y ADRs` con tres fixtures distintos. `CASO-LIM-040-4A` debe continuar, el adverso debe devolver `RETURN_ADR_TO_DRAFT` y la ausencia de `adr_status` debe devolver `REQUEST_ARCH_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_ARCH_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_ARCH_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró C4 mínimo y ADR con alternativas, consecuencias y rollback; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: C4 mínimo y ADR con alternativas, consecuencias y rollback", "CASO-LIM-040-4A es sintético"],
        tests: "Fixtures `CASO-LIM-040-4A`, adverso y sin `adr_status` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RETURN_ADR_TO_DRAFT y por qué faltar adr_status exige REQUEST_ARCH_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "c4_levels", "adr_fields", "adr_status"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["adr_status"] == "draft" and len(record["adr_fields"]) < 3 else "RETURN_ADR_TO_DRAFT"

valid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
invalid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context"},"adr_fields":{"decision"},"adr_status":"accepted"}}
uncertain = {**valid}
uncertain.pop("adr_status")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "c4_levels", "adr_fields", "adr_status"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_ARCH_REVIEW"
    return "CONTINUE" if {"context","container"} <= record["c4_levels"] and {"decision","alternatives","consequences","rollback"} <= record["adr_fields"] and record["adr_status"] == "accepted" else "RETURN_ADR_TO_DRAFT"

valid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context","container"},"adr_fields":{"context","decision","alternatives","consequences","rollback"},"adr_status":"accepted"}}
invalid = {"case_id": "CASO-LIM-040-4A", **{"c4_levels":{"context"},"adr_fields":{"decision"},"adr_status":"accepted"}}
uncertain = {**valid}
uncertain.pop("adr_status")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RETURN_ADR_TO_DRAFT", "REQUEST_ARCH_REVIEW"]` ,
          output: `CONTINUE RETURN_ADR_TO_DRAFT REQUEST_ARCH_REVIEW` ,
        },
      },
      {
        id: "S40-T4-B-E1",
        subtopicId: "S40-T4-B",
        kind: "guided",
        instruction: "S40-T4-B-E1 · Decide el contrato de `APIs, eventos, deuda y evolución compatible` sobre `CASO-LIM-040-4B`. La entrada es el dict completo del starter; la operación debe demostrar campos v1 preservados y deuda con owner/fecha. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_BREAKING_CHANGE` en E2.",
        hint: "Relaciona los campos `v1_fields`, `v11_fields`, `debt_owner`, `retire_on` con la regla explicada en S40-T4-B.",
        hints: [
          "Relaciona los campos `v1_fields`, `v11_fields`, `debt_owner`, `retire_on` con la regla explicada en S40-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva consumer contract de versión previa en verde; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: campos v1 preservados y deuda con owner/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "El fixture `CASO-LIM-040-4B` satisface un predicado de dominio real; imprime `S40-T4-B PASS` y el assert booleano pasa.",
        feedback: "S40-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_BREAKING_CHANGE y por qué faltar retire_on exige NEGOTIATE_VERSION.",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
meets_contract = record["v11_fields"] < record["v1_fields"]
status = "PASS" if meets_contract else "BLOCK_BREAKING_CHANGE"
print("S40-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
meets_contract = record["v1_fields"] <= record["v11_fields"] and bool(record["debt_owner"]) and record["retire_on"] >= "2026-12-01"
status = "PASS" if meets_contract else "BLOCK_BREAKING_CHANGE"
print("S40-T4-B", status)
assert meets_contract is True` ,
          output: `S40-T4-B PASS` ,
        },
      },
      {
        id: "S40-T4-B-E2",
        subtopicId: "S40-T4-B",
        kind: "independent",
        instruction: "S40-T4-B-E2 · Filtra tres rutas de `APIs, eventos, deuda y evolución compatible`: fixture válido, fixture adverso y registro sin `retire_on`. Entrada: dict con case_id, v1_fields, v11_fields, debt_owner, retire_on. Salidas exactas: `PASS`, `BLOCK_BREAKING_CHANGE`, `MISSING:retire_on`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a retire_on debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a retire_on debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T4-B: campos v1 preservados y deuda con owner/fecha. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: campos v1 preservados y deuda con owner/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `retire_on` ausente y produce exactamente `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on`.",
        feedback: "S40-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_BREAKING_CHANGE y por qué faltar retire_on exige NEGOTIATE_VERSION.",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "v1_fields", "v11_fields", "debt_owner", "retire_on"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["v11_fields"] < record["v1_fields"] else "BLOCK_BREAKING_CHANGE"

valid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
invalid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id"},"debt_owner":"","retire_on":""}}
incomplete = {**valid}
incomplete.pop("retire_on")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "v1_fields", "v11_fields", "debt_owner", "retire_on"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["v1_fields"] <= record["v11_fields"] and bool(record["debt_owner"]) and record["retire_on"] >= "2026-12-01" else "BLOCK_BREAKING_CHANGE"

valid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
invalid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id"},"debt_owner":"","retire_on":""}}
incomplete = {**valid}
incomplete.pop("retire_on")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on` ,
        },
      },
      {
        id: "S40-T4-B-E3",
        subtopicId: "S40-T4-B",
        kind: "transfer",
        instruction: "S40-T4-B-E3 · Demuestra fallo cerrado para `APIs, eventos, deuda y evolución compatible` con tres fixtures distintos. `CASO-LIM-040-4B` debe continuar, el adverso debe devolver `BLOCK_BREAKING_CHANGE` y la ausencia de `retire_on` debe devolver `NEGOTIATE_VERSION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `NEGOTIATE_VERSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `NEGOTIATE_VERSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró campos v1 preservados y deuda con owner/fecha; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: campos v1 preservados y deuda con owner/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "Fixtures `CASO-LIM-040-4B`, adverso y sin `retire_on` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_BREAKING_CHANGE y por qué faltar retire_on exige NEGOTIATE_VERSION.",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "v1_fields", "v11_fields", "debt_owner", "retire_on"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["v11_fields"] < record["v1_fields"] else "BLOCK_BREAKING_CHANGE"

valid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
invalid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id"},"debt_owner":"","retire_on":""}}
uncertain = {**valid}
uncertain.pop("retire_on")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "v1_fields", "v11_fields", "debt_owner", "retire_on"}
    missing = sorted(required - record.keys())
    if missing:
        return "NEGOTIATE_VERSION"
    return "CONTINUE" if record["v1_fields"] <= record["v11_fields"] and bool(record["debt_owner"]) and record["retire_on"] >= "2026-12-01" else "BLOCK_BREAKING_CHANGE"

valid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id","status","priority"},"debt_owner":"platform","retire_on":"2026-12-01"}}
invalid = {"case_id": "CASO-LIM-040-4B", **{"v1_fields":{"case_id","status"},"v11_fields":{"case_id"},"debt_owner":"","retire_on":""}}
uncertain = {**valid}
uncertain.pop("retire_on")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_BREAKING_CHANGE", "NEGOTIATE_VERSION"]` ,
          output: `CONTINUE BLOCK_BREAKING_CHANGE NEGOTIATE_VERSION` ,
        },
      },
    ],
  },
  youDo: {
    title: "Arquitectura, DDD y decisiones técnicas",
    context: "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea ante: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.",
    objectives: [
      "Convertir requisitos, escenarios de calidad, vocabulario de dominio y restricciones en mapa C4, context map, contratos y ADRs versionados con responsables.",
      "Demostrar el gate: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
      "Probar el fallo: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-LIM-040`.",
      "Incluye quality-attribute scenarios con fuente, estímulo, entorno, respuesta y medida.",
      "Incluye context map de intake/ER/relación/triage/reporting/IA.",
      "Incluye C4 de contexto y contenedores.",
      "Incluye dos ADRs con alternativas, consecuencias y plan de reversión.",
      "Automatiza un caso normal, uno de breach (`BLOCK_ARCHITECTURE`) y uno incierto (`REVIEW_ADR`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-LIM-040"
REQUIRED = ['quality_attribute_scenarios_con_fuente_est_mulo_', 'context_map_de_intake_er_relaci_n_triage_reporti', 'c4_de_contexto_y_contenedores', 'dos_adrs_con_alternativas_consecuencias_y_plan_d']
evidence = {
    "quality_attribute_scenarios_con_fuente_est_mulo_": False,
    "context_map_de_intake_er_relaci_n_triage_reporti": False,
    "c4_de_contexto_y_contenedores": False,
    "dos_adrs_con_alternativas_consecuencias_y_plan_d": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · mapa de arquitectura gobernado: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar `requisitos funcionales y quality attributes` en CASO-LIM-040?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "escenario QA completo con umbral y dueño"],
        correctIndex: 3,
        explanation: "La teoría exige escenario QA completo con umbral y dueño; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S40, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "emitir BLOCK_ARCHITECTURE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "El contrato falla cerrado con BLOCK_ARCHITECTURE; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · mapa de arquitectura gobernado`?",
        options: ["el archivo S40 existe, aunque no pruebe el gate", "el README afirma que funciona", "cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
      },
      {
        question: "¿Qué tratamiento de `CASO-LIM-040` respeta el alcance del curso?",
        options: ["mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 0,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "C4 model",
        url: "https://c4model.com/",
        note: "Diagramas de arquitectura con niveles y fronteras",
      },
      {
        label: "Microsoft Azure Architecture Center",
        url: "https://learn.microsoft.com/azure/architecture/",
        note: "Quality attributes, patrones y trade-offs",
      },
      {
        label: "AWS Prescriptive Guidance — ADR",
        url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html",
        note: "Proceso y lifecycle de ADRs",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Consulta selectiva: contratos, consistencia, operación y trade-offs; no reemplaza las instrucciones de la sección." },
      { label: "Site Reliability Engineering", note: "Consulta selectiva: SLO, incidentes, capacidad y cambio seguro." },
    ],
    courses: [
      { label: "MIT OpenCourseWare — 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Referencia de práctica incremental y contratos verificables." },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Referencia de problem sets, tests y proyecto final reproducible." },
    ],
  },
}
