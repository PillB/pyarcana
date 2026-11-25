"""Proposal 12 (approved 2026-11-21), S14: the P1, P2 and P3 findings of the item-by-item review.

S14 teaches NumPy for the CP-N2-A quality board. The review found four shapes.

First, two rules for one contract. Theory said "no uses `assert`" for the dtype and shape check,
then its callout said to assert it, and two demos asserted it; the mask callout said `ValueError`
where the code raises `IndexError`. Each now has one rule: `if ...: raise ValueError(...)`, and
the callout names the error the code raises.

Second, warnings with no running counterexample: `and` between arrays, `len(ids)/len(ids)`, a
silent broadcast, `x == np.nan`, `nanmean` with `inf`, a `print` inside a timed loop. Each block
now runs the mistake and prints its effect, so the claim is an observation.

Third, exercises whose fixture passes the usual wrong answer: no 0.5 for a strict `>`, a fixture
where mean and median pick the same ids, an already sorted array, a 2D input never passed, a sum
where substituting 0 for inf gives the same number, a literal `print`. Each now prints the case
that separates the two answers, and these tests plant each wrong answer.

Fourth, an exam bank where the key was the longest option in 24 of 24 questions, with joke
distractors. Every distractor is now a misconception, and the key's length rank is spread.

Lesson code needs NumPy, so the runs use the pinned content interpreter (.venv-content, or
content-gates in CI) and skip elsewhere, like test_starter_is_not_the_answer.
"""
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
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

VENV_PY = ROOT / ".venv-content/bin/python"
if VENV_PY.exists():
    CONTENT_PY: Path | None = VENV_PY
elif os.environ.get("PYARCANA_PINNED_CONTENT_ENV") == "1":
    CONTENT_PY = Path(sys.executable)
else:
    CONTENT_PY = None
needs_numpy = unittest.skipUnless(CONTENT_PY, "needs the pinned content interpreter (NumPy)")

#: A dynamic import, read from the named export or from `default`. tsx loads a .ts file in this
#: CommonJS package as CommonJS; Node 22 exposes its named exports, but Node 20 (the content-gates
#: job) puts them only on `default`, so a static `import {{ section14 }}` fails there.
DUMP = """
const mod = await import({path!r});
const section = mod.section14 ?? mod.default?.section14;
if (!section) throw new Error('section14 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s14() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s14-security.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S14 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s14()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s14()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s14()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def run_py(source: str) -> subprocess.CompletedProcess:
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


def bank() -> list[dict]:
    return exam_bank.bank_for("security")


def key_length_ranks(questions: list[dict]) -> list[int]:
    """The key's rank by length among its options (1 = longest). A tie with the key fails."""
    ranks = []
    for q in questions:
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        if lengths.count(key) != 1:
            raise AssertionError(f"the key ties another option in length: {q['question']}")
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


class OneRulePerContract(unittest.TestCase):
    def test_no_demo_checks_the_array_contract_with_assert(self) -> None:
        for demo_id in ("S14-T1-A-DEMO", "S14-T2-B-DEMO"):
            with self.subTest(demo_id):
                code = demo(demo_id)["code"]["code"]
                self.assertNotRegex(code, r"^\s*assert\b", code)
                self.assertIn("raise ValueError", code)
                self.assertNotIn("**aserta**", demo(demo_id)["preamble"])

    def test_the_contract_callout_says_raise_not_assert(self) -> None:
        content = block("ndarray, dtype y shape")["callout"]["content"]
        self.assertIn("raise ValueError", content)
        self.assertNotIn("asertarlos", content)

    @needs_numpy
    def test_the_contract_demo_fails_closed_under_python_O(self) -> None:
        """The reason assert is forbidden: under -O it vanishes. The raise must not."""
        code = demo("S14-T1-A-DEMO")["code"]["code"]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "demo.py"
            path.write_text(code, encoding="utf-8")
            done = subprocess.run([str(CONTENT_PY), "-I", "-O", str(path)], capture_output=True,
                                  text=True, timeout=120, cwd=tmp)
        self.assertIn("contrato_roto flags debe ser (4, 3), llegó (4, 2)", done.stdout)

    @needs_numpy
    def test_the_mask_callout_names_the_error_numpy_raises(self) -> None:
        b = block("Creación, indexación y máscaras")
        self.assertIn("IndexError", b["callout"]["content"])
        self.assertNotIn("ValueError", b["callout"]["content"])
        self.assertIn("mascara_corta IndexError", stdout_of(b["code"]["code"]))


