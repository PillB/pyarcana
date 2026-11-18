"""Proposal 10 (approved 2026-11-11), S07: the P2 and P3 findings of the item-by-item review.

Most S07 findings share one shape: an exercise checks only the easy case, so the wrong answer the
exercise exists to correct still prints the expected output. `lower` passes where `casefold` is
taught, `search` passes where `fullmatch` is taught, a pattern without `\\b` passes, a norm without
NFC passes. The exercises now carry the case that separates the two answers, and these tests
plant each wrong answer and require the pinned output to change.

The other findings are rules that contradicted each other (the theory accepted a two-token name
that the We Do sends to review, the exam keyed the lowercased local part the section warns
against), words the course does not teach, and self-check keys that "pick the longest" found.

Negative controls: every reference prints its pin, a mutation that changes nothing raises, an
irrelevant edit is not "caught", a completed You Do runs, and the bank scan reads the whole bank.
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
import {{ section07 }} from {path!r};
console.log(JSON.stringify(section07));
"""


@lru_cache(maxsize=None)
def s07() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s07-text-unicode-regex.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S07 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block_by_title(title: str) -> dict:
    hits = [b for b in s07()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s07()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s07()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts.append(b["callout"]["content"])
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8")


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "text-unicode-regex"][0]["questions"]


#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise corrects.
MUTANTS = {
    "S07-T1-A-E1": [
        ("WEDO-01 no NFC (repr hid it)", "print(ascii(unicodedata.normalize('NFC', n)))", "print(ascii(n))"),
    ],
    "S07-T1-A-E2": [
        ("WEDO-02 lower instead of casefold", "print(c.casefold() == d.casefold())", "print(c.lower() == d.lower())"),
    ],
    "S07-T1-B-E3": [
        ("WEDO-06 review only below two tokens", "if len(toks) < 3:", "if len(toks) < 2:"),
    ],
    "S07-T2-A-E3": [
        ("WEDO-09 isalnum keeps letters", "for c in otro if c.isdigit()", "for c in otro if c.isalnum()"),
    ],
    "S07-T2-B-E1": [
        ("WEDO-10 casefold of the whole address",
         "return True, local + '@' + domain.casefold(), None",
         "return True, (local + '@' + domain).casefold(), None"),
        ("WEDO-10 plus addressing rejected", "if s.count('@') != 1 or", "if '+' in s or s.count('@') != 1 or"),
    ],
    "S07-T3-A-E1": [
        ("WEDO-13 search for three capitals", "print(bool(re.fullmatch(pat, 'LIMA')))",
         "print(bool(re.search(r'[A-Z]{3}', 'LIMA')))"),
    ],
    "S07-T3-B-E1": [
        ("WEDO-16 no word boundaries", r"pat = re.compile(r'\b9[0-9]{8}\b')", r"pat = re.compile(r'9[0-9]{8}')"),
    ],
    "S07-T3-B-E2": [
        ("WEDO-17 either case accepted", "r'[A-Z]{3}-[0-9]{2}'", "r'[A-Za-z]{3}-[0-9]{2}'"),
    ],
    "S07-T4-A-E1": [
        ("WEDO-19 no NFC", "unicodedata.normalize('NFC', s).split()", "s.split()"),
    ],
    "S07-T4-A-E2": [
        ("WEDO-20 no NFC", "    s = unicodedata.normalize('NFC', s)\n", ""),
        ("WEDO-20 min instead of the union", "len(A & B) / len(A | B)", "len(A & B) / min(len(A), len(B))"),
        ("WEDO-20 empty side scored 0.0", "        return None\n", "        return 0.0\n"),
    ],
    "S07-T4-A-E3": [
        ("WEDO-21 1.0 alone is exact", "if score == 1.0 and norm(a) == norm(b):", "if score == 1.0:"),
    ],
}

