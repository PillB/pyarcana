'''Proposal 12 (approved 2026-11-21), S27: the P1, P2 and P3 findings of the item-by-item review.

S27 teaches a pytest strategy for the entity-resolution engine: the risk pyramid, AAA and oracles,
discovery and assertions, fixtures and scopes, borders (exceptions, floats, dates, temporary files),
negative cases, branch coverage by risk, and conceptual mutation. The review found four shapes.

First, a P1 in the exam: the mutation-testing item was keyed to "Borrar todos los asserts para ir
más rápido", the opposite of what the section teaches.

Second, code that did not do what its prose said: a discovery demo whose node ids were typed by
hand, so renaming a test changed nothing; a test that compared a literal with itself; an 11-digit
validator that accepted a superscript digit; a band count printed as if it were a coverage report;
a mutation callout about casefold over a mutant that removed the collapse of spaces.

Third, exercises a wrong answer passed: one fixture where the usual mistake printed the same thing
(sort by impact alone, take the first row, check the type and not the message, drop the mutant
condition), a "regression test" that printed a boolean and exited 0, and a "keep the assert" limit
that no run checked.

Fourth, vocabulary: "ofensivo" for the value that caused the error, "clerical queue" for S13's cola
clerical, three spellings of the bands, a contract layer the pyramid never taught, a house process
name (bug_repro -> regression_test) used as a known term, and package, conftest.py, pytest-randomly
and the isclose defaults used without being taught.
'''
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s27-async-concurrency.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

VENV_PY = ROOT / ".venv-content/bin/python"
if VENV_PY.exists():
    CONTENT_PY: Path | None = VENV_PY
elif os.environ.get("PYARCANA_PINNED_CONTENT_ENV") == "1":
    CONTENT_PY = Path(sys.executable)
else:
    CONTENT_PY = None
#: The snippets use only the standard library, but their pins are the 3.12 output the runtime audit
#: checks, so they run under the same interpreter and nowhere else.
needs_content_py = unittest.skipUnless(
    CONTENT_PY, "needs the pinned content interpreter (Python 3.12, the interpreter the pins were taken with)")

