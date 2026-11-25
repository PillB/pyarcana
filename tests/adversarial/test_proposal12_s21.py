"""Proposal 12 (approved 2026-11-21), S21: the P1, P2 and P3 findings of the item-by-item review.

S21 teaches documents and traceable reports: Jinja, python-docx, ReportLab, pypdf and PyMuPDF. The
review found four shapes.

First, an environment that could not run the section. The lesson told learners to install reportlab,
but requirements-content.txt did not pin it, so the runtime audit skipped every PDF snippet and the
`output:` blocks were promises nobody checked. `import fitz` printed a deprecation line the pins did
not show. reportlab is now pinned and every PyMuPDF import is `import pymupdf`.

Second, gates that could not fail, in the section whose subject is gates. `ready` used
`all(checklist.values())`, which a checklist without `doc` passes (P1). The parity demo compared three
identical literals. `has_h1` was a typed True. The closing manifest typed its checklist as True and
listed a Markdown file the section never writes. Each now computes from the artifact, and the tests
below break the artifact and expect the flag to move.

Third, text that disagreed with the code or with Excel: "sus hashes" with no hash of any file, a
comment warning against the pattern the next demo used, `round()` promised to match Excel (it rounds
ties to even; Excel rounds them away from zero), two names for one helper, two names for the files,
and a format filter taught without saying it crashes on the missing value the next sentence teaches.

Fourth, an exam bank with thin explanations, one key on a wrong option, and the key longest on 16 of
24 items.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s21-fastapi.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

VENV_PY = ROOT / ".venv-content/bin/python"
if VENV_PY.exists():
    CONTENT_PY: Path | None = VENV_PY
elif os.environ.get("PYARCANA_PINNED_CONTENT_ENV") == "1":
    CONTENT_PY = Path(sys.executable)
else:
    CONTENT_PY = None
needs_reportlab = unittest.skipUnless(
    CONTENT_PY, "needs the pinned content interpreter (jinja2, python-docx, reportlab, pypdf, pymupdf)")

#: A dynamic import, read from the named export or from `default`: Node 20 (content-gates) exposes
#: a .ts module's exports in this CommonJS package only on `default`. See docs/agents/lessons.md.
DUMP = """
const mod = await import({path!r});
const section = mod.section21 ?? mod.default?.section21;
if (!section) throw new Error('section21 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s21() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S21 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s21()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s21()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s21()["weDo"]["steps"] if e.get("id") == ex_id]
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


def all_code() -> list[str]:
    codes = [b["code"]["code"] for b in s21()["theory"] if b.get("code")]
    codes += [d["code"]["code"] for d in s21()["iDo"]["steps"]]
    for e in s21()["weDo"]["steps"]:
        codes += [e["starterCode"]["code"], e["solutionCode"]["code"]]
    return codes + [s21()["youDo"]["starterCode"]]


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


class Environment(unittest.TestCase):
    """THEORY-02.1, -06.1, IDO-04.1, WEDO-10.1, -12.1, YOUDO-01.1: reportlab was not declared."""

    def test_reportlab_is_pinned_with_its_section(self) -> None:
        req = (ROOT / "requirements-content.txt").read_text(encoding="utf-8")
        self.assertRegex(req, r"(?m)^reportlab==\d+\.\d+\.\d+$")
        self.assertRegex(req, r"#\s+reportlab\s+S21")

    def test_the_missing_dependency_ratchet_counts_only_s41(self) -> None:
        audit = (ROOT / "scripts" / "python_content_runtime_audit.py").read_text(encoding="utf-8")
        self.assertIn("MISSING_DEPENDENCY_OWED = 1\n", audit)

    def test_no_code_imports_the_deprecated_fitz_name(self) -> None:
        """IDO-04.2, WEDO-11.1, YOUDO-01.5: `import fitz` prints a deprecation line on stdout."""
        for code in all_code():
            self.assertNotRegex(code, r"\bimport fitz\b|\bfitz\.")

    @needs_reportlab
    def test_the_old_name_really_prints_an_extra_line(self) -> None:
        """Negative control for the test above: if fitz went quiet, the rename would be cosmetic."""
        old = stdout_of("import fitz\nprint('ok')")
        self.assertNotEqual(old, "ok")
        self.assertEqual(stdout_of("import pymupdf\nprint('ok')"), "ok")


class EveryPinRuns(unittest.TestCase):
    @needs_reportlab
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s21()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s21()["iDo"]["steps"]]
        self.assertEqual(len(snippets), 16)
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_reportlab
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s21()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), e["solutionCode"]["output"].rstrip("\n"))
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != e["solutionCode"]["output"].rstrip("\n"),
                                "the starter already prints the expected output")


