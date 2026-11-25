'''Proposal 12 (approved 2026-11-21), S25: the P1, P2 and P3 findings of the item-by-item review.

S25 teaches the AI assistant of CP-N2-C: choosing rules, a specialized model or an LLM; running
inference with a cache and a circuit breaker; a structured prompt with a schema gate; golden
evaluation; and prompt injection by design. The review found four shapes.

First, P1 findings where two parts of the lesson taught different contracts. The contract block
named five narrative keys (hallazgo, n, mediana, evidence_ids, model); the prompt, the demo gate and
three exercises checked four (with limite instead of evidence_ids and model). A learner who copied
the gate accepted a draft with no evidence, which the contract and the rubric reject.

Second, prose and code that disagreed: feedback that blamed REQUIRED for a key missing from the
JSON, a You Do fallback with a key outside the schema, a gold evidence id that is not in the fixture.

Third, exercises a wrong answer passed: one fixture and one printed constant, a denied tool always
placed last, a field union never needed, a decision that never saw schema_ok False.

Fourth, an exam bank whose key was the longest option on most items, with product names as
distractors.
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
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s25-streamlit-dashboards.ts"
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
const section = mod.section25 ?? mod.default?.section25;
if (!section) throw new Error('section25 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s25() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S25 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s25()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s25()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s25()["weDo"]["steps"] if e.get("id") == ex_id]
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



NARRATIVE = {"hallazgo", "n", "mediana", "evidence_ids", "model"}

#: Exercises whose single printed result already separates the usual mistake, which MUTATIONS plants.
ONE_FIXTURE_SEPARATES = {"S25-T3-B-E3", "S25-T4-A-E2"}


def all_code() -> list[tuple[str, str]]:
    out = [(b["subtopicId"], b["code"]["code"]) for b in s25()["theory"] if b.get("code")]
    out += [(d["demoId"], d["code"]["code"]) for d in s25()["iDo"]["steps"]]
    for e in s25()["weDo"]["steps"]:
        out += [(e["id"] + " starter", e["starterCode"]["code"]), (e["id"], e["solutionCode"]["code"])]
    out.append(("youDo", s25()["youDo"]["starterCode"]))
    return out


class EveryPinRuns(unittest.TestCase):
    @needs_content_py
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["subtopicId"], b["code"]) for b in s25()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s25()["iDo"]["steps"]]
        self.assertEqual(len(snippets), 16)
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_content_py
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s25()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                pin = e["solutionCode"]["output"].rstrip("\n")
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), pin)
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != pin,
                                "the starter already prints the expected output")

    def test_every_pin_holds_more_than_one_result(self) -> None:
        """WEDO-01.1 to 24.1: one fixture and one printed value is a check a constant passes."""
        planted = {ex_id for ex_id, _, _ in MUTATIONS}
        for e in s25()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                if e["id"] in ONE_FIXTURE_SEPARATES:
                    self.assertIn(e["id"], planted)
                    continue
                self.assertGreater(len(e["solutionCode"]["output"].strip().splitlines()), 1)

    @needs_content_py
    def test_the_you_do_starter_runs(self) -> None:
        stdout_of(s25()["youDo"]["starterCode"])


class OneNarrativeContract(unittest.TestCase):
    """THEORY-02.1, THEORY-08.1, IDO-05.1 (P1): one five-key narrative contract everywhere."""

    def test_every_required_set_in_code_is_the_contract(self) -> None:
        seen = 0
        for name, code in all_code():
            for m in re.finditer(r"^(?:REQUIRED|SCHEMA_KEYS) = (\{[^}]*\})", code, re.M):
                keys = eval(m.group(1))  # noqa: S307 - a set literal from our own lesson
                if keys & {"hallazgo", "mediana"}:
                    seen += 1
                    with self.subTest(name):
                        self.assertEqual(keys, NARRATIVE)
        self.assertGreaterEqual(seen, 6)

    def test_limite_is_gone_from_the_contract(self) -> None:
        for name, code in all_code():
            with self.subTest(name):
                self.assertNotIn("limite", code)

    def test_the_prompt_lists_the_five_keys(self) -> None:
        code = block("S25-T3-A")["code"]["code"]
        self.assertIn("JSON con keys hallazgo, n, mediana, evidence_ids, model.", code)

    @needs_content_py
    def test_a_draft_without_evidence_fails_the_gate(self) -> None:
        th = block("S25-T3-A")["code"]
        self.assertEqual(th["output"].splitlines(), ["ok ['ocr-12']", "schema_fail", "schema_fail"])
        dm = demo("S25-T3-A")
        self.assertEqual(dm["code"]["output"].splitlines()[1:], ["json_schema True", "json_schema False"])
        # Negative control: the four-key set the lesson used before accepts the draft with no evidence.
        old = mutated(th["code"], 'REQUIRED = {"hallazgo", "n", "mediana", "evidence_ids", "model"}',
                      'REQUIRED = {"hallazgo", "n", "mediana"}')
        self.assertEqual(stdout_of(old).splitlines()[1], "ok")


#: (exercise, old, new): the usual wrong answer, planted in the solution; the pin must catch it.
MUTATIONS = [
    ("S25-T1-A-E1", "    if task.get('deterministic') and task.get('patterns_known'):", "    if task.get('deterministic'):"),
    ("S25-T1-A-E2", ">= 500", "> 0"),
    ("S25-T1-B-E1", "{'mit', 'apache-2.0'}", "{'mit', 'apache-2.0', 'gpl-3.0'}"),
    ("S25-T1-B-E3", "'fraud adjudication' in card.get('not_for', [])", "True"),
    ("S25-T2-A-E1", "'factura' in t.lower()", "'factura' in t"),
    ("S25-T2-A-E3", "'factura' in t.lower()", "'Factura' in t"),
    ("S25-T2-B-E1", "    if x in cache:\n        return cache[x], True\n", ""),
    ("S25-T2-B-E2", "cost_per_1k * n_tokens / 1000", "cost_per_1k"),
    ("S25-T2-B-E3", "failures += 1\n", ""),
    ("S25-T3-A-E1", "print(obj['n'], REQUIRED.issubset(obj))", "print(obj['n'], True)"),
    ("S25-T3-A-E2", "REQUIRED.issubset(obj)", "REQUIRED.issuperset(obj)"),
    ("S25-T3-A-E3", "print('ok' if REQUIRED.issubset(obj) else 'schema_fail')", "print('schema_fail')"),
    ("S25-T3-B-E1", "    if name not in allow:\n", "    if True:\n"),
    ("S25-T3-B-E2", "if s == 'think' or s in allow:", "if True:"),
    ("S25-T3-B-E3", "        break\n", "        continue\n"),
    ("S25-T4-A-E1", "exact = pred == gold", "exact = True"),
    ("S25-T4-A-E2", "keys = set(pred) | set(gold)", "keys = set(gold)"),
    ("S25-T4-A-E3", "    if not all(k in pred for k in required):", "    if len(pred) < len(required):"),
    ("S25-T4-B-E1", "'untrusted_document': text,", "'system': text,"),
    ("S25-T4-B-E2", "{k: payload[k] for k in allow_keys if k in payload}", "{k: payload.get(k) for k in allow_keys}"),
    ("S25-T4-B-E3", "    if not schema_ok:\n        return 'human_review'\n", ""),
]


class ExercisesCatchTheUsualMistake(unittest.TestCase):
    """WEDO-01.1 to 24.1: a wrong answer passed on the old fixtures."""

    def test_every_exercise_except_fixed_output_ones_is_planted(self) -> None:
        planted = {ex_id for ex_id, _, _ in MUTATIONS}
        fixed_output = {"S25-T1-A-E3", "S25-T1-B-E2", "S25-T2-A-E2"}
        for e in s25()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                self.assertTrue(e["id"] in planted or e["id"] in fixed_output,
                    "every exercise whose output depends on logic must have a planted mistake")

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
            # T3-B-E3: shell_rm was last, so continue printed the same log as break.
            ("steps=['think','calc_sum','shell_rm']\nallow={'calc_sum'}\nlog=[]\nfor s in steps:\n"
             "    if s!='think' and s not in allow:\n        log.append('stop')\n        continue\n    log.append(s)\nprint(log)",
             "['think', 'calc_sum', 'stop']"),
            # T4-A-E2: with the same keys on both sides, gold's keys alone gave the pinned 0.5.
            ("pred={'h':'a','n':1}\ngold={'h':'a','n':2}\nkeys=set(gold)\n"
             "print(sum(1 for k in keys if pred.get(k)==gold.get(k))/len(keys))", "0.5"),
            # T4-A-E3: one missing key, so counting keys gave the pinned human_review.
            ("pred={'h':'a','n':1}\nrequired=['h','n','mediana']\n"
             "print('human_review' if len(pred) < len(required) else 'auto_candidate')", "human_review"),
            # T4-B-E3: schema_ok was True, so a decision that ignored it passed.
            ("def decision(score, schema_ok):\n    return 'signal_only'\nprint(decision(0.99, True))", "signal_only"),
        ]
        for code, pin in old_cases:
            self.assertEqual(stdout_of(code), pin)


class TheYouDoHasOneFallback(unittest.TestCase):
    """YOUDO-01.1 to 01.7."""

    def setUp(self) -> None:
        self.yd = s25()["youDo"]
        self.code = self.yd["starterCode"]

    @needs_content_py
    def test_the_fallback_passes_the_validator_the_file_defines(self) -> None:
        out = stdout_of(self.code + "\nprint(validate_output(FALLBACK), FALLBACK['hallazgo'])\n"
                        "print(all(validate_output(r['gold']) for r in GOLDEN))\n")
        self.assertEqual(out, "True human_review\nTrue")
        # Negative control: the fallback the starter used to name, {"status": "human_review"}, fails it.
        out = stdout_of(self.code + "\nprint(validate_output({'status': 'human_review'}))\n")
        self.assertEqual(out, "False")

    def test_no_second_fallback_shape(self) -> None:
        self.assertNotIn('"status"', self.code)
        self.assertIn("FALLBACK", " ".join(self.yd["objectives"]))

    def test_gold_evidence_ids_exist_in_the_lesson(self) -> None:
        ids = set(re.findall(r'"evidence_ids": \[([^\]]*)\]', self.code))
        self.assertNotIn('"inj"', " ".join(ids))
        self.assertIn('"ocr-12"', " ".join(ids))

    def test_empty_evidence_is_scoped_and_tests_are_required(self) -> None:
        req = " ".join(self.yd["requirements"])
        self.assertIn("únicas salidas con evidence_ids vacío", req)
        self.assertIn("Al menos tres pruebas con assert", req)

    def test_the_mock_is_the_taught_path(self) -> None:
        self.assertIn("el curso no enseña http.server", self.yd["context"])
        self.assertIn("Usa el mock en proceso", self.code)

    def test_eval_golden_takes_required_and_returns(self) -> None:
        self.assertIn("def eval_golden(rows, required=SCHEMA_KEYS):", self.code)
        self.assertIn("Devuelve (no imprime)", self.code)


class LearnerFacingText(unittest.TestCase):
    def test_reversed_or_vague_wording_is_gone(self) -> None:
        """WEDO-15.1, 18.2, 19.2, 22.2, 24.2."""
        blob = " ".join(learner_strings(s25()))
        for phrase in ("Sin mediana en REQUIRED", "todo permitido", "promote fácil", "roadmap", '"encoding"'):
            with self.subTest(phrase):
                self.assertNotIn(phrase, blob)
        self.assertIn("Sin mediana en el JSON el gate es `schema_fail`; REQUIRED sí la exige.",
                      exercise("S25-T3-A-E3")["feedback"])

    def test_one_metadata_key_for_the_fraud_policy(self) -> None:
        """WEDO-03.1, YOUDO-01.4: the key is auto_fraud_label (a starter may still print the policy value)."""
        for name, code in all_code():
            with self.subTest(name):
                self.assertIsNone(re.search(r"""['"]auto_fraud['"]\s*:|\bauto_fraud\s*=""", code),
                    "the fraud policy key is auto_fraud_label; a second spelling splits the metadata: found " + repr(re.search(r"""['"]auto_fraud['"]\s*:|\bauto_fraud\s*=""", code)))

    def test_subset_and_think_are_explained_where_used(self) -> None:
        """WEDO-13.1, 17.2."""
        self.assertIn("«A está contenida en B»", exercise("S25-T3-A-E1")["preamble"])
        self.assertIn("`think` es el paso de razonar del propio asistente, no un tool", exercise("S25-T3-B-E2")["preamble"])


class TheStarterPrintsWhatTheSolutionPrints(unittest.TestCase):
    """Codex review on #205 (P2): S25-T2-A-E3's starter and instruction 4 printed the whole list,
    while the solution prints one dict per line, so a correct learner never matched the output."""

    def test_the_starter_and_the_solution_share_the_print_loop(self) -> None:
        e = exercise("S25-T2-A-E3")
        loop = "for item in mock_pipeline(['Factura X', 'hola', 'FACTURA 2']):\n    print(item)"
        self.assertIn(loop, e["solutionCode"]["code"], "the solution's print loop changed; update this test")
        self.assertIn(loop, e["starterCode"]["code"],
                      "the starter prints in another shape than the solution's pinned output")
        self.assertEqual(len(e["solutionCode"]["output"].splitlines()), 3,
                         "the output is one dict per input text")
        text = e["preamble"] + e["instruction"]
        self.assertNotIn("lista completa", text, "the instruction still asks to print the whole list")
        self.assertNotIn("dos dicts", text, "the success line miscounts the dicts (there are three texts)")


class ExamItemsSitUnderTheirConcept(unittest.TestCase):
    """Codex review on #205 (P2): rewritten items kept the concept tag of the item they replaced.

    src/lib/exam-draw.ts draws one variant per concept, so a mislabelled item lets an attempt
    test one concept twice and skip another. These items moved to the concept they assess."""

    MOVED = {
        'Los ejemplos few-shot': 'objective-context-constraints-examples',
        'Antes de un tool que envía un correo': 'glm-thinking-tools-checkpoints',
        'El modelo devuelve un JSON sin mediana': 'golden-schema-human-review',
    }

    def test_each_moved_item_is_under_the_concept_it_assesses(self) -> None:
        bank = exam_bank.bank_for('streamlit-dashboards')
        for prefix, concept in self.MOVED.items():
            with self.subTest(prefix):
                hits = [q for q in bank if q["question"].startswith(prefix)]
                self.assertEqual(len(hits), 1, f"expected one item starting {prefix!r}, found {len(hits)}")
                self.assertEqual(hits[0]["concept"], concept,
                                 f"{prefix!r} is drawn as {hits[0]['concept']}; it assesses {concept}")

    def test_every_concept_keeps_three_variants_in_one_block(self) -> None:
        concepts = [q["concept"] for q in exam_bank.bank_for('streamlit-dashboards')]
        counts = {c: concepts.count(c) for c in dict.fromkeys(concepts)}
        self.assertEqual(set(counts.values()), {3}, f"each concept needs three variants to draw from: {counts}")
        blocks = [c for i, c in enumerate(concepts) if i == 0 or concepts[i - 1] != c]
        self.assertEqual(len(blocks), len(counts), f"a concept's variants are split across the bank: {blocks}")
