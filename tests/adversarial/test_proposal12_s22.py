"""Proposal 12 (approved 2026-11-21), S22: the P1, P2 and P3 findings of the item-by-item review.

S22 teaches the last step before a message leaves: MIME, HTML sanitizing, OAuth scopes, drafts that
expire, recipient verification, CC/BCC privacy, a human approval queue and idempotent retries. The
review found four shapes.

First, checks that could not fail. A We Do starter already printed its expected answer (P1): its
directory held one internal address, so the domain check never met an external one. The expired-draft
exercise never created an expired draft. The state-machine exercise said approve from draft was
invalid and never ran it. The least-privilege demo filtered through a policy that was already strict,
so its check could only print True. Each now carries the case that breaks it, and the tests below
plant the learner's mistake and expect the output to move.

Second, the theory warned about errors it never ran. "Un host como example.pe.evil.test lo burlaría"
was a sentence; the demo now prints that the substring test accepts it. "Nunca marques como safe" had
no unescaped insert to look at; the demo prints both. The CC demo said CC exposes the list and printed
only counts; it now prints who is visible before and after.

Third, text that disagreed with the code: a subdomain rule the We Do contradicted, `get_draft` named in
the theory while the code used `is_usable`, a `candidate` state that no code had, `exp < now` in one
place and `now < expires_at` in another, and a You Do that wrote the state to a variable but not to the
store the rest of the system reads.

Fourth, an exam bank whose key was the longest option on most items, with thin explanations.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s22-rapidfuzz-entity.ts"
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
const section = mod.section22 ?? mod.default?.section22;
if (!section) throw new Error('section22 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s22() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S22 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s22()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s22()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s22()["weDo"]["steps"] if e.get("id") == ex_id]
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
        snippets = [(b["heading"], b["code"]) for b in s22()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s22()["iDo"]["steps"]]
        self.assertEqual(len(snippets), 17)
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        """WEDO-14.1 (P1) is the case this guards: a starter that already printed its answer."""
        for e in s22()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), e["solutionCode"]["output"].rstrip("\n"))
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != e["solutionCode"]["output"].rstrip("\n"),
                                "the starter already prints the expected output")


class TheoryRunsTheErrorItNames(unittest.TestCase):
    """THEORY-04.1/.2, -08.1/.2, -09.1/.2: each warning now has a printed line behind it."""

    @needs_content_py
    def test_the_substring_bypass_is_printed_not_described(self) -> None:
        th = block("S22-T1-B")["code"]
        out = th["output"].splitlines()
        self.assertIn("substring_acepta_bypass True", out)
        self.assertIn("host_acepta_bypass False", out)
        self.assertIn("substring_acepta_bypass True", prose("S22-T1-B"))
        # Negative control: if the host check were the substring test, the bypass would pass it too.
        lax = mutated(th["code"], 'host == "example.pe" or host.endswith(".example.pe"))',
                      '"example.pe" in bypass)')
        self.assertIn("host_acepta_bypass True", stdout_of(lax))

    @needs_content_py
    def test_the_unescaped_insert_leaves_a_live_script_tag(self) -> None:
        out = block("S22-T1-B")["code"]["output"].splitlines()
        sin = next(line for line in out if line.startswith("sin_escape"))
        con = next(line for line in out if line.startswith("con_escape"))
        self.assertIn("<script>", sin)
        self.assertNotIn("<script>", con)
        self.assertIn("&lt;script&gt;", con)

    @needs_content_py
    def test_cc_exposure_is_shown_before_and_after_the_policy(self) -> None:
        th = block("S22-T3-B")["code"]
        out = th["output"].splitlines()
        self.assertIn("externo@other.test", out[0])
        self.assertTrue(out[0].startswith("visibles_antes"),
            "the policy demo must show the CC exposure before the policy: expected the start " + repr("visibles_antes")
            + ", got " + repr((out[0])[:160]))
        self.assertNotIn("externo@other.test", out[-1])
        # Negative control: without the move to BCC, the external stays visible after the policy.
        no_policy = mutated(th["code"], '            r["role"] = "bcc"\n', '            pass\n')
        self.assertIn("externo@other.test", stdout_of(no_policy).splitlines()[-1])
        self.assertIn("no cifra el cuerpo", prose("S22-T3-B"))

    @needs_content_py
    def test_approve_from_draft_raises_and_writes_nothing(self) -> None:
        th = block("S22-T4-A")["code"]
        self.assertIn("invalid draft->approve | steps 2", th["output"])
        self.assertIn("acciones desde pending: {}", th["output"])
        self.assertIn("ValueError", prose("S22-T4-A"))
        # Negative control: a table that skips the check lets the bad step into the log.
        no_guard = mutated(th["code"], "        if not nxt:\n            raise ValueError(f\"invalid {state}->{action}\")\n", "")
        self.assertNotIn("invalid draft->approve", stdout_of(no_guard))

    def test_an_expired_key_is_not_reused(self) -> None:
        """THEORY-10.1: a retry must not hand back an id whose draft already expired."""
        self.assertIn("Si la key existe pero el draft ya caducó, no devuelvas ese id", prose("S22-T4-B"))


class DemosShowBothSides(unittest.TestCase):
    @needs_content_py
    def test_an_allowed_url_becomes_a_link(self) -> None:
        """IDO-02.1: the demo blocked every URL, so 'allowed' never showed."""
        d = demo("S22-T1-B")["code"]
        self.assertIn('<a href="https://example.pe/ok">enlace</a>', d["output"])
        self.assertEqual(d["output"].count("[blocked]"), 3, "evil.test, the subdomain bypass and the backslash URL are blocked")
        substring = mutated(d["code"], 'return host == "example.pe" or host.endswith(".example.pe")',
                            'return "example.pe" in url')
        self.assertIn('href="https://example.pe.evil.test/x"', stdout_of(substring))

    @needs_content_py
    def test_least_privilege_fails_against_a_lax_policy(self) -> None:
        """IDO-03.1/.2: the only policy was strict, so least_ok could only print True."""
        d = demo("S22-T2-A")["code"]
        self.assertIn("lab least_ok True", d["output"])
        self.assertIn("laxa least_ok False", d["output"])
        leaky_lab = mutated(d["code"], '"lab": {"mail.draft", "mail.readonly"}', '"lab": {"mail.draft", "mail.send"}')
        self.assertIn("lab least_ok False", stdout_of(leaky_lab))

    @needs_content_py
    def test_an_expired_draft_is_not_usable(self) -> None:
        """IDO-04.1/.2: the theory's ids and is_usable, and a draft that has expired."""
        d = demo("S22-T2-B")["code"]
        self.assertEqual(d["output"].splitlines()[:2], ["id d001 usable True", "id d002 usable False"])
        fresh = mutated(d["code"], 'ad.create_draft("cifras de ayer", hours=-1)', 'ad.create_draft("cifras de ayer", hours=1)')
        self.assertIn("id d002 usable True", stdout_of(fresh))

    def test_one_attachment_name(self) -> None:
        """IDO-01.1: the text said run.json, the code and the check other names."""
        d = demo("S22-T1-A")
        self.assertNotIn("run.json", json.dumps(d, ensure_ascii=False))
        self.assertIn("meta.txt", d["code"]["code"])

    def test_the_state_machine_demo_prints_the_invalid_path(self) -> None:
        self.assertIn("approve_desde_draft invalid", demo("S22-T4-A")["code"]["output"])


