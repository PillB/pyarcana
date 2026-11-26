'''Proposal 12 (approved 2026-11-21), S24: the P1, P2 and P3 findings of the item-by-item review.

S24 teaches OCR and document intake with synthetic metadata and tokens. The review found four shapes.

First, P1 findings where the code taught the opposite of the rule. The prose said an upscale from
96 to 200 DPI recovers nothing, and the code did exactly that with max(dpi, 200), so the quality gate
passed on arithmetic. The money rule was inverted for Peru: CLDR es-PE writes S/ 1,150.50 (comma for
thousands, dot for decimals), the course read the comma as the decimal, and the code returned 1.15 for
1,150.00 without an error. The section now uses the S16 rule (the last separator is the decimal; a
lone separator before exactly three digits is ambiguous and raises).

Second, examples that contradicted themselves: an average of 0.55 and 0.99 that does not pass 0.85,
a demo parser with no colon guard, a size check that failed open, two names for one queue.

Third, exercises a wrong answer passed: one fixture and one printed constant, a label box that gave
the same output as the value box, no document without conf_ruc, no zip with ocr_fail.

Fourth, an exam bank whose key was the longest option on 24 of 24 items, with a stem in the very
format the course rejected.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s24-rpa-advanced.ts"
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
const section = mod.section24 ?? mod.default?.section24;
if (!section) throw new Error('section24 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s24() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S24 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s24()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s24()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s24()["weDo"]["steps"] if e.get("id") == ex_id]
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



#: The rule the course used before this round, kept verbatim so the money tests can show they would
#: have caught it: both separators → the dot is thousands; one comma → decimal.
OLD_NORM_TOTAL = '''
def norm_total(s):
    s = s.replace("PEN", "").strip().replace(" ", "")
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    return float(s)
'''


def defs_of(code: str) -> str:
    """The imports and function definitions of a snippet, without its prints."""
    keep, inside = [], False
    for line in code.splitlines():
        if line.startswith(("import ", "from ", "def ", "SCHEMA", "MIN_DPI", "MAX_BYTES", "ALLOWED")):
            inside = line.startswith("def ")
            keep.append(line)
        elif inside and (line.startswith(" ") or not line.strip()):
            keep.append(line)
        else:
            inside = False
    return "\n".join(keep) + "\n"


@lru_cache(maxsize=None)
def es_pe(amount: float) -> str:
    """The string a browser prints for a Peruvian amount (CLDR es-PE through ICU)."""
    done = subprocess.run(
        ["node", "-e", f"process.stdout.write(new Intl.NumberFormat('es-PE', {{style: 'currency', currency: 'PEN'}}).format({amount}))"],
        capture_output=True, text=True, timeout=60)
    if done.returncode != 0:
        raise AssertionError(done.stderr)
    return done.stdout.replace(" ", " ")


AMOUNTS = """
for raw in CASES:
    try:
        print(repr(raw), norm_total(raw), sep="\t")
    except ValueError:
        print(repr(raw), "ValueError", sep="\t")
"""


def amounts(defs: str, cases: list[str]) -> dict[str, str]:
    out = stdout_of(defs + f"\nCASES = {cases!r}\n" + AMOUNTS)
    pairs = [line.split("\t", 1) for line in out.splitlines()]
    return {eval(k): v for k, v in pairs}  # noqa: S307 - our own repr of our own strings


ONE_FIXTURE_SEPARATES = {"S24-T2-A-E2"}


class EveryPinRuns(unittest.TestCase):
    @needs_content_py
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s24()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s24()["iDo"]["steps"]]
        self.assertGreaterEqual(len(snippets), 16, f"a theory or demo example was lost: {[n for n, _ in snippets]}")
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s24()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                pin = e["solutionCode"]["output"].rstrip("\n")
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), pin)
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != pin,
                                "the starter already prints the expected output")

    def test_every_pin_holds_more_than_one_result(self) -> None:
        """WEDO-19.1/20.1/21.1: one fixture and one printed value is a check a constant passes.

        T2-A-E2 keeps one fixture because that fixture separates the usual mistake: sorting by
        (x0, y0) gives a different list, which MUTATIONS plants."""
        planted = {ex_id for ex_id, _, _ in MUTATIONS}
        for e in s24()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                if e["id"] in ONE_FIXTURE_SEPARATES:
                    self.assertIn(e["id"], planted)
                    continue
                self.assertGreater(len(e["solutionCode"]["output"].strip().splitlines()), 1)


class TheDpiGateIsOnTheCapture(unittest.TestCase):
    """THEORY-03.1, IDO-01.1 (P1): the prose said an upscale recovers nothing; the code upscaled."""

    def test_no_code_raises_the_dpi(self) -> None:
        codes = [b["code"]["code"] for b in s24()["theory"] if b.get("code")]
        codes += [d["code"]["code"] for d in s24()["iDo"]["steps"]]
        codes += [e["solutionCode"]["code"] for e in s24()["weDo"]["steps"]]
        for code in codes:
            self.assertIsNone(re.search(r"max\([^)]*dpi", code), code[:120])

    @needs_content_py
    def test_a_96_dpi_capture_goes_to_rescan(self) -> None:
        th = block("S24-T1-A")["code"]
        self.assertEqual(th["output"].splitlines(), ["96 True True 20 1.2", "300 False False 50"])
        # Negative control: the old line, an upscale before the gate, makes the gate pass.
        upscaled = mutated(th["code"], '    out["rescan_needed"] = img.get("dpi", 0) < MIN_DPI',
                           '    out["dpi"] = max(img.get("dpi", 0), MIN_DPI)\n    out["rescan_needed"] = out["dpi"] < MIN_DPI')
        self.assertEqual(stdout_of(upscaled).splitlines()[0], "200 False True 20 1.2")
        self.assertIn("rescan_needed=True", prose("S24-T1-A"))
        self.assertIn('img.info["dpi"]', prose("S24-T1-A"))

    def test_the_demo_reports_the_source_dpi(self) -> None:
        dm = demo("S24-T1-A")
        self.assertEqual(dm["code"]["output"], "72 True True")
        self.assertNotIn("suele mejorar", dm["why"])

    @needs_content_py
    def test_the_exercise_catches_an_upscale(self) -> None:
        e = exercise("S24-T1-A-E1")
        sol, pin = e["solutionCode"]["code"], e["solutionCode"]["output"]
        self.assertEqual(escaped(sol, pin, mutated(sol, "    print(dpi, dpi < 200)", "    dpi = max(dpi, 200)\n    print(dpi, dpi < 200)")), "",
            "the planted mistake still prints the pinned output, so the exercise does not detect it. "
            "Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")


class PeruvianAmounts(unittest.TestCase):
    """THEORY-07.1/07.2/07.3 (P1/P2), EXAM-14.1: es-PE is a comma for thousands and a dot for decimals."""

    CASES = ["S/ 1,150.50", "1,150.00", "1.150,50", "150,00", "PEN 99.90", "1,150"]
    WANT = {"S/ 1,150.50": "1150.5", "1,150.00": "1150.0", "1.150,50": "1150.5", "150,00": "150.0",
            "PEN 99.90": "99.9", "1,150": "ValueError"}

    @needs_content_py
    def test_theory_and_exercise_follow_the_s16_rule(self) -> None:
        for name, code in (("theory", block("S24-T3-A")["code"]["code"]),
                           ("T3-A-E3", exercise("S24-T3-A-E3")["solutionCode"]["code"])):
            with self.subTest(name):
                self.assertEqual(amounts(defs_of(code), self.CASES), self.WANT)

    @needs_content_py
    def test_the_string_a_browser_prints_for_es_pe_parses(self) -> None:
        printed = es_pe(1234.5)
        self.assertEqual(printed, "S/ 1,234.50")
        got = amounts(defs_of(block("S24-T3-A")["code"]["code"]), [printed])
        self.assertEqual(got[printed], "1234.5")
        # Negative control: the old rule reads the Peruvian comma as a decimal and is 1000x off.
        old = amounts(OLD_NORM_TOTAL, ["1,234.50", "1,150.00"])
        self.assertEqual(old, {"1,234.50": "1.2345", "1,150.00": "1.15"})

    def test_the_prose_states_the_rule(self) -> None:
        text = prose("S24-T3-A")
        self.assertIn("coma de miles y punto decimal", text)
        self.assertIn("`total_unparsed`", text)
        blob = json.dumps(s24(), ensure_ascii=False)
        self.assertNotIn("coma decimal", blob)

    def test_the_exam_item_keys_the_right_value(self) -> None:
        hits = [q for q in exam_bank.bank_for("rpa-advanced") if "S/ 1,234.50" in q["question"]]
        self.assertEqual(len(hits), 1)
        self.assertTrue(hits[0]["options"][hits[0]["correctIndex"]].startswith("1234.5,"),
            "the es-PE amount 'S/ 1,234.50' must be keyed as 1234.5: expected the start " + repr("1234.5,")
            + ", got " + repr((hits[0]["options"][hits[0]["correctIndex"]])[:160]))


#: (exercise, old, new): the usual wrong answer, planted in the solution; the pin must catch it.
MUTATIONS = [
    ("S24-T1-A-E2", "print(abs(skew) >= 0.5)", "print(skew >= 0.5)"),
    ("S24-T1-A-E3", '"rescan_needed": img["dpi"] < 200,', '"rescan_needed": max(img["dpi"], 200) < 200,'),
    ("S24-T1-B-E3", "score < 0.5 or tie", "score < 0.5"),
    ("S24-T2-A-E1", ">= 0.85", "> 0.85"),
    ("S24-T2-A-E2", 'key=lambda t: (t["bbox"][1], t["bbox"][0])', 'key=lambda t: (t["bbox"][0], t["bbox"][1])'),
    ("S24-T2-A-E3", 'm = min(f["conf"] for f in fields)', 'm = round(sum(f["conf"] for f in fields) / len(fields), 2)'),
    ("S24-T2-B-E3", 'boxes[k]["value"]', 'boxes[k]["label"]'),
    ("S24-T2-B-E3", "    if k not in boxes:\n        sin_bbox.append(k)\n        continue\n", ""),
    ("S24-T3-A-E2", "'%d/%m/%Y'", "'%m/%d/%Y'"),
    ("S24-T3-A-E3", '    if re.search(r"[A-Za-z]", s):\n        return None  # letra = corrupción OCR, no inventar RUC\n', ""),
    ("S24-T3-A-E3", "return d if len(d) == 11 else None", "return d"),
    ("S24-T3-A-E3", 'miles = "." if s.rfind(",") > s.rfind(".") else ","', 'miles = "."'),
    ("S24-T3-B-E1", "> 0.01", "> 0.001"),
    ("S24-T3-B-E3", 'conf = doc.get("conf_ruc")', 'conf = doc.get("conf_ruc", 1.0)'),
    ("S24-T4-A-E1", "print(correct / n)", "print(0.75)"),
    ("S24-T4-A-E2", "print(round(sum(1 for r in g if r['ruc_pred'] == r['ruc_true']) / len(g), 3))", "print(0.5)"),
    ("S24-T4-A-E3", "print(acc_ruc, coverage_auto)", "print(0.5, 0.7)"),
    ("S24-T4-B-E2", "n_bytes > 5_000_000", "n_bytes >= 5_000_000"),
    ("S24-T4-B-E3", '''    if c["mime"] not in ALLOWED:
        print("reject")
    elif c["n_bytes"] > MAX_BYTES:
        print("reject")
    elif c["status_ocr"] == "ocr_fail":
        print("human_rescan")''', '''    if c["status_ocr"] == "ocr_fail":
        print("human_rescan")
    elif c["mime"] not in ALLOWED:
        print("reject")
    elif c["n_bytes"] > MAX_BYTES:
        print("reject")'''),
]


class ExercisesCatchTheUsualMistake(unittest.TestCase):
    """WEDO-12.1/12.2/15.1/18.1/19.1/20.1/21.1/23.1/24.1, 04.2, 08.1: a wrong answer passed."""

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
            ("toks=[{'text':'A','conf':0.9},{'text':'B','conf':0.5}]\nprint([t['text'] for t in toks if t['conf']>0.85])", "['A']"),
            ('lines = ["RUC: 20123456789", "Total: 150.00"]\nbboxes = {"RUC": [0, 0, 10, 10], "Total": [0, 20, 40, 30]}\n'
             'print(sorted([(k.strip(), v.strip(), bboxes[k.strip()]) for k, v in (ln.split(":", 1) for ln in lines)]))',
             "[('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])]"),
            ("n=6_000_000\nprint('reject' if n >= 5_000_000 else 'ok')", "reject"),
            ("print(0.75)", "0.75"),
        ]
        for code, pin in old_cases:
            self.assertEqual(stdout_of(code), pin)


class TheDemosAgreeWithTheTheory(unittest.TestCase):
    @needs_content_py
    def test_the_demo_parser_skips_lines_without_a_colon(self) -> None:
        """IDO-04.1: the demo crashed on any OCR line without a colon."""
        code = demo("S24-T2-B")["code"]["code"]
        self.assertEqual(stdout_of(code), "{'RUC': '20123456789', 'Total': '10'}")
        unguarded = mutated(code, '        if ":" not in ln:\n            continue  # cabecera o texto corrido: sin dos puntos no hay par\n', "")
        self.assertNotEqual(run_py(unguarded).returncode, 0)

    def test_letters_in_a_ruc_give_none_in_the_demo(self) -> None:
        """IDO-05.1."""
        self.assertIn("20X123456789 None", demo("S24-T3-A")["code"]["output"])

    def test_one_name_for_auto_accept_and_one_queue(self) -> None:
        """IDO-06.1, THEORY-08.1."""
        self.assertEqual(demo("S24-T3-B")["code"]["output"], "auto")
        blob = json.dumps(s24(), ensure_ascii=False)
        self.assertNotIn("human_queue", blob)

    @needs_content_py
    def test_a_missing_size_fails_closed(self) -> None:
        """IDO-08.1/08.2, THEORY-10.1: size missing was read as 0 bytes; 5,000,000 had two rules."""
        self.assertEqual(demo("S24-T4-B")["code"]["output"].splitlines(), ["ok", "reject"])
        gate = block("S24-T4-B")["code"]["output"].splitlines()
        self.assertEqual(gate[-2:], ["('ok', 'pass')", "('reject', 'size_missing')"])
        blob = json.dumps(s24(), ensure_ascii=False)
        self.assertNotIn('meta.get(\\"n\\", 0)', blob)
        self.assertIn("tamaño descomprimido", prose("S24-T4-B"))

    def test_the_averaging_example_really_passes(self) -> None:
        """THEORY-05.1, IDO-03.1: the old averages (0.77, 0.725) did not pass 0.85."""
        self.assertGreaterEqual((0.55 + 6 * 0.97) / 7, 0.85)
        self.assertIn("da un promedio de 0.91", prose("S24-T2-A"))
        out = demo("S24-T2-A")["code"]["output"].splitlines()
        self.assertGreaterEqual(float(out[0].split()[1]), 0.85)
        self.assertIn("'20X'", out[1])
        # Negative control: the old example averages below the threshold.
        self.assertLess((0.55 + 0.99) / 2, 0.85)


class EvidenceIsTheValueBox(unittest.TestCase):
    def test_the_theory_builds_a_field_dict_with_the_value_box(self) -> None:
        """THEORY-06.1, EXAM-11.1."""
        out = block("S24-T2-B")["code"]["output"]
        self.assertIn("{'name': 'RUC', 'value': '20123456789', 'bbox': [60, 50, 200, 70]}", out)
        self.assertIn("filas_desalineadas [3]", out)
        self.assertIn("desalinearse o fusionarse", prose("S24-T2-B"))

    def test_the_bbox_format_is_stated(self) -> None:
        """THEORY-05.2, WEDO-08.1, HEADER-01.1."""
        self.assertIn("`[x0, y0, x1, y1]` en píxeles", prose("S24-T2-A"))
        outcomes = " ".join(o["text"] for o in s24()["learningOutcomes"])
        self.assertIn("caja delimitadora (bbox)", outcomes)
        self.assertIn("(golden set)", outcomes)

    @needs_content_py
    def test_the_you_do_fixture_has_value_tokens_and_can_be_solved(self) -> None:
        """YOUDO-01.1..01.4: the value box was not in the fixture; one doc, fixed predictions."""
        yd = s24()["youDo"]
        starter = yd["starterCode"]
        self.assertNotIn('"ruc_pred":', starter)
        reference = starter + YOU_DO_REFERENCE
        out = stdout_of(reference).splitlines()
        self.assertEqual(out[2:], [
            "d1 auto [] 2026-01-15 invoice.v1 [70, 50, 200, 70]",
            "d2 needs_review ['total_mismatch', 'ruc_missing', 'ruc_low_conf', 'rescan_needed'] 2026-01-05 invoice.v1 [70, 50, 200, 70]",
            "d3 needs_review ['total_unparsed', 'ruc_conf_missing'] 2026-01-20 invoice.v1 [70, 50, 200, 70]",
            "acc_ruc 0.667 acc_total 0.667 coverage_auto 0.333",
        ])
        reqs = " ".join(yd["requirements"])
        self.assertIn("schema_version", reqs)
        self.assertIn("norm_fecha", reqs)
        self.assertIn("schema_version", " ".join(r["criterion"] for r in yd["rubric"]))


#: A reference solution run on the You Do starter's own fixtures: the requirements can be met from
#: what the learner is given, and the three documents exercise auto, the three P1/P2 reasons and the
#: ambiguous amount.
YOU_DO_REFERENCE = r'''

