"""Proposal 12 (approved 2026-11-21), S18: the P2 and P3 findings of the item-by-item review.

S18 teaches EDA, descriptive statistics and uncertainty. Its two P1s (an exam key on the wrong
option, and a Tukey starter that passed unchanged) were already fixed on main by the bank-wide
round; the pins below hold them. The rest of the review found four shapes.

First, regions that do not exist in the code: the prose and three preambles named Berlin where the
code runs Lima, and two exercise titles named Madrid where the task asks for Lima.

Second, units and terms used before they are given: bias_pp read as percentage points while the
values are proportions, log1p, r, residual, s_pooled, confusor, lognormal and CP-N2-B without a
gloss, and two layer triads for one idea.

Third, evidence typed in by hand in the very blocks that teach traceable evidence: the median and
interval of the template, the demo of medians, a printed `True` that "closes" the ethics check.

Fourth, an exam bank whose key was the longest option in 18 of 24, with English jargon and two
thin explanations. Spearman by argsort(argsort) gave a different statistic with ties.
"""
from __future__ import annotations

import ast
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s18-data-engineering.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

VENV_PY = ROOT / ".venv-content/bin/python"
if VENV_PY.exists():
    CONTENT_PY: Path | None = VENV_PY
elif os.environ.get("PYARCANA_PINNED_CONTENT_ENV") == "1":
    CONTENT_PY = Path(sys.executable)
else:
    CONTENT_PY = None
needs_pandas = unittest.skipUnless(CONTENT_PY, "needs the pinned content interpreter (pandas)")

