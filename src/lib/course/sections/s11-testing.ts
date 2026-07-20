import type { CourseSection } from '../../types'

export const section11: CourseSection = {
  id: "testing",
  index: 11,
  title: "OOP y modelo de dominio",
  shortTitle: "OOP dominio",
  tagline: "ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence sin decidir fraude ni parentesco",
  estimatedHours: 10,
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
        "En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad). Aquí modelas el **dominio de familiaridad**: `ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`.",
        "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Id de plataforma `testing` se conserva.",
        "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests).",
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
        "Una **clase** define el molde; una **instancia** es un objeto concreto. `@dataclass` genera `__init__`, `__repr__` y opcionalmente comparación.",
        "Campos con **type hints** y `default_factory` para mutables (listas/dicts) evitan el clásico bug del default compartido.",
        "Migrar dicts anónimos a tipos nombra el dominio y habilita invariantes en T1-B.",
      ],
      code: {
        language: 'python',
        title: "client_dataclass.py",
        code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

c = ClientRecord("C001", "Ana Perez", ["ana@ejemplo.pe"])
print(c)
print(type(c).__name__, c.client_id)`,
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
        "`__post_init__` en dataclasses valida justo después de construir. Si el estado es inválido, **falla al crear** — no dejes objetos a medias.",
        "Método `validate()` reutilizable ayuda en factories `from_dict`. Sin side-effects de negocio externos (no llama APIs al validar).",
        "Ejemplo: `document_id` no vacío; fechas de transacción coherentes.",
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
        "`@property` expone campos calculados (`display_name`, `masked_email`) sin mutación peligrosa desde afuera.",
        "Métodos de instancia encapsulan consultas (`age_days_since`). Evita exponer PII raw en la superficie pública si puedes ofrecer máscaras.",
        "Setters validados solo cuando la mutación es parte del modelo; si no, prefiere frozen/nuevas instancias.",
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
        "`__eq__` por **business key** (document_id / entity_id) evita comparar basura de campos opcionales. **`frozen=True`** habilita hash seguro para sets/dicts.",
        "Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas campos del eq.",
        "Value objects (Evidence) suelen ser frozen; agregados con listas pueden ser mutables con cuidado.",
      ],
      code: {
        language: 'python',
        title: "frozen_entity.py",
        code: `from dataclasses import dataclass

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str

a = ResolvedEntity("E1", "Ana")
b = ResolvedEntity("E1", "Ana Perez")
s = {a, ResolvedEntity("E2", "Luis")}
print("same id eq?", a == ResolvedEntity("E1", "otra"))
# eq por defecto usa todos los campos; demo de set por identidad de valor completo
print("set size", len(s))
print("E1 in set", a in s)`,
        output: `same id eq? False
set size 2
E1 in set True`,
      },
      callout: {
        type: "info",
        title: "eq custom",
        content:
          "Si eq es solo por entity_id, implementa __eq__/__hash__ a mano o usa field compare.",
      },
    },
    {
      heading: "Composición antes que herencia",
      subtopicId: "S11-T3-A",
      paragraphs: [
        "**has-a** (composición) suele modelar mejor casos: `CaseFile` tiene lista de `RelationshipEvidence` y una `ResolvedEntity`.",
        "Herencia solo si hay **subtipo real** (is-a). Evita jerarquías frágiles `Client(Person(BaseEntity...))` solo para reutilizar un campo.",
        "Mixins con cautela: complejidad invisible. Prefiere funciones o colaboración entre objetos.",
      ],
      code: {
        language: 'python',
        title: "composition.py",
        code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

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
        "`typing.Protocol` describe un **puerto** (EntityStore con get/save) sin forzar herencia. Duck typing estructural.",
        "Útil para fakes en tests y para no acoplar dominio a una DB. Evita ABC pesados si Protocol basta.",
        "No introduzcas Protocol 'por si acaso' con una sola implementación y sin tests — YAGNI.",
      ],
      code: {
        language: 'python',
        title: "protocol_store.py",
        code: `from typing import Protocol, runtime_checkable

@runtime_checkable
class EntityStore(Protocol):
    def get(self, entity_id: str) -> dict | None: ...
    def save(self, entity: dict) -> None: ...

class FakeStore:
    def __init__(self):
        self._d: dict[str, dict] = {}
    def get(self, entity_id: str):
        return self._d.get(entity_id)
    def save(self, entity: dict) -> None:
        self._d[entity["entity_id"]] = entity

store: EntityStore = FakeStore()
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
        "**Repository** light: get/save. **Service** light: orquesta dominio sin conocer CLI ni HTTP. `to_dict`/`from_dict` en el borde.",
        "Serializa sin password fields ni PII innecesaria. DTOs de borde no tienen que ser las entidades internas.",
        "CLI (S10) llama al service; el service no imprime ni parsea argparse.",
      ],
      code: {
        language: 'python',
        title: "repo_service.py",
        code: `from dataclasses import dataclass, asdict

@dataclass
class ClientRecord:
    client_id: str
    email: str

    def to_dict(self) -> dict:
        return {"client_id": self.client_id, "email": self.email}

class InMemoryClientRepository:
    def __init__(self):
        self._d: dict[str, ClientRecord] = {}
    def save(self, c: ClientRecord) -> None:
        self._d[c.client_id] = c
    def get(self, client_id: str) -> ClientRecord | None:
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
        "Tests del dominio son **puros**: sin red, sin DB real. Fakes del Protocol bastan.",
        "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`).",
        "Scores de resolución/relación son campos; un test puede verificar que existen como float y que no hay método de veredicto.",
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
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str

