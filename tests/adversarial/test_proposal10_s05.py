"""Proposal 10 (approved 2026-11-11), S05: the P2 and P3 findings of the item-by-item review.

Three kinds of finding, three kinds of test.

1. An exercise states a rule, but its pinned input cannot tell a right solution from a wrong one
   (`normalize_nombre('  Ana  María  ')` is already title-cased, `'999-000'` has no parentheses).
   Mutation tests plant the mistake the finding names in the reference solution and require the
   exercise to notice: an assert stops it or the output differs from the pin.
2. An exercise asks the learner to check an error path (a `ValueError`, an `AssertionError` alarm)
   that the pinned run cannot show, because S05 does not catch exceptions. The text now tells the
   learner to append one call and read the last line; the test runs exactly that and requires
   the line the text promises.
3. Text that does not match what runs, or words the course has not taught. Those tests read the
   section through tsx, so they check what the learner sees.

Negative controls: every reference prints its pin, a mutation that changes nothing raises, an
irrelevant edit is not "caught", and the bank scan really reads 24 items.
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
import {{ section05 }} from {path!r};
console.log(JSON.stringify(section05));
"""


@lru_cache(maxsize=None)
def s05() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s05-functions-contracts.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S05 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s05()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s05()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s05()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8")


def last_error_line(done: subprocess.CompletedProcess) -> str:
    lines = [ln for ln in done.stderr.strip().splitlines() if ln.strip()]
    return lines[-1] if lines else ""


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "functions-contracts"][0]["questions"]


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the exercise notices the planted mistake: an assert stops it or the output differs."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


#: exercise id -> list of (finding, old text, new text).
MUTANTS = {
    "S05-T2-A-E3": [
        ("490 title() dropped", "return ' '.join(raw.strip().split()).title()",
         "return ' '.join(raw.strip().split())"),
    ],
    "S05-T3-B-E1": [
        ("493 removes spaces and dashes only", "return ''.join(c for c in raw if c.isdigit())",
         "return raw.replace(' ', '').replace('-', '')"),
    ],
}


class ExercisesNoticeTheMistakeTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        ids = list(MUTANTS) + ["S05-T1-B-E2", "S05-T1-B-E3", "S05-T2-A-E2", "S05-T3-B-E2",
                               "S05-T4-A-E2", "S05-T4-A-E3", "S05-T4-B-E1", "S05-T4-B-E3"]
        for ex_id in ids:
            with self.subTest(exercise=ex_id):
                sol = exercise(ex_id)["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_every_named_mistake_is_caught(self) -> None:
        for ex_id, mutations in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutations:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id}: the mistake '{finding}' still prints the pinned output")

    def test_negative_control_caught_rejects_a_no_op_mutation(self) -> None:
        sol = exercise("S05-T2-A-E3")["solutionCode"]
        with self.assertRaises(AssertionError):
            caught(sol["code"], sol["output"], sol["code"].replace("no such text", "x"))

    def test_negative_control_an_irrelevant_change_is_not_caught(self) -> None:
        sol = exercise("S05-T2-A-E3")["solutionCode"]
        self.assertFalse(caught(sol["code"], sol["output"], sol["code"] + "\n# comentario"))


