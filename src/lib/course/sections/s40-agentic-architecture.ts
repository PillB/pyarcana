import type { CourseSection } from '../../types'

export const section40: CourseSection = {
  id: "agentic-architecture",
  index: 40,
  title: "Arquitectura, DDD y decisiones técnicas",
  shortTitle: "Arquitectura y DDD",
  tagline: "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (banca, fintech y operaciones en LatAm), arquitectura, DDD y decisiones técnicas convierten requisitos en fronteras de código y evidencia revisable. El portfolio de esta sección es un dossier con escenarios de quality attributes, context map, C4 (context/container) y ADRs con alternativas, consecuencias y plan de reversión; se promueve solo cuando cada flujo conserva medida, dueño y consecuencia.",
  learningOutcomes: [
    { text: "Redactar requisitos funcionales y quality-attribute scenarios con fuente, estímulo, entorno, respuesta, umbral y dueño contactable" },
    { text: "Comparar alternativas de diseño con score de costo ponderado (menor es mejor), riesgo residual y dueño que acepta el residual" },
    { text: "Diseñar capas con alta cohesión y bajo acoplamiento, sin saltos presentation→infrastructure ni domain→infrastructure" },
    { text: "Aplicar ports/adapters de modo que el dominio dependa de puertos abstractos y los adapters implementen hacia la infraestructura" },
    { text: "Delimitar bounded contexts con lenguaje ubicuo local y context map con traducciones (ACL) entre intake, ER, triage y reporting" },
    { text: "Modelar entities (identidad), value objects (igualdad por valor) y servicios de dominio con invariantes comprobables" },
    { text: "Documentar C4 (context y container) y ADRs aceptados con alternativas, consecuencias y señal de rollback" },
    { text: "Evolucionar APIs y eventos de forma aditiva, con consumer contract en verde y deuda técnica con dueño y fecha de retiro" },
  ],
  theory: [
    {
      heading: "Ruta de S40: Arquitectura, DDD y decisiones técnicas",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Quality attribute (QA):** escenario medible (fuente, estímulo, respuesta, umbral, dueño). **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado. **Bounded context:** frontera de lenguaje ubicuo. **Ports/adapters:** dependencias apuntan al dominio, no al revés. **C4:** context/container/component/code. **ADR:** Architecture Decision Record (contexto, decisión, consecuencias). **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off.",
        "Esta sección abre el Nivel 4 (experto→máster) a partir del cierre CP-N3-C en S39 (triage y controles). Solo reutiliza contratos, pruebas y controles ya enseñados: no hay APIs cloud ni credenciales. El caso `CASO-LIM-040` (Red Andina, Lima sintético) modela un mapa de arquitectura para intake → ER → grafo → triage → reporting → IA auxiliar, sin PII real. Lo que aprendas aquí (ports, evolución aditiva) alimenta S41 (APIs) y deja la orquestación de agentes para más adelante.",
        "Producto incremental: dossier de arquitectura gobernada. Entrada: FR, escenarios de quality attributes, vocabulario ubicuo y restricciones (latencia, dueños, secretos fuera del repo). Salida: capas/ports, bounded contexts, C4 (context/container) y ADRs versionados con medida, dueño y consecuencia. Error de promoción: frontera ambigua, dependencia invertida o trade-off sin umbral.",
        "Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. En cada subtema verás un criterio medible, una demo que calcula el contrato y laboratorio E1/E2/E3 (E1 a menudo ensambla el artefacto: context map, C4+ADR, entity/VO, consumer contract; E2/E3 refuerzan fail-closed). **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.",
      ],
      code: {
        language: 'python',
        title: "s40_map_contract.py",
        code: `def section_contract():
    # Alcance de S40: arquitectura/DDD, no orquestación de agentes
    return {
        "case": "CASO-LIM-040",
        "gates": ["explicit_boundaries", "measure_owner_consequence", "no_inverted_deps"],
        "agent_orchestration_topic": False,
        "pii_allowed": False,
    }

c = section_contract()
print("case", c["case"])
print("agent_orchestration_topic", c["agent_orchestration_topic"])
print("pii_allowed", c["pii_allowed"])
`,
        output: `case CASO-LIM-040
agent_orchestration_topic False
pii_allowed False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "Nota de orientación: S40-T1-A: caso sintético con asserts locales; si falta, no promociones.",
      },
    },
    {
      heading: "Requisitos funcionales y quality attributes",
      subtopicId: "S40-T1-A",
      paragraphs: [
        "Un **requisito funcional (FR)** describe una capacidad del negocio: «el triage de Red Andina acepta un lote sintético y devuelve scores de prioridad». Un **quality attribute (QA)** no se escribe con adjetivos («rápido», «escalable»): se escribe como **escenario medible** con fuente, estímulo, entorno, respuesta, medida y umbral. Sin esos campos, el requisito no es auditable ni negociable.",
        "Contrato de S40-T1-A. Entrada: FR + escenarios QA con `source`, `stimulus`, `environment`, `response`, `observed_ms`/`target_ms` y `owner`. Salida: escenario completo o rechazo. Error local: `REJECT_QA_SCENARIO` si el umbral se viola; si falta el dueño: `REQUEST_QA_OWNER`. No inventes PII ni secretos para «hacerlo real».",
        "En `CASO-LIM-040` (Red Andina, Lima sintético): un pico de 100 req/s en intake con `latency_p95_ms` observada 280 ≤ target 300 y dueño `platform` es evidencia válida. Una latencia 410 ms con el mismo target es breach. Una señal incierta se deriva a revisión humana; nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "functional_quality_attrs.py",
        code: `def qa_complete(qa: dict) -> bool:
    needed = {"source", "stimulus", "environment", "response", "target_ms", "owner"}
    return needed <= qa.keys() and qa.get("observed_ms", 10**9) <= qa["target_ms"]

qa = {
    "source": "ops",
    "stimulus": "100 req/s",
    "environment": "peak",
    "response": "serve",
    "observed_ms": 280,
    "target_ms": 300,
    "owner": "platform",
}
print("complete", qa_complete(qa))
print("attr", "latency_p95_ms")
print("owner", qa["owner"])`,
        output: `complete True
attr latency_p95_ms
owner platform`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S40-T1-B, verifica el contrato ejecutable y el riesgo residual.",
      },
    },
    {
      heading: "Trade-offs, riesgos y criterios medibles",
      subtopicId: "S40-T1-B",
      paragraphs: [
        "Un **trade-off** compara alternativas contra criterios ponderados y registra riesgo residual (probabilidad × impacto) con mitigación. No existe la opción «siempre mejor»: sync puede simplificar la operación y async puede bajar latencia percibida a costa de complejidad de mensajes.",
        "Contrato de decisión S40-T1-B. Entrada: alternativas con **score de costo ponderado** (menor es mejor bajo `min_score`) y residual aceptable (umbral ≤ 2 en el lab). Salida: opción elegida, tabla de scores y dueño que firma el residual. Error: elegir por moda o sin umbral → `REOPEN_TRADEOFF`. Si falta el residual: `ESCALATE_RESIDUAL_RISK`. La tabla se versiona junto al ADR.",
        "Aplicación a `CASO-LIM-040-T1B` (Red Andina, sintético): el score es un **costo ponderado** (menor es mejor). async=2.2 vence a sync=3.8 bajo `min_score`; el riesgo residual de complejidad de mensajes (umbral ≤ 2) lo acepta el owner de plataforma (`arquitectura`), no el revisor de cola.",
      ],
      code: {
        language: 'python',
        title: "tradeoffs_risks_measurable.py",
        code: `def choose_option(opts, residual_ok: int, max_residual: int = 2):
    # score = costo ponderado → menor es mejor
    best = min(opts, key=lambda x: x["score"])
    scores = {o["n"]: o["score"] for o in opts}
    ok = residual_ok <= max_residual
    return best["n"], scores, ok

opts = [{"n": "sync", "score": 3.8}, {"n": "async", "score": 2.2}]
best, scores, residual_ok = choose_option(opts, residual_ok=2)
print("best", best)
print("scores", scores)
print("residual_ok", residual_ok)`,
        output: `best async
scores {'sync': 3.8, 'async': 2.2}
residual_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S40-T2-A exige salida esperada y fail-closed ante breach.",
      },
    },
    {
      heading: "Cohesión, acoplamiento y capas",
      subtopicId: "S40-T2-A",
      paragraphs: [
        "Alta **cohesión** agrupa reglas que cambian por la misma razón (p. ej. scoring de triage junto a su política de abstención). Bajo **acoplamiento** evita que UI o SQL dicten el lenguaje del dominio: presentación habla con application; domain no importa drivers de base de datos ni frameworks web. Si mañana cambias Postgres por un almacén de documentos, el lenguaje de triage no debería reescribirse.",
        "Contrato de capas S40-T2-A. Entrada: lista de capas y aristas de dependencia. Salida: grafo sin saltos prohibidos. **Prohibido:** `presentation→infrastructure` (saltar application) y `domain→infrastructure` (dominio acoplado a infra). **Permitido:** `infrastructure→domain` (el adapter mira hacia adentro). Error local: `REDRAW_BOUNDARY`. Si falta el grafo: `REVIEW_LAYER_OWNER`.",
        "En `CASO-LIM-040`, la UI de intake de Red Andina (formularios sintéticos de Lima) no llama al almacén ER directamente: pasa por application. El worker de infraestructura implementa el port que el dominio declara. Si dibujas presentation→db, redibuja la frontera (`REDRAW_BOUNDARY`) antes de promover el dossier — un salto de capa es un bug de arquitectura, no un atajo de sprint.",
      ],
      code: {
        language: 'python',
        title: "cohesion_coupling_layers.py",
        code: `FORBIDDEN = {("domain", "infrastructure"), ("presentation", "infrastructure")}

def deps_ok(deps: list[tuple[str, str]]) -> bool:
    return all(edge not in FORBIDDEN for edge in deps)

layers = ["presentation", "application", "domain", "infrastructure"]
deps = [
    ("presentation", "application"),
    ("application", "domain"),
    ("infrastructure", "domain"),  # adapter hacia dominio: ok
]
print("layers", layers)
print("deps_ok", deps_ok(deps))
print("domain_pure", ("domain", "infrastructure") not in deps)`,
        output: `layers ['presentation', 'application', 'domain', 'infrastructure']
deps_ok True
domain_pure True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S40-T2-B: fixture S40-T2-B; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "Ports/adapters y dependencia hacia el dominio",
      subtopicId: "S40-T2-B",
      paragraphs: [
        "Un **port** es el contrato que el dominio necesita (p. ej. «dame el caso por id»). Un **adapter** traduce HTTP, SQL o colas a ese contrato. Las flechas de importación apuntan hacia políticas estables: el dominio no importa FastAPI ni SQLAlchemy; el adapter implementa el port y vive en infraestructura.",
        "Contrato hexagonal S40-T2-B. Entrada: nombre de port, adapter que lo implementa, lista de imports del dominio y conteo de contract tests. Salida: dominio testeable con adapter en memoria (`implements_port=True`, `domain_imports=[]`, `contract_tests ≥ 3`). Error: imports de infra en dominio → `INVERT_DEPENDENCY`. Sin tests de contrato → `DEFINE_PORT_CONTRACT`.",
        "En `CASO-LIM-040`, `MemoryCaseRepository` implementa `CaseRepository` sin red ni SQL. Puedes sustituir el adapter por uno SQL en producción sin reescribir la regla de negocio de triage. Si el dominio importa `sqlalchemy` o FastAPI, invierte la dependencia (`INVERT_DEPENDENCY`) antes de promover.",
      ],
      code: {
        language: 'python',
        title: "ports_adapters_domain_dep.py",
        code: `from typing import Protocol

class CaseRepo(Protocol):
    def get(self, cid: str) -> dict: ...

class MemoryCaseRepo:
    def get(self, cid: str) -> dict:
        return {"status": "open", "case_id": cid}

def open_case(repo: CaseRepo, cid: str) -> str:
    # dominio depende del port, no de SQL/HTTP
    return repo.get(cid)["status"]

print("status", open_case(MemoryCaseRepo(), "CASE-1"))
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
          "Para S40-T3-A: fixture S40-T3-A; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "Bounded contexts y lenguaje ubicuo",
      subtopicId: "S40-T3-A",
      paragraphs: [
        "Un **bounded context** da significado local a cada término del lenguaje ubicuo. «Caso» en intake no es el mismo concepto que «record» en ER ni que «ticket» en triage. El **context map** declara relaciones (customer/supplier, ACL, shared kernel) y **traducciones** entre glosarios para no fusionar modelos por accidente.",
        "Contrato de fronteras S40-T3-A. Entrada: conjuntos de términos por contexto y mapa de traducciones. Salida: glosarios **disjuntos** más al menos una traducción explícita (p. ej. case→record). Si hay intersección de términos sin ACL: `SPLIT_CONTEXTS`. Si falta el mapa de traducciones: `WORKSHOP_UBIQUITOUS_LANGUAGE`.",
        "En `CASO-LIM-040`, intake posee `{case}`; ER posee `{record, score}`; la traducción `case→record` es el Anti-Corruption Layer (ACL) que evita que el score de ER contamine el lenguaje de intake. No mezcles «score» en la UI de recepción sin traducir.",
      ],
      code: {
        language: 'python',
        title: "bounded_contexts_ubiquitous.py",
        code: `def contexts_ok(intake: set, er: set, translations: dict) -> bool:
    return intake.isdisjoint(er) and translations.get("case") == "record"

intake, er = {"case"}, {"record", "score"}
translations = {"case": "record"}
print("contexts", sorted(["Intake", "ER"]))
print("disjoint", intake.isdisjoint(er))
print("acl", contexts_ok(intake, er, translations))`,
        output: `contexts ['ER', 'Intake']
disjoint True
acl True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S40-T3-B solo con evidencia reproducible y dueño asignado.",
      },
    },
    {
      heading: "Entities, value objects y servicios de dominio",
      subtopicId: "S40-T3-B",
      paragraphs: [
        "Una **entity** se rastrea por **identidad** a lo largo del tiempo (`CASE-001` sigue siendo el mismo caso aunque cambie su estado). Un **value object (VO)** se compara por **valor** (150 PEN es igual a otro 150 PEN) y suele ser inmutable. Un **servicio de dominio** aloja una regla que no encaja naturalmente en una sola entidad (p. ej. fusionar scores sin guardar estado propio).",
        "Contrato táctico S40-T3-B. Entrada: `entity_id`, VO (monto + moneda), flags de inmutabilidad y servicio sin estado. Salida: invariantes probadas — id estable (`CASE-…`), moneda de negocio `PEN` en el lab, `vo_frozen=True`, `service_stateless=True`. Breach → `REJECT_DOMAIN_MODEL`. Si falta la bandera del servicio → `CLARIFY_INVARIANT`. Anti-patrón: usar el id de la entidad como moneda del VO.",
        "En `CASO-LIM-040`, el caso sintético `CASE-001` porta un VO de 150 PEN inmutable; el servicio de fusión de scores no guarda sesión. ER no implica fraude ni parentesco: solo correspondencia de entidad con score, sujeto a revisión humana.",
      ],
      code: {
        language: 'python',
        title: "entities_vo_services.py",
        code: `def same_entity(a_id: str, b_id: str) -> bool:
    return a_id == b_id  # identidad, no atributos

def same_money(a: dict, b: dict) -> bool:
    return a["amount"] == b["amount"] and a["currency"] == b["currency"]

def merge_scores(a: float, b: float, w: float = 0.5) -> float:
    # servicio de dominio: sin estado propio; no muta entidades
    return round(w * a + (1 - w) * b, 3)

case_a, case_b = "CASE-001", "CASE-001"
vo_a = {"amount": 150, "currency": "PEN"}
vo_b = {"amount": 150, "currency": "PEN"}
print("entity_same", same_entity(case_a, case_b))
print("vo_equal", same_money(vo_a, vo_b))
print("merged", merge_scores(0.8, 0.6))
print("vo_frozen", True)`,
        output: `entity_same True
vo_equal True
merged 0.7
vo_frozen True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S40-T4-A responde por rollback y evidencia; sin dueño no hay promote.",
      },
    },
    {
      heading: "Diagramas C4, flujo y ADRs",
      subtopicId: "S40-T4-A",
      paragraphs: [
        "**C4** comunica arquitectura en capas de zoom: **context** (personas y sistemas externos), **container** (api, worker, db, object store), component y code (opcional en el lab). Un **ADR** (Architecture Decision Record) no es el dibujo final: registra contexto, decisión, **alternatives**, **consequences**, **status** y señal de **rollback**. Un diagrama sin ADR es una foto; un ADR sin rollback es una promesa sin freno de mano.",
        "Contrato documental S40-T4-A. Entrada: niveles C4 presentes y campos del ADR. Salida mínima: `{context, container}` en C4 y `{decision, alternatives, consequences, rollback}` con `status=accepted`. Si el ADR está incompleto o en draft sin campos: `RETURN_ADR_TO_DRAFT`. Si falta el status: `REQUEST_ARCH_REVIEW`.",
        "En `CASO-LIM-040`, el C4 de Red Andina muestra al analista de triage y al banco partner en context; en container aparecen api, worker, db y object_store. El ADR-001 documenta por qué se eligió cola async (picos de intake en Lima), qué alternativa se descartó (sync HTTP) y cómo revertir (`feature_flag_off`).",
        "**Rúbrica de calidad de un ADR** (úsa la en You Do, no solo «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 alternatives** evaluadas, no un monólogo; (3) **consequences** con ganancia y costo residual; (4) **rollback** operable en ≤1 release; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.",
      ],
      code: {
        language: 'python',
        title: "c4_flow_adr.py",
        code: `def adr_ready(c4: set[str], fields: set[str], status: str) -> bool:
    need_c4 = {"context", "container"}
    need_adr = {"decision", "alternatives", "consequences", "rollback"}
    return need_c4 <= c4 and need_adr <= fields and status == "accepted"

c4 = {"context", "container"}
fields = {"context", "decision", "alternatives", "consequences", "rollback"}
print("c4_ok", {"context", "container"} <= c4)
print("adr_ok", adr_ready(c4, fields, "accepted"))
print("status", "accepted")`,
        output: `c4_ok True
adr_ok True
status accepted`,
      },
      callout: {
        type: "tip",
        title: "Contrato local + rúbrica ADR",
        content:
          "Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib.",
      },
    },
    {
      heading: "APIs, eventos, deuda y evolución compatible",
      subtopicId: "S40-T4-B",
      paragraphs: [
        "Los cambios **compatibles** son aditivos: añaden campos o eventos sin romper consumidores de la versión previa. Un **consumer contract** verifica que `v1_fields ⊆ v_next`. La **deuda técnica** no es un chiste de standup: lleva dueño, fecha de retiro y criterio de aceptación.",
        "Contrato de evolución S40-T4-B. Entrada: conjuntos de campos v1 y v1.1, `debt_owner` y `retire_on`. Salida: consumer contract en verde + deuda con dueño y fecha. Si se eliminan campos de v1: `BLOCK_BREAKING_CHANGE`. Si falta la fecha de retiro: `NEGOTIATE_VERSION`. Versiona eventos (`case.created`) al cambiar semántica.",
        "En `CASO-LIM-040`, el payload v1 `{case_id, status}` sigue legible en v1.1 con `priority` añadido: un consumidor antiguo permanece en verde. La deuda del job async de cola de intake tiene dueño `platform` y retiro planificado `2026-12-01`; sin `retire_on` no se negocia versión a ciegas.",
      ],
      code: {
        language: 'python',
        title: "apis_events_debt_compat.py",
        code: `def consumer_view(payload: dict) -> str:
    return f"{payload['case_id']}:{payload['status']}"

def additive_ok(v1: dict, v_next: dict) -> bool:
    return all(v_next.get(k) == v for k, v in v1.items()) and len(v_next) >= len(v1)

v1 = {"case_id": "CASE-1", "status": "open"}
v11 = {**v1, "priority": "normal"}
print("v1", consumer_view(v1))
print("compat", consumer_view(v11))
print("additive", additive_ok(v1, v11) and "priority" in v11)`,
        output: `v1 CASE-1:open
compat CASE-1:open
additive True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S40-T4-B: conserva el consumer contract de la versión previa en verde, evidencia de `BLOCK_BREAKING_CHANGE` y ruta humana `NEGOTIATE_VERSION`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S40 (Arquitectura, DDD y decisiones técnicas) alineadas a CP-N4-A. Cada demo calcula el contrato del subtema con stdlib — no llama servicios externos.",
    steps: [
      {
        demoId: "S40-T1-A-DEMO",
        subtopicId: "S40-T1-A",
        environment: "local-python",
        description: "Demo: escenario QA completo (fuente, estímulo, umbral, dueño) para intake Red Andina",
        code: {
          language: 'python',
          title: "demo_functional_quality_attrs.py",
          code: `def qa_complete(qa: dict) -> bool:
    needed = {"source", "stimulus", "environment", "response", "target_ms", "owner"}
    return needed <= qa.keys() and qa.get("observed_ms", 10**9) <= qa["target_ms"]

qa = {
    "source": "ops",
    "stimulus": "100 req/s",
    "environment": "peak_lima",
    "response": "serve",
    "observed_ms": 250,
    "target_ms": 300,
    "owner": "platform",
}
print("complete", qa_complete(qa))
print("attr", "latency_p95_ms")
print("owner", qa["owner"])`,
          output: `complete True
attr latency_p95_ms
owner platform`,
        },
        why: "Construye un escenario QA con fuente, estímulo, entorno peak_lima, respuesta, observed≤target y dueño `platform`. Sin umbral o sin dueño el escenario no es auditable: el gate pide medida + dueño, no adjetivos como «rápido».",
      },
      {
        demoId: "S40-T1-B-DEMO",
        subtopicId: "S40-T1-B",
        environment: "local-python",
        description: "Demo: trade-off por costo ponderado (menor es mejor) + residual ≤ 2",
        code: {
          language: 'python',
          title: "demo_tradeoffs_risks_measurable.py",
          code: `def choose_option(opts, residual_ok: int, max_residual: int = 2):
    # score = costo ponderado → menor es mejor (no maximices utilidad)
    best = min(opts, key=lambda x: x["score"])
    scores = {o["n"]: o["score"] for o in opts}
    ok = residual_ok <= max_residual
    return best["n"], scores, ok

opts = [{"n": "sync", "score": 3.8}, {"n": "async", "score": 2.2}]
best, scores, residual_ok = choose_option(opts, residual_ok=2)
print("best", best)
print("scores", scores)
print("residual_ok", residual_ok)`,
          output: `best async
scores {'sync': 3.8, 'async': 2.2}
residual_ok True`,
        },
        why: "Elige async porque 2.2 < 3.8 bajo min_score (costo ponderado, menor es mejor) y el residual 2 no supera el umbral del owner. Si maximizaras el score «por costumbre de ML», promoverías sync y romperías el trade-off medible.",
      },
      {
        demoId: "S40-T2-A-DEMO",
        subtopicId: "S40-T2-A",
        environment: "local-python",
        description: "Demo: grafo de capas sin saltos prohibidos ni domain→infrastructure",
        code: {
          language: 'python',
          title: "demo_cohesion_coupling_layers.py",
          code: `FORBIDDEN = {("domain", "infrastructure"), ("presentation", "infrastructure")}

def deps_ok(deps: list[tuple[str, str]]) -> bool:
    return all(edge not in FORBIDDEN for edge in deps)

layers = ["presentation", "application", "domain", "infrastructure"]
deps = [
    ("presentation", "application"),
    ("application", "domain"),
    ("infrastructure", "domain"),
]
print("layers", layers)
print("deps_ok", deps_ok(deps))
print("domain_pure", ("domain", "infrastructure") not in deps)`,
          output: `layers ['presentation', 'application', 'domain', 'infrastructure']
deps_ok True
domain_pure True`,
        },
        why: "Valida aristas del grafo de capas: presentation→application→domain e infrastructure→domain están permitidas; presentation→infrastructure y domain→infrastructure son breach. Evidencia = diagrama de dependencias, no conteo de módulos.",
      },
      {
        demoId: "S40-T2-B-DEMO",
        subtopicId: "S40-T2-B",
        environment: "local-python",
        description: "Demo: dominio depende de Protocol CaseRepo; MemoryCaseRepo es el adapter",
        code: {
          language: 'python',
          title: "demo_ports_adapters_domain_dep.py",
          code: `from typing import Protocol

class CaseRepo(Protocol):
    def get(self, cid: str) -> dict: ...

class MemoryCaseRepo:
    def get(self, cid: str) -> dict:
        return {"status": "open", "case_id": cid}

def open_case(repo: CaseRepo, cid: str) -> str:
    # dominio tipa el port; no importa SQLAlchemy ni FastAPI
    return repo.get(cid)["status"]

print("status", open_case(MemoryCaseRepo(), "CASE-9"))
print("dep", "domain<-adapters")
print("implements_port", True)`,
          output: `status open
dep domain<-adapters
implements_port True`,
        },
        why: "El dominio recibe un `CaseRepo` (port) y el adapter en memoria cumple el contrato. La flecha de dependencia va hacia el dominio: puedes cambiar MemoryCaseRepo por un SQL real sin reescribir `open_case`. El flag `implements_port` es la evidencia de DIP, no el sufijo del nombre.",
      },
      {
        demoId: "S40-T3-A-DEMO",
        subtopicId: "S40-T3-A",
        environment: "local-python",
        description: "Demo: ACL de ER→intake que oculta score y expone solo case_id/source",
        code: {
          language: 'python',
          title: "demo_bounded_contexts_ubiquitous.py",
          code: `def translate_to_intake(raw: dict) -> dict:
    # ACL: ER no expone Score hacia intake; solo case_id + source
    return {"case_id": raw["id"], "source": raw["channel"]}

packet = translate_to_intake({"id": "T-100", "channel": "email", "score": 0.9})
print(packet)
print("acl", "score" not in packet)
print("no_leak", True)`,
          output: `{'case_id': 'T-100', 'source': 'email'}
acl True
no_leak True`,
        },
        why: "Traduce un paquete ER al lenguaje de intake y elimina `score`. El ACL protege el bounded context: cada glosario local se mantiene disjunto y las traducciones se declaran, no se improvisan en la UI.",
      },
      {
        demoId: "S40-T3-B-DEMO",
        subtopicId: "S40-T3-B",
        environment: "local-python",
        description: "Demo: entity identity + VO Money (PEN) + servicio de fusión sin estado",
        code: {
          language: 'python',
          title: "demo_entities_vo_services.py",
          code: `def same_entity(a: str, b: str) -> bool:
    return a == b  # identidad estable

def same_vo(a: dict, b: dict) -> bool:
    return a == b  # igualdad por valor (amount+currency)

def merge_scores(a: float, b: float, w: float = 0.5) -> float:
    return round(w * a + (1 - w) * b, 3)  # servicio sin estado

entity = "CASE-001"
vo_a = {"amount": 150, "currency": "PEN"}
vo_b = {"amount": 150, "currency": "PEN"}
print("entity", entity, "same", same_entity(entity, "CASE-001"))
print("vo_equal", same_vo(vo_a, vo_b))
print("merged", merge_scores(0.8, 0.6))
print("vo_frozen", True)
print("service_stateless", True)`,
          output: `entity CASE-001 same True
vo_equal True
merged 0.7
vo_frozen True
service_stateless True`,
        },
        why: "Contrasta identidad de entity (`CASE-001`) con igualdad por valor del VO Money en PEN, y calcula un servicio de fusión de scores sin guardar sesión. `vo_frozen` prohíbe mutar el monto in-place; el servicio se prueba aparte del ciclo de vida de la entity.",
      },
      {
        demoId: "S40-T4-A-DEMO",
        subtopicId: "S40-T4-A",
        environment: "local-python",
        description: "Demo: checklist C4 context/container + ADR accepted con rollback",
        code: {
          language: 'python',
          title: "demo_c4_flow_adr.py",
          code: `def adr_ready(c4: set[str], fields: set[str], status: str) -> bool:
    return {"context", "container"} <= c4 and {
        "decision", "alternatives", "consequences", "rollback"
    } <= fields and status == "accepted"

print("c4_ok", {"context", "container"} <= {"context", "container"})
print("adr_ok", adr_ready(
    {"context", "container"},
    {"context", "decision", "alternatives", "consequences", "rollback"},
    "accepted",
))
print("status", "accepted")`,
          output: `c4_ok True
adr_ok True
status accepted`,
        },
        why: "Comprueba niveles C4 mínimos (context + container) y campos de ADR (decision, alternatives, consequences, rollback) con status accepted. Un dibujo sin ADR o un ADR sin plan de reversión no pasan el gate documental.",
      },
      {
        demoId: "S40-T4-B-DEMO",
        subtopicId: "S40-T4-B",
        environment: "local-python",
        description: "Demo: evolución aditiva (v1 ⊆ v1.1) + deuda con dueño y retire_on",
        code: {
          language: 'python',
          title: "demo_apis_events_debt_compat.py",
          code: `def additive_ok(v1: set, v11: set) -> bool:
    return v1 <= v11  # consumer contract: campos previos se conservan

v1 = {"case_id", "status"}
v11 = {"case_id", "status", "priority"}
debt = {"owner": "platform", "retire_on": "2026-12-01", "event": "case.created"}
print("additive", additive_ok(v1, v11))
print("debt_owner", debt["owner"])
print("retire_on", debt["retire_on"])`,
          output: `additive True
debt_owner platform
retire_on 2026-12-01`,
        },
        why: "Comprueba que v1 ⊆ v1.1 (el consumidor antiguo sigue en verde) y que la deuda del job async tiene dueño y fecha de retiro. Sin `retire_on` no se negocia versión a ciegas; borrar un campo de v1 es `BLOCK_BREAKING_CHANGE`.",
      },
    ],
  },
  weDo: {
    intro: "S40 · Laboratorio del dossier de arquitectura gobernada para Red Andina (organización ficticia, Lima sintético): 24 retos locales sobre CASO-LIM-040. E1 repara un defecto y, en varios subtemas, ensambla un artefacto de oficio (context map, ports/DIP, entity/VO, mini C4+ADR, consumer contract). E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed (CONTINUE / breach / REQUEST_*). Fixtures sintéticos con vocabulario intake→ER→triage→reporting.",
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
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "El fixture `CASO-LIM-040-1A` satisface un predicado de dominio real; imprime `S40-T1-A PASS` y el assert booleano pasa.",
        feedback: "S40-T1-A-E1: el PASS exige observed_ms ≤ target_ms y owner truthy. Si invertiste la comparación, el adverso «parece» válido y el happy path falla.",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e1.py",
          code: `# CASO-LIM-040 · QA scenario ops peak
# DEFECT: contrato QA latency invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
record = {"case_id": "CASO-LIM-040-1A", **{"source":"ops","stimulus":"100 req/s","environment":"peak","response":"serve","observed_ms":280,"target_ms":300,"owner":"platform"}}
# DEFECT: p95 en budget usa observed <= target (aquí está invertido)
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
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS REJECT_QA_SCENARIO MISSING:owner`.",
        feedback: "S40-T1-A-E2: tres salidas distintas — umbral OK+owner → PASS; latencia rota → REJECT_QA_SCENARIO; sin owner → MISSING:owner (schema antes que contenido).",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e2.py",
          code: `# CASO-LIM-040 · assess QA latency scenario
# DEFECT: PASS si observed_ms >= target (falla al revés)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "Fixtures `CASO-LIM-040-1A`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T1-A-E3: fail-closed — CONTINUE solo con escenario medible; breach es REJECT_QA_SCENARIO; incertidumbre (sin owner) es REQUEST_QA_OWNER, no CONTINUE silencioso.",
        starterCode: {
          language: 'python',
          title: "s40-t1-a-e3.py",
          code: `# CASO-LIM-040 · decide REJECT_QA_SCENARIO
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
        instruction: "S40-T1-B-E1 · Compara el trade-off sobre `CASO-LIM-040-1B`. El score es un **costo ponderado** (menor es mejor): `selected` debe ser la clave de menor score y `residual_risk` ≤ 2. Reemplaza la expresión booleana defectuosa (el starter usa max en vez de min). Salida exacta: `S40-T1-B PASS`; el adverso en E2 activa `REOPEN_TRADEOFF`.",
        hint: "score = costo → min(scores); residual_risk ≤ 2; risk_owner debe existir en el fixture.",
        hints: [
          "selected == min(scores, key=scores.get) and residual_risk <= 2.",
          "No uses max: un score alto es peor costo, no mejor utilidad.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "El fixture `CASO-LIM-040-1B` satisface un predicado de dominio real; imprime `S40-T1-B PASS` y el assert booleano pasa.",
        feedback: "S40-T1-B-E1: score = costo (menor es mejor). selected debe ser min(scores) y residual_risk ≤ 2; el starter usa max — invierte a min.",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e1.py",
          code: `# CASO-LIM-040 · architecture tradeoff scores
# DEFECT: selección tradeoff invertida
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
record = {"case_id": "CASO-LIM-040-1B", **{"scores":{"sync":3.8,"async":2.2},"selected":"async","risk_owner":"arquitectura","residual_risk":2}}
# DEFECT: usa max (utilidad) en vez de min (costo ponderado, menor es mejor)
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
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `residual_risk` ausente y produce exactamente `PASS REOPEN_TRADEOFF MISSING:residual_risk`.",
        feedback: "S40-T1-B-E2: tabla de tres rutas — min_score+residual OK → PASS; moda o residual alto → REOPEN_TRADEOFF; sin residual_risk → MISSING (no inventes el residual).",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e2.py",
          code: `# CASO-LIM-040 · assess tradeoff scores
# DEFECT: PASS si selected es max score (pred invertido de riesgo)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "Fixtures `CASO-LIM-040-1B`, adverso y sin `residual_risk` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T1-B-E3: CONTINUE solo con trade-off medible; breach → REOPEN_TRADEOFF; sin residual → ESCALATE_RESIDUAL_RISK (el owner no firma a ciegas).",
        starterCode: {
          language: 'python',
          title: "s40-t1-b-e3.py",
          code: `# CASO-LIM-040 · decide REOPEN_TRADEOFF
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
        instruction: "S40-T2-A-E1 · Filtra el contrato de capas sobre `CASO-LIM-040-2A`. La entrada es el dict completo del starter; la operación debe demostrar grafo sin `domain→infrastructure` ni `presentation→infrastructure` (sí se permite `infrastructure→domain`). Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S40-T2-A PASS`; el fixture adverso en E2 activa `REDRAW_BOUNDARY`.",
        hint: "Relaciona los campos `layers` y `dependencies` con las aristas prohibidas de S40-T2-A.",
        hints: [
          "Convierte cada edge a tuple y compáralo con el conjunto forbidden {(domain, infrastructure), (presentation, infrastructure)}.",
          "El fixture válido tiene presentation→application, application→domain e infrastructure→domain; layers[2] debe ser domain.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "El fixture `CASO-LIM-040-2A` satisface un predicado de dominio real; imprime `S40-T2-A PASS` y el assert booleano pasa.",
        feedback: "S40-T2-A-E1: forbidden = {(domain,infrastructure), (presentation,infrastructure)}. Construye tuple(edge); infrastructure→domain sí está permitido.",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e1.py",
          code: `# CASO-LIM-040 · layered architecture deps
# DEFECT: dependencias de capas invertidas
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
record = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
# DEFECT: dominio no debe depender de infrastructure en todas las aristas
meets_contract = all(edge[1] == "infrastructure" for edge in record["dependencies"])
status = "PASS" if meets_contract else "REDRAW_BOUNDARY"
print("S40-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
forbidden = {("domain", "infrastructure"), ("presentation", "infrastructure")}
meets_contract = (
    all(tuple(edge) not in forbidden for edge in record["dependencies"])
    and record["layers"][2] == "domain"
)
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
        instruction: "S40-T2-A-E2 · Clasifica tres rutas de capas: fixture válido, fixture adverso (incluye saltos prohibidos) y registro sin `dependencies`. Entrada: dict con case_id, layers, dependencies. Salidas exactas: `PASS`, `REDRAW_BOUNDARY`, `MISSING:dependencies`. Corrige solo la decisión de dominio; conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
          "Después aplica forbidden = domain→infrastructure y presentation→infrastructure; el adverso falla por contenido, no por schema.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `dependencies` ausente y produce exactamente `PASS REDRAW_BOUNDARY MISSING:dependencies`.",
        feedback: "S40-T2-A-E2: grafo limpio → PASS; cualquier arista prohibida → REDRAW_BOUNDARY; sin dependencies → MISSING (no asumas un grafo vacío).",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e2.py",
          code: `# CASO-LIM-040 · assess layer dependencies
# DEFECT: PASS si todo depende de infrastructure (límites malos)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(edge[1] == "infrastructure" for edge in record["dependencies"]) else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"],["presentation","infrastructure"]]}}
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
    forbidden = {("domain", "infrastructure"), ("presentation", "infrastructure")}
    ok = (
        all(tuple(edge) not in forbidden for edge in record["dependencies"])
        and record["layers"][2] == "domain"
    )
    return "PASS" if ok else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"],["presentation","infrastructure"]]}}
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
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "Fixtures `CASO-LIM-040-2A`, adverso y sin `dependencies` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T2-A-E3: CONTINUE solo con capas limpias; saltos de capa → REDRAW_BOUNDARY; grafo ausente → REVIEW_LAYER_OWNER (incertidumbre ≠ breach).",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e3.py",
          code: `# CASO-LIM-040 · decide REDRAW_BOUNDARY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "layers", "dependencies"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if all(edge[1] == "infrastructure" for edge in record["dependencies"]) else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"],["presentation","infrastructure"]]}}
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
    forbidden = {("domain", "infrastructure"), ("presentation", "infrastructure")}
    ok = (
        all(tuple(edge) not in forbidden for edge in record["dependencies"])
        and record["layers"][2] == "domain"
    )
    return "CONTINUE" if ok else "REDRAW_BOUNDARY"

valid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
invalid = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["domain","infrastructure"],["presentation","infrastructure"]]}}
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
        instruction: "S40-T2-B-E1 · **Oficio hexagonal (DIP)**: el starter modela el port `CaseRepository` y el adapter `MemoryCaseRepository` de Red Andina. El dominio solo debe depender del port (`implements_port=True`, `domain_imports=[]`, ≥3 contract tests). Corrige el DEFECT que exige adapter==port e imports de infra. Salida exacta: `S40-T2-B PASS`; el adverso en E2 (sqlalchemy en dominio) activa `INVERT_DEPENDENCY`.",
        hint: "Usa el flag explícito `implements_port` — no inventes reglas por sufijo del nombre del adapter.",
        hints: [
          "Predicado: implements_port is True and not domain_imports and contract_tests >= 3.",
          "El DEFECT del starter exige adapter==port e imports no vacíos: invierte esa lógica y lee el flag.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "El fixture hexagonal de `CASO-LIM-040-2B` demuestra DIP con adapter en memoria; imprime `S40-T2-B PASS`.",
        feedback: "S40-T2-B-E1: evidencia de DIP = implements_port + domain_imports vacío + contract_tests≥3. El nombre del adapter no es la regla; imports de sqlalchemy en dominio sí son breach.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e1.py",
          code: `# CASO-LIM-040 · oficio ports/adapters (DIP)
# DEFECT: exige adapter==port e imports de infra (rompe DIP)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
port = "CaseRepository"
adapter = "MemoryCaseRepository"
implements_port = True  # MemoryCaseRepo cumple el Protocol
domain_imports: list[str] = []  # dominio no importa sqlalchemy/fastapi
contract_tests = 3
record = {
    "case_id": "CASO-LIM-040-2B",
    "port": port,
    "adapter": adapter,
    "implements_port": implements_port,
    "domain_imports": domain_imports,
    "contract_tests": contract_tests,
}
# DEFECT: confunde igualdad de nombres con DIP
meets_contract = record["adapter"] == record["port"] and bool(record["domain_imports"])
status = "PASS" if meets_contract else "INVERT_DEPENDENCY"
print("S40-T2-B", status)
print("dep", "domain<-adapters" if record["implements_port"] and not record["domain_imports"] else "domain->infra")
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t2-b-e1.py",
          code: `port = "CaseRepository"
adapter = "MemoryCaseRepository"
implements_port = True
domain_imports: list[str] = []
contract_tests = 3
record = {
    "case_id": "CASO-LIM-040-2B",
    "port": port,
    "adapter": adapter,
    "implements_port": implements_port,
    "domain_imports": domain_imports,
    "contract_tests": contract_tests,
}
meets_contract = (
    record.get("implements_port") is True
    and not record["domain_imports"]
    and record["contract_tests"] >= 3
)
status = "PASS" if meets_contract else "INVERT_DEPENDENCY"
print("S40-T2-B", status)
print("dep", "domain<-adapters" if meets_contract else "domain->infra")
assert meets_contract is True` ,
          output: `S40-T2-B PASS
dep domain<-adapters` ,
        },
      },
      {
        id: "S40-T2-B-E2",
        subtopicId: "S40-T2-B",
        kind: "independent",
        instruction: "S40-T2-B-E2 · Audita tres rutas hexagonal: fixture válido (`implements_port` + sin imports de infra + ≥3 tests), fixture adverso y registro sin `contract_tests`. Entrada: dict con case_id, port, adapter, implements_port, domain_imports, contract_tests. Salidas exactas: `PASS`, `INVERT_DEPENDENCY`, `MISSING:contract_tests`.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después: implements_port is True and not domain_imports and contract_tests >= 3. El adverso falla por contenido (sqlalchemy / implements_port False).",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS INVERT_DEPENDENCY MISSING:contract_tests`.",
        feedback: "S40-T2-B-E2: no uses endswith del nombre del adapter; el contrato es el flag implements_port más la ausencia de imports de infra.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e2.py",
          code: `# CASO-LIM-040 · assess ports/adapters
# DEFECT: PASS si adapter==port y domain_imports (inversión rota)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "port", "adapter", "implements_port", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["adapter"] == record["port"] and bool(record["domain_imports"]) else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","implements_port":True,"domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","implements_port":False,"domain_imports":["sqlalchemy"],"contract_tests":0}}
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
    required = {"case_id", "port", "adapter", "implements_port", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        record.get("implements_port") is True
        and not record["domain_imports"]
        and record["contract_tests"] >= 3
    )
    return "PASS" if ok else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","implements_port":True,"domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","implements_port":False,"domain_imports":["sqlalchemy"],"contract_tests":0}}
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
        instruction: "S40-T2-B-E3 · Recupera fallo cerrado hexagonal: `CASO-LIM-040-2B` → CONTINUE, adverso → `INVERT_DEPENDENCY`, sin `contract_tests` → `DEFINE_PORT_CONTRACT`. Corrige la rama missing y el predicado invertido sin rellenar evidencia. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos: implements_port is True and not domain_imports and contract_tests >= 3 → CONTINUE.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "Fixtures `CASO-LIM-040-2B`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T2-B-E3: uncertainty (DEFINE_PORT_CONTRACT) ≠ breach (INVERT_DEPENDENCY); el flag implements_port es la evidencia de DIP, no el sufijo del nombre.",
        starterCode: {
          language: 'python',
          title: "s40-t2-b-e3.py",
          code: `# CASO-LIM-040 · decide INVERT_DEPENDENCY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "port", "adapter", "implements_port", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["adapter"] == record["port"] and bool(record["domain_imports"]) else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","implements_port":True,"domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","implements_port":False,"domain_imports":["sqlalchemy"],"contract_tests":0}}
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
    required = {"case_id", "port", "adapter", "implements_port", "domain_imports", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "DEFINE_PORT_CONTRACT"
    ok = (
        record.get("implements_port") is True
        and not record["domain_imports"]
        and record["contract_tests"] >= 3
    )
    return "CONTINUE" if ok else "INVERT_DEPENDENCY"

valid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"MemoryCaseRepository","implements_port":True,"domain_imports":[],"contract_tests":3}}
invalid = {"case_id": "CASO-LIM-040-2B", **{"port":"CaseRepository","adapter":"SqlRepo","implements_port":False,"domain_imports":["sqlalchemy"],"contract_tests":0}}
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
        instruction: "S40-T3-A-E1 · **Oficio de context map** (no solo un booleano): el starter trae filas de mapa para Red Andina (`intake` vs `er`) y un ACL `case→record`. Corrige el DEFECT para que el contrato pase solo si (1) los glosarios de cada fila son **disjuntos**, (2) existe la traducción `case→record` y (3) se imprime el resumen del mapa. Salida exacta: `S40-T3-A PASS`. En E2 el adverso (término `case` en ambos lados) activa `SPLIT_CONTEXTS`.",
        hint: "Construye conjuntos de términos por BC y exige `isdisjoint` + `translations['case'] == 'record'`.",
        hints: [
          "Lee `rows[0]['terms']` e `rows[1]['terms']`; no uses intersección como éxito.",
          "El ACL mínimo del lab es `translations.get('case') == 'record'`. Imprime también el mapa legible.",
        ],
        edgeCases: ["falta translations", "fixture adverso: término compartido entre intake y er (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "El context map de `CASO-LIM-040-3A` es disjunto con ACL; imprime `S40-T3-A PASS` y el assert booleano pasa.",
        feedback: "S40-T3-A-E1: el artefacto es el mapa (BC + términos + ACL). isdisjoint + case→record; intersección de glosarios ⇒ SPLIT_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e1.py",
          code: `# CASO-LIM-040 · mini context map (oficio)
# DEFECT: trata el solape de glosarios como éxito
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
case_id = "CASO-LIM-040-3A"
rows = [
    {"bc": "intake", "terms": {"case"}, "relation": "customer"},
    {"bc": "er", "terms": {"record", "score"}, "relation": "supplier"},
]
translations = {"case": "record"}  # ACL: intake.case → er.record
# DEFECT: PASS si hay intersección (rompe el lenguaje ubicuo local)
meets_contract = bool(rows[0]["terms"] & rows[1]["terms"])
status = "PASS" if meets_contract else "SPLIT_CONTEXTS"
print("S40-T3-A", status)
print("map", [(r["bc"], sorted(r["terms"])) for r in rows])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-a-e1.py",
          code: `case_id = "CASO-LIM-040-3A"
rows = [
    {"bc": "intake", "terms": {"case"}, "relation": "customer"},
    {"bc": "er", "terms": {"record", "score"}, "relation": "supplier"},
]
translations = {"case": "record"}
meets_contract = (
    rows[0]["terms"].isdisjoint(rows[1]["terms"])
    and translations.get("case") == "record"
)
status = "PASS" if meets_contract else "SPLIT_CONTEXTS"
print("S40-T3-A", status)
print("map", [(r["bc"], sorted(r["terms"])) for r in rows])
assert meets_contract is True` ,
          output: `S40-T3-A PASS
map [('intake', ['case']), ('er', ['record', 'score'])]` ,
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
        edgeCases: ["falta translations", "fixture adverso: término compartido entre intake y er (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `translations` ausente y produce exactamente `PASS SPLIT_CONTEXTS MISSING:translations`.",
        feedback: "S40-T3-A-E2: glosarios disjuntos + ACL → PASS; solape de términos → SPLIT_CONTEXTS; sin translations → MISSING (no improvises el ACL).",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e2.py",
          code: `# CASO-LIM-040 · assess bounded contexts
# DEFECT: PASS si intake∩er no vacío (acoplamiento)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta translations", "fixture adverso: término compartido entre intake y er (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "Fixtures `CASO-LIM-040-3A`, adverso y sin `translations` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T3-A-E3: CONTINUE con fronteras claras; solape → SPLIT_CONTEXTS; sin mapa de traducciones → WORKSHOP_UBIQUITOUS_LANGUAGE.",
        starterCode: {
          language: 'python',
          title: "s40-t3-a-e3.py",
          code: `# CASO-LIM-040 · decide SPLIT_CONTEXTS
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
        instruction: "S40-T3-B-E1 · **Oficio táctico entity/VO/servicio** (calcula, no solo flags): el starter trae dos referencias al caso `CASE-001`, dos VOs Money 150 PEN y un servicio `merge_scores`. Corrige el DEFECT: el contrato pasa solo si (1) `same_entity` por identidad, (2) `same_money` por valor, (3) `vo_frozen` y (4) el servicio devuelve 0.7 sin mutar entidades. Salida exacta: `S40-T3-B PASS`. En E2 el adverso (USD / id vacío) activa `REJECT_DOMAIN_MODEL`.",
        hint: "No compares `currency` con `entity_id`. Identidad = ids iguales; VO = amount+currency; servicio = media ponderada sin estado.",
        hints: [
          "same_entity(entity_a, entity_b) y same_money(vo_a, vo_b); currency debe ser PEN.",
          "merge_scores(0.8, 0.6) → 0.7; service_stateless y vo_frozen deben ser True.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "El modelo táctico de `CASO-LIM-040-3B` prueba identidad, VO PEN y servicio sin estado; imprime `S40-T3-B PASS`.",
        feedback: "S40-T3-B-E1: el artefacto es el contraste identidad vs valor + servicio stateless. DEFECT mezclaba currency con entity_id — eso rompe el modelo táctico.",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e1.py",
          code: `# CASO-LIM-040 · oficio entity / VO / servicio de dominio
# DEFECT: confunde moneda del VO con id de la entity
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
entity_a = "CASE-001"
entity_b = "CASE-001"
vo_a = {"amount": 150, "currency": "PEN"}
vo_b = {"amount": 150, "currency": "PEN"}
vo_frozen = True
service_stateless = True

def same_entity(a: str, b: str) -> bool:
    return a == b

def same_money(a: dict, b: dict) -> bool:
    return a["amount"] == b["amount"] and a["currency"] == b["currency"]

def merge_scores(x: float, y: float, w: float = 0.5) -> float:
    return round(w * x + (1 - w) * y, 3)

merged = merge_scores(0.8, 0.6)
# DEFECT: trata currency como si fuera entity_id
meets_contract = vo_a["currency"] == entity_a
status = "PASS" if meets_contract else "REJECT_DOMAIN_MODEL"
print("S40-T3-B", status)
print("entity_same", same_entity(entity_a, entity_b), "vo_equal", same_money(vo_a, vo_b), "merged", merged)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t3-b-e1.py",
          code: `entity_a = "CASE-001"
entity_b = "CASE-001"
vo_a = {"amount": 150, "currency": "PEN"}
vo_b = {"amount": 150, "currency": "PEN"}
vo_frozen = True
service_stateless = True

def same_entity(a: str, b: str) -> bool:
    return a == b

def same_money(a: dict, b: dict) -> bool:
    return a["amount"] == b["amount"] and a["currency"] == b["currency"]

def merge_scores(x: float, y: float, w: float = 0.5) -> float:
    return round(w * x + (1 - w) * y, 3)

merged = merge_scores(0.8, 0.6)
meets_contract = (
    entity_a.startswith("CASE-")
    and same_entity(entity_a, entity_b)
    and same_money(vo_a, vo_b)
    and vo_a["currency"] == "PEN"
    and vo_frozen
    and service_stateless
    and merged == 0.7
)
status = "PASS" if meets_contract else "REJECT_DOMAIN_MODEL"
print("S40-T3-B", status)
print("entity_same", same_entity(entity_a, entity_b), "vo_equal", same_money(vo_a, vo_b), "merged", merged)
assert meets_contract is True` ,
          output: `S40-T3-B PASS
entity_same True vo_equal True merged 0.7` ,
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
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `service_stateless` ausente y produce exactamente `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless`.",
        feedback: "S40-T3-B-E2: invariantes OK → PASS; identidad/VO rotos → REJECT_DOMAIN_MODEL; sin service_stateless → MISSING (no asumas el servicio).",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e2.py",
          code: `# CASO-LIM-040 · assess entity vs value object
# DEFECT: PASS si currency==entity_id (mezcla VO/Entity)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "Fixtures `CASO-LIM-040-3B`, adverso y sin `service_stateless` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T3-B-E3: CONTINUE con modelo táctico sano; breach → REJECT_DOMAIN_MODEL; bandera de servicio ausente → CLARIFY_INVARIANT.",
        starterCode: {
          language: 'python',
          title: "s40-t3-b-e3.py",
          code: `# CASO-LIM-040 · decide REJECT_DOMAIN_MODEL
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
        instruction: "S40-T4-A-E1 · **Oficio C4 + ADR** (ensambla el artefacto, no solo nombres de campo): el starter trae un C4 de Red Andina (context/container con personas y cajas) y un ADR-001 con decisión async, alternativas, consecuencias y rollback. Corrige el DEFECT: el contrato pasa solo si hay niveles context+container, el ADR tiene `decision`/`alternatives`/`consequences`/`rollback` y `status == 'accepted'`. Salida exacta: `S40-T4-A PASS`. En You Do reutilizarás esta plantilla para dos ADRs reales del dossier.",
        hint: "Valida claves del dict `adr` y que `c4` contenga listas no vacías en context y container; status debe ser accepted.",
        hints: [
          "need_adr = decision, alternatives, consequences, rollback presentes y truthy; status == 'accepted'.",
          "El DEFECT del starter acepta draft con menos de 3 campos: invierte esa lógica.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "El mini ADR+C4 de `CASO-LIM-040-4A` está completo y accepted; imprime `S40-T4-A PASS`.",
        feedback: "S40-T4-A-E1: el artefacto es el ADR relleno (no un set abstracto). need_c4 + decision/alternatives/consequences/rollback + status accepted.",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e1.py",
          code: `# CASO-LIM-040 · mini C4 + ADR (oficio documental)
# DEFECT: acepta ADR draft incompleto
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
case_id = "CASO-LIM-040-4A"
c4 = {
    "context": ["analista_triage", "banco_partner"],
    "container": ["api", "worker", "db", "object_store"],
}
adr = {
    "id": "ADR-001",
    "decision": "async_queue_for_intake_peaks",
    "alternatives": ["sync_http", "batch_nightly"],
    "consequences": ["lower_p95", "message_complexity"],
    "rollback": "feature_flag_off",
    "status": "accepted",
}
# DEFECT: promueve draft incompleto
meets_contract = adr["status"] == "draft" and len(adr) < 3
status = "PASS" if meets_contract else "RETURN_ADR_TO_DRAFT"
print("S40-T4-A", status)
print("adr", adr["id"], adr["status"])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-a-e1.py",
          code: `case_id = "CASO-LIM-040-4A"
c4 = {
    "context": ["analista_triage", "banco_partner"],
    "container": ["api", "worker", "db", "object_store"],
}
adr = {
    "id": "ADR-001",
    "decision": "async_queue_for_intake_peaks",
    "alternatives": ["sync_http", "batch_nightly"],
    "consequences": ["lower_p95", "message_complexity"],
    "rollback": "feature_flag_off",
    "status": "accepted",
}
need_c4 = bool(c4.get("context")) and bool(c4.get("container"))
need_adr = all(adr.get(k) for k in ("decision", "alternatives", "consequences", "rollback"))
meets_contract = need_c4 and need_adr and adr["status"] == "accepted"
status = "PASS" if meets_contract else "RETURN_ADR_TO_DRAFT"
print("S40-T4-A", status)
print("adr", adr["id"], adr["status"])
assert meets_contract is True` ,
          output: `S40-T4-A PASS
adr ADR-001 accepted` ,
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
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `adr_status` ausente y produce exactamente `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status`.",
        feedback: "S40-T4-A-E2: C4+ADR accepted completo → PASS; draft/incompleto → RETURN_ADR_TO_DRAFT; sin adr_status → MISSING (no asumas accepted).",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e2.py",
          code: `# CASO-LIM-040 · assess ADR completeness
# DEFECT: PASS si draft y fields<3 (ADR incompleto ok)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "Fixtures `CASO-LIM-040-4A`, adverso y sin `adr_status` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T4-A-E3: CONTINUE con documentación aceptada; ADR incompleto → RETURN_ADR_TO_DRAFT; sin status → REQUEST_ARCH_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s40-t4-a-e3.py",
          code: `# CASO-LIM-040 · decide RETURN_ADR_TO_DRAFT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
        instruction: "S40-T4-B-E1 · **Oficio de evolución aditiva** (consumer contract + deuda): el starter trae payload v1 `{case_id, status}` y v1.1 con `priority`, más deuda del job async de intake Red Andina. Corrige el DEFECT: el contrato pasa solo si (1) `v1_fields ⊆ v11_fields`, (2) el consumidor antiguo sigue leyendo `case_id:status` y (3) la deuda tiene `debt_owner` + `retire_on`. Salida exacta: `S40-T4-B PASS`. En E2 borrar un campo de v1 activa `BLOCK_BREAKING_CHANGE`.",
        hint: "Subconjunto correcto: v1 ⊆ v11 (no al revés). Imprime la vista del consumidor y la deuda.",
        hints: [
          "additive_ok = v1_fields <= v11_fields; debt_owner truthy y retire_on no vacío.",
          "consumer_view usa solo case_id y status — debe funcionar igual en v1.1.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "La evolución aditiva de `CASO-LIM-040-4B` conserva el consumer contract y documenta deuda; imprime `S40-T4-B PASS`.",
        feedback: "S40-T4-B-E1: el artefacto es v1⊆v1.1 + vista del consumidor + deuda fechada. DEFECT invertía el subconjunto (pedía v11 ⊂ v1).",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e1.py",
          code: `# CASO-LIM-040 · oficio consumer contract + deuda técnica
# DEFECT: exige v11 ⊂ v1 (rompe evolución aditiva)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
v1_fields = {"case_id", "status"}
v11_fields = {"case_id", "status", "priority"}
v1 = {"case_id": "CASE-1", "status": "open"}
v11 = {**v1, "priority": "normal"}
debt = {"owner": "platform", "retire_on": "2026-12-01", "event": "case.created"}

def consumer_view(payload: dict) -> str:
    return f"{payload['case_id']}:{payload['status']}"

# DEFECT: subconjunto invertido (breaking disfrazado de PASS)
meets_contract = v11_fields < v1_fields
status = "PASS" if meets_contract else "BLOCK_BREAKING_CHANGE"
print("S40-T4-B", status)
print("v1_view", consumer_view(v1), "v11_view", consumer_view(v11))
print("debt", debt["owner"], debt["retire_on"])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s40-t4-b-e1.py",
          code: `v1_fields = {"case_id", "status"}
v11_fields = {"case_id", "status", "priority"}
v1 = {"case_id": "CASE-1", "status": "open"}
v11 = {**v1, "priority": "normal"}
debt = {"owner": "platform", "retire_on": "2026-12-01", "event": "case.created"}

def consumer_view(payload: dict) -> str:
    return f"{payload['case_id']}:{payload['status']}"

meets_contract = (
    v1_fields <= v11_fields
    and consumer_view(v1) == consumer_view(v11)
    and bool(debt["owner"])
    and bool(debt["retire_on"])
)
status = "PASS" if meets_contract else "BLOCK_BREAKING_CHANGE"
print("S40-T4-B", status)
print("v1_view", consumer_view(v1), "v11_view", consumer_view(v11))
print("debt", debt["owner"], debt["retire_on"])
assert meets_contract is True` ,
          output: `S40-T4-B PASS
v1_view CASE-1:open v11_view CASE-1:open
debt platform 2026-12-01` ,
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
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `retire_on` ausente y produce exactamente `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on`.",
        feedback: "S40-T4-B-E2: evolución aditiva + deuda fechada → PASS; romper v1 → BLOCK_BREAKING_CHANGE; sin retire_on → MISSING.",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e2.py",
          code: `# CASO-LIM-040 · assess API versioning
# DEFECT: PASS si v11_fields < v1 (rompe compat al revés)
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def assess(record: dict) -> str:
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
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "Fixtures `CASO-LIM-040-4B`, adverso y sin `retire_on` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S40-T4-B-E3: CONTINUE con compat aditiva; breaking → BLOCK_BREAKING_CHANGE; sin fecha de retiro → NEGOTIATE_VERSION.",
        starterCode: {
          language: 'python',
          title: "s40-t4-b-e3.py",
          code: `# CASO-LIM-040 · decide BLOCK_BREAKING_CHANGE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
def decide(record: dict) -> str:
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
    context: "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida.",
    objectives: [
      "Convertir requisitos, escenarios de calidad, vocabulario de dominio y restricciones en mapa C4, context map, contratos y ADRs versionados con responsables.",
      "Demostrar el gate: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
      "Probar el fallo: si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida, el gate se bloquea (fail-closed).",
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
# Checklist de evidencia CP-N4-A (inicia en False a propósito).
# Rellena los artefactos de abajo con contenido real del dossier;
# solo entonces marca evidence[key] = True. No inviertas el assert.

# Plantilla QA (fuente, estímulo, entorno, respuesta, medida, umbral, dueño)
qa_scenarios = [
    {
        "source": "ops",
        "stimulus": "100 req/s en intake",
        "environment": "peak_lima",
        "response": "serve_with_queue",
        "measure": "latency_p95_ms",
        "observed_ms": None,   # rellena con medición del lab
        "target_ms": 300,
        "owner": "platform",
    },
]

# Context map: BC + términos disjuntos + ACL (como en S40-T3-A-E1)
context_map = {
    "rows": [
        {"bc": "intake", "terms": {"case"}, "relation": "customer"},
        {"bc": "er", "terms": {"record", "score"}, "relation": "supplier"},
        {"bc": "triage", "terms": {"ticket", "priority"}, "relation": "downstream"},
        {"bc": "reporting", "terms": {"report", "kpi"}, "relation": "consumer"},
    ],
    "translations": {"case": "record"},  # ACL mínimo; amplía para tu diseño
}

# C4 context + container (como en S40-T4-A-E1)
c4 = {
    "context": ["analista_triage", "banco_partner", "ops_red_andina"],
    "container": ["api", "worker", "db", "object_store"],
}

# Dos ADRs (rúbrica: contexto de negocio, ≥2 alternatives, residual, rollback operable)
adrs = [
    {
        "id": "ADR-001",
        "context": None,  # p. ej. picos de intake en Lima sintético
        "decision": None,  # p. ej. async_queue_for_intake_peaks
        "alternatives": [],  # ≥2 opciones evaluadas
        "consequences": [],  # ganancia + costo residual
        "rollback": None,  # operable en ≤1 release
        "status": "draft",  # accepted solo con dueño que firma
    },
    {
        "id": "ADR-002",
        "context": None,
        "decision": None,
        "alternatives": [],
        "consequences": [],
        "rollback": None,
        "status": "draft",
    },
]

REQUIRED = [
    "qa_scenarios",          # escenarios QA completos y medibles
    "context_map",           # intake / ER / relación / triage / reporting / IA
    "c4_context_container",  # C4 context + container
    "adrs_x2",               # dos ADRs accepted con rollback
]
evidence = {
    "qa_scenarios": False,
    "context_map": False,
    "c4_context_container": False,
    "adrs_x2": False,
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

def adrs_accepted(items: list[dict]) -> bool:
    need = ("decision", "alternatives", "consequences", "rollback")
    return len(items) >= 2 and all(
        all(a.get(k) for k in need) and a.get("status") == "accepted" for a in items
    )

# Cuando completes cada artefacto, activa la bandera correspondiente:
# evidence["qa_scenarios"] = all(q.get("observed_ms") is not None and q["observed_ms"] <= q["target_ms"] for q in qa_scenarios)
# evidence["context_map"] = True  # tras revisar disjuntos + traducciones
# evidence["c4_context_container"] = bool(c4["context"]) and bool(c4["container"])
# evidence["adrs_x2"] = adrs_accepted(adrs)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
print("adr_gate", adrs_accepted(adrs))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · mapa de arquitectura gobernado: completa las plantillas QA, context map, C4 y dos ADRs del starter. Rúbrica ADR: contexto de negocio, ≥2 alternatives, consequences con residual, rollback operable, status accepted firmado por dueño — no archivos vacíos con títulos. Marca evidence en True solo con artefactos reales. El checklist inicia en BLOCKED por diseño — no cambies asserts para forzar READY.",
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
        question: "¿Qué evidencia permite aprobar un quality-attribute scenario en CASO-LIM-040?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "escenario QA completo con umbral y dueño"],
        correctIndex: 3,
        explanation: "La teoría exige escenario QA completo (fuente, estímulo, entorno, respuesta, medida/umbral y dueño); evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre un breach de arquitectura en el You Do, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "emitir BLOCK_ARCHITECTURE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "El contrato falla cerrado con BLOCK_ARCHITECTURE; no convierte incertidumbre o breach en éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate CP-N4-A (mapa de arquitectura gobernado)?",
        options: ["el archivo S40 existe, aunque no pruebe el gate", "el README afirma que funciona", "cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: fronteras explícitas + medida, dueño y consecuencia en cada trade-off.",
      },
      {
        question: "¿Qué tratamiento de CASO-LIM-040 respeta el alcance del curso?",
        options: ["mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 0,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "En ports & adapters (hexagonal), ¿qué dependencia es un breach de frontera?",
        options: ["el dominio importa solo puertos abstractos y los adapters implementan hacia infra", "un ADR registra el trade-off con medida y dueño", "C4 context muestra intake, triage y reporting como cajas separadas", "el dominio importa FastAPI/SQLAlchemy directamente para ir más rápido"],
        correctIndex: 3,
        explanation: "Invertir la dependencia (dominio → framework) acopla el núcleo a la infra; el adapter debe depender del puerto, no al revés.",
      },
      {
        question: "En C4 para CASO-LIM-040, ¿qué pertenece al nivel container y no al context?",
        options: ["la persona «analista de triage» y el sistema «banco partner»", "api, worker, db y object_store dentro de la plataforma Red Andina", "una línea de código de la clase Money VO", "el logo del producto en Figma"],
        correctIndex: 1,
        explanation: "Context muestra personas y sistemas externos; container descompone la aplicación en api/worker/db/object_store.",
      },
      {
        question: "¿Qué campos mínimos hacen aceptable un ADR de evolución de API en S40-T4?",
        options: ["solo el título del ADR", "un screenshot sin decisión", "decision + alternatives + consequences + rollback con status accepted", "la versión de Node aunque el stack sea Python"],
        correctIndex: 2,
        explanation: "Un ADR accepted requiere decisión, alternativas, consecuencias y señal de reversión (rollback), no solo un título o imagen.",
      },
      {
        question: "En evolución de APIs (S40-T4-B), ¿cuándo el consumer contract de la versión previa permanece en verde?",
        options: ["cuando v1_fields ⊆ v11_fields (cambio aditivo) y la deuda tiene dueño y retire_on", "cuando se eliminan campos de v1 para «limpiar» el schema", "cuando el README promete compatibilidad sin pruebas", "cuando se cambia el significado de case.created sin versionar el evento"],
        correctIndex: 0,
        explanation: "Compatibilidad aditiva conserva los campos de v1 en v1.1; borrar o redefinir sin versión es breaking. La deuda técnica exige dueño y fecha de retiro.",
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
        label: "Martin Fowler — Bounded Context",
        url: "https://martinfowler.com/bliki/BoundedContext.html",
        note: "Fronteras de lenguaje ubicuo",
      },
      {
        label: "Hexagonal Architecture (Cockburn)",
        url: "https://alistair.cockburn.us/hexagonal-architecture/",
        note: "Ports/adapters y dependencia hacia el dominio",
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
      {
        label: "Architecture Decision Records (GitHub)",
        url: "https://github.com/joelparkerhenderson/architecture-decision-record",
        note: "Plantillas y ejemplos de ADR",
      },
      {
        label: "Domain-Driven Design Reference (Evans)",
        url: "https://www.domainlanguage.com/ddd/reference/",
        note: "Bounded contexts, entities y lenguaje ubicuo",
      },
      {
        label: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        note: "Trade-offs y escalado conceptual",
      },
      {
        label: "Twelve-Factor App",
        url: "https://12factor.net/",
        note: "Fronteras ops y config",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Contratos, consistencia y trade-offs operativos" },
      { label: "Implementing Domain-Driven Design (Vernon)", note: "Context maps y agregados en la práctica" },
    ],
    courses: [
      { label: "Stanford CS146S / systems design resources", url: "https://web.stanford.edu/class/cs146s/", note: "Diseño de sistemas a escala de curso" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Práctica incremental y contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Problem sets y tests reproducibles" },
      { label: "Coursera software architecture", url: "https://www.coursera.org/courses?query=software%20architecture", note: "Arquitectura y trade-offs" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
    ],
  },
}
