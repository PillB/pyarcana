
# ========== S11 ==========

def s11_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 2, "field(default_factory=list) evita default mutable compartido entre instancias."),
            sc(1, 0, "signal_score es senal numerica, no veredicto de fraude o familia."),
            sc(2, 1, "Protocol EntityStore define puerto get/save para fakes y adapters."),
            sc(3, 3, "Objeto invalido debe fallar en construccion (__post_init__/validate)."),
            sc(4, 2, "Herencia Client(Person) suele ser fragil; composicion basta."),
            sc(5, 0, "Dominio no debe tener is_fraud() automatico."),
        ]
    return [
        sc(0, 2, "dataclass default_factory del paquete OOP."),
        sc(1, 0, "RelationshipEvidence es evidencia no veredicto."),
        sc(2, 1, "Puerto hexagonal EntityStore."),
        sc(3, 3, "Fail fast en construccion."),
        sc(4, 2, "Composicion sobre herencia profunda."),
        sc(5, 0, "Prohibido auto-fraude en dominio de familiaridad."),
    ]

def s11_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S11-T1-A-E1', 'from dataclasses import dataclass, field\n@dataclass\nclass Bag:\n    items: list = field(default_factory=list)\na, b = Bag(), Bag()\na.items.append(1)\nprint(a.items, b.items)\n', 'default_factory evita lista compartida.' if A else 'a=[1] b=[].', ['dataclass']))
    out.append(ex('S11-T1-A-E2', 'from dataclasses import dataclass\n@dataclass\nclass Person:\n    name: str\n    doc: str\nprint(Person("Ana", "D1"))\n', 'dataclass basica Person.' if A else 'campos tipados.', ['Person']))
    out.append(ex('S11-T1-A-E3', 'from dataclasses import dataclass\n@dataclass\nclass Person:\n    name: str\n    def __post_init__(self):\n        if not self.name.strip():\n            raise ValueError("name vacio")\nprint(Person("Ana"))\n', 'valida en __post_init__.' if A else 'fail en construccion.', ['post_init']))
    out.append(ex('S11-T1-B-E1', 'from dataclasses import dataclass\n@dataclass\nclass RelationshipEvidence:\n    signal_score: float\n    kind: str\ne = RelationshipEvidence(0.4, "shared_phone")\nprint(e.signal_score, "not_verdict")\n', 'signal_score es senal no veredicto.' if A else 'kind etiquetado.', ['evidence']))
    out.append(ex('S11-T1-B-E2', 'from dataclasses import dataclass\n@dataclass\nclass RelationshipEvidence:\n    signal_score: float\n    def as_dict(self):\n        return {"relationship_signal_score": self.signal_score, "is_fraud": False}\nprint(RelationshipEvidence(0.7).as_dict())\n', 'serializa sin is_fraud True automatico.' if A else 'disclaimer False.', ['to_dict']))
    out.append(ex('S11-T1-B-E3', 'def interpret_signal(score):\n    return {"score": score, "claim": "evidence_only"}\nprint(interpret_signal(0.9))\n', 'interpretacion sin claim legal.' if A else 'evidence_only.', ['policy']))
    out.append(ex('S11-T2-A-E1', 'from typing import Protocol\nclass EntityStore(Protocol):\n    def get(self, id: str): ...\n    def save(self, entity) -> None: ...\nclass MemStore:\n    def __init__(self):\n        self._d = {}\n    def get(self, id: str):\n        return self._d.get(id)\n    def save(self, entity) -> None:\n        self._d[entity["id"]] = entity\ns = MemStore()\ns.save({"id": "C1"})\nprint(s.get("C1"))\n', 'Protocol + fake en memoria.' if A else 'puerto get/save.', ['Protocol']))
    out.append(ex('S11-T2-A-E2', 'class FakeStore:\n    def get(self, id):\n        return {"id": id}\nprint(FakeStore().get("X"))\n', 'fake para tests.' if A else 'sin DB real.', ['fake']))
    out.append(ex('S11-T2-A-E3', 'def load_entity(store, id):\n    ent = store.get(id)\n    if ent is None:\n        raise KeyError(id)\n    return ent\nclass S:\n    def get(self, id):\n        return None\ntry:\n    load_entity(S(), "missing")\nexcept KeyError as e:\n    print("missing", e)\n', 'servicio usa puerto store.' if A else 'KeyError si ausente.', ['hexagonal']))
    out.append(ex('S11-T2-B-E1', 'from dataclasses import dataclass\n@dataclass\nclass Client:\n    id: str\n    name: str\n    def validate(self):\n        if not self.id:\n            raise ValueError("id")\n        return self\nprint(Client("C1", "Ana").validate())\n', 'validate en dominio.' if A else 'invariante id.', ['validate']))
    out.append(ex('S11-T2-B-E2', 'from dataclasses import dataclass\n@dataclass\nclass Client:\n    id: str\n    def __post_init__(self):\n        if not self.id.startswith("C"):\n            raise ValueError("id format")\nprint(Client("C9"))\n', 'invariante de formato en construccion.' if A else 'post_init.', ['invariant']))
    out.append(ex('S11-T2-B-E3', 'def build_client(data):\n    if "id" not in data or "name" not in data:\n        raise ValueError("incomplete")\n    return data\nprint(build_client({"id": "C1", "name": "Ana"}))\n', 'factory valida incompletos.' if A else 'fail fast.', ['factory']))
    out.append(ex('S11-T3-A-E1', 'from dataclasses import dataclass\n@dataclass\nclass PersonInfo:\n    name: str\n@dataclass\nclass Client:\n    id: str\n    person: PersonInfo\nprint(Client("C1", PersonInfo("Ana")))\n', 'composicion Client tiene PersonInfo.' if A else 'no herencia forzada.', ['composition']))
    out.append(ex('S11-T3-A-E2', '# herencia fragil demo (evitar como default)\nclass Person:\n    def __init__(self, name):\n        self.name = name\nclass Client(Person):\n    def __init__(self, name, id):\n        super().__init__(name)\n        self.id = id\nprint(Client("Ana", "C1").id)\n', 'herencia posible pero composicion preferible.' if A else 'nota de diseno.', ['inheritance']))
    out.append(ex('S11-T3-A-E3', 'def prefer_composition():\n    return "Client has PersonInfo rather than is-a Person by default"\nprint(prefer_composition())\n', 'politica de diseno del curso.' if A else 'composicion first.', ['design']))
    out.append(ex('S11-T3-B-E1', 'from dataclasses import dataclass, asdict\n@dataclass\nclass Entity:\n    id: str\n    score: float\nprint(asdict(Entity("C1", 0.5)))\n', 'asdict serializacion.' if A else 'to_dict natural.', ['asdict']))
    out.append(ex('S11-T3-B-E2', 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass DocId:\n    value: str\nd = DocId("X")\nprint(d.value)\n', 'value object frozen.' if A else 'inmutable.', ['frozen']))
    out.append(ex('S11-T3-B-E3', 'domain_forbidden = ["is_fraud_auto", "is_family_auto"]\nprint(domain_forbidden)\n', 'lista de metodos prohibidos en dominio.' if A else 'no auto veredictos.', ['forbidden']))
    out.append(ex('S11-T4-A-E1', 'tests = ["test_default_factory_isolated", "test_post_init_rejects_empty", "test_store_roundtrip"]\nprint(tests)\n', 'suite unitaria de dominio.' if A else 'tres tests minimos.', ['tests']))
    out.append(ex('S11-T4-A-E2', 'def test_signal_not_fraud():\n    score = 0.99\n    assert score != "fraud"\n    return True\nprint(test_signal_not_fraud())\n', 'assert senal != fraude.' if A else 'test de politica.', ['test']))
    out.append(ex('S11-T4-A-E3', 'def test_protocol_fake():\n    class F:\n        def get(self, i):\n            return {"id": i}\n        def save(self, e):\n            pass\n    assert F().get("1")["id"] == "1"\n    return "ok"\nprint(test_protocol_fake())\n', 'fake satisface get/save.' if A else 'test de puerto.', ['test']))
    out.append(ex('S11-T4-B-E1', 'model = {"entities": ["Person", "Client", "RelationshipEvidence"], "ports": ["EntityStore"]}\nprint(model)\n', 'mapa de modelo de dominio.' if A else 'entidades + puertos.', ['model']))
    out.append(ex('S11-T4-B-E2', 'invariants = ["Client.id non-empty", "signal_score in 0..1", "no auto fraud flag"]\nprint(invariants)\n', 'invariantes documentados.' if A else 'especificacion.', ['invariants']))
    out.append(ex('S11-T4-B-E3', 'readme = "Domain model: composition first; evidence scores are not legal verdicts."\nprint(readme)\n', 'nota de portafolio dominio.' if A else 'disclaimer.', ['docs']))
    return out
