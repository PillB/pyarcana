"""Proposal 10 (approved 2026-11-11), S11: the P2 and P3 findings of the item-by-item review.

S11 had no P1 findings. Its P2 and P3 findings take three shapes.

First, prose that contradicts the code beside it. The header promised that a valid client has an
email, but nothing checks one. The theory said a `CaseFile` enforces a rule that no code enforced,
and that stdout carries no full PII while the block printed the full name. It warned of a hash that
"changes" where a plain dataclass raises `TypeError: unhashable type`. It said `sorted` gives a
tuple. And it gave `Transaction` and `ResolvedEntity` two or three shapes.

Second, checks that pass the wrong answer. No case covered three decimals or the score bounds, and
a stored `full_name` passed, as did a dropped fake-test branch, a `KeyError` on a missing id and
a broad `except`. The You Do oracle printed `tests_pass` for six requirement-breaking variants.

Third, words used before they are explained: decorator, DB, agregado, familiaridad, cls, upsert,
fail-soft, decide_fraud, vars(obj), "sin reloj de red", and an exam item on injecting a clock
that no lesson showed.

Negative controls: every reference prints its pin, every theory and demo block prints its pin,
a no-op mutation raises, an irrelevant edit is not caught, and the You Do reference passes the
oracle that the six mutants fail.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section11 }} from {path!r};
console.log(JSON.stringify(section11));
"""


@lru_cache(maxsize=None)
def s11() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s11-oop-domain.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S11 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s11()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def block_by_title(title: str) -> dict:
    hits = [b for b in s11()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s11()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s11()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s11()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts += [b["callout"]["title"], b["callout"]["content"]]
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], e.get("hint", ""), *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"], yd["portfolioNote"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def all_code() -> list[tuple[str, str]]:
    sec = s11()
    out = [(b["code"]["title"], b["code"]["code"]) for b in sec["theory"] if b.get("code")]
    out += [(d["demoId"], d["code"]["code"]) for d in sec["iDo"]["steps"]]
    for e in sec["weDo"]["steps"]:
        out += [(e["id"] + " starter", e["starterCode"]["code"]), (e["id"] + " solution", e["solutionCode"]["code"])]
    out.append(("youDo starter", sec["youDo"]["starterCode"]))
    return out


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8", cwd=tmp)


