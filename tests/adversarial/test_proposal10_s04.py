"""Proposal 10 (approved 2026-11-11), S04: the P2 and P3 findings of the item-by-item review.

S04 repeats the S03 pattern. Several exercises state a rule (a boundary, a denominator, "do not
hard-code the number") but no case runs it, so a learner who breaks the rule still prints the
pinned output. Those tests are mutation tests: each takes the reference solution, plants the
mistake the finding names, runs it under the course interpreter and requires the exercise to
notice, either by stopping on an assert or by printing something other than the pinned output.
On main every one of those mutants passed unnoticed.

The other findings are about text that does not match what runs (a figure caption whose numbers
do not come from its bars, a callout that names a rate the code does not compute, a starter that
crashes before it shows its planted defect) or about words the course never taught. Those tests
read the section through tsx, so they check what the learner sees.

Negative controls: every reference solution still prints its pinned output, a mutation that does
not change the code raises, an irrelevant edit is not "caught", the term scans really read the
section and the bank, and the figure test recomputes the caption from the bars instead of
trusting either.
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
FIGURES = ROOT / "src" / "components" / "course" / "figures" / "data" / "misc.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section04 }} from {path!r};
console.log(JSON.stringify(section04));
"""


@lru_cache(maxsize=None)
def s04() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s04-iteration-summaries.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S04 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s04()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s04()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s04()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "iteration-summaries"][0]["questions"]


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the exercise notices the planted mistake: an assert stops it or the output differs."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def learner_text() -> str:
    """Every learner-facing string of S04 except the resource list (titles and URLs of other sites)."""
    s = dict(s04())
    s.pop("resources", None)
    return json.dumps(s, ensure_ascii=False)


#: exercise id -> list of (finding, old text, new text).
MUTANTS = {
    "S04-T1-A-E2": [
        ("438 exclusive adult boundary", "if e >= 18:", "if e > 18:"),
    ],
    "S04-T1-B-E3": [
        ("441 comparison that only notices a longer a", "if len(a) != len(b):", "if len(a) > len(b):"),
        ("441 hard-coded lines", 'if len(a) != len(b):\n    print("DESALINEADO")\nelse:\n    print("OK")',
         'print("DESALINEADO")\nprint("OK")'),
    ],
    "S04-T3-A-E2": [
        ("448 denominator leaves the review row out", "n_total = len(sts)",
         'n_total = len([s for s in sts if s != "review"])'),
    ],
    "S04-T4-A-E2": [
        ("454 hard-coded 3", "print(n)", "print(3)"),
    ],
    "S04-T2-B-E3": [
        ("446 END appended before the check", '    if item == "END":\n        break\n    out.append(item)',
         '    out.append(item)\n    if item == "END":\n        break'),
    ],
}

#: You Do boundaries (finding 460): each mutant moves one S03 boundary or drops one rule.
YOUDO_MUTANTS = [
    ("18 treated as a minor", "elif edad < 18:", "elif edad <= 18:"),
    ("120 out of range", "elif edad < 0 or edad > 120:", "elif edad < 0 or edad >= 120:"),
    ("121 accepted", "elif edad < 0 or edad > 120:", "elif edad < 0 or edad > 121:"),
    ("50000 sent to review", "elif monto_ingreso > 50000:", "elif monto_ingreso >= 50000:"),
    ("50001 accepted", "elif monto_ingreso > 50000:", "elif monto_ingreso > 50001:"),
    ("bool accepted as an age", "elif not isinstance(edad, int) or isinstance(edad, bool):",
     "elif not isinstance(edad, int):"),
    ("R-COSTA left out of the catalogue", ' or region == "R-COSTA":', ":"),
    ("rate over the reviewed and rejected only", "tasa_reject = n_reject / len(lote) if lote else None",
     "tasa_reject = n_reject / (n_reject + n_review) if lote else None"),
]


def mutate(code: str, old: str, new: str) -> str:
    return code.replace(old, new)


class ExercisesNoticeTheMistakeTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        for ex_id in list(MUTANTS) + ["S04-T3-B-E3", "S04-T4-B-E3", "S04-T4-A-E3"]:
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
                    self.assertTrue(caught(sol["code"], sol["output"], mutate(sol["code"], old, new)),
                                    f"{ex_id}: the mistake '{finding}' still prints the pinned output")

    def test_negative_control_caught_rejects_a_no_op_mutation(self) -> None:
        sol = exercise("S04-T1-A-E2")["solutionCode"]
        with self.assertRaises(AssertionError):
            caught(sol["code"], sol["output"], mutate(sol["code"], "no such text", "x"))

    def test_negative_control_an_irrelevant_change_is_not_caught(self) -> None:
        sol = exercise("S04-T1-A-E2")["solutionCode"]
        self.assertFalse(caught(sol["code"], sol["output"], sol["code"] + "\n# comentario"))

    def test_starters_still_differ_from_the_solution(self) -> None:
        for ex_id in MUTANTS:
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0
                                 and done.stdout.rstrip() == ex["solutionCode"]["output"].rstrip())

    def test_wedo_12_starter_shows_the_end_bug_instead_of_crashing(self) -> None:
        """Findings 446-447: the starter used to stop on IndexError before printing its defect."""
        ex = exercise("S04-T2-B-E3")
        done = run_py(ex["starterCode"]["code"])
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        self.assertIn("['a', 'b', 'END']", done.stdout)
        self.assertIn("salvaguarda", done.stdout)
        self.assertNotIn("raise", ex["starterCode"]["code"] + ex["solutionCode"]["code"])

    def test_wedo_12_guard_stops_a_buffer_without_end(self) -> None:
        sol = exercise("S04-T2-B-E3")["solutionCode"]["code"]
        no_end = sol.replace('buf = ["a", "b", "END"]', 'buf = ["a", "b"]')
        self.assertNotEqual(no_end, sol)
        done = run_py(no_end)
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        self.assertIn("salvaguarda", done.stdout)

    def test_solutions_use_only_taught_syntax(self) -> None:
        """Findings 453 and 458: `.items()` and `sum(generator)` were never taught in S04."""
        self.assertNotIn(".items()", exercise("S04-T3-B-E3")["solutionCode"]["code"])
        e24 = exercise("S04-T4-B-E3")["solutionCode"]["code"]
        self.assertNotIn("sum(", e24)
        self.assertIn("n_reject += 1", e24)
        self.assertNotIn("sum(", demo("S04-T4-B-DEMO")["code"]["code"])

    def test_wedo_21_trace_has_no_unexplained_copy(self) -> None:
        ex = exercise("S04-T4-A-E3")
        self.assertNotIn("dict(counts)", ex["solutionCode"]["code"] + ex["instruction"] + ex["retrospective"])
        self.assertIn("o 0 si la clave no existe", ex["hint"])


class YouDoChecksItsRubric(unittest.TestCase):
    def test_reference_prints_its_pin(self) -> None:
        sol = s04()["youDo"]["solutionCode"]
        done = run_py(sol["code"])
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_every_boundary_mistake_is_caught(self) -> None:
        sol = s04()["youDo"]["solutionCode"]
        for finding, old, new in YOUDO_MUTANTS:
            with self.subTest(finding=finding):
                self.assertTrue(caught(sol["code"], sol["output"], mutate(sol["code"], old, new)),
                                f"You Do: the mistake '{finding}' still prints the pinned output")

    def test_starter_stops_on_an_assert_not_on_an_exception_from_s09(self) -> None:
        starter = s04()["youDo"]["starterCode"]
        self.assertNotIn("raise", starter)
        done = run_py(starter)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("AssertionError", done.stderr)

    def test_catalogue_is_listed_where_the_learner_decides_region(self) -> None:
        y = s04()["youDo"]
        self.assertIn("(R-NORTE, R-SUR, R-CENTRO, R-COSTA)", y["starterCode"])
        req = " ".join(y["requirements"])
        for value in ("18", "120", "17", "121", "`True`", "50000", "50001", "`R-COSTA`"):
            self.assertIn(value, req)
        self.assertIn("Python se detiene en el primer `assert` que falla", req)
        self.assertIn("`limites`", " ".join(r["criterion"] for r in y["rubric"]))

    def test_conditional_rate_is_glossed(self) -> None:
        self.assertIn("# Si el lote está vacío, la tasa es None; si no, es la división.",
                      s04()["youDo"]["starterCode"])