class OneStory(unittest.TestCase):
    def test_theory_names_the_method_the_code_has(self) -> None:
        """THEORY-06.1: get_draft was named, is_usable was used."""
        self.assertNotIn("get_draft", json.dumps(s22(), ensure_ascii=False))
        self.assertIn("is_usable", prose("S22-T2-B"))

    def test_no_state_the_code_does_not_have(self) -> None:
        """THEORY-07.1: `candidate` was listed as a contact state and never produced."""
        self.assertNotIn("candidate", prose("S22-T3-A"))

    def test_the_typo_is_gone(self) -> None:
        self.assertNotIn("magizan", json.dumps(s22(), ensure_ascii=False))

    def test_the_subdomain_rule_matches_the_theory(self) -> None:
        """WEDO-06.1: the theory allowed own subdomains, the exercise demanded exact equality."""
        e = exercise("S22-T1-B-E3")
        self.assertIn("portal.example.pe/r ok", e["solutionCode"]["output"])
        self.assertIn("example.pe.evil.test/x blocked", e["solutionCode"]["output"])

    @needs_content_py
    def test_a_backslash_url_is_not_a_link(self) -> None:
        """Codex review on #202 (P2): host_ok took evil.test\\a.example.pe as a subdomain, and a browser
        (WHATWG URL parsing) reads the backslash as / and opens evil.test."""
        d = demo("S22-T1-B")["code"]
        self.assertTrue(d["output"].endswith("[blocked] [blocked]"),
                        "the demo must block the backslash URL as well as the subdomain bypass; got " + repr(d["output"]))
        self.assertIn("https://evil.test\\a.example.pe/x blocked", exercise("S22-T1-B-E3")["solutionCode"]["output"],
                      "the We Do allowlist must block the backslash URL too")
        old_rule = mutated(d["code"], '        if "\\\\" in url or "@" in url:\n            return False\n', "")
        self.assertIn('<a href="https://evil.test\\a.example.pe/x">', stdout_of(old_rule),
                      "negative control: without the ambiguity check the backslash URL becomes a link; "
                      "if it does not, the fixture no longer shows the case")

    def test_expiry_uses_one_boundary(self) -> None:
        """WEDO-09.1/.2: `exp < now` here, `now < expires_at` in is_usable."""
        self.assertIn("exp <= now", exercise("S22-T2-A-E3")["solutionCode"]["code"])

    def test_charset_edge_case_says_what_python_does(self) -> None:
        """WEDO-01.2: 'charset None en algunos builds' was not what MIMEText does."""
        edge = " ".join(exercise("S22-T1-A-E1")["edgeCases"])
        self.assertIn("us-ascii", edge)
        self.assertNotIn("charset None", edge)

    @needs_content_py
    def test_the_charset_claim_is_true(self) -> None:
        """Negative control for the edge case: if both picked utf-8, the advice would be noise."""
        out = stdout_of("from email.mime.text import MIMEText\n"
                        "print(MIMEText('Hola', 'plain').get_charset(), MIMEText('Adiós', 'plain').get_charset())")
        self.assertEqual(out, "us-ascii utf-8")

    def test_the_score_formula_is_stated(self) -> None:
        """WEDO-15.1: 0.86 had no formula a learner could reproduce."""
        self.assertIn("longitud del email más largo", exercise("S22-T3-A-E3")["preamble"])


