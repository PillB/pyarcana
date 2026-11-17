"""Proposal 10 (approved 2026-11-11), S02: the P2 and P3 findings of the item-by-item review.

Each test pins one finding. Where the finding is a claim about Python, the test runs the code the
lesson shows (or the old answer) under the course interpreter and compares what really happens
with what the lesson says, so the lesson cannot drift back. Negative controls run the old answer
and show that it still misbehaves: the tip exercise without quantize, the report with a wrong
summary, the exam options that are not the key.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from decimal import Decimal, InvalidOperation
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
FIGURES = ROOT / "src" / "components" / "course" / "figures" / "data" / "misc.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section02 }} from {path!r};
console.log(JSON.stringify(section02));
"""


@lru_cache(maxsize=None)
def s02() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s02-basics.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S02 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s02()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s02()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s02()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def code_of(obj) -> str:
    return obj if isinstance(obj, str) else obj["code"]


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True, text=True,
                              timeout=60, encoding="utf-8")


def all_text() -> str:
    return json.dumps(s02(), ensure_ascii=False)


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "basics"][0]["questions"]


def item(concept: str, variant: int) -> dict:
    return [q for q in bank() if q["concept"] == concept and q["variant"] == variant][0]


def key_is_longest(q: dict) -> bool:
    lengths = [len(o) for o in q["options"]]
    key = q["correctIndex"]
    return lengths[key] >= max(n for i, n in enumerate(lengths) if i != key)