class TheoryShowsWhatItSays(unittest.TestCase):
    def test_figure_caption_is_computed_from_its_bars(self) -> None:
        text = FIGURES.read_text(encoding="utf-8")
        fig = text[text.index("'S04-loop-invariant'"):]
        fig = fig[:fig.index("note:")]
        values = {m.group(1): int(m.group(2)) for m in re.finditer(r"label: '([^']+)', value: (\d+)", fig)}
        intentadas, procesadas, aceptadas = values["filas intentadas"], values["filas procesadas"], values["aceptadas"]
        caption = block("for, range y secuencias")["figure"]["caption"]
        self.assertIn(f"{aceptadas / procesadas:.2f}", caption)
        self.assertIn(f"{aceptadas / intentadas:.2f}", caption)
        # Same counts as the opening figure: 3 aceptadas, 6 intentadas, 5 que llegan.
        self.assertEqual((intentadas, procesadas, aceptadas), (6, 5, 3))

    def test_opening_defines_intentado_and_procesado(self) -> None:
        paragraphs = " ".join(s04()["theory"][0]["paragraphs"])
        self.assertIn("Un registro **intentado** es cualquiera que entró al lote", paragraphs)
        self.assertIn("uno **procesado** es el que llegó a la decisión final", paragraphs)
        self.assertNotIn("decorador", s04()["theory"][0]["callout"]["content"])

    def test_list_of_regions_matches_its_description(self) -> None:
        b = block("for, range y secuencias")
        self.assertIn("tres regiones", b["paragraphs"][0])
        regiones = re.search(r"regiones = (\[.*\])", b["code"]["code"]).group(1)
        self.assertEqual(len(json.loads(regiones)), 3)

    def test_list_and_len_are_glossed_before_their_first_exercise(self) -> None:
        text = " ".join(block("for, range y secuencias")["paragraphs"])
        self.assertIn("`list(range(3))` convierte el rango en una lista", text)
        self.assertIn("`len(lote)` devuelve cuántos elementos tiene la lista", text)

    def test_one_rate_name_in_the_counters_block(self) -> None:
        b = block("Contadores, acumuladores y búsqueda")
        self.assertIn("`tasa_reject = n_reject / n_total`", " ".join(b["paragraphs"]))
        self.assertTrue(b["callout"]["content"].startswith("Tasa de rechazo = rechazos / registros intentados."))
        self.assertIn("tasa = n_reject / n_total", b["code"]["code"])

    def test_fill_in_block_does_not_print_the_answer(self) -> None:
        b = block("Cómo leer una comprensión de lista")
        self.assertNotEqual(b["code"]["output"].strip(), "[3, 5]")
        self.assertNotIn("escribe `v > 0`", " ".join(b["paragraphs"]))
        done = run_py(b["code"]["code"].replace("v < 0", "v > 0"))
        self.assertEqual(done.stdout.strip(), "[3, 5]")

    def test_set_comprehension_and_sorted_are_taught_before_the_exam_asks(self) -> None:
        b = block("Comprensiones legibles")
        self.assertIn("{s for s in estados}", b["code"]["code"])
        self.assertIn("sin duplicados ['accept', 'reject']", b["code"]["output"])
        self.assertIn("`sorted(...)`", " ".join(b["paragraphs"]))

    def test_dict_counter_is_shown_before_the_demo_that_uses_it(self) -> None:
        b = block("Cómo leer un dict en estos ejemplos")
        self.assertIn('cuenta["accept"] += 1', b["code"]["code"])
        self.assertIn("{'accept': 1, 'reject': 0} True", b["code"]["output"])

    def test_trace_table_has_the_decision_column_its_callout_names(self) -> None:
        b = block("Trazado de estado")
        rows = [r for r in b["code"]["output"].splitlines() if r[:1].isdigit()]
        self.assertEqual(len(rows), 4)
        self.assertTrue(all(len(r.split(" | ")) == 5 for r in rows), rows)
        self.assertNotIn("TRACE", " ".join(b["paragraphs"]))

    def test_cost_block_ties_the_boundary_sentence_to_a_case(self) -> None:
        text = " ".join(block("Costo lineal/cuadrático y off-by-one")["paragraphs"])
        self.assertIn("`edad >= 18` y `edad > 18` deciden distinto justo en el 18", text)
        self.assertNotIn("Debuggea", text)


class NoUntaughtTerms(unittest.TestCase):
    def test_section_uses_no_untaught_english_terms(self) -> None:
        text = learner_text()
        for term in ("gate", "Gate", "Debuggea", "demos rápidas", "map/filter", "Map = ", "batch del",
                     "fin del batch", "tasa_error", "side effects", "try/except"):
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_comprehension_is_spanish_except_the_named_english_term(self) -> None:
        text = learner_text().replace("`dict comprehension`", "")
        self.assertNotIn("comprehension", text.lower())

    def test_negative_control_the_scan_reads_the_section(self) -> None:
        text = learner_text()
        self.assertIn("comprensión", text)
        self.assertIn("CP-N1-A", text)
        self.assertIn("`dict comprehension`", text)


