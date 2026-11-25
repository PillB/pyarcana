"""Proposal 12 (approved 2026-11-21), S15: the P1, P2 and P3 findings of the item-by-item review.

S15 teaches pandas ingestion for CP-N2-A. The review found four shapes.

First, the pandas 2 copy rule taught as current. The pinned pandas is 3.0.5, where Copy-on-Write is
the default: a chained write never reaches the parent and the warning is ChainedAssignmentError.
The section named SettingWithCopyWarning as the warning a learner would see, a self-check stem
named it, and a self-check had two true options. Each place now names the pandas 3 warning, keeps
the old name only as the pandas 2.x name, and theory runs the chained write and prints its effect.

Second, a dtype rule that the learner's own CSV contradicts. Four places said a column that mixes
types becomes `object`; read from a CSV it is `str`. `object` comes from Excel cells or Python
lists. The tests run all three reads so the rule is an observation.

Third, exercises whose check passes the usual wrong answer: a fixture where label and position
agree, a usecols the test never looked at, an in-place mutation, a default RangeIndex, a category
step not checked, a delta with no prior null, a hardcoded "missing", an index hidden on re-read,
a byte count for Excel, deep > 0, a hardcoded manifest, a hash that depends on the OS line ending.
These tests plant each wrong answer and require the pinned output to catch it.

Fourth, an exam bank where the key was the longest option in 23 of 24 questions, with joke
distractors. Every distractor is now a misconception, and the key's length rank is spread.

Lesson code needs pandas, so the runs use the pinned content interpreter (.venv-content, or
content-gates in CI) and skip elsewhere, like test_proposal12_s14.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
FIGURE = ROOT / "src" / "components" / "course" / "figures" / "S15DataFrame.tsx"
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

#: A dynamic import, read from the named export or from `default`. tsx loads a .ts file in this
#: CommonJS package as CommonJS; Node 22 exposes its named exports, but Node 20 (the content-gates
#: job) puts them only on `default`, so a static `import {{ section15 }}` fails there.
DUMP = """
const mod = await import({path!r});
const section = mod.section15 ?? mod.default?.section15;
if (!section) throw new Error('section15 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s15() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s15-stdlib-deep.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S15 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s15()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def prose(heading: str) -> str:
    b = block(heading)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(demo_id: str) -> dict:
    hits = [d for d in s15()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s15()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def strings(node) -> list[str]:
    """Every string in the section, so a rule about names covers prose, options and resources."""
    if isinstance(node, str):
        return [node]
    if isinstance(node, dict):
        return [s for v in node.values() for s in strings(v)]
    if isinstance(node, list):
        return [s for v in node for s in strings(v)]
    return []


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
    return exam_bank.bank_for("stdlib-deep")


def bank_question(start: str) -> dict:
    hits = [q for q in bank() if q["question"].startswith(start)]
    if len(hits) != 1:
        raise AssertionError(f"expected one exam question starting {start!r}, found {len(hits)}")
    return hits[0]


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


class PandasThreeCopyRule(unittest.TestCase):
    CHAINED = "Chained assignment y semántica de copias"

    def test_the_old_warning_name_appears_only_as_the_pandas_2_name(self) -> None:
        texts = strings(s15()) + [q["question"] + " ".join(q["options"]) + q["explanation"]
                                  for q in bank()]
        old = [t for t in texts if "SettingWithCopy" in t]
        self.assertTrue(old, "the old name is still worth naming once, for old tutorials")
        for t in old:
            with self.subTest(t[:60]):
                self.assertIn("pandas 2.x", t)

    def test_the_chained_assignment_block_names_the_pandas_3_warning(self) -> None:
        text = prose(self.CHAINED)
        self.assertIn("ChainedAssignmentError", text)
        self.assertIn("nunca", text)
        self.assertNotIn("de forma fiable", " ".join(block(self.CHAINED)["paragraphs"][:1]))

    @needs_pandas
    def test_theory_runs_the_chained_write_and_the_parent_stays_unchanged(self) -> None:
        code = block(self.CHAINED)["code"]
        out = stdout_of(code["code"])
        self.assertIn("aviso ChainedAssignmentError", out.splitlines())
        self.assertIn("padre_sin_flag True", out.splitlines())
        self.assertEqual(out, code["output"].rstrip("\n"), "the pinned output drifted")

    def test_the_self_check_stem_and_the_exam_stem_use_the_pandas_3_name(self) -> None:
        stems = [q["question"] for q in s15()["selfCheck"]["questions"]]
        self.assertTrue(any("ChainedAssignmentError" in s for s in stems),
            "the self-check and exam stems must use the pandas 3 name ChainedAssignmentError: checked " + repr(stems)[:300])
        self.assertIn("ChainedAssignmentError", bank_question("En pandas 3, el aviso")["question"])

    @needs_pandas
    def test_the_subset_self_check_has_one_true_option(self) -> None:
        """Pandas 3 behaviour behind the re-keyed item: writing in an uncopied subset does not
        reach the parent and corrupts nothing, so the distractor that says it does is false."""
        q = next(q for q in s15()["selfCheck"]["questions"] if "sobre un subset sin .copy()" in q["question"])
        self.assertIn("no llega al padre", q["options"][q["correctIndex"]])
        self.assertNotIn("SettingWithCopy", " ".join(q["options"]))
        self.assertIn("comparte memoria con el padre", " ".join(q["options"]))
        out = stdout_of(
            "import pandas as pd\n"
            "df = pd.DataFrame({'score': [0.1, 0.9]})\n"
            "sub = df[df['score'] < 0.5]\n"
            "sub['ok'] = True\n"
            "print('ok' in df.columns, sub['ok'].tolist())\n")
        self.assertEqual(out, "False [True]")


class DtypeRuleMatchesTheCsv(unittest.TestCase):
    WRONG = [
        "`object` queda para columnas que mezclaron tipos.",
        "ya no es texto: queda como `object`",
        "el archivo mezcló tipos y pandas se negó a llamarlo `str`",
        "o que una columna mezclada quede como `object`",
    ]

    def test_the_old_rule_is_gone(self) -> None:
        text = " ".join(strings(s15()))
        for wrong in self.WRONG:
            with self.subTest(wrong):
                self.assertNotIn(wrong, text)
        for heading in ("Contrato de la sección (referencia)", "Lectura CSV/Excel y opciones del parser",
                        "Strings, nullable, fechas y categorías"):
            with self.subTest(heading):
                self.assertIn("se lee como `str`", prose(heading))

    @needs_pandas
    def test_pandas_reads_a_mixed_csv_column_as_str_and_excel_or_a_list_as_object(self) -> None:
        out = stdout_of(
            "import io, pandas as pd\n"
            "print(pd.read_csv(io.StringIO('a\\n1\\nLima\\n'))['a'].dtype)\n"
            "print(pd.Series([1, 'Lima']).dtype)\n"
            "b = io.BytesIO()\n"
            "pd.DataFrame({'a': [1, 'Lima']}).to_excel(b, index=False, engine='openpyxl')\n"
            "b.seek(0)\n"
            "print(pd.read_excel(b, engine='openpyxl')['a'].dtype)\n")
        self.assertEqual(out.splitlines(), ["str", "object", "object"])

    def test_nat_is_defined_where_it_is_first_used(self) -> None:
        self.assertIn("NaT (Not a Time) es el nulo de las columnas de fecha", prose("Strings, nullable, fechas y categorías"))

    def test_the_coercion_caption_matches_its_code(self) -> None:
        b = block("Coerción explícita y schema")
        self.assertIn('"N/A"', b["code"]["code"])
        text = " ".join(b["paragraphs"])
        self.assertNotIn("`monto` con `xx`", text)
        self.assertIn("leído con `read_csv` sería nulo", text)

    def test_row_groups_come_before_the_column_order(self) -> None:
        text = prose("Por qué el formato columnar cambia el trabajo que hace la máquina")
        self.assertIn("por columnas** dentro de cada grupo de filas", text)
        self.assertIn("**Particionar** es guardar", text)

    def test_the_figure_draws_cliente_id_as_the_index(self) -> None:
        src = FIGURE.read_text(encoding="utf-8")
        self.assertIn("const ids = ['C001', 'C002', 'C003']", src)
        self.assertNotIn("name: 'cliente_id'", src, "cliente_id is the Index, not a data column")
        self.assertIn("set_index('cliente_id')", block("Series, DataFrame e Index")["figure"]["caption"])


@needs_pandas
class ExcelExportIsReadBack(unittest.TestCase):
    def test_the_demo_compares_columns_after_reading_the_excel_back(self) -> None:
        code = demo("S15-T4-A-DEMO")["code"]
        self.assertIn("read_excel", code["code"])
        self.assertNotIn("len(xbuf.getvalue()) > 100", code["code"])
        self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))
        broken = code["code"].replace('df.to_excel(xbuf', 'df[["cliente_id"]].to_excel(xbuf')
        self.assertIn("excel_ok False", stdout_of(broken))

    def test_the_theory_export_reads_the_excel_back(self) -> None:
        code = block("CSV, Excel y contrato Parquet")["code"]
        self.assertIn("excel_columns ['cliente_id', 'monto', 'region']", stdout_of(code["code"]))