class GatesCanFail(unittest.TestCase):
    """Each check the section calls evidence moves when the thing it guards breaks."""

    @needs_reportlab
    def test_ready_needs_the_three_named_keys(self) -> None:
        """WEDO-24.1 (P1): all(checklist.values()) passed a checklist without doc."""
        sol = exercise("S21-T4-B-E3")["solutionCode"]
        self.assertTrue(sol["output"].endswith("False\nFalse"),
            "a checklist without the doc key must not be ready: expected the end " + repr("False\nFalse")
            + ", got " + repr((sol["output"])[-160:]))
        values_only = mutated(sol["code"], 'all(checklist.get(k, False) for k in ("dashboard", "xlsx", "doc"))',
                              "all(checklist.values())")
        self.assertEqual(stdout_of(values_only).splitlines()[2], "True")
        self.assertIn("una clave que falta cuenta como no lista", prose("S21-T4-B"))

    @needs_reportlab
    def test_the_parity_demo_shows_a_divergent_document(self) -> None:
        """IDO-06.1 and THEORY-08.1: three identical literals could only print True."""
        out = demo("S21-T3-B")["code"]["output"]
        self.assertIn("parity False", out)
        self.assertIn("difiere ('median_Lima'", out)
        th = block("S21-T3-B")["code"]
        self.assertEqual(th["output"].splitlines()[:2], ["paridad True", "paridad False"])
        self.assertNotIn('assert "40" in caption', th["code"])
        # The caption is built from the metrics, so changing n changes the caption.
        moved = mutated(th["code"], 'dash = {"median_Lima": 28.0, "n_Lima": 40}', 'dash = {"median_Lima": 28.0, "n_Lima": 41}')
        self.assertIn("n_Lima=41", stdout_of(moved))

    @needs_reportlab
    def test_has_h1_is_read_from_the_reopened_docx(self) -> None:
        """IDO-07.1: has_h1 was a typed True."""
        d = demo("S21-T4-A")["code"]
        self.assertNotIn('"has_h1": True', d["code"])
        self.assertTrue(d["output"].endswith("a11y_min con_h1 True\na11y_min sin_h1 False"),
            "has_h1 must be read from the reopened .docx, True with a heading and False without: expected the end " + repr("a11y_min con_h1 True\na11y_min sin_h1 False")
            + ", got " + repr((d["output"])[-160:]))
        # Negative control: give the bold-only document a real heading and the gate must flip.
        fixed = mutated(d["code"], 'sin_h1.add_paragraph().add_run("Resumen ejecutivo").bold = True',
                        'sin_h1.add_heading("Resumen ejecutivo", 1)')
        self.assertTrue(stdout_of(fixed).endswith("a11y_min sin_h1 True"),
            "adding the heading must flip has_h1 to True; a typed True would not change: expected the end " + repr("a11y_min sin_h1 True")
            + ", got " + repr((stdout_of(fixed))[-160:]))

    @needs_reportlab
    def test_the_manifest_hashes_the_files_the_section_writes(self) -> None:
        """IDO-08.1/.2/.3, THEORY-06.3, THEORY-10.1: no file hash, a Markdown file never written, typed flags."""
        d = demo("S21-T4-B")["code"]
        self.assertNotIn("informe.md", d["code"])
        self.assertNotIn('"visual_checklist": {"dashboard": True', d["code"])
        self.assertIn("['informe.docx', 'informe.pdf', 'informe-p1.png']", d["output"])
        self.assertIn("sha256_por_archivo True", d["output"])
        # Negative control: a PDF that is not a PDF must turn its check and ready_for_review False.
        broken = mutated(d["code"], "    c.save()\n", "    c.save()\n    pdf.write_bytes(b'no soy un pdf')\n")
        broken = mutated(broken, "    with pymupdf.open(pdf) as doc:\n        doc[0].get_pixmap().save(png)\n",
                         "    png.write_bytes(b'\\x89PNG fake')\n")
        out = stdout_of(broken)
        self.assertIn("'informe.pdf': False", out)
        self.assertIn("archivos_ok False", out, "a PDF that is not a PDF must fail the file checks")

    @needs_reportlab
    def test_ready_needs_the_files_and_the_visual_checklist(self) -> None:
        """Codex review on #201 (P2): ready_for_review read only the file checks, so it was True
        before anyone looked at the dashboard, xlsx or doc (T4-B's ready contract needs all three)."""
        d = demo("S21-T4-B")["code"]
        self.assertIn("ready_for_review False", d["output"].splitlines(),
                      "with the visual checklist all False the package must not be ready")
        looked = mutated(d["code"], '"visual_checklist": {"dashboard": False, "xlsx": False, "doc": False}',
                         '"visual_checklist": {"dashboard": True, "xlsx": True, "doc": True}')
        self.assertIn("ready_for_review True", stdout_of(looked).splitlines(),
                      "once a person marks the three checks, good files must be ready")
        two = mutated(d["code"], '"visual_checklist": {"dashboard": False, "xlsx": False, "doc": False}',
                      '"visual_checklist": {"dashboard": True, "xlsx": True}')
        self.assertIn("ready_for_review False", stdout_of(two).splitlines(),
                      "a missing doc key must count as not inspected, as in the T4-B ready contract")

    @needs_reportlab
    def test_a_hand_edit_after_the_run_is_detected(self) -> None:
        """THEORY-10.1: the theory manifest recomputes the SHA-256 and compares."""
        th = block("S21-T4-B")["code"]
        self.assertTrue(th["output"].endswith("intacto True\nintacto tras editar a mano False"),
            "the manifest must recompute the SHA-256 and flag a hand edit: expected the end " + repr("intacto True\nintacto tras editar a mano False")
            + ", got " + repr((th["output"])[-160:]))
        self.assertIn('"tabla1.csv": "', th["output"])
        no_edit = mutated(th["code"], 'Path("tabla1.csv").write_bytes(b"region,mediana,n\\nLima,30.0,40\\n")',
                          'Path("tabla1.csv").write_bytes(b"region,mediana,n\\nLima,28.0,40\\n")')
        self.assertTrue(stdout_of(no_edit).endswith("intacto tras editar a mano True"),
            "without the hand edit the manifest must match; otherwise the check flags everything: expected the end " + repr("intacto tras editar a mano True")
            + ", got " + repr((stdout_of(no_edit))[-160:]))


