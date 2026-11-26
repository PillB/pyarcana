'''Proposal 12 (approved 2026-11-21), S26: the P1, P2 and P3 findings of the item-by-item review.

S26 teaches orchestration through the VP project: a DAG with states, limits and schedules,
checkpoints, retries and a dead-letter queue, idempotence and rollback, human review, operation,
and an end-to-end check. The review found four shapes.

First, P1 findings where the code did what the prose forbade. The prose said a cycle stops the
pipeline; topo returned a shorter list. The prose said the rollback keeps the report in the defence
history; the code replaced it with a status-only dict, and so did the demo. The E2E function took
no input and returned "success" and n2_regression "pass" as literals, and so did the You Do starter,
which also approved automatically with a hardcoded actor.

Second, prose and code that disagreed: a resume contract with no checkpoint input, a worked case
whose code printed a different state, a daily SLO with a 7-day key, a blocked state the theory did
not list, and CF-2 used as a gate without a definition.

Third, exercises a wrong answer passed: one fixture and one printed constant, a boundary never
pinned, the ok branch never run, and English authoring notes in learner-visible starters.

Fourth, an exam bank whose key was the longest option on most items, with off-topic distractors
and a keyed E2E path that left out ai_assist.
'''
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s26-integrator-phase1.ts"
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
const section = mod.section26 ?? mod.default?.section26;
if (!section) throw new Error('section26 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s26() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S26 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s26()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s26()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s26()["weDo"]["steps"] if e.get("id") == ex_id]
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



STEPS = ["ingest", "validate", "analyze", "ai_assist", "report", "approve", "draft_email"]

#: Exercises whose single printed result already separates the usual mistake, which MUTATIONS plants.
ONE_FIXTURE_SEPARATES = {"S26-T2-B-E1", "S26-T3-A-E1", "S26-T3-B-E3", "S26-T4-A-E3"}


def all_code() -> list[tuple[str, str]]:
    out = [(b.get("subtopicId") or b["heading"], b["code"]["code"]) for b in s26()["theory"] if b.get("code")]
    out += [(d["demoId"], d["code"]["code"]) for d in s26()["iDo"]["steps"]]
    for e in s26()["weDo"]["steps"]:
        out += [(e["id"] + " starter", e["starterCode"]["code"]), (e["id"], e["solutionCode"]["code"])]
    out.append(("youDo", s26()["youDo"]["starterCode"]))
    return out


class EveryPinRuns(unittest.TestCase):
    @needs_content_py
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b.get("subtopicId") or b["heading"], b["code"]) for b in s26()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s26()["iDo"]["steps"]]
        self.assertGreaterEqual(len(snippets), 16, f"a theory or demo example was lost: {[n for n, _ in snippets]}")
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s26()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                pin = e["solutionCode"]["output"].rstrip("\n")
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), pin)
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != pin,
                                "the starter already prints the expected output")

    def test_every_pin_holds_more_than_one_result(self) -> None:
        planted = {ex_id for ex_id, _, _ in MUTATIONS}
        for e in s26()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                if e["id"] in ONE_FIXTURE_SEPARATES:
                    self.assertIn(e["id"], planted)
                    continue
                self.assertGreater(len(e["solutionCode"]["output"].strip().splitlines()), 1)

    def test_no_demo_prints_a_literal_ok(self) -> None:
        """IDO-01.1: print("ok", True) carried no information."""
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotIn('print("ok", True)', code)


