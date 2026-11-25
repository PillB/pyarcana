'''Proposal 12 (approved 2026-11-21), S23: the P1, P2 and P3 findings of the item-by-item review.

S23 teaches browser RPA with Playwright, modelled with dicts. The review found four shapes.

First, two P1 findings where the code taught the opposite of the rule. The lab compared a locator's
name exactly, while Playwright, by default, matches a case-insensitive substring, so
get_by_role("button", name="Enviar") also finds «Enviar y guardar». And the handoff demo sent a
ToS-forbidden run to a person instead of aborting it, the precedence the section says must not be
wrong.

Second, prose that promised what the code did not do: a checksum compared with nothing, a token
branch the code lacked, a payload with keys no block had, a filter and a sort that never ran, a retry
helper that took a function and never called it, and flag names that differed between prose, code
and exercises.

Third, exercises a wrong answer passed: a blocklist that removed only captcha, a missing api branch,
an empty token read as a session, and a default branch that continued past a captcha.

Fourth, an exam bank whose key was the longest option on 23 of 24 items, with one key that offered a
"bypass" the course rules out.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s23-computer-vision.ts"
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
const section = mod.section23 ?? mod.default?.section23;
if (!section) throw new Error('section23 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s23() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S23 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s23()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s23()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s23()["weDo"]["steps"] if e.get("id") == ex_id]
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


class EveryPinRuns(unittest.TestCase):
    @needs_content_py
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s23()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s23()["iDo"]["steps"]]
        self.assertEqual(len(snippets), 17)
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s23()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), e["solutionCode"]["output"].rstrip("\n"))
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != e["solutionCode"]["output"].rstrip("\n"),
                                "the starter already prints the expected output")


class PlaywrightMatchesByDefaultOnASubstring(unittest.TestCase):
    """THEORY-03.1 (P1): the lab compares name exactly; Playwright, by default, does not."""

    def test_the_prose_says_how_playwright_matches(self) -> None:
        text = prose("S23-T1-A")
        self.assertIn("busca una subcadena sin distinguir mayúsculas", text)
        self.assertIn("exact=True", text)

    @needs_content_py
    def test_the_demo_prints_both_counts(self) -> None:
        th = block("S23-T1-A")["code"]
        out = th["output"].splitlines()
        self.assertIn("por defecto ['b1', 'b2']", out)
        self.assertIn("exact=True ['b1']", out)
        self.assertIn("LookupError no button/Exportar", out)
        # Negative control: a model that compares exactly by default would hide the second match.
        exact_default = mutated(th["code"], 'name.lower() in n["name"].lower()', 'n["name"] == name')
        self.assertIn("por defecto ['b1']", stdout_of(exact_default))

    def test_one_role_for_the_download_control(self) -> None:
        """THEORY-02.1: «Descargar reporte» was a button in one block and a link in the next."""
        blob = json.dumps(s23(), ensure_ascii=False)
        self.assertNotIn('"button", "Descargar reporte"', blob)
        self.assertNotIn("botón “Descargar reporte” id", blob)

    def test_the_sketch_saves_the_download_before_closing(self) -> None:
        """THEORY-02.2: path() is a Path, and the file is deleted when the context closes."""
        code = s23()["theory"][1]["code"]["code"]
        self.assertNotIn("path or", code)
        self.assertLess(code.index("download.save_as(dest)"), code.index("browser.close()"))


class TheoryRunsTheErrorItNames(unittest.TestCase):
    @needs_content_py
    def test_a_fixed_sleep_misses_a_slow_page(self) -> None:
        """THEORY-04.2: the warning had no running counterexample."""
        th = block("S23-T1-B")["code"]
        self.assertIn("sleep fijo de 300 ms, listo: False", th["output"])
        self.assertIn("wait_until, listo: True t 600", th["output"])
        fast = mutated(th["code"], "    return lento.t >= 600", "    return lento.t >= 300")
        self.assertIn("sleep fijo de 300 ms, listo: True", stdout_of(fast))

    def test_timeout_returns_what_the_prose_says(self) -> None:
        """THEORY-04.3: the prose promised the string 'timeout'; the code returns False."""
        self.assertIn("`wait_until` devuelve `False` (timeout)", prose("S23-T1-B"))

    @needs_content_py
    def test_a_checksum_mismatch_fails_the_step(self) -> None:
        """THEORY-05.1/.2/.4, IDO-03.1: the digest was printed and never compared."""
        th = block("S23-T2-A")["code"]
        out = th["output"].splitlines()
        self.assertIn("sesion reuse | login", out)
        self.assertTrue(out[-2].startswith("download {'ok': True"),
            "a matching checksum must let the download step pass: expected the start " + repr("download {'ok': True")
            + ", got " + repr((out[-2])[:160]))
        self.assertIn("'error': 'checksum_mismatch'", out[-1])
        self.assertIn("'sha256': '3cdfe594'", th["output"])
        same = mutated(th["code"], 'b"synthetic-xlsx-truncado"', 'b"synthetic-xlsx"')
        self.assertTrue(stdout_of(same).splitlines()[-1].startswith("download {'ok': True"),
            "the download step must pass when the digest matches: expected the start " + repr("download {'ok': True")
            + ", got " + repr((stdout_of(same).splitlines()[-1])[:160]))
        self.assertIn("manifiesto que publica el portal", prose("S23-T2-A"))

    @needs_content_py
    def test_the_evidence_package_is_sorted_filtered_and_typed(self) -> None:
        """THEORY-07.2/.3, IDO-05.2: the code did no sort, no filter and stored a bare string."""
        th = block("S23-T3-A")["code"]
        out = th["output"].splitlines()
        self.assertEqual(out[0], "keys ['console', 'error', 'ok', 'screenshot', 'step', 'trace']")
        self.assertEqual(out[1], "TimeoutError: 30000ms")
        self.assertTrue(out[2].endswith("['ERR red lenta', 'ERR timeout button']"),
            "the evidence package must keep only the errors, sorted: expected the end " + repr("['ERR red lenta', 'ERR timeout button']")
            + ", got " + repr((out[2])[-160:]))
        unfiltered = mutated(th["code"], '[line for line in console if "ERR" in line][-3:]', "console[-3:]")
        self.assertIn("info: retry", stdout_of(unfiltered))

    def test_the_success_trace_rule_is_stated_where_the_policy_is(self) -> None:
        """THEORY-07.1, YOUDO-01.2: the policy dropped success traces; the capstone required one."""
        self.assertIn("salvo en CP-N2-C, que exige un trace de éxito por run", prose("S23-T3-A"))

    def test_the_checkpoint_is_not_called_idempotent(self) -> None:
        """THEORY-08.1, WEDO-18.1, YOUDO-01.1."""
        self.assertIn("no hace idempotente la corrida", prose("S23-T3-B"))
        blob = json.dumps(s23(), ensure_ascii=False)
        self.assertNotIn("reanudación idempotente", blob)
        self.assertNotIn("hace la corrida idempotente", blob)

    def test_the_retry_helper_says_what_it_models(self) -> None:
        """THEORY-08.3: run_with_retry took fn and never called it."""
        code = block("S23-T3-B")["code"]["code"]
        self.assertNotIn("fn", re.findall(r"def \w+\(([^)]*)\)", code)[1])
        self.assertIn("simulate_retry", prose("S23-T3-B"))

    @needs_content_py
    def test_tos_wins_and_the_handoff_carries_its_payload(self) -> None:
        """THEORY-10.1: the prose named url, step and screenshot; the code had none of them."""
        th = block("S23-T4-B")["code"]
        out = th["output"].splitlines()
        for key in ("'url':", "'step':", "'screenshot':"):
            self.assertIn(key, out[0])
        self.assertEqual(out[1], "{'action': 'abort', 'reason': 'tos'}")
        captcha_first = mutated(th["code"], '    if signals.get("tos_forbidden"):\n        return {"action": "abort", "reason": "tos"}\n', "")
        self.assertNotIn("abort", stdout_of(captcha_first))

    def test_one_set_of_channel_flags(self) -> None:
        """THEORY-09.1/.2, WEDO-20.1: export/rpa in prose and exercises, export_url/rpa_allowed in code."""
        blob = json.dumps(s23(), ensure_ascii=False)
        self.assertNotIn("export_url", blob)
        self.assertNotIn("rpa_allowed", blob)
        self.assertIn("{'method': 'export', 'reason': 'export_ok'}", block("S23-T4-A")["code"]["output"])


class DemosShowBothSides(unittest.TestCase):
    @needs_content_py
    def test_tos_aborts_in_the_demo(self) -> None:
        """IDO-08.1 (P1): the demo sent a ToS-forbidden run to human handoff."""
        d = demo("S23-T4-B")["code"]
        self.assertEqual(d["output"].splitlines()[1], "{'action': 'abort', 'reason': 'tos'}")
        self.assertIn("'screenshot': 'shots/export.png'", d["output"])
        old_order = mutated(d["code"], '    if sig.get("tos_forbidden"):\n        return {"action": "abort", "reason": "tos"}\n', "")
        self.assertNotIn("abort", stdout_of(old_order))

    @needs_content_py
    def test_the_locator_demo_runs_the_redesign_and_the_named_error(self) -> None:
        """IDO-01.1/.2/.3."""
        out = demo("S23-T1-A")["code"]["output"].splitlines()
        self.assertIn("tras el rediseño, role+name Enviar", out)
        self.assertIn("tras el rediseño, primer botón Cancelar", out)
        self.assertIn("LookupError no button/Guardar", out)
        self.assertNotIn("locators role_first", out)

    @needs_content_py
    def test_the_wait_demo_counts_from_one_and_times_out(self) -> None:
        """IDO-02.1/.2, WEDO-05.1: the attempt count was off by one and for-else was never run."""
        d = demo("S23-T1-B")["code"]
        self.assertEqual(d["output"].splitlines(), ["visible en el intento 3", "nunca listo: None"])
        self.assertIn("else:", d["code"])
        self.assertNotRegex(d["code"], r"\bready_at\b")

    @needs_content_py
    def test_the_page_object_owns_its_selector(self) -> None:
        """IDO-04.1/.2: a boolean state and a class with no selector."""
        d = demo("S23-T2-B")["code"]
        self.assertIn("auth tras el rediseño authenticated", d["output"])
        stale = mutated(d["code"], 'LoginPage.BOTON = ("button", "Iniciar sesión")\n', "")
        done = run_py(stale)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("LookupError", done.stderr)

    def test_one_key_name_for_the_screenshot(self) -> None:
        """IDO-05.1."""
        self.assertNotIn("'shot'", demo("S23-T3-A")["code"]["output"])

    @needs_content_py
    def test_the_retry_demo_calls_the_step_again(self) -> None:
        """IDO-06.1/.2: the demo scanned a list and called that a retry."""
        d = demo("S23-T3-B")["code"]
        self.assertIn("err = attempt(i)", d["code"])
        self.assertEqual(d["output"].splitlines()[0], "{'ok': True, 'attempts': 2}")

    @needs_content_py
    def test_the_wrong_channel_order_is_run(self) -> None:
        """IDO-07.1/.2."""
        out = demo("S23-T4-A")["code"]["output"].splitlines()
        self.assertEqual(out, ["api > export > rpa: export", "rpa primero: rpa", "sin canal: human"])


class Words(unittest.TestCase):
    def test_no_internal_vocabulary(self) -> None:
        """WEDO-08.1, -13.1, -14.1, -15.1, -16.2, -22.1, -24.1: 'grader' is not a learner's word."""
        self.assertNotIn("grader", json.dumps(s23(), ensure_ascii=False))

    def test_terms_are_defined_where_they_first_appear(self) -> None:
        """HEADER-01.1/.2/.3, THEORY-01.1, WEDO-02.1."""
        job = s23()["jobRelevance"]
        self.assertIn("librería de Python que maneja un navegador real", job)
        self.assertIn("robotic process automation", job)
        self.assertIn("la prueba que distingue a una persona de un bot", job)
        self.assertIn("el árbol de elementos que el navegador construye", s23()["theory"][0]["callout"]["content"])
        self.assertIn("XPath (un lenguaje de rutas", prose("S23-T1-A"))

    def test_no_authoring_residue(self) -> None:
        """THEORY-03.2, THEORY-01.2."""
        blob = json.dumps(s23(), ensure_ascii=False)
        self.assertNotIn("aunque el párrafo anterior", blob)
        self.assertNotIn("El sketch de arriba", blob)

    def test_the_recovery_figure_sits_with_retries(self) -> None:
        """THEORY-04.1."""
        self.assertNotIn("figure", block("S23-T1-B"))
        self.assertEqual(block("S23-T3-B")["figure"]["id"], "S23-rpa-recovery")


#: One planted mistake per exercise the review named, in the shape a learner makes it.
MUTATIONS = [
    ("S23-T1-A-E3", "print(hits[0]['name'] if hits else 'need_testid')", "print('need_testid')"),
    ("S23-T1-B-E3", "page.get('title') == 'Portal demo' and ", ""),
    ("S23-T2-A-E3", "'reuse' if state.get('token') else 'login'", "'reuse' if 'token' in state else 'login'"),
    ("S23-T2-B-E1", "self.ctx['auth'] = 'authenticated' if ok else 'anonymous'", "self.ctx['auth'] = ok"),
    # Codex review on #203 (P2): E2 kept a boolean guard after E1 moved to string states.
    ("S23-T2-B-E2", "if ctx.get('auth') != 'authenticated':", "if not ctx.get('auth'):"),
    ("S23-T2-B-E3", "    return state", "    return 'anonymous'"),
    ("S23-T3-A-E3", "    if not ok:\n        pkg['trace']=f'traces/{step}.zip'\n", "    pkg['trace']=f'traces/{step}.zip'\n"),
    ("S23-T3-B-E1", "return k in {'timeout', '429'}", "return k != 'captcha'"),
    ("S23-T3-B-E2", "    return 'human_handoff'", "    return 'continue'"),
    ("S23-T4-A-E3", "    if caps.get('api'):\n        return {'method': 'api', 'reason': 'api_ok'}\n", ""),
]


class WeDoChecksCanFail(unittest.TestCase):
    @needs_content_py
    def test_every_planted_mistake_changes_the_answer(self) -> None:
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertEqual(escaped(sol["code"], sol["output"], mutated(sol["code"], old, new)), "",
                    f"{ex_id}: the planted mistake prints the pinned answer"
                    + ". Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")

    def test_hints_match_the_output_shape(self) -> None:
        """WEDO-24.2, -22.2, -02.2."""
        self.assertIn("Un solo print con dos argumentos", " ".join(exercise("S23-T4-B-E3")["hints"]))
        self.assertNotIn("en el You Do", " ".join(exercise("S23-T4-B-E1")["hints"]))
        self.assertIn("Label y texto quedan fuera", exercise("S23-T1-A-E2")["instruction"])


YOU_DO_FILL = {
    "        # Completa: autenticar solo con demo/sandbox; poner self.ctx['auth'] en 'authenticated' o 'anonymous'\n        pass":
        "        ok = (user, password) == ('demo', 'sandbox')\n        self.ctx['auth'] = 'authenticated' if ok else 'anonymous'",
}


def you_do_solution(starter: str) -> str:
    filled = starter
    for old, new in YOU_DO_FILL.items():
        filled = mutated(filled, old, new)
    return filled


class YouDo(unittest.TestCase):
    def starter(self) -> str:
        return s23()["youDo"]["starterCode"]

    def test_one_name_for_the_tos_signal(self) -> None:
        """YOUDO-01.3: the project read 'tos', the theory and the exercises 'tos_forbidden'."""
        self.assertNotIn('signals.get("tos")', self.starter())
        self.assertIn('signals.get("tos_forbidden")', self.starter())

    @needs_content_py
    def test_a_filled_project_meets_its_acceptance(self) -> None:
        out = stdout_of(you_do_solution(self.starter())).splitlines()
        for line in ("auth authenticated", "blocker_tos abort", "retry_captcha False", "resume_after_login form",
                     "sha_truncado_ok False"):
            with self.subTest(line):
                self.assertIn(line, out)
        self.assertTrue(next(x for x in out if x.startswith("sha ")).endswith("ok True"),
            "the filled project must compare the digest, not only print it: expected the end " + repr("ok True")
            + ", got " + repr((next(x for x in out if x.startswith("sha ")))[-160:]))
        self.assertIn("'trace': 'traces/export.zip'", next(x for x in out if x.startswith("evidence_ok")))

    @needs_content_py
    def test_the_old_signal_name_lets_a_tos_run_through(self) -> None:
        """Negative control for YOUDO-01.3: with the old key, a ToS-forbidden run is handed off, not aborted."""
        old = mutated(you_do_solution(self.starter()), '    if signals.get("tos_forbidden"):\n', '    if signals.get("tos"):\n')
        self.assertIn("blocker_tos human_handoff", stdout_of(old).splitlines())

    @needs_content_py
    def test_the_starter_runs_and_is_not_yet_done(self) -> None:
        self.assertIn("auth None", stdout_of(self.starter()).splitlines())


class SelfCheck(unittest.TestCase):
    def q(self, needle: str) -> dict:
        return next(q for q in s23()["selfCheck"]["questions"] if needle in q["question"])

    def test_api_first_has_one_defensible_answer(self) -> None:
        """SELFCHECK-03.1."""
        self.assertIn("Pedir al proveedor una API solo después de automatizar la UI", self.q("API/export primero")["options"])

    def test_the_retry_key_includes_503(self) -> None:
        """SELFCHECK-04.1."""
        q = self.q("Un retry seguro")
        self.assertIn("503", q["options"][q["correctIndex"]])

    def test_the_resume_stem_fixes_the_session(self) -> None:
        """SELFCHECK-08.1."""
        q = self.q("last_ok_step")
        self.assertIn("la sesión sigue activa", q["question"])
        self.assertNotIn("doble envío del login", q["options"][q["correctIndex"]])


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s23()):
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
        return exam_bank.bank_for("computer-vision")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_no_key_says_bypass(self) -> None:
        """EXAM-12.1: the MFA key offered a 'bypass', which the course rules out."""
        for q in self.bank():
            self.assertNotIn("bypass", q["options"][q["correctIndex"]].lower())

    def test_testid_is_not_called_a_last_resort(self) -> None:
        """EXAM-03.1."""
        self.assertNotIn("de último recurso", json.dumps(self.bank(), ensure_ascii=False))

    def test_nothing_the_section_does_not_teach(self) -> None:
        """EXAM-11.1, -17.1: user roles and modal recovery were never taught."""
        text = json.dumps(self.bank(), ensure_ascii=False)
        for gone in ("modal", "datos de prueba por rol", "YOLO", "DKIM", "WASM"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


class TheSleepItemIsAboutTheLab(unittest.TestCase):
    """Codex review on #203 (P2): a real Playwright locator click auto-waits, so "a 300 ms sleep
    before the click fails" had no correct option outside the lab's one-shot readiness check."""

    def test_the_stem_names_the_one_shot_check_and_the_explanation_names_auto_wait(self) -> None:
        hits = [q for q in exam_bank.bank_for("computer-vision") if "sleep fijo de 300 ms" in q["question"]]
        self.assertEqual(len(hits), 1, f"expected one sleep item, found {len(hits)}")
        q = hits[0]
        self.assertIn("una sola vez", q["question"],
                      "the stem must say the lab checks once; otherwise the keyed failure is not what Playwright does")
        self.assertIn("auto-wait", q["explanation"],
                      "the explanation must say a real locator click would wait on its own")


if __name__ == "__main__":
    unittest.main()