@needs_pandas
class ExercisesCatchTheUsualWrongAnswer(unittest.TestCase):
    """(exercise, text in the solution, the wrong answer planted in its place)."""

    MUTATIONS = [
        ("S15-T1-A-E2", 'float(serie["C002"])', "float(serie.iloc[1])"),
        ("S15-T1-A-E2", 'float(serie["C002"])', "float(serie.iloc[0])"),
        ("S15-T1-B-E3", '    usecols=["cliente_id", "monto"],\n', ""),
        ("S15-T2-A-E2", 'print(df.assign(doble=lambda x: x["score"] * 2)["doble"].tolist())',
         'df["doble"] = df["score"] * 2\nprint(df["doble"].tolist())'),
        ("S15-T2-A-E3", "df.iloc[1, 0]", "df.loc[1, 0]"),
        ("S15-T3-A-E1", '.str.title().astype("category")', '.astype("category")'),
        ("S15-T3-B-E1", 'print(int(df["monto"].isna().sum() - before))', 'print(int(df["monto"].isna().sum()))'),
        ("S15-T3-B-E2", '    return "ok"', '    return "missing"'),
        ("S15-T4-A-E1", "df.to_csv(buf, index=False)", "df.to_csv(buf)"),
        ("S15-T4-A-E2", 'pd.DataFrame({"a": [1]}).to_excel(bio, index=False, engine="openpyxl")\n', ""),
        ("S15-T4-B-E1", "df.memory_usage(deep=True)", "df.memory_usage()"),
        ("S15-T4-B-E2", 'return {"rows": len(df), "columns": df.columns.tolist()}',
         'return {"rows": 3, "columns": ["a"]}'),
        ("S15-T4-B-E3", 'lineterminator="\\n"', 'lineterminator="\\r\\n"'),
    ]

    def test_each_solution_runs_to_its_pin(self) -> None:
        for ex_id in sorted({m[0] for m in self.MUTATIONS}):
            with self.subTest(ex_id):
                sol = exercise(ex_id)["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))

    def test_each_planted_wrong_answer_is_caught(self) -> None:
        for ex_id, right, wrong in self.MUTATIONS:
            with self.subTest(f"{ex_id}: {wrong[:40]!r}"):
                sol = exercise(ex_id)["solutionCode"]
                self.assertEqual(sol["code"].count(right), 1, "the solution text moved")
                self.assertEqual(escaped(sol["code"], sol["output"], sol["code"].replace(right, wrong)), "",
                    "the planted mistake still prints the pinned output, so the exercise does not detect it. "
                    "Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")

    def test_the_hidden_index_trick_still_shows_in_the_first_line(self) -> None:
        """Writing the index and hiding it with index_col=0 gives the right columns on re-read;
        only the first line of the file shows it."""
        sol = exercise("S15-T4-A-E1")["solutionCode"]
        hidden = (sol["code"].replace("df.to_csv(buf, index=False)", "df.to_csv(buf)")
                  .replace("pd.read_csv(buf)", "pd.read_csv(buf, index_col=0)"))
        out = stdout_of(hidden).splitlines()
        self.assertEqual(out[1], "['a', 'b']", "the re-read alone cannot see the trick")
        self.assertNotEqual(out[0], "a,b")


class ExercisePromisesNameWhatTheyCheck(unittest.TestCase):
    def test_hints_and_feedback_name_the_argument_the_check_needs(self) -> None:
        self.assertIn("fill_value=0", " ".join(exercise("S15-T1-A-E3")["hints"]))
        self.assertIn("fill_value=0", prose("Series, DataFrame e Index"))
        self.assertIn("fillna('')", prose("Chained assignment y semántica de copias"))
        self.assertIn("cuenta como incorrecta", exercise("S15-T2-A-E1")["feedback"])
        self.assertIn("LF", exercise("S15-T4-B-E3")["feedback"])

    def test_the_hash_examples_fix_the_line_ending(self) -> None:
        for code in (block("Índices, formatos, provenance y memoria")["code"]["code"],
                     demo("S15-T4-B-DEMO")["code"]["code"],
                     exercise("S15-T4-B-E3")["solutionCode"]["code"]):
            with self.subTest(code[:40]):
                self.assertIn('lineterminator="\\n"', code)


YOU_DO_SOLUTION = '''
def ingest_clientes(text):
    df = pd.read_csv(StringIO(text))
    for c in SCHEMA_CLIENTES:
        if c not in df.columns:
            raise KeyError(c)
    for c in ("cliente_id", "region"):
        df[c] = df[c].astype("string")
    before = df["score"].isna().sum()
    df["score"] = pd.to_numeric(df["score"], errors="coerce")
    report = {"score": int(df["score"].isna().sum() - before)}
    FILL
    return df, report

def ingest_transacciones(text):
    df = pd.read_csv(StringIO(text))
    for c in SCHEMA_TX:
        if c not in df.columns:
            raise KeyError(c)
    for c in ("tx_id", "cliente_id"):
        df[c] = df[c].astype("string")
    before = df["monto"].isna().sum()
    df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    return df, {"monto": int(df["monto"].isna().sum() - before)}

def reconcile(df, expected_cols):
    return {"rows": len(df), "columns": df.columns.tolist(),
            "missing_columns": [c for c in expected_cols if c not in df.columns]}

def export_with_manifest(df, source):
    blob = df.to_csv(index=False, lineterminator="\\n").encode()
    return {"source": source, "rows": len(df), "columns": df.columns.tolist(),
            "sha256": hashlib.sha256(blob).hexdigest()}
'''


@needs_pandas
class YouDoSuiteRejectsZeroFill(unittest.TestCase):
    def program(self, fill: str) -> str:
        starter = s15()["youDo"]["starterCode"]
        head, tail = starter.split("def ingest_clientes", 1)
        tests = "def _run_tests" + tail.split("def _run_tests", 1)[1]
        return head + YOU_DO_SOLUTION.replace("FILL", fill) + tests

    def test_a_right_solution_passes(self) -> None:
        self.assertIn("tests OK", stdout_of(self.program("pass")))

    def test_filling_the_failed_score_with_zero_fails_the_suite(self) -> None:
        done = run_py(self.program('df["score"] = df["score"].fillna(0.0)'))
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("AssertionError", done.stderr)


class YouDoTextAgrees(unittest.TestCase):
    def test_the_objective_and_the_schema_agree_with_the_requirements(self) -> None:
        yd = s15()["youDo"]
        self.assertIn("sha256 del CSV", " ".join(yd["objectives"]))
        self.assertTrue(any(o.startswith("Opcional, si eliges particionar") for o in yd["objectives"]),
            "the optional partition objective must say it is optional: checked " + repr(yd["objectives"])[:300])
        self.assertIn("astype('datetime64')", " ".join(yd["requirements"]))


class ExamBankIsRepaired(unittest.TestCase):
    JOKES = ["Un socket HTTP", "Forzar GPU", "La contraseña del DBA", "Geocodificar",
             "Firmar commits", "Solo el color del logo", "El theme de Streamlit", "coerce encripta"]

    def test_no_joke_distractor_is_left(self) -> None:
        options = [o for q in bank() for o in q["options"]]
        for joke in self.JOKES:
            with self.subTest(joke):
                self.assertNotIn(joke, options)

    def test_the_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(bank())
        self.assertEqual(len(ranks), 24)
        for r in (1, 2, 3, 4):
            with self.subTest(rank=r):
                self.assertLessEqual(ranks.count(r), 7, ranks)

    def test_the_keys_the_review_flagged_now_say_what_the_section_teaches(self) -> None:
        key = lambda start: (q := bank_question(start))["options"][q["correctIndex"]]  # noqa: E731
        self.assertNotIn("joins", key("Un Index estable"))
        self.assertIn("SIN_DATO", key("na_values en read_csv"))
        self.assertNotIn("ownership", key(".copy() tras un filtro"))
        self.assertIn("ValueError", key("astype sin validación"))
        self.assertNotIn("timestamp", key("Un manifest de provenance"))

    @needs_pandas
    def test_astype_on_a_dirty_column_raises_as_the_key_says(self) -> None:
        done = run_py("import pandas as pd\npd.Series(['1', 'x']).astype(float)\n")
        self.assertIn("ValueError", done.stderr)


if __name__ == "__main__":
    unittest.main()