e1 = ResolvedEntity("E1", "Ana")
e1b = ResolvedEntity("E1", "Ana")
e2 = ResolvedEntity("E2", "Luis")
s = {e1, e1b, e2}
print("size", len(s))
print("e1==e1b", e1 == e1b)`,
          output: `size 2
e1==e1b True`,
        },
        why: "frozen permite usar entidades en sets sin sorpresas de mutación.",
      },
      {
        demoId: "S11-T3-A-DEMO",
        subtopicId: "S11-T3-A",
        environment: "local-python",
        description: "CaseFile compone list[RelationshipEvidence] + entidad resuelta.",
        code: {
          language: 'python',
          title: "casefile_compose.py",
          code: `from dataclasses import dataclass, field

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
print("scores", [e.signal_score for e in cf.evidences])`,
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
          "Completa la dataclass ClientRecord con client_id, full_name y phones: list[str].",
        hint: "Usa field(default_factory=list).",
        hints: [
          "Usa field(default_factory=list).",
          "Instancia y print.",
        ],
        edgeCases: ["default=[] sería mutable compartido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "complete_client.py",
          code: `from dataclasses import dataclass, field
# TODO`,
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
          "Define Transaction con tx_id, client_id, amount: float, currency: str obligatorios.",
        hint: "Sin defaults en campos obligatorios.",
        hints: [
          "Sin defaults en campos obligatorios.",
          "Crea una instancia sintética.",
        ],
        edgeCases: ["currency ISO como str en N1"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "transaction.py",
          code: `from dataclasses import dataclass
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "transaction.py",
          code: `from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: float
    currency: str

print(Transaction("T1", "C001", 150.5, "PEN"))`,
          output: `Transaction(tx_id='T1', client_id='C001', amount=150.5, currency='PEN')`,
        },
      },
      {
        id: "S11-T1-A-E3",
        subtopicId: "S11-T1-A",
        kind: "transfer",
        instruction:
          "Migra un dict anónimo a ClientRecord vía from_dict.",
        hint: "classmethod from_dict.",
        hints: [
          "classmethod from_dict.",
          "Imprime el tipo y el id.",
        ],
        edgeCases: ["KeyError si falta campo — aceptable o validar en T1-B"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "migrate_dict.py",
          code: `from dataclasses import dataclass

raw = {"client_id": "C007", "full_name": "Luis Ramos"}
# TODO`,
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
          "Añade invariante: amount de Transaction debe ser > 0.",
        hint: "__post_init__ raise ValueError.",
        hints: [
          "__post_init__ raise ValueError.",
          "Muestra ok y reject.",
        ],
        edgeCases: ["amount negativo también inválido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "tx_invariant.py",
          code: `from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    amount: float
    # TODO post_init`,
        },
        solutionCode: {
          language: 'python',
          title: "tx_invariant.py",
          code: `from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    amount: float

    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError("amount debe ser > 0")

print(Transaction("T1", 10))
try:
    Transaction("T2", 0)
except ValueError as e:
    print("reject", e)`,
          output: `Transaction(tx_id='T1', amount=10)
reject amount debe ser > 0`,
        },
      },
      {
        id: "S11-T1-B-E2",
        subtopicId: "S11-T1-B",
        kind: "independent",
        instruction:
          "Factory from_dict con validación de client_id y document_id no vacíos.",
        hint: "Raise ValueError con mensaje claro.",
        hints: [
          "Raise ValueError con mensaje claro.",
          "Prueba ok y fail.",
        ],
        edgeCases: ["strip evita espacios como id válido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "from_dict_validate.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        # TODO
        ...`,
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
          "Lista en español 4 invariantes del dominio e imprímelas.",
        hint: "ClientRecord, Transaction, Evidence, Entity.",
        hints: [
          "ClientRecord, Transaction, Evidence, Entity.",
          "Formato INV: ...",
        ],
        edgeCases: ["Invariantes de negocio ≠ veredictos de fraude"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "invariants_list.py",
          code: `# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "invariants_list.py",
          code: `for inv in [
    "INV: ClientRecord.document_id no vacío",
    "INV: Transaction.amount > 0 y currency no vacía",
    "INV: RelationshipEvidence.signal_score entre 0 y 1",
    "INV: ResolvedEntity.entity_id único y no vacío",
]:
    print(inv)`,
          output: `INV: ClientRecord.document_id no vacío
INV: Transaction.amount > 0 y currency no vacía
INV: RelationshipEvidence.signal_score entre 0 y 1
INV: ResolvedEntity.entity_id único y no vacío`,
        },
      },
      {
        id: "S11-T2-A-E1",
        subtopicId: "S11-T2-A",
        kind: "guided",
        instruction:
          "Property full_name desde first_name y last_name.",
        hint: "@property sin setter.",
        hints: [
          "@property sin setter.",
          "Print full_name.",
        ],
        edgeCases: ["No guardar full_name duplicado si se puede calcular"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "full_name_prop.py",
          code: `from dataclasses import dataclass

@dataclass
class Person:
    first_name: str
    last_name: str
    # TODO property`,
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
          "Método age_days_since(day: int) en Transaction con campo day_created: int (demo sin datetime).",
        hint: "Retorna day - day_created.",
        hints: [
          "Retorna day - day_created.",
          "Prueba con números sintéticos.",
        ],
        edgeCases: ["En prod usa date/datetime; aquí simplificamos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "age_days.py",
          code: `from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    day_created: int
    # TODO`,
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
          "Encapsula mutación de score con setter que solo acepta 0..1.",
        hint: "Property score con setter validado.",
        hints: [
          "Property score con setter validado.",
          "Muestra ok y reject.",
        ],
        edgeCases: ["score es señal, no veredicto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "score_setter.py",
          code: `class Signal:
    def __init__(self):
        self._score = 0.0
    # TODO property score`,
        },
        solutionCode: {
          language: 'python',
          title: "score_setter.py",
          code: `class Signal:
    def __init__(self):
        self._score = 0.0

    @property
    def score(self) -> float:
        return self._score

    @score.setter
    def score(self, value: float) -> None:
        v = float(value)
        if not 0.0 <= v <= 1.0:
            raise ValueError("score fuera de rango")
        self._score = v

s = Signal()
s.score = 0.4
print("ok", s.score)
try:
    s.score = 1.5
except ValueError as e:
    print("reject", e)`,
          output: `ok 0.4
reject score fuera de rango`,
        },
      },
      {
        id: "S11-T2-B-E1",
        subtopicId: "S11-T2-B",
        kind: "guided",
        instruction:
          "Implementa eq por business key document_id (dos clientes iguales si mismo doc).",
        hint: "__eq__ custom; no hace falta hash si no frozen.",
        hints: [
          "__eq__ custom; no hace falta hash si no frozen.",
          "Print comparaciones.",
        ],
        edgeCases: ["Si defines eq sin hash, la clase no es hasheable (OK)"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "eq_document.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    # TODO eq`,
        },
        solutionCode: {
          language: 'python',
          title: "eq_document.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    def __eq__(self, other):
        if not isinstance(other, ClientRecord):
            return NotImplemented
        return self.document_id == other.document_id

a = ClientRecord("C1", "DNI-9")
b = ClientRecord("C2", "DNI-9")
c = ClientRecord("C3", "DNI-1")
print(a == b, a == c)`,
          output: `True False`,
        },
      },
      {
        id: "S11-T2-B-E2",
        subtopicId: "S11-T2-B",
        kind: "independent",
        instruction:
          "Crea Evidence frozen value object y úsalo en un set.",
        hint: "frozen=True dataclass.",
        hints: [
          "frozen=True dataclass.",
          "Imprime len del set con duplicado.",
        ],
        edgeCases: ["Duplicado exacto colapsa en set"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "frozen_evidence.py",
          code: `from dataclasses import dataclass
# TODO`,
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
          "Demuestra el bug de entidad mutable como key de dict y la versión frozen segura.",
        hint: "Imprime BUG y SAFE.",
        hints: [
          "Imprime BUG y SAFE.",
          "Con mutable: cambiar campo rompe lookup.",
        ],
        edgeCases: ["No implementes __hash__ en mutables"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mutable_key_bug.py",
          code: `# TODO demo bug + safe`,
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
          "Reemplaza herencia innecesaria Client(Person) por composición Client tiene person_info dict/objeto.",
        hint: "Imprime el diseño final simple.",
        hints: [
          "Imprime el diseño final simple.",
          "Sin class Person base.",
        ],
        edgeCases: ["Composición permite cambiar PersonInfo sin romper Client"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "replace_inheritance.py",
          code: `# malo: class Client(Person): ...
# TODO composición`,
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
          "CaseFile agrega evidencias con add_evidence y cuenta.",
        hint: "Lista interna.",
        hints: [
          "Lista interna.",
          "Print n=2.",
        ],
        edgeCases: ["Validar score en el value object, no solo en CaseFile"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "casefile_add.py",
          code: `from dataclasses import dataclass, field

@dataclass
class CaseFile:
    case_id: str
    evidences: list = field(default_factory=list)
    # TODO add_evidence`,
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
          "Justifica en 2 líneas por qué no heredar Client de Person; imprime JUST: ...",
        hint: "Piensa en roles y evolución del modelo.",
        hints: [
          "Piensa en roles y evolución del modelo.",
          "Español profesional.",
        ],
        edgeCases: ["is-a real: SavingsAccount is-a Account tal vez; Client is-a Person rara vez aporta"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "why_not_inherit.py",
          code: `# TODO`,
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
          "Define Protocol Scorer con score(pair: tuple[str,str]) -> float y un FakeScorer.",
        hint: "Imprime el score de un par sintético.",
        hints: [
          "Imprime el score de un par sintético.",
          "typing.Protocol.",
        ],
        edgeCases: ["El Protocol no se instancia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "scorer_protocol.py",
          code: `from typing import Protocol
# TODO`,
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
          "Dos implementaciones de normalizer (strip vs casefold) usables por la misma función apply.",
        hint: "apply(norm, text) llama norm(text).",
        hints: [
          "apply(norm, text) llama norm(text).",
          "Imprime ambos resultados.",
        ],
        edgeCases: ["Duck typing: cualquier callable sirve"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "two_normalizers.py",
          code: `def apply(norm, text):
    return norm(text)

# TODO dos normalizers`,
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
          "Escribe 2 razones para NO introducir Protocol aún e imprime WHEN_NOT.",
        hint: "YAGNI / una sola implementación.",
        hints: [
          "YAGNI / una sola implementación.",
          "Español claro.",
        ],
        edgeCases: ["Cuando aparece el segundo adapter, el Protocol suele justificar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "when_not_protocol.py",
          code: `# TODO`,
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
          "to_dict de ClientRecord sin campos password/secret.",
        hint: "Aunque existan en el objeto, no serializarlos.",
        hints: [
          "Aunque existan en el objeto, no serializarlos.",
          "Print dict.",
        ],
        edgeCases: ["password no debería vivir en el dominio de familiaridad idealmente"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "to_dict_safe.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    email: str
    password: str = ""
    # TODO to_dict`,
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
          "Repository save/get con dict store en memoria.",
        hint: "Clase con save y get.",
        hints: [
          "Clase con save y get.",
          "Roundtrip de un client dict.",
        ],
        edgeCases: ["get retorna None si no existe"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "mem_repo.py",
          code: `class Repo:
    # TODO
    ...`,
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
          "Dibuja en texto la frontera dominio vs CLI I/O (3 capas).",
        hint: "cli → service → domain/repo.",
        hints: [
          "cli → service → domain/repo.",
          "Imprime LAYER líneas.",
        ],
        edgeCases: ["Logging puede colgarse del service con correlation_id"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "boundary_layers.py",
          code: `# TODO`,
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
          "Test de invariante ClientRecord: document_id vacío lanza ValueError; imprime pass.",
        hint: "Usa assert en un try o pytest-style manual.",
        hints: [
          "Usa assert en un try o pytest-style manual.",
          "print('pass') al final.",
        ],
        edgeCases: ["Tests puros: sin I/O"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
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

# TODO test`,
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
          "Fake repo en 3 tests de servicio (register, get, missing).",
        hint: "Imprime pass x3.",
        hints: [
          "Imprime pass x3.",
          "Service simple con repo inyectado.",
        ],
        edgeCases: ["Fake no es mock mágico: es implementación en memoria"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
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

# TODO 3 tests`,
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
          "Revisa una clase con decide_fraud y propón extracción: imprime ANTES/DESPUÉS conceptual.",
        hint: "Mueve el score a Evidence; elimina el veredicto.",
        hints: [
          "Mueve el score a Evidence; elimina el veredicto.",
          "Dos líneas.",
        ],
        edgeCases: ["Umbrales de producto no son invariantes de entidad"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "extract_fraud.py",
          code: `class BadClient:
    def decide_fraud(self, score):
        return score > 0.9
# TODO propuesta`,
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
    display_name: str

@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: float
    currency: str

    def __post_init__(self) -> None:
        if self.amount <= 0:
            raise ValueError("amount debe ser > 0")

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

    def __post_init__(self) -> None:
        if not 0.0 <= self.signal_score <= 1.0:
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
        options: [
          "Es más corto",
          "Evita el default mutable compartido entre instancias",
          "Obliga a usar Protocol",
          "Activa el garbage collector",
        ],
        correctIndex: 1,
        explanation:
          "Un [] compartido muta todas las instancias.",
      },
      {
        question: "RelationshipEvidence.signal_score representa…",
        options: [
          "Veredicto legal de parentesco",
          "Una señal/dato numérico, no un veredicto de fraude o familia",
          "Password hasheado",
          "Exit code del CLI",
        ],
        correctIndex: 1,
        explanation:
          "El dominio almacena evidencia; no decide fraude/parentesco.",
      },
      {
        question: "Un Protocol EntityStore sirve para…",
        options: [
          "Conectarse solo a Postgres",
          "Definir un puerto get/save implementable por fakes y adapters",
          "Reemplazar dataclass",
          "Serializar a PDF",
        ],
        correctIndex: 1,
        explanation:
          "Puertos estructurales sin herencia forzada.",
      },
      {
        question: "Objeto inválido: ¿cuándo fallar?",
        options: [
          "Al final del mes",
          "En la construcción (__post_init__/validate)",
          "Nunca",
          "Solo en producción",
        ],
        correctIndex: 1,
        explanation:
          "Fail on invalid construct evita estados corruptos.",
      },
      {
        question: "Client hereda de Person…",
        options: [
          "Siempre es la mejor opción",
          "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar",
          "Es obligatoria en Python",
          "Impide tests",
        ],
        correctIndex: 1,
        explanation:
          "has-a > is-a forzado sin subtipo real.",
      },
      {
        question: "¿Qué no debe tener el dominio de familiaridad?",
        options: [
          "to_dict",
          "is_fraud() automático",
          "Invariantes",
          "Tests unitarios",
        ],
        correctIndex: 1,
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
        note: "frozen, field, post_init",
      },
      {
        label: "typing.Protocol",
        url: "https://docs.python.org/3/library/typing.html#typing.Protocol",
        note: "puertos estructurales",
      },
      {
        label: "unittest — Unit testing framework",
        url: "https://docs.python.org/3/library/unittest.html",
        note: "alternativa stdlib a pytest para dominio puro",
      },
    ],
    books: [
      {
        label: "Architecture Patterns with Python (Percival & Gregory)",
        note: "Repo/service/protocol — leer selectivamente.",
      },
      {
        label: "Fluent Python — object model",
        note: "eq/hash y data model.",
      },
    ],
    courses: [
      {
        label: "pytest docs (soporte de calidad)",
        url: "https://docs.pytest.org/",
        note: "Testing se reubica como soporte; el target V3 de S11 es el dominio.",
      },
    ],
  },
}