THEORY_MUTANTS = {
    "nombre_con_particula.py": [
        ("WEDO-06 only three tokens accepted", "if len(toks) >= 3 and", "if len(toks) == 3 and"),
        ("THEORY-13 particle in the surnames not sent to review", "and not PARTICULAS & set(toks[-2:])", ""),
    ],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        for ex_id in MUTANTS:
            with self.subTest(exercise=ex_id):
                sol = exercise(ex_id)["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, mutants in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutants:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertEqual(sol["code"].count(old), 1, f"{finding}: anchor not in the solution")
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_starters_show_the_defect(self) -> None:
        """Each starter runs and prints something other than the pin, so the learner sees work to do."""
        for e in s07()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                done = run_py(e["starterCode"]["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S07-T4-A-E3")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S07-T4-A-E3")["solutionCode"]
        edited = sol["code"].replace("for a, b, score in casos:", "# casos\nfor a, b, score in casos:")
        self.assertFalse(caught(sol["code"], sol["output"], edited))

    def test_success_line_lists_every_output_line(self) -> None:
        """The Éxito names each printed case, so a learner whose output has more lines is not misled."""
        cases = {
            "S07-T1-B-E3": ["Madonna", "Ana Quispe", "Luis Quispe Huamán"],
            "S07-T2-A-E1": ["['C001', 'Ana', 'Lima']", "['C002', 'Ana María', 'Lima']"],
            "S07-T2-B-E1": ["ok A@b.com", "ok Ana+X@example.com"],
            "S07-T3-A-E1": ["'LIM'", "'Lima'", "'LIMA'"],
            "S07-T3-B-E1": ["tel 999000111", "no match 123", "fijo 123456789", "ref 9990001111"],
            "S07-T4-A-E3": ["review Juan Perez Juan P Perez 0.67", "review Ana Ana Ana 1.0"],
        }
        for ex_id, needles in cases.items():
            pre = exercise(ex_id)["preamble"]
            for needle in needles:
                with self.subTest(exercise=ex_id, needle=needle):
                    self.assertIn(needle, pre)

    def test_free_text_checks_say_what_must_appear(self) -> None:
        cases = {
            "S07-T2-B-E3": ["entregabilidad no verificada", "fullmatch estricto siempre"],
            "S07-T3-A-E3": ["usar search para extraer; fullmatch para validar campo exacto"],
            "S07-T3-B-E3": ["riesgo: ninguno", "no hace falta"],
            "S07-T4-B-E2": ["decision == 'review'", "revisión humana"],
            "S07-T4-B-E3": ["No afirmamos", "Solo emitimos"],
        }
        for ex_id, needles in cases.items():
            tests = exercise(ex_id)["tests"]
            for needle in needles:
                with self.subTest(exercise=ex_id, needle=needle):
                    self.assertIn(needle, tests)

    def test_no_conditional_on_an_exact_output_check(self) -> None:
        """The We Do is not graded line by line; instructions must not hinge on one that might be."""
        for e in s07()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                self.assertNotRegex(e["instruction"], r"compara salida exacta|comparación exacta de salida|canónic")

    def test_e2_meta_steps_are_gone(self) -> None:
        for e in s07()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                self.assertNotRegex(e["instruction"], r"\(E2|Menos migas")


class TheoryAgreesWithTheExercises(unittest.TestCase):
    def test_pins_hold(self) -> None:
        code = block_by_title("nombre_con_particula.py")["code"]
        done = run_py(code["code"])
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        self.assertEqual(done.stdout.rstrip("\n"), code["output"].rstrip("\n"))

    def test_each_planted_mistake_changes_the_block(self) -> None:
        for title, mutants in THEORY_MUTANTS.items():
            code = block_by_title(title)["code"]
            for finding, old, new in mutants:
                with self.subTest(block=title, finding=finding):
                    self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not in the block")
                    self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)))

    def test_two_tokens_go_to_review_everywhere(self) -> None:
        theory = block_by_title("nombre_con_particula.py")["code"]["output"]
        self.assertIn("Ana Quispe → {'raw': 'Ana Quispe', 'status': 'review'}", theory)
        self.assertIn("'given': 'María del Carmen', 'ap1': 'Quispe', 'ap2': 'Ríos', 'status': 'ok'", theory)
        we_do = exercise("S07-T1-B-E3")["solutionCode"]["output"]
        self.assertIn("{'raw': 'Ana Quispe', 'status': 'review', 'given': None", we_do)
        we_do_particles = exercise("S07-T1-B-E2")["solutionCode"]["output"]
        self.assertTrue(we_do_particles.startswith("María del Carmen\n"))


class WordsAreTaughtBeforeUse(unittest.TestCase):
    def test_no_untaught_or_english_term(self) -> None:
        text = learner_text()
        for term in ["misconception", "tunear", "Dice-like", "/ hang", "a's", "digits_only` produce"]:
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_ascii_and_isalnum_are_glossed_where_used(self) -> None:
        self.assertIn("`ascii()` funciona como `repr()`", exercise("S07-T1-A-E1")["preamble"])
        self.assertIn("`c.isalnum()` también lo es para letras", exercise("S07-T2-A-E3")["preamble"])
        self.assertIn("`any(ch.isspace() for ch in s)`", " ".join(exercise("S07-T2-B-E1")["hints"]))

    def test_one_digit_class_in_the_phone_patterns(self) -> None:
        for ex_id in ("S07-T3-B-E1", "S07-T3-B-E2"):
            with self.subTest(exercise=ex_id):
                self.assertNotIn(r"\d", exercise(ex_id)["solutionCode"]["code"])