def preprocess(meta):
    out = dict(meta)
    out["rescan_needed"] = meta.get("dpi", 0) < 200
    out["deskew_applied"] = abs(meta.get("skew_deg", 0.0)) >= 0.5
    return out

def parse_kv(toks):
    fields = {}
    for label, value in zip(toks[::2], toks[1::2]):
        name = label["text"].rstrip(":").strip().lower()
        fields[name] = {"value": value["text"], "conf": value.get("conf"), "bbox": value["bbox"]}
    return fields

def norm_ruc(s):
    if re.search(r"[A-Za-z]", s):
        return None
    d = re.sub(r"\D", "", s)
    return d if len(d) == 11 else None

def norm_total(s):
    s = s.replace("S/", "").replace("PEN", "").replace(" ", "")
    if "," in s and "." in s:
        miles = "." if s.rfind(",") > s.rfind(".") else ","
        s = s.replace(miles, "")
    elif re.fullmatch(r"\d{1,3}[.,]\d{3}", s):
        raise ValueError(s)
    return float(s.replace(",", "."))

def norm_fecha(s):
    try:
        return datetime.strptime(s, "%d/%m/%Y").date().isoformat()
    except ValueError:
        return None

rows, auto = [], 0
for doc in docs:
    meta = preprocess(doc["img"])
    f = parse_kv(doc["tokens"])
    reasons = []
    try:
        total = norm_total(f["total"]["value"])
    except ValueError:
        total = None
        reasons.append("total_unparsed")
    if total is not None and abs(sum(doc["lines"]) - total) > 0.01:
        reasons.append("total_mismatch")
    ruc = norm_ruc(f["ruc"]["value"])
    if ruc is None:
        reasons.append("ruc_missing")
    conf = f["ruc"]["conf"]
    if conf is None:
        reasons.append("ruc_conf_missing")
    elif conf < 0.85:
        reasons.append("ruc_low_conf")
    if meta["rescan_needed"]:
        reasons.append("rescan_needed")
    status = "auto" if not reasons else "needs_review"
    auto += status == "auto"
    print(doc["id"], status, reasons, norm_fecha(f["fecha"]["value"]), SCHEMA_VERSION, f["ruc"]["bbox"])
    rows.append({"ruc_pred": ruc, "total_pred": total, **truth[doc["id"]]})