class ErrorPathsTheTextAsksTheLearnerToRun(unittest.TestCase):
    """Each check appends what the instruction says to append and reads the line it promises."""

    def _ends_with(self, ex_id: str, source: str, expected_last_line: str) -> None:
        done = run_py(source)
        self.assertNotEqual(done.returncode, 0, f"{ex_id}: the check did not stop the program")
        self.assertEqual(last_error_line(done), expected_last_line)

    def test_wedo_08_email_rejection(self) -> None:
        ex = exercise("S05-T2-A-E2")
        self.assertIn("añade al final `normalize_email('x')`", ex["instruction"])
        self._ends_with(ex["id"], ex["solutionCode"]["code"] + "\nnormalize_email('x')\n",
                        "ValueError: email sin @")

    def test_wedo_17_core_still_raises(self) -> None:
        ex = exercise("S05-T3-B-E2")
        self.assertIn("añade al final `normalize_email('sin-arroba')`", ex["retrospective"])
        self._ends_with(ex["id"], ex["solutionCode"]["code"] + "\nnormalize_email('sin-arroba')\n",
                        "ValueError: email sin @")

    def test_wedo_22_alarm_rings_with_upper(self) -> None:
        ex = exercise("S05-T4-B-E1")
        self.assertIn("cambia `lower()` por `upper()`", ex["instruction"])
        code = ex["solutionCode"]["code"]
        mutated = code.replace("s.strip().lower()", "s.strip().upper()")
        self.assertNotEqual(mutated, code)
        self._ends_with(ex["id"], mutated, "AssertionError")

    def test_wedo_24_alarm_rings_with_a_wrong_expected(self) -> None:
        ex = exercise("S05-T4-B-E3")
        self.assertIn("cambia el expected `'A B'` por `'a b'`", ex["instruction"])
        code = ex["solutionCode"]["code"]
        mutated = code.replace("('  a  b ', 'A B')", "('  a  b ', 'a b')")
        self.assertNotEqual(mutated, code)
        done = run_py(mutated)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("AssertionError", done.stderr)
        self.assertNotIn("all PASS", done.stdout)

    def test_wedo_20_prediction_is_what_runs(self) -> None:
        ex = exercise("S05-T4-A-E2")
        self.assertIn("sale `+5151999`", ex["retrospective"])
        done = run_py(ex["solutionCode"]["code"] + "\nprint(pe(pe('999')))\n")
        self.assertEqual(done.stdout.splitlines()[-1], "+5151999")


class ExerciseTextMatchesWhatRuns(unittest.TestCase):
    def test_tests_lines_read_as_spanish_checks(self) -> None:
        self.assertEqual(exercise("S05-T1-A-E1")["tests"], "exactamente una línea impresa: 2")
        self.assertEqual(exercise("S05-T1-A-E3")["tests"], "exactamente una línea impresa: nombre: Ana")
        self.assertEqual(exercise("S05-T2-B-E1")["edgeCases"], ["retorno str en vez de int"])

    def test_wedo_05_starter_uses_the_theory_name_for_the_bug(self) -> None:
        ex = exercise("S05-T1-B-E2")
        self.assertIn("def bad_add(item, bucket=[]):", ex["starterCode"]["code"])
        self.assertIn("def good_add(item, bucket=None):", ex["solutionCode"]["code"])
        self.assertIn("`bad_add(1)` y `bad_add(2)` compartían memoria", ex["feedback"])

    def test_wedo_06_variant_is_not_the_gate_policy(self) -> None:
        ex = exercise("S05-T1-B-E3")
        self.assertNotIn("normalize_telefono(", ex["solutionCode"]["code"])
        self.assertIn("def formatear_telefono(raw, *, digits_only=True):", ex["solutionCode"]["code"])
        self.assertIn("la política del gate sigue siendo `normalize_telefono`", ex["preamble"])
        q7 = s05()["selfCheck"]["questions"][6]
        self.assertIn("formatear_telefono", q7["question"])

    def test_wedo_11_glosses_its_string_methods(self) -> None:
        text = exercise("S05-T2-B-E2")["instruction"]
        self.assertIn("`isascii()` es `True` si todos los caracteres son ASCII", text)
        self.assertIn("`isdecimal()` es `True` si todos son dígitos decimales", text)

    def test_wedo_21_error_names_the_mode(self) -> None:
        code = exercise("S05-T4-A-E3")["solutionCode"]["code"]
        self.assertIn("raise ValueError(f'modo desconocido: {mode}')", code)
        done = run_py(code + "\nmake_normalizer('upper')\n")
        self.assertEqual(last_error_line(done), "ValueError: modo desconocido: upper")