class ExcelRounding(unittest.TestCase):
    """THEORY-09.1/.2, WEDO-20.1: round() rounds ties to even; Excel ROUND rounds them away from zero."""

    @needs_reportlab
    def test_fmt_pen_matches_excel_on_the_tie(self) -> None:
        th = block("S21-T4-A")["code"]
        self.assertIn("round 28.2 | fmt_pen 28.3 PEN", th["output"])
        self.assertIn("ROUND_HALF_UP", prose("S21-T4-A"))
        # Negative control: the same helper on round() loses the tie, which is what the text warns.
        with_round = mutated(th["code"], 'q = Decimal(str(x)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)',
                             "q = round(x, 1)")
        self.assertIn("fmt_pen 28.2 PEN", stdout_of(with_round))

    @needs_reportlab
    def test_fmt_pen_writes_a_dash_for_missing(self) -> None:
        out = exercise("S21-T4-A-E2")["solutionCode"]["output"]
        self.assertEqual(out.splitlines(), ["28.0 PEN", "28.3 PEN", "—"])

    def test_one_name_for_the_helper(self) -> None:
        self.assertNotIn("format_metric", json.dumps(s21(), ensure_ascii=False))

    @needs_reportlab
    def test_the_format_filter_is_guarded_and_the_crash_is_real(self) -> None:
        """THEORY-04.1: the taught filter raised TypeError on the missing value."""
        th = block("S21-T1-B")["code"]
        self.assertIn("- Bogota: —", th["output"])
        self.assertIn("TypeError", prose("S21-T1-B"))
        unguarded = mutated(th["code"], " if r.median is not none else '—' ", " ")
        done = run_py(unguarded)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("TypeError", done.stderr)