class TheCodeDoesWhatTheProseSays(unittest.TestCase):
    """THEORY-03.1, THEORY-06.1, IDO-04.1, THEORY-10.1 (P1)."""

    @needs_content_py
    def test_a_cycle_stops_topo(self) -> None:
        th = block("S26-T1-A")["code"]
        self.assertEqual(th["output"].splitlines()[1], "no arranca: ciclo en ['approve', 'report']")
        # Negative control: without the guard, the same cycle returns a shorter list and no error.
        old = mutated(th["code"], '    if len(order) != len(nodes):\n        raise ValueError(f"ciclo en {sorted(nodes - set(order))}")\n', "")
        out = stdout_of(old + '\nprint(topo([("report", "approve"), ("approve", "report")]))\n')
        self.assertEqual(out.splitlines()[-1], "[]")

    @needs_content_py
    def test_the_rollback_keeps_the_report_body(self) -> None:
        th = block("S26-T2-B")["code"]
        self.assertEqual(th["output"], "reports {'r1': {'body': 'informe', 'status': 'superseded'}} drafts {}")
        dm = demo("S26-T2-B")["code"]
        self.assertIn("{'report': 'ok', 'report_status': 'superseded'}", dm["output"])
        e = exercise("S26-T2-B-E2")["solutionCode"]["output"]
        self.assertEqual(e.splitlines(), ["{'report': {'body': 'informe', 'status': 'superseded'}}"] * 2)
        self.assertIn("superseded", prose("S26-T2-B"))

    @needs_content_py
    def test_the_e2e_depends_on_the_run(self) -> None:
        th = block("S26-T4-B")["code"]
        self.assertEqual(th["output"].splitlines(), [
            "{'e2e': True, 'audit_events': 1, 'fraud_labels': 0, 'n2_regression': 'pass'}",
            "{'e2e': False, 'audit_events': 1, 'fraud_labels': 0, 'n2_regression': 'not_run'}"])
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotRegex(code, r"""['"]n2_regression['"]\s*[:=]\s*['"]pass['"]""")

    @needs_content_py
    def test_the_demo_shows_skipped_and_blocked(self) -> None:
        """IDO-08.1/08.2, YOUDO-01.9."""
        out = demo("S26-T4-B")["code"]["output"].splitlines()
        self.assertEqual(out[1:], ["audit 1 fraud_labels 0 n2_regression not_run",
                                   "sin approve pending blocked", "fail_at_analyze failed report skipped"])
        p = " ".join(prose("S26-T1-A").split())
        self.assertIn("Si A falla, B no se ejecuta y queda `skipped`", p)
        self.assertIn("`blocked`", p)

    @needs_content_py
    def test_resume_uses_a_checkpoint_argument(self) -> None:
        """THEORY-05.1/05.2, IDO-03.1."""
        th = block("S26-T2-A")["code"]
        self.assertEqual(th["output"].splitlines()[2], "(['b', 'c'], [], ['a', 'b', 'c'])")
        self.assertIn("'waits_ms': [100, 200]", th["output"])
        self.assertTrue(demo("S26-T2-A")["code"]["output"].startswith("resume_from ['b', 'c']"),
            "resume must start from the checkpoint argument, at the first unfinished step: expected the start " + repr("resume_from ['b', 'c']")
            + ", got " + repr((demo("S26-T2-A")["code"]["output"])[:160]))


