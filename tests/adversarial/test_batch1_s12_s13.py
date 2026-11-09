"""Batch-1 fixes for S12 and S13 (proposals-03, owner-approved 2026-11-09).

Each class pins one approved item and fails on the base commit (claude/batch1-fixes-01) and passes
after the fix. Every class also carries a control that would pass vacuously if the detector were
broken, so a green result cannot come from a probe that never ran.

The section objects are read through the TypeScript module itself (node --import tsx), so the
snippets tested here are the evaluated template literals, not a regex guess at their text.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# Every snippet these tests run uses the standard library only, so any Python 3.12 runs them,
# including the adversarial CI job, which installs no content packages. No test here skips.
VENV_PY = Path(sys.executable)
SECTIONS = ROOT / "src/lib/course/sections"
S12 = SECTIONS / "s12-apis-sql-geo.ts"
S13 = SECTIONS / "s13-evidence-dashboard.ts"

NODE_DUMP = """
import {{ section12 }} from {s12!r};
import {{ section13 }} from {s13!r};
const pick = (s) => ({{
  iDo: (s.iDo.steps || []).map((x) => ({{ demoId: x.demoId, code: x.code?.code ?? null, output: x.code?.output ?? null }})),
  theory: s.theory.map((t) => ({{ heading: t.heading ?? null, subtopicId: t.subtopicId ?? null,
    paragraphs: t.paragraphs ?? [], code: t.code?.code ?? null, output: t.code?.output ?? null }})),
  weDo: (s.weDo.steps || []).map((x) => ({{ id: x.id, starter: x.starterCode?.code ?? null,
    solution: x.solutionCode?.code ?? null, solutionOutput: x.solutionCode?.output ?? null,
    preamble: x.preamble ?? '', instruction: x.instruction ?? '', edgeCases: x.edgeCases ?? [] }})),
  youDo: {{ starter: s.youDo.starterCode, requirements: s.youDo.requirements }},
}});
console.log(JSON.stringify({{ s12: pick(section12), s13: pick(section13) }}));
"""

#: Runs a snippet and then a probe in one interpreter. The probe sets RESULT. A snippet error is
#: reported as `error` (its exception type), not raised, so a test can assert on it.
PROBE = r'''
import contextlib, io, json, sys
req = json.loads(sys.stdin.read())
ns, buf, error = {"__name__": "__main__"}, io.StringIO(), None
with contextlib.redirect_stdout(buf):
    try:
        exec(compile(req["code"], "snippet", "exec"), ns)
    except Exception as exc:
        error = type(exc).__name__
    RESULT = None
    if error is None and req.get("probe"):
        try:
            exec(compile(req["probe"], "probe", "exec"), ns)
            RESULT = ns.get("RESULT")
        except Exception as exc:
            error = "probe:" + type(exc).__name__
print(json.dumps({"stdout": buf.getvalue(), "error": error, "result": RESULT}))
'''


@lru_cache(maxsize=1)
def sections() -> dict:
    script = NODE_DUMP.format(s12=str(S12), s13=str(S13))
    done = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", script],
        cwd=ROOT, capture_output=True, text=True, timeout=240,
    )
    if done.returncode != 0:
        raise RuntimeError("could not read the sections through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def probe(code: str, probe_code: str = "") -> dict:
    done = subprocess.run(
        [str(VENV_PY), "-I", "-c", PROBE], input=json.dumps({"code": code, "probe": probe_code}),
        capture_output=True, text=True, timeout=60, cwd=ROOT,
    )
    if done.returncode != 0:
        raise RuntimeError("probe process failed: " + done.stderr[-800:])
    return json.loads(done.stdout)


def run_snippet(code: str) -> str:
    """Stdout of a snippet; a snippet that raises fails the calling test."""
    out = probe(code)
    if out["error"]:
        raise AssertionError(f"snippet raised {out['error']}")
    return out["stdout"]


def step(section: dict, key: str, identifier: str, field: str = "id") -> dict:
    for item in section[key]:
        if item.get(field) == identifier:
            return item
    raise AssertionError(f"{identifier} not found in {key}")


def theory(section: dict, heading_part: str) -> dict:
    found = [t for t in section["theory"] if t["heading"] and heading_part in t["heading"]]
    if len(found) != 1:
        raise AssertionError(f"expected one theory block with {heading_part!r}, found {len(found)}")
    return found[0]


# ---------------------------------------------------------------------------------------------
# A4: the S12 I Do fetch demo checks the status before it parses the body.
# ---------------------------------------------------------------------------------------------
class A4FetchDemoChecksStatusFirst(unittest.TestCase):
    def test_a_503_with_an_error_body_raises_runtime_error_not_key_error(self) -> None:
        code = step(sections()["s12"], "iDo", "S12-T1-A-DEMO", "demoId")["code"]
        failing = code.replace(
            'return MockResponse(200, {"items": SIGNALS, "count": len(SIGNALS)})',
            'return MockResponse(503, {"error": "unavailable"})',
        )
        self.assertNotEqual(failing, code, "the mutation must hit the demo's list_signals")
        out = probe(failing)
        self.assertEqual(out["error"], "RuntimeError", "status must be read before json()")

    def test_the_pinned_200_output_is_unchanged(self) -> None:
        demo = step(sections()["s12"], "iDo", "S12-T1-A-DEMO", "demoId")
        self.assertEqual(run_snippet(demo["code"]).rstrip("\n"), demo["output"].rstrip("\n"))


# ---------------------------------------------------------------------------------------------
# A5: the S12 geocoder mocks are keyed by city; an unknown city is None, not Lima.
# ---------------------------------------------------------------------------------------------
class A5GeocoderMocksAreKeyedByCity(unittest.TestCase):
    def setUp(self) -> None:
        self.code = step(sections()["s12"], "iDo", "S12-T2-B-DEMO", "demoId")["code"]

    def test_an_unknown_city_is_none_online_and_offline(self) -> None:
        out = probe(self.code, 'RESULT = {"online": geocode("Quito"), "offline": geocode("Quito", fail_online=True)}')
        self.assertIsNone(out["error"], "an unknown city must not raise")
        self.assertIsNone(out["result"]["online"], "unknown city must not get Lima's coordinates")
        self.assertIsNone(out["result"]["offline"])

    def test_lima_still_resolves_online_and_offline(self) -> None:
        # Control: a geocoder that returned None for everything would pass the test above.
        out = probe(self.code, 'RESULT = {"online": geocode("Lima"), "offline": geocode("Lima", fail_online=True)}')
        self.assertIsNone(out["error"])
        self.assertEqual(out["result"]["online"]["lat"], -12.0464)
        self.assertEqual(out["result"]["offline"]["mode"], "offline_fallback")

    def test_the_pinned_lima_output_is_unchanged(self) -> None:
        demo = step(sections()["s12"], "iDo", "S12-T2-B-DEMO", "demoId")
        self.assertEqual(run_snippet(demo["code"]).rstrip("\n"), demo["output"].rstrip("\n"))


# ---------------------------------------------------------------------------------------------
# A6: two documents that are empty after normalisation do not match.
# ---------------------------------------------------------------------------------------------
class A6EmptyNormalisedDocumentsDoNotMatch(unittest.TestCase):
    def setUp(self) -> None:
        self.solution = step(sections()["s13"], "weDo", "S13-T1-A-E3")["solution"]

    def test_two_empty_documents_score_zero(self) -> None:
        out = probe(
            self.solution,
            'RESULT = er_score({"name": "Ana Quispe", "document_id": "!!!", "region": "Lima"}, '
            '{"name": "Luis Quispe", "document_id": "--", "region": "Lima"})',
        )
        self.assertIsNone(out["error"])
        self.assertEqual(out["result"], 0.0)

    def test_a_shared_real_document_still_scores_one(self) -> None:
        # Control: a function that always returned 0.0 would pass the test above.
        out = probe(
            self.solution,
            'RESULT = er_score({"name": "Ana Quispe", "document_id": "X1", "region": "Lima"}, '
            '{"name": "Ana Quispe", "document_id": "X1", "region": "Lima"})',
        )
        self.assertEqual(out["result"], 1.0)

    def test_the_pinned_output_is_unchanged(self) -> None:
        item = step(sections()["s13"], "weDo", "S13-T1-A-E3")
        self.assertEqual(run_snippet(self.solution).rstrip("\n"), item["solutionOutput"].rstrip("\n"))


# ---------------------------------------------------------------------------------------------
# A7 + C14: the S13 You Do checks four pairs before it prints anything.
# ---------------------------------------------------------------------------------------------
FIXED_NORM_DOC = 'def norm_doc(d: str) -> str:\n    return re.sub(r"[^a-z0-9]", "", d.casefold())\n\n\n'
FIXED_BLOCKING = (
    "def blocking_key(rec: dict) -> str:\n"
    '    parts = rec["name"].casefold().split()\n'
    '    ap = parts[1] if len(parts) >= 2 else (parts[0] if parts else "")\n'
    '    return f"{ap}|{rec[\'region\'].casefold()}"\n\n\n'
)
FIXED_ER = (
    "def er_score(a: dict, b: dict) -> float:\n"
    '    same_doc = bool(norm_doc(a["document_id"])) and norm_doc(a["document_id"]) == norm_doc(b["document_id"])\n'
    "    same_block = blocking_key(a) == blocking_key(b)\n"
    "    if same_doc and same_block:\n"
    "        return 1.0\n"
    "    if same_doc:\n"
    "        return 0.5\n"
    "    return 0.0\n\n\n"
)
FIXED_REL = (
    "def relationship_signal_score(a: dict, b: dict) -> float:\n"
    "    n = 0.0\n"
    '    if a.get("phone") and a.get("phone") == b.get("phone"):\n'
    "        n += 0.5\n"
    '    if a.get("km") is not None and b.get("km") is not None and a["km"] == b["km"] and a["km"] <= 2.0:\n'
    "        n += 0.3\n"
    '    if a.get("name") and b.get("name"):\n'
    '        pa = a["name"].casefold().split()\n'
    '        pb = b["name"].casefold().split()\n'
    "        if len(pa) >= 2 and len(pb) >= 2 and pa[1] == pb[1]:\n"
    "            n += 0.2\n"
    "    return min(1.0, round(n, 2))\n\n\n"
)
FIXED_DECIDE = (
    "def decide_ops_status(score: float, uncertainty: str) -> str:\n"
    '    if not isfinite(score) or not 0 <= score <= 1 or uncertainty not in ("low", "med", "high"):\n'
    '        return "invalid_input"\n'
    '    if uncertainty == "high":\n'
    '        return "needs_review"\n'
    "    if score < 0.4:\n"
    '        return "abstain"\n'
    "    if score < 0.8:\n"
    '        return "needs_review"\n'
    '    return "accept_pair"\n\n\n'
)
FIXED_PSEUDO = (
    "def pseudonymize(name: str) -> str:\n"
    '    return " ".join(token[0] + "***" for token in name.split())\n\n\n'
)


def replace_def(code: str, name: str, replacement: str) -> str:
    pattern = re.compile(rf"def {name}\(.*?(?=\ndef |\Z)", re.S)
    found = pattern.findall(code)
    if len(found) != 1:
        raise AssertionError(f"expected one def {name}, found {len(found)}")
    body = found[0]
    # keep the blank lines that separate the defs so the module still reads as the starter does
    return code.replace(body, replacement.rstrip("\n") + "\n", 1)


def you_do_variant(starter: str, fixed: tuple[str, ...]) -> str:
    code = starter
    names = ["norm_doc", "blocking_key", "er_score", "relationship_signal_score", "decide_ops_status", "pseudonymize"]
    replacements = {
        "norm_doc": FIXED_NORM_DOC,
        "blocking_key": FIXED_BLOCKING,
        "er_score": FIXED_ER,
        "relationship_signal_score": FIXED_REL,
        "decide_ops_status": FIXED_DECIDE,
        "pseudonymize": FIXED_PSEUDO,
    }
    for name in names:
        if name in fixed:
            code = replace_def(code, name, replacements[name])
    return code


class A7YouDoChecksTheFourHiddenDefects(unittest.TestCase):
    def setUp(self) -> None:
        self.starter = sections()["s13"]["youDo"]["starter"]

    def test_the_starter_as_shipped_stops_before_printing_the_documented_output(self) -> None:
        out = probe(self.starter)
        self.assertEqual(out["error"], "AssertionError")
        self.assertEqual(out["stdout"], "", "nothing may be printed before the pair checks pass")

    def test_two_of_six_fixed_still_stops_before_printing(self) -> None:
        # The NEW-S13-1 case: decide_ops_status and pseudonymize fixed, the four others still defective.
        # On the base commit this printed `er 1.0` and `rel 1.0`, the documented expected output.
        code = you_do_variant(self.starter, ("decide_ops_status", "pseudonymize"))
        out = probe(code)
        self.assertEqual(out["error"], "AssertionError")
        self.assertEqual(out["stdout"], "")

    def test_all_six_fixed_passes_and_prints_the_matrix_result(self) -> None:
        # Positive control: the expected pair scores are reachable, so the failures above are real.
        code = you_do_variant(
            self.starter,
            ("norm_doc", "blocking_key", "er_score", "relationship_signal_score", "decide_ops_status", "pseudonymize"),
        )
        out = probe(code)
        self.assertIsNone(out["error"], "a correct solution must pass every pair check")
        self.assertIn("decision_matrix_ok True", out["stdout"])
        self.assertIn("er 1.0", out["stdout"])
        self.assertIn("rel 1.0", out["stdout"])

    def test_the_pair_expectations_are_the_rules_in_the_text(self) -> None:
        # Checked against the rules, not against the code: a negative pair scores 0.0 on ER and REL,
        # a three-token pair with the same paternal surname scores 1.0 ER and 0.2 REL, and one shared
        # phone scores 0.5 REL.
        code = you_do_variant(
            self.starter,
            ("norm_doc", "blocking_key", "er_score", "relationship_signal_score", "decide_ops_status", "pseudonymize"),
        )
        out = probe(
            code,
            "RESULT = [(er_score(a, b), relationship_signal_score(a, b)) for a, b, _, _ in PAIR_CASES]",
        )
        self.assertIsNone(out["error"])
        self.assertEqual(out["result"], [[1.0, 1.0], [0.0, 0.0], [1.0, 0.2], [0.0, 0.5]])


# ---------------------------------------------------------------------------------------------
# C9: the S12 egress allowlist is {city, country}; an exact address is refused.
# ---------------------------------------------------------------------------------------------
class C9EgressAllowlistDropsAddress(unittest.TestCase):
    def setUp(self) -> None:
        self.solution = step(sections()["s12"], "weDo", "S12-T4-A-E3")["solution"]

    def test_an_exact_address_is_refused(self) -> None:
        out = probe(
            self.solution,
            'RESULT = allowed_for_public_geocoder({"city": "Lima", "address": "Av. Larco 123"})',
        )
        self.assertIsNone(out["error"])
        self.assertIs(out["result"], False)

    def test_city_only_is_allowed_and_document_id_is_refused(self) -> None:
        # Control: an allowlist that refused everything would pass the test above.
        out = probe(
            self.solution,
            'RESULT = [allowed_for_public_geocoder({"city": "Lima"}), '
            'allowed_for_public_geocoder({"city": "Lima", "document_id": "D1"})]',
        )
        self.assertEqual(out["result"], [True, False])

    def test_the_theory_and_the_you_do_agree_on_city_and_country(self) -> None:
        s12 = sections()["s12"]
        text = " ".join(" ".join(t["paragraphs"]) for t in s12["theory"] if t["heading"] and "geocoding" in t["heading"])
        self.assertIn('ALLOWED = {"city", "country"}', text)
        self.assertNotIn('"address", "city"', text)
        you_do = s12["youDo"]["starter"]
        self.assertIn("allowlist {city, country}", you_do)
        self.assertNotRegex(you_do, r'allowed_for_public_geocoder\(\{[^}]*"address"')


# ---------------------------------------------------------------------------------------------
# C10: fetch_with_fallback has three branches; 404 and 429 are client failures, not online.
# ---------------------------------------------------------------------------------------------
class C10ThreeBranchFallback(unittest.TestCase):
    def setUp(self) -> None:
        self.solution = step(sections()["s12"], "weDo", "S12-T2-B-E2")["solution"]

    def test_404_and_429_are_not_reported_as_online(self) -> None:
        out = probe(
            self.solution,
            'RESULT = {s: fetch_with_fallback(s, {"lat": -12.0})[1] for s in (404, 429)}',
        )
        self.assertIsNone(out["error"])
        self.assertEqual(out["result"], {"404": "fail_client", "429": "offline"})

    def test_a_404_returns_no_invented_body(self) -> None:
        out = probe(self.solution, 'RESULT = fetch_with_fallback(404, {"lat": -12.0})[0]')
        self.assertIsNone(out["result"])

    def test_429_is_transient_like_a_503(self) -> None:
        # Owner 2026-11-09: a 429 that survives the N1 retries falls back to the local copy, as a 503
        # does, never to fail_client (it is "slow down", not "your request is wrong"; RFC 6585).
        out = probe(
            self.solution,
            'RESULT = [fetch_with_fallback(s, {"lat": -12.0}) for s in (429, 503)]',
        )
        self.assertEqual(out["result"][0], out["result"][1])
        self.assertEqual(out["result"][0][1], "offline")

    def test_2xx_is_online_and_5xx_or_timeout_is_offline(self) -> None:
        # Control: a branch that always answered fail_client would pass the tests above.
        out = probe(
            self.solution,
            'RESULT = [fetch_with_fallback(200, {"lat": 0})[1], fetch_with_fallback(503, {"lat": 1})[1], '
            'fetch_with_fallback(None, {"lat": 2})[1]]',
        )
        self.assertEqual(out["result"], ["online", "offline", "offline"])

    def test_the_counterexample_shows_the_binary_split_then_the_correction(self) -> None:
        block = theory(sections()["s12"], "Contraejemplo: el corte binario")
        stdout = run_snippet(block["code"])
        self.assertIn("binario 404 ({'online': True}, 'online')", stdout, "the Error half must show the defect")
        self.assertIn("tres ramas 404 (None, 'fail_client')", stdout, "the Corrección half must show the fix")
        self.assertIn("tres ramas 429 ({'lat': -12.0}, 'offline')", stdout, "a 429 is transient, like a 503")
        self.assertEqual(stdout.rstrip("\n"), block["output"].rstrip("\n"))

    def test_the_we_do_pinned_output_lists_the_five_cases(self) -> None:
        item = step(sections()["s12"], "weDo", "S12-T2-B-E2")
        self.assertEqual(run_snippet(self.solution).rstrip("\n"), item["solutionOutput"].rstrip("\n"))
        self.assertEqual(len(item["solutionOutput"].splitlines()), 5)


# ---------------------------------------------------------------------------------------------
# C11: the S13 precision/recall demo is measured from a literal table, with a false positive.
# ---------------------------------------------------------------------------------------------
class C11PrecisionRecallIsMeasuredNotBuiltIn(unittest.TestCase):
    def setUp(self) -> None:
        self.demo = step(sections()["s13"], "iDo", "S13-T1-B-DEMO", "demoId")

    def test_the_demo_reports_a_false_positive_and_precision_below_one(self) -> None:
        stdout = run_snippet(self.demo["code"])
        self.assertIn("fp 1", stdout)
        self.assertIn("precision 0.875", stdout)
        self.assertIn("recall 0.7", stdout)

    def test_the_demo_scores_are_literals_not_derived_from_the_label(self) -> None:
        import ast

        tree = ast.parse(self.demo["code"])
        scores = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Dict):
                for key, value in zip(node.keys, node.values):
                    if isinstance(key, ast.Constant) and key.value == "score":
                        scores.append(value)
        self.assertEqual(len(scores), 20, "twenty pairs, each with a literal score")
        self.assertTrue(all(isinstance(v, ast.Constant) for v in scores), "a score must not be computed")

    def test_the_leaking_generator_is_kept_as_the_counterexample(self) -> None:
        block = theory(sections()["s13"], "Contraejemplo: si el score sale de la etiqueta")
        stdout = run_snippet(block["code"])
        self.assertIn("error precision 1.0 recall 0.714", stdout)
        self.assertIn("corrección precision 0.667 recall 0.667", stdout)
        self.assertEqual(stdout.rstrip("\n"), block["output"].rstrip("\n"))

    def test_relabelling_a_pair_changes_the_metrics_not_the_scores(self) -> None:
        # Control for the literal table: the labels still drive TP/FP/FN, so flipping one label moves
        # precision. A demo whose scores were read from the labels could not show this either way.
        code = self.demo["code"].replace('{"id": "P3", "y": 0, "score": 0.83}', '{"id": "P3", "y": 1, "score": 0.83}')
        self.assertNotEqual(code, self.demo["code"])
        stdout = run_snippet(code)
        self.assertIn("fp 0", stdout)
        self.assertIn("precision 1.0", stdout)


# ---------------------------------------------------------------------------------------------
# C12: one review band, [0.4, 0.8), in the theory, the I Do, the We Do and the T3-B decision.
# ---------------------------------------------------------------------------------------------
class C12OneReviewBand(unittest.TestCase):
    SCORES = [0.3, 0.4, 0.7, 0.75, 0.79, 0.8, 0.9]

    def test_the_we_do_queue_agrees_with_the_t3b_needs_review_decision(self) -> None:
        s13 = sections()["s13"]
        queue_code = step(s13, "weDo", "S13-T1-B-E2")["solution"]
        decide_code = step(s13, "iDo", "S13-T3-B-DEMO", "demoId")["code"]
        pairs = [{"id": f"s{i}", "score": s} for i, s in enumerate(self.SCORES)]
        out = probe(
            queue_code,
            "RESULT = clerical_queue(" + repr(pairs) + ")",
        )
        self.assertIsNone(out["error"])
        queued = set(out["result"])
        decide_probe = "RESULT = {s: decide(s, 'low') for s in " + repr(self.SCORES) + "}"
        decisions = probe(decide_code, decide_probe)
        self.assertIsNone(decisions["error"])
        for i, score in enumerate(self.SCORES):
            needs_review = decisions["result"][str(score)] == "needs_review"
            self.assertEqual(f"s{i}" in queued, needs_review, f"score {score}: queue and T3-B disagree")

    def test_0_75_is_queued_and_0_8_is_not(self) -> None:
        # The case that failed on the base commit: 0.75 was accepted by T3-B's band but not queued.
        code = step(sections()["s13"], "weDo", "S13-T1-B-E2")["solution"]
        out = probe(code, 'RESULT = clerical_queue([{"id": "a", "score": 0.75}, {"id": "b", "score": 0.8}])')
        self.assertEqual(out["result"], ["a"])

    def test_the_i_do_demo_queues_the_same_band_it_scores(self) -> None:
        demo = step(sections()["s13"], "iDo", "S13-T1-B-DEMO", "demoId")
        stdout = run_snippet(demo["code"])
        self.assertIn("clerical_queue ['P4', 'P5', 'P9', 'P11', 'P14']", stdout)

    def test_the_learner_text_has_no_second_band(self) -> None:
        text = S13.read_text(encoding="utf-8")
        self.assertNotIn("[0.4, 0.7]", text)
        self.assertIn("[0.4, 0.8)", text)


if __name__ == "__main__":
    unittest.main()