class OneStory(unittest.TestCase):
    def test_the_files_have_one_name(self) -> None:
        """THEORY-01.2: demos wrote reporte.*, theory wrote informe.*."""
        blob = json.dumps(s21(), ensure_ascii=False)
        self.assertNotRegex(blob, r"reporte\.(docx|pdf)|reporte-p1")

    def test_the_comment_does_not_warn_about_a_failure_that_does_not_happen(self) -> None:
        """THEORY-06.2: the orphan-page warning was false, and IDO-04 used the warned pattern."""
        self.assertNotIn("huerfana", block("S21-T2-B")["code"]["code"])
        self.assertIn("with pymupdf.open(pdf) as doc", demo("S21-T2-B")["code"]["code"])

    def test_the_closing_callout_names_the_hash(self) -> None:
        """THEORY-01.1: 'sus hashes' with no hash of any file."""
        callout = s21()["theory"][0]["callout"]["content"]
        self.assertIn("SHA-256 de los bytes de cada archivo", callout)

    def test_jinja_and_factory_are_glossed_where_they_first_appear(self) -> None:
        self.assertIn("librería de plantillas de Python", s21()["learningOutcomes"][0]["text"])
        self.assertIn("un programa que genera todos los documentos", s21()["jobRelevance"])

    def test_a_hash_is_not_called_a_signature(self) -> None:
        """WEDO-23.1."""
        self.assertNotIn("firmas el artefacto", json.dumps(s21(), ensure_ascii=False))

    def test_edge_cases_say_what_happens(self) -> None:
        """WEDO-03.1, -04.1, -12.2, -16.1."""
        self.assertIn("UndefinedError", " ".join(exercise("S21-T1-A-E3")["edgeCases"]))
        self.assertIn("pd.isna", " ".join(exercise("S21-T1-B-E1")["edgeCases"]))
        self.assertIn("S24", " ".join(exercise("S21-T2-B-E3")["edgeCases"]))
        self.assertIn("28 == 28.0", " ".join(exercise("S21-T3-B-E1")["edgeCases"]))


#: One planted mistake per exercise the review named, in the shape a learner makes it.
MUTATIONS = [
    ("S21-T1-A-E2", "render(m=28.0, n=40)", "render(m=28, n=40)"),
    ("S21-T2-A-E1", 'doc.add_heading("Resumen", 1)', 'doc.add_paragraph("Resumen")'),
    ("S21-T3-B-E2", '"Fig1 | Fuente: sintético | n=40"', '"Fig1 | Fuente: sintético | n=17"'),
    ("S21-T3-B-E3", " return a == b == c", " return b == c"),
    ("S21-T4-A-E2", ' if x is None:\n  return "—"\n', ""),
    ("S21-T4-A-E3", ' and "n=" in a and ("PEN" in a or "%" in a)', ""),
    ("S21-T4-B-E3", 'all(checklist.get(k, False) for k in ("dashboard", "xlsx", "doc"))', "all(checklist.values())"),
]


