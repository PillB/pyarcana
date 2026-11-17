"""Proposal 10 (approved 2026-11-11), S03: the P2 and P3 findings of the item-by-item review.

Most S03 findings say the same thing about different exercises: the exercise states a boundary
or a rule, but no case runs it, so a learner who gets it wrong still prints the pinned output.
Those tests are mutation tests. Each one takes the reference solution, plants the mistake the
finding names, runs it under the course interpreter, and requires the exercise to notice: the
program must stop on an assert or print something other than the pinned output. On main every
one of those mutants passed unnoticed.

Negative controls: the unmutated solution must still print the pinned output (so a mutant that
"differs" is not differing because the reference is broken), and every mutation must really
change the code (so a mutation that silently did not apply cannot pass as "caught").
"""

from __future__ import annotations

import ast
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
import {{ section03 }} from {path!r};
console.log(JSON.stringify(section03));
"""


@lru_cache(maxsize=None)
def s03() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s03-decisions-rules.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S03 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s03()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def block_with_title(title: str) -> dict:
    hits = [b for b in s03()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block titled {title!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s03()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s03()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def run_py(source: str, *flags: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", *flags, str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "decisions-rules"][0]["questions"]


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the exercise notices the planted mistake: an assert stops it or the output differs."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


#: exercise id -> list of (finding, old text, new text, count) mutations of the solution.
#: count=None replaces every occurrence; a regex is marked with a leading "re:".
MUTANTS = {
    "S03-T1-A-E1": [
        ("386 edad > 18 for the minimum", "print(edad >= 18)", "print(edad > 18)", None),
        ("386 exclusive interval", "18 <= edad <= 65", "18 < edad < 65", None),
    ],
    "S03-T1-A-E2": [
        ("388 == instead of in", r"re:print\((codigo_\d) in CODIGOS_PERMITIDOS\)", r'print(\1 == "DNI")', None),
    ],
    "S03-T1-A-E3": [
        ("389 negative rule removed", 'elif monto < 0:\n    estado = "reject"\n', "", None),
    ],
    "S03-T1-B-E1": [
        ("391 == None kept instead of is None", "is None)", "== None)", None),
    ],
    "S03-T2-A-E3": [
        ("394 >= 100 at the upper threshold", "numero > 100", "numero >= 100", None),
        ("394 >= 0 at the lower threshold", "numero > 0", "numero >= 0", None),
    ],
    "S03-T2-B-E1": [
        ("395 range guard dropped", "elif edad < 0 or edad > 120:", "elif False:", None),
    ],
    "S03-T2-B-E2": [
        ("396 flat boundary moved", "\nelif monto <= 10000:", "\nelif monto < 10000:", None),
        ("396 flat negative rule dropped", 'elif monto < 0:\n    estado_plano = "reject"\n', "", None),
    ],
    "S03-T3-A-E2": [
        ("398 >= at 50000.00", '> Decimal("50000.00")', '>= Decimal("50000.00")', None),
    ],
    "S03-T3-B-E3": [
        ("401 18 excluded", "18 <= edad", "18 < edad", None),
        ("401 65 excluded", r"re:(edad_\d) <= 65", r"\1 < 65", None),
    ],
    "S03-T4-A-E1": [
        ("402 0 excluded", "0 <= edad <= 120", "0 < edad <= 120", None),
    ],
    "S03-T4-A-E3": [
        ("403 66-120 sent to reject", 'else:\n    decision = "review"', 'else:\n    decision = "reject"', None),
    ],
    "S03-T4-B-E3": [
        ("407 >= at 50000", "elif monto > 50000:", "elif monto >= 50000:", None),
    ],
}


def mutate(code: str, old: str, new: str) -> str:
    if old.startswith("re:"):
        return re.sub(old[3:], new, code)
    return code.replace(old, new)


class ExercisesNoticeTheMistakeTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        for ex_id in MUTANTS:
            with self.subTest(exercise=ex_id):
                sol = exercise(ex_id)["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_every_named_mistake_is_caught(self) -> None:
        for ex_id, mutations in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new, _count in mutations:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertTrue(caught(sol["code"], sol["output"], mutate(sol["code"], old, new)),
                                    f"{ex_id}: the mistake '{finding}' still prints the pinned output")

    def test_negative_control_caught_rejects_a_no_op_mutation(self) -> None:
        sol = exercise("S03-T1-A-E1")["solutionCode"]
        with self.assertRaises(AssertionError):
            caught(sol["code"], sol["output"], sol["code"])

    def test_negative_control_an_irrelevant_change_is_not_caught(self) -> None:
        sol = exercise("S03-T1-A-E1")["solutionCode"]
        self.assertFalse(caught(sol["code"], sol["output"], sol["code"] + "\n# comentario"))

    def test_t1_b_e1_starter_shows_the_any_defect(self) -> None:
        """ANY == 0 is True, so the starter's crossed question prints the wrong answer."""
        ex = exercise("S03-T1-B-E1")
        done = run_py(ex["starterCode"]["code"])
        self.assertIn("comodín ausente → True", done.stdout)
        self.assertIn("comodín ausente → False", ex["solutionCode"]["output"])

    def test_planted_boundary_defects_are_visible_in_the_starter(self) -> None:
        for ex_id in ("S03-T3-A-E2", "S03-T3-B-E3", "S03-T4-A-E1", "S03-T2-A-E3"):
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0 and done.stdout.rstrip() == ex["solutionCode"]["output"].rstrip())