#: A dynamic import, read from the named export or from `default`: Node 20 (content-gates) exposes
#: a .ts module's exports in this CommonJS package only on `default`. See docs/agents/lessons.md.
DUMP = """
const mod = await import({path!r});
const section = mod.section27 ?? mod.default?.section27;
if (!section) throw new Error('section27 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s27() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S27 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s27()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s27()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s27()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_strings(node, key: str = "") -> list[str]:
    """Prose a learner reads: every string except code, pinned output and URLs."""
    if key in ("code", "starterCode", "solutionCode", "output", "url"):
        return []
    if isinstance(node, str):
        return [node]
    if isinstance(node, dict):
        return [s for k, v in node.items() for s in learner_strings(v, k)]
    if isinstance(node, list):
        return [s for v in node for s in learner_strings(v, key)]
    return []


def run_py(source: str) -> subprocess.CompletedProcess:
    if CONTENT_PY is None:
        raise unittest.SkipTest("needs the pinned content interpreter")
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([str(CONTENT_PY), "-I", str(path)], capture_output=True,
                              text=True, timeout=120, encoding="utf-8", cwd=tmp)


def stdout_of(source: str) -> str:
    done = run_py(source)
    if done.returncode != 0:
        raise AssertionError("snippet raised: " + done.stderr[-600:])
    return done.stdout.rstrip("\n")


def escaped(solution: str, pinned: str, mutated_code: str) -> str:
    """Empty when the planted mistake shows (the run fails or the output differs from the pin).

    Otherwise it is what the mutant printed, so a failure says which behaviour survived."""
    if mutated_code == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated_code)
    if done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n"):
        return ""
    return "exit 0 and the pinned output:\n" + done.stdout[-400:]


def caught(solution: str, pinned: str, mutated_code: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    return escaped(solution, pinned, mutated_code) == ""


def mutated(code: str, old: str, new: str) -> str:
    if code.count(old) != 1:
        raise AssertionError(f"mutation anchor found {code.count(old)} times: {old!r}")
    return code.replace(old, new)




#: Exercises whose single printed result already separates the usual mistake, which MUTATIONS plants.
ONE_FIXTURE_SEPARATES = {
    "S27-T1-A-E1", "S27-T1-A-E2", "S27-T1-A-E3", "S27-T1-B-E1", "S27-T1-B-E3", "S27-T2-A-E1",
    "S27-T2-A-E3", "S27-T2-B-E1", "S27-T2-B-E2", "S27-T3-A-E2", "S27-T3-B-E1", "S27-T4-A-E1",
    "S27-T4-A-E3", "S27-T4-B-E1", "S27-T4-B-E2", "S27-T4-B-E3",
}

#: Words the review removed from learner-facing text and code.
GONE = ("ofensivo", "clerical queue", "bug_repro", "regression_test", "el learner", "honestable",
        "unit/contract", "factory-like", "defecto intencional")


def all_code() -> list[tuple[str, str]]:
    out = [(b.get("subtopicId", b["heading"]), b["code"]["code"]) for b in s27()["theory"] if b.get("code")]
    out += [(d["demoId"], d["code"]["code"]) for d in s27()["iDo"]["steps"]]
    for e in s27()["weDo"]["steps"]:
        out += [(e["id"] + " starter", e["starterCode"]["code"]), (e["id"], e["solutionCode"]["code"])]
    out.append(("youDo", s27()["youDo"]["starterCode"]))
    return out


class EveryPinRuns(unittest.TestCase):
    @needs_content_py
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        # A supplemental block has no subtopicId; name it by heading. The count is a floor, not a
        # ceiling: it catches a lost example without blocking an added one (AGENTS.md).
        snippets = [(b.get("subtopicId") or b["heading"], b["code"]) for b in s27()["theory"]
                    if b.get("code") and b["code"]["language"] == "python"]
        snippets += [(d["demoId"], d["code"]) for d in s27()["iDo"]["steps"]]
        self.assertGreaterEqual(len(snippets), 16, f"a theory or demo example was lost: {[n for n, _ in snippets]}")
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s27()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                pin = e["solutionCode"]["output"].rstrip("\n")
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), pin)
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != pin,
                                "the starter already prints the expected output")

    def test_every_pin_holds_more_than_one_result(self) -> None:
        planted = {ex_id for ex_id, _, _ in MUTATIONS}
        for e in s27()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                if e["id"] in ONE_FIXTURE_SEPARATES:
                    self.assertIn(e["id"], planted)
                    continue
                self.assertGreater(len(e["solutionCode"]["output"].strip().splitlines()), 1)

    def test_no_code_prints_a_literal_true(self) -> None:
        """THEORY-03, THEORY-05, THEORY-11.3, IDO-01, IDO-08.1: a printed constant carried no information."""
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotRegex(code, r'print\(\s*"[a-z_]+",\s*True\s*\)')


class TheCodeDoesWhatTheProseSays(unittest.TestCase):
    @needs_content_py
    def test_discovery_builds_the_list_from_the_module(self) -> None:
        """IDO-03.1: renaming a test changes what runs."""
        dm = demo("S27-T2-A")["code"]
        self.assertIn('startswith("test_")', dm["code"])
        renamed = mutated(dm["code"], "def test_email_normalized():", "def check_email():")
        self.assertEqual(stdout_of(renamed).splitlines()[-1], "n_tests 1")
        # Negative control: with the old hand-typed list, the same rename stops the script.
        old = ('def test_email_domain():\n    assert "x@example.pe".endswith("@example.pe")\n'
               'node_ids = ["test_exact_after_norm", "test_email_domain"]\n')
        old_renamed = old.replace("def test_email_domain", "def check_email") + "test_email_domain()\n"
        self.assertNotEqual(run_py(old_renamed).returncode, 0)

    @needs_content_py
    def test_the_email_test_calls_normalize_name(self) -> None:
        """IDO-03.2: a broken normalize_name now fails the second test."""
        dm = demo("S27-T2-A")["code"]["code"]
        bodies = re.findall(r"def (test_email\w*)\(\):\n((?:    .*\n)+)", dm)
        self.assertEqual(len(bodies), 1, "expected one email test in the demo")
        name, body = bodies[0]
        self.assertIn("normalize_name(", body)
        # With normalize_name broken, the email test alone now fails.
        defs = dm.split("# Lo que hace pytest")[0]
        broken = mutated(defs, '    return " ".join(s.casefold().split())', "    return s")
        self.assertNotEqual(run_py(broken + f"\n{name}()\n").returncode, 0)
        # Negative control: the old assertion compared a literal with itself and passed anyway.
        self.assertEqual(run_py('assert "x@example.pe".endswith("@example.pe")\n').returncode, 0)

    @needs_content_py
    def test_the_ruc_validator_rejects_a_superscript_digit(self) -> None:
        """IDO-06.1."""
        dm = demo("S27-T3-B")["code"]
        self.assertEqual(dm["output"].splitlines(), ["neg_table True", "n 5", "isdigit_acepta_superindice True"])
        # Negative control: the old isdigit() check accepted the same value.
        old = ('def check_ruc(s):\n    if not s or not s.isdigit() or len(s) != 11:\n        raise ValueError(s)\n'
               '    return s\nprint(check_ruc("2012345678²"))\n')
        self.assertEqual(stdout_of(old), "2012345678²")

    def test_the_band_count_is_not_called_coverage(self) -> None:
        """THEORY-10.1, 10.3, IDO-07.1, 07.2, HEADER-01.3, YOUDO-01.2."""
        th = block("S27-T4-A")["code"]
        self.assertTrue(th["output"].startswith("bandas_tocadas 3 de 3"),
            "the band counter must be called bandas_tocadas, not coverage: expected the start " + repr("bandas_tocadas 3 de 3")
            + ", got " + repr((th["output"])[:160]))
        self.assertNotIn("branch_covered", th["code"])
        self.assertIn("coverage run --branch -m pytest", prose("S27-T4-A"))
        self.assertIn("no es cobertura de código", prose("S27-T4-A"))
        dm = demo("S27-T4-A")
        self.assertIn("coverage.py", dm["description"])
        self.assertIn("def classify_pair", dm["code"]["code"])
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotRegex(code, r"""["'](auto|non)["']""")

    def test_the_mutation_block_kills_the_mutants_it_names(self) -> None:
        """THEORY-11.2, IDO-08.2."""
        self.assertEqual(block("S27-T4-B")["code"]["output"].splitlines(),
                         ["correcto_pasa True", "sin_colapsar muerto True", "sin_casefold muerto True"])
        self.assertEqual(demo("S27-T4-B")["code"]["output"].splitlines()[1],
                         "mutant muerto: input='ANA' expected='ana' actual='ANA'")

    def test_the_temporary_file_is_deleted(self) -> None:
        """THEORY-08.1, WEDO-15.1."""
        self.assertTrue(block("S27-T3-A")["code"]["output"].endswith("named_borrado True"),
            "the temporary file must be deleted in finally: expected the end " + repr("named_borrado True")
            + ", got " + repr((block("S27-T3-A")["code"]["output"])[-160:]))
        self.assertIn("Path(path).unlink()", exercise("S27-T3-A-E3")["solutionCode"]["code"])

    def test_the_isclose_defaults_are_taught(self) -> None:
        """WEDO-13.1."""
        p = " ".join(prose("S27-T3-A").split())
        self.assertIn("`rel_tol`, relativa al tamaño de los números (por defecto `1e-09`)", p)
        self.assertIn("`abs_tol`, absoluta (por defecto `0.0`)", p)
        self.assertIn("cerca_de_cero False True", block("S27-T3-A")["code"]["output"])


#: (exercise, old, new): the usual wrong answer, planted in the solution; the pin must catch it.
MUTATIONS = [
    ("S27-T1-A-E1", "impact * likelihood", "impact + likelihood"),
    ("S27-T1-A-E2", "-(r[1]*r[2])", "-r[1]"),
    ("S27-T1-A-E2", "-(r[1]*r[2])", "-(r[1]+r[2])"),
    ("S27-T1-A-E3", "key=lambda r: r[1] * r[2]", "key=lambda r: r[1]"),
    ("S27-T1-A-E3", "max(risks, key=lambda r: r[1] * r[2])", "risks[0]"),
    ("S27-T1-B-E1", "' '.join(s.casefold().split())", "' '.join(s.split())"),
    ("S27-T1-B-E2", "    assert raw.casefold() == oracle\n", ""),
    ("S27-T1-B-E3", "' '.join(a.casefold().split()) == ' '.join(b.casefold().split())", "a.casefold() == b.casefold()"),
    ("S27-T2-A-E1", "n.startswith('test_')", "'test' in n"),
    ("S27-T2-A-E2", "print('ok' if left == right else 'fail')", "print('fail')"),
    ("S27-T2-A-E3", "raw.strip() == exp", "raw.strip() in exp"),
    ("S27-T2-B-E1", "from copy import deepcopy\n", "from copy import copy as deepcopy\n"),
    ("S27-T2-B-E2", "if ok)", "if not ok)"),
    ("S27-T2-B-E3", "def make(n):\n    return [{'id': f'c{i}'} for i in range(n)]",
     "_SHARED = [{'id': f'c{i}'} for i in range(3)]\ndef make(n):\n    return _SHARED[:n]"),
    ("S27-T3-A-E1", ", abs_tol=1e-9", ""),
    ("S27-T3-A-E2", "return frag in str(e).casefold()", "return True"),
    ("S27-T3-A-E3", "    Path(path).unlink()\n", "    pass\n"),
    ("S27-T3-B-E1", "print(e)", "print(type(e).__name__)"),
    ("S27-T3-B-E2", "'ok' if '@' in s else 'invalid'", "'ok' if s else 'invalid'"),
    ("S27-T3-B-E3", "{v!r}", "{v}"),
    ("S27-T4-A-E1", "x > 0", "x >= 0"),
    ("S27-T4-A-E2", "BANDS - hit", "hit - BANDS"),
    ("S27-T4-A-E3", "int(100 * k / n)", "round(100 * k / n)"),
    ("S27-T4-B-E1", "print((good(raw) == 'a', mutant(raw) != 'a'))", "print(good(raw) == 'a')"),
    ("S27-T4-B-E2", "'expected': expected, 'actual': actual", "'expected': actual, 'actual': expected"),
    ("S27-T4-B-E3", "got = raw.casefold().strip()", "got = raw.strip()"),
]


class ExercisesCatchTheUsualMistake(unittest.TestCase):
    """WEDO-02.1 to 24.1: a wrong answer passed on the old fixtures."""

    @needs_content_py
    def test_each_planted_mistake_changes_the_output(self) -> None:
        for ex_id, old, new in MUTATIONS:
            e = exercise(ex_id)
            sol, pin = e["solutionCode"]["code"], e["solutionCode"]["output"]
            with self.subTest(ex_id, old=old[:40]):
                self.assertEqual(escaped(sol, pin, mutated(sol, old, new)), "",
                    "the planted mistake still prints the pinned output, so the exercise does not detect it. "
                    "Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")

    @needs_content_py
    def test_the_planted_mistakes_pass_the_old_fixtures(self) -> None:
        """Negative control: on the fixtures before this round, the same mistakes went unseen."""
        old_cases = [
            # impact alone, old rows
            ("rows=[('e2e',2,1),('unit',5,5)]\nprint([n for n,_,_ in sorted(rows, key=lambda r: -r[1])])", "['unit', 'e2e']"),
            # the first row, old risks
            ("risks = [('normalize', 20, 'unit'), ('ui_review', 4, 'e2e')]\nprint(risks[0][2])", "unit"),
            # the assert deleted, old exercise
            ("raw='ANA'\nprint('pass')", "pass"),
            # a substring filter, old names
            ("names=['test_a','helper','test_b']\nprint([n for n in names if 'test' in n])", "['test_a', 'test_b']"),
            # the type alone, old exercise
            ("try:\n    int('x')\n    matched = False\nexcept ValueError as e:\n    matched = True\nprint(matched)", "True"),
            # the mutant condition dropped, old exercise
            ("raw=' a '\ngood=raw.strip()\nprint(good == 'a')", "True"),
            # !r dropped, old value
            ("v=-1\nprint(f'campo score inválido: {v}')", "campo score inválido: -1"),
        ]
        for code, pin in old_cases:
            self.assertEqual(stdout_of(code), pin)
        # The old "regression test" printed a boolean: a broken normalization still exits 0.
        done = run_py("raw, oracle = ' ANA ', 'ana'\ngot = raw.strip()\nprint(got == oracle)\n")
        self.assertEqual((done.returncode, done.stdout.strip()), (0, "False"))


class TheYouDoCanBeDone(unittest.TestCase):
    """YOUDO-01.1 to 01.4."""

    @needs_content_py
    def test_the_starter_discovers_and_runs_its_tests(self) -> None:
        self.assertEqual(stdout_of(s27()["youDo"]["starterCode"]).splitlines(),
                         ["pruebas_ejecutadas 4", "risk_top normalize_name"])

    def test_the_tools_the_rubric_grades_are_taught(self) -> None:
        yd = s27()["youDo"]
        req = " ".join(yd["requirements"])
        self.assertIn("coverage run --branch -m pytest tests/", req)
        self.assertIn("python -m pytest --version", req)
        self.assertIn("es el identificador de esta corrida", yd["context"])
        self.assertIn("`thr_auto` y `thr_review`", yd["retrospective"])
        self.assertIn("va en `conftest.py`", prose("S27-T2-B"))


class LearnerFacingText(unittest.TestCase):
    def test_removed_words_stay_out(self) -> None:
        """HEADER-01.4, THEORY-03.2, 09.1, 09.2, 10.2, 11.1, IDO-01.4, 06.2, WEDO-* authoring notes."""
        blob = " ".join(learner_strings(s27())) + " ".join(c for _, c in all_code())
        for word in GONE:
            with self.subTest(word):
                self.assertNotIn(word, blob)

    def test_terms_are_glossed_where_they_first_appear(self) -> None:
        """HEADER-01.1, 01.2, THEORY-01.1, 03.1, 03.3, 07.2, 07.3, SELFCHECK-04.1, 05.1."""
        s = s27()
        self.assertIn("unitarias, de integración y E2E", s["jobRelevance"])
        self.assertIn("primero una prueba que reproduce el error y falla", s["learningOutcomes"][7]["text"])
        first = " ".join(s["theory"][0]["paragraphs"])
        self.assertIn("**CP-N3-A**, el proyecto integrador", first)
        self.assertIn("(*smoke*: solo comprueba que el código corre sin error)", " ".join(s["theory"][2]["paragraphs"]))
        fixtures = prose("S27-T2-B")
        self.assertIn("`module`, `package` y `session`", fixtures)
        self.assertIn("python -m pip install pytest-randomly", fixtures)
        self.assertIn("la primera pieza de CP-N3-A", s["iDo"]["intro"])

    def test_one_name_for_the_guided_practice_in_the_demos(self) -> None:
        """IDO-01.3, 07.4."""
        self.assertNotIn("We Do", json.dumps(s27()["iDo"], ensure_ascii=False))

    def test_the_x_flag_is_not_said_to_cause_a_failure(self) -> None:
        """THEORY-07.1."""
        p = prose("S27-T2-B")
        self.assertNotIn("solo aparece con `-x`", p)
        self.assertIn("La opción `-x` no reordena nada ni provoca fallos nuevos", p)

    def test_the_message_is_part_of_the_contract_in_every_exercise(self) -> None:
        """WEDO-16.1."""
        fb = exercise("S27-T3-B-E1")["feedback"]
        self.assertIn("El mensaje es parte del contrato", fb)
        self.assertNotIn("rara vez es contrato", fb)


class TheExamTeachesWhatTheSectionDoes(unittest.TestCase):
    def test_the_mutation_item_is_keyed_to_breaking_the_code(self) -> None:
        """EXAM-22.1 (P1): the key was 'Borrar todos los asserts para ir más rápido'. ac68a6c9 fixed the
        index on the base; the bank rewrite rewords the item, and this keeps the key on breaking the code."""
        items = [q for q in exam_bank.bank_for("async-concurrency") if "mutación conceptual" in q["question"]]
        self.assertEqual(len(items), 1)
        q = items[0]
        self.assertTrue(q["options"][q["correctIndex"]].startswith("Romper el código"),
            "the mutation item must be keyed to breaking the code on purpose: expected the start " + repr("Romper el código")
            + ", got " + repr((q["options"][q["correctIndex"]])[:160]))
        wrong = [o for i, o in enumerate(q["options"]) if i != q["correctIndex"]]
        self.assertTrue(any(o.startswith("Borrar los asserts") for o in wrong),
            "'Borrar los asserts' must stay a distractor, not the key: checked " + repr(wrong)[:300])

    def test_no_item_repeats_a_self_check_stem(self) -> None:
        """EXAM-01.1."""
        stems = {q["question"] for q in s27()["selfCheck"]["questions"]}
        for q in exam_bank.bank_for("async-concurrency"):
            with self.subTest(q["question"][:40]):
                self.assertNotIn(q["question"], stems)

    def test_the_self_check_pyramid_item_has_four_real_layers(self) -> None:
        """SELFCHECK-01.1."""
        q = s27()["selfCheck"]["questions"][0]
        self.assertNotIn("Solo manual", q["options"])
        self.assertEqual(q["options"][q["correctIndex"]], "Pruebas unitarias")