class PythonClaims(unittest.TestCase):
    def test_tip_exercise_tests_the_rounding_policy(self):
        ex = exercise("S02-T3-B-E2")
        solution = code_of(ex["solutionCode"])
        done = run_py(solution)
        self.assertEqual(done.returncode, 0, done.stderr)
        self.assertEqual(done.stdout.strip(), ex["solutionCode"]["output"])
        # Negative control 1: without quantize the asserts must now fail.
        lazy = solution.replace(
            'propina = (cuenta * Decimal("0.10")).quantize(\n    Decimal("0.01"), rounding=ROUND_HALF_EVEN\n)',
            'propina = cuenta * Decimal("0.10")')
        self.assertNotEqual(lazy, solution)
        self.assertNotEqual(run_py(lazy).returncode, 0, "an answer without quantize still passes")
        # Negative control 2: ROUND_HALF_UP gives another cent, so the policy is visible.
        up = solution.replace("rounding=ROUND_HALF_EVEN", "rounding=ROUND_HALF_UP").replace(
            "import Decimal, ROUND_HALF_EVEN", "import Decimal, ROUND_HALF_EVEN, ROUND_HALF_UP")
        self.assertNotEqual(run_py(up).returncode, 0, "HALF_UP and HALF_EVEN give the same cents")
        self.assertIn("ROUND_HALF_UP", ex["feedback"])

    def test_capture_report_checks_the_summary(self):
        ex = exercise("S02-T4-B-E3")
        solution = code_of(ex["solutionCode"])
        done = run_py(solution)
        self.assertEqual(done.stdout.strip(), ex["solutionCode"]["output"])
        self.assertIn("resumen exacto True", done.stdout)
        wrong = solution.replace('resumen = f"Cliente:', 'resumen = f"Cliente :')
        self.assertIn("resumen exacto False", run_py(wrong).stdout)
        self.assertIn("resumen exacto", code_of(ex["starterCode"]))
        self.assertIn("cinco comprobaciones", ex["tests"])

    def test_strip_is_checked_where_int_tolerates_spaces(self):
        self.assertEqual(int(" 21 "), 21)
        ex = exercise("S02-T1-B-E1")
        self.assertIn('edad_clean == "21"', ex["tests"])
        self.assertIn("edad_clean = ____", code_of(ex["starterCode"]))
        self.assertEqual(run_py(code_of(ex["solutionCode"])).stdout.strip(), "21 int")
        theory = " ".join(block("Inspección, conversión y validación")["paragraphs"])
        self.assertIn("`int()` ya ignora los espacios", theory)
        self.assertIn("tolera espacios", item("type-inspect-convert", 1)["explanation"])

    def test_int_of_a_float_truncates_and_the_lesson_says_so(self):
        self.assertEqual(int(19.5), 19)
        theory = " ".join(block("Inspección, conversión y validación")["paragraphs"])
        self.assertIn("`int(19.5)`", theory)
        self.assertIn("descarta la parte decimal", theory)

    def test_eval_none_is_explained(self):
        b = block("Contraejemplo: eval ejecuta lo que llega en la entrada")
        self.assertIn("resultado con eval: None", b["code"]["output"])
        self.assertIn("`print` no devuelve ningún valor", " ".join(b["paragraphs"]))

    def test_value_error_shows_the_clean_text(self):
        with self.assertRaises(ValueError) as caught:
            int("  19 años ".strip())
        self.assertIn("'19 años'", str(caught.exception))
        text = " ".join(block("Contraejemplo: reasignar el texto recibido pierde el original")["paragraphs"])
        self.assertNotIn("el mensaje podrá mostrar el valor original", text)
        self.assertIn("mostrará solo `'19 años'`", text)

    def test_decimal_raises_invalid_operation_not_value_error(self):
        with self.assertRaises(InvalidOperation) as caught:
            Decimal("150,50")
        self.assertNotIsInstance(caught.exception, ValueError)
        theory = " ".join(block("Decimal para dinero y redondeo")["paragraphs"])
        self.assertIn("decimal.InvalidOperation", theory)
        self.assertIn("decimal.InvalidOperation", exercise("S02-T3-B-E3")["retrospective"])

    def test_empty_field_is_decided(self):
        with self.assertRaises(ValueError):
            int("")
        text = " ".join(block("Del texto original al valor interpretado")["paragraphs"])
        self.assertIn('`int("")` lanza el mismo `ValueError`', text)
        self.assertNotIn("`García`, `Ñahui` y `María`", text)

    def test_leading_zero_literal_is_a_syntax_error(self):
        done = run_py("contacto = 007\n")
        self.assertIn("SyntaxError", done.stderr)
        retro = exercise("S02-T1-A-E3")["retrospective"]
        self.assertIn("SyntaxError", retro)
        self.assertNotIn("Perderías los ceros", retro)

    def test_assignment_in_expression_message_is_announced(self):
        ex = exercise("S02-T2-A-E2")
        done = run_py(code_of(ex["starterCode"]))
        self.assertIn(":=", done.stderr, "negative control: Python still suggests :=")
        self.assertIn("`:=`", ex["instruction"])

    def test_is_with_int_literal_warning_is_announced(self):
        ex = exercise("S02-T2-B-E1")
        done = run_py(code_of(ex["solutionCode"]))
        self.assertIn('SyntaxWarning: "is" with \'int\' literal', done.stderr)
        self.assertIn("SyntaxWarning", ex["instruction"])
        self.assertNotIn("singletons", code_of(ex["solutionCode"]))

    def test_changing_edad_changes_two_lines(self):
        d = demo("S02-T2-A-DEMO")
        before = run_py(d["code"]["code"]).stdout.splitlines()
        after = run_py(d["code"]["code"].replace("edad = 25", "edad = 18")).stdout.splitlines()
        changed = sum(1 for a, b in zip(before, after) if a != b)
        self.assertEqual(changed, 2)
        self.assertIn("solo cambian dos líneas", d["retrospective"])

    def test_topic_task_names_a_subtotal_that_shows_the_float_error(self):
        self.assertEqual(repr(80 * (1 + 0.18)), "94.39999999999999")
        tasks = json.dumps(s02()["topicEvaluations"], ensure_ascii=False)
        self.assertIn("subtotal 80", tasks)
        self.assertIn("94.39999999999999", tasks)


