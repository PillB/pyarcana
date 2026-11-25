"""Proposal 12 (approved 2026-11-21), S17: the P2 and P3 findings of the item-by-item review.

S17 teaches joins, reshape, groupby and the reconciliation that closes Phase 1. The review found
one P1 (the reconciliation exercise whose starter passed), already fixed on main by the bank-wide
starter round, and four shapes among the rest.

First, prose that says one thing while the code beside it does another. The str-vs-int callout
promised false orphans, and pandas raises ValueError instead. The window paragraph said window=2
over code that runs rolling(3). Two blocks told the learner to prefer `rename(columns={...})` and
then assigned to `.columns`. A shape prediction pointed at a code block that prints no shape.

Second, demos that cannot show what they claim. The pivot demo said the default aggfunc distorts
the total, on data where every cell holds one value, so mean equals sum. Another demo kept a
`drop_duplicates` + one_to_one line that read as the fix for fan-out, and a third printed the
cardinality as the literal "1:m".

Third, exercises whose fixture lets the usual wrong answer through: outer passed for left, `<`
passed for `<=` (no row on the cutoff day), sort_values passed for sort_index, inner passed the
mini-integration. One exercise taught editing the schema contract to match bad data. The
MUTATIONS table plants each wrong answer and requires the pinned output to catch it.

Fourth, a You Do whose `reconciled` was a tautology, and an exam bank whose key was the longest
option in 24 of 24, with an item on resample, which the course never teaches.

Lesson code needs pandas, so those runs use the pinned content interpreter (.venv-content, or
content-gates in CI) and skip elsewhere, like the S14 to S16 tests. Text and bank checks always run.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s17-packaging.ts"
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
const section = mod.section17 ?? mod.default?.section17;
if (!section) throw new Error('section17 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s17() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S17 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s17()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def prose(heading: str) -> str:
    b = block(heading)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(demo_id: str) -> dict:
    hits = [d for d in s17()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s17()["weDo"]["steps"] if e.get("id") == ex_id]
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
    py = CONTENT_PY if "pandas" in source else Path(sys.executable)
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


# ---------------------------------------------------------------------------- every pin

class EveryPinRuns(unittest.TestCase):
    @needs_pandas
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s17()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s17()["iDo"]["steps"]]
        self.assertGreaterEqual(len(snippets), 16, f"a theory or demo example was lost: {[n for n, _ in snippets]}")
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_pandas
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for ex in s17()["weDo"]["steps"]:
            with self.subTest(ex["id"]):
                sol = ex["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0 and done.stdout.rstrip("\n") == sol["output"].rstrip("\n"),
                                 "the starter already prints the answer")

    def test_every_success_line_quotes_the_pinned_output(self) -> None:
        """WEDO-13 promised {'Madrid': 3.0, 'Lima': 3.0}; pandas prints Lima first."""
        checked = 0
        for ex in s17()["weDo"]["steps"]:
            out = ex["solutionCode"]["output"].rstrip("\n")
            m = re.search(r"\*\*Éxito:\*\*[^`]*`([^`]+)`", ex["preamble"])
            if "\n" in out or not m:
                continue
            with self.subTest(ex["id"]):
                self.assertEqual(m.group(1), out)
            checked += 1
        self.assertGreaterEqual(checked, 15)


# ---------------------------------------------------------------------------- prose agrees with code

class ProseMatchesCode(unittest.TestCase):
    @needs_pandas
    def test_a_str_int_merge_raises_and_the_callout_says_so(self) -> None:
        done = run_py("import pandas as pd\n"
                      "pd.DataFrame({'k': ['1']}).merge(pd.DataFrame({'k': [1]}), on='k')\n")
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("You are trying to merge on str and int64 columns", done.stderr)
        callout = block("Diccionario rápido de la sección")["callout"]["content"]
        self.assertIn("ValueError", callout)
        self.assertIn("You are trying to merge on str and int64 columns", callout)
        self.assertNotIn("huérfanos falsos", callout)

    def test_the_window_in_the_prose_is_the_window_in_the_code(self) -> None:
        b = block("Ventanas, fechas y cohortes")
        windows = re.findall(r"\.rolling\((\d+)\)", b["code"]["code"])
        self.assertEqual(len(set(windows)), 1, "one window per block")
        text = prose("Ventanas, fechas y cohortes")
        self.assertIn(f"ventana de {windows[0]} periodos", text)
        self.assertNotIn("window=2", text)
        self.assertIn("NaN", text)
        self.assertNotIn("ene–mar", text, "the code's dates run January to February")

    def test_blocks_that_recommend_rename_do_not_assign_columns(self) -> None:
        for name, code in (("theory stable names", block("Long/wide y nombres estables")["code"]["code"]),
                           ("S17-T2-B-DEMO", demo("S17-T2-B-DEMO")["code"]["code"])):
            with self.subTest(name):
                self.assertNotRegex(code, r"\.columns\s*=")
                self.assertIn('rename(columns={"ene": "monto_ene", "feb": "monto_feb"})', code)

    def test_the_shape_prediction_names_the_demo_that_prints_the_shape(self) -> None:
        para = block("Reshape y pivot_table: los mismos datos en otra disposición")["paragraphs"][3]
        self.assertIn("demo_reshape.py", para)
        self.assertNotIn("el código siguiente", para)
        d = demo("S17-T2-A-DEMO")
        self.assertEqual(d["code"]["title"], "demo_reshape.py")
        first, second = d["code"]["output"].splitlines()[:2]
        self.assertEqual(first, "(4, 3) (2, 2)")
        self.assertEqual(second.count("'m1'"), 2)
        self.assertEqual(second.count("'m2'"), 2)

    def test_counts_are_labelled_and_concat_runs_in_its_own_block(self) -> None:
        self.assertIn("rows_cli 2 rows_tx 3 rows_merge 3", block("Claves y cardinalidad en joins")["code"]["output"])
        b = block("Concat, melt y pivot")
        self.assertIn("pd.concat(", b["code"]["code"])
        self.assertIn("suma_long 10 suma_back 10", b["code"]["output"])

    def test_one_name_per_rate_and_the_cohort_comment_names_the_code(self) -> None:
        text = prose("Denominadores y totales")
        self.assertIn("tasa de pago", text)
        self.assertNotIn("tasa de completitud", text)
        self.assertNotIn("completos/universo", text)
        self.assertNotIn("max global", block("Leakage temporal y controles antes/después")["code"]["code"])

    def test_madrid_is_called_synthetic_where_it_first_appears(self) -> None:
        first = next(b for b in s17()["theory"] if "Madrid" in json.dumps(b, ensure_ascii=False))
        self.assertEqual(first["heading"], "Groupby / agg / transform")
        self.assertIn("no es una región del Perú", prose("Groupby / agg / transform"))


# ---------------------------------------------------------------------------- demos show their claim

class DemosShowTheirClaim(unittest.TestCase):
    TOTALS = re.compile(r"^total_(detalle|por_defecto|con_suma) ([\d.]+)$", re.M)

    def _totals(self, out: str) -> dict[str, float]:
        return {k: float(v) for k, v in self.TOTALS.findall(out)}

    @needs_pandas
    def test_the_default_aggfunc_changes_the_total_and_sum_keeps_it(self) -> None:
        t = self._totals(stdout_of(demo("S17-T2-A-DEMO")["code"]["code"]))
        self.assertEqual(set(t), {"detalle", "por_defecto", "con_suma"})
        self.assertEqual(t["con_suma"], t["detalle"])
        self.assertNotEqual(t["por_defecto"], t["detalle"])

    @needs_pandas
    def test_without_a_repeated_cell_the_demo_could_not_show_it(self) -> None:
        """Negative control: drop the late adjustment and mean equals sum, as in the pre-fix demo."""
        code = demo("S17-T2-A-DEMO")["code"]["code"]
        old = code.replace('long2 = pd.concat([long, ajuste], ignore_index=True)', 'long2 = long')
        self.assertNotEqual(old, code)
        t = self._totals(stdout_of(old))
        self.assertEqual(t["por_defecto"], t["con_suma"])

    def test_the_anti_join_demo_does_not_silence_duplicates(self) -> None:
        self.assertNotIn("drop_duplicates", demo("S17-T1-B-DEMO")["code"]["code"])

    @needs_pandas
    def test_the_cardinality_label_is_computed(self) -> None:
        code = demo("S17-T1-A-DEMO")["code"]["code"]
        unique_tx = code.replace('"cliente_id": ["C001", "C001", "C002"]', '"cliente_id": ["C001", "C002", "C003"]')
        self.assertNotEqual(unique_tx, code)
        self.assertIn("card 1:1", stdout_of(unique_tx))
        self.assertIn("card 1:m", stdout_of(code))

    def test_the_completeness_rate_counts_a_table(self) -> None:
        code = demo("S17-T4-A-DEMO")["code"]["code"]
        self.assertIn("n_clientes = len(clientes)", code)
        self.assertNotIn("n_clientes = 200", code)

    def test_the_cohort_demo_says_its_sort_changes_nothing_here(self) -> None:
        self.assertIn("no cambia la salida", demo("S17-T3-B-DEMO")["why"])


# ---------------------------------------------------------------------------- We Do mutations

#: (exercise, text in the solution, the usual wrong answer). Each must change the output.
MUTATIONS = [
    ("S17-T1-A-E1", 'how="left"', 'how="outer"'),
    ("S17-T1-A-E1", 'how="left"', 'how="inner"'),
    ("S17-T1-A-E2", 'print(bool(cli["cliente_id"].is_unique))', 'print(cli["cliente_id"].nunique() > 0)'),
    ("S17-T1-A-E3", 'cli.merge(tx, on="cliente_id", how="inner")',
     'cli.merge(tx.drop_duplicates("cliente_id"), on="cliente_id", how="inner")'),
    ("S17-T1-B-E1", '"left_only"', '"both"'),
    ("S17-T1-B-E2", 'validate="one_to_one"', 'validate="many_to_many"'),
    ("S17-T1-B-E3", '"left_only"', '"both"'),
    ("S17-T2-A-E1", 'value_vars=["a", "b"]', 'value_vars=["a"]'),
    ("S17-T2-A-E2", '.reset_index()', ''),
    ("S17-T2-A-E3", 'pd.concat(lotes, ignore_index=True)', 'pd.concat(lotes, axis=1)'),
    ("S17-T2-B-E1", 'w.columns = [f"monto_{c}" for c in w.columns]\n', ''),
    # The wrong fix WEDO-11 used to teach: keep the broken rename and edit the contract.
    ("S17-T2-B-E2",
     'df = df.rename(columns={"ene": "monto_ene", "feb": "monto_feb"})\nexpected = {"cliente_id", "monto_ene", "monto_feb"}',
     'df = df.rename(columns={"ene": "monto_ene"})\nexpected = {"cliente_id", "monto_ene", "feb"}'),
    ("S17-T2-B-E3", 'print(df.rename(columns={"a": "monto"}).columns.tolist())', 'print(df.columns.tolist())'),
    ("S17-T3-A-E1", '.sum()', '.mean()'),
    ("S17-T3-A-E2", '.transform("mean")', '.mean()'),
    ("S17-T3-A-E3", 'out = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))',
     'out = df.groupby("region")["monto"].sum().reset_index()'),
    ("S17-T3-B-E1", 'rolling(2)', 'rolling(2, min_periods=1)'),
    ("S17-T3-B-E2", 'transform("min")', 'transform("max")'),
    ("S17-T3-B-E3", 's = s.sort_index()', 's = s.sort_values()'),
    ("S17-T3-B-E3", 's = s.sort_index()\n', ''),
    ("S17-T4-A-E1", '< 1e-9', '< 1.0'),
    ("S17-T4-A-E2", 'pagados / activos', 'activos / pagados'),
    ("S17-T4-A-E3", 'total - lima', 'lima - total'),
    ("S17-T4-B-E1", '<= cutoff', '< cutoff'),
    ("S17-T4-B-E2", '<= cutoff', '< cutoff'),
    ("S17-T4-B-E3", 'how="left"', 'how="inner"'),
    ("S17-T4-B-E3", '<= cutoff', '< cutoff'),
]


class WeDoChecksCanFail(unittest.TestCase):
    def _check(self, with_pandas: bool) -> int:
        ran = 0
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            if ("pandas" in sol["code"]) != with_pandas:
                continue
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertIn(old, sol["code"], "mutation anchor not found")
                self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new, 1)),
                                f"{ex_id}: the planted mistake prints the pinned answer")
            ran += 1
        return ran

    def test_every_exercise_has_a_planted_mistake(self) -> None:
        self.assertEqual({m[0] for m in MUTATIONS}, {e["id"] for e in s17()["weDo"]["steps"]})

    def test_mutations_in_stdlib_exercises(self) -> None:
        self.assertEqual(self._check(with_pandas=False), 3)

    @needs_pandas
    def test_mutations_in_pandas_exercises(self) -> None:
        self.assertEqual(self._check(with_pandas=True), len(MUTATIONS) - 3)

    def test_the_schema_exercise_keeps_the_contract(self) -> None:
        ex = exercise("S17-T2-B-E2")
        self.assertIn("no edites `expected`", ex["preamble"])
        self.assertNotIn("Corrige expected", ex["instruction"])
        for code in (ex["starterCode"]["code"], ex["solutionCode"]["code"]):
            self.assertIn('expected = {"cliente_id", "monto_ene", "monto_feb"}', code)

    def test_the_boundary_exercises_have_a_row_on_the_cutoff_day(self) -> None:
        for ex_id, cutoff in (("S17-T4-B-E1", "2024-01-31"), ("S17-T4-B-E2", "2024-01-31"), ("S17-T4-B-E3", "2024-02-01")):
            with self.subTest(ex_id):
                code = exercise(ex_id)["solutionCode"]["code"]
                self.assertIn(f'pd.Timestamp("{cutoff}")', code)
                self.assertIn(f'"{cutoff}"', code.split("cutoff =")[0], "no transaction on the cutoff day")

    def test_the_sort_exercise_names_sort_values(self) -> None:
        self.assertIn("sort_values", exercise("S17-T3-B-E3")["feedback"])


# ---------------------------------------------------------------------------- You Do

REFERENCE = '''
import pandas as pd

def portfolio_summary(clientes, tx, cutoff):
    cutoff = pd.Timestamp(cutoff)
    m = clientes.merge(tx, on="cliente_id", how="left", indicator=True)
    total_monto = float(m["monto"].sum())
    total_pre = float(m.loc[m["fecha"] <= cutoff, "monto"].sum())
    sin_cliente = float(tx.loc[~tx["cliente_id"].isin(clientes["cliente_id"]), "monto"].sum())
    return {
        "rows_merge": len(m),
        "n_huerfanos_left_only": int((m["_merge"] == "left_only").sum()),
        "total_monto": total_monto,
        "total_pre_cutoff": total_pre,
        "leakage_delta": total_monto - total_pre,
        "monto_tx_sin_cliente": sin_cliente,
        "reconciled": abs(total_monto + sin_cliente - float(tx["monto"].sum())) < 1e-9,
    }
'''

#: The pre-fix contract: parts of the merge against the merge's own total. Always True.
TAUTOLOGY = REFERENCE.replace(
    '"reconciled": abs(total_monto + sin_cliente - float(tx["monto"].sum())) < 1e-9',
    '"reconciled": abs(float(m.groupby("region")["monto"].sum().sum()) - total_monto) < 1e-9')


class YouDoReconciles(unittest.TestCase):
    def _main(self) -> str:
        starter = s17()["youDo"]["starterCode"]
        return starter[starter.index('if __name__ == "__main__":'):]

    def _expected(self) -> dict:
        lines = [ln.strip().lstrip("#").strip() for ln in self._main().splitlines()]
        start = next(i for i, ln in enumerate(lines) if ln.startswith("{'rows_merge'"))
        text = ""
        for ln in lines[start:]:
            text += " " + ln
            if ln.endswith("}"):
                break
        return ast.literal_eval(text.strip())

    def test_the_docstring_defines_reconciled_against_the_detail(self) -> None:
        starter = s17()["youDo"]["starterCode"]
        self.assertIn('reconciled = abs(total_monto + monto_tx_sin_cliente - tx["monto"].sum()) < 1e-9', starter)
        self.assertNotIn("residual de partes vs. total de referencia", starter)
        self.assertIn("monto_tx_sin_cliente", s17()["youDo"]["context"])

    @needs_pandas
    def test_the_reference_prints_the_expected_dict_of_the_starter(self) -> None:
        self.assertEqual(ast.literal_eval(stdout_of(REFERENCE + "\n\n" + self._main())), self._expected())

    @needs_pandas
    def test_a_duplicated_master_breaks_reconciled_and_the_old_rule_misses_it(self) -> None:
        dup = self._main().replace('"cliente_id": ["C001", "C002", "C003"], "region": ["Lima", "Cusco", "Puno"]',
                                   '"cliente_id": ["C001", "C001", "C003"], "region": ["Lima", "Lima", "Puno"]')
        self.assertNotEqual(dup, self._main())
        self.assertIs(ast.literal_eval(stdout_of(REFERENCE + "\n\n" + dup))["reconciled"], False)
        self.assertIs(ast.literal_eval(stdout_of(TAUTOLOGY + "\n\n" + dup))["reconciled"], True)


# ---------------------------------------------------------------------------- writing

class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s17()):
            text = re.sub(r"`[^`]*`", "X", text)
            long += [s for s in self.SPLIT.split(text) if len(s.split()) > 32]
        self.assertEqual(long, [])

    def test_header_terms_are_glossed_where_they_first_appear(self) -> None:
        outcomes = " ".join(o["text"] for o in s17()["learningOutcomes"])
        for gloss in ("anti-join (la lista de filas", "rolling: un promedio", "eps, la diferencia máxima",
                      "as-of (solo datos conocidos"):
            self.assertIn(gloss, outcomes)
        concat = next(o["text"] for o in s17()["learningOutcomes"] if "concat" in o["text"])
        self.assertIn("apilar lotes con `concat`", concat)


# ---------------------------------------------------------------------------- exam bank

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
        return exam_bank.bank_for("packaging")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_nothing_untaught_or_off_topic(self) -> None:
        text = " ".join(q["question"] + " " + " ".join(q["options"]) + " " + q["explanation"] for q in self.bank())
        for gone in ("resample", "wheel", "wx widgets", "Parquet", "sklearn", "Sockets", "hostname", "Color favorito"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    @needs_pandas
    def test_the_named_aggregation_nan_distractor_is_false(self) -> None:
        """Codex on #189: the distractor said `count` keeps NaN out of `n`, which pandas does anyway,
        so a learner who chose a true statement was marked wrong. The distractor must claim what
        pandas refutes: that `count` counts the NaN rows."""
        q = next(q for q in self.bank() if q["question"].startswith("La named aggregation"))
        nan_options = [o for i, o in enumerate(q["options"]) if "NaN" in o and i != q["correctIndex"]]
        self.assertEqual(len(nan_options), 1, q["options"])
        self.assertIn("Contar también", nan_options[0], "the NaN distractor must claim that count includes NaN")
        got = stdout_of(
            "import numpy as np, pandas as pd\n"
            "df = pd.DataFrame({'g': ['a'] * 3, 'monto': [1.0, np.nan, 2.0]})\n"
            "r = df.groupby('g').agg(n=('monto', 'count'), filas=('monto', 'size'))\n"
            "print(int(r['n'].iloc[0]), int(r['filas'].iloc[0]))\n")
        self.assertEqual(got, "2 3", "count must drop the NaN row and size must keep it, or the distractor is not false")
        self.assertIn("size", q["explanation"])

    def test_the_pivot_table_key_is_the_mean(self) -> None:
        q = next(q for q in self.bank() if q["question"].startswith("`pivot_table` sin `aggfunc`"))
        self.assertIn("7.5", q["options"][q["correctIndex"]])
        self.assertIn("`pivot`, no `pivot_table`", q["explanation"])

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


if __name__ == "__main__":
    unittest.main()