class WeDoChecksCanFail(unittest.TestCase):
    @needs_reportlab
    def test_every_planted_mistake_changes_the_answer(self) -> None:
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertEqual(escaped(sol["code"], sol["output"], mutated(sol["code"], old, new)), "",
                    f"{ex_id}: the planted mistake prints the pinned answer"
                    + ". Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")


YOU_DO_FILL = {
    'raise NotImplementedError("build_docx: DOCX con Heading + métricas del context")': '''
    path = Path("informe.docx")
    doc = Document()
    doc.add_heading("Resumen", 1)
    kpi = Template("Ticket mediano {{ median_Lima }} PEN (n={{ n_Lima }})").render(**ctx)
    doc.add_paragraph(kpi)
    doc.save(path)
    return path''',
    'raise NotImplementedError("build_pdf: ReportLab + capa de texto con n y mediana")': '''
    path = Path("informe.pdf")
    c = canvas.Canvas(str(path))
    c.drawString(72, 760, f"Ticket mediano {ctx['median_Lima']} PEN (n={ctx['n_Lima']})")
    c.save()
    return path''',
    'raise NotImplementedError("extract_and_render: texto + PNG")': '''
    text = "".join(p.extract_text() or "" for p in PdfReader(pdf).pages)
    png = Path("informe-p1.png")
    with pymupdf.open(pdf) as doc:
        doc[0].get_pixmap().save(png)
    return text, png''',
    'raise NotImplementedError("manifest: provenance + pending_review")': '''
    text = "".join(p.extract_text() or "" for p in PdfReader(artifacts["pdf"]).pages)
    return {
        "run_id": context["run_id"],
        "data_sha1_8": hashlib.sha1(json.dumps(context, sort_keys=True).encode()).hexdigest()[:8],
        "artifacts": {k: {"path": str(p), "sha256": hashlib.sha256(Path(p).read_bytes()).hexdigest()}
                      for k, p in artifacts.items()},
        "needs_ocr": not text.strip(),
        "visual_checklist": checklist,
        "approval": {"status": "pending_review"},
    }''',
}


def you_do_solution(starter: str) -> str:
    filled = starter
    for old, new in YOU_DO_FILL.items():
        filled = mutated(filled, "    " + old, new.lstrip("\n"))
    filled = re.sub(r"(?m)^# (docx_path|pdf_path|text, png_path|checklist|pack|assert|print)", r"\1", filled)
    return filled