class ExerciseTextMatchesWhatRuns(unittest.TestCase):
    def test_wedo_02_retrospective_does_not_presuppose_a_member(self) -> None:
        retro = exercise("S03-T1-A-E2")["retrospective"]
        self.assertNotIn("¿cuál debe dar `True` según el catálogo?", retro)
        self.assertIn("ninguno aparece en el catálogo", retro)
        catalogo = {"DNI", "CE", "PAS"}
        self.assertEqual(("RUC" in catalogo, "Ruc" in catalogo), (False, False))

    def test_wedo_04_retrospective_has_a_verb(self) -> None:
        retro = exercise("S03-T1-B-E1")["retrospective"]
        self.assertNotIn("cuando unas dos preguntas", retro)
        self.assertIn("cuando combines dos preguntas", retro)

    def test_wedo_06_feedback_names_the_type_error_the_starter_raises(self) -> None:
        ex = exercise("S03-T1-B-E3")
        done = run_py(ex["starterCode"]["code"])
        self.assertIn("TypeError", done.stderr)
        self.assertIn("TypeError", ex["feedback"])
        self.assertIn("monto is None", ex["feedback"])

    def test_wedo_15_counts_the_assert_lines_it_has(self) -> None:
        ex = exercise("S03-T3-A-E3")
        n = len([l for l in ex["starterCode"]["code"].splitlines() if l.startswith("assert ")])
        self.assertEqual(n, 4)
        self.assertIn("Los cuatro `assert`", ex["instruction"])
        self.assertNotIn("ocho", ex["instruction"])

    def test_success_lines_use_the_printed_format(self) -> None:
        for ex_id in ("S03-T4-B-E1", "S03-T4-B-E2", "S03-T4-B-E3"):
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                exito = [l for l in ex["preamble"].split("\n") if l.startswith("- **Éxito:**")][0]
                quoted = re.findall(r"`(CASO [^`]+)`", exito)
                self.assertGreaterEqual(len(quoted), 3, exito)
                for q in quoted:
                    self.assertIn(q, ex["solutionCode"]["output"])

    def test_wedo_22_says_the_message_check_is_exact(self) -> None:
        ex = exercise("S03-T4-B-E1")
        self.assertIn("Usa exactamente la frase que espera el `assert` de `mensaje`", ex["instruction"])

    def test_one_name_for_the_top_level_constraint(self) -> None:
        text = json.dumps(s03()["weDo"], ensure_ascii=False)
        for old in ("sentencias superiores", "decisiones superiores", "sentencias de nivel superior"):
            self.assertNotIn(old, text)
        self.assertIn("**nivel superior** significa código escrito fuera de cualquier función", s03()["weDo"]["intro"])

    def test_wedo_13_names_its_four_region_catalogue(self) -> None:
        ex = exercise("S03-T3-A-E1")
        self.assertIn("`R-COSTA`", ex["preamble"])
        self.assertIn('"R-COSTA"', ex["solutionCode"]["code"])

    def test_wedo_17_uses_absence_only_for_none(self) -> None:
        ex = exercise("S03-T3-B-E2")
        self.assertNotIn("Un valor ausente de la lista permitida", ex["preamble"])
        self.assertNotIn("fila vecina `MISSING`", ex["retrospective"])