@needs_numpy
class WarningsRunTheirMistake(unittest.TestCase):
    """Each warning's counterexample runs and prints the effect the prose names."""

    CASES = [
        ("theory", "Creación, indexación y máscaras", "and_error The truth value of an array"),
        ("theory", "Ufuncs y reducciones", "len_bug 1.0"),
        ("theory", "Broadcasting y compatibilidad de shapes", "shape_mal (3, 3)"),
        ("theory", "NaN, inf y estabilidad numérica", "igual_nan [False, False, False, False]"),
        ("theory", "Vectorización frente a loops", "prints_dentro_del_tiempo_medido 2000 vs 0"),
        ("demo", "S14-T1-B-DEMO", "and_falla The truth value of an array"),
        ("demo", "S14-T2-A-DEMO", "len_bug 1.0"),
        ("demo", "S14-T2-B-DEMO", "shape_mal (3, 3)"),
        ("demo", "S14-T3-B-DEMO", "nanmean_crudo inf"),
    ]

    def test_each_counterexample_prints_its_effect(self) -> None:
        for kind, name, line in self.CASES:
            with self.subTest(name):
                code = (block(name) if kind == "theory" else demo(name))["code"]
                out = stdout_of(code["code"])
                self.assertIn(line, out.splitlines())
                self.assertEqual(out, code["output"].rstrip("\n"), "the pinned output drifted")


class TimingIsHonest(unittest.TestCase):
    #: A clock that returns random readings: any printed line that compares live times moves with it.
    SHAKY_CLOCK = "import random, time\n_r = random.Random({seed})\ntime.perf_counter = lambda: _r.random()\n"

    @needs_numpy
    def test_pinned_output_does_not_depend_on_machine_speed(self) -> None:
        """CI went red once on a timing comparison: a pinned line must not read the clock."""
        snippets = [block("Vectorización frente a loops")["code"], demo("S14-T4-A-DEMO")["code"]]
        for code in snippets:
            for seed in range(6):
                with self.subTest(code["code"][:20], seed=seed):
                    out = stdout_of(self.SHAKY_CLOCK.format(seed=seed) + code["code"])
                    self.assertEqual(out, code["output"].rstrip("\n"))

    @needs_numpy
    def test_the_shaky_clock_moves_a_live_comparison(self) -> None:
        """Negative control: the old line, a comparison of live times, does move under that clock."""
        live = ("import time\nt0 = time.perf_counter(); t1 = time.perf_counter()\n"
                "t2 = time.perf_counter(); t3 = time.perf_counter()\nprint(t1 - t0 > t3 - t2)\n")
        outs = {stdout_of(self.SHAKY_CLOCK.format(seed=seed) + live) for seed in range(6)}
        self.assertEqual(outs, {"True", "False"})

    def test_the_benchmark_takes_medians_not_one_pair(self) -> None:
        b = block("Vectorización frente a loops")
        self.assertIn("statistics.median", b["code"]["code"])
        self.assertNotIn("un solo par de tiempos basta", " ".join(b["paragraphs"]))
        self.assertNotIn("función civil de reloj", s14()["iDo"]["steps"][6]["why"])

    def test_the_tolerance_prose_matches_the_code(self) -> None:
        b = block("Memoria, medición y tests con tolerancia")
        prose = " ".join(b["paragraphs"])
        self.assertNotIn("rtol=, atol=", prose, "the empty signature is not valid Python")
        self.assertIn("atol + rtol·|b|", prose)
        self.assertIn("rtol=1e-7, atol=1e-9", b["code"]["code"])
        self.assertNotIn("con `atol=1e-8`", prose)