def field_acc(rows, field):
    return sum(1 for r in rows if r[f"{field}_pred"] == r[f"{field}_true"]) / len(rows)

print("acc_ruc", round(field_acc(rows, "ruc"), 3), "acc_total", round(field_acc(rows, "total"), 3),
      "coverage_auto", round(auto / len(docs), 3))
'''


class LearnerFacingText(unittest.TestCase):
    def test_no_authoring_notes_or_english_build_words(self) -> None:
        """WEDO-02.1 and siblings, WEDO-17.2/18.2/24.2."""
        texts = learner_strings(s24())
        texts += [e["starterCode"]["code"] for e in s24()["weDo"]["steps"]]
        texts.append(s24()["youDo"]["starterCode"])
        for t in texts:
            for word in ("learner", " rules", "scaffold"):
                self.assertNotIn(word, t)

    def test_the_date_hint_names_the_silent_swap(self) -> None:
        """WEDO-14.1: 15/01/2026 does not misread under %m/%d/%Y; it raises."""
        blob = json.dumps(s24(), ensure_ascii=False)
        self.assertNotIn("interpreta mal el 15", blob)
        self.assertNotIn("interpreta mal el día 15", blob)
        self.assertIn("2026-05-01", " ".join(exercise("S24-T3-A-E2")["hints"]))
        self.assertIn("2026-05-01", prose("S24-T3-A"))

    def test_the_raw_image_is_deleted_after_a_controlled_copy(self) -> None:
        """THEORY-10.2."""
        self.assertIn("solo después de guardar una copia de revisión controlada", block("S24-T4-B")["callout"]["content"])

    def test_golden_set_is_glossed_before_t4(self) -> None:
        """THEORY-07.4."""
        self.assertIn("golden set (el conjunto de referencia etiquetado a mano", prose("S24-T3-A"))


class NoNewIdentifierShapedValue(unittest.TestCase):
    """Codex review on #204 (P1): the second batch added 20600000001, an 11-digit RUC-shaped value.

    sections/AGENTS.md D2 bars identifier-shaped values in synthetic data. The two placeholders
    S24 already used before proposal 12 (sequential digits, one with a wrong last digit) stay,
    because the section teaches normalisation of exactly that shape; this test stops any new one."""

    BEFORE_P12 = {"20123456789", "20123456780"}

    def test_every_ruc_shaped_value_is_one_the_section_already_had(self) -> None:
        text = SECTION.read_text(encoding="utf-8")
        found = set(re.findall(r"(?<!\d)\d{11}(?!\d)", text))
        self.assertTrue(found, "the scan found no 11-digit value at all, so it checks nothing")
        self.assertEqual(found - self.BEFORE_P12, set(),
                         "a new RUC-shaped value entered S24; reuse a placeholder already in the section "
                         "or an opaque id such as CLI-0001 (sections/AGENTS.md D2)")

    def test_the_scan_sees_a_new_value(self) -> None:
        """Negative control: the same regex flags the value the review found."""
        self.assertEqual(set(re.findall(r"(?<!\d)\d{11}(?!\d)", '"ruc_true": "20600000001"')) - self.BEFORE_P12,
                         {"20600000001"}, "the scan regex misses an 11-digit value in a JSON-like fixture")


class SelfCheckHasNoGiveaway(unittest.TestCase):
    def test_the_key_is_not_the_lone_short_option(self) -> None:
        """SELFCHECK-01.1/02.1/03.1."""
        for i, q in enumerate(s24()["selfCheck"]["questions"][:3]):
            with self.subTest(i):
                lengths = [len(o) for o in q["options"]]
                key = lengths[q["correctIndex"]]
                self.assertNotEqual(key, min(lengths))
                self.assertEqual(lengths.count(key), 1)
        q3 = s24()["selfCheck"]["questions"][2]["options"]
        self.assertNotIn("Cada campo necesita además su propio umbral de confianza", q3)