def mutate(code: str, edits: list[tuple[str, str]]) -> str:
    for old, new in edits:
        if code.count(old) != 1:
            raise AssertionError(f"anchor not found exactly once: {old[:60]!r}")
        code = code.replace(old, new)
    return code


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def sentences(text: str) -> list[str]:
    return [s for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def words(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "oop-domain"][0]["questions"]


def key_length_ranks(questions: list[dict]) -> list[int]:
    """The key's rank by length among its options (1 = longest). A tie with the key fails."""
    ranks = []
    for i, q in enumerate(questions, 1):
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        assert lengths.count(key) == 1, f"item {i}: the key ties another option at {key} characters"
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


#: exercise id -> (finding, edits): the wrong answer the exercise must now reject.
MUTANTS = {
    "S11-T1-B-E1": ("WEDO-04.2 no two-decimal rule", [
        ('        if self.amount != self.amount.quantize(Decimal("0.01")):\n'
         '            raise ValueError("amount debe tener máximo 2 decimales")\n', "")]),
    "S11-T2-A-E1": ("WEDO-07.1 full_name stored as a field", [
        ('    last_name: str\n\n    @property\n    def full_name(self) -> str:\n'
         '        return f"{self.first_name} {self.last_name}"',
         '    last_name: str\n    full_name: str = ""\n\n    def __post_init__(self):\n'
         '        self.full_name = f"{self.first_name} {self.last_name}"')]),
    "S11-T2-A-E3": ("WEDO-09.1 exclusive bounds", [("not 0.0 <= v <= 1.0", "not 0.0 < v < 1.0")]),
    "S11-T3-B-E3": ("WEDO-18.1 the fake-test branch dropped", [
        ("if n_adapters < 2 and not has_fake_tests:", "if n_adapters < 2:")]),
    "S11-T4-A-E2": ("WEDO-20.1 KeyError on a missing id", [
        ("return self._d.get(client_id)", "return self._d[client_id]")]),
    "S11-T4-B-E1": ("WEDO-22.1 a broad except over a domain without the check", [
        ('    def __post_init__(self):\n        if not self.document_id.strip():\n'
         '            raise ValueError("document_id vacío")\n', ""),
        ("except ValueError as e:", "except Exception as e:")]),
    "S11-T4-B-E3": ("WEDO-24.1 a verdict under the other name", [
        ("@dataclass\nclass Client:\n    client_id: str\n\n# Anti-patrón",
         "@dataclass\nclass Client:\n    client_id: str\n\n    def is_family(self, score: float) -> bool:\n"
         "        return score >= 0.9\n\n# Anti-patrón")]),
}

#: theory block title -> (finding, edits)
THEORY_MUTANTS = {
    "documento_vacio.py": ("THEORY-09.1 the constructor accepts the blank document", [
        ('            raise ValueError(f"{self.client_id}: document_id vacío")', "            pass")]),
    "frozen_entity.py": ("THEORY-14.1 the plain dataclass made frozen", [
        ("@dataclass\nclass EntidadMutable:", "@dataclass(frozen=True)\nclass EntidadMutable:")]),
    "composition.py": ("THEORY-01.1 add() without the type check", [
        ("        if not isinstance(ev, RelationshipEvidence):\n"
         "            raise TypeError(\"CaseFile.add espera RelationshipEvidence\")\n", "")]),
    "domain_tests.py": ("THEORY-21.2 the pair check dropped", [
        ('        if not self.left_id < self.right_id:\n            raise ValueError("par no canónico")\n', "")]),
    "reloj_inyectado.py": ("EXAM-23.1 the test gets a random id", [
        ('new_id=lambda: "A-0001"', "new_id=lambda: uuid.uuid4().hex[:8]")]),
    "constructor_arregla.py": ("THEORY-08.1 the corrected class accepts EUR", [
        ('            raise ValueError(f"{self.tx_id}: currency no soportada")', "            pass")]),
}

YOUDO_IMPL = {
    "        # TODO: rechazar client_id o document_id vacíos (strip)\n        pass":
        '        if not self.client_id.strip():\n            raise ValueError("client_id vacío")\n'
        '        if not self.document_id.strip():\n            raise ValueError("document_id vacío")',
    "        # TODO: devolver dict serializable (sin secretos)\n        return {}":
        '        return {"client_id": self.client_id, "document_id": self.document_id,\n'
        '                "full_name": self.full_name, "emails": list(self.emails)}',
    "        # TODO: rechazar entity_id vacío\n        pass":
        '        if not self.entity_id.strip():\n            raise ValueError("entity_id vacío")',
    "        # TODO: Decimal > 0, máx. 2 decimales, currency en {PEN, USD}\n        pass":
        '        if not isinstance(self.amount, Decimal) or self.amount <= 0:\n'
        '            raise ValueError("amount debe ser Decimal > 0")\n'
        '        if self.amount != self.amount.quantize(Decimal("0.01")):\n'
        '            raise ValueError("amount con más de 2 decimales")\n'
        '        if self.currency not in {"PEN", "USD"}:\n            raise ValueError("currency no soportada")',
    "        # TODO: par canónico left_id < right_id; score finito en [0, 1]\n        pass":
        '        if not self.left_id < self.right_id:\n            raise ValueError("par no canónico")\n'
        '        if not isfinite(self.signal_score) or not 0.0 <= self.signal_score <= 1.0:\n'
        '            raise ValueError("signal_score fuera de rango")',
    "        # TODO: persistir por client_id\n        pass": "        self._d[client.client_id] = client",
    "        # TODO: recuperar o None\n        return None": "        return self._d.get(client_id)",
}

#: YOUDO-01.1: the six variants the finding showed passing the oracle.
YOUDO_MUTANTS = {
    "blank client_id accepted": [("if not self.client_id.strip():", "if not self.client_id:")],
    "blank document_id accepted": [("if not self.document_id.strip():", "if False:")],
    "three decimals accepted": [('if self.amount != self.amount.quantize(Decimal("0.01")):', "if False:")],
    "same id on both sides accepted": [("if not self.left_id < self.right_id:", "if not self.left_id <= self.right_id:")],
    "score bounds exclusive": [("not 0.0 <= self.signal_score <= 1.0", "not 0.0 < self.signal_score < 1.0")],
    "is_fraud on ClientRecord": [("    def to_dict(self) -> dict:",
                                  "    def is_fraud(self) -> bool:\n        return False\n\n    def to_dict(self) -> dict:")],
}


def youdo_reference() -> str:
    code = s11()["youDo"]["starterCode"]
    for todo, impl in YOUDO_IMPL.items():
        if code.count(todo) != 1:
            raise AssertionError(f"You Do TODO changed: {todo[:50]!r}")
        code = code.replace(todo, impl)
    return code


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for e in s11()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                sol = e["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, (finding, edits) in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            with self.subTest(exercise=ex_id, finding=finding):
                self.assertTrue(caught(sol["code"], sol["output"], mutate(sol["code"], edits)),
                                f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_the_starter_runs_the_new_case_too(self) -> None:
        needles = {
            "S11-T1-B-E1": '"1.001"',
            "S11-T2-A-E1": "fields(PersonName)",
            "S11-T2-A-E3": "for v in (0.4, 1.0, 0.0):",
            "S11-T3-B-E3": '"uno_con_fake"',
            "S11-T4-A-E2": 'r.get("X")',
        }
        for ex_id, needle in needles.items():
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                self.assertIn(needle, ex["starterCode"]["code"])
                self.assertIn(needle, ex["solutionCode"]["code"])

    def test_the_hint_runs(self) -> None:
        # WEDO-04.1: quantize(0.01) raises TypeError; the hint must be the call that works.
        ex = exercise("S11-T1-B-E1")
        self.assertIn('quantize(Decimal("0.01"))', ex["hint"])
        self.assertNotIn("quantize(0.01)", ex["hint"] + " ".join(ex["hints"]))
        done = run_py('from decimal import Decimal\nprint(Decimal("10.00").quantize(Decimal("0.01")))')
        self.assertEqual(done.stdout.strip(), "10.00")

    def test_float_warning_shows_its_numbers(self) -> None:
        fb = exercise("S11-T1-A-E2")["feedback"]
        done = run_py('from decimal import Decimal\nprint(0.1 + 0.2)\nprint(Decimal("0.1") + Decimal("0.2"))')
        for line in done.stdout.split():
            self.assertIn(f"`{line}`", fb)

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S11-T4-A-E2")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S11-T4-A-E2")["solutionCode"]
        edited = sol["code"].replace("class Repo:", "# repo en memoria\nclass Repo:")
        self.assertFalse(caught(sol["code"], sol["output"], edited))


class TheoryShowsWhatItClaims(unittest.TestCase):
    def test_pins_hold(self) -> None:
        for b in s11()["theory"]:
            code = b.get("code")
            if not code or code.get("language") != "python":
                continue
            with self.subTest(block=code["title"]):
                done = run_py(code["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), code["output"].rstrip("\n"))

    def test_demo_pins_hold(self) -> None:
        for d in s11()["iDo"]["steps"]:
            with self.subTest(demo=d["demoId"]):
                done = run_py(d["code"]["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), d["code"]["output"].rstrip("\n"))

    def test_each_planted_mistake_changes_the_block(self) -> None:
        for title, (finding, edits) in THEORY_MUTANTS.items():
            code = block_by_title(title)["code"]
            with self.subTest(block=title, finding=finding):
                self.assertTrue(caught(code["code"], code["output"], mutate(code["code"], edits)))
        code = demo("S11-T3-A-DEMO")["code"]
        self.assertTrue(caught(code["code"], code["output"], mutate(code["code"], [
            ("        if not isinstance(ev, RelationshipEvidence):\n"
             "            raise TypeError(\"CaseFile.add espera RelationshipEvidence\")\n", "")])))

    def test_one_shape_per_class(self) -> None:
        # THEORY-07.1 / 08.1 / WEDO-04.3 and THEORY-17.3: one field list per class name.
        expected = {"Transaction": ["tx_id", "client_id", "amount", "currency"],
                    "ResolvedEntity": ["entity_id", "display_name"]}
        # identidad_documento.py compares by document on purpose; T2-A-E2 is a date exercise
        # whose Transaction carries only tx_id and day_created (not a finding; left as is).
        exempt = {"identidad_documento.py", "S11-T2-A-E2 starter", "S11-T2-A-E2 solution"}
        for where, code in all_code():
            for name, fields in expected.items():
                for m in re.finditer(rf"^class {name}\b.*?:\n((?:    .*\n?|\n)*)", code, re.M):
                    if where in exempt:
                        continue
                    got = re.findall(r"^    (\w+): ", m.group(1), re.M)
                    with self.subTest(where=where, cls=name):
                        self.assertEqual(got, fields)

    def test_one_name_for_the_evidence_class(self) -> None:
        self.assertNotIn("class Evidence:", block_by_title("senal_duplicada.py")["code"]["code"])
        para = block("Contraejemplo: la misma señal contada dos veces en una lista")["paragraphs"][0]
        self.assertIn("`RelationshipEvidence` es `frozen`", para)

    def test_unhashable_is_shown_and_named(self) -> None:
        self.assertIn("unhashable type", block_by_title("frozen_entity.py")["code"]["output"])
        self.assertIn("TypeError: unhashable type", learner_text())
        self.assertIn("unhashable type", exercise("S11-T2-B-E2")["retrospective"])

    def test_sorted_gives_a_list(self) -> None:
        done = run_py('print(sorted(("E2", "E10")))')
        self.assertIn(f"`{done.stdout.strip()}`", "\n".join(block("Composición antes que herencia")["paragraphs"]))

    def test_the_stdout_claim_matches_the_block(self) -> None:
        # THEORY-10.1: the block prints the full name; the text must say so.
        b = block("Propiedades y métodos")
        self.assertIn("Ana Pérez", b["code"]["output"])
        text = "\n".join(b["paragraphs"])
        self.assertNotIn("no aparece la PII completa", text)
        self.assertIn("`display_name` es el nombre completo", text)
        self.assertIn("(email inválido)", text)
        self.assertIn("nombre completo", demo("S11-T2-A-DEMO")["why"])

    def test_paragraphs_fit(self) -> None:
        for heading in ("Igualdad, hash y mutabilidad consciente", "Repositorios, servicios y serialización",
                        "Composición antes que herencia"):
            for para in block(heading)["paragraphs"]:
                with self.subTest(heading=heading, para=para[:40]):
                    self.assertLessEqual(len(sentences(para)), 4)
                    for s in sentences(para):
                        self.assertLessEqual(words(s), 45, s)

    def test_the_clock_is_injected_in_the_theory(self) -> None:
        # EXAM-23.1: the exam asks for this technique; the lesson now shows it.
        out = block_by_title("reloj_inyectado.py")["code"]["output"].splitlines()
        self.assertEqual(out[0], "acoplado → dos corridas iguales: False")
        self.assertEqual(out[-1], "inyectado → dos corridas iguales: True")
        self.assertNotIn("reloj de red", learner_text())


class WordsAreExplainedWhereTheyAppear(unittest.TestCase):
    def test_header(self) -> None:
        sec = s11()
        self.assertIn("un cliente válido tiene `client_id` y `document_id` no vacíos", sec["jobRelevance"])
        self.assertNotIn("tiene email y documento", sec["jobRelevance"])
        self.assertIn("familiaridad (las señales que relacionan a clientes", sec["jobRelevance"])
        outcomes = " ".join(o["text"] for o in sec["learningOutcomes"])
        for gloss in ("`dataclass` (un decorador", "`frozen` (objetos", "`Protocol` (un contrato",
                      "`to_dict` (el método"):
            with self.subTest(gloss=gloss):
                self.assertIn(gloss, outcomes)
        # A valid client with no email must build, or the header's rule would be false.
        code = block_by_title("invariants.py")["code"]["code"].split("print(")[0]
        self.assertEqual(run_py(code + 'print(ClientRecord("C002", "DOC-0002", "X").emails)').stdout.strip(), "[]")

    def test_terms_are_glossed_at_first_use(self) -> None:
        text = learner_text()
        first = text.index("@dataclass")
        self.assertIn("decorador", text[first:first + 120])
        for needle in ("el agregado, el objeto raíz que las agrupa", "sin red ni base de datos (DB)",
                       "Tampoco es una probabilidad calibrada", "igualdad, hash y `frozen`",
                       "`cls`, es la propia clase", "`upsert` (guardar y, si ya existe, reemplazar)",
                       "fail-soft de presentación (degradar sin detener el flujo",
                       "`decide_fraud`. Es una función que emite un veredicto",
                       "`vars(obj)`, el diccionario con todos los atributos",
                       "KeyError: 'client_id'", "En el ejercicio T3-A-E1"):
            with self.subTest(needle=needle):
                self.assertIn(needle, text)

    def test_no_untaught_or_mixed_term(self) -> None:
        text = learner_text()
        for term in (r"\badapters?\b", r"(?<!\()\bnormalizers\b(?!\))", "ya no baila", "sin fields",
                     r"fuera del value object", r"Client\(PersonInfo\(BaseEntity\)\)",
                     "entity_id vacío se rechaza en demos"):
            with self.subTest(term=term):
                self.assertEqual([m.group(0) for m in re.finditer(term, text)], [])

    def test_feedback_says_what_the_learner_sees(self) -> None:
        fb16 = exercise("S11-T3-B-E1")["feedback"]
        self.assertIn("AttributeError", fb16)
        self.assertNotIn("en silencio", fb16)
        fb22 = exercise("S11-T4-B-E1")["feedback"]
        self.assertIn("AssertionError", fb22)
        self.assertIn("except Exception", fb22)
        for s in sentences(exercise("S11-T2-B-E3")["feedback"]):
            with self.subTest(sentence=s[:40]):
                self.assertLessEqual(words(s), 32)
        self.assertIn('cf.add(RelationshipEvidence("E2", "E1", 0.5))',
                      exercise("S11-T3-A-E3")["instruction"])

    def test_the_retrospective_answers_its_question(self) -> None:
        retro = demo("S11-T3-A-DEMO")["retrospective"]
        self.assertIn("¿por qué el expediente no puede tener un `is_family()`?", retro)
        self.assertIn("ninguna interfaz del curso emite un veredicto", retro)


class YouDoOracleIsHonest(unittest.TestCase):
    def test_the_reference_passes(self) -> None:
        done = run_py(youdo_reference())
        self.assertEqual(done.returncode, 0, done.stderr[-600:])
        self.assertEqual(done.stdout.strip(), "tests_pass")

    def test_the_starter_does_not_pass(self) -> None:
        self.assertNotEqual(run_py(s11()["youDo"]["starterCode"]).stdout.strip(), "tests_pass")

    def test_each_requirement_breaking_variant_fails(self) -> None:
        ref = youdo_reference()
        for name, edits in YOUDO_MUTANTS.items():
            with self.subTest(variant=name):
                done = run_py(mutate(ref, edits))
                self.assertNotEqual(done.stdout.strip(), "tests_pass", f"the oracle passed: {name}")


class SelfCheckAndBank(unittest.TestCase):
    KEYS = {
        0: "Evita el default mutable compartido entre instancias",
        1: "Una señal/dato numérico, no un veredicto de fraude o familia",
        2: "Definir un puerto get/save que dobles y adaptadores puedan implementar",
        3: "Al construirlo (__post_init__), para que ningún objeto inválido circule",
        4: "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar",
        5: "is_fraud() automático",
    }

    def test_keys_are_kept(self) -> None:
        qs = s11()["selfCheck"]["questions"]
        for i, key in self.KEYS.items():
            with self.subTest(q=i):
                self.assertEqual(qs[i]["options"][qs[i]["correctIndex"]], key)

    def test_the_key_length_rank_is_spread(self) -> None:
        # Never-longest alone moves the cue to second-longest (it held 4 of 6 here). Spread it:
        # no length rank holds more than 2 of the 6 keys.
        ranks = key_length_ranks(s11()["selfCheck"]["questions"])
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 2, ranks)

    def test_no_second_defensible_answer(self) -> None:
        # SELFCHECK-03.1: runtime_checkable makes "comprobar en ejecución" true.
        opts = s11()["selfCheck"]["questions"][2]["options"]
        self.assertFalse(any("en ejecución" in o for o in opts))
        # SELFCHECK-06.1: every distractor is something the lesson allows.
        q5 = s11()["selfCheck"]["questions"][5]["options"]
        self.assertEqual(q5[1:], ["Un puntaje en [0, 1] guardado como dato", "Un to_dict para el borde de serialización",
                                  "Un from_dict que construye objetos validados"])

    def test_bank_has_no_length_cue(self) -> None:
        # EXAM length cue. "Never longest" on every item made the key second-longest almost
        # everywhere, and "pick the second-longest" passed the bank (see the S10 bank). The rule
        # is a spread: no length rank holds more than 7 of the 24 keys, and no key ties.
        qs = bank()
        self.assertEqual(len(qs), 24)
        ranks = key_length_ranks(qs)
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 7, ranks)


if __name__ == "__main__":
    unittest.main()