class DemosExplainWhatTheyUse(unittest.TestCase):
    def test_ido_02_shows_the_silent_loss_before_the_check(self) -> None:
        d = demo("S04-T1-B-DEMO")
        self.assertIn("print(list(zip(ids, mal)))", d["code"]["code"])
        self.assertIn("[('C001', 'Lima'), ('C002', 'Cusco')]", d["code"]["output"])

    def test_ido_05_explains_the_wrong_denominator(self) -> None:
        pre = demo("S04-T3-A-DEMO")["preamble"]
        self.assertIn("3 serían los aceptados (2) más el revisado (1)", pre)
        self.assertIn("si `n` es 0, la tasa es `None`", pre)

    def test_ido_08_keeps_its_output_with_explicit_counters(self) -> None:
        d = demo("S04-T4-B-DEMO")
        self.assertTrue(d["code"]["output"].startswith("linear 4 quad 16"))
        self.assertIn("El nombre `_` indica", d["why"])
        self.assertNotIn("de negocio", d["code"]["code"] + d["why"])

    def test_ido_glosses(self) -> None:
        self.assertIn('`ln.startswith("ERROR")` pregunta si el texto empieza por ERROR', demo("S04-T2-B-DEMO")["why"])
        self.assertIn("código 5xx, el grupo de códigos HTTP", demo("S04-T2-B-DEMO")["retrospective"])
        self.assertIn("la lista `buf` de líneas pendientes", demo("S04-T2-A-DEMO")["preamble"])
        self.assertIn("cada ficha del lote", demo("S04-T1-A-DEMO")["preamble"])
        self.assertIn("guardar estado entre vueltas", demo("S04-T3-B-DEMO")["retrospective"])


class ExerciseTextMatchesWhatRuns(unittest.TestCase):
    def test_glosses_for_tools_the_exercises_use(self) -> None:
        self.assertIn("`edades[:1]` toma solo el primer elemento", exercise("S04-T1-B-E2")["instruction"])
        self.assertIn("quita el primer elemento de la lista y lo devuelve", exercise("S04-T2-A-E3")["hint"])
        self.assertIn("falla con `ValueError` si no lo encuentra", exercise("S04-T3-A-E3")["preamble"])
        self.assertIn("sorted(x) devuelve una lista nueva", exercise("S04-T3-B-E2")["hint"])

    def test_tests_line_reads_as_text(self) -> None:
        self.assertEqual(exercise("S04-T2-B-E1")["tests"], "Lima / Cusco (dos líneas)")
        self.assertIn("(truthy)", exercise("S04-T2-B-E1")["retrospective"])

    def test_wedo_06_title_promises_what_it_does(self) -> None:
        ex = exercise("S04-T1-B-E3")
        self.assertEqual(ex["title"], "Comprobar longitudes antes de emparejar")
        self.assertEqual(ex["solutionCode"]["output"].splitlines(), ["DESALINEADO", "OK", "DESALINEADO"])

    def test_loop_count_checks_are_asked_for(self) -> None:
        self.assertIn("debes ver `3 9`", exercise("S04-T4-B-E1")["retrospective"])
        self.assertIn("deben ser `n`, no `n * n`", exercise("S04-T4-B-E3")["retrospective"])


class SelfCheckAndExamBank(unittest.TestCase):
    def test_selfcheck_keys_are_not_the_longest_option(self) -> None:
        qs = s04()["selfCheck"]["questions"]
        for i in (1, 2, 5, 6, 7):
            q = qs[i]
            with self.subTest(question=i + 1):
                key = q["options"][q["correctIndex"]]
                longest_other = max(len(o) for j, o in enumerate(q["options"]) if j != q["correctIndex"])
                self.assertLessEqual(len(key), longest_other)

    def test_selfcheck_denominator_is_intentados_not_procesados(self) -> None:
        q = s04()["selfCheck"]["questions"][2]
        key = q["options"][q["correctIndex"]]
        self.assertIn("intentados", key)
        self.assertNotIn("procesados", key + q["explanation"])
        self.assertNotIn("gate", q["question"])

    def test_exam_uses_no_untaught_terms(self) -> None:
        # The learner reads question, options and explanation; `concept` is an internal key.
        text = json.dumps([[q["question"], q["options"], q["explanation"]] for q in bank()], ensure_ascii=False)
        for term in ("helper", "stream", "MAX_ITERS", "side effects", "sin documentar", "omprehension",
                     "gate", "procesados/intentados", "rejects/procesados", "n_error"):
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_exam_range_len_key_is_the_case_enumerate_does_not_cover(self) -> None:
        item = [q for q in bank() if "range(len(filas))" in q["question"]]
        self.assertEqual(len(item), 1)
        key = item[0]["options"][item[0]["correctIndex"]]
        self.assertIn("reasignar filas[i]", key)
        self.assertNotIn("fila i", key)
        self.assertNotIn("`", key, "the key alone would carry code formatting (test_exam_key_odd_feature)")
        callout = block("for, range y secuencias")["callout"]["content"]
        self.assertIn("`filas[i] = ...`", callout)

    def test_exam_set_item_cites_the_theory_that_teaches_it(self) -> None:
        item = [q for q in bank() if '{r["status"] for r in results}' in q["question"]]
        self.assertEqual(len(item), 1)
        self.assertIn("Comprensiones legibles", item[0]["explanation"])

    def test_negative_control_the_term_scan_reads_the_bank(self) -> None:
        text = json.dumps(bank(), ensure_ascii=False)
        self.assertEqual(len(bank()), 24)
        self.assertIn("enumerate", text)


if __name__ == "__main__":
    unittest.main()
