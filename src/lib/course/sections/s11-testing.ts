import type { CourseSection } from '../../types'

export const section11: CourseSection = {
  id: "testing",
  index: 11,
  title: "OOP y modelo de dominio",
  shortTitle: "OOP dominio",
  tagline: "ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence sin decidir fraude ni parentesco",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "Boxes",
  accentColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
  jobRelevance:
    "Un modelo de dominio claro es la base de productos de matching/familiaridad sin inventar veredictos legales. Esta sección (id `testing` conservado) retematiza S11 a **OOP y dominio**: núcleo de **CP-N1-C**. pytest/CI se reubican como soporte de calidad alrededor del dominio.",
  learningOutcomes: [
    { text: "Modelar entidades con class/dataclass e instancias válidas" },
    { text: "Imponer invariantes en construcción sin side-effects externos" },
    { text: "Encapsular con properties y métodos de consulta seguros" },
    { text: "Definir igualdad/hash y mutabilidad (frozen) consciente" },
    { text: "Preferir composición a herencia frágil" },
    { text: "Usar Protocol/duck typing para puertos del dominio" },
    { text: "Separar dominio de I/O con repo/service y to_dict" },
    { text: "Probar dominio puro y evitar APIs de fraude/parentesco" },
  ],
  theory: [
    {
      heading: "De “Testing pytest/CI” a OOP y modelo de dominio (mapa)",
      paragraphs: [
        "En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad). Aquí modelas el **dominio de familiaridad**: `ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`. Cada tipo nombra un concepto de matching local; el código deja de ser dicts anónimos y pasa a ser un núcleo testeable.",
        "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Id de plataforma `testing` se conserva. Si un campo obligatorio falta o viola un invariante, **falla al construir** — no rellenes en silencio. Stack: `dataclass`, properties, composition, `Protocol` (S01–S11); sin frameworks web ni ORMs de S19.",
        "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests). Caso sintético PE: ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `Decimal` en PEN/USD. Métrica del gate: cuatro tipos + tests puros + README de límites éticos. Nunca PII real ni APIs `is_fraud`/`is_family`."
      ],
      callout: {
        type: "info",
        title: "CP-N1-C modelo de dominio",
        content:
          "Gate: cuatro tipos explícitos, invariantes, tests sin red/DB, README de límites éticos del modelo.",
      },
    },
    {
      heading: "Clases, instancias y dataclass",
      subtopicId: "S11-T1-A",
      paragraphs: [
        "Una **clase** define el molde; una **instancia** es un objeto concreto. `@dataclass` genera `__init__`, `__repr__` y opcionalmente comparación — reduce boilerplate sin perder el nombre del dominio. En familiaridad, `ClientRecord` es el borde de onboarding sintético, no un row de pandas.",
        "Campos con **type hints** y `default_factory` para mutables (listas/dicts) evitan el clásico bug del default compartido entre instancias. Prefiere `list[str] = field(default_factory=list)` a `emails=[]`. Fail-closed: no construyas con `None` silencioso donde el schema exige string no vacío.",
        "Migrar dicts anónimos a tipos nombra el dominio y habilita invariantes en T1-B (`from_dict` → dataclass). Caso sintético: `ClientRecord(\"C001\", \"Ana Perez\", [\"ana@ejemplo.pe\"])`. Documenta qué campos son PII-sintética de demo y cuáles son ids estables de sistema."
      ],
      code: {
        language: 'python',
        title: "client_dataclass.py",
        code: `def s11_th_1():
    from dataclasses import dataclass, field

    @dataclass
    class ClientRecord:
        client_id: str
        full_name: str
        emails: list[str] = field(default_factory=list)

    c = ClientRecord("C001", "Ana Perez", ["ana@ejemplo.pe"])
    print(c)
    print(type(c).__name__, c.client_id)

s11_th_1()`,
        output: `ClientRecord(client_id='C001', full_name='Ana Perez', emails=['ana@ejemplo.pe'])
ClientRecord C001`,
      },
      callout: {
        type: "tip",
        title: "Datos sintéticos",
        content:
          "Usa ids C00x y dominios ejemplo.pe en demos; nunca PII real de clientes.",
      },
    },
    {
      heading: "Invariantes y estados válidos",
      subtopicId: "S11-T1-B",
      paragraphs: [
        "`__post_init__` en dataclasses valida justo después de construir. Si el estado es inválido, **falla al crear** — un `ClientRecord` a medias en un set de resolución es peor que un `ValueError` temprano. Las reglas viven junto al tipo, no en un script suelto del CLI.",
        "Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON. **Sin side-effects de negocio** al validar: no llames APIs, no escribas a disco, no “fixes” silenciosos de moneda. Stack: stdlib + `Decimal`; no ORM.",
        "Ejemplo: `document_id` no vacío; en `Transaction`, `amount` es `Decimal` **positivo** y `currency` ∈ allowlist `{'PEN','USD'}`. Nunca conviertas PEN→USD en el constructor. Caso sintético PE: `Transaction(\"T1\", Decimal(\"150.50\"), \"PEN\")` acepta; `\"EUR\"` o `amount<=0` rechaza."
      ],
      code: {
        language: 'python',
        title: "invariants.py",
        code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    def __post_init__(self) -> None:
        if not self.client_id:
            raise ValueError("client_id vacío")
        if not self.document_id.strip():
            raise ValueError("document_id vacío")

print(ClientRecord("C001", "DNI-1"))
try:
    ClientRecord("C002", "  ")
except ValueError as e:
    print("reject", e)`,
        output: `ClientRecord(client_id='C001', document_id='DNI-1')
reject document_id vacío`,
      },
      callout: {
        type: "warning",
        title: "Fail on construct",
        content:
          "Un objeto inválido en memoria es peor que una excepción temprana.",
      },
    },
    {
      heading: "Propiedades y métodos",
      subtopicId: "S11-T2-A",
      paragraphs: [
        "`@property` expone campos calculados (`display_name`, `masked_email`) **sin** mutación peligrosa desde afuera. La UI y los logs deben preferir la máscara; el email raw queda en el campo interno para el borde autorizado.",
        "Métodos de instancia encapsulan consultas puras (`age_days_since(as_of)`). Evita side-effects en properties: no envían mail, no escriben disco, no llaman red. Fail-closed si `email` no tiene `@` al calcular `masked_email` — o devuelve un sentinel documentado.",
        "Setters validados solo cuando la mutación es parte del modelo de negocio; si no, prefiere **`frozen`** o devolver una **nueva instancia**. Caso sintético: `c.display_name` y `c.masked_email` para demo Lima sin imprimir PII completa en stdout de pipeline."
      ],
      code: {
        language: 'python',
        title: "properties.py",
        code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    first_name: str
    last_name: str
    email: str

    @property
    def display_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def masked_email(self) -> str:
        local, _, domain = self.email.partition("@")
        return f"{local[:1]}***@{domain}"

c = ClientRecord("Ana", "Perez", "ana@ejemplo.pe")
print(c.display_name, c.masked_email)`,
        output: `Ana Perez a***@ejemplo.pe`,
      },
      callout: {
        type: "tip",
        title: "Consulta vs comando",
        content:
          "Properties no deberían enviar emails ni escribir a disco.",
      },
    },
    {
      heading: "Igualdad, hash y mutabilidad consciente",
      subtopicId: "S11-T2-B",
      paragraphs: [
        "La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`: un documento es PII, puede corregirse/reemitirse y no debe fusionar entidades por accidente. **`frozen=True`** habilita hash seguro para sets/dicts de resolución.",
        "Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas campos del `__eq__`. Usa `field(compare=False)` para etiquetas visibles (`display_name`) que no deben romper la igualdad. Fail-closed: `entity_id` vacío → `ValueError`.",
        "Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas) pueden ser mutables con cuidado y métodos `add`. Caso sintético: set `{E1, E1_relabel, E2}` tiene tamaño 2 si la igualdad es por `entity_id`."
      ],
      code: {
        language: 'python',
        title: "frozen_entity.py",
        code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str = field(compare=False)

    def __post_init__(self) -> None:
        if not self.entity_id.strip():
            raise ValueError("entity_id vacío")

a = ResolvedEntity("E1", "Ana")
b = ResolvedEntity("E1", "Ana Perez")
s = {a, ResolvedEntity("E2", "Luis")}
print("same id eq?", a == ResolvedEntity("E1", "otra"))
print("set size", len(s))
print("E1 in set", a in s)`,
        output: `same id eq? True
set size 2
E1 in set True`,
      },
      callout: {
        type: "info",
        title: "eq custom",
        content:
          "`field(compare=False)` excluye display_name de eq/hash. No uses document_id como identidad de ResolvedEntity.",
      },
    },
    {
      heading: "Composición antes que herencia",
      subtopicId: "S11-T3-A",
      paragraphs: [
        "**has-a** (composición) modela mejor el caso: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`. No fuerces `Client(Person(BaseEntity))` solo para reutilizar un campo de nombre.",
        "Una evidencia usa un **par canónico** (`left_id < right_id`), ids distintos y `signal_score` finito en [0, 1]. Así (E1,E2) y (E2,E1) no duplican la misma relación en el almacén. Fail-closed si el par no es canónico o el score es NaN/out-of-range.",
        "Herencia solo si hay **subtipo real** (is-a). Mixins con cautela: complejidad invisible en MRO. Prefiere funciones puras o colaboración entre objetos. Caso sintético: `CaseFile.add(RelationshipEvidence(\"E1\",\"E2\",0.42))` sin método `is_family()`.",
        "La composición mantiene el dominio auditable: puedes serializar el grafo de evidencias sin arrastrar jerarquías frágiles. Documenta en README que `signal_score` es **dato de matching**, no parentesco legal."
      ],
      code: {
        language: 'python',
        title: "composition.py",
        code: `from dataclasses import dataclass, field
from math import isfinite

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

    def __post_init__(self) -> None:
        if not self.left_id < self.right_id:
            raise ValueError("par no canónico")
        if not isfinite(self.signal_score) or not 0.0 <= self.signal_score <= 1.0:
            raise ValueError("signal_score fuera de rango")

@dataclass
class CaseFile:
    entity: object
    evidences: list[RelationshipEvidence] = field(default_factory=list)

    def add(self, ev: RelationshipEvidence) -> None:
        self.evidences.append(ev)

cf = CaseFile(entity={"entity_id": "E1"})
cf.add(RelationshipEvidence("E1", "E2", 0.42))
print(len(cf.evidences), cf.evidences[0].signal_score)`,
        output: `1 0.42`,
      },
      callout: {
        type: "danger",
        title: "Sin veredictos",
        content:
          "RelationshipEvidence guarda señales; no implementes is_family() automático.",
      },
    },
    {
      heading: "Protocolos y polimorfismo con propósito",
      subtopicId: "S11-T3-B",
      paragraphs: [
        "`typing.Protocol` describe un **puerto** (`EntityStore` con `get`/`save`) sin forzar herencia. Duck typing estructural: cualquier objeto con esos métodos cumple el contrato en chequeo estático y, con `@runtime_checkable`, en `isinstance`.",
        "Útil para **fakes en tests** y para no acoplar dominio a SQLite/HTTP. Evita ABC pesados si Protocol basta. Fail-closed en el adaptador real si la DB no responde — el dominio no captura eso; el borde sí.",
        "No introduzcas Protocol “por si acaso” con una sola implementación y sin tests — YAGNI. Caso sintético: `FakeStore` en memoria para T4 tests; el adapter SQL llega en S12 sin reescribir `ClientService`."
      ],
      code: {
        language: 'python',
        title: "protocol_store.py",
        code: `from __future__ import annotations

from typing import Dict, Optional, Protocol, runtime_checkable

@runtime_checkable
class EntityStore(Protocol):
    def get(self, entity_id: str) -> Optional[dict]:
        """Devuelve la entidad o None si no existe."""
    def save(self, entity: dict) -> None:
        """Persiste la entidad."""

class FakeStore:
    def __init__(self):
        self._d = {}  # type: Dict[str, dict]
    def get(self, entity_id: str):
        return self._d.get(entity_id)
    def save(self, entity: dict) -> None:
        self._d[entity["entity_id"]] = entity

store = FakeStore()  # type: EntityStore
store.save({"entity_id": "E1", "name": "Ana"})
print(store.get("E1"))
print(isinstance(store, EntityStore))`,
        output: `{'entity_id': 'E1', 'name': 'Ana'}
True`,
      },
      callout: {
        type: "tip",
        title: "Puertos",
        content:
          "El dominio habla con Protocol; el adapter SQL llega después sin reescribir reglas.",
      },
    },
    {
      heading: "Repositorios, servicios y serialización",
      subtopicId: "S11-T4-A",
      paragraphs: [
        "**Repository** light: `get`/`save`. **Service** light: orquesta reglas de dominio sin conocer CLI ni HTTP. `to_dict`/`from_dict` viven en el **borde** de serialización, no mezclados con invariantes de negocio.",
        "Serializa sin password fields ni PII innecesaria en logs. DTOs de borde no tienen que ser idénticos a las entidades internas (p. ej. omite `emails` crudos en un export de dashboard). Fail-closed si falta `client_id` en `from_dict`.",
        "CLI (S10) llama al service; el service **no** imprime ni parsea argparse. Caso sintético: `ClientService(InMemoryClientRepository()).register(\"C001\", \"a@ejemplo.pe\")` → dict de borde sin decidir fraude."
      ],
      code: {
        language: 'python',
        title: "repo_service.py",
        code: `from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional

@dataclass
class ClientRecord:
    client_id: str
    email: str

    def to_dict(self) -> dict:
        return {"client_id": self.client_id, "email": self.email}

class InMemoryClientRepository:
    def __init__(self):
        self._d = {}  # type: Dict[str, ClientRecord]
    def save(self, c: ClientRecord) -> None:
        self._d[c.client_id] = c
    def get(self, client_id: str) -> Optional[ClientRecord]:
        return self._d.get(client_id)

class ClientService:
    def __init__(self, repo: InMemoryClientRepository):
        self.repo = repo
    def register(self, client_id: str, email: str) -> dict:
        c = ClientRecord(client_id, email)
        self.repo.save(c)
        return c.to_dict()  # no decide fraude

svc = ClientService(InMemoryClientRepository())
print(svc.register("C001", "a@ejemplo.pe"))`,
        output: `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}`,
      },
      callout: {
        type: "info",
        title: "Frontera",
        content:
          "I/O y formato de archivos quedan fuera del núcleo del dominio.",
      },
    },
    {
      heading: "Dependencias y pruebas del dominio",
      subtopicId: "S11-T4-B",
      paragraphs: [
        "Tests del dominio son **puros**: sin red, sin DB real, sin reloj de red. Fakes del `Protocol` bastan. Eso permite CI rápida y demos offline del gate CP-N1-C.",
        "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`). Un test de “no existe el método” documenta la ética del producto en código. Fail-closed: score fuera de [0,1] no se “clamp” en silencio en el constructor.",
        "Scores de resolución/relación son **campos**; un test verifica finitud, rango, par canónico y que no hay veredictos. Caso sintético: `test_no_fraud_api()` pasa si `RelationshipEvidence` solo expone ids + score. Nunca PII real en fixtures."
      ],
      code: {
        language: 'python',
        title: "domain_tests.py",
        code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float

def test_no_fraud_api():
    assert not hasattr(RelationshipEvidence, "is_fraud")
    assert not hasattr(RelationshipEvidence, "is_related_family")
    ev = RelationshipEvidence("E1", "E2", 0.5)
    assert 0.0 <= ev.signal_score <= 1.0
    return "pass"

print(test_no_fraud_api())`,
        output: `pass`,
      },
      callout: {
        type: "danger",
        title: "Ética de producto",
        content:
          "El software de familiaridad no declara parentesco legal ni fraude; solo organiza evidencia.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (uno por subtema). Orden T1→T4. Modelo de dominio de familiaridad sin veredictos de fraude/parentesco. local-python.",
    steps: [
      {
        demoId: "S11-T1-A-DEMO",
        subtopicId: "S11-T1-A",
        environment: "local-python",
        description: "ClientRecord dataclass desde dict sintético.",
        code: {
          language: 'python',
          title: "client_from_dict.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        return cls(d["client_id"], d["full_name"], list(d.get("emails", [])))

raw = {"client_id": "C001", "full_name": "Ana Perez", "emails": ["ana@ejemplo.pe"]}
c = ClientRecord.from_dict(raw)
print(c)`,
          output: `ClientRecord(client_id='C001', full_name='Ana Perez', emails=['ana@ejemplo.pe'])`,
        },
        why: "from_dict nombra el borde dict→dominio.",
      },
      {
        demoId: "S11-T1-B-DEMO",
        subtopicId: "S11-T1-B",
        environment: "local-python",
        description: "ClientRecord rechaza document_id vacío.",
        code: {
          language: 'python',
          title: "reject_empty_doc.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    def __post_init__(self) -> None:
        if not str(self.document_id).strip():
            raise ValueError("document_id vacío")

print(ClientRecord("C001", "DNI-100"))
try:
    ClientRecord("C002", "")
except ValueError as e:
    print("rejected", e)`,
          output: `ClientRecord(client_id='C001', document_id='DNI-100')
rejected document_id vacío`,
        },
        why: "Invariante en construcción: no hay instancia inválida.",
      },
      {
        demoId: "S11-T2-A-DEMO",
        subtopicId: "S11-T2-A",
        environment: "local-python",
        description: "display_name y masked_email como properties.",
        code: {
          language: 'python',
          title: "display_props.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    first_name: str
    last_name: str
    email: str

    @property
    def display_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def masked_email(self) -> str:
        local, _, domain = self.email.partition("@")
        return f"{local[:1]}***@{domain}"

c = ClientRecord("Lucía", "Méndez", "lucia@ejemplo.pe")
print(c.display_name)
print(c.masked_email)`,
          output: `Lucía Méndez
l***@ejemplo.pe`,
        },
        why: "La superficie pública no necesita el email completo para mostrar.",
      },
      {
        demoId: "S11-T2-B-DEMO",
        subtopicId: "S11-T2-B",
        environment: "local-python",
        description: "ResolvedEntity frozen por valor; set de entidades.",
        code: {
          language: 'python',
          title: "frozen_set.py",
          code: `def s11_ido_4():
    from dataclasses import dataclass, field

    @dataclass(frozen=True)
    class ResolvedEntity:
        entity_id: str
        display_name: str = field(compare=False)

    e1 = ResolvedEntity("E1", "Ana")
    e1b = ResolvedEntity("E1", "Ana actualizada")
    e2 = ResolvedEntity("E2", "Luis")
    s = {e1, e1b, e2}
    print("size", len(s))
    print("e1==e1b", e1 == e1b)

s11_ido_4()`,
          output: `size 2
e1==e1b True`,
        },
        why: "frozen + display_name compare=False mantiene identidad/hash por entity_id aunque cambie la etiqueta visible.",
      },
      {
        demoId: "S11-T3-A-DEMO",
        subtopicId: "S11-T3-A",
        environment: "local-python",
        description: "CaseFile compone list[RelationshipEvidence] + entidad resuelta.",
        code: {
          language: 'python',
          title: "casefile_compose.py",
          code: `def s11_ido_5():
    from dataclasses import dataclass, field

    @dataclass(frozen=True)
    class ResolvedEntity:
        entity_id: str

    @dataclass(frozen=True)
    class RelationshipEvidence:
        left_id: str
        right_id: str
        signal_score: float

    @dataclass
    class CaseFile:
        entity: ResolvedEntity
        evidences: list[RelationshipEvidence] = field(default_factory=list)

    cf = CaseFile(ResolvedEntity("E1"))
    cf.evidences.append(RelationshipEvidence("E1", "E2", 0.31))
    cf.evidences.append(RelationshipEvidence("E1", "E3", 0.12))
    print(cf.entity.entity_id, "n_ev", len(cf.evidences))
    print("scores", [e.signal_score for e in cf.evidences])

s11_ido_5()`,
          output: `E1 n_ev 2
scores [0.31, 0.12]`,
        },
        why: "Composición ensambla el caso sin herencia artificial.",
      },
      {
        demoId: "S11-T3-B-DEMO",
        subtopicId: "S11-T3-B",
        environment: "local-python",
        description: "Protocol EntityStore con get/save; FakeStore en memoria.",
        code: {
          language: 'python',
          title: "fake_store.py",
          code: `from typing import Protocol

class EntityStore(Protocol):
    def get(self, entity_id: str): ...
    def save(self, entity: dict) -> None: ...

class FakeStore:
    def __init__(self):
        self.data = {}
    def get(self, entity_id: str):
        return self.data.get(entity_id)
    def save(self, entity: dict) -> None:
        self.data[entity["entity_id"]] = entity

def upsert(store: EntityStore, entity: dict) -> dict:
    store.save(entity)
    return store.get(entity["entity_id"])

print(upsert(FakeStore(), {"entity_id": "E9", "name": "Demo"}))`,
          output: `{'entity_id': 'E9', 'name': 'Demo'}`,
        },
        why: "El service depende del Protocol, no de una clase base pesada.",
      },
      {
        demoId: "S11-T4-A-DEMO",
        subtopicId: "S11-T4-A",
        environment: "local-python",
        description: "InMemoryClientRepository + service que no decide fraude.",
        code: {
          language: 'python',
          title: "client_service.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    email: str
    def to_dict(self):
        return {"client_id": self.client_id, "email": self.email}

class InMemoryClientRepository:
    def __init__(self):
        self._d = {}
    def save(self, c: ClientRecord):
        self._d[c.client_id] = c
    def get(self, cid: str):
        return self._d.get(cid)

class ClientService:
    def __init__(self, repo):
        self.repo = repo
    def register(self, client_id, email):
        c = ClientRecord(client_id, email)
        self.repo.save(c)
        # deliberadamente no hay is_fraud
        return c.to_dict()

print(ClientService(InMemoryClientRepository()).register("C001", "a@ejemplo.pe"))
print("has_is_fraud", hasattr(ClientService, "is_fraud"))`,
          output: `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}
has_is_fraud False`,
        },
        why: "Service orquesta persistencia; no emite veredictos de fraude.",
      },
      {
        demoId: "S11-T4-B-DEMO",
        subtopicId: "S11-T4-B",
        environment: "local-python",
        description: "Tests de RelationshipEvidence: solo señales; sin is_fraud().",
        code: {
          language: 'python',
          title: "evidence_tests.py",
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float

def test_signal_bounds():
    ev = RelationshipEvidence("E1", "E2", 0.7)
    assert 0 <= ev.signal_score <= 1
    assert not hasattr(ev, "is_fraud")
    return "pass"

def test_no_family_verdict():
    assert not hasattr(RelationshipEvidence, "is_related_family")
    return "pass"

print(test_signal_bounds())
print(test_no_family_verdict())`,
          output: `pass
pass`,
        },
        why: "La suite protege el límite ético del modelo.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Tests del dominio; sin red/DB. Datos sintéticos.",
    steps: [
      {
        id: "S11-T1-A-E1",
        subtopicId: "S11-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T1-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Completa la dataclass ClientRecord con client_id, full_name y phones: list[str]. Salida/pass: primeros tokens de `ClientRecord(client_id='C001', full_name='Ana Pere…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Usa field(default_factory=list).",
        hints: [
          "Usa field(default_factory=list).",
          "Instancia y print.",
        ],
        edgeCases: ["default=[] sería mutable compartido"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "complete_client.py",
          code: `# CASO-LIM-011 · ClientRecord dataclass
# DEFECT: sin fields; default mutable list
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    full_name: str
    phones: list = []

print(ClientRecord("C001", "Ana Perez"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "complete_client.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    full_name: str
    phones: list[str] = field(default_factory=list)

print(ClientRecord("C001", "Ana Perez", ["999111222"]))`,
          output: `ClientRecord(client_id='C001', full_name='Ana Perez', phones=['999111222'])`,
        },
      },
      {
        id: "S11-T1-A-E2",
        subtopicId: "S11-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T1-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Define Transaction con tx_id, client_id, amount: Decimal y currency: str obligatorios; usa Decimal desde texto y PEN en el caso visible. Salida/pass: primeros tokens de `Transaction(tx_id='T1', client_id='C001', amount=D…` según solution. Conserva el contrato del.",
        hint: "Importa Decimal; sin defaults en campos obligatorios.",
        hints: [
          "Importa Decimal; sin defaults en campos obligatorios.",
          "Crea Decimal('150.50'); nunca lo construyas desde float.",
        ],
        edgeCases: ["currency PEN", "dos decimales", "sin float"],
        tests: "Contrato exacto: repr muestra amount=Decimal('150.50') y currency='PEN'; el código no llama float().",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "transaction.py",
          code: `# CASO-LIM-011 · Transaction Decimal
# DEFECT: amount float
from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: float
    currency: str

print(Transaction("T1", "C001", 150.50, "PEN"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "transaction.py",
          code: `from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: Decimal
    currency: str

print(Transaction("T1", "C001", Decimal("150.50"), "PEN"))`,
          output: `Transaction(tx_id='T1', client_id='C001', amount=Decimal('150.50'), currency='PEN')`,
        },
      },
      {
        id: "S11-T1-A-E3",
        subtopicId: "S11-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T1-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Migra un dict anónimo a ClientRecord vía from_dict. Salida/pass: `ClientRecord C007`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "classmethod from_dict.",
        hints: [
          "classmethod from_dict.",
          "Imprime el tipo y el id.",
        ],
        edgeCases: ["KeyError si falta campo — aceptable o validar en T1-B"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "migrate_dict.py",
          code: `# CASO-LIM-011 · from_dict factory
# DEFECT: no classmethod; construye mal
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    full_name: str

    def from_dict(self, d: dict):
        return d

raw = {"client_id": "C007", "full_name": "Luis Ramos"}
c = ClientRecord.from_dict(ClientRecord("x", "y"), raw)
print(type(c).__name__, getattr(c, "client_id", c))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "migrate_dict.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    full_name: str

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        return cls(d["client_id"], d["full_name"])

raw = {"client_id": "C007", "full_name": "Luis Ramos"}
c = ClientRecord.from_dict(raw)
print(type(c).__name__, c.client_id)`,
          output: `ClientRecord C007`,
        },
      },
      {
        id: "S11-T1-B-E1",
        subtopicId: "S11-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T1-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Añade invariantes: amount Decimal > 0, cuantizado a 0.01, y currency en {'PEN', 'USD'} sin conversión silenciosa. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19;.",
        hint: "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
        hints: [
          "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
          "Muestra ok PEN y rechazos por cero y EUR.",
        ],
        edgeCases: ["amount negativo", "float prohibido", "currency minúscula", "EUR fuera del allowlist"],
        tests: "Contrato exacto: Decimal('10.00')/PEN válido; cero y EUR lanzan ValueError; float 10.0 se rechaza; no se convierte currency automáticamente.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "tx_invariant.py",
          code: `# CASO-LIM-011 · Transaction invariants
# DEFECT: no post_init; acepta 0 y EUR
from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Transaction:
    tx_id: str
    amount: Decimal
    currency: str

print(Transaction("T1", Decimal("10.00"), "PEN"))
print(Transaction("T2", Decimal("0.00"), "PEN"))
print(Transaction("T3", Decimal("1.00"), "EUR"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "tx_invariant.py",
          code: `from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Transaction:
    tx_id: str
    amount: Decimal
    currency: str

    def __post_init__(self):
        if not isinstance(self.amount, Decimal):
            raise TypeError("amount debe ser Decimal")
        if self.amount <= Decimal("0"):
            raise ValueError("amount debe ser > 0")
        if self.amount != self.amount.quantize(Decimal("0.01")):
            raise ValueError("amount debe tener máximo 2 decimales")
        if self.currency not in {"PEN", "USD"}:
            raise ValueError("currency no soportada")

print(Transaction("T1", Decimal("10.00"), "PEN"))
try:
    Transaction("T2", Decimal("0.00"), "PEN")
except ValueError as e:
    print("reject", e)
try:
    Transaction("T3", Decimal("1.00"), "EUR")
except ValueError as e:
    print("reject", e)`,
          output: `Transaction(tx_id='T1', amount=Decimal('10.00'), currency='PEN')
reject amount debe ser > 0
reject currency no soportada`,
        },
      },
      {
        id: "S11-T1-B-E2",
        subtopicId: "S11-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T1-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Factory from_dict con validación de client_id y document_id no vacíos. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Raise ValueError con mensaje claro.",
        hints: [
          "Raise ValueError con mensaje claro.",
          "Prueba ok y fail.",
        ],
        edgeCases: ["strip evita espacios como id válido"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "from_dict_validate.py",
          code: `# CASO-LIM-011 · from_dict validation
# DEFECT: no valida vacío
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        return cls(str(d.get("client_id", "")), str(d.get("document_id", "")))

print(ClientRecord.from_dict({"client_id": "C1", "document_id": "D1"}))
print(ClientRecord.from_dict({"client_id": "C2", "document_id": " "}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "from_dict_validate.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        cid = str(d.get("client_id", "")).strip()
        doc = str(d.get("document_id", "")).strip()
        if not cid:
            raise ValueError("client_id vacío")
        if not doc:
            raise ValueError("document_id vacío")
        return cls(cid, doc)

print(ClientRecord.from_dict({"client_id": "C1", "document_id": "D1"}))
try:
    ClientRecord.from_dict({"client_id": "C2", "document_id": " "})
except ValueError as e:
    print(e)`,
          output: `ClientRecord(client_id='C1', document_id='D1')
document_id vacío`,
        },
      },
      {
        id: "S11-T1-B-E3",
        subtopicId: "S11-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T1-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Lista en español 4 invariantes del dominio e imprímelas. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "ClientRecord, Transaction, Evidence, Entity.",
        hints: [
          "ClientRecord, Transaction, Evidence, Entity.",
          "Formato INV: ...",
        ],
        edgeCases: ["Invariantes de negocio ≠ veredictos de fraude"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "invariants_list.py",
          code: `# CASO-LIM-011 · invariants list
# DEFECT: omite signal_score y entity_id
for inv in [
    "INV: ClientRecord.document_id no vacío",
    "INV: Transaction.amount es float > 0",
]:
    print(inv)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "invariants_list.py",
          code: `for inv in [
    "INV: ClientRecord.document_id no vacío",
    "INV: Transaction.amount es Decimal > 0 (0.01) y currency es PEN o USD",
    "INV: RelationshipEvidence.signal_score entre 0 y 1",
    "INV: ResolvedEntity.entity_id único y no vacío",
]:
    print(inv)`,
          output: `INV: ClientRecord.document_id no vacío
INV: Transaction.amount es Decimal > 0 (0.01) y currency es PEN o USD
INV: RelationshipEvidence.signal_score entre 0 y 1
INV: ResolvedEntity.entity_id único y no vacío`,
        },
      },
      {
        id: "S11-T2-A-E1",
        subtopicId: "S11-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T2-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Property full_name desde first_name y last_name. Salida/pass: `Ana Perez`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "@property sin setter.",
        hints: [
          "@property sin setter.",
          "Print full_name.",
        ],
        edgeCases: ["No guardar full_name duplicado si se puede calcular"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "full_name_prop.py",
          code: `# CASO-LIM-011 · full_name property
# DEFECT: método no property; orden apellido primero
from dataclasses import dataclass

@dataclass
class Person:
    first_name: str
    last_name: str

    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name}"

print(Person("Ana", "Perez").full_name())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "full_name_prop.py",
          code: `from dataclasses import dataclass

@dataclass
class Person:
    first_name: str
    last_name: str

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

print(Person("Ana", "Perez").full_name)`,
          output: `Ana Perez`,
        },
      },
      {
        id: "S11-T2-A-E2",
        subtopicId: "S11-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T2-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Método age_days_since(day: int) en Transaction con campo day_created: int (demo sin datetime). Salida/pass: `15`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Retorna day - day_created.",
        hints: [
          "Retorna day - day_created.",
          "Prueba con números sintéticos.",
        ],
        edgeCases: ["En prod usa date/datetime; aquí simplificamos"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "age_days.py",
          code: `# CASO-LIM-011 · age_days_since
# DEFECT: day_created - day invertido
from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    day_created: int

    def age_days_since(self, day: int) -> int:
        return self.day_created - day

print(Transaction("T1", 10).age_days_since(25))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "age_days.py",
          code: `from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    day_created: int

    def age_days_since(self, day: int) -> int:
        return day - self.day_created

print(Transaction("T1", 10).age_days_since(25))`,
          output: `15`,
        },
      },
      {
        id: "S11-T2-A-E3",
        subtopicId: "S11-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T2-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Encapsula mutación de score con setter que solo clases, dataclass, composition (S01–S11).",
        hint: "Property score + math.isfinite antes del rango.",
        hints: [
          "Property score + math.isfinite antes del rango.",
          "Muestra ok y rechaza 1.5 y NaN.",
        ],
        edgeCases: ["NaN", "Infinity", "score es señal, no veredicto"],
        tests: "Contrato exacto: 0.4 válido; 1.5 y float('nan') lanzan ValueError('score fuera de rango').",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "score_setter.py",
          code: `# CASO-LIM-011 · score setter 0..1
# DEFECT: no valida rango ni nan
from math import isfinite

class Signal:
    def __init__(self):
        self._score = 0.0

    @property
    def score(self) -> float:
        return self._score

    @score.setter
    def score(self, value: float) -> None:
        self._score = float(value)

s = Signal()
s.score = 0.4
print("ok", s.score)
s.score = 1.5
print("ok", s.score)
s.score = float("nan")
print("ok", s.score)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "score_setter.py",
          code: `from math import isfinite

class Signal:
    def __init__(self):
        self._score = 0.0

    @property
    def score(self) -> float:
        return self._score

    @score.setter
    def score(self, value: float) -> None:
        v = float(value)
        if not isfinite(v) or not 0.0 <= v <= 1.0:
            raise ValueError("score fuera de rango")
        self._score = v

s = Signal()
s.score = 0.4
print("ok", s.score)
try:
    s.score = 1.5
except ValueError as e:
    print("reject", e)
try:
    s.score = float("nan")
except ValueError as e:
    print("reject_nan", e)`,
          output: `ok 0.4
reject score fuera de rango
reject_nan score fuera de rango`,
        },
      },
      {
        id: "S11-T2-B-E1",
        subtopicId: "S11-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T2-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Implementa ResolvedEntity frozen con igualdad/hash solo por entity_id; display_name puede cambiar sin cambiar identidad. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de.",
        hint: "dataclass(frozen=True) + field(compare=False) en display_name.",
        hints: [
          "dataclass(frozen=True) + field(compare=False) en display_name.",
          "Dos E1 con nombres distintos son iguales; E2 no lo es.",
        ],
        edgeCases: ["entity_id vacío se rechaza", "document_id nunca participa en identidad"],
        tests: "Contrato exacto: E1/Ana == E1/Ana actualizada; E1 != E2; set tiene 2 elementos; entity_id vacío lanza ValueError.",
        feedback: "La identidad estable es entity_id; etiquetas y documentos pueden corregirse.",
        starterCode: {
          language: 'python',
          title: "entity_identity.py",
          code: `# CASO-LIM-011 · frozen equality
# DEFECT: no frozen; name en compare
from dataclasses import dataclass

@dataclass
class ResolvedEntity:
    entity_id: str
    display_name: str

a = ResolvedEntity("E1", "Ana")
b = ResolvedEntity("E1", "Ana actualizada")
c = ResolvedEntity("E2", "Ana")
print(a == b, a == c)
print(len({a, b, c}))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "entity_identity.py",
          code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str = field(compare=False)

    def __post_init__(self):
        if not self.entity_id.strip():
            raise ValueError("entity_id vacío")

a = ResolvedEntity("E1", "Ana")
b = ResolvedEntity("E1", "Ana actualizada")
c = ResolvedEntity("E2", "Ana")
print(a == b, a == c)
print(len({a, b, c}))`,
          output: `True False
2`,
        },
      },
      {
        id: "S11-T2-B-E2",
        subtopicId: "S11-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T2-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Crea Evidence frozen value object y úsalo en un set. Salida/pass: `2`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "frozen=True dataclass.",
        hints: [
          "frozen=True dataclass.",
          "Imprime len del set con duplicado.",
        ],
        edgeCases: ["Duplicado exacto colapsa en set"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "frozen_evidence.py",
          code: `# CASO-LIM-011 · frozen set dedup
# DEFECT: no frozen; len wrong
from dataclasses import dataclass

@dataclass
class Evidence:
    left_id: str
    right_id: str
    signal_score: float

s = {
    Evidence("E1", "E2", 0.2),
    Evidence("E1", "E2", 0.2),
    Evidence("E1", "E3", 0.1),
}
print(len(s))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "frozen_evidence.py",
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Evidence:
    left_id: str
    right_id: str
    signal_score: float

s = {
    Evidence("E1", "E2", 0.2),
    Evidence("E1", "E2", 0.2),
    Evidence("E1", "E3", 0.1),
}
print(len(s))`,
          output: `2`,
        },
      },
      {
        id: "S11-T2-B-E3",
        subtopicId: "S11-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T2-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Demuestra el bug de entidad mutable como key de dict y la versión frozen segura. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Imprime BUG y SAFE.",
        hints: [
          "Imprime BUG y SAFE.",
          "Con mutable: cambiar campo rompe lookup.",
        ],
        edgeCases: ["No implementes __hash__ en mutables"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mutable_key_bug.py",
          code: `# CASO-LIM-011 · mutable hash bug
# DEFECT: no muestra SAFE frozen
class MutableEntity:
    def __init__(self, eid, name):
        self.eid = eid
        self.name = name
    def __hash__(self):
        return hash((self.eid, self.name))
    def __eq__(self, o):
        return isinstance(o, MutableEntity) and (self.eid, self.name) == (o.eid, o.name)

m = MutableEntity("E1", "Ana")
d = {m: "row"}
m.name = "Ana P"
print("BUG lookup_after_mutate", d.get(m))
print("SAFE", "skipped")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "mutable_key_bug.py",
          code: `class MutableEntity:
    def __init__(self, eid, name):
        self.eid = eid
        self.name = name
    def __hash__(self):
        return hash((self.eid, self.name))
    def __eq__(self, o):
        return isinstance(o, MutableEntity) and (self.eid, self.name) == (o.eid, o.name)

m = MutableEntity("E1", "Ana")
d = {m: "row"}
m.name = "Ana P"  # mutó la key
print("BUG lookup_after_mutate", d.get(m))

from dataclasses import dataclass

@dataclass(frozen=True)
class FrozenEntity:
    eid: str
    name: str

f = FrozenEntity("E1", "Ana")
d2 = {f: "row"}
print("SAFE", d2.get(FrozenEntity("E1", "Ana")))`,
          output: `BUG lookup_after_mutate None
SAFE row`,
        },
      },
      {
        id: "S11-T3-A-E1",
        subtopicId: "S11-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T3-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Reemplaza herencia innecesaria Client(Person) por composición Client tiene person_info dict/objeto. Salida/pass: `C001 Ana | design=composition`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Imprime el diseño final simple.",
        hints: [
          "Imprime el diseño final simple.",
          "Sin class Person base.",
        ],
        edgeCases: ["Composición permite cambiar PersonInfo sin romper Client"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "replace_inheritance.py",
          code: `# CASO-LIM-011 · composition
# DEFECT: herencia Person; design=inheritance
from dataclasses import dataclass

@dataclass
class PersonInfo:
    first_name: str
    last_name: str

@dataclass
class Client(PersonInfo):
    client_id: str

c = Client("Ana", "Perez", "C001")
print(c.client_id, c.first_name)
print("design=inheritance")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "replace_inheritance.py",
          code: `from dataclasses import dataclass

@dataclass
class PersonInfo:
    first_name: str
    last_name: str

@dataclass
class Client:
    client_id: str
    person: PersonInfo

c = Client("C001", PersonInfo("Ana", "Perez"))
print(c.client_id, c.person.first_name)
print("design=composition")`,
          output: `C001 Ana
design=composition`,
        },
      },
      {
        id: "S11-T3-A-E2",
        subtopicId: "S11-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T3-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: CaseFile agrega evidencias con add_evidence y cuenta. Salida/pass: `n= 2`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Lista interna.",
        hints: [
          "Lista interna.",
          "Print n=2.",
        ],
        edgeCases: ["Validar score en el value object, no solo en CaseFile"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "casefile_add.py",
          code: `# CASO-LIM-011 · CaseFile evidences
# DEFECT: default mutable list
from dataclasses import dataclass

@dataclass
class CaseFile:
    case_id: str
    evidences: list = []

    def add_evidence(self, ev: dict) -> None:
        self.evidences.append(ev)

cf = CaseFile("CF1")
cf.add_evidence({"score": 0.1})
cf2 = CaseFile("CF2")
print("n=", len(cf2.evidences))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "casefile_add.py",
          code: `from dataclasses import dataclass, field

@dataclass
class CaseFile:
    case_id: str
    evidences: list = field(default_factory=list)

    def add_evidence(self, ev: dict) -> None:
        self.evidences.append(ev)

cf = CaseFile("CF1")
cf.add_evidence({"score": 0.1})
cf.add_evidence({"score": 0.2})
print("n=", len(cf.evidences))`,
          output: `n= 2`,
        },
      },
      {
        id: "S11-T3-A-E3",
        subtopicId: "S11-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T3-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Justifica en 2 líneas por qué no heredar Client de Person; imprime JUST: ... Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Piensa en roles y evolución del modelo.",
        hints: [
          "Piensa en roles y evolución del modelo.",
          "Español profesional.",
        ],
        edgeCases: ["is-a real: SavingsAccount is-a Account tal vez; Client is-a Person rara vez aporta"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "why_not_inherit.py",
          code: `# CASO-LIM-011 · composition justification
# DEFECT: recomienda herencia profunda
print("JUST: Client debe heredar de Person siempre")
print("JUST: composición solo si no hay tiempo")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "why_not_inherit.py",
          code: `print("JUST: un cliente tiene datos de persona, pero también roles, cuentas y evidencias que no son subtipo de Person")
print("JUST: la composición evita jerarquías frágiles cuando Person cambia sin ser Client")`,
          output: `JUST: un cliente tiene datos de persona, pero también roles, cuentas y evidencias que no son subtipo de Person
JUST: la composición evita jerarquías frágiles cuando Person cambia sin ser Client`,
        },
      },
      {
        id: "S11-T3-B-E1",
        subtopicId: "S11-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T3-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Define Protocol Scorer con score(pair: tuple[str,str]) -> float y un FakeScorer. Salida/pass: `0.5`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Imprime el score de un par sintético.",
        hints: [
          "Imprime el score de un par sintético.",
          "typing.Protocol.",
        ],
        edgeCases: ["El Protocol no se instancia"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "scorer_protocol.py",
          code: `# CASO-LIM-011 · Protocol Scorer
# DEFECT: FakeScorer sin score method name
from typing import Protocol

class Scorer(Protocol):
    def score(self, pair: tuple[str, str]) -> float: ...

class FakeScorer:
    def compute(self, pair: tuple[str, str]) -> float:
        return 0.5

s = FakeScorer()
print(s.compute(("E1", "E2")))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "scorer_protocol.py",
          code: `from typing import Protocol

class Scorer(Protocol):
    def score(self, pair: tuple[str, str]) -> float: ...

class FakeScorer:
    def score(self, pair: tuple[str, str]) -> float:
        return 0.5 if pair[0] != pair[1] else 1.0

s: Scorer = FakeScorer()
print(s.score(("E1", "E2")))`,
          output: `0.5`,
        },
      },
      {
        id: "S11-T3-B-E2",
        subtopicId: "S11-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T3-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Dos implementaciones de normalizer (strip vs casefold) usables por la misma función apply. Salida/pass: `Ana | ana`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "apply(norm, text) llama norm(text).",
        hints: [
          "apply(norm, text) llama norm(text).",
          "Imprime ambos resultados.",
        ],
        edgeCases: ["Duck typing: cualquier callable sirve"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "two_normalizers.py",
          code: `# CASO-LIM-011 · inject normalizer
# DEFECT: apply ignora norm
def apply(norm, text):
    return text

def strip_norm(s: str) -> str:
    return s.strip()

def casefold_norm(s: str) -> str:
    return s.strip().casefold()

print(apply(strip_norm, " Ana "))
print(apply(casefold_norm, " Ana "))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "two_normalizers.py",
          code: `def apply(norm, text):
    return norm(text)

def strip_norm(s: str) -> str:
    return s.strip()

def casefold_norm(s: str) -> str:
    return s.strip().casefold()

print(apply(strip_norm, " Ana "))
print(apply(casefold_norm, " Ana "))`,
          output: `Ana
ana`,
        },
      },
      {
        id: "S11-T3-B-E3",
        subtopicId: "S11-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T3-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Escribe 2 razones para NO introducir Protocol aún e imprime WHEN_NOT. Salida/pass: primeros tokens de `WHEN_NOT: solo hay una implementación y no hay tes…` según solution. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de.",
        hint: "YAGNI / una sola implementación.",
        hints: [
          "YAGNI / una sola implementación.",
          "Español claro.",
        ],
        edgeCases: ["Cuando aparece el segundo adapter, el Protocol suele justificar"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "when_not_protocol.py",
          code: `# CASO-LIM-011 · when not Protocol
# DEFECT: siempre crea Protocol
print("WHEN_NOT: nunca; siempre Protocol")
print("WHEN_NOT: siempre congela API día 1")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "when_not_protocol.py",
          code: `print("WHEN_NOT: solo hay una implementación y no hay tests con fake")
print("WHEN_NOT: el puerto aún no es estable y crear Protocol congela una API prematura")`,
          output: `WHEN_NOT: solo hay una implementación y no hay tests con fake
WHEN_NOT: el puerto aún no es estable y crear Protocol congela una API prematura`,
        },
      },
      {
        id: "S11-T4-A-E1",
        subtopicId: "S11-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T4-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: to_dict de ClientRecord sin campos password/secret. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Aunque existan en el objeto, no serializarlos.",
        hints: [
          "Aunque existan en el objeto, no serializarlos.",
          "Print dict.",
        ],
        edgeCases: ["password no debería vivir en el dominio de familiaridad idealmente"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "to_dict_safe.py",
          code: `# CASO-LIM-011 · to_dict sin password
# DEFECT: incluye password
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    email: str
    password: str = ""

    def to_dict(self) -> dict:
        return {"client_id": self.client_id, "email": self.email, "password": self.password}

print(ClientRecord("C1", "a@ejemplo.pe", "secret").to_dict())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "to_dict_safe.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    email: str
    password: str = ""

    def to_dict(self) -> dict:
        return {"client_id": self.client_id, "email": self.email}

print(ClientRecord("C1", "a@ejemplo.pe", "secret").to_dict())`,
          output: `{'client_id': 'C1', 'email': 'a@ejemplo.pe'}`,
        },
      },
      {
        id: "S11-T4-A-E2",
        subtopicId: "S11-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T4-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Repository save/get con dict store en memoria. Salida/pass: `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}`. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Clase con save y get.",
        hints: [
          "Clase con save y get.",
          "Roundtrip de un client dict.",
        ],
        edgeCases: ["get retorna None si no existe"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mem_repo.py",
          code: `# CASO-LIM-011 · Repo save/get
# DEFECT: get siempre None
class Repo:
    def __init__(self):
        self._d = {}
    def save(self, row: dict) -> None:
        self._d[row["client_id"]] = row
    def get(self, client_id: str):
        return None

r = Repo()
r.save({"client_id": "C001", "email": "a@ejemplo.pe"})
print(r.get("C001"))
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "mem_repo.py",
          code: `class Repo:
    def __init__(self):
        self._d = {}
    def save(self, row: dict) -> None:
        self._d[row["client_id"]] = row
    def get(self, client_id: str):
        return self._d.get(client_id)

r = Repo()
r.save({"client_id": "C001", "email": "a@ejemplo.pe"})
print(r.get("C001"))`,
          output: `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}`,
        },
      },
      {
        id: "S11-T4-A-E3",
        subtopicId: "S11-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T4-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Dibuja en texto la frontera dominio vs CLI I/O (3 capas). Salida/pass: primeros tokens de `LAYER: cli — argparse, stdin/stdout, exit codes | …` según solution. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19 solo clases, dataclass, composition (S01–S11).",
        hint: "cli → service → domain/repo.",
        hints: [
          "cli → service → domain/repo.",
          "Imprime LAYER líneas.",
        ],
        edgeCases: ["Logging puede colgarse del service con correlation_id"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "boundary_layers.py",
          code: `# CASO-LIM-011 · layers
# DEFECT: service con print; cli sin exit codes
for line in [
    "LAYER: cli — solo print",
    "LAYER: service — print de negocio",
    "LAYER: domain/repo — acoplado a sqlite",
]:
    print(line)
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "boundary_layers.py",
          code: `for line in [
    "LAYER: cli — argparse, stdin/stdout, exit codes",
    "LAYER: service — casos de uso, sin print",
    "LAYER: domain/repo — entidades, invariantes, persistencia abstracta",
]:
    print(line)`,
          output: `LAYER: cli — argparse, stdin/stdout, exit codes
LAYER: service — casos de uso, sin print
LAYER: domain/repo — entidades, invariantes, persistencia abstracta`,
        },
      },
      {
        id: "S11-T4-B-E1",
        subtopicId: "S11-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: S11-T4-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Test de invariante ClientRecord: document_id vacío lanza ValueError; imprime pass. Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Usa assert en un try o pytest-style manual.",
        hints: [
          "Usa assert en un try o pytest-style manual.",
          "print('pass') al final.",
        ],
        edgeCases: ["Tests puros: sin I/O"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "test_invariant.py",
          code: `# CASO-LIM-011 · test empty document
# DEFECT: no post_init; test always pass
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

def test_empty_document_rejected():
    ClientRecord("C1", " ")
    return "pass"

print(test_empty_document_rejected())
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "test_invariant.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    def __post_init__(self):
        if not self.document_id.strip():
            raise ValueError("document_id vacío")

def test_empty_document_rejected():
    try:
        ClientRecord("C1", " ")
        assert False, "debía fallar"
    except ValueError:
        return "pass"

print(test_empty_document_rejected())`,
          output: `pass`,
        },
      },
      {
        id: "S11-T4-B-E2",
        subtopicId: "S11-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: S11-T4-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Fake repo en 3 tests de servicio (register, get, missing). Salida/pass: salida exacta del solution output del starter. Conserva el contrato del starter (no borres asserts ni datos); no frameworks web, no ORMs de S19; solo clases, dataclass, composition (S01–S11).",
        hint: "Imprime pass x3.",
        hints: [
          "Imprime pass x3.",
          "Service simple con repo inyectado.",
        ],
        edgeCases: ["Fake no es mock mágico: es implementación en memoria"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "fake_repo_tests.py",
          code: `# CASO-LIM-011 · FakeRepo service tests
# DEFECT: tests no ejecutan asserts reales
class FakeRepo:
    def __init__(self):
        self.d = {}
    def save(self, row):
        pass
    def get(self, id):
        return None

class Service:
    def __init__(self, repo):
        self.repo = repo
    def register(self, id, name):
        return {"id": id, "name": name}

def test_register():
    print("pass")

def test_get():
    print("pass")

def test_missing():
    print("pass")

test_register(); test_get(); test_missing()
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "fake_repo_tests.py",
          code: `class FakeRepo:
    def __init__(self):
        self.d = {}
    def save(self, row):
        self.d[row["id"]] = row
    def get(self, id):
        return self.d.get(id)

class Service:
    def __init__(self, repo):
        self.repo = repo
    def register(self, id, name):
        self.repo.save({"id": id, "name": name})
        return self.repo.get(id)

def test_register():
    s = Service(FakeRepo())
    assert s.register("C1", "Ana")["name"] == "Ana"
    print("pass")

def test_get():
    repo = FakeRepo()
    Service(repo).register("C1", "Ana")
    assert repo.get("C1")["id"] == "C1"
    print("pass")

def test_missing():
    assert Service(FakeRepo()).repo.get("X") is None
    print("pass")

test_register(); test_get(); test_missing()`,
          output: `pass
pass
pass`,
        },
      },
      {
        id: "S11-T4-B-E3",
        subtopicId: "S11-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: S11-T4-B (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Revisa una clase con decide_fraud y propón extracción: imprime ANTES/DESPUÉS conceptual. Salida/pass: primeros tokens de `ANTES: Client.decide_fraud(score)->bool veredicto …` según solution. Conserva el contrato del starter (no borres asserts ni datos); no.",
        hint: "Mueve el score a Evidence; elimina el veredicto.",
        hints: [
          "Mueve el score a Evidence; elimina el veredicto.",
          "Dos líneas.",
        ],
        edgeCases: ["Umbrales de producto no son invariantes de entidad"],
        tests: "Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra.",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "extract_fraud.py",
          code: `# CASO-LIM-011 · no fraud in domain
# DEFECT: mantiene decide_fraud en dominio
print("ANTES: Client.decide_fraud(score)->bool veredicto en el dominio")
print("DESPUES: Client.decide_fraud(score)->bool sigue en el dominio")
print('ok', True)`,
        },
        solutionCode: {
          language: 'python',
          title: "extract_fraud.py",
          code: `print("ANTES: Client.decide_fraud(score)->bool veredicto en el dominio")
print("DESPUES: RelationshipEvidence.signal_score: float + revisión humana fuera del modelo")`,
          output: `ANTES: Client.decide_fraud(score)->bool veredicto en el dominio
DESPUES: RelationshipEvidence.signal_score: float + revisión humana fuera del modelo`,
        },
      },
    ],
  },
  youDo: {
    title: "Modelo de dominio Cliente–Transacción–Evidencia",
    context:
      "Implementas el núcleo de **CP-N1-C**: ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence con invariantes, serialización y repo en memoria. **Ninguna clase decide fraude o parentesco.** Reemplaza el legado de test suite churn.",
    objectives: [
      "Implementar ClientRecord, ResolvedEntity, Transaction, RelationshipEvidence",
      "Invariantes en construcción y equality consciente",
      "Ningún método is_fraud / is_related_family: scores no son veredicto de fraude ni parentesco",
      "Serialización + repositorio en memoria",
      "Tests unitarios del dominio con datos sintéticos",
    ],
    requirements: [
      "Cuatro tipos explícitos con type hints",
      "Scores solo como campos de datos si existen — no veredictos",
      "ResolvedEntity usa entity_id estable para eq/hash; display_name y document_id no definen identidad",
      "Transaction.amount es Decimal positivo con 2 decimales y currency está en {'PEN', 'USD'}",
      "RelationshipEvidence usa ids distintos en orden canónico y score finito en [0, 1]",
      "README de límites del modelo",
      "Tests del dominio puros (sin red/DB)",
      "Datos sintéticos ejemplo.pe / C00x",
      "Service sin side-effects de CLI",
    ],
    starterCode: `"""Modelo de dominio Cliente–Transacción–Evidencia (CP-N1-C).
Ningún método decide fraude ni parentesco. Datos sintéticos.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from decimal import Decimal
from math import isfinite
from typing import Protocol

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not self.client_id or not self.document_id.strip():
            raise ValueError("client_id/document_id inválidos")

    def to_dict(self) -> dict:
        return {
            "client_id": self.client_id,
            "document_id": self.document_id,
            "full_name": self.full_name,
            "emails": list(self.emails),
        }

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str = field(compare=False)

    def __post_init__(self) -> None:
        if not self.entity_id.strip():
            raise ValueError("entity_id vacío")

@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: Decimal
    currency: str

    def __post_init__(self) -> None:
        if not isinstance(self.amount, Decimal):
            raise TypeError("amount debe ser Decimal")
        if self.amount <= Decimal("0"):
            raise ValueError("amount debe ser > 0")
        if self.amount != self.amount.quantize(Decimal("0.01")):
            raise ValueError("amount debe tener máximo 2 decimales")
        if self.currency not in {"PEN", "USD"}:
            raise ValueError("currency no soportada")

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

    def __post_init__(self) -> None:
        if not self.left_id < self.right_id:
            raise ValueError("par no canónico")
        if not isfinite(self.signal_score) or not 0.0 <= self.signal_score <= 1.0:
            raise ValueError("signal_score fuera de rango")

class ClientRepository(Protocol):
    def save(self, client: ClientRecord) -> None: ...
    def get(self, client_id: str) -> ClientRecord | None: ...

class InMemoryClientRepository:
    def __init__(self) -> None:
        self._d: dict[str, ClientRecord] = {}

    def save(self, client: ClientRecord) -> None:
        self._d[client.client_id] = client

    def get(self, client_id: str) -> ClientRecord | None:
        return self._d.get(client_id)

def test_domain() -> None:
    repo = InMemoryClientRepository()
    c = ClientRecord("C001", "DNI-1", "Ana Perez", ["ana@ejemplo.pe"])
    repo.save(c)
    assert repo.get("C001") is not None
    assert not hasattr(RelationshipEvidence, "is_fraud")
    ev = RelationshipEvidence("E1", "E2", 0.4)
    assert ev.signal_score == 0.4
    assert ResolvedEntity("E1", "Ana") == ResolvedEntity("E1", "Ana actualizada")
    tx = Transaction("T1", "C001", Decimal("150.50"), "PEN")
    assert tx.amount == Decimal("150.50")
    print("tests_pass")

if __name__ == "__main__":
    test_domain()
    print(ClientRecord("C002", "DNI-2", "Luis").to_dict())`,
    portfolioNote:
      "Diagrama textual de entidades + lista de invariantes + badge mental 'sin is_fraud'. Muestra 3 tests pasando sobre FakeStore.",
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
        question: "¿Por qué `field(default_factory=list)` y no `= []`?",
        options: ["Es más corto", "Obliga a usar Protocol", "Evita el default mutable compartido entre instancias", "Activa el garbage collector"],
        correctIndex: 2,
        explanation:
          "Un [] compartido muta todas las instancias.",
      },
      {
        question: "RelationshipEvidence.signal_score representa…",
        options: ["Una señal/dato numérico, no un veredicto de fraude o familia", "Veredicto legal de parentesco", "Password hasheado", "Exit code del CLI"],
        correctIndex: 0,
        explanation:
          "El dominio almacena evidencia; no decide fraude/parentesco.",
      },
      {
        question: "Un Protocol EntityStore sirve para…",
        options: ["Conectarse solo a Postgres", "Definir un puerto get/save implementable por fakes y adapters", "Reemplazar dataclass", "Serializar a PDF"],
        correctIndex: 1,
        explanation:
          "Puertos estructurales sin herencia forzada.",
      },
      {
        question: "Objeto inválido: ¿cuándo fallar?",
        options: ["Al final del mes", "Nunca", "Solo en producción", "En la construcción (__post_init__/validate)"],
        correctIndex: 3,
        explanation:
          "Fail on invalid construct evita estados corruptos.",
      },
      {
        question: "Client hereda de Person…",
        options: ["Siempre es la mejor opción", "Es obligatoria en Python", "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar", "Impide tests"],
        correctIndex: 2,
        explanation:
          "has-a > is-a forzado sin subtipo real.",
      },
      {
        question: "¿Qué no debe tener el dominio de familiaridad?",
        options: ["is_fraud() automático", "to_dict", "Invariantes", "Tests unitarios"],
        correctIndex: 0,
        explanation:
          "Sin veredictos de fraude en el modelo del curso.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "dataclasses — Data Classes",
        url: "https://docs.python.org/3/library/dataclasses.html",
        note: "frozen, field, post_init, compare=False",
      },
      {
        label: "typing.Protocol",
        url: "https://docs.python.org/3/library/typing.html#typing.Protocol",
        note: "puertos estructurales EntityStore",
      },
      {
        label: "unittest — Unit testing framework",
        url: "https://docs.python.org/3/library/unittest.html",
        note: "tests de dominio puro sin red",
      },
      {
        label: "decimal — Decimal fixed point",
        url: "https://docs.python.org/3/library/decimal.html",
        note: "Transaction.amount sin float money",
      },
      {
        label: "Data model — special methods",
        url: "https://docs.python.org/3/reference/datamodel.html#object.__eq__",
        note: "eq/hash/frozen identity",
      },
      {
        label: "typing — structural subtyping PEP 544",
        url: "https://peps.python.org/pep-0544/",
        note: "Protocols vs ABC",
      },
    ],
    books: [
      {
        label: "Architecture Patterns with Python (Percival & Gregory)",
        note: "Repo/service/protocol — capas sin fraude auto.",
      },
      {
        label: "Fluent Python — object model",
        note: "eq/hash y data model consciente.",
      },
    ],
    courses: [
      {
        label: "pytest docs (soporte de calidad)",
        url: "https://docs.pytest.org/",
        note: "Testing reubicado; target V3 S11 = dominio OOP.",
      },
      {
        label: "Real Python — Python Classes",
        url: "https://realpython.com/python-classes/",
        note: "instancias, methods, encapsulation.",
      },
      {
        label: "MIT 6.100L — objects & classes",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "fundamentos de objetos.",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "curso desplegado; alinear con V3 S11.",
      },
    ],
  },
}