class DemosMatchTheirWhy(unittest.TestCase):
    def test_ido_05_orchestrator_copies_no_rule(self) -> None:
        code = demo("S05-T3-A-DEMO")["code"]["code"]
        body = code[code.index("def normalize_pair"):code.index("print(")]
        for method in (".title()", ".lower()", ".strip()"):
            self.assertNotIn(method, body)
        self.assertNotIn("norm_email", code)
        self.assertIn("{'nombre': 'Ana Perez', 'email': 'ana@example.com'}", demo("S05-T3-A-DEMO")["code"]["output"])

    def test_ido_07_shows_the_idempotence_its_why_claims(self) -> None:
        d = demo("S05-T4-A-DEMO")
        self.assertIn("idempotente: True", d["code"]["output"])
        done = run_py(d["code"]["code"])
        self.assertEqual(done.stdout.rstrip("\n"), d["code"]["output"].rstrip("\n"))

    def test_ido_texts(self) -> None:
        self.assertIn("title-case (primera letra de cada palabra en mayúscula", demo("S05-T1-A-DEMO")["preamble"])
        self.assertIn("recibe las dos listas después de ejecutar ambas llamadas", demo("S05-T1-B-DEMO")["why"])
        self.assertIn("Post: devuelve el email en minúsculas y sin espacios extremos", demo("S05-T2-A-DEMO")["code"]["code"])
        self.assertNotIn("(D10)", demo("S05-T2-B-DEMO")["code"]["code"])
        self.assertIn("no es el `normalize_telefono` del proyecto", demo("S05-T2-B-DEMO")["preamble"])


class TheoryAndHeader(unittest.TestCase):
    def test_header_glosses_its_terms(self) -> None:
        s = s05()
        self.assertIn("idempotencia (aplicar dos veces da lo mismo que una)", s["tagline"])
        self.assertIn("ETL (un proceso que extrae, transforma y carga datos)", s["jobRelevance"])
        outcomes = " ".join(o["text"] for o in s["learningOutcomes"])
        for gloss in ("LEGB (el orden en que Python busca un nombre)", "closures (funciones que recuerdan un valor)",
                      "assert (comprobaciones que detienen el programa si fallan)", "precondiciones (lo que la función exige)"):
            self.assertIn(gloss, outcomes)

    def test_reference_block_defines_gate_and_title_case(self) -> None:
        text = " ".join(block("Contrato de la sección (referencia)")["paragraphs"])
        self.assertIn("El *gate* es el control de aceptación de la sección", text)
        self.assertIn("el resto en minúscula (title-case)", text)

    def test_tuple_paragraph_leaves_the_prediction_to_the_learner(self) -> None:
        text = " ".join(block("Tuplas para devolver varios datos juntos")["paragraphs"])
        self.assertNotIn("devuelve `(True, \"999000111\", None)`", text)
        self.assertIn("`norm_tel`, la función de la demostración T2-B", text)

    def test_annotation_and_container_sentences(self) -> None:
        text = " ".join(block("Type hints graduales y errores de dominio")["paragraphs"])
        self.assertIn("`raw: str` dice que recibe texto y `-> str` dice que devuelve texto", text)
        self.assertIn("`Tuple` y `Optional` ya aparecen en T2-B", text)

    def test_substitution_test_names_the_orchestrator_the_block_defines(self) -> None:
        b = block("Funciones pequeñas y composición")
        self.assertIn("def normalize_linea", b["code"]["code"])
        self.assertIn("`normalize_linea` no necesita aprender la nueva regla", " ".join(b["paragraphs"]))
        self.assertNotIn("normalize_record", " ".join(b["paragraphs"]))

    def test_postcondition_and_docstring_sentences(self) -> None:
        text = " ".join(block("Pre/postcondiciones y docstrings")["paragraphs"])
        self.assertNotIn("forma canónica o un `ValueError`", text)
        self.assertIn("en el idioma que use el proyecto, de forma consistente", text)

    def test_closure_block_wording(self) -> None:
        text = " ".join(block("LEGB y closures básicos")["paragraphs"])
        self.assertNotIn("**función de retorno**", text)
        self.assertIn("en la corregida, `PREF` llega como argumento `prefix`", text)

    def test_transcript_says_it_is_abbreviated(self) -> None:
        b = block("Contraejemplo: un assert desaparece con -O")
        self.assertIn("abreviada", b["code"]["title"])
        self.assertTrue(b["code"]["code"].startswith("# Salida abreviada"))