#: One planted mistake per exercise the review named, in the shape a learner makes it.
MUTATIONS = [
    ("S22-T1-B-E3", "host == 'example.pe' or host.endswith('.example.pe')", "'example.pe' in host"),
    ("S22-T1-B-E3", "host == 'example.pe' or host.endswith('.example.pe')", "host == 'example.pe'"),
    ("S22-T1-B-E3", "'ok' if not ambiguo and (", "'ok' if ("),
    ("S22-T2-B-E3", "now < store[i]['expires_at'] and ", ""),
    ("S22-T3-A-E2", "em and em.endswith('@example.pe')", "em"),
    ("S22-T3-A-E3", "max(len(a), len(b))", "len(a)"),
    ("S22-T4-A-E3", "    if not nxt:\n        raise ValueError(f'invalid {state}->{action}')\n", ""),
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

    @needs_content_py
    def test_the_expiry_boundary_is_refresh(self) -> None:
        """WEDO-09.1: `<` and `<=` print the same pin, so the boundary is tested on its own."""
        code = exercise("S22-T2-A-E3")["solutionCode"]["code"]
        at_boundary = mutated(code, "for exp in (now - timedelta(minutes=1), now + timedelta(hours=1)):",
                              "for exp in (now,):")
        self.assertEqual(stdout_of(at_boundary), "refresh")
        self.assertEqual(stdout_of(mutated(at_boundary, "exp <= now", "exp < now")), "valid")


YOU_DO_FILL = {
    "# Completa: adjunta también HTML seguro (sin secretos) a alt; escapa todo texto variable con html.escape":
        'import html\nalt.attach(MIMEText(f"<p>Run {html.escape(run_id)} listo.</p>", "html", "utf-8"))',
    "# Completa: adjunto meta (p. ej. run_id=... en MIMEApplication + Content-Disposition)":
        'att = MIMEApplication(f"run_id={run_id}\\n".encode(), Name="meta.txt")\n'
        'att.add_header("Content-Disposition", "attachment", filename="meta.txt")\nmsg.attach(att)',
    "        # Completa: guarda msg.as_string() en out/drafts/d001.eml (sandbox, sin SMTP)":
        '        "eml": f"out/drafts/{draft_id}.eml",',
    '# Completa: state = apply(state, "submit", "analyst", audit)':
        'state = apply(state, "submit", "analyst", audit)',
    '# Completa: store[key]["status"] = state  (el store es el registro que leen la UI y los jobs)':
        'store[key]["status"] = state',
}


def you_do_solution(starter: str) -> str:
    filled = starter
    for old, new in YOU_DO_FILL.items():
        filled = mutated(filled, old, new)
    return filled + ('\nfrom pathlib import Path\np = Path(store[key]["eml"])\np.parent.mkdir(parents=True)\n'
                     'p.write_text(msg.as_string())\nprint("eml_parts", sum(1 for _ in msg.walk()))\n')


class YouDo(unittest.TestCase):
    def starter(self) -> str:
        return s22()["youDo"]["starterCode"]

    def test_the_deliverables_have_a_place(self) -> None:
        """YOUDO-01.1, -01.4: nothing said where the .eml and the impact sentence go."""
        reqs = " ".join(s22()["youDo"]["requirements"])
        self.assertIn("out/drafts/d001.eml", reqs)
        self.assertIn("README.md", reqs)

    def test_the_retry_is_part_of_acceptance(self) -> None:
        """YOUDO-01.3: idempotency was the section's last topic and the You Do never retried."""
        self.assertIn("reintento_reusa True", " ".join(s22()["youDo"]["requirements"]))

    @needs_content_py
    def test_the_starter_runs_and_is_not_yet_done(self) -> None:
        out = stdout_of(self.starter()).splitlines()
        self.assertIn("state draft", out)
        self.assertIn("audit_n 0", out)

    @needs_content_py
    def test_a_filled_project_meets_its_acceptance(self) -> None:
        out = stdout_of(you_do_solution(self.starter())).splitlines()
        for line in ("verified True", "key_len 16", "draft_id d001", "state pending_review",
                     "store_status pending_review", "reintento_reusa True", "audit_n 1", "eml_parts 5"):
            with self.subTest(line):
                self.assertIn(line, out)

    @needs_content_py
    def test_a_create_that_ignores_the_key_fails_the_retry(self) -> None:
        """Codex review on #202 (P1): reintento_reusa only looked up the record just inserted, so
        "always create" still printed True. The retry now calls create_once a second time."""
        always = mutated(you_do_solution(self.starter()), "    if key in store:\n", "    if False:\n")
        out = stdout_of(always).splitlines()
        self.assertIn("reintento_reusa False", out,
                      "a create_once that never reuses the key still passes the retry acceptance; "
                      f"the starter's retry does not run creation twice. Output: {out}")
        self.assertIn("store_status draft", out,
                      f"the duplicate create should overwrite the reviewed record; output: {out}")

    @needs_content_py
    def test_forgetting_the_store_shows_in_the_acceptance(self) -> None:
        """YOUDO-01.2, negative control: the state in a variable is not the state the system reads."""
        forgot = mutated(you_do_solution(self.starter()), 'store[key]["status"] = state\n', "\n")
        out = stdout_of(forgot).splitlines()
        self.assertIn("state pending_review", out)
        self.assertIn("store_status draft", out)


class SelfCheck(unittest.TestCase):
    def questions(self) -> list[dict]:
        return s22()["selfCheck"]["questions"]

    def test_only_one_option_reuses_the_draft(self) -> None:
        """SELFCHECK-04.1: two options both said 'reuse', so the key was a coin toss."""
        q = next(q for q in self.questions() if "idempotency key" in q["question"])
        self.assertEqual(sum("Reutilizar" in o for o in q["options"]), 1)
        self.assertIn("Reutilizar", q["options"][q["correctIndex"]])

    def test_the_score_key_is_not_the_longest(self) -> None:
        """SELFCHECK-05.1: the key was the longest option by far."""
        q = next(q for q in self.questions() if "0.92" in q["question"])
        lengths = [len(o) for o in q["options"]]
        self.assertLess(lengths[q["correctIndex"]], max(lengths))


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s22()):
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
        return exam_bank.bank_for("rapidfuzz-entity")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_the_charset_item_matches_what_python_prints(self) -> None:
        q = next(q for q in self.bank() if q["question"].startswith("MIMEText('Hola', 'plain')"))
        self.assertIn("us-ascii", q["options"][q["correctIndex"]])

    def test_the_boundary_item_matches_is_usable(self) -> None:
        q = next(q for q in self.bank() if "instante exacto de expires_at" in q["question"])
        self.assertRegex(q["options"][q["correctIndex"]], r"(?i)caduc|vencid|no es usable")

    def test_approve_from_draft_is_keyed_to_the_error(self) -> None:
        q = next(q for q in self.bank() if q["question"].startswith("Alguien llama apply con approve"))
        self.assertIn("ValueError", q["options"][q["correctIndex"]])

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


