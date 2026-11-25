"""Proposal 12 (approved 2026-11-21), S19: the P1, P2 and P3 findings of the item-by-item review.

S19 teaches visualization and accessible communication. The review found five shapes.

First, one chart with two sets of numbers: Lima was 28 in one demo and 24 in another, and two P1s
came from it. The lookup exercise told the learner to filter Lima in rows without Lima (a
StopIteration), and the You Do example alt said Madrid leads with 28 PEN and n=40. The section now
has one dataset, Lima 28.0 (n=40), Madrid 24.0 (n=28), Bogota 22.5 (n=32), and every chart, table,
tooltip and alt text quotes it.

Second, checks that cannot fail, in the blocks that teach checking: a parity test that compared a
dict with its own copy, export metadata typed next to the figure, chart scores and claim verdicts
typed by hand. Each now computes, and the tests below change the input and expect the output to move.

Third, three footer formats for a footer the section calls a stable contract.

Fourth, terms before use (fig, ax, ylim, hatch, backend Agg), Seaborn offered but not installed, and
an ML paragraph that cited S09 for fit_transform.

Fifth, We Do checks a constant could pass, and an exam bank whose key was longest in 22 of 24.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s19-databases-orm.ts"
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
const section = mod.section19 ?? mod.default?.section19;
if (!section) throw new Error('section19 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s19() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S19 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s19()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def prose(heading: str) -> str:
    b = block(heading)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(demo_id: str) -> dict:
    hits = [d for d in s19()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s19()["weDo"]["steps"] if e.get("id") == ex_id]
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
    needs_content = any(lib in source for lib in ("pandas", "numpy", "matplotlib"))
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




def s19_text() -> str:
    return " ".join(learner_strings(s19()))


#: The section's one synthetic dataset: every chart, table, tooltip and alt text quotes these.
MEDIAN = {"Lima": 28.0, "Madrid": 24.0, "Bogota": 22.5}
N = {"Lima": 40, "Madrid": 28, "Bogota": 32}


def all_code(include_starters: bool = False) -> list[tuple[str, str, str]]:
    """(name, code, output) for theory, demos and solutions (starters hold planted bugs)."""
    out = [(b["heading"], b["code"]["code"], b["code"]["output"]) for b in s19()["theory"] if b.get("code")]
    out += [(d["demoId"], d["code"]["code"], d["code"]["output"]) for d in s19()["iDo"]["steps"]]
    out += [(e["id"], e["solutionCode"]["code"], e["solutionCode"]["output"]) for e in s19()["weDo"]["steps"]]
    if include_starters:
        out += [(e["id"] + " starter", e["starterCode"]["code"], "") for e in s19()["weDo"]["steps"]]
    return out


class EveryPinRuns(unittest.TestCase):
    @needs_pandas
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s19()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s19()["iDo"]["steps"]]
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_pandas
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for ex in s19()["weDo"]["steps"]:
            with self.subTest(ex["id"]):
                sol = ex["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0 and done.stdout.rstrip("\n") == sol["output"].rstrip("\n"),
                                 "the starter already prints the answer")


class OneDataset(unittest.TestCase):
    """THEORY-10.6: Lima was 28 in one demo and 24 in another, Madrid the reverse."""

    PAIR = re.compile(r'"region":\s*"(Lima|Madrid|Bogota)",\s*"(?:median|monto|ticket_mediano_pen|v)":\s*([\d.]+)')
    TOOLTIP = re.compile(r"\b(Lima|Madrid|Bogota)(?::|=| ) ?(\d+(?:\.\d+)?) PEN(?: \(n=(\d+)\))?")

    def test_code_and_pins_quote_the_one_dataset(self) -> None:
        found = []
        for name, code, output in all_code():
            for region, value in self.PAIR.findall(code):
                found.append((name, region, float(value)))
            for region, value, n in self.TOOLTIP.findall(code + "\n" + output):
                found.append((name, region, float(value)))
                if n:
                    found.append((name, region + " n", int(n)))
        self.assertGreater(len(found), 20, "the reader found too few pairs to mean anything")
        wrong = [f for f in found if f[2] != (N[f[1][:-2]] if f[1].endswith(" n") else MEDIAN[f[1]])]
        self.assertEqual(wrong, [])

    def test_learner_prose_quotes_the_one_dataset(self) -> None:
        wrong = []
        for text in learner_strings(s19()):
            for region, value, n in self.TOOLTIP.findall(text):
                if float(value) != MEDIAN[region] or (n and int(n) != N[region]):
                    wrong.append((region, value, n, text[:80]))
        self.assertEqual(wrong, [])


class RegionsMatchTheCode(unittest.TestCase):
    def test_no_berlin_anywhere(self) -> None:
        self.assertNotIn("Berlin", SECTION.read_text(encoding="utf-8"))

    def test_the_lookup_exercise_names_the_region_it_filters(self) -> None:
        """WEDO-13 (P1): the title and step 2 said Lima while the rows had no Lima; StopIteration."""
        ex = exercise("S19-T3-A-E1")
        self.assertIn("Madrid", ex["title"])
        self.assertIn("Madrid", ex["instruction"])
        self.assertNotIn("Lima", ex["instruction"] + ex["hint"] + " ".join(ex["hints"]))
        self.assertIn('== "Madrid"', ex["solutionCode"]["code"])

    def test_the_tooltip_demo_preamble_names_the_calls_the_code_makes(self) -> None:
        """IDO-05: the preamble called view('Lima'); the data had no Lima row."""
        d = demo("S19-T3-A-DEMO")
        called = set(re.findall(r'view\("(\w+)"\)', d["code"]["code"]))
        named = set(re.findall(r'view\("(\w+)"\)', d["preamble"]))
        self.assertEqual(named, called)

    def test_parity_and_state_exercises_name_their_region(self) -> None:
        self.assertIn("Lima", exercise("S19-T3-B-E1")["preamble"])
        self.assertNotIn("Madrid", exercise("S19-T3-B-E1")["preamble"])
        e2 = exercise("S19-T3-B-E2")
        self.assertIn("Bogotá", e2["preamble"])
        self.assertIn('"Bogotá"', e2["solutionCode"]["code"])

    def test_the_you_do_example_alt_matches_the_data(self) -> None:
        """YOUDO-01.1 (P1): the example said Madrid leads with 28 PEN and n=40."""
        starter = s19()["youDo"]["starterCode"]
        self.assertIn("Lima lidera (28 PEN, n=40)", starter)
        self.assertNotIn("Madrid lidera", starter)


class DemosComputeWhatTheyClaim(unittest.TestCase):
    def mutated(self, code: str, old: str, new: str) -> str:
        self.assertIn(old, code)
        return stdout_of(code.replace(old, new, 1))

    def test_the_chart_choice_follows_the_question(self) -> None:
        """IDO-01: scores were typed in; a trend question must now pick the line."""
        code = demo("S19-T1-A-DEMO")["code"]["code"]
        out = self.mutated(code, 'pregunta = "Comparar ticket mediano entre regiones"',
                           'pregunta = "Tendencia del ticket mediano por semana"')
        self.assertIn("'chart': 'line'", out)

    @needs_pandas
    def test_export_meta_is_read_from_the_figure(self) -> None:
        """THEORY-06.1, IDO-04.1: panels and dpi were literals that could not disagree with the figure."""
        th = block("Composición, anotaciones y exportación")["code"]["code"]
        out = self.mutated(th, "plt.subplots(1, 2,", "plt.subplots(1, 3,")
        self.assertIn("'panels': 3", out)
        ido = demo("S19-T2-B-DEMO")["code"]["code"]
        self.assertIn("'dpi': 90", self.mutated(ido, "dpi = 120", "dpi = 90"))
        self.assertIn("bar_label", ido, "the demo promises an annotation")

    def test_parity_reads_a_separate_table_and_can_fail(self) -> None:
        """IDO-06.1, THEORY-08.2: the table was built from the chart dict, so parity was always True."""
        for code, out in ((demo("S19-T3-B-DEMO")["code"]["code"], demo("S19-T3-B-DEMO")["code"]["output"]),
                          (block("Estado, performance y alternativas accesibles")["code"]["code"],
                           block("Estado, performance y alternativas accesibles")["code"]["output"])):
            with self.subTest(code[:30]):
                self.assertNotIn("chart.items()", code)
                self.assertIn("False", out, "the failing table must run and print False")
        ido = demo("S19-T3-B-DEMO")["code"]["code"]
        broken = self.mutated(ido, "Lima,28.0\\nBogota", "Lima,28.5\\nBogota")
        self.assertIn("parity False", broken)

    def test_claims_are_classified_by_a_rule(self) -> None:
        """IDO-08.1, THEORY-10.7: verdicts were flags typed next to each claim."""
        ido = demo("S19-T4-B-DEMO")["code"]["code"]
        out = self.mutated(ido, '"Lima es la mejor región del Perú"', '"Lima es la mejor región del Perú en la muestra"')
        self.assertEqual(out.count("PERMITIDO"), 2)
        th = block("Color, contraste, texto alternativo y no sobreclaim")["code"]["code"]
        out = self.mutated(th, '"Lima es la región más rentable del Perú."', '"En la muestra, Lima es la más rentable del Perú."')
        self.assertNotIn("RECHAZADO", out)


class OneFooter(unittest.TestCase):
    """THEORY-09.1: the prose, the code and the demo showed three footers."""

    PIE = re.compile(r"def pie\(cap\):\n\s+return (.+)")

    def test_theory_and_demo_use_the_same_pie_function(self) -> None:
        th = self.PIE.search(block("Unidades, fuente y limitaciones")["code"]["code"])
        ido = self.PIE.search(demo("S19-T4-A-DEMO")["code"]["code"])
        self.assertIsNotNone(th)
        self.assertIsNotNone(ido)
        self.assertEqual(th.group(1), ido.group(1))

    def test_every_footer_uses_lowercase_key_colon_value(self) -> None:
        self.assertIn("`unidad: … | fuente: … | corte: … | n: … | limitacion: …`", prose("Unidades, fuente y limitaciones"))
        for name, _, output in all_code():
            with self.subTest(name):
                for bad in ("Fuente:", "Límite:", "unidad=", "Unidad:"):
                    self.assertNotIn(bad, output)


class TermsBeforeUse(unittest.TestCase):
    def test_fig_and_ax_are_defined_before_the_first_matplotlib_code(self) -> None:
        text = prose("Matplotlib para figuras estáticas")
        self.assertIn("`fig`, el lienzo", text)
        self.assertIn("el área de dibujo", text)
        self.assertIn("no viene en el entorno del curso", text, "Seaborn is not in requirements-content.txt")
        self.assertNotIn("seaborn", (ROOT / "requirements-content.txt").read_text().lower())

    def test_ylim_and_hatch_are_glossed_where_the_contract_first_uses_them(self) -> None:
        text = prose("Ejes, escalas y encodings honestos")
        self.assertIn("`ylim`, el rango visible del eje Y", text)
        self.assertIn("*hatch*: un relleno", text)

    def test_the_outcomes_gloss_agg_and_the_sample_sizes(self) -> None:
        outcomes = " ".join(o["text"] for o in s19()["learningOutcomes"])
        self.assertIn("modo sin ventana (backend Agg)", outcomes)
        self.assertIn("cuántas muestra y de cuántas", outcomes)

    def test_the_leakage_paragraph_cites_what_the_course_taught(self) -> None:
        """THEORY-10.1: 'como viste en S09' about fit_transform; S09 has no ML."""
        text = prose("Color, contraste, texto alternativo y no sobreclaim")
        for gone in ("fit_transform", "X_train", "S09", "inference time", "cambiaria "):
            with self.subTest(gone):
                self.assertNotIn(gone, text)
        self.assertIn("fecha de corte de S17", text)
        self.assertIn("no such table: ventas", text)


#: (exercise, text in the solution, the usual wrong answer). Each must change the output.
MUTATIONS = [
    ("S19-T1-A-E1", 'chart = "bar"', 'chart = "line"'),
    ("S19-T1-A-E2", '"audiencia": "ejecutivo", ', ""),
    ("S19-T1-A-E3", '"tendencia" in pregunta.lower()', '"tendencia" in pregunta'),
    ("S19-T1-B-E1", "hon = (50 - 45) / 50", "hon = (50 - 45) / (50 - 45)"),
    ("S19-T1-B-E2", 'return "honesto" if ylim_bottom == 0 else "revisar"', 'return "revisar"'),
    ("S19-T1-B-E3", '"riesgo_alto" if encoding == "dual_axis" else "ok"', '"riesgo_alto"'),
    ("S19-T2-A-E1", "ax.set_ylim(0, 3)", "ax.set_ylim(1, 3)"),
    ("S19-T2-A-E2", "ax.set_ylim(0, 35)\n", ""),
    ("S19-T2-A-E3", "max(values) * 1.2 if values else 1.0", "max(values) * 1.2"),
    ("S19-T2-A-E3", "max(values) * 1.2 if values else 1.0", "max(values) if values else 1.0"),
    ("S19-T2-B-E1", '"panels": len(axes),', '"panels": 1,'),
    ("S19-T2-B-E2", 'print(f"fig_cpn2b_v{version}.png")', 'print("fig_cpn2b_v3.png")'),
    ("S19-T2-B-E3", 'axes[1].set_title("Med")\n', ""),
    ("S19-T3-A-E1", '== "Madrid")', '== "Bogota")'),
    ("S19-T3-A-E2", " (n={28})", ""),
    ("S19-T3-A-E3", "return f\"{row['region']}: {row['median']} PEN (n={row['n']})\"", 'return "Bogota: 22.5 PEN (n=32)"'),
    ("S19-T3-B-E1", '"ticket_mediano_pen": 28.0', '"ticket_mediano_pen": 27.5'),
    ("S19-T3-B-E2", "ensure_ascii=False", "ensure_ascii=True"),
    ("S19-T3-B-E3", ' {unidad}"', '"'),
    ("S19-T4-A-E1", '"unidad: PEN | fuente: sintetico"', '"unidad=PEN | fuente=sintetico"'),
    ("S19-T4-A-E2", '"limitacion": "solo canal web"', '"limitacion": ""'),
    ("S19-T4-A-E3", 'f"{k}: {v}" for k, v in cap.items()', "str(k) for k in cap"),
    ("S19-T4-B-E1", 'print("RECHAZADO" if ("del Perú" in claim and "muestra" not in claim) else "OK")', 'print("RECHAZADO")'),
    ("S19-T4-B-E2", 'hatch = "//"', 'hatch = ""'),
    ("S19-T4-B-E3", '"PERMITIDO" if "muestra" in text else "RECHAZADO"', '"PERMITIDO"'),
]


class WeDoChecksCanFail(unittest.TestCase):
    def test_every_exercise_has_a_planted_mistake(self) -> None:
        self.assertEqual({m[0] for m in MUTATIONS}, {e["id"] for e in s19()["weDo"]["steps"]})

    def _check(self, with_plotting: bool) -> int:
        ran = 0
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            if ("matplotlib" in sol["code"]) != with_plotting:
                continue
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertIn(old, sol["code"], "mutation anchor not found")
                self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new, 1)),
                                f"{ex_id}: the planted mistake prints the pinned answer")
            ran += 1
        return ran

    def test_mutations_in_stdlib_exercises(self) -> None:
        self.assertGreater(self._check(with_plotting=False), 15)

    @needs_pandas
    def test_mutations_in_plotting_exercises(self) -> None:
        self.assertGreater(self._check(with_plotting=True), 5)


class YouDo(unittest.TestCase):
    def test_the_sample_sizes_come_from_the_data(self) -> None:
        """YOUDO-01.3: the template declared 5000 of 50000 for a 100-ticket starter."""
        starter = s19()["youDo"]["starterCode"]
        self.assertNotIn("5000", starter)
        self.assertIn('int(df["n"].sum())', starter)

    def test_every_checklist_file_has_the_line_that_writes_it(self) -> None:
        reqs = " ".join(s19()["youDo"]["requirements"])
        for writer in ("export_png", "json.dump", "to_csv", "write_text"):
            with self.subTest(writer):
                self.assertIn(writer, reqs)


class SelfCheck(unittest.TestCase):
    def test_the_caption_item_has_no_joke_distractors(self) -> None:
        q = next(q for q in s19()["selfCheck"]["questions"] if q["question"].startswith("El caption"))
        for joke in ("color favorito", "contraseña", "Nada"):
            with self.subTest(joke):
                self.assertNotIn(joke, " ".join(q["options"]))


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s19()):
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
        return exam_bank.bank_for("databases-orm")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_nothing_the_section_does_not_teach(self) -> None:
        """EXAM-08, -12, -13, -17, -18: Seaborn's API, provenance, Plotly, lazy load and chips."""
        text = " ".join(q["question"] + " " + " ".join(q["options"]) + " " + q["explanation"] for q in self.bank())
        for gone in ("Plotly", "lazy", "chips", "provenance", "alto nivel", "SQLAlchemy", "WebSockets", "Parpadeo"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_the_seaborn_key_is_what_the_lesson_says(self) -> None:
        q = next(q for q in self.bank() if "Seaborn" in q["question"])
        self.assertIn("opcional", q["options"][q["correctIndex"]])

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


if __name__ == "__main__":
    unittest.main()