class NoUntaughtMatchPromise(unittest.TestCase):
    def test_no_learner_text_promises_match(self) -> None:
        """No section teaches match/case (checked: no `match x:` statement in any section)."""
        visible = json.dumps(s03(), ensure_ascii=False)
        self.assertNotIn("enseñe `match`", visible)
        self.assertNotIn("enseñe esa sintaxis", visible)
        self.assertNotIn("en match", demo("S03-T3-B-DEMO")["description"])
        self.assertNotIn("match", demo("S03-T3-B-DEMO")["code"]["title"])

    def test_negative_control_no_section_teaches_a_match_statement(self) -> None:
        pattern = re.compile(r"^\s*match [\w.\[\]\"']+:\s*$", re.M)
        hits = [p.name for p in SECTIONS.glob("*.ts") if pattern.search(p.read_text(encoding="utf-8"))]
        self.assertEqual(hits, [])
        self.assertTrue(pattern.search("match codigo:\n    case 1: pass"))


class TheoryShowsWhatItWarns(unittest.TestCase):
    def test_is_and_case_counterindications_run(self) -> None:
        b = block_with_title("comparaciones_intake.py")
        done = run_py(b["code"]["code"])
        self.assertEqual(done.returncode, 0, done.stderr)
        self.assertEqual(done.stdout.rstrip("\n"), b["code"]["output"])
        for line in ("copia is monto → False", "copia == monto → True",
                     "'r-norte' in REGIONES_PERMITIDAS → False", "'r-norte'.upper() in REGIONES_PERMITIDAS → True"):
            self.assertIn(line, done.stdout)
        self.assertNotIn("SyntaxWarning", done.stderr)

    def test_two_ifs_overwrite_counterexample(self) -> None:
        b = block("Contraejemplo: dos `if` seguidos sobrescriben la decisión")
        code = b["code"]["code"]
        self.assertTrue(code.startswith("# Error"))
        self.assertIn("# Corrección", code)
        self.assertNotIn("subtopicId", b)
        done = run_py(code)
        self.assertEqual(done.stdout, "dos if: 95 → review\nif/elif: 95 → accept\n")
        self.assertEqual(done.stdout.rstrip("\n"), b["code"]["output"])

    def test_dead_branch_line_is_computed(self) -> None:
        blocks = [t for t in s03()["theory"] if "resultado_menos_2" in (t.get("code") or {}).get("code", "")]
        self.assertEqual(len(blocks), 1)
        b = blocks[0]
        self.assertNotIn('print("x > 5 es una rama muerta")', b["code"]["code"])
        tree = ast.parse(b["code"]["code"])
        literal_only = [n.lineno for n in ast.walk(tree) if isinstance(n, ast.Call)
                        and getattr(n.func, "id", "") == "print"
                        and all(isinstance(a, ast.Constant) for a in n.args)]
        self.assertEqual(literal_only, [], "a print with only literal text is not evidence")
        self.assertEqual(run_py(b["code"]["code"]).stdout.rstrip("\n"), b["code"]["output"])

    def test_invariant_block_runs_121(self) -> None:
        b = block("Invariantes: promesas que el dato debe cumplir")
        self.assertIn("`121`", " ".join(b["paragraphs"]))
        done = run_py(b["code"]["code"])
        self.assertIn("121 → reject esperado reject → True", done.stdout)
        self.assertEqual(done.stdout.rstrip("\n"), b["code"]["output"])

    def test_assert_transcript_shows_and_matches_its_files(self) -> None:
        code = block("Contraejemplo: `python -O` deja pasar lo que `assert` detenía")["code"]["code"]
        files = dict(re.findall(r"\$ cat (\w+\.py)\n(.*?)\n(?=\$ )", code, re.S))
        self.assertEqual(sorted(files), ["assert_edad.py", "validar_edad.py"])
        plain = run_py(files["assert_edad.py"])
        self.assertIn("AssertionError: edad negativa", plain.stderr)
        self.assertIn("AssertionError: edad negativa", code)
        self.assertEqual(run_py(files["assert_edad.py"], "-O").stdout, "edad aceptada: -5\n")
        self.assertIn("$ python3 -O assert_edad.py\nedad aceptada: -5", code)
        self.assertEqual(run_py(files["validar_edad.py"], "-O").stdout, "reject: edad negativa\n")
        self.assertIn("$ python3 -O validar_edad.py\nreject: edad negativa", code)

    def test_rule_catalogue_matches_the_chain(self) -> None:
        b = block("Reglas de dominio: rangos y listas permitidas")
        text = " ".join(b["paragraphs"])
        self.assertIn('`{"R-NORTE", "R-SUR", "R-CENTRO", "R-COSTA"}`', text)
        self.assertNotIn("el `set` de T1-A, `REGIONES_PERMITIDAS = {\"R-NORTE\", \"R-SUR\", \"R-CENTRO\"}`, expresa la misma regla", text)
        # The claim in the text: with the three-region set, (R-COSTA, 15) changes decision.
        three = {"R-NORTE", "R-SUR", "R-CENTRO"}
        four = three | {"R-COSTA"}
        def decide(catalogue, region, edad):
            if region not in catalogue:
                return "review"
            return "accept" if 18 <= edad <= 65 else "reject"
        self.assertEqual((decide(three, "R-COSTA", 15), decide(four, "R-COSTA", 15)), ("review", "reject"))
        self.assertIn("R-COSTA 15 → reject", b["code"]["output"])

    def test_cadena_means_text_in_the_messages_block(self) -> None:
        b = block("Mensajes accionables y comprobaciones por rama")
        self.assertNotIn("La cadena tiene tres ramas", " ".join(b["paragraphs"]))

    def test_result_variables_are_mapped_once(self) -> None:
        b = block("Invariantes: promesas que el dato debe cumplir")
        text = " ".join(b["paragraphs"])
        self.assertIn("`status`, `code` y `message`; significan lo mismo", text)
        self.assertNotIn("como en el resto de la sección", text)