class Wording(unittest.TestCase):
    def test_header_does_not_promise_csv_reading(self):
        self.assertNotIn("leer campos de un formulario o de un archivo CSV", s02()["jobRelevance"])
        self.assertIn("S08", s02()["jobRelevance"])

    def test_no_function_promised_in_s02(self):
        d = demo("S02-T4-A-DEMO")
        self.assertNotIn("función que simula prompts", d["retrospective"])
        self.assertNotIn("Pyodide/CI", d["why"])
        q = item("io-fstrings", 3)
        self.assertNotIn("simular_intake", q["question"])
        self.assertNotIn("función pura", json.dumps(q, ensure_ascii=False))

    def test_untaught_terms_are_gone(self):
        text = all_text()
        for phrase in ("original[:]", "pow con float", "peruana de data", "No encodes a ascii",
                       "Obligatorio en datos peruanos", "evitaste en T3-B", "Recorrido visible: original, limpio, convertido y fallo observado"):
            with self.subTest(phrase=phrase):
                self.assertNotIn(phrase, text)
        exam = json.dumps(bank(), ensure_ascii=False)
        for phrase in ("walrus", "safe_int", "sin error ASCII"):
            with self.subTest(phrase=phrase):
                self.assertNotIn(phrase, exam)

    def test_igv_is_expanded_at_first_prose_use(self):
        prose = [p for b in s02()["theory"] for p in b.get("paragraphs", []) + [b.get("figure", {}).get("caption", "")]]
        first = next(p for p in prose if re.search(r"(?<![\w`])IGV(?![\w])", p))
        self.assertIn("Impuesto General a las Ventas", first)

    def test_copy_instruction_assigns_the_copy(self):
        callout = block("Identidad, mutabilidad y copias superficiales")["callout"]["content"]
        self.assertIn("`clean = raw.copy()`", callout)

    def test_truthiness_figure_stays_in_s02_scope(self):
        src = FIGURES.read_text(encoding="utf-8")
        entry = src.split("'S02-truthiness': {", 1)[1].split("\n  },", 1)[0]
        self.assertNotIn(" if", entry)
        self.assertNotIn("truthiness", entry)
        self.assertIn("is None", entry)

    def test_money_float_exercise_says_it_is_practice(self):
        self.assertIn("un precio real en soles irá en `Decimal`", exercise("S02-T1-B-E3")["instruction"])

    def test_greeting_test_is_exact(self):
        self.assertIn("Hola, José. Bienvenido al intake.", exercise("S02-T4-A-E1")["tests"])

    def test_transfer_hint_does_not_give_the_answer(self):
        hints = " ".join(exercise("S02-T4-A-E3")["hints"])
        self.assertNotIn("type(nombres).__name__", hints)

    def test_table_headers_are_shown(self):
        self.assertIn("Teléfono / Cel", code_of(exercise("S02-T2-A-E3")["starterCode"]))

    def test_project_asserts_protect_originals(self):
        yd = s02()["youDo"]
        self.assertIn('assert edad_raw == " 28 "', yd["starterCode"])
        self.assertIn('assert monto_raw == " 150.505 "', yd["starterCode"])
        self.assertTrue(any("valores convertidos son los esperados" in r for r in yd["requirements"]))


class Quiz(unittest.TestCase):
    def test_selfcheck_phone_item_has_no_length_cue(self):
        q = s02()["selfCheck"]["questions"][2]
        self.assertFalse(key_is_longest(q))

    def test_rewritten_exam_items_have_no_length_cue(self):
        for concept, variant in (("literals-types", 2), ("literals-types", 3), ("assignment-naming", 3),
                                 ("decimal-money", 2), ("decimal-money", 3), ("io-fstrings", 2),
                                 ("io-fstrings", 3), ("parse-error-messages", 2), ("parse-error-messages", 3)):
            with self.subTest(concept=concept, variant=variant):
                self.assertFalse(key_is_longest(item(concept, variant)))

    def test_fstring_item_only_the_key_prints_the_line(self):
        q = item("io-fstrings", 2)
        target = "Cliente: José | S/ 150.50"
        self.assertIn(target, q["question"])
        outputs = [run_py(f'nombre = "José"\nmonto = 150.5\n{opt}\n').stdout.strip() for opt in q["options"]]
        self.assertEqual([i for i, out in enumerate(outputs) if out == target], [q["correctIndex"]])

    def test_igv_item_only_the_key_gives_cents(self):
        from decimal import ROUND_HALF_EVEN  # noqa: F401  (names the options may use)
        q = item("decimal-money", 3)
        subtotal = Decimal("100.00")
        good = []
        for i, opt in enumerate(q["options"]):
            value = eval(opt, {"Decimal": Decimal, "subtotal": subtotal})  # noqa: S307 - fixed bank text
            if value == Decimal("18.00") and value.as_tuple().exponent == -2:
                good.append(i)
        self.assertEqual(good, [q["correctIndex"]])

    def test_assignment_item_really_is_a_syntax_error(self):
        q = item("assignment-naming", 3)
        code = re.search(r"`([^`]+)`", q["question"]).group(1)
        done = run_py("edad = 1\n" + code + "\n")
        self.assertIn("SyntaxError", done.stderr)
        self.assertTrue(q["options"][q["correctIndex"]].startswith("SyntaxError"))


if __name__ == "__main__":
    unittest.main()