class YouDo(unittest.TestCase):
    def test_requirements_name_the_keys_and_the_purity_check(self) -> None:
        req = " ".join(s05()["youDo"]["requirements"])
        self.assertIn("las claves `nombres`, `email`, `telefono` y `direccion`", req)
        self.assertIn("busca `print(` y `open(`", req)
        starter = s05()["youDo"]["starterCode"]
        for key in ('"nombres"', '"email"', '"telefono"', '"direccion"'):
            self.assertIn(key, starter)

    def test_starter_uses_no_untaught_typing_and_says_what_to_do(self) -> None:
        starter = s05()["youDo"]["starterCode"]
        self.assertNotIn("Callable", starter)
        self.assertNotIn("no dejes NotImplemented", starter)
        self.assertEqual(starter.count("# Implementa esta función según los requisitos y borra la línea raise."), 5)

    def test_negative_control_a_complete_you_do_passes_its_tests(self) -> None:
        """The starter's tests still describe a reachable program once the five stubs are written."""
        starter = s05()["youDo"]["starterCode"]
        bodies = {
            "normalize_nombre": "return ' '.join(raw.strip().split()).title()",
            "normalize_email": "s = raw.strip().lower()\n    if '@' not in s:\n        raise ValueError('email sin @')\n    return s",
            "normalize_telefono": "return ''.join(c for c in raw if c.isdigit())",
            "normalize_direccion": "return ' '.join(raw.strip().split()).upper()",
        }
        # Any one-line comment above the raise, so this control does not depend on the new wording.
        parts = re.split(r"    # [^\n]*\n    raise NotImplementedError\n", starter)
        self.assertEqual(len(parts), 6)
        fills = [bodies["normalize_nombre"], bodies["normalize_email"], bodies["normalize_telefono"],
                 bodies["normalize_direccion"],
                 "return {'nombres': normalize_nombre(nombres), 'email': normalize_email(email), "
                 "'telefono': normalize_telefono(telefono), 'direccion': normalize_direccion(direccion)}"]
        source = parts[0]
        for fill, rest in zip(fills, parts[1:]):
            source += "    " + fill + "\n" + rest
        done = run_py(source)
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        self.assertTrue(done.stdout.rstrip().endswith("tests OK"))


class SelfCheckAndExamBank(unittest.TestCase):
    def test_selfcheck_keys_are_not_the_longest_option(self) -> None:
        qs = s05()["selfCheck"]["questions"]
        for i in (1, 2, 5, 6):
            q = qs[i]
            with self.subTest(question=i + 1):
                key = q["options"][q["correctIndex"]]
                longest_other = max(len(o) for j, o in enumerate(q["options"]) if j != q["correctIndex"])
                self.assertLessEqual(len(key), longest_other)

    def test_exam_keyword_only_item_names_the_theory_function(self) -> None:
        item = [q for q in bank() if "country=\"PE\"" in q["question"]]
        self.assertEqual(len(item), 1)
        self.assertIn("normalize_telefono_intl", item[0]["question"])
        self.assertIn("normalize_telefono_intl", " ".join(block("Posicionales, keyword y defaults seguros")["paragraphs"]))

    def test_exam_boundaries_item_has_no_shared_opener(self) -> None:
        item = [q for q in bank() if "fronteras conviene cubrir" in q["question"]]
        self.assertEqual(len(item), 1)
        wrong = [o for i, o in enumerate(item[0]["options"]) if i != item[0]["correctIndex"]]
        self.assertFalse(any(o.startswith("Solo") for o in wrong), wrong)
        key = item[0]["options"][item[0]["correctIndex"]]
        self.assertLessEqual(len(key), max(len(o) for o in wrong))

    def test_negative_control_the_bank_scan_reads_the_bank(self) -> None:
        self.assertEqual(len(bank()), 24)


if __name__ == "__main__":
    unittest.main()
