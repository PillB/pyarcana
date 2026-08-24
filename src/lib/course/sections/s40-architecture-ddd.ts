import type { CourseSection } from '../../types'

export const section40: CourseSection = {
  id: "architecture-ddd-decisions",
  index: 40,
  title: "Arquitectura, DDD y decisiones técnicas",
  shortTitle: "Arquitectura y DDD",
  tagline: "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos",
  estimatedHours: 9,
  level: "Producción gobernada",
  phase: 3,
  icon: "Network",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (banca, fintech y operaciones en LatAm), arquitectura, DDD (Domain-Driven Design: diseñar software a partir del lenguaje del negocio) y decisiones técnicas convierten requisitos en fronteras de código revisables. Aquí aprendes a armar un dossier con escenarios de quality attributes, context map, diagramas C4 y ADRs (Architecture Decision Records) con alternativas, consecuencias y plan de reversión. Es la documentación que un comité técnico acepta antes de aprobar un proyecto serio.",
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
      heading: "Arquitectura: poner por escrito la forma que hoy vive en tu cabeza",
      paragraphs: [
        "En S39 cerraste el triage con controles y evidencia. El sistema funciona, pero su forma existe sobre todo en tu memoria: qué habla con qué, quién puede cambiar qué, y qué se rompe si mañana alguien reemplaza el motor de reglas. Esta sección trata de escribir esa forma antes de que el equipo crezca y cada persona recuerde una versión distinta.",
        "Piensa en un plano de edificio y no en una fotografía. La foto muestra cómo se ve hoy; el plano señala cuáles son los muros de carga —lo que no se mueve sin consecuencias— y cuáles son tabiques que cualquiera puede correr un domingo. Un **bounded context** es justamente eso: la frontera dentro de la cual una palabra significa una sola cosa y alguien responde por el modelo. Fuera de ella, «cliente» puede significar algo distinto sin que nadie esté mintiendo.",
        "La arquitectura deja de ser opinión cuando empiezas a medir. Un **quality attribute** es un escenario con número: no «el sistema debe ser rápido», sino «con 200 casos simultáneos el intake responde en menos de dos segundos, y el dueño es el equipo de datos». Cada decisión se archiva en un **ADR** (*Architecture Decision Record*): en qué contexto la tomaste, qué decidiste, qué consecuencias aceptas y cómo se revierte. De ahí sale la regla que gobierna la sección — ningún trade-off se promueve sin medida, dueño y consecuencia.",
        "Falta la dirección de las dependencias. En un diseño de **ports y adapters**, el dominio no sabe si los datos llegan de SQLite, de una API o de un CSV: declara un puerto —lo que necesita recibir— y otra pieza escribe el adaptador que lo cumple. La pregunta que te acompaña durante toda la sección es corta: **si mañana cambio esta pieza, ¿qué más tengo que tocar?** Si la respuesta incluye el dominio, la flecha apunta al revés y el plano miente. Cuidado con la palabra, porque el curso la usará en los dos sentidos: más adelante conocerás el principio de **inversión de dependencias**, que nombra justo lo contrario —el diseño correcto, en el que las flechas apuntan hacia el dominio—. Aquí «al revés» significa que apuntan hacia afuera, hacia el framework.",
        "Un límite honesto antes de empezar: aquí no orquestas agentes ni llamas servicios en la nube. Trabajas con la biblioteca estándar sobre el caso sintético `CASO-LIM-040`, porque lo que se practica es la forma de las decisiones y no la infraestructura que las ejecuta. Los puertos, contextos y ADRs que salgan de aquí son la materia prima que S41 convierte en APIs con contrato.",
      ],
      callout: {
        type: "info",
        title: "Contrato de la sección",
        content:
          "CP-N4-A exige fronteras explícitas y, en cada trade-off, medida, dueño y consecuencia. El caso es sintético (Red Andina, Lima): sin PII real ni secretos en el repo.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia, no de lectura obligatoria: reúne el alcance, el orden de los subtemas y los criterios con que se evalúa la sección. Ábrelo si quieres saber exactamente qué se espera del entregable.",
        "**Producto incremental.** Un dossier de arquitectura gobernada. Recibes requisitos funcionales, escenarios de quality attributes, el vocabulario ubicuo del dominio y las restricciones (latencia, dueños, secretos fuera del repo). Entregas capas y puertos, bounded contexts, un C4 en niveles context y container, y ADRs versionados con medida, dueño y consecuencia. La promoción falla si una frontera queda ambigua, si una dependencia apunta al revés o si un trade-off no trae umbral.",
        "**Orden de los subtemas.** T1 parte de los requisitos y los trade-offs, porque sin criterio medible no hay con qué decidir. T2 traduce esa decisión a capas y puertos. T3 dibuja las fronteras de significado y el modelo que vive dentro de cada una. T4 documenta todo en C4 y ADR, y cierra con la evolución de APIs sin romper a quien ya consume.",
        "**Alcance.** Arquitectura y DDD aplicados al recorrido intake → ER → triage → reporting. La orquestación de agentes LLM queda fuera a propósito. El stack es la biblioteca estándar (dicts y listas), para que la atención esté en las fronteras y no en las dependencias.",
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
        title: "Qué mide este contrato",
        content:
          "Los nombres de los gates son los criterios internos con que se revisa la sección; verlos aquí te dice qué se comprueba, no qué tienes que memorizar.",
      },
    },
    {
      heading: "Requisitos funcionales y quality attributes",
      figure: {
        id: "S40-layer-imports",
        caption:
          "Si el dominio importa FastAPI, cambiar de framework se convierte en reescribir las reglas de negocio.",
        alt:
          "Tres capas apiladas: dominio, aplicación e infraestructura.",
      },
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
        content: "Evidencia mínima de S40-T1-A: verifica un escenario QA con umbral medible y dueño contactable; sin umbral o sin dueño el escenario no es auditable.",
      },
    },
    {
      heading: "Trade-offs, riesgos y criterios medibles",
      figure: {
        id: "S40-ports-adapters",
        caption:
          "Si cambiar un adapter obliga a tocar el dominio, la flecha va al revés y el plano miente.",
        alt:
          "Grafo con dos adapters que implementan un port, y el port definido por el dominio.",
      },
      subtopicId: "S40-T1-B",
      paragraphs: [
        "Un **trade-off** compara alternativas contra criterios ponderados y registra riesgo residual (probabilidad × impacto) con mitigación. No existe la opción «siempre mejor»: sync puede simplificar la operación y async puede bajar latencia percibida a costa de complejidad de mensajes.",
        "Contrato de decisión S40-T1-B. Entrada: alternativas con **score de costo ponderado** (menor es mejor bajo `min_score`) y residual aceptable (umbral ≤ 2 en el lab). Salida: opción elegida, tabla de scores y dueño que firma el residual. Error: elegir por moda o sin umbral → `REOPEN_TRADEOFF`. Si falta el residual: `ESCALATE_RESIDUAL_RISK`. La tabla se versiona junto al ADR.",
        "Aplicación a `CASO-LIM-040-T1B` (Red Andina, sintético): el score es un **costo ponderado** (menor es mejor). async=2.2 vence a sync=3.8 bajo `min_score`; el riesgo residual de complejidad de mensajes (umbral ≤ 2) lo acepta el dueño de plataforma (`arquitectura`), no el revisor de cola.",
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
        content: "Antes de promover S40-T1-B, elige por costo ponderado (menor es mejor) y deja el riesgo residual con umbral y dueño que lo firma; sin residual no hay decisión promocionable.",
      },
    },
    {
      heading: "Cohesión, acoplamiento y capas",
      subtopicId: "S40-T2-A",
      paragraphs: [
        "Alta **cohesión** agrupa reglas que cambian por la misma razón (p. ej. scoring de triage junto a su política de abstención). Bajo **acoplamiento** evita que UI o SQL dicten el lenguaje del dominio: presentación habla con application; domain no importa drivers de base de datos ni frameworks web. Si mañana cambias Postgres por un almacén de documentos, el lenguaje de triage no debería reescribirse.",
        "Contrato de capas S40-T2-A. Entrada: lista de capas y aristas de dependencia. Salida: grafo sin saltos prohibidos. **Prohibido:** `presentation→infrastructure` (saltar application) y `domain→infrastructure` (dominio acoplado a infra). **Permitido:** `infrastructure→domain` (el adapter mira hacia adentro). Error local: `REDRAW_BOUNDARY`. Si falta el grafo: `REVIEW_LAYER_OWNER`.",
        "En `CASO-LIM-040`, la UI de intake de Red Andina (formularios sintéticos de Lima) no llama al almacén ER directamente: pasa por application. El worker de infraestructura implementa el port que el dominio declara. Si dibujas presentation→db, redibuja la frontera (`REDRAW_BOUNDARY`) antes de promover el dossier: un salto de capa es un bug de arquitectura, no un atajo de sprint.",
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
        content: "La revisión de S40-T2-A conserva que la evidencia es el grafo de capas: prohíbe presentation→infrastructure y domain→infrastructure; infrastructure→domain (adapter hacia adentro) sí está permitido.",
      },
    },
    {
      heading: "Ports/adapters y dependencia hacia el dominio",
      subtopicId: "S40-T2-B",
      paragraphs: [
        "Un **port** es el contrato que el dominio necesita (p. ej. «dame el caso por id»). Un **adapter** traduce HTTP, SQL o colas a ese contrato. Las flechas de importación apuntan hacia políticas estables: el dominio no importa FastAPI ni SQLAlchemy; el adapter implementa el port y vive en infraestructura. Este principio se conoce como **DIP** (Dependency Inversion Principle, inversión de dependencias): las dependencias apuntan hacia el dominio, no hacia los frameworks.",
        "Contrato hexagonal S40-T2-B. Entrada: nombre de port, adapter que lo implementa, lista de imports del dominio y conteo de contract tests. Salida: dominio testeable con adapter en memoria (`implements_port=True`, `domain_imports=[]`, `contract_tests ≥ 3`). Error: imports de infra en dominio → `INVERT_DEPENDENCY`. Sin tests de contrato → `DEFINE_PORT_CONTRACT`. El flag `implements_port` es un **checklist de lab**; en producción la evidencia real es sustituir el adapter (memoria ↔ SQL) sin reescribir la regla de negocio.",
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
        content: "Contrato S40-T2-B: el dominio depende del port (Protocol), no de SQLAlchemy ni FastAPI. Evidencia de lab: `implements_port`, imports de dominio vacíos y ≥3 contract tests; no uses el sufijo del nombre del adapter como regla.",
      },
    },
    {
      heading: "Bounded contexts y lenguaje ubicuo",
      subtopicId: "S40-T3-A",
      paragraphs: [
        "Un **bounded context** da significado local a cada término del lenguaje ubicuo. «Caso» en intake no es el mismo concepto que «record» en ER ni que «ticket» en triage. El **context map** declara relaciones (customer/supplier, ACL, shared kernel) y **traducciones** entre glosarios para no fusionar modelos por accidente.",
        "Contrato de fronteras S40-T3-A. Entrada: conjuntos de términos por contexto y mapa de traducciones. Un mismo vocablo puede existir en dos BC con **significados locales distintos**: el mapa y el ACL declaran ownership y traducción. En el lab de stdlib pedimos **tokens disjuntos** en los sets de cada fila para hacer visible el solape y forzar la traducción `case→record`. Si hay intersección de tokens sin mapa: `SPLIT_CONTEXTS`. Si falta el mapa de traducciones: `WORKSHOP_UBIQUITOUS_LANGUAGE`.",
        "En `CASO-LIM-040`, intake posee `{case}`; ER posee `{record, score}`; la traducción `case→record` es el Anti-Corruption Layer (ACL) que evita que el score de ER contamine el lenguaje de intake. No mezcles «score» en la UI de recepción sin traducir: el error de oficio no es «repetir una palabra», sino **mezclar modelos sin mapa**.",
      ],
      code: {
        language: 'python',
        title: "bounded_contexts_ubiquitous.py",
        code: `def contexts_ok(intake: set, er: set, translations: dict) -> bool:
    # Lab: tokens disjuntos + ACL explícito (simplificación didáctica)
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
        content: "Para S40-T3-A, el artefacto es el context map: glosarios locales, relación entre BC y al menos una traducción ACL (p. ej. case→record). Mezclar modelos sin mapa es `SPLIT_CONTEXTS`.",
      },
    },
    {
      heading: "Entities, value objects y servicios de dominio",
      subtopicId: "S40-T3-B",
      paragraphs: [
        "Una **entity** se rastrea por **identidad** a lo largo del tiempo (`CASE-001` sigue siendo el mismo caso aunque cambie su estado). Un **value object (VO)** se compara por **valor** (150 PEN es igual a otro 150 PEN) y suele ser inmutable. Un **servicio de dominio** aloja una regla que no encaja naturalmente en una sola entidad (p. ej. fusionar scores sin guardar estado propio).",
        "Contrato táctico S40-T3-B. Entrada: `entity_id`, VO (monto + moneda), flags de inmutabilidad y servicio sin estado. Salida: invariantes probadas — id estable (`CASE-…`), moneda de negocio `PEN` en el lab, `vo_frozen=True`, `service_stateless=True`. En el lab, `vo_frozen` es la **assert de invariante** sobre un dict sintético; en producción usarías un tipo inmutable (`NamedTuple` o dataclass congelada). El flag no congela el dict de Python por magia. Breach → `REJECT_DOMAIN_MODEL`. Si falta la bandera del servicio → `CLARIFY_INVARIANT`. Anti-patrón: usar el id de la entidad como moneda del VO.",
        "En `CASO-LIM-040`, el caso sintético `CASE-001` porta un VO de 150 PEN con invariante de inmutabilidad; el servicio de fusión de scores no guarda sesión. ER no implica fraude ni parentesco: solo correspondencia de entidad con score, sujeto a revisión humana.",
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
# Lab: assert de invariante (en prod: NamedTuple / frozen dataclass)
vo_frozen = True
print("entity_same", same_entity(case_a, case_b))
print("vo_equal", same_money(vo_a, vo_b))
print("merged", merge_scores(0.8, 0.6))
print("vo_frozen", vo_frozen)`,
        output: `entity_same True
vo_equal True
merged 0.7
vo_frozen True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Promoción de S40-T3-B: distingue identidad de entity, igualdad por valor del VO y servicio sin estado. `vo_frozen` es checklist de lab: en producción el VO es inmutable de verdad.",
      },
    },
    {
      heading: "Diagramas C4, flujo y ADRs",
      subtopicId: "S40-T4-A",
      paragraphs: [
        "**C4** comunica arquitectura en capas de zoom: **context** (personas y sistemas externos), **container** (api, worker, db, object store), component y code (opcional en el lab). Un **ADR** (Architecture Decision Record) no es el dibujo final: registra contexto, decisión, **alternatives**, **consequences**, **status** y señal de **rollback**. Un diagrama sin ADR es una foto; un ADR sin rollback es una promesa sin freno de mano.",
        "Contrato documental S40-T4-A. Entrada: niveles C4 presentes y campos del ADR. Salida mínima: `{context, container}` en C4 y `{decision, alternatives, consequences, rollback}` con `status=accepted`. Si el ADR está incompleto o en draft sin campos: `RETURN_ADR_TO_DRAFT`. Si falta el status: `REQUEST_ARCH_REVIEW`.",
        "En `CASO-LIM-040`, el C4 de Red Andina muestra al analista de triage y al banco partner en context; en container aparecen api, worker, db y object_store. El ADR-001 documenta por qué se eligió cola async (picos de intake en Lima), qué alternativa se descartó (sync HTTP) y cómo revertir (`feature_flag_off`).",
        "**Rúbrica de calidad de un ADR** (úsala en el You Do, no solo «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 alternatives** evaluadas, no un monólogo; (3) **consequences** con ganancia y costo residual; (4) **rollback** operable en ≤1 release; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.",
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
          "Cierre de S40-T4-A: C4 con context y container, más ADR accepted con alternatives, consequences y rollback operable. Documenta también el riesgo residual y los límites del laboratorio con stdlib.",
      },
    },
    {
      heading: "APIs, eventos, deuda y evolución compatible",
      subtopicId: "S40-T4-B",
      paragraphs: [
        "Los cambios **compatibles** son aditivos: añaden campos o eventos sin romper consumidores de la versión previa. Un **consumer contract** verifica que `v1_fields ⊆ v_next`. La **deuda técnica** no es una nota al margen: lleva dueño, fecha de retiro y criterio de aceptación.",
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
          "Cierre de S40-T4-B: conserva el consumer contract de la versión previa en verde, evidencia de `BLOCK_BREAKING_CHANGE` y ruta humana `NEGOTIATE_VERSION`. Toda deuda lleva dueño y `retire_on`.",
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
        preamble:
          "Antes de promover un trade-off en el dossier de Red Andina (CASO-LIM-040), el arquitecto necesita un **escenario de quality attribute** auditable, no un adjetivo. En esta demo un pico de 100 req/s en intake de Lima sintético trae latencia p95 observada 250 ms frente a un target de 300, con dueño `platform`. No escribas aún: predice si el escenario sale `complete True` y por qué sin `owner` o sin umbral el gate no deja pasar. Observa las tres líneas de salida.",
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
        why: "Un QA medible exige fuente, estímulo, entorno, respuesta, observed vs. target y dueño contactable. «Rápido» o «escalable» no son contratos: sin umbral numérico el escenario no es auditable. El gate de S40-T1-A rechaza escenarios incompletos; el caso es sintético (Red Andina, Lima) sin PII real. En We Do corregirás la comparación invertida observed ≥ target.",
        retrospective:
          "Si puedes explicar por qué un escenario sin dueño no es auditable sin mirar el código, ya tienes el hábito de medida + dueño. El error clásico es prometer «bajo latencia» sin umbral numérico. En We Do practicarás el predicado observed ≤ target y el rechazo del adverso.",
      },
      {
        demoId: "S40-T1-B-DEMO",
        subtopicId: "S40-T1-B",
        environment: "local-python",
        description: "Demo: trade-off por costo ponderado (menor es mejor) + residual ≤ 2",
        preamble:
          "En mesas de arquitectura de fintech en LatAm no se elige «lo moderno»: se elige por **costo ponderado** (menor es mejor) y residual firmado. En esta demo, sync=3.8 y async=2.2 compiten bajo `min_score`; el residual 2 no supera el umbral. No escribas: predice `best`, la tabla de scores y si residual_ok es True. Observa por qué maximizar el score promovería la peor opción.",
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
        why: "El score es un **costo ponderado**, no una utilidad de ML: menor gana. async=2.2 vence a sync=3.8; residual 2 ≤ umbral y lo firma el dueño de arquitectura. Residual sin dueño no se promociona; la tabla se versiona con el ADR. Sin umbral el trade-off se reabre (`REOPEN_TRADEOFF`). En We Do cambiarás max por min y exigirás residual ≤ 2.",
        retrospective:
          "Menor score de costo gana; residual ≤ umbral con dueño que firma. El error clásico es maximizar «por costumbre de ranking» de ML. Pregunta: si usas `max`, ¿qué opción «gana» entre sync=3.8 y async=2.2 y por qué es la peor? We Do: trade-off medible con min y residual_ok.",
      },
      {
        demoId: "S40-T2-A-DEMO",
        subtopicId: "S40-T2-A",
        environment: "local-python",
        description: "Demo: grafo de capas sin saltos prohibidos ni domain→infrastructure",
        preamble:
          "En Red Andina la UI de intake no debe llamar al almacén ER directo: eso es un **salto de capa**. Esta demo valida un grafo con presentation→application→domain e infrastructure→domain (adapter hacia adentro). No escribas: predice `deps_ok` y `domain_pure`. Observa qué aristas están en FORBIDDEN y por qué infrastructure→domain sí es válida.",
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
        why: "La evidencia es el **diagrama de dependencias**, no el conteo de módulos. presentation→infra y domain→infra son `REDRAW_BOUNDARY`; infrastructure→domain (adapter hacia adentro) está permitido. El dominio permanece puro de drivers SQL/web: si mañana cambias Postgres, el lenguaje de triage no se reescribe. En We Do corregirás el predicado que exige todo hacia infrastructure.",
        retrospective:
          "Flechas permitidas y prohibidas se demuestran en el grafo, no «en la cabeza». El error clásico es atar UI al SQL por velocidad de sprint. Pregunta: ¿por qué infrastructure→domain no es el mismo breach que domain→infrastructure? We Do: imprimir el grafo limpio y el PASS.",
      },
      {
        demoId: "S40-T2-B-DEMO",
        subtopicId: "S40-T2-B",
        environment: "local-python",
        description: "Demo: dominio depende de Protocol CaseRepo; MemoryCaseRepo es el adapter",
        preamble:
          "El dominio de triage de Red Andina no debe importar SQLAlchemy ni FastAPI: depende de un **port**. Esta demo tipa `open_case(repo: CaseRepo)` y pasa `MemoryCaseRepo` como adapter en memoria. No escribas: predice status, la flecha `domain<-adapters` y `implements_port`. Observa que puedes sustituir el adapter sin reescribir la regla.",
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
        why: "DIP se demuestra con Protocol + adapter intercambiable + imports de dominio vacíos + contract tests. El sufijo *Repository* no es la regla; `implements_port` es checklist de lab. La flecha va hacia el dominio: puedes cambiar MemoryCaseRepo por SQL sin reescribir `open_case`. En We Do dejarás de exigir adapter==port.",
        retrospective:
          "Dependencia hacia el dominio, no hacia el framework. El error clásico es importar ORM en el núcleo «para ir más rápido». Pregunta: ¿qué cambia si sustituyes MemoryCaseRepo por SQL sin tocar open_case? We Do: checklist implements_port + imports vacíos + ≥3 tests.",
      },
      {
        demoId: "S40-T3-A-DEMO",
        subtopicId: "S40-T3-A",
        environment: "local-python",
        description: "Demo: ACL de ER→intake que oculta score y expone solo case_id/source",
        preamble:
          "Entre intake y ER de Red Andina el **score de ER no debe filtrarse a la UI de recepción** sin traducción. Esta demo aplica un ACL: del paquete ER solo salen case_id y source; score queda fuera. No escribas: predice el packet y por qué `acl True` y `no_leak True`. Observa la función translate_to_intake.",
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
        why: "El error de oficio es **mezclar modelos sin mapa**, no «prohibir palabras repetidas» en abstracto. El ACL declara la traducción ER→intake y oculta score. En DDD real un vocablo puede repetirse con significado local si el mapa lo declara; en We Do el lab pedirá tokens disjuntos + case→record como simplificación didáctica.",
        retrospective:
          "ACL = frontera explícita de glosario. El error clásico es pintar score de ER en la pantalla de intake «porque ya está en el JSON». Pregunta: ¿qué campo del JSON ER no debe llegar a intake sin traducción? We Do: mapa disjunto + traducción case→record.",
      },
      {
        demoId: "S40-T3-B-DEMO",
        subtopicId: "S40-T3-B",
        environment: "local-python",
        description: "Demo: entity identity + VO Money (PEN) + servicio de fusión sin estado",
        preamble:
          "En el modelo táctico de Red Andina, `CASE-001` se rastrea por **identidad** y 150 PEN se compara por **valor**. Esta demo muestra entity same, VO equal, merge_scores 0.7 y flags de lab vo_frozen / service_stateless. No escribas: predice cada print y por qué el servicio no guarda sesión. Observa que currency no es el id del caso.",
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
# Lab: assert de invariante (en prod: NamedTuple / frozen dataclass)
vo_frozen = True
print("entity", entity, "same", same_entity(entity, "CASE-001"))
print("vo_equal", same_vo(vo_a, vo_b))
print("merged", merge_scores(0.8, 0.6))
print("vo_frozen", vo_frozen)
print("service_stateless", True)`,
          output: `entity CASE-001 same True
vo_equal True
merged 0.7
vo_frozen True
service_stateless True`,
        },
        why: "Identidad de entity ≠ atributos mutables; VO se compara por amount+currency (150 PEN = 150 PEN). El servicio de fusión no guarda sesión. `vo_frozen` es assert de lab — en producción usarías NamedTuple o dataclass congelada; el flag no congela el dict por magia. En We Do dejarás de mezclar currency con entity_id.",
        retrospective:
          "Tres herramientas tácticas, tres invariantes. El error clásico es usar el id de la entity como «moneda» del VO. Pregunta: ¿por qué 150 PEN = 150 PEN aunque sean dos dicts distintos en memoria? We Do: checklist de identidad + PEN + merge 0.7.",
      },
      {
        demoId: "S40-T4-A-DEMO",
        subtopicId: "S40-T4-A",
        environment: "local-python",
        description: "Demo: checklist C4 context/container + ADR accepted con rollback",
        preamble:
          "Un diagrama C4 de Red Andina sin ADR es una foto; un ADR sin rollback es promesa sin freno. Esta demo comprueba niveles context+container y campos decision/alternatives/consequences/rollback con status accepted. No escribas: predice c4_ok, adr_ok y status. Observa qué falta en un draft incompleto.",
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
        why: "Rúbrica ADR: ≥2 alternatives, residual, rollback operable en ≤1 release y dueño que firma. Status `accepted` solo con campos presentes; draft incompleto → `RETURN_ADR_TO_DRAFT`. C4 mínimo es context+container. Un archivo con títulos vacíos no pasa CP-N4-A. En We Do dejarás de aceptar draft con <3 campos.",
        retrospective:
          "C4 mínimo + ADR accepted con rollback operable en ≤1 release. El error clásico es un archivo con títulos vacíos que «parece» documentation. Pregunta: si status=accepted pero falta rollback, ¿c4_ok y adr_ok pueden mentir por separado? We Do: ensamblar ADR-001 accepted de oficio.",
      },
      {
        demoId: "S40-T4-B-DEMO",
        subtopicId: "S40-T4-B",
        environment: "local-python",
        description: "Demo: evolución aditiva (v1 ⊆ v1.1) + deuda con dueño y retire_on",
        preamble:
          "Evolucionar el payload de case en Red Andina sin romper consumidores: **aditivo**. Esta demo comprueba v1 ⊆ v11 (case_id, status + priority) y deuda del job async con owner platform y retire_on 2026-12-01. No escribas: predice additive, debt_owner y retire_on. Observa por qué borrar un campo de v1 sería breaking.",
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
        why: "Consumer contract verde = campos previos conservados (v1 ⊆ v_next). `BLOCK_BREAKING_CHANGE` si se eliminan; deuda sin `retire_on` no se negocia a ciegas (`NEGOTIATE_VERSION`). Owner + fecha de retiro son obligatorios. En We Do invertirás el subconjunto del starter (que pide v11 ⊂ v1 por error).",
        retrospective:
          "Aditivo + deuda fechada = evolución gobernada. El error clásico es «limpiar» v1 quitando status. Pregunta: si v11 = {case_id, priority}, ¿additive_ok es True o False y por qué el consumidor antiguo se rompe? We Do: v1 ⊆ v11 + vista del consumidor + debt.",
      },
    ],
  },
  weDo: {
    intro: "S40 · Laboratorio del dossier de arquitectura gobernada para Red Andina (organización ficticia, Lima sintético): 24 retos locales sobre CASO-LIM-040. E1 repara un defecto y, en subtemas clave, ensambla un artefacto de oficio (capas, ports/DIP, context map, entity/VO, mini C4+ADR, consumer contract). E2 separa valid/invalid/missing. E3 demuestra recuperación fail-closed (CONTINUE / breach / REQUEST_*). Fixtures sintéticos con vocabulario intake→ER→triage→reporting.",
    steps: [
      {
        id: "S40-T1-A-E1",
        subtopicId: "S40-T1-A",
        kind: "guided",
        title: "Latencia en budget con dueño",
        preamble:
          "- **Contexto:** en CASO-LIM-040-1A el dossier de Red Andina exige un escenario QA con latencia p95 bajo umbral y dueño de plataforma.\n- **Meta:** corregir el predicado de contrato (observed ≤ target y owner truthy).\n- **Éxito:** una línea `S40-T1-A PASS`.\n- **Límites:** no mutes el fixture; no inventes PII; el DEFECT está en la comparación, no en los datos.",
        instruction:
          "S40-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract` usa `observed_ms >= target_ms` (DEFECT).\n2. Cámbialo a `observed_ms <= target_ms` y exige `bool(owner)`.\n3. Conserva el print de status.\n4. Debe imprimir `S40-T1-A PASS`.",
        hint: "El DEFECT está en la dirección de la comparación (`>=` vs. `<=`); no en los números del fixture.",
        hints: [
          "El DEFECT está en la dirección de la comparación (`>=` vs. `<=`); no en los números del fixture.",
          "El predicado correcto exige observed ≤ target y owner truthy; con 280 y 300 el happy path debe ser PASS.",
        ],
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "El fixture `CASO-LIM-040-1A` satisface un predicado de dominio real; imprime `S40-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "Con observed 280 y target 300 el contrato es True solo si la comparación es ≤. Si invertiste a ≥, el happy path falla y el adverso de E2 «parece» válido: el gate de QA se vuelve inútil en el dossier de Lima.",
        retrospective:
          "Umbral medible + dueño contactable es el mínimo de un QA auditable. Invertir observed/target no «arregla» el adverso de E2: lo disfraza de válido. Pregunta: con 280 vs. 300, ¿qué imprime el gate si usas `>=` y por qué el happy path miente? Siguiente (E2): tres rutas schema / contenido / missing.",
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
        title: "Tres rutas de escenario QA",
        preamble:
          "- **Contexto:** el gate del dossier no solo mira el dict: primero exige campos, luego mide latencia.\n- **Meta:** implementar `assess` que separe válido, adverso (410 ms) y sin owner.\n- **Éxito:** `PASS REJECT_QA_SCENARIO MISSING:owner`.\n- **Límites:** calcula `missing` antes de leer owner; no rellenes owner; datos sintéticos CASO-LIM-040-1A.",
        instruction:
          "S40-T1-A-E2 · 1. Revisa el starter: PASS si `observed_ms >= target_ms` (DEFECT).\n2. Corrige a observed ≤ target y owner truthy.\n3. Conserva la rama MISSING por campos ausentes.\n4. Imprime las tres salidas en orden.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T1-A: latencia observada contra umbral y dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS REJECT_QA_SCENARIO MISSING:owner`.",
        feedback:
          "Tres salidas distintas: umbral OK + owner → PASS; latencia 410 ms → REJECT_QA_SCENARIO; sin owner → MISSING:owner. Schema se evalúa antes que el contenido del escenario.",
        retrospective:
          "Schema (MISSING) se evalúa antes que contenido (REJECT). Acceder a `owner` cuando falta tumba el flujo; rellenar `platform` en silencio es otro anti-patrón. Pregunta: ¿por qué 410 ms con owner no es `MISSING`? Luego (E3): CONTINUE / REJECT / REQUEST en fail-closed.",
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
        title: "Fail-closed: CONTINUE o REQUEST_QA_OWNER",
        preamble:
          "- **Contexto:** en plataforma de Red Andina no se inventa un dueño de QA cuando falta: se pide evidencia.\n- **Meta:** decidir CONTINUE / REJECT_QA_SCENARIO / REQUEST_QA_OWNER.\n- **Éxito:** `CONTINUE REJECT_QA_SCENARIO REQUEST_QA_OWNER`.\n- **Límites:** missing → REQUEST_QA_OWNER (no CONTINUE); no inventes owner; breach de latencia cierra con REJECT.",
        instruction:
          "S40-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Lee el DEFECT: missing devuelve CONTINUE y pred usa ≥.\n2. En `decide`, missing → `REQUEST_QA_OWNER`.\n3. Completos: CONTINUE solo si observed ≤ target y owner; si no → REJECT_QA_SCENARIO.\n4. Imprime las tres decisiones en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_QA_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_QA_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró latencia observada contra umbral y dueño; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: observed_ms > target_ms", "CASO-LIM-040-1A es sintético"],
        tests: "Fixtures `CASO-LIM-040-1A`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Fail-closed: CONTINUE solo con escenario medible; breach es REJECT_QA_SCENARIO; sin owner es REQUEST_QA_OWNER — no CONTINUE silencioso ni rellenar `platform` por defecto.",
        retrospective:
          "REQUEST_* pide evidencia; REJECT_* cierra el breach; CONTINUE solo con escenario medible y dueño firmable. El error clásico es tratar «falta owner» como OK o inventar `platform` en silencio. Pregunta: ¿por qué no rellenar el dueño por defecto y seguir el pipeline?",
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
        title: "Elegir por min_score y residual",
        preamble:
          "- **Contexto:** en CASO-LIM-040-1B el dueño `arquitectura` debe firmar un residual ≤ 2 al elegir async vs. sync.\n- **Meta:** corregir la selección (min de scores, no max) y exigir residual_risk ≤ 2.\n- **Éxito:** `S40-T1-B PASS`.\n- **Límites:** no mutes scores ni selected; no inventes residual; solo corrige el predicado.",
        instruction:
          "S40-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: compara `selected` con `max(...)` (DEFECT).\n2. Cámbialo a `min(record[\"scores\"], key=...)` y añade residual ≤ 2.\n3. Imprime `S40-T1-B` y el status.\n4. Debe ser PASS con selected async.",
        hint: "score = costo → min(scores); residual_risk ≤ 2; risk_owner debe existir en el fixture.",
        hints: [
          "selected == min(scores, key=scores.get) and residual_risk <= 2.",
          "No uses max: un score alto es peor costo, no mejor utilidad.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "El fixture `CASO-LIM-040-1B` satisface un predicado de dominio real; imprime `S40-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "Score alto es peor costo. Con max el starter «valida» la opción cara; con min + residual ≤ 2 el trade-off es promocionable en Red Andina. Sin residual no hay decisión firmable por arquitectura.",
        retrospective:
          "min_score + residual con umbral es el contrato de T1-B. El starter con `max` «valida» la opción cara y deja el residual fuera del predicado. Pregunta: ¿por qué residual=2 con async min es PASS y residual=4 no? Siguiente (E2): PASS / REOPEN / MISSING residual.",
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
        title: "Assess de trade-off en tres rutas",
        preamble:
          "- **Contexto:** el gate reabre trade-offs elegidos por moda o con residual alto; sin residual_risk no hay schema completo.\n- **Meta:** enrutar válido (async min), adverso (selected mal / residual 4) e incompleto.\n- **Éxito:** `PASS REOPEN_TRADEOFF MISSING:residual_risk`.\n- **Límites:** missing primero; no inventes residual; no uses max.",
        instruction:
          "S40-T1-B-E2 · 1. Starter da PASS si selected es max (DEFECT).\n2. Corrige a min + residual ≤ 2.\n3. Conserva MISSING de residual_risk.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a residual_risk debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a residual_risk debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T1-B: alternativa con menor score y riesgo residual aceptable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `residual_risk` ausente y produce exactamente `PASS REOPEN_TRADEOFF MISSING:residual_risk`.",
        feedback:
          "min_score + residual OK → PASS; moda o residual alto → REOPEN_TRADEOFF; sin residual_risk → MISSING. No inventes residual=0 para «cerrar el ticket».",
        retrospective:
          "REOPEN_TRADEOFF es breach de **contenido** (score o residual mal); MISSING es **schema** (falta residual_risk). No son el mismo ticket en la mesa. Pregunta: si selected es max y residual=4, ¿por qué no basta con «arreglar» solo el residual? Luego (E3): ESCALATE_RESIDUAL_RISK ante incertidumbre.",
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
        title: "Fail-closed: ESCALATE_RESIDUAL_RISK",
        preamble:
          "- **Contexto:** si falta residual_risk, la mesa de arquitectura de Red Andina escala: no se firma un trade-off a ciegas.\n- **Meta:** CONTINUE / REOPEN_TRADEOFF / ESCALATE_RESIDUAL_RISK.\n- **Éxito:** `CONTINUE REOPEN_TRADEOFF ESCALATE_RESIDUAL_RISK`.\n- **Límites:** missing → ESCALATE (no CONTINUE); pred con min y residual ≤ 2.",
        instruction:
          "S40-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y max en pred.\n2. missing → ESCALATE_RESIDUAL_RISK.\n3. Completos: CONTINUE solo min_score + residual ≤ 2; si no → REOPEN_TRADEOFF.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `ESCALATE_RESIDUAL_RISK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ESCALATE_RESIDUAL_RISK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró alternativa con menor score y riesgo residual aceptable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta residual_risk", "fixture adverso: selected ≠ min(scores) o residual_risk > 2", "CASO-LIM-040-1B es sintético"],
        tests: "Fixtures `CASO-LIM-040-1B`, adverso y sin `residual_risk` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo con trade-off medible; breach → REOPEN_TRADEOFF; sin residual → ESCALATE_RESIDUAL_RISK. El owner de arquitectura no firma residual a ciegas.",
        retrospective:
          "ESCALAR residual ≠ reabrir trade-off por score malo: son tickets distintos en la mesa de Red Andina. Sin residual no hay firma de arquitectura, aunque el min_score sea correcto. El error clásico es CONTINUE silencioso sin residual. Pregunta: ¿quién firma el residual en tu dossier You Do y con qué umbral?",
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
        title: "Grafo de capas sin saltos",
        preamble:
          "- **Contexto:** CASO-LIM-040-2A pide un grafo legible de Red Andina sin domain→infra ni presentation→infra.\n- **Meta:** validar aristas con conjunto forbidden e imprimir el grafo.\n- **Éxito:** `S40-T2-A PASS` más línea `graph [...]`.\n- **Límites:** no borres aristas del fixture; infrastructure→domain está permitido; layers[2] debe ser domain.",
        instruction:
          "S40-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: `all(edge[1] == \"infrastructure\")`.\n2. Define forbidden y exige que ninguna arista esté en él.\n3. Añade check de layers[2] == \"domain\".\n4. Imprime status y graph.",
        hint: "Convierte cada edge a tuple y compáralo con forbidden = {(domain, infrastructure), (presentation, infrastructure)}.",
        hints: [
          "Convierte cada edge a tuple y compáralo con el conjunto forbidden {(domain, infrastructure), (presentation, infrastructure)}.",
          "El fixture válido tiene presentation→application, application→domain e infrastructure→domain; layers[2] debe ser domain. Imprime también el grafo.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "El fixture `CASO-LIM-040-2A` satisface el grafo de capas; imprime `S40-T2-A PASS`, la línea `graph` y el assert booleano pasa.",
        feedback:
          "El artefacto es el grafo impreso, no un booleano suelto. infrastructure→domain es el adapter hacia adentro; forzar todo hacia infrastructure es el anti-patrón del starter en Red Andina.",
        retrospective:
          "Forbidden explícito gana a «sentir» las capas. El starter que exige todo hacia infrastructure es el anti-patrón del lab, no un atajo de sprint. Pregunta: si borramos la arista infrastructure→domain del print, ¿sigue siendo un grafo de Red Andina defendible? Siguiente (E2): PASS / REDRAW / MISSING dependencies.",
        starterCode: {
          language: 'python',
          title: "s40-t2-a-e1.py",
          code: `# CASO-LIM-040 · oficio grafo de capas
# DEFECT: dependencias de capas invertidas
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
record = {"case_id": "CASO-LIM-040-2A", **{"layers":["presentation","application","domain","infrastructure"],"dependencies":[["presentation","application"],["application","domain"],["infrastructure","domain"]]}}
# DEFECT: dominio no debe depender de infrastructure en todas las aristas
meets_contract = all(edge[1] == "infrastructure" for edge in record["dependencies"])
status = "PASS" if meets_contract else "REDRAW_BOUNDARY"
print("S40-T2-A", status)
print("graph", [tuple(e) for e in record["dependencies"]])
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
print("graph", [tuple(e) for e in record["dependencies"]])
assert meets_contract is True` ,
          output: `S40-T2-A PASS
graph [('presentation', 'application'), ('application', 'domain'), ('infrastructure', 'domain')]` ,
        },
      },
      {
        id: "S40-T2-A-E2",
        subtopicId: "S40-T2-A",
        kind: "independent",
        title: "Assess: grafo limpio o REDRAW",
        preamble:
          "- **Contexto:** un dossier con domain→infrastructure no se promociona: se redibuja la frontera.\n- **Meta:** assess válido / adverso con saltos / sin dependencies.\n- **Éxito:** `PASS REDRAW_BOUNDARY MISSING:dependencies`.\n- **Límites:** missing primero; no asumas grafo vacío como limpio.",
        instruction:
          "S40-T2-A-E2 · 1. DEFECT: PASS si todo apunta a infrastructure.\n2. Corrige con forbidden + layers[2]==domain.\n3. Conserva MISSING de dependencies.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a dependencies debe ocurrir antes de esa rama.",
          "Después aplica forbidden = domain→infrastructure y presentation→infrastructure; el adverso falla por contenido, no por schema.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `dependencies` ausente y produce exactamente `PASS REDRAW_BOUNDARY MISSING:dependencies`.",
        feedback:
          "Grafo limpio → PASS; cualquier arista prohibida → REDRAW_BOUNDARY; sin dependencies → MISSING. No asumas un grafo vacío como capas limpias.",
        retrospective:
          "REDRAW_BOUNDARY es breach de **contenido** (arista prohibida presente); MISSING es **ausencia de evidencia** (sin lista dependencies). Un grafo vacío no «demuestra» capas limpias en el dossier de Red Andina. Pregunta: ¿qué imprime assess si dependencies=[] y layers están bien? Luego (E3): REVIEW_LAYER_OWNER.",
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
        title: "Fail-closed: REVIEW_LAYER_OWNER",
        preamble:
          "- **Contexto:** sin grafo de dependencias no se asume capas limpias: se pide revisión del dueño de capa.\n- **Meta:** CONTINUE / REDRAW_BOUNDARY / REVIEW_LAYER_OWNER.\n- **Éxito:** `CONTINUE REDRAW_BOUNDARY REVIEW_LAYER_OWNER`.\n- **Límites:** missing → REVIEW_LAYER_OWNER; no CONTINUE silencioso.",
        instruction:
          "S40-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred invertido.\n2. missing → REVIEW_LAYER_OWNER.\n3. Completos: CONTINUE solo grafo limpio; si no → REDRAW_BOUNDARY.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_LAYER_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_LAYER_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró grafo de dependencias sin dominio hacia infraestructura; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta dependencies", "fixture adverso: domain→infrastructure o presentation→infrastructure", "CASO-LIM-040-2A es sintético"],
        tests: "Fixtures `CASO-LIM-040-2A`, adverso y sin `dependencies` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE solo con capas limpias; saltos → REDRAW_BOUNDARY; grafo ausente → REVIEW_LAYER_OWNER. Incertidumbre no es breach demostrado: no inventes un grafo «por defecto» en el dossier de Red Andina.",
        retrospective:
          "Ausencia de grafo no es «OK por defecto» ni breach demostrado: es incertidumbre del dueño de capa. No inventes aristas «limpias» para desbloquear el gate. El error clásico es CONTINUE sin dependencies. Pregunta: ¿qué arista prohibida dibujarías primero en un audit de Red Andina?",
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
        title: "DIP con implements_port y tests",
        preamble:
          "- **Contexto:** CASO-LIM-040-2B modela CaseRepository + MemoryCaseRepository; el dominio no debe importar infra.\n- **Meta:** validar implements_port, domain_imports vacío y contract_tests ≥ 3.\n- **Éxito:** `S40-T2-B PASS` y línea `dep domain<-adapters`.\n- **Límites:** no uses igualdad de nombres como regla; no inventes imports.",
        instruction:
          "S40-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: adapter==port y bool(domain_imports).\n2. Predicado: implements_port is True and not domain_imports and contract_tests >= 3.\n3. Imprime status y dep.\n4. Debe ser PASS.",
        hint: "Usa el flag explícito `implements_port` — no inventes reglas por sufijo del nombre del adapter.",
        hints: [
          "Predicado: implements_port is True and not domain_imports and contract_tests >= 3.",
          "El DEFECT del starter exige adapter==port e imports no vacíos: invierte esa lógica y lee el flag.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "El fixture hexagonal de `CASO-LIM-040-2B` demuestra DIP con adapter en memoria; imprime `S40-T2-B PASS`.",
        feedback:
          "El nombre del adapter no prueba DIP. Evidencia de lab: flag + imports vacíos + ≥3 contract tests. sqlalchemy en dominio es breach real en E2 del dossier hexagonal.",
        retrospective:
          "implements_port + imports limpios + ≥3 tests es el trío DIP del lab. El error clásico es confiar en el sufijo *Repository*. Pregunta: ¿por qué adapter==port falla siempre en este fixture aunque el diseño sea hexagonal? Siguiente (E2): PASS / INVERT / MISSING contract_tests.",
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
        title: "Assess hexagonal en tres rutas",
        preamble:
          "- **Contexto:** un dominio con imports de sqlalchemy invierte la dependencia y no se promociona.\n- **Meta:** assess válido / adverso (implements_port False + sqlalchemy) / sin contract_tests.\n- **Éxito:** `PASS INVERT_DEPENDENCY MISSING:contract_tests`.\n- **Límites:** missing primero; no uses endswith del nombre del adapter.",
        instruction:
          "S40-T2-B-E2 · 1. DEFECT: PASS si adapter==port y domain_imports.\n2. Corrige al trío DIP.\n3. Conserva MISSING de contract_tests.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después: implements_port is True and not domain_imports and contract_tests >= 3. El adverso falla por contenido (sqlalchemy / implements_port False).",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS INVERT_DEPENDENCY MISSING:contract_tests`.",
        feedback:
          "No uses endswith del nombre del adapter: el contrato es implements_port + imports de infra vacíos + ≥3 tests. PASS por nombre bonito es falso verde.",
        retrospective:
          "INVERT_DEPENDENCY es breach de **contenido** (imports de infra o implements_port False); MISSING es schema de **evidencia de contrato**. No son el mismo ticket en el dossier hexagonal. Pregunta: con implements_port=True y domain_imports=[sqlalchemy], ¿qué debe devolver assess y por qué? Luego (E3): DEFINE_PORT_CONTRACT.",
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
        title: "Fail-closed: DEFINE_PORT_CONTRACT",
        preamble:
          "- **Contexto:** sin contract_tests no se asume que el port está definido: se pide DEFINIR el contrato.\n- **Meta:** CONTINUE / INVERT_DEPENDENCY / DEFINE_PORT_CONTRACT.\n- **Éxito:** `CONTINUE INVERT_DEPENDENCY DEFINE_PORT_CONTRACT`.\n- **Límites:** missing → DEFINE_PORT_CONTRACT; uncertainty ≠ breach.",
        instruction:
          "S40-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred anti-DIP.\n2. missing → DEFINE_PORT_CONTRACT.\n3. Completos: CONTINUE solo trío DIP; si no → INVERT_DEPENDENCY.\n4. Imprime las tres decisiones (no un booleano suelto).",
        hint: "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `DEFINE_PORT_CONTRACT` antes de evaluar el contenido.",
          "Para datos completos: implements_port is True and not domain_imports and contract_tests >= 3 → CONTINUE.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: implements_port False o domain_imports con sqlalchemy", "CASO-LIM-040-2B es sintético"],
        tests: "Fixtures `CASO-LIM-040-2B`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Uncertainty (DEFINE_PORT_CONTRACT) ≠ breach (INVERT_DEPENDENCY). El flag implements_port es la evidencia de DIP, no el sufijo del nombre del adapter.",
        retrospective:
          "Falta de tests de contrato no es «dominio acoplado»: es incertidumbre de evidencia del port. DEFINE_PORT_CONTRACT pide contrato, no invierte la flecha. El error clásico es CONTINUE sin contract_tests. Pregunta: ¿qué probarías al sustituir Memory por SQL sin reescribir open_case?",
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
        title: "Context map con ACL case→record",
        preamble:
          "- **Contexto:** CASO-LIM-040-3A exige un mini context map intake/er con términos disjuntos y ACL case→record.\n- **Meta:** corregir el predicado (isdisjoint + traducción) e imprimir el mapa.\n- **Éxito:** `S40-T3-A PASS` y línea `map [...]`.\n- **Límites:** en el lab, solape de tokens sin mapa es breach; no improvises el ACL; datos sintéticos.",
        instruction:
          "S40-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: PASS si hay intersección de terms.\n2. Exige isdisjoint y translations[\"case\"]==\"record\".\n3. Imprime status y map legible.\n4. Debe ser PASS.",
        hint: "Construye conjuntos de términos por BC y exige `isdisjoint` + `translations['case'] == 'record'`.",
        hints: [
          "Lee `rows[0]['terms']` e `rows[1]['terms']`; no uses intersección de tokens como éxito en este lab.",
          "El ACL mínimo del lab es `translations.get('case') == 'record'`. Imprime también el mapa legible. En DDD real, un vocablo puede repetirse con significado local distinto si el mapa lo declara.",
        ],
        edgeCases: ["falta translations", "fixture adverso: token compartido entre intake y er sin ACL (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "El context map de `CASO-LIM-040-3A` es disjunto en tokens con ACL; imprime `S40-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "El artefacto es el mapa (BC + términos + ACL), no un booleano. En DDD real un vocablo puede repetirse con significado local si el mapa lo declara; este lab simplifica con tokens disjuntos.",
        retrospective:
          "Fronteras de lenguaje se demuestran con mapa + traducción. El starter trata intersección como éxito: eso fusiona glosarios. Pregunta: si case y record «parecen lo mismo» en negocio, ¿por qué el lab exige isdisjoint + ACL en lugar de un solo set? Siguiente (E2): PASS / SPLIT / MISSING translations.",
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
        title: "Assess: SPLIT_CONTEXTS o MISSING",
        preamble:
          "- **Contexto:** token `case` en intake y en ER sin ACL es solape de modelos; sin translations no hay schema de mapa.\n- **Meta:** assess válido / adverso solapado / sin translations.\n- **Éxito:** `PASS SPLIT_CONTEXTS MISSING:translations`.\n- **Límites:** missing primero; no inventes el ACL en silencio.",
        instruction:
          "S40-T3-A-E2 · 1. DEFECT: PASS si intake ∩ er no vacío.\n2. Corrige a isdisjoint + case→record.\n3. Conserva MISSING de translations.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a translations debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a translations debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T3-A: términos locales disjuntos y traducción declarada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta translations", "fixture adverso: término compartido entre intake y er (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `translations` ausente y produce exactamente `PASS SPLIT_CONTEXTS MISSING:translations`.",
        feedback:
          "Glosarios disjuntos + ACL → PASS; solape de términos → SPLIT_CONTEXTS; sin translations → MISSING. No improvises el ACL en la UI de recepción.",
        retrospective:
          "SPLIT_CONTEXTS es breach de **modelo**; MISSING es falta de **mapa**. Improvisar traducciones en la UI de recepción no es un ACL documentado en Red Andina. Pregunta: ¿por qué un translations={} con glosarios disjuntos no es PASS en el lab? Luego (E3): WORKSHOP_UBIQUITOUS_LANGUAGE.",
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
        title: "Fail-closed: taller de lenguaje ubicuo",
        preamble:
          "- **Contexto:** sin mapa de traducciones no se asume frontera sana: se convoca taller de lenguaje ubicuo.\n- **Meta:** CONTINUE / SPLIT_CONTEXTS / WORKSHOP_UBIQUITOUS_LANGUAGE.\n- **Éxito:** `CONTINUE SPLIT_CONTEXTS WORKSHOP_UBIQUITOUS_LANGUAGE`.\n- **Límites:** missing → WORKSHOP (no CONTINUE); no rellenes translations.",
        instruction:
          "S40-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred de solape como éxito.\n2. missing → WORKSHOP_UBIQUITOUS_LANGUAGE.\n3. Completos: CONTINUE solo disjuntos + ACL; si no → SPLIT_CONTEXTS.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `WORKSHOP_UBIQUITOUS_LANGUAGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WORKSHOP_UBIQUITOUS_LANGUAGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró términos locales disjuntos y traducción declarada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta translations", "fixture adverso: término compartido entre intake y er (p. ej. case en ambos)", "CASO-LIM-040-3A es sintético"],
        tests: "Fixtures `CASO-LIM-040-3A`, adverso y sin `translations` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE con fronteras claras; solape → SPLIT_CONTEXTS; sin mapa de traducciones → WORKSHOP_UBIQUITOUS_LANGUAGE. Ausencia de mapa no es solape demostrado.",
        retrospective:
          "Ausencia de translations no es solape demostrado: es incertidumbre de glosario y convoca taller de lenguaje ubicuo. El error clásico es CONTINUE sin mapa de traducciones. Pregunta: ¿qué término de triage no debe colarse en la UI de intake sin ACL?",
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
        title: "Entity, Money VO y merge sin estado",
        preamble:
          "- **Contexto:** CASO-LIM-040-3B trae CASE-001, dos VO 150 PEN y merge_scores(0.8, 0.6).\n- **Meta:** validar identidad, igualdad de VO, currency PEN, vo_frozen, service_stateless y merged==0.7.\n- **Éxito:** `S40-T3-B PASS` y línea entity_same/vo_equal/merged.\n- **Límites:** no compares currency con entity_id; no mutes entidades en el servicio.",
        instruction:
          "S40-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: meets_contract = currency == entity_a.\n2. Arma el predicado completo (startswith CASE-, same_entity, same_money, PEN, flags, merged==0.7).\n3. Imprime status y el resumen.\n4. Debe ser PASS.",
        hint: "No compares `currency` con `entity_id`. Identidad = ids iguales; VO = amount+currency; servicio = media ponderada sin estado.",
        hints: [
          "same_entity(entity_a, entity_b) y same_money(vo_a, vo_b); currency debe ser PEN.",
          "merge_scores(0.8, 0.6) → 0.7; service_stateless y vo_frozen deben ser True.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "El modelo táctico de `CASO-LIM-040-3B` prueba identidad, VO PEN y servicio sin estado; imprime `S40-T3-B PASS`.",
        feedback:
          "Mezclar moneda con id rompe el modelo táctico de Red Andina. El artefacto es el contraste identidad vs. valor + servicio stateless, no un flag suelto.",
        retrospective:
          "Entity por id, VO por valor, servicio sin sesión. El starter «pasa» si currency==entity_id — un PASS imposible en el happy path real. Pregunta: ¿qué partes del predicado completo fallarían si solo arreglas el booleano y dejas merge sin calcular? Siguiente (E2): PASS / REJECT / MISSING service_stateless.",
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
        title: "Assess del modelo táctico",
        preamble:
          "- **Contexto:** id vacío, USD o vo_frozen False no pasan el gate de dominio de Red Andina.\n- **Meta:** assess válido / adverso / sin service_stateless.\n- **Éxito:** `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless`.\n- **Límites:** missing primero; currency debe ser PEN en el lab.",
        instruction:
          "S40-T3-B-E2 · 1. DEFECT: PASS si currency==entity_id.\n2. Corrige a startswith CASE- + PEN + vo_frozen + service_stateless.\n3. Conserva MISSING de service_stateless.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a service_stateless debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a service_stateless debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T3-B: identidad estable, VO en PEN e invariantes inmutables. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `service_stateless` ausente y produce exactamente `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless`.",
        feedback:
          "Invariantes OK → PASS; identidad/VO rotos → REJECT_DOMAIN_MODEL; sin service_stateless → MISSING. No asumas que el servicio es stateless sin bandera.",
        retrospective:
          "REJECT_DOMAIN_MODEL es breach de **invariantes** (id CASE-, moneda PEN, flags); MISSING es ausencia de bandera de servicio. No asumas service_stateless sin evidencia en el lab. Pregunta: con currency=USD y vo_frozen=False, ¿por qué no es MISSING sino REJECT? Luego (E3): CLARIFY_INVARIANT.",
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
        title: "Fail-closed: CLARIFY_INVARIANT",
        preamble:
          "- **Contexto:** sin bandera de servicio no se inventa que es stateless: se aclara la invariante.\n- **Meta:** CONTINUE / REJECT_DOMAIN_MODEL / CLARIFY_INVARIANT.\n- **Éxito:** `CONTINUE REJECT_DOMAIN_MODEL CLARIFY_INVARIANT`.\n- **Límites:** missing → CLARIFY_INVARIANT; no CONTINUE silencioso.",
        instruction:
          "S40-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred currency==entity_id.\n2. missing → CLARIFY_INVARIANT.\n3. Completos: CONTINUE solo modelo sano; si no → REJECT_DOMAIN_MODEL.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `CLARIFY_INVARIANT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLARIFY_INVARIANT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró identidad estable, VO en PEN e invariantes inmutables; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta service_stateless", "fixture adverso: currency ≠ PEN, vo_frozen False o entity_id sin prefijo CASE-", "CASO-LIM-040-3B es sintético"],
        tests: "Fixtures `CASO-LIM-040-3B`, adverso y sin `service_stateless` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE con modelo táctico sano; breach → REJECT_DOMAIN_MODEL; bandera de servicio ausente → CLARIFY_INVARIANT. Incertidumbre de invariante no es modelo roto demostrado.",
        retrospective:
          "Incertidumbre de invariante ≠ modelo roto demostrado: no inventes service_stateless=True para desbloquear el gate del dossier táctico. El error clásico es CONTINUE sin la bandera. Pregunta: ¿qué inmutabilizarías de verdad en producción (NamedTuple o dataclass congelada vs. flag de lab)?",
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
        title: "Mini C4 y ADR-001 accepted",
        preamble:
          "- **Contexto:** CASO-LIM-040-4A trae personas/cajas C4 y ADR-001 async con alternatives, consequences y feature_flag_off.\n- **Meta:** validar need_c4 + need_adr + status accepted.\n- **Éxito:** `S40-T4-A PASS` y `adr ADR-001 accepted`.\n- **Límites:** no aceptes draft; no inventes campos vacíos; You Do reutilizará la plantilla.",
        instruction:
          "S40-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: PASS si status draft y len(adr)<3.\n2. need_c4 = context y container no vacíos; need_adr = decision/alternatives/consequences/rollback truthy; status==accepted.\n3. Imprime status y adr id/status.\n4. Debe ser PASS.",
        hint: "Valida claves del dict `adr` y que `c4` contenga listas no vacías en context y container; status debe ser accepted.",
        hints: [
          "need_adr = decision, alternatives, consequences, rollback presentes y truthy; status == 'accepted'.",
          "El DEFECT del starter acepta draft con menos de 3 campos: invierte esa lógica.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "El mini ADR+C4 de `CASO-LIM-040-4A` está completo y accepted; imprime `S40-T4-A PASS`.",
        feedback:
          "El artefacto es el ADR relleno, no un set abstracto de nombres de campo. Un draft incompleto se devuelve a draft; no se promociona en el dossier de Red Andina.",
        retrospective:
          "Accepted = campos presentes + status firmable. El error clásico es PASS por tener un id ADR-001. Pregunta: ¿por qué el starter con status draft y len(adr)<3 nunca pasa con el fixture real del lab? Siguiente (E2): PASS / RETURN / MISSING adr_status.",
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
        title: "Assess documental C4 y ADR",
        preamble:
          "- **Contexto:** un ADR «accepted» sin alternatives o sin container no pasa el gate documental.\n- **Meta:** assess válido / adverso incompleto / sin adr_status.\n- **Éxito:** `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status`.\n- **Límites:** missing primero; no asumas accepted.",
        instruction:
          "S40-T4-A-E2 · 1. DEFECT: PASS si draft y fields < 3.\n2. Corrige a c4 context+container, adr fields mínimos y status accepted.\n3. Conserva MISSING de adr_status.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a adr_status debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a adr_status debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T4-A: C4 mínimo y ADR con alternativas, consecuencias y rollback. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `adr_status` ausente y produce exactamente `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status`.",
        feedback:
          "C4+ADR accepted completo → PASS; draft o campos incompletos → RETURN_ADR_TO_DRAFT; sin adr_status → MISSING. No asumas accepted por tener un id en el dossier de Red Andina.",
        retrospective:
          "RETURN_ADR_TO_DRAFT es breach de **contenido documental**; MISSING es schema de status. El error clásico es asumir accepted por tener un id ADR-001 en el dossier. Pregunta: ¿por qué un ADR con solo decision no es PASS aunque diga accepted? Luego (E3): REQUEST_ARCH_REVIEW.",
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
        title: "Fail-closed: REQUEST_ARCH_REVIEW",
        preamble:
          "- **Contexto:** sin adr_status no se inventa accepted: se pide revisión de arquitectura.\n- **Meta:** CONTINUE / RETURN_ADR_TO_DRAFT / REQUEST_ARCH_REVIEW.\n- **Éxito:** `CONTINUE RETURN_ADR_TO_DRAFT REQUEST_ARCH_REVIEW`.\n- **Límites:** missing → REQUEST_ARCH_REVIEW; no CONTINUE silencioso.",
        instruction:
          "S40-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred de draft incompleto como éxito.\n2. missing → REQUEST_ARCH_REVIEW.\n3. Completos: CONTINUE solo C4+ADR accepted completo; si no → RETURN_ADR_TO_DRAFT.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_ARCH_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_ARCH_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró C4 mínimo y ADR con alternativas, consecuencias y rollback; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta adr_status", "fixture adverso: ADR draft o sin alternatives/consequences/rollback", "CASO-LIM-040-4A es sintético"],
        tests: "Fixtures `CASO-LIM-040-4A`, adverso y sin `adr_status` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE con documentación aceptada; ADR incompleto → RETURN_ADR_TO_DRAFT; sin status → REQUEST_ARCH_REVIEW. Falta de status no es ADR incompleto demostrado.",
        retrospective:
          "Falta de status ≠ ADR incompleto demostrado: se pide revisión de arquitectura, no se inventa accepted. El error clásico es CONTINUE sin status o firmar a ciegas. Pregunta: ¿qué escribirías en rollback de tu ADR-001 del You Do (operable en ≤1 release)?",
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
        title: "Evolución aditiva y deuda fechada",
        preamble:
          "- **Contexto:** CASO-LIM-040-4B trae v1 {case_id, status}, v1.1 con priority y deuda del job async.\n- **Meta:** validar v1 ⊆ v11, misma consumer_view y debt owner+retire_on.\n- **Éxito:** `S40-T4-B PASS` más vistas y debt.\n- **Límites:** no inviertas el subconjunto; no inventes retire_on.",
        instruction:
          "S40-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: meets_contract = v11_fields < v1_fields.\n2. Exige v1 ⊆ v11, consumer_view igual en v1 y v11, owner y retire_on truthy.\n3. Imprime status, vistas y debt.\n4. Debe ser PASS.",
        hint: "Subconjunto correcto: v1 ⊆ v11 (no al revés). Imprime la vista del consumidor y la deuda.",
        hints: [
          "additive_ok = v1_fields <= v11_fields; debt_owner truthy y retire_on no vacío.",
          "consumer_view usa solo case_id y status — debe funcionar igual en v1.1.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "La evolución aditiva de `CASO-LIM-040-4B` conserva el consumer contract y documenta deuda; imprime `S40-T4-B PASS`.",
        feedback:
          "El artefacto es consumer contract + deuda fechada. Pedir v11 ⊂ v1 disfraza un breaking como PASS. La vista del consumidor debe seguir leyendo case_id:status.",
        retrospective:
          "v1 ⊆ v_next y deuda con fecha son el contrato de T4-B. El error clásico es invertir el subconjunto (breaking disfrazado de PASS). Pregunta: ¿por qué consumer_view debe ser igual en v1 y v11 si priority es aditivo? Siguiente (E2): PASS / BLOCK / MISSING retire_on.",
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
        title: "Assess: BLOCK_BREAKING_CHANGE",
        preamble:
          "- **Contexto:** quitar status de v1.1 rompe el consumidor antiguo; sin retire_on no hay schema de deuda.\n- **Meta:** assess válido / adverso breaking / sin retire_on.\n- **Éxito:** `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on`.\n- **Límites:** missing primero; no inventes fecha de retiro; en el lab, fechas ISO se comparan lexicográficamente.",
        instruction:
          "S40-T4-B-E2 · 1. DEFECT: PASS si v11 < v1.\n2. Corrige a v1 ⊆ v11 + debt_owner truthy + retire_on presente (y ≥ fecha del lab si aplica).\n3. Conserva MISSING de retire_on.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a retire_on debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a retire_on debe ocurrir antes de esa rama.",
          "Después aplica la regla de S40-T4-B: campos v1 preservados y deuda con owner/fecha. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `retire_on` ausente y produce exactamente `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on`.",
        feedback:
          "Evolución aditiva + deuda fechada → PASS; romper v1 → BLOCK_BREAKING_CHANGE; sin retire_on → MISSING. No negocies versión sin fecha de retiro.",
        retrospective:
          "BLOCK_BREAKING_CHANGE es breach de **compat**; MISSING es falta de plan de retiro. El error clásico es negociar versión sin fecha. Pregunta: con retire_on vacío y v1 ⊆ v11, ¿qué imprime assess y por qué no es PASS? Luego (E3): NEGOTIATE_VERSION.",
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
        title: "Fail-closed: NEGOTIATE_VERSION",
        preamble:
          "- **Contexto:** sin retire_on no se asume compat ni se promociona deuda: se negocia versión con evidencia.\n- **Meta:** CONTINUE / BLOCK_BREAKING_CHANGE / NEGOTIATE_VERSION.\n- **Éxito:** `CONTINUE BLOCK_BREAKING_CHANGE NEGOTIATE_VERSION`.\n- **Límites:** missing → NEGOTIATE_VERSION; no CONTINUE silencioso.",
        instruction:
          "S40-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE y pred de subconjunto invertido.\n2. missing → NEGOTIATE_VERSION.\n3. Completos: CONTINUE solo aditivo + deuda; si no → BLOCK_BREAKING_CHANGE.\n4. Imprime las tres decisiones.",
        hint: "Una ausencia no equivale a breach: enrútala a `NEGOTIATE_VERSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `NEGOTIATE_VERSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró campos v1 preservados y deuda con owner/fecha; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta retire_on", "fixture adverso: se eliminan campos de v1 o residual sin dueño/fecha", "CASO-LIM-040-4B es sintético"],
        tests: "Fixtures `CASO-LIM-040-4B`, adverso y sin `retire_on` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE con compat aditiva; breaking → BLOCK_BREAKING_CHANGE; sin fecha de retiro → NEGOTIATE_VERSION. Negociar versión no es bloquear un breaking ya demostrado.",
        retrospective:
          "Negociar versión ≠ bloquear breaking ya demostrado: son respuestas distintas del gate de evolución aditiva. El error clásico es CONTINUE sin fecha de retiro de la deuda. Pregunta: ¿qué campo aditivo propondrías en v1.1 de tu dossier sin romper v1?",
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
    context: "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima. La plataforma separa intake, resolución de entidades (ER), relación, triage, reporting e IA auxiliar. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida.",
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
    portfolioNote:
      "Evidencia de CP-N4-A · mapa de arquitectura gobernado: completa las plantillas QA, context map, C4 y dos ADRs del starter. Rúbrica ADR: contexto de negocio, ≥2 alternatives, consequences con residual, rollback operable, status accepted firmado por dueño — no archivos vacíos con títulos. Marca evidence en True solo con artefactos reales y con el trío medida + dueño + consecuencia visible en cada trade-off. El checklist inicia en BLOCKED por diseño — no cambies asserts para forzar READY.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué frontera del mapa demuestras con un caso normal, uno BLOCK_ARCHITECTURE y uno REVIEW_ADR — y tienes filas de relación e IA en el context map, no solo intake/ER/triage/reporting? (2) ¿qué harías distinto con datos reales vs. sintéticos CASO-LIM-040 (PII, secretos fuera del repo)? (3) Escribe en el README una frase de impacto medible (antes/después: p. ej. trade-off sin residual → residual firmado) defendible en 30 segundos en una mesa de arquitectura.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "10%" },
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
        question: "Si ocurre un breach de arquitectura en el You Do del dossier, ¿qué respuesta preserva seguridad y auditabilidad?",
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