@needs_numpy
class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    #: (exercise, the wrong answer as (old, new) on the solution)
    WRONG = [
        ("S14-T1-A-E3", ("a.ndim != 1 or ", "")),                       # skips the ndim check
        ("S14-T1-B-E1", ("score >= 0.5", "score > 0.5")),               # strict comparison
        ("S14-T1-B-E2", ("med = np.median(scores)", "med = np.mean(scores)")),
        ("S14-T1-B-E3", ("print(a[order].tolist())", "print(np.sort(a)[order].tolist())")),
        ("S14-T3-B-E3", ("np.where(np.isinf(x), np.nan, x)", "np.where(np.isinf(x), 0.0, x)")),
        ("S14-T4-A-E1", ("print(s1, s2, abs(s1 - s2) < 1e-6)", "print(True)")),
        ("S14-T4-A-E3", ("c = a + b", "c = np.zeros(n)\nc[:-1] = (a + b)[:-1]")),
    ]

    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for ex_id, _ in self.WRONG:
            with self.subTest(ex_id):
                sol = exercise(ex_id)["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, (old, new) in self.WRONG:
            with self.subTest(ex_id):
                sol = exercise(ex_id)["solutionCode"]
                self.assertEqual(sol["code"].count(old), 1, old)
                self.assertEqual(escaped(sol["code"], sol["output"], sol["code"].replace(old, new)), "",
                    "the planted mistake still prints the pinned output, so the exercise does not detect it. "
                    "Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")

    def test_the_success_line_states_the_new_pin(self) -> None:
        for ex_id, _ in self.WRONG:
            with self.subTest(ex_id):
                ex = exercise(ex_id)
                first = ex["solutionCode"]["output"].splitlines()[0]
                self.assertIn(first.split(" ")[0], ex["preamble"])

    def test_the_you_do_measures_equivalence(self) -> None:
        starter = s14()["youDo"]["starterCode"]
        self.assertIn('bench["max_abs_diff"] < 1e-12', starter)
        self.assertNotIn('print("bench", bench_weighted_mean(X, w))', starter,
                         "main must not print machine-dependent timings")


class WordsAreDefinedWhereTheyAreUsed(unittest.TestCase):
    def test_header_terms_are_glossed(self) -> None:
        sec = s14()
        self.assertIn("versión en loop de referencia (baseline)", sec["tagline"])
        outcomes = " ".join(o["text"] for o in sec["learningOutcomes"])
        self.assertIn("ufuncs (funciones que aplican", outcomes)
        self.assertIn("views (vistas que comparten memoria", outcomes)

    def test_cp_n2_a_is_introduced_at_first_mention(self) -> None:
        first = block("ndarray, dtype y shape")["paragraphs"][0]
        self.assertIn("CP-N2-A, el proyecto acumulativo de Nivel 2", first)

    def test_simd_and_np_vectorize_are_taught_before_the_exam_uses_them(self) -> None:
        prose = " ".join(block("Vectorización frente a loops")["paragraphs"])
        self.assertIn("SIMD, una instrucción para varios datos", prose)
        self.assertIn("np.vectorize(f)", prose)

    def test_the_read_only_error_is_in_the_theory(self) -> None:
        prose = " ".join(block("Views/copies y mutabilidad")["paragraphs"])
        self.assertIn("ValueError: assignment destination is read-only", prose)

    def test_one_name_for_the_memory_budget(self) -> None:
        d = demo("S14-T4-B-DEMO")
        prose = re.sub(r"`[^`]*`", "", d["preamble"] + d["retrospective"])  # `budget_ok` is code
        self.assertNotIn("budget", prose)


class SelfCheckAndBank(unittest.TestCase):
    def test_the_benchmark_item_has_one_defensible_answer(self) -> None:
        q = s14()["selfCheck"]["questions"][7]
        self.assertNotIn("El ratio de tiempos repetido varias veces y promediado", q["options"])

    def test_bank_has_no_length_cue(self) -> None:
        ranks = key_length_ranks(bank())
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6], ranks)

    def test_clip_is_a_distractor_not_part_of_the_key(self) -> None:
        q = next(q for q in bank() if q["question"].startswith("Overflow o divisiones"))
        self.assertNotIn("clip", q["options"][q["correctIndex"]])
        self.assertTrue(any("np.clip" in o for i, o in enumerate(q["options"]) if i != q["correctIndex"]),
            "np.clip must stay a distractor; the key is the explicit rule: checked " + repr(q["options"])[:300])

    def test_no_joke_distractor_is_left(self) -> None:
        jokes = ("SUNAT", "Encriptar", "Encripta", "JOIN SQL", "hash git", "Crear venv", "Usar eval",
                 "PII real", "Leer Excel", "llamar print tres veces", "proceso hijo", "licencia")
        text = "\n".join(o for q in bank() for o in q["options"])
        for joke in jokes:
            with self.subTest(joke):
                self.assertNotIn(joke.lower(), text.lower())

    def test_ownership_is_gone_from_the_key(self) -> None:
        self.assertFalse(any(re.search("ownership", o) for q in bank() for o in q["options"]),
            "the bank must not mention ownership, which the section never teaches: checked " + repr([q["options"] for q in bank()])[:300])


if __name__ == "__main__":
    unittest.main()
