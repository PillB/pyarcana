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
    "Un modelo de dominio claro es la base de productos de matching y familiaridad sin inventar veredictos legales. Aquí construyes el núcleo OOP de **CP-N1-C**: tipos con invariantes, composición y puertos testeables en Python local — listos para el dashboard de evidencia en S13.",
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
      heading: "De dicts anónimos a un modelo de dominio (mapa)",
      paragraphs: [
        "Tras el paquete y la CLI de S10, el código deja de ser **dicts anónimos** y pasa a un **núcleo de dominio** con nombre: `ClientRecord`, `ResolvedEntity`, `Transaction` y `RelationshipEvidence`. Cada tipo nombra un concepto de matching local y admite invariantes y tests puros. La CLI solo invoca servicios; las reglas de negocio viven en los objetos.",
        "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Si un campo obligatorio falta o viola un invariante, **falla al construir** — no rellenes en silencio. Stack: `dataclass`, properties, composition y `Protocol`; sin frameworks web ni ORMs (llegan más adelante).",
        "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests). Caso sintético PE: ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `Decimal` en PEN/USD. Gate CP-N1-C: cuatro tipos + tests puros + README de límites éticos. Nunca PII real ni APIs `is_fraud`/`is_family`.",
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
        "Forma canónica en S11: `ClientRecord(client_id, document_id, full_name, emails)`. Campos con **type hints** y `default_factory` para mutables evitan el clásico bug del default compartido. Prefiere `list[str] = field(default_factory=list)` a `emails=[]`. Fail-closed: no construyas con `None` silencioso donde el schema exige string no vacío.",
        "Migrar dicts anónimos a tipos nombra el dominio y habilita invariantes en T1-B (`from_dict` → dataclass). Caso sintético: `ClientRecord(\"C001\", \"DNI-1\", \"Ana Pérez\", [\"ana@ejemplo.pe\"])`. Documenta qué campos son PII-sintética de demo y cuáles son ids estables de sistema."
      ],
      code: {
        language: 'python',
        title: "client_dataclass.py",
        code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

c = ClientRecord("C001", "DNI-1", "Ana Pérez", ["ana@ejemplo.pe"])
print(c)
print(type(c).__name__, c.client_id)`,
        output: `ClientRecord(client_id='C001', document_id='DNI-1', full_name='Ana Pérez', emails=['ana@ejemplo.pe'])
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
        "Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización. **Sin side-effects de negocio** al validar: no llames APIs, no escribas a disco, no “fixes” silenciosos de moneda. Stack: stdlib + `Decimal`; no ORM.",
        "Ejemplo: `document_id` no vacío; en `Transaction`, `amount` es `Decimal` **positivo** y `currency` ∈ allowlist `{'PEN','USD'}`. Nunca conviertas PEN→USD en el constructor. Caso sintético PE: `Transaction(\"T1\", \"C001\", Decimal(\"150.50\"), \"PEN\")` acepta; `\"EUR\"` o `amount<=0` rechaza."
      ],
      code: {
        language: 'python',
        title: "invariants.py",
        code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def validate(self) -> None:
        if not self.client_id.strip():
            raise ValueError("client_id vacío")
        if not self.document_id.strip():
            raise ValueError("document_id vacío")

    def __post_init__(self) -> None:
        self.validate()

print(ClientRecord("C001", "DNI-1", "Ana Pérez", ["ana@ejemplo.pe"]))
try:
    ClientRecord("C002", "  ", "X")
except ValueError as e:
    print("reject", e)`,
        output: `ClientRecord(client_id='C001', document_id='DNI-1', full_name='Ana Pérez', emails=['ana@ejemplo.pe'])
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
        "`@property` expone campos calculados (`display_name`, `masked_email`) **sin** mutación peligrosa desde afuera. La UI, los logs y el dashboard de evidencia deben preferir la máscara; el email raw queda en el campo interno solo para el borde autorizado (export legal, backoffice).",
        "Métodos de instancia encapsulan consultas puras (`age_days_since(as_of)`). Evita side-effects en properties: no envían mail, no escriben disco, no llaman red. Fail-closed o sentinel documentado si `emails` está vacío o el primer email no tiene `@` al calcular `masked_email` — nunca un `IndexError` en un pipeline de matching.",
        "Setters validados solo cuando la mutación es parte del modelo de negocio (p. ej. un score 0..1); si no, prefiere **`frozen`** o devolver una **nueva instancia**. Caso sintético PE: `ClientRecord(\"C003\", \"DNI-3\", \"Lucía Méndez\", [\"lucia@ejemplo.pe\"])` imprime display_name y email enmascarado sin PII completa en stdout."
      ],
      code: {
        language: 'python',
        title: "properties.py",
        code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    @property
    def display_name(self) -> str:
        return self.full_name

    @property
    def masked_email(self) -> str:
        if not self.emails:
            return "(sin email)"
        local, _, domain = self.emails[0].partition("@")
        if not domain:
            return "(email inválido)"
        return f"{local[:1]}***@{domain}"

c = ClientRecord("C001", "DNI-1", "Ana Pérez", ["ana@ejemplo.pe"])
print(c.display_name, c.masked_email)
print(ClientRecord("C002", "DNI-2", "Sin mail").masked_email)`,
        output: `Ana Pérez a***@ejemplo.pe
(sin email)`,
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
b = ResolvedEntity("E1", "Ana Pérez")
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
class ResolvedEntity:
    entity_id: str

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
    entity: ResolvedEntity
    evidences: list[RelationshipEvidence] = field(default_factory=list)

    def add(self, ev: RelationshipEvidence) -> None:
        self.evidences.append(ev)

cf = CaseFile(entity=ResolvedEntity("E1"))
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
        "Serializa sin secretos ni PII innecesaria en logs. Notas internas de backoffice (`internal_note`) no van al export de dashboard. DTOs de borde no tienen que ser idénticos a las entidades internas. Fail-closed si falta `client_id` en `from_dict`. **No almacenes contraseñas en el agregado de familiaridad.**",
        "La CLI de S10 llama al service; el service **no** imprime ni parsea argparse. Caso sintético: `ClientService(InMemoryClientRepository()).register(\"C001\", \"DNI-1\", \"Ana Pérez\", \"a@ejemplo.pe\")` → dict de borde sin decidir fraude."
      ],
      code: {
        language: 'python',
        title: "repo_service.py",
        code: `from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Optional

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "client_id": self.client_id,
            "document_id": self.document_id,
            "full_name": self.full_name,
            "emails": list(self.emails),
        }

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
    def register(self, client_id: str, document_id: str, full_name: str, email: str) -> dict:
        c = ClientRecord(client_id, document_id, full_name, [email])
        self.repo.save(c)
        return c.to_dict()  # no decide fraude

svc = ClientService(InMemoryClientRepository())
print(svc.register("C001", "DNI-1", "Ana Pérez", "a@ejemplo.pe"))`,
        output: `{'client_id': 'C001', 'document_id': 'DNI-1', 'full_name': 'Ana Pérez', 'emails': ['a@ejemplo.pe']}`,
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
        "Tests del dominio son **puros**: sin red, sin DB real, sin reloj de red. Fakes del `Protocol` bastan para ejercitar repos y servicios. Eso permite CI rápida, demos offline del gate **CP-N1-C** y feedback inmediato en local-python.",
        "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`). Un test de “no existe el método” documenta la ética del producto en código — no es adorno: protege el límite legal del matching. Fail-closed: score fuera de [0,1] no se “clamp” en silencio en el constructor.",
        "Scores de resolución/relación son **campos**; un test verifica finitud, rango, par canónico y que no hay veredictos. Caso sintético: `test_no_fraud_api()` pasa si `RelationshipEvidence` solo expone ids + score. Nunca PII real en fixtures (`@ejemplo.pe`, ids `C00x`/`E0x`)."
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
        description: "ClientRecord dataclass desde dict sintético (forma canónica).",
        code: {
          language: 'python',
          title: "client_from_dict.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        return cls(
            d["client_id"],
            d["document_id"],
            d["full_name"],
            list(d.get("emails", [])),
        )

raw = {
    "client_id": "C001",
    "document_id": "DNI-1",
    "full_name": "Ana Pérez",
    "emails": ["ana@ejemplo.pe"],
}
c = ClientRecord.from_dict(raw)
print(c)`,
          output: `ClientRecord(client_id='C001', document_id='DNI-1', full_name='Ana Pérez', emails=['ana@ejemplo.pe'])`,
        },
        why: "from_dict nombra el borde dict→dominio con la forma canónica de ClientRecord; el CLI/JSON ya no inventa campos sueltos.",
      },
      {
        demoId: "S11-T1-B-DEMO",
        subtopicId: "S11-T1-B",
        environment: "local-python",
        description: "ClientRecord canónico con validate() + __post_init__; rechaza document_id vacío.",
        code: {
          language: 'python',
          title: "reject_empty_doc.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def validate(self) -> None:
        if not str(self.document_id).strip():
            raise ValueError("document_id vacío")

    def __post_init__(self) -> None:
        self.validate()

print(ClientRecord("C001", "DNI-100", "Ana Pérez", ["ana@ejemplo.pe"]))
try:
    ClientRecord("C002", "", "X")
except ValueError as e:
    print("rejected", e)`,
          output: `ClientRecord(client_id='C001', document_id='DNI-100', full_name='Ana Pérez', emails=['ana@ejemplo.pe'])
rejected document_id vacío`,
        },
        why: "validate() reutilizable + fail-on-construct sobre la forma canónica: no hay instancia inválida.",
      },
      {
        demoId: "S11-T2-A-DEMO",
        subtopicId: "S11-T2-A",
        environment: "local-python",
        description: "display_name y masked_email como properties sobre ClientRecord canónico.",
        code: {
          language: 'python',
          title: "display_props.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    @property
    def display_name(self) -> str:
        return self.full_name

    @property
    def masked_email(self) -> str:
        if not self.emails:
            return "(sin email)"
        local, _, domain = self.emails[0].partition("@")
        if not domain:
            return "(email inválido)"
        return f"{local[:1]}***@{domain}"

c = ClientRecord("C003", "DNI-3", "Lucía Méndez", ["lucia@ejemplo.pe"])
print(c.display_name)
print(c.masked_email)`,
          output: `Lucía Méndez
l***@ejemplo.pe`,
        },
        why: "La superficie pública no necesita el email completo para mostrar; emails vacío devuelve sentinel, no IndexError.",
      },
      {
        demoId: "S11-T2-B-DEMO",
        subtopicId: "S11-T2-B",
        environment: "local-python",
        description: "ResolvedEntity frozen por entity_id; set de entidades; id vacío rechazado.",
        code: {
          language: 'python',
          title: "frozen_set.py",
          code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str = field(compare=False)

    def __post_init__(self) -> None:
        if not self.entity_id.strip():
            raise ValueError("entity_id vacío")

e1 = ResolvedEntity("E1", "Ana")
e1b = ResolvedEntity("E1", "Ana actualizada")
e2 = ResolvedEntity("E2", "Luis")
s = {e1, e1b, e2}
print("size", len(s))
print("e1==e1b", e1 == e1b)
try:
    ResolvedEntity("  ", "sin id")
except ValueError as e:
    print("reject", e)`,
          output: `size 2
e1==e1b True
reject entity_id vacío`,
        },
        why: "frozen + compare=False mantiene identidad por entity_id; fail-closed si el id está vacío.",
      },
      {
        demoId: "S11-T3-A-DEMO",
        subtopicId: "S11-T3-A",
        environment: "local-python",
        description: "CaseFile compone ResolvedEntity + RelationshipEvidence validada (par canónico y score).",
        code: {
          language: 'python',
          title: "casefile_compose.py",
          code: `from dataclasses import dataclass, field
from math import isfinite

@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float

    def __post_init__(self) -> None:
        if not self.left_id < self.right_id:
            raise ValueError("par no canónico")
        if not isfinite(self.signal_score) or not 0.0 <= self.signal_score <= 1.0:
            raise ValueError("signal_score fuera de rango")

@dataclass
class CaseFile:
    entity: ResolvedEntity
    evidences: list[RelationshipEvidence] = field(default_factory=list)

    def add(self, ev: RelationshipEvidence) -> None:
        self.evidences.append(ev)

cf = CaseFile(ResolvedEntity("E1"))
cf.add(RelationshipEvidence("E1", "E2", 0.31))
cf.add(RelationshipEvidence("E1", "E3", 0.12))
print(cf.entity.entity_id, "n_ev", len(cf.evidences))
print("scores", [e.signal_score for e in cf.evidences])`,
          output: `E1 n_ev 2
scores [0.31, 0.12]`,
        },
        why: "Composición con invariantes reales: add solo acepta evidencias ya validadas al construir.",
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
        why: "El service depende del Protocol (puerto), no de una clase base pesada — el adapter SQL llega en S12 sin reescribir reglas.",
      },
      {
        demoId: "S11-T4-A-DEMO",
        subtopicId: "S11-T4-A",
        environment: "local-python",
        description: "InMemoryClientRepository + service que no decide fraude.",
        code: {
          language: 'python',
          title: "client_service.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def to_dict(self):
        return {
            "client_id": self.client_id,
            "document_id": self.document_id,
            "full_name": self.full_name,
            "emails": list(self.emails),
        }

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
    def register(self, client_id, document_id, full_name, email):
        c = ClientRecord(client_id, document_id, full_name, [email])
        self.repo.save(c)
        # deliberadamente no hay is_fraud
        return c.to_dict()

print(ClientService(InMemoryClientRepository()).register(
    "C001", "DNI-1", "Ana Pérez", "a@ejemplo.pe"
))
print("has_is_fraud", hasattr(ClientService, "is_fraud"))`,
          output: `{'client_id': 'C001', 'document_id': 'DNI-1', 'full_name': 'Ana Pérez', 'emails': ['a@ejemplo.pe']}
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
        why: "La suite protege el límite ético del modelo: scores son datos; no hay is_fraud ni is_related_family.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Cada starter trae un defecto deliberado (default mutable, float money, herencia forzada, etc.). Tests del dominio; sin red/DB. Datos sintéticos PE.",
    steps: [
      {
        id: "S11-T1-A-E1",
        subtopicId: "S11-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Completa la dataclass `ClientRecord` con `client_id`, `document_id`, `full_name` y `emails: list[str]` usando `field(default_factory=list)`. Instancia con emails de demo y muestra el repr. Conserva asserts del starter; solo stdlib.",
        hint: "Usa field(default_factory=list) para emails.",
        hints: [
          "Usa field(default_factory=list) para emails.",
          "Instancia con C001, DNI-1, Ana Pérez y un email @ejemplo.pe.",
        ],
        edgeCases: ["default=[] sería mutable compartido"],
        tests: "Salida: un repr `ClientRecord(...)` con emails=['ana@ejemplo.pe']; no uses emails=[].",
        feedback: "Si dos instancias comparten la misma lista de emails, el default era mutable: usa default_factory.",
        starterCode: {
          language: 'python',
          title: "complete_client.py",
          code: `# CASO-LIM-011 · ClientRecord dataclass
# DEFECT: sin fields; default mutable list
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list = []

print(ClientRecord("C001", "DNI-1", "Ana Pérez"))
`,
        },
        solutionCode: {
          language: 'python',
          title: "complete_client.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

print(ClientRecord("C001", "DNI-1", "Ana Pérez", ["ana@ejemplo.pe"]))`,
          output: `ClientRecord(client_id='C001', document_id='DNI-1', full_name='Ana Pérez', emails=['ana@ejemplo.pe'])`,
        },
      },
      {
        id: "S11-T1-A-E2",
        subtopicId: "S11-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Define `Transaction` con `tx_id`, `client_id`, `amount: Decimal` y `currency: str` obligatorios. Usa `Decimal` desde texto y `PEN` en el caso visible. Salida esperada: repr con `amount=Decimal('150.50')` y `currency='PEN'`. Conserva asserts y datos del starter; solo stdlib (sin web/ORM).",
        hint: "Importa Decimal; sin defaults en campos obligatorios.",
        hints: [
          "Importa Decimal; sin defaults en campos obligatorios.",
          "Crea Decimal('150.50'); nunca lo construyas desde float.",
        ],
        edgeCases: ["currency PEN", "dos decimales", "sin float"],
        tests: "Contrato exacto: repr con amount=Decimal('150.50') y currency='PEN'; el código no llama float().",
        feedback: "Money en dominio usa Decimal desde texto; float(150.50) introduce ruido binario.",
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
`,
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
          "E3 (transferencia) — Migra un dict anónimo a `ClientRecord` vía `@classmethod from_dict` con la forma canónica: `client_id`, `document_id`, `full_name`, `emails` (lista). Salida/pass: `ClientRecord C007`. Solo stdlib.",
        hint: "classmethod from_dict que devuelve cls(...); emails con list(d.get('emails', [])).",
        hints: [
          "classmethod from_dict que devuelve cls(...); emails con list(d.get('emails', [])).",
          "Imprime el tipo y el client_id.",
        ],
        edgeCases: ["KeyError si falta campo — aceptable o validar en T1-B"],
        tests: "Una línea: `ClientRecord C007`. from_dict es @classmethod y devuelve instancia, no el dict crudo.",
        feedback: "from_dict en la clase (no en la instancia) es el borde dict→dominio que reutilizas en el repo.",
        starterCode: {
          language: 'python',
          title: "migrate_dict.py",
          code: `# CASO-LIM-011 · from_dict factory
# DEFECT: no classmethod; construye mal
from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def from_dict(self, d: dict):
        return d

raw = {
    "client_id": "C007",
    "document_id": "DNI-7",
    "full_name": "Luis Ramos",
    "emails": ["luis@ejemplo.pe"],
}
c = ClientRecord.from_dict(ClientRecord("x", "y", "z"), raw)
print(type(c).__name__, getattr(c, "client_id", c))
`,
        },
        solutionCode: {
          language: 'python',
          title: "migrate_dict.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict) -> "ClientRecord":
        return cls(
            d["client_id"],
            d["document_id"],
            d["full_name"],
            list(d.get("emails", [])),
        )

raw = {
    "client_id": "C007",
    "document_id": "DNI-7",
    "full_name": "Luis Ramos",
    "emails": ["luis@ejemplo.pe"],
}
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
          "E1 (guiado) — Añade invariantes a `Transaction`: `amount` es `Decimal` > 0, cuantizado a 0.01, y `currency` ∈ {'PEN', 'USD'} sin conversión silenciosa. Muestra ok PEN y rechazos por cero y EUR. Solo clases/dataclass; sin web ni ORM.",
        hint: "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
        hints: [
          "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
          "Muestra ok PEN y rechazos por cero y EUR.",
        ],
        edgeCases: ["amount negativo", "float prohibido", "currency minúscula", "EUR fuera del allowlist"],
        tests: "Tres líneas: repr PEN válido; `reject amount debe ser > 0`; `reject currency no soportada`.",
        feedback: "Fail-closed: cero y EUR mueren al construir; no hay conversión silenciosa de moneda.",
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
`,
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
          "E2 (independiente) — Factory `from_dict` sobre forma **reducida** de `ClientRecord` (solo `client_id` + `document_id` para enfocar invariantes). Valida ambos no vacíos tras strip. Muestra ok y el rechazo. Solo stdlib.",
        hint: "Raise ValueError con mensaje claro tras strip.",
        hints: [
          "Raise ValueError con mensaje claro tras strip.",
          "Prueba ok y fail con document_id de solo espacios.",
        ],
        edgeCases: ["strip evita espacios como id válido"],
        tests: "Dos líneas: ClientRecord(C1, D1) válido; luego `document_id vacío` para el caso de solo espacios.",
        feedback: "strip() evita que un espacio pase como document_id “válido”.",
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
`,
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
          "E3 (transferencia) — En forma reducida (`client_id` + `document_id`), implementa `validate()` que devuelve lista de errores (strings); `[]` si ok. Cubre ambos ids no vacíos. Imprime errores del inválido y `[]` del válido. Solo stdlib.",
        hint: "No lances excepción: acumula mensajes en una list.",
        hints: [
          "No lances excepción: acumula mensajes en una list.",
          "strip() antes de comprobar vacío.",
        ],
        edgeCases: ["Invariantes de negocio ≠ veredictos de fraude"],
        tests: "Dos líneas: lista con errores de ambos ids vacíos; luego `[]` para el registro válido.",
        feedback: "validate() que devuelve lista es reutilizable en UI/API; __post_init__ puede lanzar si prefieres fail-closed.",
        starterCode: {
          language: 'python',
          title: "validate_method.py",
          code: `# CASO-LIM-011 · validate() reutilizable
# DEFECT: validate siempre devuelve []
from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    def validate(self) -> list[str]:
        return []

bad = ClientRecord("", "  ")
good = ClientRecord("C1", "D1")
print(bad.validate())
print(good.validate())
`,
        },
        solutionCode: {
          language: 'python',
          title: "validate_method.py",
          code: `from dataclasses import dataclass

@dataclass
class ClientRecord:
    client_id: str
    document_id: str

    def validate(self) -> list[str]:
        errs: list[str] = []
        if not self.client_id.strip():
            errs.append("client_id vacío")
        if not self.document_id.strip():
            errs.append("document_id vacío")
        return errs

bad = ClientRecord("", "  ")
good = ClientRecord("C1", "D1")
print(bad.validate())
print(good.validate())`,
          output: `['client_id vacío', 'document_id vacío']
[]`,
        },
      },
      {
        id: "S11-T2-A-E1",
        subtopicId: "S11-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Value object **aparte** de `ClientRecord`: `PersonName` con `first_name`/`last_name` y property `full_name` (nombre + apellido). No es un schema alterno del cliente; solo entrena `@property`. Salida/pass: `Ana Pérez`. Solo stdlib.",
        hint: "@property sin setter.",
        hints: [
          "@property sin setter.",
          "Print full_name (no full_name()).",
        ],
        edgeCases: ["No guardar full_name duplicado si se puede calcular"],
        tests: "Una línea: `Ana Pérez`. Debe ser @property (acceso sin paréntesis), orden nombre+apellido.",
        feedback: "Property calcula; no dupliques full_name como campo almacenado.",
        starterCode: {
          language: 'python',
          title: "full_name_prop.py",
          code: `# CASO-LIM-011 · full_name property
# DEFECT: método no property; orden apellido primero
from dataclasses import dataclass

@dataclass
class PersonName:
    first_name: str
    last_name: str

    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name}"

print(PersonName("Ana", "Pérez").full_name())
`,
        },
        solutionCode: {
          language: 'python',
          title: "full_name_prop.py",
          code: `from dataclasses import dataclass

@dataclass
class PersonName:
    first_name: str
    last_name: str

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

print(PersonName("Ana", "Pérez").full_name)`,
          output: `Ana Pérez`,
        },
      },
      {
        id: "S11-T2-A-E2",
        subtopicId: "S11-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — En `Transaction` con `day_created: int` (demo sin datetime), implementa `age_days_since(day: int)` como consulta pura: `day - day_created`. Caso sintético T1 creado día 10, consulta día 25. Salida/pass: `15`. Solo stdlib.",
        hint: "Retorna day - day_created.",
        hints: [
          "Retorna day - day_created.",
          "Prueba con números sintéticos.",
        ],
        edgeCases: ["En prod usa date/datetime; aquí simplificamos"],
        tests: "Una línea: `15`. Consulta pura: day - day_created (no inviertas el orden).",
        feedback: "Métodos de consulta no mutan ni llaman red; solo calculan.",
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
`,
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
          "E3 (transferencia) — Encapsula un `score` 0..1 con `@property` + setter: rechaza valores fuera de rango y no finitos (`nan`/`inf`) con `ValueError('score fuera de rango')`. Muestra ok=0.4 y rechazos. Solo stdlib.",
        hint: "Property score + math.isfinite antes del rango.",
        hints: [
          "Property score + math.isfinite antes del rango.",
          "Muestra ok y rechaza 1.5 y NaN.",
        ],
        edgeCases: ["NaN", "Infinity", "score es señal, no veredicto"],
        tests: "Tres líneas: `ok 0.4`; `reject score fuera de rango`; `reject_nan score fuera de rango`.",
        feedback: "NaN e inf no son scores válidos: isfinite + rango [0,1] antes de guardar.",
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
`,
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
          "E1 (guiado) — Implementa `ResolvedEntity` frozen con igualdad/hash solo por `entity_id`; `display_name` con `field(compare=False)`. Muestra igualdad E1 y tamaño del set. Sin frameworks web ni ORMs; conserva el contrato del starter.",
        hint: "dataclass(frozen=True) + field(compare=False) en display_name.",
        hints: [
          "dataclass(frozen=True) + field(compare=False) en display_name.",
          "Dos E1 con nombres distintos son iguales; E2 no lo es.",
        ],
        edgeCases: ["entity_id vacío se rechaza en demos de teoría/I Do", "document_id nunca participa en identidad"],
        tests: "Dos líneas: `True False` (E1==E1 y E1!=E2) y `2` (tamaño del set con dos E1 + un E2).",
        feedback: "La identidad estable es entity_id; etiquetas visibles pueden corregirse sin romper el set.",
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
`,
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
          "E2 (independiente) — Crea `Evidence` frozen (`left_id`, `right_id`, `signal_score`) y úsalo en un set: el duplicado exacto colapsa. Salida/pass: `2` (dos pares distintos). Solo stdlib.",
        hint: "frozen=True dataclass.",
        hints: [
          "frozen=True dataclass.",
          "Imprime len del set con duplicado.",
        ],
        edgeCases: ["Duplicado exacto colapsa en set"],
        tests: "Una línea: `2`. Sin frozen, el set no colapsa duplicados de valor.",
        feedback: "frozen + eq por campos habilita sets de evidencias sin keys inestables.",
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
`,
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
          "E3 (transferencia) — Demuestra el bug de entidad mutable como key de dict y la versión frozen segura. Imprime `BUG lookup_after_mutate …` y `SAFE …`. Solo stdlib.",
        hint: "Imprime BUG y SAFE.",
        hints: [
          "Imprime BUG y SAFE.",
          "Con mutable: cambiar campo rompe lookup.",
        ],
        edgeCases: ["No implementes __hash__ en mutables"],
        tests: "Dos líneas: `BUG lookup_after_mutate None` y `SAFE row`.",
        feedback: "Mutar un campo que entra en hash rompe el dict; frozen evita ese anti-patrón.",
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
`,
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
          "E1 (guiado) — Reemplaza herencia innecesaria `Client(PersonInfo)` por composición: `Client` tiene un `person: PersonInfo`. Salida/pass: dos líneas — `C001 Ana` y `design=composition`. Solo stdlib.",
        hint: "Client(client_id, person) sin heredar de PersonInfo.",
        hints: [
          "Client(client_id, person) sin heredar de PersonInfo.",
          "Imprime client_id y person.first_name; luego design=composition.",
        ],
        edgeCases: ["Composición permite cambiar PersonInfo sin romper Client"],
        tests: "Dos líneas exactas: `C001 Ana` y `design=composition` (no uses design=inheritance).",
        feedback: "has-a (Client tiene PersonInfo) suele bastar; is-a forzado acopla jerarquías sin subtipo real.",
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

c = Client("Ana", "Pérez", "C001")
print(c.client_id, c.first_name)
print("design=inheritance")
`,
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

c = Client("C001", PersonInfo("Ana", "Pérez"))
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
          "E2 (independiente) — `CaseFile` con `evidences: list` vía `field(default_factory=list)` y método `add_evidence`. Tras dos altas en CF1, CF2 nuevo debe quedar vacío (sin lista compartida). Imprime `n= 2 empty 0`. Solo stdlib.",
        hint: "Lista interna con default_factory, no = [].",
        hints: [
          "Lista interna con default_factory, no = [].",
          "Tras dos add en CF1, crea CF2 y muestra len(cf)=2 y len(cf2)=0.",
        ],
        edgeCases: ["Validar score en el value object, no solo en CaseFile", "default=[] comparte la misma lista entre instancias"],
        tests: "Contrato exacto: una línea `n= 2 empty 0` (CF1 con dos evidencias; CF2 sin contaminar).",
        feedback: "Si CF2 no arranca en 0, el default mutable compartió la lista entre expedientes — usa default_factory.",
        starterCode: {
          language: 'python',
          title: "casefile_add.py",
          code: `# CASO-LIM-011 · CaseFile evidences
# DEFECT: default mutable list (CF2 hereda evidencias de CF1)
from dataclasses import dataclass

@dataclass
class CaseFile:
    case_id: str
    evidences: list = []

    def add_evidence(self, ev: dict) -> None:
        self.evidences.append(ev)

cf = CaseFile("CF1")
cf.add_evidence({"score": 0.1})
cf.add_evidence({"score": 0.2})
cf2 = CaseFile("CF2")
print("n=", len(cf.evidences), "empty", len(cf2.evidences))
`,
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
cf2 = CaseFile("CF2")
print("n=", len(cf.evidences), "empty", len(cf2.evidences))`,
          output: `n= 2 empty 0`,
        },
      },
      {
        id: "S11-T3-A-E3",
        subtopicId: "S11-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Implementa `RelationshipEvidence` frozen con par canónico (`left_id < right_id`) y `signal_score` finito en [0, 1]. Añade dos evidencias válidas a un `CaseFile` y muestra `n_ev` y el rechazo de un par no canónico. Solo stdlib.",
        hint: "__post_init__ con isfinite y comparación lexicográfica de ids.",
        hints: [
          "__post_init__ con isfinite y comparación lexicográfica de ids.",
          "CaseFile.add recibe RelationshipEvidence ya validada.",
        ],
        edgeCases: ["(E2,E1) no es canónico si E1 < E2"],
        tests: "Dos líneas: `n_ev 2` y `reject par no canónico` (E2,E1 debe fallar al construir).",
        feedback: "El par canónico evita duplicar (E1,E2) y (E2,E1) como relaciones distintas.",
        starterCode: {
          language: 'python',
          title: "canonical_evidence.py",
          code: `# CASO-LIM-011 · par canónico + score
# DEFECT: no valida par ni rango
from dataclasses import dataclass, field
from math import isfinite

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float

@dataclass
class CaseFile:
    case_id: str
    evidences: list = field(default_factory=list)

    def add(self, ev: RelationshipEvidence) -> None:
        self.evidences.append(ev)

cf = CaseFile("CF1")
cf.add(RelationshipEvidence("E1", "E2", 0.4))
cf.add(RelationshipEvidence("E2", "E1", 0.5))  # no canónico, debería fallar
print("n_ev", len(cf.evidences))
`,
        },
        solutionCode: {
          language: 'python',
          title: "canonical_evidence.py",
          code: `from dataclasses import dataclass, field
from math import isfinite

@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float

    def __post_init__(self) -> None:
        if not self.left_id < self.right_id:
            raise ValueError("par no canónico")
        if not isfinite(self.signal_score) or not 0.0 <= self.signal_score <= 1.0:
            raise ValueError("signal_score fuera de rango")

@dataclass
class CaseFile:
    case_id: str
    evidences: list = field(default_factory=list)

    def add(self, ev: RelationshipEvidence) -> None:
        self.evidences.append(ev)

cf = CaseFile("CF1")
cf.add(RelationshipEvidence("E1", "E2", 0.4))
cf.add(RelationshipEvidence("E1", "E3", 0.2))
print("n_ev", len(cf.evidences))
try:
    RelationshipEvidence("E2", "E1", 0.5)
except ValueError as e:
    print("reject", e)`,
          output: `n_ev 2
reject par no canónico`,
        },
      },
      {
        id: "S11-T3-B-E1",
        subtopicId: "S11-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Define `Protocol Scorer` con `score(pair: tuple[str, str]) -> float` y un `FakeScorer` que implemente **ese** nombre de método (no `compute`). Puntúa el par sintético `(\"E1\", \"E2\")`. Salida/pass: `0.5`. Solo stdlib.",
        hint: "Imprime el score de un par sintético.",
        hints: [
          "Imprime el score de un par sintético.",
          "typing.Protocol; el método debe llamarse score.",
        ],
        edgeCases: ["El Protocol no se instancia"],
        tests: "Una línea: `0.5`. El método del fake se llama `score`, no `compute`.",
        feedback: "El nombre del método es el contrato del puerto; un fake con otro nombre no cumple el Protocol.",
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
`,
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
          "E2 (independiente) — Dos implementaciones de normalizer (strip vs casefold) usables por la misma función `apply`. Salida/pass: dos líneas `Ana` y `ana`. Solo stdlib.",
        hint: "apply(norm, text) llama norm(text).",
        hints: [
          "apply(norm, text) llama norm(text).",
          "Imprime ambos resultados.",
        ],
        edgeCases: ["Duck typing: cualquier callable sirve"],
        tests: "Dos líneas: `Ana` (strip) y `ana` (casefold).",
        feedback: "Inyectar el normalizer evita hardcodear una sola política de texto en el dominio.",
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
`,
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
          "E3 (transferencia) — Implementa `should_introduce_protocol(n_adapters, has_fake_tests, api_stable) -> bool` con YAGNI: solo `True` si hay ≥2 adapters **o** tests con fake, **y** la API está estable. Evalúa los 3 casos del starter e imprime `WHEN_NOT: …` o `INTRODUCE: …` con la etiqueta. Solo stdlib.",
        hint: "False si (n_adapters < 2 y no has_fake_tests) o si not api_stable.",
        hints: [
          "False si (n_adapters < 2 y no has_fake_tests) o si not api_stable.",
          "Recorre la lista de casos y formatea WHEN_NOT:/INTRODUCE: + label.",
        ],
        edgeCases: ["Una sola impl sin fake → WHEN_NOT; API inestable → WHEN_NOT aunque haya 2 adapters"],
        tests: "Tres líneas: WHEN_NOT: solo_una_impl; WHEN_NOT: api_inestable; INTRODUCE: dos_adapters_con_fake.",
        feedback: "YAGNI: Protocol cuando hay ≥2 adapters o fakes de test y la API ya está estable.",
        starterCode: {
          language: 'python',
          title: "when_not_protocol.py",
          code: `# CASO-LIM-011 · when not Protocol (YAGNI)
# DEFECT: siempre True (introduce Protocol sin criterio)
def should_introduce_protocol(
    n_adapters: int, has_fake_tests: bool, api_stable: bool
) -> bool:
    return True

cases = [
    (1, False, True, "solo_una_impl"),
    (2, True, False, "api_inestable"),
    (2, True, True, "dos_adapters_con_fake"),
]
for n, fake, stable, label in cases:
    decision = "INTRODUCE" if should_introduce_protocol(n, fake, stable) else "WHEN_NOT"
    print(f"{decision}: {label}")
`,
        },
        solutionCode: {
          language: 'python',
          title: "when_not_protocol.py",
          code: `def should_introduce_protocol(
    n_adapters: int, has_fake_tests: bool, api_stable: bool
) -> bool:
    if not api_stable:
        return False
    if n_adapters < 2 and not has_fake_tests:
        return False
    return True

cases = [
    (1, False, True, "solo_una_impl"),
    (2, True, False, "api_inestable"),
    (2, True, True, "dos_adapters_con_fake"),
]
for n, fake, stable, label in cases:
    decision = "INTRODUCE" if should_introduce_protocol(n, fake, stable) else "WHEN_NOT"
    print(f"{decision}: {label}")`,
          output: `WHEN_NOT: solo_una_impl
WHEN_NOT: api_inestable
INTRODUCE: dos_adapters_con_fake`,
        },
      },
      {
        id: "S11-T4-A-E1",
        subtopicId: "S11-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — En el `ClientRecord` canónico, `to_dict` exporta `client_id`, `document_id`, `full_name` y `emails`, pero **omite** `internal_note` (nota de backoffice; no va al dashboard). No modeles contraseñas en el agregado de familiaridad. Solo stdlib.",
        hint: "Aunque exista internal_note en el objeto, no lo serialices en to_dict.",
        hints: [
          "Aunque exista internal_note en el objeto, no lo serialices en to_dict.",
          "Copia emails con list(...) para no filtrar la lista interna.",
        ],
        edgeCases: ["Notas internas y secretos no pertenecen al export de matching; no modeles secretos en el agregado de familiaridad"],
        tests: "Un dict con client_id/document_id/full_name/emails; la clave internal_note no aparece.",
        feedback: "to_dict es borde de dashboard: omite notas internas y nunca serialices secretos del agregado.",
        starterCode: {
          language: 'python',
          title: "to_dict_safe.py",
          code: `# CASO-LIM-011 · to_dict sin nota interna
# DEFECT: incluye internal_note en el export
from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)
    internal_note: str = ""  # backoffice; no serializar al dashboard

    def to_dict(self) -> dict:
        return {
            "client_id": self.client_id,
            "document_id": self.document_id,
            "full_name": self.full_name,
            "emails": list(self.emails),
            "internal_note": self.internal_note,
        }

print(ClientRecord("C001", "DNI-1", "Ana Pérez", ["a@ejemplo.pe"], "VIP review").to_dict())
`,
        },
        solutionCode: {
          language: 'python',
          title: "to_dict_safe.py",
          code: `from dataclasses import dataclass, field

@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)
    internal_note: str = ""  # backoffice; no serializar al dashboard

    def to_dict(self) -> dict:
        return {
            "client_id": self.client_id,
            "document_id": self.document_id,
            "full_name": self.full_name,
            "emails": list(self.emails),
        }

print(ClientRecord("C001", "DNI-1", "Ana Pérez", ["a@ejemplo.pe"], "VIP review").to_dict())`,
          output: `{'client_id': 'C001', 'document_id': 'DNI-1', 'full_name': 'Ana Pérez', 'emails': ['a@ejemplo.pe']}`,
        },
      },
      {
        id: "S11-T4-A-E2",
        subtopicId: "S11-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Implementa repositorio en memoria con `save`/`get` sobre un `dict` (clave `client_id`). Guarda el row sintético C001 y recupéralo. Salida/pass: `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}`. Solo stdlib.",
        hint: "Clase con save y get; get usa .get del dict.",
        hints: [
          "Clase con save y get; get usa .get del dict.",
          "Roundtrip de un client dict.",
        ],
        edgeCases: ["get retorna None si no existe"],
        tests: "Una línea: dict C001 con email a@ejemplo.pe tras save/get.",
        feedback: "Repo light: save/get sin conocer CLI ni HTTP.",
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
`,
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
          "E3 (transferencia) — Modela la frontera en código: `Layer` frozen con `name`, `may_print`, `may_parse_cli`, `holds_invariants`. `classify()` devuelve cli / service / domain en ese orden. Service **no** imprime ni parsea CLI; solo domain sostiene invariantes. Imprime tres líneas `LAYER: …`. Solo stdlib.",
        hint: "service: may_print=False y may_parse_cli=False; domain: holds_invariants=True.",
        hints: [
          "service: may_print=False y may_parse_cli=False; domain: holds_invariants=True.",
          "cli puede print y parsear argv; no sostiene invariantes de dominio.",
        ],
        edgeCases: ["Logging de correlación puede colgarse del service sin print de negocio"],
        tests: "Tres líneas LAYER: cli print/cli True; service ambos False; domain inv=True y sin print/cli.",
        feedback: "La CLI puede imprimir; el service orquesta; solo el dominio sostiene invariantes.",
        starterCode: {
          language: 'python',
          title: "boundary_layers.py",
          code: `# CASO-LIM-011 · layers como tipos
# DEFECT: service.may_print True; domain.holds_invariants False
from dataclasses import dataclass

@dataclass(frozen=True)
class Layer:
    name: str
    may_print: bool
    may_parse_cli: bool
    holds_invariants: bool

def classify() -> list[Layer]:
    return [
        Layer("cli", True, True, False),
        Layer("service", True, False, False),  # service no debe imprimir
        Layer("domain", False, False, False),  # domain sí sostiene invariantes
    ]

for L in classify():
    print(
        f"LAYER: {L.name} print={L.may_print} "
        f"cli={L.may_parse_cli} inv={L.holds_invariants}"
    )
`,
        },
        solutionCode: {
          language: 'python',
          title: "boundary_layers.py",
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Layer:
    name: str
    may_print: bool
    may_parse_cli: bool
    holds_invariants: bool

def classify() -> list[Layer]:
    return [
        Layer("cli", True, True, False),
        Layer("service", False, False, False),
        Layer("domain", False, False, True),
    ]

for L in classify():
    print(
        f"LAYER: {L.name} print={L.may_print} "
        f"cli={L.may_parse_cli} inv={L.holds_invariants}"
    )`,
          output: `LAYER: cli print=True cli=True inv=False
LAYER: service print=False cli=False inv=False
LAYER: domain print=False cli=False inv=True`,
        },
      },
      {
        id: "S11-T4-B-E1",
        subtopicId: "S11-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Test de invariante sobre forma reducida de `ClientRecord` (`client_id` + `document_id`): document vacío lanza `ValueError`; imprime `pass`. Solo stdlib.",
        hint: "Usa try/except ValueError y return 'pass'.",
        hints: [
          "Usa try/except ValueError y return 'pass'.",
          "print del resultado del test.",
        ],
        edgeCases: ["Tests puros: sin I/O de red"],
        tests: "Una línea: `pass`. El test solo pasa si document vacío lanza ValueError.",
        feedback: "Un test que no ejercita el rechazo es teatro: el try/except debe ser real.",
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
`,
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
          "E2 (independiente) — Fake repo + servicio: tres tests puros (`register`, `get` existente, `get` missing). Cada test imprime `pass` (tres líneas). Sin red/DB; solo stdlib.",
        hint: "Service simple con repo inyectado; asserts reales.",
        hints: [
          "Service simple con repo inyectado; asserts reales.",
          "Imprime pass x3.",
        ],
        edgeCases: ["Fake no es mock mágico: es implementación en memoria"],
        tests: "Tres líneas `pass` (register, get existente, get missing). Asserts reales, no prints vacíos.",
        feedback: "Fake en memoria + asserts = suite de dominio sin red ni DB.",
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
`,
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
          "E3 (transferencia) — Extrae el anti-patrón: elimina `decide_fraud` del dominio y modela `RelationshipEvidence` frozen con `signal_score` (dato, no veredicto). Assert de que no existen `decide_fraud`/`is_fraud`/`is_related_family`. Imprime `ANTES has_decide_fraud True` y `DESPUES signal_score 0.95 has_decide_fraud False`. Solo stdlib.",
        hint: "Borra el método de veredicto; el score vive en el value object de evidencia.",
        hints: [
          "Borra el método de veredicto; el score vive en el value object de evidencia.",
          "Usa hasattr sobre la clase final, no sobre la versión defectuosa.",
        ],
        edgeCases: ["Umbrales de producto y revisión humana viven fuera del modelo de dominio"],
        tests: "Dos líneas: `ANTES has_decide_fraud True` y `DESPUES signal_score 0.95 has_decide_fraud False`.",
        feedback: "Scores son datos de matching; decide_fraud/is_family no viven en el dominio de familiaridad.",
        starterCode: {
          language: 'python',
          title: "extract_fraud.py",
          code: `# CASO-LIM-011 · no fraud in domain
# DEFECT: veredicto decide_fraud en el dominio
from dataclasses import dataclass

@dataclass
class Client:
    client_id: str

    def decide_fraud(self, score: float) -> bool:
        return score >= 0.9

print("ANTES has_decide_fraud", hasattr(Client, "decide_fraud"))
print("DESPUES signal_score", 0.95, "has_decide_fraud", hasattr(Client, "decide_fraud"))
`,
        },
        solutionCode: {
          language: 'python',
          title: "extract_fraud.py",
          code: `from dataclasses import dataclass

@dataclass
class Client:
    client_id: str

    def decide_fraud(self, score: float) -> bool:
        return score >= 0.9

print("ANTES has_decide_fraud", hasattr(Client, "decide_fraud"))

# Anti-patrón extraído: el dominio solo guarda señales, no veredictos.
@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

assert not hasattr(RelationshipEvidence, "decide_fraud")
assert not hasattr(RelationshipEvidence, "is_fraud")
assert not hasattr(RelationshipEvidence, "is_related_family")
ev = RelationshipEvidence("E1", "E2", 0.95)
print(
    "DESPUES signal_score",
    ev.signal_score,
    "has_decide_fraud",
    hasattr(RelationshipEvidence, "decide_fraud"),
)`,
          output: `ANTES has_decide_fraud True
DESPUES signal_score 0.95 has_decide_fraud False`,
        },
      },
    ],
  },
  youDo: {
    title: "Modelo de dominio Cliente–Transacción–Evidencia",
    context:
      "Implementas el núcleo de **CP-N1-C**: ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence con invariantes, serialización y repo en memoria. **Ninguna clase decide fraude o parentesco.**",
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
    starterCode: `"""CP-N1-C — completa el dominio. Sin is_fraud / is_related_family. Datos sintéticos.
Forma canónica ClientRecord: client_id, document_id, full_name, emails.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from decimal import Decimal
from math import isfinite
from typing import Protocol

# Completa cada TODO. Los tests al final fallan hasta que el dominio esté bien.


@dataclass
class ClientRecord:
    client_id: str
    document_id: str
    full_name: str
    emails: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        # TODO: rechazar client_id o document_id vacíos (strip)
        pass

    def to_dict(self) -> dict:
        # TODO: devolver dict serializable (sin secretos)
        return {}


@dataclass(frozen=True)
class ResolvedEntity:
    entity_id: str
    display_name: str = field(compare=False)

    def __post_init__(self) -> None:
        # TODO: rechazar entity_id vacío
        pass


@dataclass
class Transaction:
    tx_id: str
    client_id: str
    amount: Decimal
    currency: str

    def __post_init__(self) -> None:
        # TODO: Decimal > 0, máx. 2 decimales, currency en {PEN, USD}
        pass


@dataclass(frozen=True)
class RelationshipEvidence:
    left_id: str
    right_id: str
    signal_score: float  # dato, no veredicto

    def __post_init__(self) -> None:
        # TODO: par canónico left_id < right_id; score finito en [0, 1]
        pass


class ClientRepository(Protocol):
    def save(self, client: ClientRecord) -> None: ...
    def get(self, client_id: str) -> ClientRecord | None: ...


class InMemoryClientRepository:
    def __init__(self) -> None:
        self._d: dict[str, ClientRecord] = {}

    def save(self, client: ClientRecord) -> None:
        # TODO: persistir por client_id
        pass

    def get(self, client_id: str) -> ClientRecord | None:
        # TODO: recuperar o None
        return None


def test_domain() -> None:
    """Oráculo honesto: debe imprimir tests_pass solo si todo está correcto."""
    c = ClientRecord("C001", "DNI-1", "Ana Pérez", ["ana@ejemplo.pe"])
    assert c.to_dict()["client_id"] == "C001"
    assert c.to_dict()["full_name"] == "Ana Pérez"

    try:
        ClientRecord("", "DNI-1", "X", [])
        raise AssertionError("debía fallar client_id vacío")
    except ValueError:
        pass

    assert ResolvedEntity("E1", "Ana") == ResolvedEntity("E1", "Ana actualizada")
    try:
        ResolvedEntity("  ", "sin id")
        raise AssertionError("debía fallar entity_id vacío")
    except ValueError:
        pass

    tx = Transaction("T1", "C001", Decimal("150.50"), "PEN")
    assert tx.amount == Decimal("150.50")
    try:
        Transaction("T2", "C001", Decimal("0.00"), "PEN")
        raise AssertionError("debía fallar amount <= 0")
    except ValueError:
        pass
    try:
        Transaction("T3", "C001", Decimal("1.00"), "EUR")
        raise AssertionError("debía fallar currency EUR")
    except ValueError:
        pass

    ev = RelationshipEvidence("E1", "E2", 0.4)
    assert ev.signal_score == 0.4
    try:
        RelationshipEvidence("E2", "E1", 0.5)
        raise AssertionError("debía fallar par no canónico")
    except ValueError:
        pass
    assert not hasattr(RelationshipEvidence, "is_fraud")
    assert not hasattr(RelationshipEvidence, "is_related_family")

    repo: ClientRepository = InMemoryClientRepository()
    repo.save(c)
    assert repo.get("C001") is not None
    assert repo.get("MISSING") is None

    print("tests_pass")


if __name__ == "__main__":
    test_domain()
`,
    portfolioNote:
      "Entrega: diagrama textual de las cuatro entidades, lista de invariantes (fail-closed), README de límites éticos (sin is_fraud/is_family) y salida `tests_pass` del oráculo. Datos solo sintéticos (@ejemplo.pe / C00x).",
    rubric: [
      { criterion: "Alineación al gate CP-N1-C y a los objetivos de la sección", weight: "25%" },
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
          "Un default `[]` se evalúa una sola vez: todas las instancias comparten la misma lista. `default_factory=list` crea una lista nueva por instancia.",
      },
      {
        question: "RelationshipEvidence.signal_score representa…",
        options: ["Una señal/dato numérico, no un veredicto de fraude o familia", "Veredicto legal de parentesco", "Password hasheado", "Exit code del CLI"],
        correctIndex: 0,
        explanation:
          "En matching de familiaridad el score es evidencia numérica. El dominio no emite parentesco legal ni fraude; eso queda fuera del núcleo CP-N1-C.",
      },
      {
        question: "Un Protocol EntityStore sirve para…",
        options: ["Conectarse solo a Postgres", "Definir un puerto get/save implementable por fakes y adapters", "Reemplazar dataclass", "Serializar a PDF"],
        correctIndex: 1,
        explanation:
          "Protocol describe un puerto estructural: FakeStore en tests y adapter SQL en S12 pueden implementar get/save sin heredar de una ABC pesada.",
      },
      {
        question: "Objeto inválido: ¿cuándo fallar?",
        options: ["Al final del mes", "Nunca", "Solo en producción", "En la construcción (__post_init__/validate)"],
        correctIndex: 3,
        explanation:
          "Fail-closed al construir evita un ClientRecord o Transaction inválido circulando por el set de resolución.",
      },
      {
        question: "Client hereda de Person…",
        options: ["Siempre es la mejor opción", "Es obligatoria en Python", "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar", "Impide tests"],
        correctIndex: 2,
        explanation:
          "Sin subtipo real (is-a), la herencia acopla jerarquías. Composición (Client tiene PersonInfo) mantiene el grafo de dominio auditable.",
      },
      {
        question: "¿Qué no debe tener el dominio de familiaridad?",
        options: ["is_fraud() automático", "to_dict", "Invariantes", "Tests unitarios"],
        correctIndex: 0,
        explanation:
          "APIs de veredicto (is_fraud, is_related_family) no pertenecen al modelo: scores son datos; la decisión humana o de producto vive fuera.",
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
      {
        label: "unittest — Unit testing framework",
        url: "https://docs.python.org/3/library/unittest.html",
        note: "Referencia opcional: tests de dominio puro sin red",
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
        label: "pytest docs (soporte de calidad, opcional)",
        url: "https://docs.pytest.org/",
        note: "Referencia opcional de tests; el foco de S11 es el modelo de dominio.",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "Edición pública del curso PyArcana.",
      },
    ],
  },
}