class OutcomesAndDemos(unittest.TestCase):
    def test_outcomes_define_what_they_use(self) -> None:
        outcomes = " ".join(o["text"] for o in s03()["learningOutcomes"])
        self.assertNotIn("salidas tempranas", json.dumps(s03(), ensure_ascii=False))
        self.assertNotIn("aparece dentro de una cadena", outcomes)
        self.assertIn("coincide con un elemento completo de un catálogo", outcomes)

    def test_ido_02_decides_the_empty_note(self) -> None:
        d = demo("S03-T1-B-DEMO")
        tree = ast.parse(d["code"]["code"])
        tests_on_nota = [n for n in ast.walk(tree) if isinstance(n, ast.If)
                         and "nota" in ast.unparse(n.test)]
        self.assertTrue(tests_on_nota, "no if/elif decides the note")
        done = run_py(d["code"]["code"])
        self.assertEqual(done.stdout.rstrip("\n"), d["code"]["output"])
        self.assertIn("policy nota vacía → review", done.stdout)

    def test_ido_04_title_promises_only_what_it_shows(self) -> None:
        d = demo("S03-T2-B-DEMO")
        self.assertNotIn("pirámide", d["description"])
        self.assertNotIn("validate_edad", d["description"] + d["code"]["title"])
        self.assertNotIn("def ", d["code"]["code"])
        self.assertIn("aquí se declaran a mano", d["code"]["code"])

    def test_ido_05_names_its_catalogue(self) -> None:
        d = demo("S03-T3-A-DEMO")
        self.assertIn("`R-COSTA`", d["preamble"])

    def test_ido_08_has_the_120_assert_its_retrospective_names(self) -> None:
        d = demo("S03-T4-B-DEMO")
        code = d["code"]["code"]
        self.assertIn("edad = 120", code)
        self.assertEqual(run_py(code).stdout.rstrip("\n"), d["code"]["output"])
        mutated = code.replace("edad > 120", "edad >= 120")
        self.assertNotEqual(mutated, code)
        self.assertNotEqual(run_py(mutated).returncode, 0, "the 120 assert must stop the mutant")

    def test_ido_01_preamble_sentence_split(self) -> None:
        pre = demo("S03-T1-A-DEMO")["preamble"]
        self.assertIn("catálogo de regiones completas. `in` y `not in`", pre)