#: A dynamic import, read from the named export or from `default`: Node 20 (content-gates) exposes
#: a .ts module's exports in this CommonJS package only on `default`. See docs/agents/lessons.md.
DUMP = """
const mod = await import({path!r});
const section = mod.section18 ?? mod.default?.section18;
if (!section) throw new Error('section18 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s18() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S18 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s18()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def prose(heading: str) -> str:
    b = block(heading)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(demo_id: str) -> dict:
    hits = [d for d in s18()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s18()["weDo"]["steps"] if e.get("id") == ex_id]
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
    needs_content = "pandas" in source or "numpy" in source
    py = CONTENT_PY if needs_content else Path(sys.executable)
    if py is None:
        raise unittest.SkipTest("needs the pinned content interpreter (pandas)")
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([str(py), "-I", str(path)], capture_output=True,
                              text=True, timeout=120, encoding="utf-8", cwd=tmp)


def stdout_of(source: str) -> str:
    done = run_py(source)
    if done.returncode != 0:
        raise AssertionError("snippet raised: " + done.stderr[-600:])
    return done.stdout.rstrip("\n")


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")




def s18_text() -> str:
    return " ".join(learner_strings(s18()))


class EveryPinRuns(unittest.TestCase):
    @needs_pandas
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s18()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s18()["iDo"]["steps"]]
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_pandas
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for ex in s18()["weDo"]["steps"]:
            with self.subTest(ex["id"]):
                sol = ex["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0 and done.stdout.rstrip("\n") == sol["output"].rstrip("\n"),
                                 "the starter already prints the answer")


class RegionsMatchTheCode(unittest.TestCase):
    def test_no_berlin_anywhere(self) -> None:
        self.assertNotIn("Berlin", SECTION.read_text(encoding="utf-8"))

    def test_titles_name_the_region_the_task_computes(self) -> None:
        for ex_id, region in (("S18-T2-A-E1", "Lima"), ("S18-T3-B-E2", "Lima")):
            ex = exercise(ex_id)
            with self.subTest(ex_id):
                self.assertIn(region, ex["title"])
                self.assertIn(f'"{region}"', ex["solutionCode"]["code"])
        self.assertIn("ticket mediano Lima", exercise("S18-T4-A-E3")["preamble"])

    def test_max_bias_fixture_tells_max_from_min_and_mean(self) -> None:
        """A symmetric two-region fixture gives the same answer for max and min; this one cannot."""
        code = exercise("S18-T2-A-E3")["solutionCode"]["code"]
        outs = {agg: stdout_of(code.replace("return max(", f"return {agg}(")) for agg in ("max", "min")}
        mean = stdout_of(code.replace("return max(", "return (lambda v: sum(v) / len(v))(list(").replace(" for k in pob)", " for k in pob))"))
        self.assertEqual(len({outs["max"], outs["min"], mean}), 3, (outs, mean))
        missing = code.replace("counts.get(k, 0)", "counts[k]")
        self.assertNotEqual(run_py(missing).returncode, 0, "the fixture must hold a region with no rows")

    def test_the_intro_says_the_foreign_labels_are_synthetic(self) -> None:
        self.assertIn("no regiones del Perú", s18()["iDo"]["intro"])


class UnitsAndTerms(unittest.TestCase):
    def test_bias_pp_is_called_a_difference_of_proportions(self) -> None:
        self.assertIn("0.25 equivale a 25 puntos porcentuales", prose("Población, muestra y sesgo"))
        why = demo("S18-T2-A-DEMO")["why"]
        self.assertIn("20 puntos porcentuales", why)
        self.assertNotIn("se mide en puntos porcentuales", why)

    def test_terms_are_defined_where_they_are_used(self) -> None:
        text = s18_text()
        for gloss in ("es ln(1 + x)", "**r** va de −1 a 1", "El **residual** de X", "`s_pooled` es la desviación estándar combinada",
                      "El **confusor**, una variable que influye", "cuando su logaritmo sigue una normal",
                      "«Fábrica de Reportes y Tablero Accesible»", "Cohen (1988)"):
            with self.subTest(gloss):
                self.assertIn(gloss, text)

    def test_one_set_of_layers(self) -> None:
        p = block("Preguntas, hipótesis y evidencia")["paragraphs"][0]
        self.assertIn("**evidencia calculada** y **decisión**", p)
        self.assertIn("La evidencia calculada es el hallazgo", p)

    @needs_pandas
    def test_the_log_block_runs_its_counterexample_and_the_inverse(self) -> None:
        out = stdout_of(block("Métricas robustas y escalas")["code"]["code"])
        self.assertIn("log_de_0 -inf log1p_de_0 0.0", out)
        self.assertIn("dif_log 2.905 dif_PEN 190.0", out)
        self.assertIn("expm1_vuelve_a_PEN 200.0", out)


class EvidenceIsComputed(unittest.TestCase):
    @needs_pandas
    def test_the_template_numbers_come_from_the_code_and_the_prose_quotes_them(self) -> None:
        b = block("Preguntas, hipótesis y evidencia")
        self.assertNotIn('"median": 27.5', b["code"]["code"])
        out = stdout_of(b["code"]["code"])
        m = re.search(r"'median': ([\d.]+), 'ic95_boot': \(([\d.]+), ([\d.]+)\)", out)
        self.assertIsNotNone(m)
        median, lo, hi = m.groups()
        text = prose("Preguntas, hipótesis y evidencia")
        self.assertIn(f"=({median})".replace("(", "").replace(")", ""), text.replace("(", "").replace(")", ""))
        self.assertIn(f"({lo}, {hi})", text)

    @needs_pandas
    def test_a_different_seed_changes_the_template(self) -> None:
        """Negative control: the numbers move with the data, so they are not typed in."""
        code = block("Preguntas, hipótesis y evidencia")["code"]
        other = code["code"].replace("default_rng(18)", "default_rng(19)")
        self.assertNotEqual(other, code["code"])
        self.assertNotEqual(stdout_of(other), code["output"].rstrip("\n"))

    @needs_pandas
    def test_the_medians_demo_computes_its_interval(self) -> None:
        d = demo("S18-T4-A-DEMO")
        self.assertIn("rng.choice", d["code"]["code"])
        out = stdout_of(d["code"]["code"])
        m = re.search(r"'ic95_boot': \((-?[\d.]+), (-?[\d.]+)\)", out)
        lo, hi = float(m.group(1)), float(m.group(2))
        self.assertLess(lo, 0)
        self.assertGreater(hi, 0)
        self.assertIn("incluye 0", d["why"])

    def test_no_printed_constant_closes_a_check(self) -> None:
        code = demo("S18-T3-B-DEMO")["code"]["code"]
        self.assertNotIn('print("sin_claim_causal", True)', code)
        self.assertIn("n_por_region", code)

    def test_the_hash_does_not_depend_on_the_operating_system(self) -> None:
        for code in (block("Notebook reproducible y data notes")["code"]["code"], demo("S18-T4-B-DEMO")["code"]["code"]):
            self.assertIn('lineterminator="\\n"', code)
        self.assertIn('"sha1_8"', block("Notebook reproducible y data notes")["code"]["code"])
        self.assertNotIn("row_sha1_8", SECTION.read_text(encoding="utf-8"))


class SpearmanWithTies(unittest.TestCase):
    @needs_pandas
    def test_rank_and_argsort_disagree_on_ties_and_the_exercise_uses_rank(self) -> None:
        sol = exercise("S18-T3-A-E2")["solutionCode"]["code"]
        self.assertIn(".rank()", sol)
        tied = sol.replace("x = np.array([1.0, 2.0, 3.0, 10.0])", "x = np.array([1.0, 2.0, 2.0, 10.0])")
        argsort = tied.replace("pd.Series(x).rank()", "np.argsort(np.argsort(x)).astype(float)")
        self.assertNotEqual(stdout_of(tied), stdout_of(argsort), "with a tie the two rankings must differ")


#: (exercise, text in the solution, the usual wrong answer). Each must change the output.
MUTATIONS = [
    ("S18-T1-A-E1", 'print("median", float(np.median(montos)))', 'print("median", float(montos.mean()))'),
    ("S18-T1-A-E2", "[0.25, 0.75]", "[0.10, 0.90]"),
    ("S18-T1-A-E3", "x.std(ddof=1)", "x.std(ddof=0)"),
    ("S18-T1-B-E1", "m / med", "med / m"),
    ("S18-T1-B-E2", "np.median(np.abs(x - med))", "np.mean(np.abs(x - med))"),
    ("S18-T1-B-E3", "np.log1p(x)", "np.log(x + 1e-9)"),
    ("S18-T2-A-E1", 'count("Lima")', 'count("Madrid")'),
    ("S18-T2-A-E2", "share - pob", "pob - share"),
    ("S18-T2-A-E3", "return max(", "return min("),
    ("S18-T2-B-E1", "1.96 * s / math.sqrt(n)", "1.96 * s"),
    ("S18-T2-B-E2", "(13 - 10) / 2", "(10 - 13) / 2"),
    ("S18-T2-B-E3", "replace=True", "replace=False"),
    ("S18-T3-A-E1", "np.corrcoef(x, y)", "np.corrcoef(y, y)"),
    ("S18-T3-A-E2", "pd.Series(x).rank()", "pd.Series(x)"),
    ("S18-T3-A-E3", "r_res = float(np.corrcoef(rx, ry)[0, 1])", "r_res = float(np.corrcoef(x, y)[0, 1])"),
    ("S18-T3-B-E1", "q3 + 1.5 * iqr", "q3 + 0.5 * iqr"),
    ("S18-T3-B-E2", 'flag[region == "Lima"].mean()', "flag.mean()"),
    ("S18-T3-B-E3", "(m < lo) | (m > hi)", "(m > hi)"),
    ("S18-T4-A-E1", 'print(evidencia["pregunta"])', 'print(evidencia["hipotesis"])'),
    ("S18-T4-A-E2", "median < 15", "median > 15"),
    ("S18-T4-A-E3", ' print("L:", limite)\n', ""),
    ("S18-T4-B-E1", '"n_final": 4', '"n_final": 5'),
    ("S18-T4-B-E2", "+ chr(10)).encode", ").encode"),
    ("S18-T4-B-E3", '"n_final": len(df2)', '"n_final": len(df)'),
]


class WeDoChecksCanFail(unittest.TestCase):
    def test_every_exercise_has_a_planted_mistake(self) -> None:
        self.assertEqual({m[0] for m in MUTATIONS}, {e["id"] for e in s18()["weDo"]["steps"]})

    def _check(self, with_numeric: bool) -> int:
        ran = 0
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            needs = "numpy" in sol["code"] or "pandas" in sol["code"]
            if needs != with_numeric:
                continue
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertIn(old, sol["code"], "mutation anchor not found")
                self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new, 1)),
                                f"{ex_id}: the planted mistake prints the pinned answer")
            ran += 1
        return ran

    def test_mutations_in_stdlib_exercises(self) -> None:
        self.assertGreater(self._check(with_numeric=False), 0)

    @needs_pandas
    def test_mutations_in_numeric_exercises(self) -> None:
        self.assertGreater(self._check(with_numeric=True), 10)


class YouDo(unittest.TestCase):
    def test_the_rubric_points_for_edge_cases_have_a_requirement(self) -> None:
        reqs = " ".join(s18()["youDo"]["requirements"])
        self.assertIn("caso de borde documentado", reqs)
        self.assertIn("versiones de pandas y numpy", reqs)
        self.assertIn("no carga el dataset de S17", s18()["youDo"]["context"])


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s18()):
            text = re.sub(r"`[^`]*`", "X", text)
            long += [s for s in self.SPLIT.split(text) if len(s.split()) > 32]
        self.assertEqual(long, [])


def key_length_ranks(questions: list[dict]) -> list[int]:
    ranks = []
    for q in questions:
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        if lengths.count(key) != 1:
            raise AssertionError(f"the key ties another option in length: {q['question']}")
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


class ExamBank(unittest.TestCase):
    def bank(self) -> list[dict]:
        return exam_bank.bank_for("data-engineering")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_the_reproducibility_key_is_the_reproducible_option(self) -> None:
        q = next(q for q in self.bank() if q["question"].startswith("Para que otra persona reproduzca"))
        self.assertIn("seed", q["options"][q["correctIndex"]])

    def test_no_english_jargon_or_coined_terms(self) -> None:
        text = " ".join(q["question"] + " " + " ".join(q["options"]) + " " + q["explanation"] for q in self.bank())
        for gone in ("claim", "fake", "tourism", "no-hallazgo", "validez externa", "logo", "Node.js", "parquet"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


if __name__ == "__main__":
    unittest.main()