class YouDoIsReadable(unittest.TestCase):
    def test_contract_is_named(self) -> None:
        yd = s07()["youDo"]
        starter = yd["starterCode"]
        self.assertNotIn("from __future__", starter)
        self.assertIn("Python no las comprueba al ejecutar", starter)
        self.assertEqual(starter.count("-> tuple[str | None, list[str], str | None]:"), 3)
        reqs = "\n".join(yd["requirements"] + yd["objectives"])
        self.assertIn("un `assert` por caso", reqs)
        self.assertIn("README.md", reqs)
        self.assertIn("menos de tres tokens", reqs)

    def test_a_completed_you_do_runs(self) -> None:
        starter = s07()["youDo"]["starterCode"]
        bodies = {
            "normalize_nombre": '''
    s = nfc(" ".join(raw.split()))
    t = ["collapse_spaces", "nfc"]
    if len(s.split()) < 3:
        return None, t, "menos de tres tokens"
    return s, t, None''',
            "normalize_email": '''
    s = raw.strip()
    t = ["strip"]
    if s.count("@") != 1 or any(c.isspace() for c in s):
        return None, t, "un @ y cero espacios"
    local, dom = s.split("@")
    if not local or not dom:
        return None, t, "local y dominio no vacíos"
    return local + "@" + dom.casefold(), t + ["casefold_domain"], None''',
            "normalize_phone": '''
    return "".join(c for c in raw if c.isdigit()), ["digits_only"], None''',
            "normalize_record": '''
    out, tr, why = {}, {}, {}
    for campo, fn in (("nombre", normalize_nombre), ("email", normalize_email), ("telefono", normalize_phone)):
        out[campo], tr[campo], reason = fn(raw[campo])
        if reason:
            why[campo] = reason
    return {"raw": raw, "normalized": out, "transforms": tr,
            "status": "review" if why else "ok", "review_reasons": why}''',
        }
        source = starter
        for name, body in bodies.items():
            head = re.search(rf"def {name}\(.*?\n(?:    .*\n|\n)*?    raise NotImplementedError", source)
            self.assertIsNotNone(head, name)
            source = source.replace(head.group(0), head.group(0).split("\n")[0] + body)
        done = run_py(source)
        self.assertEqual(done.returncode, 0, done.stderr[-600:])
        self.assertIn("'status': 'ok'", done.stdout)
        self.assertIn("'email': 'Ana.Perez+demo@example.com'", done.stdout)
        self.assertIn("'telefono': '51999000111'", done.stdout)


class SelfCheckAndBank(unittest.TestCase):
    def test_always_longest_fails(self) -> None:
        qs = s07()["selfCheck"]["questions"]
        self.assertEqual(len(qs), 10)
        longest = sum(len(q["options"][q["correctIndex"]]) == max(map(len, q["options"])) for q in qs)
        self.assertLess(longest / len(qs), 0.7)
        for i in (3, 5, 7, 8, 9):
            with self.subTest(question=i + 1):
                q = qs[i]
                self.assertLess(len(q["options"][q["correctIndex"]]), max(map(len, q["options"])))

    def test_phone_explanation_names_the_taught_function(self) -> None:
        self.assertIn("normalize_phone_pe", s07()["selfCheck"]["questions"][9]["explanation"])

    def test_bank_matches_the_lessons(self) -> None:
        items = bank()
        self.assertEqual(len(items), 24, "the scan must read the whole bank")
        blob = json.dumps(items, ensure_ascii=False)
        for term in ["quarantine", "(T4)", "lower/casefold local", "FN de negocio"]:
            with self.subTest(term=term):
                self.assertNotIn(term, blob)
        email = [q for q in items if q["question"].startswith("Normalizar email en CP-N1-B")]
        self.assertEqual(len(email), 1)
        self.assertIn("casefold solo del dominio, parte local sin cambiar",
                      email[0]["options"][email[0]["correctIndex"]])
        two = [q for q in items if "si solo hay 2 tokens" in q["question"]]
        self.assertEqual(len(two), 1)
        key = two[0]["options"][two[0]["correctIndex"]]
        self.assertTrue(key.startswith("Marcar review"))
        self.assertLess(len(key), max(map(len, two[0]["options"])))


if __name__ == "__main__":
    unittest.main()