class ExamItemsSitUnderTheirConcept(unittest.TestCase):
    """Codex review on #202 (P2): rewritten items kept the concept tag of the item they replaced.

    src/lib/exam-draw.ts draws one variant per concept, so a mislabelled item lets an attempt
    test one concept twice and skip another. These items moved to the concept they assess."""

    MOVED = {
        'En el instante exacto de expires_at': 'drafts-expiry-adapters',
        'Un contacto existe en el directorio': 'resolve-verify-recipients',
        'La lista trae ana@example.pe dos veces': 'lists-cc-bcc-privacy-min',
        'Alguien llama apply con approve': 'approval-queue-state-machine',
        'Cambias body_ver de 1 a 2': 'idempotency-audit-retry',
    }

    def test_each_moved_item_is_under_the_concept_it_assesses(self) -> None:
        bank = exam_bank.bank_for('rapidfuzz-entity')
        for prefix, concept in self.MOVED.items():
            with self.subTest(prefix):
                hits = [q for q in bank if q["question"].startswith(prefix)]
                self.assertEqual(len(hits), 1, f"expected one item starting {prefix!r}, found {len(hits)}")
                self.assertEqual(hits[0]["concept"], concept,
                                 f"{prefix!r} is drawn as {hits[0]['concept']}; it assesses {concept}")

    def test_every_concept_keeps_three_variants_in_one_block(self) -> None:
        concepts = [q["concept"] for q in exam_bank.bank_for('rapidfuzz-entity')]
        counts = {c: concepts.count(c) for c in dict.fromkeys(concepts)}
        self.assertEqual(set(counts.values()), {3}, f"each concept needs three variants to draw from: {counts}")
        blocks = [c for i, c in enumerate(concepts) if i == 0 or concepts[i - 1] != c]
        self.assertEqual(len(blocks), len(counts), f"a concept's variants are split across the bank: {blocks}")


if __name__ == "__main__":
    unittest.main()
