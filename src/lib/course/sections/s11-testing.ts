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
    "Un modelo de dominio claro es la base de productos de matching y familiaridad sin inventar veredictos legales. Aquí aprendes a construir un núcleo orientado a objetos: tipos con invariantes (esto es, reglas que el objeto siempre cumple, como «un cliente válido tiene email y DNI»), composición y puertos testeables. Es la base sobre la que luego monta cualquier dashboard de evidencia que respete la privacidad de las personas.",
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
            heading: "Un diccionario no promete nada",
      paragraphs: [
        "Hasta aquí un cliente ha sido un diccionario: `{'id': 'C001', 'nombre': 'Ana', 'monto': '150.00'}`. Es cómodo y no protege nada. Nadie impide escribir `registro['nombe']` con la letra cambiada; nadie impide que a mitad del programa aparezca un registro sin `monto`; nadie impide que el mismo campo sea texto en una función y número en la siguiente. El error no se nota donde se comete, sino tres funciones más adelante, cuando ya perdiste el rastro.",
        "La alternativa es darle nombre a la cosa. Un diccionario es una hoja en blanco donde cabe cualquier anotación; un tipo con nombre es un formulario impreso: tiene casillas fijas, y las casillas obligatorias no se pueden dejar vacías. `ClientRecord`, `ResolvedEntity`, `Transaction` y `RelationshipEvidence` son esos formularios, y a partir de ahora son el vocabulario del programa.",
        "Lo que un formulario aporta de verdad son los **invariantes**: las condiciones que tienen que ser ciertas siempre para que ese objeto tenga sentido. Un `Transaction` no puede tener monto negativo; su moneda tiene que ser una de las permitidas; un `CaseFile` no puede sostener una relación sin al menos una `RelationshipEvidence` que la respalde. Fíjate en que ese último invariante es del expediente, no de la entidad: `ResolvedEntity` se construye con identificador y nombre, y las evidencias viven en el agregado que las agrupa. La decisión que ordena la sección es *dónde* se comprueba eso, y la respuesta es: al construir el objeto. Si un campo obligatorio falta, la construcción falla ahí mismo en lugar de rellenar en silencio y contaminar todo lo que venga después.",
        "Hay una frontera ética que estos tipos hacen visible. `RelationshipEvidence` guarda señales de relación y un puntaje; ninguna clase de esta sección emite un veredicto. Un puntaje es un dato con incertidumbre, no una conclusión legal sobre una persona. Por eso no existe ninguna función que se llame `is_fraud` ni `is_family`: no es un olvido, es el diseño.",
        "La pregunta que se repite en cada tipo que escribas es corta: **¿qué tiene que ser verdad para que este objeto pueda existir?** Contestarla te da las validaciones, los mensajes de error y las pruebas casi gratis. Trabajarás con `dataclass`, propiedades, composición y `Protocol` de la biblioteca estándar; los frameworks web y los ORM —las bibliotecas que traducen objetos a tablas de base de datos— llegan más adelante, cuando ya sepas qué es lo que estarías traduciendo.",
      ],
      callout: {
        type: "info",
        title: "CP-N1-C modelo de dominio",
        content:
          "Gate: cuatro tipos explícitos, invariantes, tests sin red/DB, README de límites éticos del modelo.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, alcance y criterio de cierre.",
        "**Orden de los subtemas.** T1 introduce los objetos y las `dataclass`. T2 trata la encapsulación: propiedades y validación en el borde. T3 pasa al diseño: composición antes que herencia. T4 cierra con los límites: repositorios en memoria y pruebas puras.",
        "**Caso de laboratorio.** Datos sintéticos peruanos: identificadores `C00x` y `E0x`, correos `@ejemplo.pe`, montos en `Decimal` sobre soles y dólares.",
        "**Criterio de cierre (CP-N1-C).** Los cuatro tipos con sus invariantes, pruebas que corren sin red ni base de datos, y un README que declare los límites éticos del modelo.",
        "**Límites.** Nunca datos personales reales. Ninguna interfaz `is_fraud` ni `is_family`: los puntajes son datos, no decisiones sobre personas.",
      ],
     },
     {
      heading: "Clases, instancias y dataclass",
      subtopicId: "S11-T1-A",
      paragraphs: [
        "Una **clase** define el molde; una **instancia** es un objeto concreto hecho a partir de ese molde. `@dataclass`, que es un decorador que genera por ti el constructor `__init__` y la representación `__repr__`, reduce el código repetitivo sin perder el nombre del dominio. En familiaridad, `ClientRecord` es el borde de onboarding sintético — la frontera donde el dict crudo del CLI se vuelve un objeto con tipo —, no una fila de pandas.",
        "Forma canónica en S11: `ClientRecord(client_id, document_id, full_name, emails)`. Campos con **type hints** (anotaciones de tipo, que le dicen al lector y al verificador qué valores admite cada campo) y `default_factory` (una función constructora que se ejecuta una vez por instancia) para listas mutables evitan el clásico bug del default compartido. Prefiere `list[str] = field(default_factory=list)` a `emails=[]`. Fail-closed, que significa 'fallar cerrando la puerta': no construyas con `None` silencioso donde el esquema exige un string no vacío.",
        "Migrar dicts anónimos a tipos nombra el dominio y habilita invariantes (reglas que el objeto siempre cumple, sin importar desde dónde se le llame) en T1-B, donde `from_dict` construye la dataclass desde un dict. Caso sintético: `ClientRecord(\"C001\", \"DNI-1\", \"Ana Pérez\", [\"ana@ejemplo.pe\"])`. Documenta qué campos son PII sintética (información personal identificable de mentira, inventada para la demo) y cuáles son ids estables de sistema."
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
      figure: {
        id: "S11-invariant-where",
        caption:
          "Comprobar después permite que exista, aunque sea un instante, un objeto imposible — y alguien lo va a usar.",
        alt:
          "Tres guardas evaluadas al construir: campo ausente falla, valor fuera de dominio lanza ValueError, todo válido produce un objeto coherente.",
      },
      subtopicId: "S11-T1-B",
      paragraphs: [
        "`__post_init__` (el gancho que ejecuta la dataclass justo después de construir el objeto) valida al instante. Si el estado es inválido, **falla al crear** — un `ClientRecord` a medias en el set de resolución (el conjunto donde se agrupan entidades únicas) es peor que un `ValueError` temprano (una excepción de Python que indica un valor inválido). Las reglas viven junto al tipo, no en un script suelto del CLI.",
        "Un método `validate()` reutilizable ayuda en factories (constructores alternativos que producen instancias ya validadas) como `from_dict` y en la rehidratación desde JSON, que es reconstruir el objeto desde un JSON guardado: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización (la frontera donde el objeto se convierte a o desde un formato plano).",
        "Al validar, **sin side-effects de negocio** (efectos colaterales, que son cambios en el mundo exterior al objeto): no llames APIs, no escribas a disco, no apliques “arreglos” silenciosos de moneda. Stack: stdlib (la biblioteca estándar de Python) + `Decimal`; sin ORM (un mapeador objeto-relacional, que es lo que conecta clases con tablas de base de datos).",
        "Ejemplo: `document_id` no vacío; en `Transaction`, `amount` es `Decimal` (el tipo de Python para números decimales exactos, sin el ruido binario de `float`) **positivo** y `currency` ∈ allowlist `{'PEN','USD'}` (una lista de valores permitidos). Nunca conviertas PEN → USD en el constructor. Caso sintético PE: `Transaction(\"T1\", \"C001\", Decimal(\"150.50\"), \"PEN\")` acepta; `\"EUR\"` o `amount<=0` rechaza."
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
        title: "Falla al construir",
        content:
          "Un objeto inválido en memoria es peor que una excepción temprana.",
      },
    },
    {
      heading: "Propiedades y métodos",
      subtopicId: "S11-T2-A",
      paragraphs: [
        "`@property` (un decorador que convierte un método en un atributo calculado, accesible sin paréntesis) expone campos derivados como `display_name` y `masked_email` **sin** mutación peligrosa desde afuera. La UI (interfaz de usuario), los logs (registros de ejecución) y el dashboard de evidencia (el panel donde se muestra la evidencia) deben preferir la máscara; el email raw (el dato en bruto, sin enmascarar) queda en el campo interno solo para el borde autorizado (export legal, backoffice interno).",
        "Métodos de instancia encapsulan consultas puras (funciones que solo leen, sin modificar), como `age_days_since(as_of)`. Evita side-effects en properties: no envían mail, no escriben disco, no llaman red. Fail-closed o sentinel documentado (un valor marcador que indica 'no hay dato', como `(sin email)`) si `emails` está vacío o el primer email no tiene `@` al calcular `masked_email` — nunca un `IndexError` (una excepción que ocurre al acceder a un índice que no existe) en el pipeline de matching (el flujo de procesamiento del matching).",
        "Setters validados (los métodos que asignan un valor a un atributo) solo cuando la mutación es parte del modelo de negocio (p. ej. un score en [0, 1]); si no, prefiere **`frozen`** (congelado, lo que impide mutar el objeto tras crearlo) o devolver una **nueva instancia**. Caso sintético PE: `ClientRecord(\"C003\", \"DNI-3\", \"Lucía Méndez\", [\"lucia@ejemplo.pe\"])` imprime `display_name` y el email enmascarado sin PII completa (información personal identificable) en stdout (la salida estándar, que es lo que se imprime en la consola)."
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
        title: "Consulta vs. comando",
        content:
          "Properties no deberían enviar emails ni escribir a disco.",
      },
    },
    {
      heading: "Igualdad, hash y mutabilidad consciente",
      subtopicId: "S11-T2-B",
      paragraphs: [
        "La identidad de `ResolvedEntity` (lo que hace que dos objetos sean 'el mismo') usa su **`entity_id` estable**, no `document_id`. Un documento es PII (información personal identificable) y puede corregirse o reemitirse; usarlo como identidad fusionaría entidades por accidente en el set de resolución (el conjunto donde se agrupan entidades únicas).",
        "**`frozen=True`** (congelar el objeto al construirlo, impidiendo mutarlo después) habilita hash seguro —con una condición que conviene conocer antes de que falle: el hash se calcula sobre los campos que entran en la comparación, así que si uno guarda una lista o un dict, `hash()` lanza `TypeError` pese al `frozen`; para campos así usa una tupla o exclúyelos con `field(compare=False)`— (un número fijo que Python usa para ubicar el objeto en sets y diccionarios) para sets y dicts de matching local.",
        "Entidades mutables como keys de dict (claves de diccionario) son una fuente clásica de bugs: el hash cambia si mutas un campo que entra en `__eq__`/`__hash__` (los métodos que definen igualdad y hash). Usa `field(compare=False)` (una directiva que excluye un campo de `__eq__` y del hash) para etiquetas visibles como `display_name`. Ojo con lo que eso permite exactamente: si el objeto es `frozen`, seguirás sin poder reasignar el campo — corregir una etiqueta es construir una copia con `dataclasses.replace(...)`. Lo que `compare=False` te da es que esa copia corregida siga siendo **igual** a la original y conserve su hash, de modo que arreglar un nombre mal escrito no convierta la entidad en otra distinta dentro de un `set` o de un dict. Fail-closed: `entity_id` vacío o solo espacios → `ValueError` al construir.",
        "Value objects (objetos-valor, que son tipos pequeños sin identidad propia más allá de sus campos), como `RelationshipEvidence`, suelen ser frozen; agregados (raíces que agrupan varios objetos relacionados), como `CaseFile` con listas de evidencias, pueden ser mutables con métodos `add` controlados. Caso sintético PE: si creas `ResolvedEntity(\"E1\", \"Ana\")` y luego `ResolvedEntity(\"E1\", \"Ana actualizada\")`, el set `{e1, e1b, e2}` tiene tamaño **2** porque la igualdad es solo por `entity_id` — el relabel (cambio de etiqueta) del nombre no inventa una tercera entidad."
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
        title: "Igualdad personalizada",
        content:
          "`field(compare=False)` excluye display_name de eq/hash. No uses document_id como identidad de ResolvedEntity.",
      },
    },
    {
      heading: "Composición antes que herencia",
      subtopicId: "S11-T3-A",
      paragraphs: [
        "Tras fijar la identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. La relación **has-a** (tiene-un), también llamada composición (un objeto contiene a otros, en lugar de heredar de ellos), modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`.",
        "No fuerces `Client(PersonInfo(BaseEntity))` solo para reutilizar un campo de nombre.",
        "Una evidencia usa un **par canónico** (una forma única de ordenar el par de ids, con `left_id < right_id`), ids distintos y `signal_score` (la puntuación de la señal) finito en [0, 1]. Así (E1,E2) y (E2,E1) no duplican la misma relación en el almacén de matching. Fail-closed si el par no es canónico o el score es NaN o está fuera de rango — no “recortes” silenciosos.",
        "La herencia, que es cuando una clase deriva de otra, solo procede si hay **subtipo real** (is-a, es-un). Mixins (clases pequeñas que añaden comportamiento a otras) con cautela: añaden complejidad invisible en el MRO (el orden de resolución de métodos, que es la ruta que sigue Python para buscar métodos en una jerarquía). Prefiere funciones puras (sin side-effects) o colaboración entre objetos tipados. Caso sintético PE: `CaseFile.add(RelationshipEvidence(\"E1\",\"E2\",0.42))` sin método `is_family()`.",
        "La composición mantiene el dominio auditable: puedes serializar (convertir a un formato plano) el grafo de evidencias (la red de relaciones entre evidencias) sin arrastrar jerarquías frágiles. Documenta en el README del gate que `signal_score` es **dato de matching**, no parentesco legal ni veredicto de fraude."
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
        "`typing.Protocol` (la clase Protocol del módulo typing) describe un **puerto** (un punto de extensión del dominio, donde se conectan adaptadores externos) como `EntityStore` con `get`/`save` sin forzar una jerarquía de herencia. Es duck typing estructural (si camina como pato y nada como pato, es pato, sin pedir herencia): cualquier objeto con esos métodos cumple el contrato en chequeo estático (la verificación que hace el analizador de tipos antes de ejecutar) y, con `@runtime_checkable` (un decorador que habilita la verificación en tiempo de ejecución), también en `isinstance` (la función que verifica si un objeto es de un tipo) en runtime (tiempo de ejecución).",
        "Sirve para **fakes en tests del dominio** (implementaciones de mentira, útiles para tests sin red ni DB) y para no acoplar el núcleo a SQLite, HTTP o un ORM. Evita ABC pesados (clases base abstractas, una alternativa más rígida al Protocol) si el Protocol basta. Fail-closed en el **adaptador real** (la implementación concreta que habla con la base de datos) si la DB no responde: el dominio no captura excepciones de I/O; el borde de infraestructura (la frontera técnica con el mundo exterior) sí.",
        "No introduzcas Protocol “por si acaso” con una sola implementación y sin fakes de test — YAGNI (You Aren't Gonna Need It, un principio que aconseja no añadir abstracciones hasta que hacen falta). Caso sintético PE: `FakeStore` en memoria para los tests de T4; el adapter SQL/HTTP (el adaptador que habla con SQL o HTTP) llega en **S12** sin reescribir `ClientService` ni las invariantes del dominio."
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
        "**Repository** light (un patrón que aísla el acceso al almacén de datos detrás de métodos `get`/`save`). **Service** light: orquesta reglas de dominio sin conocer CLI ni HTTP. `to_dict`/`from_dict` (métodos que convierten entre el objeto de dominio y un diccionario plano) viven en el **borde** de serialización (la frontera donde el objeto entra o sale del sistema), no mezclados con invariantes de negocio (las reglas que el objeto siempre cumple).",
        "Serializa sin secretos ni PII innecesaria en logs. Notas internas de backoffice (el panel interno de operación, como `internal_note`) no van al export de dashboard. DTOs (objetos de transferencia de datos, que son diccionarios o clases simples que cruzan la frontera) no tienen que ser idénticos a las entidades internas. Fail-closed si falta `client_id` en `from_dict`. **No almacenes contraseñas en el agregado de familiaridad.**",
        "La CLI de S10 llama al service; el service **no** imprime ni parsea argparse (el módulo de Python que parsea argumentos de línea de comandos). Caso sintético: `ClientService(InMemoryClientRepository()).register(\"C001\", \"DNI-1\", \"Ana Pérez\", \"a@ejemplo.pe\")` → dict de borde (el diccionario que sale del dominio hacia afuera) sin decidir fraude."
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
        "Tests del dominio son **puros** (sin efectos externos: sin red, sin DB real, sin reloj de red). Fakes del `Protocol` (implementaciones de mentira del puerto) bastan para ejercitar repos y servicios. Eso permite CI rápida (integración continua rápida, que ejecuta tests en cada cambio), demos offline del gate **CP-N1-C** y feedback inmediato en local-python (Python corriendo en tu máquina).",
        "Assert de invariantes (verificaciones con `assert` que confirman las reglas que el objeto siempre cumple) y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`). Un test de “no existe el método” (una prueba que verifica que un método peligroso no está disponible) documenta la ética del producto en código — no es adorno: protege el límite legal del matching. Fail-closed: score fuera de [0, 1] no se “recorta” en silencio en el constructor.",
        "Scores de resolución/relación son **campos**; un test verifica finitud (que el valor es finito, no NaN ni infinito), rango, par canónico y que no hay veredictos. Caso sintético: `test_no_fraud_api()` pasa si `RelationshipEvidence` solo expone ids + score. Nunca PII real en fixtures (datos de prueba predefinidos, como `@ejemplo.pe` o ids `C00x`/`E0x`)."
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
    intro: "Ocho demos I Do (uno por subtema), en orden **T1 → T4**. Cada demo modela un fragmento del núcleo CP-N1-C de familiaridad en **local-python**, el entorno que corre en tu propia máquina (sin servidor ni nube). El recorrido cubre: dataclass, invariantes, properties, frozen, composición, Protocol, service y tests éticos. Cada término se glosa en la teoría y se ejemplifica en su demo. Sin veredictos de fraude ni parentesco.",
    steps: [
      {
        demoId: "S11-T1-A-DEMO",
        subtopicId: "S11-T1-A",
        environment: "local-python",
        description: "ClientRecord.from_dict: borde dict sintético → dataclass canónica",
        preamble:
          "Tras la CLI de S10, el onboarding sintético deja de ser un dict anónimo y pasa a un **tipo con nombre**. En esta demo un payload JSON-like (`C001`, `@ejemplo.pe`) se convierte con `from_dict` en `ClientRecord`. No escribas aún: sigue el `classmethod` (un método que pertenece a la clase, no a una instancia), observa que `emails` se copia a una lista nueva, y predice el `repr` final (la representación textual del objeto, generada por `__repr__`). Sin PII real (información personal identificable); solo stdlib (la biblioteca estándar de Python).",
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
        why: "El factory vive en la clase (`@classmethod`), no en la instancia. El CLI/JSON no inventa campos sueltos. La función `list(d.get(...))` copia emails y evita el alias del dict crudo (que ambos objetos apunten a la misma lista). El método `from_dict` nombra el borde dict→dominio con la forma canónica de ClientRecord.",
        retrospective:
          "Si puedes explicar por qué `from_dict` es `@classmethod` y no método de instancia, ya tienes el hábito del borde dict→dominio. El error clásico es devolver el dict crudo. En We Do arreglarás default mutable, money con `Decimal` y la factory bien hecha.",
      },
      {
        demoId: "S11-T1-B-DEMO",
        subtopicId: "S11-T1-B",
        environment: "local-python",
        description: "ClientRecord canónico con validate() + __post_init__; rechaza document_id vacío.",
        preamble:
          "Un `ClientRecord` con `document_id` en blanco no debe existir en memoria: el matching local fallaría más tarde y más opaco. Observa `validate()` reutilizable y `__post_init__` (el gancho que ejecuta la dataclass justo después de construir el objeto) que lo invoca. Predice el `print` feliz y la línea `rejected document_id vacío`. Sin side-effects de red (efectos colaterales que tocan el mundo exterior, como llamar a una API) ni “arreglos” silenciosos del id.",
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
        why: "Fail-on-construct (fallar al construir) centraliza reglas junto al tipo: no hay instancia inválida en el set de resolución (el conjunto donde se agrupan entidades únicas). El mismo `validate()` sirve en factories (constructores alternativos) y en la rehidratación desde JSON o CLI. Fail-closed es más seguro que “arreglar” el id en silencio en el borde.",
        retrospective:
          "Si puedes decir por qué fallar al construir es más seguro que “arreglar” en el CLI, ya internalizaste fail-closed. We Do: invariantes de `Transaction`, `from_dict` con strip, y `validate()` que acumula errores.",
      },
      {
        demoId: "S11-T2-A-DEMO",
        subtopicId: "S11-T2-A",
        environment: "local-python",
        description: "display_name y masked_email como properties sobre ClientRecord canónico.",
        preamble:
          "En logs (registros de ejecución) y dashboard de evidencia el email completo no debe ser la superficie por defecto. Sigue las properties (atributos calculados accesibles sin paréntesis): `display_name` es lectura simple; `masked_email` particiona en `@`, enmascara el local y devuelve `(sin email)` si la lista está vacía — nunca un `IndexError` (una excepción que ocurre al acceder a un índice que no existe). Datos sintéticos `Lucía` / `lucia@ejemplo.pe`. No escribas; predice las dos líneas de salida.",
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
        why: "Properties sin side-effects (efectos colaterales que tocan el mundo exterior): la superficie pública no necesita el email completo. La máscara es para UI/logs; el raw (el dato en bruto, sin enmascarar) queda en el campo interno solo para el borde autorizado. Si `emails` está vacío, un sentinel documentado (un valor marcador que indica 'no hay dato', como `(sin email)`) evita `IndexError` en el pipeline de matching (el flujo de procesamiento del matching).",
        retrospective:
          "Property = consulta calculada sin mutar. El sentinel documentado es fail-soft de presentación, no “arreglar” datos. We Do: property, método de consulta con validación de argumento, y setter de score con rango.",
      },
      {
        demoId: "S11-T2-B-DEMO",
        subtopicId: "S11-T2-B",
        environment: "local-python",
        description: "ResolvedEntity frozen por entity_id; set de entidades; id vacío rechazado.",
        preamble:
          "En resolución de entidades, la identidad estable (lo que hace que dos objetos sean 'el mismo') es `entity_id`, no el nombre visible ni el documento. Observa `frozen=True` (congelar el objeto al construirlo, impidiendo mutarlo después), `display_name` con `compare=False` (una directiva que excluye ese campo de la igualdad), y el set `{e1, e1b, e2}`: el relabel (cambio de etiqueta) de Ana **no** inventa una tercera entidad. También el reject de id en blanco. Predice `size 2` y `e1==e1b True` antes de mirar la salida.",
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
        why: "`frozen` + `compare=False` mantienen la identidad solo por `entity_id`: el set de matching colapsa relabels sin inventar entidades. `document_id` es PII (información personal identificable) corregible; usarlo como key (clave de diccionario o entrada de set) fusionaría personas distintas o reemitidas por accidente. Fail-closed si el id está vacío o solo espacios evita basura en el set de resolución.",
        retrospective:
          "Igualdad por id estable + etiqueta fuera del compare = set de matching confiable. We Do: frozen equality, dedup de evidencias, y el bug clásico de key mutable en dict.",
      },
      {
        demoId: "S11-T3-A-DEMO",
        subtopicId: "S11-T3-A",
        environment: "local-python",
        description: "CaseFile compone ResolvedEntity + RelationshipEvidence validada (par canónico y score).",
        preamble:
          "El expediente de matching **tiene** una entidad y **tiene** evidencias: composición (un objeto contiene a otros, en lugar de heredar de ellos), no herencia de “Persona base”. Observa `RelationshipEvidence` fail-closed (que falla cerrando la puerta si algo no cuadra: par canónico, score finito en [0,1]) y `CaseFile.add` que solo agrega objetos ya válidos. Predice `E1 n_ev 2` y la lista de scores. No hay `is_family()`.",
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
        why: "Composición con invariantes reales (reglas que el objeto siempre cumple): `add` no revalida el mundo; el invariante vive en el value object (objeto-valor, un tipo pequeño sin identidad propia más allá de sus campos) al construir. Solo acepta evidencias ya validadas (par canónico + score en rango).",
        retrospective:
          "Composición mantiene el grafo auditable: el expediente **tiene** entidades y evidencias, no hereda “Persona base”. El par canónico evita duplicar (E1,E2)/(E2,E1); el score es **dato**, no parentesco. Pregunta de auto-chequeo: ¿dónde vivirías un `is_family()` si te lo pidieran? (fuera del value object). We Do: reemplazar herencia, arreglar default mutable en CaseFile y codificar el par canónico.",
      },
      {
        demoId: "S11-T3-B-DEMO",
        subtopicId: "S11-T3-B",
        environment: "local-python",
        description: "Protocol EntityStore con get/save; FakeStore en memoria.",
        preamble:
          "El servicio de dominio no debe importar SQLite ni HTTP para guardar una entidad. Observa el `Protocol EntityStore` (un puerto: un punto de extensión del dominio, descrito por sus métodos `get`/`save`) y un `FakeStore` (una implementación de mentira, útil para tests) en memoria que cumple el contrato por forma. Sigue `upsert`: depende del puerto, no de una clase base pesada. Predice el dict de `E9` en la salida. El adapter real (la implementación concreta que habla con la base de datos) llega en S12.",
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
        why: "Duck typing estructural (si camina como pato y nada como pato, es pato, sin pedir herencia): el service depende del Protocol (puerto), no de una clase base pesada. Fakes de test sin mock frameworks (librerías que sustituyen objetos por dobles controlados). El adapter SQL llega en S12 sin reescribir reglas del dominio.",
        retrospective:
          "Puerto = contrato; adapter = detalle. Si el fake funciona, el dominio es testeable offline. We Do: renombrar método al contrato, inyectar normalizers, y decidir cuándo *no* introducir Protocol (YAGNI).",
      },
      {
        demoId: "S11-T4-A-DEMO",
        subtopicId: "S11-T4-A",
        environment: "local-python",
        description: "InMemoryClientRepository + service que no decide fraude.",
        preamble:
          "La CLI de S10 no debe cargar las reglas de negocio: un `ClientService` (una capa que orquesta reglas de dominio) orquesta `register` sobre un repo en memoria (un repositorio, que es un patrón que aísla el acceso al almacén de datos) y devuelve un dict de borde. Observa que **no** existe `is_fraud` en el service. Predice el dict de Ana y `has_is_fraud False`. I/O de archivos (entrada/salida) y argparse (el módulo de Python que parsea argumentos de línea de comandos) quedan fuera del núcleo.",
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
        why: "El service orquesta construcción y persistencia, y devuelve un dict de borde (lo que sale del dominio hacia afuera). No imprime ni parsea argparse porque eso es CLI. `to_dict` elige el export, no es el invariante del tipo. La ausencia de `is_fraud` en el service no es detalle de estilo: es el límite del núcleo CP-N1-C antes de los tests éticos de T4-B.",
        retrospective:
          "Persistencia ligera + ausencia deliberada de veredictos = dominio listo para tests puros. We Do: `to_dict` sin nota interna, repo save/get, y capas cli/service/domain como tipos.",
      },
      {
        demoId: "S11-T4-B-DEMO",
        subtopicId: "S11-T4-B",
        environment: "local-python",
        description: "Tests de RelationshipEvidence: solo señales; sin is_fraud().",
        preamble:
          "Un test (una prueba automática que verifica una propiedad del código) que verifica la **ausencia** de `is_fraud` / `is_related_family` no es adorno: fija el límite ético del producto de matching. Sigue las dos funciones: score en rango y no-APIs de veredicto (es decir, que no existan métodos que emitan veredictos de fraude o parentesco). Predice dos `pass`. Fixtures sintéticos (datos de prueba predefinidos); sin red ni DB.",
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
        why: "La suite de dominio (el conjunto de pruebas del dominio) codifica dos promesas: el score vive en un rango usable y **no** existen APIs de veredicto (`is_fraud`, `is_related_family`). Un `hasattr` en test (la función que pregunta si un objeto tiene un atributo) no es adorno: documenta el límite ético del matching en código ejecutable. Fixtures sintéticos y cero I/O (entrada/salida) mantienen el feedback local y CI-rápido (integración continua rápida, que ejecuta tests en cada cambio).",
        retrospective:
          "Si el test de “no existe el método” pasa, el diseño resiste la tentación del veredicto fácil. We Do: test de rechazo real, fake repo con asserts, y extraer `decide_fraud` del dominio.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje **E1 guiado → E2 independiente → E3 transferencia** por 8 subtemas (24 ejercicios, 2 pistas cada uno). Cada starter (el código de arranque del ejercicio, con un defecto escondido) trae **un defecto deliberado** (lista mutable por defecto, monto en `float`, herencia forzada, `Protocol` mal nombrado, etc.) para que lo localices y corrijas. Solo tests de dominio (pruebas del modelo, sin tocar red ni DB). Datos sintéticos PE (`C00x`, `@ejemplo.pe`).",
    steps: [
      {
        id: "S11-T1-A-E1",
        subtopicId: "S11-T1-A",
        kind: "guided",
        title: "ClientRecord con emails y default_factory",
        preamble:
          "- **Contexto:** en el registro de cliente del matching local, cada `ClientRecord` necesita su propia lista de emails.\n- **Meta:** completar la dataclass canónica y eliminar el default mutable.\n- **Éxito:** un `repr` `ClientRecord(...)` con `emails=['ana@ejemplo.pe']`.\n- **Límites:** solo stdlib; no uses `emails=[]` como default; datos sintéticos `C001` / `@ejemplo.pe`.",
        instruction:
          "1. Abre el starter: `emails: list = []` es el defecto (lista compartida).\n2. Importa `field` y tipa `emails: list[str] = field(default_factory=list)`.\n3. Instancia con `C001`, `DNI-1`, `Ana Pérez` y el email de demo.\n4. Imprime el objeto (sin texto extra).",
        hint: "Usa field(default_factory=list) para emails.",
        hints: [
          "Usa field(default_factory=list) para emails.",
          "Instancia con C001, DNI-1, Ana Pérez y un email @ejemplo.pe.",
        ],
        edgeCases: ["default=[] sería mutable compartido"],
        tests: "Salida: un repr `ClientRecord(...)` con emails=['ana@ejemplo.pe']; no uses emails=[].",
        feedback:
          "Si dos instancias comparten la misma lista al mutar emails, el default se evaluó una sola vez. `field(default_factory=list)` crea una lista **nueva** por instancia — base del schema canónico de ClientRecord.",
        retrospective:
          "Default mutable es el bug más caro en dataclasses de dominio: la lista se evalúa **una** vez y se comparte. El error clásico es “funciona en la primera instancia”. El mismo patrón reaparece en listas de evidencias (T3-A). Siguiente: montos con `Decimal` desde texto, no `float`.",
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
        title: "Transaction con Decimal y moneda PEN",
        preamble:
          "- **Contexto:** en el dominio de familiaridad, un monto de transacción es valor de negocio, no un `float` de demo.\n- **Meta:** modelar `Transaction` con `Decimal` desde texto y `currency` obligatoria.\n- **Éxito:** repr con `amount=Decimal('150.50')` y `currency='PEN'`.\n- **Límites:** solo stdlib; no construyas el monto desde `float`; sin web/ORM.",
        instruction:
          "1. Cambia el tipo de `amount` de `float` a `Decimal`.\n2. Importa `Decimal` y construye con `Decimal(\"150.50\")`.\n3. Mantén `tx_id`, `client_id`, `currency` obligatorios (sin defaults).\n4. Imprime la instancia; no llames `float()`.",
        hint: "Importa Decimal; sin defaults en campos obligatorios.",
        hints: [
          "Importa Decimal; sin defaults en campos obligatorios.",
          "Crea Decimal('150.50'); nunca lo construyas desde float.",
        ],
        edgeCases: ["currency PEN", "dos decimales", "sin float"],
        tests: "Contrato exacto: repr con amount=Decimal('150.50') y currency='PEN'; el código no llama float().",
        feedback:
          "Money de negocio se construye con `Decimal(\"150.50\")` desde texto. Pasar por `float` introduce ruido binario que luego rompe comparaciones y quantize en las invariantes de T1-B. Los campos obligatorios sin default obligan a nombrar moneda y monto en cada alta.",
        retrospective:
          "Money en dominio se construye desde texto para evitar ruido binario. El mismo rigor de tipo prepara las invariantes de T1-B (positivo, 2 decimales, allowlist PEN/USD).",
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
        title: "from_dict classmethod que devuelve ClientRecord",
        preamble:
          "- **Contexto:** el borde de onboarding recibe un dict (JSON/CLI) y debe producir un `ClientRecord`, no reenviar el dict.\n- **Meta:** corregir `from_dict` a `@classmethod` que construye con `cls(...)`.\n- **Éxito:** una línea `ClientRecord C007`.\n- **Límites:** solo stdlib; no devuelvas el dict crudo; emails con `list(d.get(\"emails\", []))`.",
        instruction:
          "1. El starter define `from_dict` sobre `self` y devuelve `d` — ese es el defecto.\n2. Conviértelo en `@classmethod` que lea las keys canónicas.\n3. Llama `ClientRecord.from_dict(raw)` (sin instancia dummy).\n4. Imprime `type(c).__name__` y `c.client_id`.",
        hint: "classmethod from_dict que devuelve cls(...); emails con list(d.get('emails', [])).",
        hints: [
          "classmethod from_dict que devuelve cls(...); emails con list(d.get('emails', [])).",
          "Imprime el tipo y el client_id.",
        ],
        edgeCases: ["KeyError si falta campo — aceptable o validar en T1-B"],
        tests: "Una línea: `ClientRecord C007`. `from_dict` es `@classmethod` y devuelve instancia, no el dict crudo.",
        feedback:
          "`from_dict` en la **clase** es el borde reutilizable (CLI, repo, tests). Si el método vive en la instancia o devuelve el dict crudo, el “dominio” nunca nace: solo reenvías basura JSON con otro nombre.",
        retrospective:
          "Factory en la clase = borde reutilizable en repo y tests. Devolver el dict “porque ya está” salta el dominio. En T1-B validarás que lo construido no acepte ids vacíos.",
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
        title: "Transaction rechaza cero y EUR",
        preamble:
          "- **Contexto:** en el núcleo de dominio, un monto inválido o una moneda fuera de allowlist no debe circular.\n- **Meta:** imponer invariantes en `__post_init__` (Decimal > 0, 2 decimales, PEN/USD).\n- **Éxito:** tres líneas — repr PEN válido; `reject amount debe ser > 0`; `reject currency no soportada`.\n- **Límites:** sin conversión PEN→USD; sin float; solo stdlib.",
        instruction:
          "1. Añade `__post_init__` al starter (hoy acepta todo).\n2. Valida tipo Decimal, `amount > 0`, quantize a `0.01`, currency en `{\"PEN\",\"USD\"}`.\n3. Imprime el caso ok; captura `ValueError` en cero y EUR.\n4. Prefija rechazos con `reject`.",
        hint: "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
        hints: [
          "__post_init__: isinstance Decimal, quantize(0.01), allowlist de currency.",
          "Muestra ok PEN y rechazos por cero y EUR.",
        ],
        edgeCases: ["amount negativo", "float prohibido", "currency minúscula", "EUR fuera del allowlist"],
        tests: "Tres líneas: repr PEN válido; `reject amount debe ser > 0`; `reject currency no soportada`.",
        feedback:
          "Fail-closed: cero y EUR mueren al construir. No conviertas moneda en el constructor ni “arregles” el monto a 0.01: el allowlist PEN/USD es política de producto local, no un cast mágico de Python.",
        retrospective:
          "Fail-closed en money evita “arreglos” de moneda en el constructor. El allowlist es política de producto local, no un tipo mágico de Python. Siguiente: validar ids en `from_dict`.",
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
        title: "from_dict rechaza document_id en blanco",
        preamble:
          "- **Contexto:** al rehidratar un cliente desde dict, un `document_id` de solo espacios es basura disfrazada.\n- **Meta:** validar `client_id` y `document_id` no vacíos tras `strip`.\n- **Éxito:** repr ok de C1/D1; luego mensaje `document_id vacío`.\n- **Límites:** forma reducida a propósito (no emails); solo stdlib; lanza `ValueError`.",
        instruction:
          "1. En `from_dict`, haz `strip` de ambos campos.\n2. Si alguno queda vacío, lanza `ValueError` con mensaje claro.\n3. Imprime el caso válido.\n4. Captura el caso `\" \"` e imprime el error (sin traceback crudo si usas try).",
        hint: "Lanza `ValueError` con mensaje claro tras `strip`.",
        hints: [
          "Lanza `ValueError` con mensaje claro tras `strip`.",
          "Prueba ok y fail con document_id de solo espacios.",
        ],
        edgeCases: ["strip evita espacios como id válido"],
        tests: "Dos líneas: ClientRecord(C1, D1) válido; luego `document_id vacío` para el caso de solo espacios.",
        feedback:
          "`strip` en el borde evita ids “válidos” que son solo espacios: basura visual que luego rompe joins y sets. Lanza `ValueError` con mensaje claro; no “arregles” el documento a un default silencioso.",
        retrospective:
          "`strip` en el borde evita ids “válidos” que son basura visual. Misma regla que en `__post_init__` del I Do. Luego: `validate()` que devuelve lista (otro estilo de reporte de errores).",
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
        title: "validate() devuelve lista de errores",
        preamble:
          "- **Contexto:** a veces la UI necesita *todos* los problemas de un registro, no solo el primero que lanza.\n- **Meta:** implementar `validate() -> list[str]` (vacía si ok).\n- **Éxito:** `['client_id vacío', 'document_id vacío']` y luego `[]`.\n- **Límites:** no lances excepción en `validate`; no inventes veredictos de fraude; solo stdlib.",
        instruction:
          "1. El starter siempre devuelve `[]` — rellena las reglas con `strip`.\n2. Acumula mensajes en una lista.\n3. Imprime `bad.validate()` y `good.validate()`.\n4. No conviertas esto en `is_fraud`.",
        hint: "No lances excepción: acumula mensajes en una list.",
        hints: [
          "No lances excepción: acumula mensajes en una list.",
          "strip() antes de comprobar vacío.",
        ],
        edgeCases: ["Invariantes de negocio ≠ veredictos de fraude"],
        tests: "Dos líneas: lista con errores de ambos ids vacíos; luego `[]` para el registro válido.",
        feedback: "validate() que devuelve lista es reutilizable en UI/API; __post_init__ puede lanzar si prefieres fail-closed.",
        retrospective:
          "Lista de errores = reporte reutilizable; `__post_init__` = fail-closed. Ambos viven en el dominio; ninguno emite fraude. En T2-A pasarás de validar estado a exponer consultas seguras con properties.",
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
        title: "Property full_name en PersonName",
        preamble:
          "- **Contexto:** entrenas `@property` en un value object de nombre, separado del schema de cliente.\n- **Meta:** exponer `full_name` calculado (nombre + apellido) sin campo duplicado.\n- **Éxito:** una línea `Ana Pérez` accedida **sin** paréntesis.\n- **Límites:** solo stdlib; no guardes `full_name` como campo; no uses setter aquí.",
        instruction:
          "1. El starter usa `def full_name(self)` y orden invertido — corrige ambos.\n2. Marca `@property` y concatena `first_name` + espacio + `last_name`.\n3. Imprime `.full_name` (sin `()`).\n4. No almacenes el string completo en el dataclass.",
        hint: "@property sin setter.",
        hints: [
          "@property sin setter.",
          "Imprime `full_name` (sin paréntesis), no `full_name()`.",
        ],
        edgeCases: ["No guardar full_name duplicado si se puede calcular"],
        tests: "Una línea: `Ana Pérez`. Debe ser @property (acceso sin paréntesis), orden nombre+apellido.",
        feedback:
          "Si llamas `full_name()` con paréntesis, no estás usando `@property`: es un método normal. El orden apellido-primero del starter es un bug de presentación fácil de “casi pasar” si solo miras que imprime algo.",
        retrospective:
          "Property = campo virtual calculado; no guardes `full_name` duplicado si se deriva de `first`+`last`. Acceso sin `()` es el contrato. Siguiente: consulta pura con argumento validado (`age_days_since`), sin mutar estado.",
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
        title: "age_days_since como consulta pura",
        preamble:
          "- **Contexto:** en demos sin `datetime`, un día entero basta para practicar consultas de edad del registro.\n- **Meta:** implementar `age_days_since(day)` que valida y calcula sin mutar.\n- **Éxito:** `15` (día 25 − creación 10) y `reject día anterior a creación`.\n- **Límites:** no mutes `day_created`; no llames red/disco; solo stdlib.",
        instruction:
          "1. El starter resta al revés y no valida — localiza ambas fallas.\n2. Si el día dado es menor que el de creación, lanza `ValueError`.\n3. Si no, devuelve la diferencia entre ambos.\n4. Imprime el ok; captura el reject con prefijo `reject`.",
        hint: "Si el día dado es menor que el día de creación, lanza `ValueError`; si no, devuelve la diferencia entre ambos.",
        hints: [
          "Si el día dado es menor que el día de creación, lanza `ValueError`; si no, devuelve la diferencia entre ambos.",
          "No mutes `day_created`; no llames a red ni a disco.",
        ],
        edgeCases: ["En prod usa date/datetime; aquí simplificamos a int de demo.", "Día anterior a creación es fail-closed."],
        tests: "Dos líneas: `15` y `reject día anterior a creación`. Consulta pura: no inviertas la resta.",
        feedback: "Métodos de consulta (funciones que solo leen, sin modificar) no mutan ni llaman a red; validan el argumento y calculan. El orden de la resta importa: invertirla produce un número negativo que “casi” pasa los tests.",
        retrospective:
          "Consulta pura = argumento válido + cálculo, sin side-effects. Invertir la resta es un bug silencioso que “casi” pasa tests. Luego: mutación controlada con setter de score.",
        starterCode: {
          language: 'python',
          title: "age_days.py",
          code: `# CASO-LIM-011 · age_days_since
# DEFECT: day_created - day invertido; no valida día anterior
from dataclasses import dataclass

@dataclass
class Transaction:
    tx_id: str
    day_created: int

    def age_days_since(self, day: int) -> int:
        return self.day_created - day

t = Transaction("T1", 10)
print(t.age_days_since(25))
print(t.age_days_since(5))
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
        if day < self.day_created:
            raise ValueError("día anterior a creación")
        return day - self.day_created

t = Transaction("T1", 10)
print(t.age_days_since(25))
try:
    t.age_days_since(5)
except ValueError as e:
    print("reject", e)`,
          output: `15
reject día anterior a creación`,
        },
      },
      {
        id: "S11-T2-A-E3",
        subtopicId: "S11-T2-A",
        kind: "transfer",
        title: "Setter de score finito en [0, 1]",
        preamble:
          "- **Contexto:** un score de señal puede mutar en un objeto de trabajo, pero nunca fuera de [0, 1] ni con NaN/inf.\n- **Meta:** validar en el setter de `score` con `isfinite` y rango.\n- **Éxito:** `ok 0.4`; `reject score fuera de rango`; `reject_nan score fuera de rango`.\n- **Límites:** no “recortes” silenciosos a 1.0; score no es veredicto de fraude; solo stdlib.",
        instruction:
          "1. En el setter, convierte a float y valida.\n2. Rechaza no finitos y fuera de [0, 1] con el mismo mensaje.\n3. Caso ok 0.4; try/except en 1.5 y NaN.\n4. Prefijos `ok`, `reject` y `reject_nan` según el contrato.",
        hint: "Property score + math.isfinite antes del rango.",
        hints: [
          "Property score + math.isfinite antes del rango.",
          "Muestra ok y rechaza 1.5 y NaN.",
        ],
        edgeCases: ["NaN", "Infinity", "score es señal, no veredicto"],
        tests: "Tres líneas: `ok 0.4`; `reject score fuera de rango`; `reject_nan score fuera de rango`.",
        feedback:
          "NaN e inf no son scores válidos: `isfinite` + rango [0, 1] **antes** de guardar. No “recortes” 1.5 a 1.0 en silencio: eso esconde basura en el pipeline de matching.",
        retrospective:
          "NaN no es “casi 0”: rompe comparaciones. Validar en el setter evita basura en el pipeline de matching. En T2-B la mutabilidad se vuelve más peligrosa: identidad y hash.",
        starterCode: {
          language: 'python',
          title: "score_setter.py",
          code: `# CASO-LIM-011 · score setter [0, 1]
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
        title: "ResolvedEntity frozen solo por entity_id",
        preamble:
          "- **Contexto:** el set de resolución local colapsa entidades por id estable, no por el nombre mostrado.\n- **Meta:** `frozen=True` + `display_name` con `compare=False`.\n- **Éxito:** `True False` y tamaño de set `2`.\n- **Límites:** no uses `document_id` en la igualdad; solo stdlib; id vacío se rechaza.",
        instruction:
          "1. El starter compara también el nombre — por eso el set no colapsa bien.\n2. Aplica `frozen=True` y `field(compare=False)` en `display_name`.\n3. Opcional: `__post_init__` que rechace id vacío.\n4. Imprime `a == b, a == c` y `len({a, b, c})`.",
        hint: "dataclass(frozen=True) + field(compare=False) en display_name.",
        hints: [
          "dataclass(frozen=True) + field(compare=False) en display_name.",
          "Dos E1 con nombres distintos son iguales; E2 no lo es.",
        ],
        edgeCases: ["entity_id vacío se rechaza en demos de teoría/I Do", "document_id nunca participa en identidad"],
        tests: "Dos líneas: `True False` (E1==E1 y E1!=E2) y `2` (tamaño del set con dos E1 + un E2).",
        feedback: "La identidad estable es entity_id; etiquetas visibles pueden corregirse sin romper el set.",
        retrospective:
          "Etiqueta visible (`display_name`) puede corregirse sin romper el set: identidad ≠ presentación. El error clásico es meter `document_id` o el nombre en la igualdad y “perder” entidades al relabel. Siguiente: evidencias frozen en un set (dedup exacto del triple).",
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
        title: "Set de Evidence frozen colapsa duplicados",
        preamble:
          "- **Contexto:** en el almacén de señales, el mismo triple (left, right, score) no debe contar dos veces.\n- **Meta:** hacer `Evidence` hasheable (que se puede usar como clave en un set o dict) de forma estable con `frozen`.\n- **Éxito:** una línea `2` (duplicado exacto + un par distinto).\n- **Límites:** solo stdlib; no implementes `__hash__` a mano si `frozen` basta.",
        instruction:
          "1. El starter no es frozen: el set no colapsa valores iguales.\n2. Marca `@dataclass(frozen=True)`.\n3. Mantén los tres elementos del set.\n4. Imprime solo `len(s)`.",
        hint: "frozen=True dataclass.",
        hints: [
          "frozen=True dataclass.",
          "Imprime len del set con duplicado.",
        ],
        edgeCases: ["Duplicado exacto colapsa en set"],
        tests: "Una línea: `2`. Sin frozen, el set no colapsa duplicados de valor.",
        feedback: "frozen + eq por campos habilita sets de evidencias sin claves inestables (claves cuyo hash podría cambiar en runtime).",
        retrospective:
          "Frozen + eq por campos = set de value objects sin keys inestables. Sin frozen, Python no trata dos “iguales” mutables como el mismo en un set. Luego: el anti-patrón de mutar la key de un dict.",
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
        title: "Key mutable vs FrozenEntity en dict",
        preamble:
          "- **Contexto:** usar una entidad mutable como key de dict (clave de diccionario) es un bug clásico de matching en memoria.\n- **Meta:** demostrar que tras mutar la key ya no encuentras la entrada ni buscándola con los valores originales, y contrastar con la versión frozen.\n- **Éxito:** `BUG lookup_after_mutate None` y `SAFE row`.\n- **Límites:** no “arregles” el mutable con hacks; muestra el contraste; solo stdlib.",
        instruction:
          "1. Conserva el bloque mutable que muta `name` tras insertar.\n2. Busca la entrada con los mismos valores con que la guardaste — `d.get(MutableEntity('E1', 'Ana'))` — y observa que devuelve `None`.\n3. Añade `FrozenEntity` frozen e inserta/lookup con la misma identidad.\n4. Imprime las dos líneas con prefijos `BUG` y `SAFE`.",
        hint: "Imprime BUG y SAFE.",
        hints: [
          "Imprime BUG y SAFE.",
          "Con mutable: cambiar campo rompe lookup.",
        ],
        edgeCases: ["No implementes __hash__ en mutables"],
        tests: "Dos líneas: `BUG lookup_after_mutate None` y `SAFE row`.",
        feedback:
          "Si el hash depende de un campo mutable, al mutar cambias el hash pero la entrada sigue archivada bajo el hash viejo: la buscas con los valores originales, el dict va al lugar correcto y la comparación falla porque el objeto guardado ya no vale lo mismo. El resultado es `None` aunque el objeto siga en memoria. Frozen cierra esa puerta: misma identidad ⇒ mismo bucket (la ranura interna del dict donde se guarda el valor).",
        retrospective:
          "Si el hash depende de un campo mutable, el dict “pierde” la entrada. Frozen cierra esa puerta. En T3-A agruparás entidades y evidencias con composición, no con herencia forzada.",
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
print("BUG lookup_after_mutate", d.get(MutableEntity("E1", "Ana")))
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
print("BUG lookup_after_mutate", d.get(MutableEntity("E1", "Ana")))

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
        title: "Client tiene PersonInfo (composición)",
        preamble:
          "- **Contexto:** reutilizar un nombre no justifica `Client` como subtipo de `PersonInfo`.\n- **Meta:** modelar has-a: `Client` con campo `person`.\n- **Éxito:** `C001 Ana` y `design=composition`.\n- **Límites:** no heredes de `PersonInfo`; solo stdlib.",
        instruction:
          "1. Quita la herencia en `Client`.\n2. Añade campo `person: PersonInfo`.\n3. Construye `Client(\"C001\", PersonInfo(\"Ana\", \"Pérez\"))`.\n4. Imprime `client_id` + `person.first_name` y la línea `design=composition`.",
        hint: "Construye `Client` con `client_id` y `person`, sin heredar de `PersonInfo`.",
        hints: [
          "Construye `Client` con `client_id` y `person`, sin heredar de `PersonInfo`.",
          "Imprime client_id y person.first_name; luego design=composition.",
        ],
        edgeCases: ["Composición permite cambiar PersonInfo sin romper Client."],
        tests: "Dos líneas exactas: `C001 Ana` y `design=composition` (no uses design=inheritance).",
        feedback: "La relación has-a (Client tiene PersonInfo) suele bastar; is-a forzado acopla jerarquías sin subtipo real.",
        retrospective:
          "is-a solo con subtipo real; has-a desacopla. Cambiar `PersonInfo` no rompe la identidad de `Client`. Siguiente: lista de evidencias sin default mutable.",
        starterCode: {
          language: 'python',
          title: "replace_inheritance.py",
          code: `# CASO-LIM-011 · composition
# DEFECT: herencia de PersonInfo; design=inheritance
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
        title: "CaseFile sin lista compartida entre casos",
        preamble:
          "- **Contexto:** cada expediente de matching debe nacer vacío, no heredar evidencias del anterior por accidente.\n- **Meta:** `evidences` con `field(default_factory=list)` y `add_evidence`.\n- **Éxito:** una línea `n= 2 empty 0`.\n- **Límites:** no uses `evidences=[]`; solo stdlib.",
        instruction:
          "1. El starter comparte la lista: CF2 “ve” lo de CF1.\n2. Cambia a `field(default_factory=list)`.\n3. Añade dos evidencias a CF1; crea CF2 limpio.\n4. Imprime el contrato exacto `n= 2 empty 0`.",
        hint: "Lista interna con default_factory, no = [].",
        hints: [
          "Lista interna con default_factory, no = [].",
          "Tras dos add en CF1, crea CF2 y muestra len(cf)=2 y len(cf2)=0.",
        ],
        edgeCases: ["Validar score en el value object, no solo en CaseFile", "default=[] comparte la misma lista entre instancias"],
        tests: "Contrato exacto: una línea `n= 2 empty 0` (CF1 con dos evidencias; CF2 sin contaminar).",
        feedback: "Si CF2 no arranca en 0, el default mutable compartió la lista entre expedientes — usa default_factory.",
        retrospective:
          "Default mutable en agregados contamina casos. Es el mismo principio de emails en ClientRecord, ahora en el grafo de evidencias. Luego: invariantes del value object de relación.",
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
        title: "Par canónico y score en RelationshipEvidence",
        preamble:
          "- **Contexto:** (E1,E2) y (E2,E1) no deben ser dos relaciones distintas en el matching local.\n- **Meta:** validar par canónico (`left_id < right_id`) y score finito en [0, 1].\n- **Éxito:** `n_ev 2` y `reject par no canónico`.\n- **Límites:** no implementes `is_family()`; no recortes scores en silencio; solo stdlib.",
        instruction:
          "1. Añade `__post_init__` con comparación lexicográfica (orden alfabético de strings) e `isfinite`.\n2. Agrega dos evidencias válidas (p. ej. E1-E2 y E1-E3).\n3. Intenta construir (E2,E1) y captura el reject.\n4. Imprime `n_ev` y `reject …`.",
        hint: "__post_init__ con isfinite y comparación lexicográfica de ids.",
        hints: [
          "__post_init__ con isfinite y comparación lexicográfica de ids.",
          "CaseFile.add recibe RelationshipEvidence ya validada.",
        ],
        edgeCases: ["(E2,E1) no es canónico si E1 < E2."],
        tests: "Dos líneas: `n_ev 2` y `reject par no canónico` (E2,E1 debe fallar al construir).",
        feedback:
          "El par canónico (`left_id < right_id`) es invariante de almacén: sin él, (E1,E2) y (E2,E1) cuentan dos veces. Valida score con `isfinite` y [0, 1]; no implementes `is_family()`.",
        retrospective:
          "Canonicidad no es estética: es clave de almacenamiento. Score es **dato de matching**, no parentesco legal. En T3-B desacoplarás el dominio de implementaciones concretas con Protocol (fakes primero, SQL en S12).",
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
        title: "FakeScorer cumple el método score del Protocol",
        preamble:
          "- **Contexto:** un fake (implementación de mentira) de scoring solo sirve si expone el **mismo** método que el puerto.\n- **Meta:** implementar `score` (no `compute`) para el par `(\"E1\",\"E2\")`.\n- **Éxito:** una línea `0.5`.\n- **Límites:** no instancies el Protocol; solo stdlib.",
        instruction:
          "1. El starter llama `compute` — renombra al contrato `score`.\n2. Tipa opcionalmente `s: Scorer = FakeScorer()`.\n3. Imprime `s.score((\"E1\", \"E2\"))`.\n4. No cambies la firma del Protocol.",
        hint: "Imprime el score de un par sintético.",
        hints: [
          "Imprime el score de un par sintético.",
          "typing.Protocol; el método debe llamarse score.",
        ],
        edgeCases: ["El Protocol no se instancia"],
        tests: "Una línea: `0.5`. El método del fake se llama `score`, no `compute`.",
        feedback:
          "Si el fake se llama `compute` y el puerto pide `score`, el duck typing (si camina como pato, es pato) **falla en silencio** hasta el call site (donde se llama al método) o hasta que el type checker lo detecte. Renombra el método; no “adaptes” el Protocol al fake.",
        retrospective:
          "El nombre del método *es* el contrato del puerto. Un fake con otro verbo no es intercambiable en tests ni en S12. Siguiente: inyectar políticas de normalización como callables, sin herencia.",
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
        title: "apply inyecta strip y casefold",
        preamble:
          "- **Contexto:** el dominio de matching no debe hardcodear una sola política de normalización de texto.\n- **Meta:** hacer que `apply(norm, text)` invoque el normalizer (el callable, que es cualquier objeto que se puede llamar como función) recibido.\n- **Éxito:** dos líneas `Ana` y `ana`.\n- **Límites:** no hardcodes strip dentro de `apply`; solo stdlib.",
        instruction:
          "1. El starter devuelve `text` e ignora el normalizer recibido — ese es el defecto.\n2. Haz que `apply` use el callable `norm` sobre `text` (sin hardcodear strip dentro de `apply`).\n3. Mantén los dos normalizers del fixture.\n4. Imprime ambos resultados (strip y casefold).",
        hint: "apply(norm, text) debe invocar el normalizer recibido, no devolver text crudo.",
        hints: [
          "apply(norm, text) debe invocar el normalizer recibido, no devolver text crudo.",
          "Imprime ambos resultados (strip y casefold).",
        ],
        edgeCases: ["Duck typing: cualquier callable sirve"],
        tests: "Dos líneas: `Ana` (strip) y `ana` (casefold).",
        feedback:
          "Inyectar el normalizer evita hardcodear una sola política de texto en el dominio. Si `apply` ignora `norm`, strip y casefold “funcionan” solo por casualidad del fixture, no por diseño.",
        retrospective:
          "Inyectar el callable evita acoplar una sola política. Es el mismo espíritu del Protocol, a escala de función. Luego: YAGNI — cuándo *no* crear un Protocol.",
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
        title: "Cuándo introducir Protocol (YAGNI)",
        preamble:
          "- **Contexto:** un Protocol “por si acaso” con una sola impl y sin fakes es ruido de diseño.\n- **Meta:** codificar `should_introduce_protocol` con reglas estables.\n- **Éxito:** tres líneas `WHEN_NOT: solo_una_impl`, `WHEN_NOT: api_inestable`, `INTRODUCE: dos_adapters_con_fake`.\n- **Límites:** etiquetas literales del contrato; solo stdlib.",
        instruction:
          "1. El starter siempre devuelve `True` — aplica las reglas de los hints.\n2. False si API inestable; False si <2 adapters y sin fake.\n3. Recorre los casos del fixture.\n4. Imprime `WHEN_NOT:` / `INTRODUCE:` + label.",
        hint: "False si (n_adapters < 2 y no has_fake_tests) o si not api_stable.",
        hints: [
          "False si (n_adapters < 2 y no has_fake_tests) o si not api_stable.",
          "Recorre la lista de casos y formatea WHEN_NOT:/INTRODUCE: + label.",
        ],
        edgeCases: ["Una sola impl sin fake → WHEN_NOT; API inestable → WHEN_NOT aunque haya 2 adapters."],
        tests: "Tres líneas: WHEN_NOT: solo_una_impl; WHEN_NOT: api_inestable; INTRODUCE: dos_adapters_con_fake.",
        feedback: "YAGNI: Protocol cuando hay ≥2 adapters o dobles de test y la API ya está estable. `WHEN_NOT` = no introduzcas; `INTRODUCE` = sí introduzcas.",
        retrospective:
          "Abstracción cuando hay al menos dos caminos o dobles de test **y** la API ya no baila. En T4-A el puerto se concreta en repo/service/serialización sin meter veredictos.",
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
        title: "to_dict omite internal_note del export",
        preamble:
          "- **Contexto:** el export al dashboard de evidencia no debe llevar notas de backoffice.\n- **Meta:** `to_dict` con client_id/document_id/full_name/emails únicamente.\n- **Éxito:** dict sin clave `internal_note` (aunque el objeto la tenga).\n- **Límites:** no modeles contraseñas en el agregado; copia emails con `list(...)`; solo stdlib.",
        instruction:
          "1. El starter serializa `internal_note` — quítalo del dict.\n2. Mantén los cuatro campos públicos.\n3. Usa `list(self.emails)` para no filtrar la lista interna.\n4. Imprime el `to_dict` del caso VIP de demo.",
        hint: "Aunque exista internal_note en el objeto, no lo serialices en to_dict.",
        hints: [
          "Aunque exista internal_note en el objeto, no lo serialices en to_dict.",
          "Copia emails con list(...) para no filtrar la lista interna.",
        ],
        edgeCases: ["Notas internas y secretos no pertenecen al export de matching; no modeles secretos en el agregado de familiaridad."],
        tests: "Un dict con client_id/document_id/full_name/emails; la clave internal_note no aparece.",
        feedback:
          "`to_dict` es borde de dashboard: elige qué sale. Aunque `internal_note` exista en el objeto, no va al export. Copia `list(self.emails)` para no filtrar la lista interna del agregado.",
        retrospective:
          "Serializar no es “vars(obj)”. El borde elige qué sale. Misma disciplina que no meter secretos en el agregado de familiaridad. Siguiente: repo en memoria.",
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
        title: "Repo en memoria: save y get por client_id",
        preamble:
          "- **Contexto:** el service necesita un repositorio mínimo para roundtrip (ida y vuelta: guardar y recuperar el mismo registro) de clientes sintéticos.\n- **Meta:** implementar `save`/`get` sobre un dict interno.\n- **Éxito:** `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}` tras save/get.\n- **Límites:** sin red/DB; `get` missing → `None`; solo stdlib.",
        instruction:
          "1. El starter guarda en `_d` pero `get` ignora el almacén (siempre `None`) — localiza ese defecto.\n2. Implementa `get` para recuperar el row por `client_id` (missing → `None`).\n3. Mantén la clave `client_id` del row en `save`.\n4. Imprime el roundtrip de C001 tras `save`/`get`.",
        hint: "Implementa `save` y `get`; este último debe consultar el almacén interno (missing → None).",
        hints: [
          "Implementa `save` y `get`; este último debe consultar el almacén interno (missing → None).",
          "Roundtrip de un client dict: save y luego get del mismo client_id.",
        ],
        edgeCases: ["get retorna None si no existe."],
        tests: "Una línea: dict C001 con email a@ejemplo.pe tras save/get.",
        feedback:
          "Repo light = diccionario con contrato `save`/`get`, sin red ni DB. Si `get` siempre devuelve `None`, el service no puede hacer roundtrip aunque `save` “parezca” correcto.",
        retrospective:
          "El service orquesta; el repo no conoce argparse ni print de negocio. Este fake es el mismo espíritu del Protocol de T3-B. Luego: clasificar capas cli / service / domain para no mezclar invariantes con I/O.",
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
        title: "Capas cli, service y domain",
        preamble:
          "- **Contexto:** mezclar print de negocio e invariantes en el service ensucia el núcleo.\n- **Meta:** clasificar tres capas (niveles de la arquitectura) con flags `may_print`, `may_parse_cli`, `holds_invariants`.\n- **Éxito:** tres líneas `LAYER: …` con cli print/cli True; service ambos False; domain inv=True.\n- **Límites:** service no imprime ni parsea CLI; solo domain sostiene invariantes; solo stdlib.",
        instruction:
          "1. Corrige el starter: service no imprime; domain sí sostiene invariantes.\n2. Mantén el orden cli → service → domain.\n3. Conserva el formato de `print` del fixture.\n4. No añadas capas extra.",
        hint: "service: may_print=False y may_parse_cli=False; domain: holds_invariants=True.",
        hints: [
          "service: may_print=False y may_parse_cli=False; domain: holds_invariants=True.",
          "cli puede print y parsear argv; no sostiene invariantes de dominio.",
        ],
        edgeCases: ["Logging de correlación puede colgarse del service sin print de negocio"],
        tests: "Tres líneas LAYER: cli print/cli True; service ambos False; domain inv=True y sin print/cli.",
        feedback:
          "La CLI puede imprimir y parsear argv; el service **no** imprime ni parsea; solo el domain sostiene invariantes. El starter invierte service/domain a propósito: corrige flags, no inventes una cuarta capa.",
        retrospective:
          "CLI habla con humanos; service orquesta; dominio guarda la verdad del negocio. Esa frontera es lo que habilita tests puros en T4-B sin red. Pregunta de auto-chequeo: ¿dónde pondrías un `print` de debug de producto? (CLI, no domain.)",
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
        title: "Test real: document vacío debe fallar",
        preamble:
          "- **Contexto:** los tests del dominio demuestran invariantes, no imprimen `pass` por cortesía.\n- **Meta:** rechazar `document_id` en blanco y hacer que el test solo pase si hay `ValueError`.\n- **Éxito:** una línea `pass`.\n- **Límites:** sin red/DB; forma reducida client_id+document_id; solo stdlib.",
        instruction:
          "1. Añade `__post_init__` que falle con strip vacío.\n2. En el test, usa try/except: si no lanza, `assert False`.\n3. Devuelve `\"pass\"` solo en el except correcto.\n4. Imprime el resultado del test.",
        hint: "Usa try/except ValueError y return 'pass'.",
        hints: [
          "Usa try/except ValueError y return 'pass'.",
          "print del resultado del test.",
        ],
        edgeCases: ["Tests puros: sin I/O de red"],
        tests: "Una línea: `pass`. El test solo pasa si document vacío lanza ValueError.",
        feedback:
          "Si el test devuelve `\"pass\"` sin forzar el rechazo, apruebas un dominio roto. El `try/except` solo cuenta si **sin** `__post_init__` el assert de “debía fallar” te detiene.",
        retrospective:
          "Teatro de tests = falsa seguridad en el gate. Un test de invariante demuestra el `ValueError`, no imprime cortesía. Siguiente: tres tests de service con fake repo y asserts de verdad (register / get / missing).",
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
        title: "Tres tests puros con FakeRepo",
        preamble:
          "- **Contexto:** el service de dominio se prueba con un repo en memoria, no con magia de mocks (dobles controlados por una librería de testing).\n- **Meta:** `register`, `get` existente y `get` missing con asserts reales (verificaciones con `assert` que confirman una propiedad).\n- **Éxito:** tres líneas `pass`.\n- **Límites:** sin red/DB; el fake implementa save/get de verdad; solo stdlib.",
        instruction:
          "1. Haz que `FakeRepo.save` guarde en `self.d` y `get` recupere.\n2. `Service.register` debe persistir y devolver el row.\n3. Cada test hace assert y luego imprime `pass`.\n4. Missing: `get(\"X\") is None`.",
        hint: "Service simple con repo inyectado; asserts reales.",
        hints: [
          "Service simple con repo inyectado; asserts reales.",
          "Imprime pass x3.",
        ],
        edgeCases: ["Fake no es mock mágico: es implementación en memoria."],
        tests: "Tres líneas `pass` (register, get existente, get missing). Asserts reales, no prints vacíos.",
        feedback:
          "Fake en memoria + asserts **antes** del `print(\"pass\")` = suite de dominio (el conjunto de pruebas del dominio) sin red ni DB. Tres `pass` impresos sin assert son el mismo teatro que E1, solo más ruidoso.",
        retrospective:
          "Fake = implementación simple del puerto. Assert antes del print evita teatro. Luego: extraer el anti-patrón de veredicto del dominio.",
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
        title: "Extraer decide_fraud; dejar solo signal_score",
        preamble:
          "- **Contexto:** un método `decide_fraud` en el dominio de familiaridad es un riesgo de producto y de ética.\n- **Meta:** mostrar el ANTES, modelar evidencia con score, y assert de ausencia de APIs de veredicto (métodos que emiten un fallo legal o de parentesco).\n- **Éxito:** `ANTES has_decide_fraud True` y `DESPUES signal_score 0.95 has_decide_fraud False`.\n- **Límites:** no implementes `is_family`; umbrales de producto viven fuera; solo stdlib.",
        instruction:
          "1. Conserva el print ANTES sobre `Client.decide_fraud`.\n2. Define `RelationshipEvidence` frozen con ids + `signal_score`.\n3. Assert `not hasattr` de decide_fraud/is_fraud/is_related_family.\n4. Imprime DESPUES con el score 0.95 y `has_decide_fraud False` sobre la clase de evidencia.",
        hint: "Borra el método de veredicto; el score vive en el value object de evidencia.",
        hints: [
          "Borra el método de veredicto; el score vive en el value object de evidencia.",
          "Usa hasattr sobre la clase final, no sobre la versión defectuosa.",
        ],
        edgeCases: ["Umbrales de producto y revisión humana viven fuera del modelo de dominio"],
        tests: "Dos líneas: `ANTES has_decide_fraud True` y `DESPUES signal_score 0.95 has_decide_fraud False`.",
        feedback:
          "Scores son datos de matching; `decide_fraud` / `is_family` no viven en el dominio de familiaridad. El print ANTES documenta el anti-patrón; el DESPUES debe mirar `hasattr` sobre la evidencia (o el diseño final), no dejar el veredicto colgando del mismo tipo.",
        retrospective:
          "Scores son datos; veredictos son frontera humana/producto. Ese límite es el gate CP-N1-C. En You Do integrarás los cuatro tipos con tests que lo demuestren de punta a punta.",
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
      "Implementas el núcleo de **CP-N1-C**: `ClientRecord`, `ResolvedEntity`, `Transaction` y `RelationshipEvidence` con invariantes (reglas que el objeto siempre cumple), serialización (conversión a dict plano) y repo en memoria (un repositorio que guarda los objetos en un diccionario). **Ninguna clase decide fraude o parentesco.**",
    objectives: [
      "Implementar ClientRecord, ResolvedEntity, Transaction, RelationshipEvidence",
      "Invariantes en construcción y equality consciente (igualdad que decide si dos objetos son 'el mismo')",
      "Ningún método is_fraud / is_related_family: los scores no son veredicto de fraude ni parentesco.",
      "Serialización + repositorio en memoria",
      "Tests unitarios del dominio con datos sintéticos",
    ],
    requirements: [
      "Cuatro tipos explícitos con type hints (anotaciones de tipo que indican qué valores admite cada campo)",
      "Scores solo como campos de datos si existen — no veredictos",
      "ResolvedEntity usa entity_id estable para eq/hash (igualdad y hash); display_name y document_id no definen identidad",
      "Transaction.amount es Decimal positivo con 2 decimales y currency está en {'PEN', 'USD'}",
      "RelationshipEvidence usa ids distintos en orden canónico (forma única de ordenar el par) y score finito en [0, 1]",
      "README de límites del modelo",
      "Tests del dominio puros (sin red/DB)",
      "Datos sintéticos ejemplo.pe / C00x",
      "Service sin side-effects de CLI (efectos colaterales que tocan el mundo exterior)",
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
      "Entrega: diagrama textual de las cuatro entidades, lista de invariantes (fail-closed, que falla al construir si algo no cuadra), README de límites éticos (sin `is_fraud`/`is_family`) y salida `tests_pass` del oráculo (la función de prueba que solo imprime `tests_pass` cuando todo está correcto). Datos solo sintéticos (`@ejemplo.pe` / `C00x`). Contrasta en el README qué cambiaría con datos reales vs sintéticos (PII, logs, export).",
    rubric: [
      { criterion: "Alineación al gate CP-N1-C y a los objetivos de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con el oráculo `tests_pass` (vacíos, Decimal, par canónico, ausencia de `is_fraud`)? (2) ¿qué harías distinto con datos reales vs sintéticos `@ejemplo.pe` (PII, logs, export)? (3) Escribe en el README una frase de impacto medible (antes: dicts anónimos / después: tipos con fail-closed) que puedas defender en 30 segundos ante un revisor de producto.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué `field(default_factory=list)` y no `= []`?",
        options: ["Permite que el valor por defecto dependa de otros campos", "Hace que la lista sea inmutable dentro de la instancia", "Evita el default mutable compartido entre instancias", "Evita copiar la lista cada vez que se crea un objeto"],
        correctIndex: 2,
        explanation:
          "Un default `[]` se evalúa una sola vez: todas las instancias comparten la misma lista. `default_factory=list` crea una lista nueva por instancia.",
      },
      {
        question: "RelationshipEvidence.signal_score representa…",
        options: ["Una señal/dato numérico, no un veredicto de fraude o familia", "La probabilidad calibrada de que la relación exista", "Un umbral ya aplicado, por eso viene entre 0 y 1", "El número de evidencias que respaldan la relación"],
        correctIndex: 0,
        explanation:
          "En matching de familiaridad el score es evidencia numérica. El dominio no emite parentesco legal ni fraude; eso queda fuera del núcleo CP-N1-C.",
      },
      {
        question: "Un Protocol EntityStore sirve para…",
        options: ["Comprobar en ejecución que el adaptador implementa get y save", "Definir un puerto get/save implementable por dobles de prueba y adaptadores", "Heredar una implementación por defecto de get y save", "Obligar a que todos los adaptadores compartan una clase base"],
        correctIndex: 1,
        explanation:
          "Protocol describe un puerto estructural (un punto de extensión del dominio descrito por la forma de sus métodos): FakeStore en tests y adapter SQL en S12 pueden implementar get/save sin heredar de una ABC pesada (una clase base abstracta, más rígida que un Protocol).",
      },
      {
        question: "Objeto inválido: ¿cuándo fallar?",
        options: ["Al serializar, que es cuando el objeto sale del sistema", "En la primera lectura del campo, para no pagar el costo si no se usa", "En el borde de la CLI, para poder dar un mensaje amable", "En la construcción (__post_init__/validate)"],
        correctIndex: 3,
        explanation:
          "Fail-closed al construir evita un ClientRecord o Transaction inválido circulando por el set de resolución.",
      },
      {
        question: "Client hereda de PersonInfo…",
        options: ["Conviene cuando Client necesita todos los campos de PersonInfo", "Conviene si PersonInfo no va a cambiar de forma nunca más", "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar", "Conviene porque evita repetir los validadores en las dos clases"],
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
        note: "Protocols vs. ABC",
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