class TheYouDoNeedsAPersonAndARealRun(unittest.TestCase):
    """YOUDO-01.1 to 01.8."""

    def setUp(self) -> None:
        self.yd = s26()["youDo"]
        self.code = self.yd["starterCode"]

    @needs_content_py
    def test_the_starter_runs_and_its_invariants_hold(self) -> None:
        out = stdout_of(self.code)
        self.assertEqual(out.splitlines(), [
            "states ['success', 'success', 'success', 'success', 'success', 'pending', 'blocked']",
            "approve True can_draft True fraud_labels 0",
            "draft_email success package not_run"])
        stdout_of(self.code.split("# Completa en el portafolio")[0] + "\ncheck_invariants()\n")

    @needs_content_py
    def test_an_open_queue_keeps_approve_out_of_the_audit(self) -> None:
        defs = self.code.split("# Completa en el portafolio")[0]
        out = stdout_of(defs + '\nhitl["analysis"] = 1\nprint(approve("r1"), len(audit))\n')
        self.assertEqual(out, "False 0")
        # Negative control: the old advance() appended an approve whatever the queues said.
        old = ('audit = []\nhitl = {"analysis": 1}\nstate = {}\n'
               'def advance(step, ok=True):\n    state[step] = "success" if ok else "failed"\n'
               '    if ok and step == "approve":\n        audit.append({"action": "approve", "actor": "r1"})\n'
               'advance("approve")\nprint(len(audit))\n')
        self.assertEqual(stdout_of(old), "1")

    def in_one_folder(self, *runs: tuple[str, list[str]]) -> list[str]:
        """Run several processes, one after another, in one folder: the resume the project asks for."""
        if CONTENT_PY is None:
            raise unittest.SkipTest("needs the pinned content interpreter")
        outs = []
        with tempfile.TemporaryDirectory() as tmp:
            for i, (source, args) in enumerate(runs):
                path = Path(tmp) / f"run{i}.py"
                path.write_text(source, encoding="utf-8")
                done = subprocess.run([str(CONTENT_PY), "-I", str(path), *args], capture_output=True,
                                      text=True, timeout=120, encoding="utf-8", cwd=tmp)
                self.assertEqual(done.returncode, 0, f"run {i} raised: {done.stderr[-600:]}")
                outs.append(done.stdout.rstrip("\n"))
            outs.append(" ".join(sorted(p.name for p in Path(tmp).iterdir() if not p.name.startswith("run"))))
        return outs

    @needs_content_py
    def test_a_second_process_resumes_with_the_approval(self) -> None:
        """Codex review on #206 (P2): a new process restored approve as success with an empty audit,
        so draft_email stayed blocked after a real human approval."""
        defs = self.code.split("# Completa en el portafolio")[0]
        first = defs + '\nreset()\nrun_all()\napprove("r1")\nrun_all(fail_at="draft_email")\n'
        report = '\nst, au = run_all()\nprint(st["approve"], st["draft_email"], len(au))\n'
        outs = self.in_one_folder((first, []), (defs + report, []))
        self.assertEqual(outs[1], "success success 1",
                         "the resumed process must keep the approval and finish draft_email")
        # Negative control: without reading the audit back, approve falls back to pending.
        read_back = ("    if AUDIT_PATH.exists():\n"
                     "        audit[:] = [json.loads(line) for line in AUDIT_PATH.read_text().splitlines()]\n")
        forgets = defs.replace(read_back, "")
        self.assertNotEqual(forgets, defs, "the audit read-back anchor is gone from the starter")
        old = self.in_one_folder((first, []), (forgets + report, []))
        self.assertEqual(old[1], "pending blocked 0",
                         "without the audit a checkpointed approve must stay pending, not success")

    @needs_content_py
    def test_the_entry_point_keeps_the_checkpoint_for_resume(self) -> None:
        """Codex review on #206 (P2): the starter unlinked the checkpoint at start and at the end."""
        fresh, resumed, files = self.in_one_folder((self.code, []), (self.code, ["--resume"]))
        self.assertIn("ckpt_cpn2c-close-01.json", files, "the checkpoint must survive the run for the next process")
        self.assertIn("audit_cpn2c-close-01.jsonl", files, "the approval log must survive the run")
        self.assertEqual(resumed.splitlines()[0],
                         "states ['success', 'success', 'success', 'success', 'success', 'success', 'success']",
                         "with --resume the second process must continue, not start over")
        again = self.in_one_folder((self.code, []), (self.code, []))
        self.assertEqual(again[0], again[1], "without --resume each run must start from zero")
        self.assertEqual(fresh, again[0], "the first run must print the pinned output")

    @needs_content_py
    def test_a_broken_invariant_says_which_one(self) -> None:
        """Codex review on #206 (P1): check_invariants() used bare asserts the learner copies to test_vp.py."""
        defs = self.code.split("# Completa en el portafolio")[0]
        open_queue = defs.replace("    if not actor or not clear():", "    if not actor:")
        self.assertNotEqual(open_queue, defs, "the approve gate anchor is gone from the starter")
        done = run_py(open_queue + "\ncheck_invariants()\n")
        self.assertNotEqual(done.returncode, 0, "an approve that ignores the open queue passed check_invariants")
        self.assertIn("approve entró al audit con la cola de reporte abierta", done.stderr,
                      f"the failure must name the broken gate; stderr: {done.stderr[-300:]}")
        fn = next(n for n in ast.walk(ast.parse(defs))
                  if isinstance(n, ast.FunctionDef) and n.name == "check_invariants")
        bare = [n.lineno for n in ast.walk(fn) if isinstance(n, ast.Assert) and n.msg is None]
        self.assertEqual(bare, [], "check_invariants still has asserts without a message")

    def test_cf2_is_defined_and_graded(self) -> None:
        for fn in ("familiarity_to_reporting", "reporting_to_automation", "automation_to_audit"):
            with self.subTest(fn):
                self.assertIn(fn, self.yd["context"])
                self.assertIn(fn, s26()["theory"][0]["callout"]["content"])
        weights = [r["weight"] for r in self.yd["rubric"]]
        self.assertNotIn("bonus checklist", weights)
        self.assertEqual(sum(int(w.rstrip("%")) for w in weights), 100)
        crit = " ".join(r["criterion"] for r in self.yd["rubric"])
        self.assertIn("alert_success_rate", crit)
        self.assertIn("checkpoint persistido en JSON", crit)

    def test_the_project_is_not_the_capstone_gate(self) -> None:
        self.assertIn("no es el capstone CP-N2-C", self.yd["context"])
        self.assertIn("rpa.run(job) -> RpaAudit", self.yd["context"])
        self.assertNotIn("cierre CP-N2-C", self.yd["title"])