class YouDoChecksItsRubric(unittest.TestCase):
    def _edad_chain(self, edad: int) -> str:
        starter = s03()["youDo"]["starterCode"]
        start = starter.index("edad_caso = 17")
        end = starter.index('print("EDAD:"')
        chain = starter[start:end] + 'print(edad_estado, edad_codigo)\n'
        fixed = chain.replace('''    # DEFECTO: una persona menor requiere revisión, no rechazo.
    edad_estado = "reject"
    edad_codigo = "OUT_OF_RANGE"
    edad_mensaje = "Edad rechazada."''', '''    edad_estado = "review"
    edad_codigo = "NEEDS_REVIEW"
    edad_mensaje = "Edad menor de 18; revisa el caso."''')
        self.assertNotEqual(fixed, chain, "the required fix did not apply")
        return fixed.replace("edad_caso = 17", f"edad_caso = {edad}")

    def test_negative_age_is_rejected_after_the_required_fix(self) -> None:
        self.assertEqual(run_py(self._edad_chain(-1)).stdout, "reject OUT_OF_RANGE\n")

    def test_negative_control_the_fixed_chain_still_reviews_17_and_accepts_18(self) -> None:
        self.assertEqual(run_py(self._edad_chain(17)).stdout, "review NEEDS_REVIEW\n")
        self.assertEqual(run_py(self._edad_chain(18)).stdout, "accept OK\n")
        self.assertEqual(run_py(self._edad_chain(120)).stdout, "accept OK\n")
        self.assertEqual(run_py(self._edad_chain(121)).stdout, "reject OUT_OF_RANGE\n")

    def test_boundaries_are_named_in_requirements_and_rubric(self) -> None:
        y = s03()["youDo"]
        req = " ".join(y["requirements"])
        for value in ("`18`", "`120`", "`-1`", "`50000`"):
            self.assertIn(value, req)
        rubric = " ".join(r["criterion"] for r in y["rubric"])
        self.assertIn("18, 120, -1 y 50000", rubric)

    def test_prediction_can_be_checked_one_failure_at_a_time(self) -> None:
        self.assertIn("Python se detiene en el primer `assert` que falla", s03()["youDo"]["context"])


class SelfCheckAndExamBank(unittest.TestCase):
    def test_selfcheck_02_states_the_policy_and_drops_the_cue(self) -> None:
        q = s03()["selfCheck"]["questions"][1]
        self.assertIn("invariante que admite el cero", q["question"])
        key = q["options"][q["correctIndex"]]
        self.assertNotIn("si el invariante lo permite", key)
        self.assertLess(len(key), max(len(o) for i, o in enumerate(q["options"]) if i != q["correctIndex"]))

    def test_exam_uses_no_untaught_terms(self) -> None:
        text = json.dumps(bank(), ensure_ascii=False)
        for term in ("O(1)", "hard-fail", "decision table", "el gate", "gate CP-N1-A", "trío",
                     "el default", "except: pass"):
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_negative_control_the_term_scan_reads_the_bank(self) -> None:
        text = json.dumps(bank(), ensure_ascii=False)
        self.assertEqual(len(bank()), 24)
        self.assertIn("tabla de decisión", text)

    def test_exam_or_item_differs_from_the_selfcheck_and_its_key_is_true(self) -> None:
        sc = [q["question"] for q in s03()["selfCheck"]["questions"]]
        item = [q for q in bank() if q["concept"] == "truthiness-shortcircuit" and " or " in q["question"]]
        self.assertEqual(len(item), 1)
        q = item[0]
        expr = re.search(r"`([^`]+ or [^`]+)`", q["question"]).group(1)
        self.assertFalse(any(expr in s for s in sc), "the exam repeats the self-check expression")
        value = eval(expr, {"__builtins__": {}})  # noqa: S307 - a literal expression from the bank
        self.assertTrue(q["options"][q["correctIndex"]].startswith(repr(value) if isinstance(value, str) else str(value)))
        for i, opt in enumerate(q["options"]):
            if i != q["correctIndex"]:
                self.assertFalse(opt.startswith(str(value) + ","), opt)


if __name__ == "__main__":
    unittest.main()