class YouDo(unittest.TestCase):
    def starter(self) -> str:
        return s21()["youDo"]["starterCode"]

    def test_criterion_two_asks_for_median_and_n(self) -> None:
        """YOUDO-01.2: criterion 2 asked for n alone, criterion 5 for both."""
        self.assertIn("pypdf extrae n=40 y la mediana 28.0", self.starter())

    def test_needs_ocr_is_specified_where_the_rubric_grades_it(self) -> None:
        """YOUDO-01.3."""
        reqs = " ".join(s21()["youDo"]["requirements"])
        self.assertIn("needs_ocr", reqs)
        self.assertIn("needs_ocr", self.starter())

    def test_the_checklist_is_an_input(self) -> None:
        """YOUDO-01.4: nothing said where the dashboard and xlsx flags came from."""
        self.assertIn("def manifest(artifacts: dict, checklist: dict) -> dict:", self.starter())
        self.assertIn('checklist = {"dashboard": False, "xlsx": False, "doc": False}', self.starter())

    @needs_reportlab
    def test_the_starter_imports_cleanly(self) -> None:
        self.assertEqual(stdout_of(self.starter()), "")

    @needs_reportlab
    def test_a_filled_project_meets_its_criteria(self) -> None:
        pack = json.loads(stdout_of(you_do_solution(self.starter())))
        self.assertEqual(pack["approval"]["status"], "pending_review")
        self.assertFalse(pack["needs_ocr"],
            "a PDF with a text layer must not be sent to OCR")
        self.assertEqual(set(pack["artifacts"]), {"docx", "pdf", "png"})
        self.assertTrue(all(len(a["sha256"]) == 64 for a in pack["artifacts"].values()),
            "each artifact must carry a full 64-hex SHA-256: checked " + repr(pack["artifacts"].values())[:300])

    @needs_reportlab
    def test_an_image_only_pdf_sets_needs_ocr(self) -> None:
        """Negative control: a PDF with no text layer must flip needs_ocr."""
        image_only = you_do_solution(self.starter()).replace(
            '''    c.drawString(72, 760, f"Ticket mediano {ctx['median_Lima']} PEN (n={ctx['n_Lima']})")\n''',
            "    c.rect(72, 700, 200, 50)\n")
        self.assertIn("c.rect(72", image_only)
        self.assertTrue(json.loads(stdout_of(image_only))["needs_ocr"],
            "a PDF with no text layer must set needs_ocr")


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        """writing_rules.md: nine sentences were longer before this round, none is now."""
        long = []
        for text in learner_strings(s21()):
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
        return exam_bank.bank_for("fastapi")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_the_pdf_item_is_keyed_to_the_right_option(self) -> None:
        """The old item keyed 'Borrar metadatos siempre' as the step before parsing PDF tables."""
        text = json.dumps(self.bank(), ensure_ascii=False)
        self.assertNotIn("Borrar metadatos", text)
        q = next(q for q in self.bank() if "pypdf devuelve texto vacío" in q["question"])
        self.assertIn("needs_ocr", q["options"][q["correctIndex"]])

    def test_the_ready_item_matches_the_fixed_gate(self) -> None:
        q = next(q for q in self.bank() if q["question"].startswith("ready(checklist)"))
        self.assertIn("False", q["options"][q["correctIndex"]])

    def test_nothing_the_section_does_not_teach(self) -> None:
        text = " ".join(q["question"] + " " + " ".join(q["options"]) + " " + q["explanation"] for q in self.bank())
        for gone in ("gRPC", "Indexar vectores", "latín", "wallpaper", "playlist", "Compilar el template a C"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


class ExamItemsSitUnderTheirConcept(unittest.TestCase):
    """Codex review on #201 (P2): rewritten items kept the concept tag of the item they replaced.

    src/lib/exam-draw.ts draws one variant per concept, so a mislabelled item lets an attempt
    test one concept twice and skip another. These items moved to the concept they assess."""

    MOVED = {
        'Un DOCX trazable marca': 'styles-sections-docx-pdf',
        'pypdf devuelve texto vacío': 'pdf-digital-vs-image-ocr',
        'Al terminar la corrida, el factory deja approval': 'visual-render-provenance-approval',
        'round(28.25, 1)': 'conditions-tables-safe-format',
        'Un gate a11y escrito como': 'copy-a11y-consistency',
    }

    def test_each_moved_item_is_under_the_concept_it_assesses(self) -> None:
        bank = exam_bank.bank_for('fastapi')
        for prefix, concept in self.MOVED.items():
            with self.subTest(prefix):
                hits = [q for q in bank if q["question"].startswith(prefix)]
                self.assertEqual(len(hits), 1, f"expected one item starting {prefix!r}, found {len(hits)}")
                self.assertEqual(hits[0]["concept"], concept,
                                 f"{prefix!r} is drawn as {hits[0]['concept']}; it assesses {concept}")

    def test_every_concept_keeps_three_variants_in_one_block(self) -> None:
        concepts = [q["concept"] for q in exam_bank.bank_for('fastapi')]
        counts = {c: concepts.count(c) for c in dict.fromkeys(concepts)}
        self.assertEqual(set(counts.values()), {3}, f"each concept needs three variants to draw from: {counts}")
        blocks = [c for i, c in enumerate(concepts) if i == 0 or concepts[i - 1] != c]
        self.assertEqual(len(blocks), len(counts), f"a concept's variants are split across the bank: {blocks}")


if __name__ == "__main__":
    unittest.main()