#: (exercise, old, new): the usual wrong answer, planted in the solution; the pin must catch it.
MUTATIONS = [
    ("S26-T1-A-E1", "    print(order)", "    print(['ingest', 'validate', 'analyze', 'report'])"),
    ("S26-T1-A-E3", "any(v == 'failed'", "any(v != 'success'"),
    ("S26-T1-B-E2", "api_rpm > 60", "api_rpm >= 60"),
    ("S26-T1-B-E3", '    return s["tz"] == "America/Lima" and s["cron"].startswith("0 6")', '    return s["cron"].startswith("0 6")'),
    ("S26-T2-A-E1", "base * (2 ** (attempt - 1))", "base * attempt"),
    ("S26-T2-A-E2", "    if attempts >= max_attempts:\n", "    if True:\n"),
    ("S26-T2-B-E1", "    if k not in store:\n        store[k]=v", "    store[k]=v"),
    ("S26-T2-B-E2", "state['report']['status'] = 'superseded'", "state['report'] = {'status': 'superseded'}"),
    ("S26-T2-B-E2", "state.pop('draft', None)", "del state['draft']"),
    ("S26-T2-B-E3", 'print(("busy", entity["id"]) if entity["locked"] else ("enter", entity["id"]))', 'print(("busy", entity["id"]))'),
    ("S26-T3-A-E1", "x['status']=='pending'", "x['status']=='done'"),
    ("S26-T3-A-E2", "any(v > 0", "any(v == 1"),
    ("S26-T3-B-E2", "and not reason", "and reason is None"),
    ("S26-T3-B-E3", "'from': from_v, 'to': ver", "'to': ver"),
    ("S26-T4-A-E1", "rate < 0.95", "rate <= 0.95"),
    ("S26-T4-A-E2", "'P0_unapproved_send' if n > 0 else 'ok'", "'P0_unapproved_send'"),
    ("S26-T4-A-E3", "' -> '.join(parts)", "' -> '.join(reversed(parts))"),
    ("S26-T4-B-E2", " and pkg['approved']", ""),
    ("S26-T4-B-E3", "print(defense_package(regression_status(log), 45, CF2))", "print(defense_package('pass', 45, CF2))"),
]


class ExercisesCatchTheUsualMistake(unittest.TestCase):
    """WEDO-01.1 to 24.1: a wrong answer passed on the old fixtures."""

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
            ("api_rpm=90\nprint('too_high' if api_rpm>=60 else 'ok')", "too_high"),
            ("dlq=[]\nattempts, max_attempts = 3, 3\ndlq.append({'id': 'x'})\nprint(len(dlq))", "1"),
            ("entity = {'id': 'report-1', 'locked': True}\nprint(('busy', entity['id']))", "('busy', 'report-1')"),
            ("action, reason = 'reject', None\nprint('invalid' if action=='reject' and reason is None else 'ok')", "invalid"),
            ("rate=0.9\nprint('alert_success_rate' if rate <= 0.95 else 'ok')", "alert_success_rate"),
            ("pkg={'fraud_labels':0,'approved':True}\nprint('ok' if pkg['fraud_labels']==0 else 'fail')", "ok"),
        ]
        for code, pin in old_cases:
            self.assertEqual(stdout_of(code), pin)


class LearnerFacingText(unittest.TestCase):
    def test_no_english_authoring_notes_in_starters(self) -> None:
        """WEDO-05.2, 07.1, 09.1, 17.2, 18.2, 20.1."""
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotIn("el learner", code)
                self.assertNotIn("defecto intencional", code)

    def test_glosses_at_first_use(self) -> None:
        """HEADER-01.1/01.2, THEORY-01.1/01.2/02.1/03.2/10.2, WEDO-06.1/24.1/24.2, EXAM-03/05/06/17."""
        s = s26()
        self.assertIn("vicepresidente", s["tagline"])
        self.assertIn("E2E (de extremo a extremo)", " ".join(o["text"] for o in s["learningOutcomes"]))
        self.assertTrue(s["theory"][0]["heading"].startswith("Seis piezas"),
            "the first theory heading must name the six pieces of the integrator: expected the start " + repr("Seis piezas")
            + ", got " + repr((s["theory"][0]["heading"])[:160]))
        self.assertIn("orden topológico** (un orden en que cada nodo va después", prose("S26-T1-A"))
        t1b = " ".join(prose("S26-T1-B").split())
        for phrase in ("Lima no tiene horario de verano", "ventana de solape", "encuentras los logs de un run"):
            self.assertIn(phrase, t1b)
        self.assertIn("estado `rejected`", prose("S26-T3-B"))
        blob = " ".join(learner_strings(s))
        self.assertNotIn('"DST"', json.dumps(s["weDo"], ensure_ascii=False))
        self.assertNotIn("gate ≥80%", blob)

    def test_one_slo_window(self) -> None:
        """THEORY-09.1."""
        self.assertIn("ventana de 7 días", prose("S26-T4-A"))
        self.assertNotIn("diario/7d", " ".join(learner_strings(s26())))

    def test_synthetic_actor_ids(self) -> None:
        """THEORY-08.1."""
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotRegex(code, r"""['"](ana|luis|rev)['"]""")


class SelfCheckHasNoGiveaway(unittest.TestCase):
    def test_every_path_option_has_seven_steps(self) -> None:
        """SELFCHECK-06.1."""
        q = s26()["selfCheck"]["questions"][5]
        for o in q["options"]:
            self.assertEqual(len(o.split(" → ")), 7, o)
        self.assertEqual(q["options"][q["correctIndex"]], " → ".join(STEPS))
