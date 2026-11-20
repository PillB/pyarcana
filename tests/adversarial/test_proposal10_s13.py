"""Proposal 10 (approved 2026-11-11), S13: the P1, P2 and P3 findings of the item-by-item review.

S13 closes level 1 with an evidence dashboard. The review found four shapes.

First, two contracts for one input. A missing document gave `None` in `er_rules.py` and 0.0 in the
counterexample and the exercise; the theory printed `auto_fraud False` while the exercise removed
the key; the surname signal was named for surnames and computed on the full name; two blocks used
a binary surname term without saying it was a variant. Each now has one contract: `None` for a
missing document (T3-B sets it apart as `invalid_input`), forbidden keys absent and checked,
`name_jaccard`, and the binary term labelled where it is used.

Second, exercises whose visible cases also pass the usual wrong answer: bounds never tested on the
bound, all-1.0 inputs that pass any weights, a bool and an unknown uncertainty listed as edge
cases but never run, `del` on a key the exercise says may be missing. Each exercise now prints the
case that separates the two answers, and these tests plant each wrong answer.

Third, words and references the learner could not resolve: CF-1 glossed only in an optional block,
a "demo anterior" that does not exist, a figure of a blend shown before the blend is defined, an
egress value that allows an address, a command for a module nobody creates. Fourth, a self-check
and an exam bank where the key's length picked it out.

Negative controls: every reference prints its pin, a no-op mutation raises, starters differ from
the pin, the You Do reference passes through `python -m demo_n1_dashboard --synthetic`, fails with
code 2 without the flag, and each You Do mutant stops it.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section13 }} from {path!r};
console.log(JSON.stringify(section13));
"""


@lru_cache(maxsize=None)
def s13() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s13-evidence-dashboard.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S13 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s13()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s13()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s13()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text(skip_optional: bool = False) -> str:
    sec = s13()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        if skip_optional and b.get("optional"):
            continue
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts += [b["callout"]["title"], b["callout"]["content"]]
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], e.get("hint", ""), *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"], yd["portfolioNote"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def all_code() -> str:
    sec = s13()
    codes = [(b.get("code") or {}).get("code", "") for b in sec["theory"]]
    codes += [d["code"]["code"] for d in sec["iDo"]["steps"]]
    for e in sec["weDo"]["steps"]:
        codes += [e["starterCode"]["code"], e["solutionCode"]["code"]]
    codes.append(sec["youDo"]["starterCode"])
    return "\n".join(codes)


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8", cwd=tmp)


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "evidence-dashboard"][0]["questions"]


def key_length_ranks(questions: list[dict]) -> list[int]:
    """The key's rank by length among its options (1 = longest). A tie with the key fails."""
    ranks = []
    for i, q in enumerate(questions, 1):
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        assert lengths.count(key) == 1, f"item {i}: the key ties another option at {key} characters"
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise now rejects.
MUTANTS = {
    "S13-T1-A-E3": [("WEDO-03.1 a missing document scores 0.0",
                     "    if not doc_a or not doc_b or bkey(a) is None or bkey(b) is None:\n        return None\n", "")],
    "S13-T1-B-E2": [("WEDO-05.2 the low bound is exclusive", 'low <= p["score"] < high', 'low < p["score"] < high'),
                    ("WEDO-05.2 the high bound is inclusive", 'low <= p["score"] < high', 'low <= p["score"] <= high')],
    "S13-T2-A-E2": [("WEDO-08.1 km=2.0 is not close", "geo = 1.0 if km <= 2 else 0.0", "geo = 1.0 if km < 2 else 0.0")],
    "S13-T2-A-E3": [
        ("WEDO-09.1 a hard-coded score", "rel = round(0.5 * phone + 0.3 * geo + 0.2 * name_jaccard, 3)", "rel = 1.0"),
        ("WEDO-09.1 equal weights", "rel = round(0.5 * phone + 0.3 * geo + 0.2 * name_jaccard, 3)",
         "rel = round((phone + geo + name_jaccard) / 3, 3)"),
        ("WEDO-09.1 phone and geo only", "rel = round(0.5 * phone + 0.3 * geo + 0.2 * name_jaccard, 3)",
         "rel = round(0.5 * phone + 0.5 * geo, 3)"),
    ],
    "S13-T3-B-E2": [("WEDO-17.1 no bool guard", "if isinstance(score, bool) or not isinstance", "if not isinstance"),
                    ("WEDO-17.1 no uncertainty check", ' or unc not in {"low", "med", "high"}', "")],
    "S13-T3-B-E3": [("WEDO-18.1 del on a key that may be missing",
                     "clean = {k: v for k, v in out.items() if k not in forbidden}",
                     'clean = dict(out)\n    del clean["is_family"]\n    del clean["auto_fraud"]')],
    "S13-T4-B-E1": [("WEDO-22.1 production left in place", '"data_class": "synthetic_only"', '"data_class": "production"')],
}

#: theory heading -> list of (finding, old, new)
THEORY_MUTANTS = {
    "Contraejemplo: dos documentos vacíos parecen la misma persona": [
        ("THEORY-05.1 the correction scores 0.0 again",
         "score = None if not doc_a or not doc_b else (1.0 if doc_a == doc_b else 0.0)",
         "score = 1.0 if doc_a and doc_a == doc_b else 0.0"),
    ],
    "Transacciones directas y contrapartes comunes": [
        ("EXAM-11.1 the amounts left out of direct_tx",
         ',\n     "amounts": [m for _, _, m in direct_between("A", "B")]}', "}"),
    ],
}

DEMO_MUTANTS = {
    "S13-T3-B-DEMO": [("IDO-06.1 a forbidden key in the output",
                       'out = {"score": sc, "uncertainty": u, "status": decide(sc, u)}',
                       'out = {"score": sc, "uncertainty": u, "status": decide(sc, u), "auto_fraud": False}')],
    "S13-T2-B-DEMO": [("IDO-04.1 a claim among the evidence", "    return evidence\n",
                       '    evidence.append({"type": "collusion"})\n    return evidence\n')],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for e in s13()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                sol = e["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, mutants in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutants:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertEqual(sol["code"].count(old), 1, f"{finding}: anchor not in the solution")
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_the_new_cases_are_pinned(self) -> None:
        self.assertEqual(exercise("S13-T1-A-E3")["solutionCode"]["output"], "1.0 0.5 0.0 None")
        self.assertEqual(exercise("S13-T1-B-E2")["solutionCode"]["output"], "['P2', 'P3', 'P5']")
        self.assertEqual(exercise("S13-T2-A-E2")["solutionCode"]["output"].splitlines(), ["0.8", "0.8", "0.2"])
        self.assertEqual(exercise("S13-T2-A-E3")["solutionCode"]["output"].splitlines()[0], "score 0.9")
        out = exercise("S13-T3-B-E2")["solutionCode"]["output"].splitlines()
        self.assertEqual(out[-2:], ["True low invalid_input", "0.8 ? invalid_input"])
        self.assertEqual(exercise("S13-T3-B-E3")["solutionCode"]["output"].splitlines(),
                         ["['score', 'status']", "['score', 'status']"])
        self.assertEqual(exercise("S13-T4-B-E1")["solutionCode"]["output"].splitlines()[1], "synthetic_only")

    def test_starters_run_the_new_cases_and_differ_from_the_pin(self) -> None:
        needles = {
            "S13-T1-A-E3": 'E = {"name": "Ana Quispe", "document_id": "", "region": "Lima"}',
            "S13-T1-B-E2": '{"id": "P5", "score": 0.4},\n    {"id": "P6", "score": 0.8},',
            "S13-T2-A-E2": "print(rel_score(2.0, 0.5))",
            "S13-T2-A-E3": "phone, geo, name_jaccard = 1.0, 1.0, 0.5",
            "S13-T3-B-E2": '(True, "low"), (0.8, "?")',
            "S13-T3-B-E3": '{"status": "abstain", "score": 0.2},',
            "S13-T4-B-E1": 'print(privacy["data_class"])',
        }
        for e in s13()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                if e["id"] in needles:
                    self.assertIn(needles[e["id"]], e["starterCode"]["code"])
                    self.assertIn(needles[e["id"]], e["solutionCode"]["code"])
                done = run_py(e["starterCode"]["code"])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_the_given_block_helper_survives_an_empty_name(self) -> None:
        # WEDO-03.2: the helper the starter gives returned parts[0] of an empty list (IndexError).
        for which in ("starterCode", "solutionCode"):
            code = exercise("S13-T1-A-E3")[which]["code"]
            helper = code.split("def er_score", 1)[0]
            done = run_py(helper.replace("# CASO", "#") + '\nprint(bkey({"name": "", "region": "Lima"}))\n')
            self.assertEqual(done.returncode, 0, done.stderr[-300:])
            self.assertTrue(done.stdout.rstrip("\n").endswith("None"))

    def test_the_mutation_helper_refuses_a_no_op(self) -> None:
        sol = exercise("S13-T2-A-E2")["solutionCode"]
        with self.assertRaises(AssertionError):
            caught(sol["code"], sol["output"], sol["code"])
        # An edit that keeps the behaviour is not reported as a catch.
        self.assertFalse(caught(sol["code"], sol["output"], sol["code"].replace("km <= 2", "2 >= km")))


class TheoryAndDemosShowWhatTheySay(unittest.TestCase):
    def _mutate(self, code: dict, finding: str, old: str, new: str) -> None:
        self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not found")
        self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)),
                        f"the block still prints its pin with the mistake: {finding}")

    def test_theory_blocks_reject_their_mistake(self) -> None:
        for heading, mutants in THEORY_MUTANTS.items():
            for finding, old, new in mutants:
                with self.subTest(finding=finding):
                    self._mutate(block(heading)["code"], finding, old, new)

    def test_demos_reject_their_mistake(self) -> None:
        for demo_id, mutants in DEMO_MUTANTS.items():
            for finding, old, new in mutants:
                with self.subTest(finding=finding):
                    self._mutate(demo(demo_id)["code"], finding, old, new)

    def test_a_missing_document_is_none_everywhere(self) -> None:
        # THEORY-05.1 / WEDO-03.1: one contract, None ("falta el dato"), set apart as invalid_input.
        self.assertEqual(block("Contraejemplo: dos documentos vacíos parecen la misma persona")["code"]["output"],
                         "sin regla de vacío → 1.0\ncon regla de vacío → None")
        er = block("Normalización, blocking y entity resolution")
        self.assertIn("sin documento None", er["code"]["output"])
        self.assertIn("la matriz de T3-B lo aparta como invalid_input", er["code"]["code"])
        self.assertNotIn("el par va a revisión", er["code"]["code"])
        self.assertNotIn("el score vuelve a 0.0", learner_text())
        self.assertIn("documento o bloque ausente → `None`", exercise("S13-T1-A-E3")["preamble"])

    def test_forbidden_keys_are_absent_not_printed_false(self) -> None:
        # THEORY-15.1 / IDO-06.1: the theory and the demo agree with T3-B-E3, which removes the keys.
        self.assertNotIn("auto_fraud", block("Umbral de revisión, abstención y no inferencia automática")["code"]["output"])
        out = demo("S13-T3-B-DEMO")["code"]["output"]
        self.assertNotIn("'auto_fraud'", out)
        self.assertNotIn("'is_family'", out)
        self.assertTrue(out.endswith("claves prohibidas en la salida: []"))
        text = " ".join(block("Umbral de revisión, abstención y no inferencia automática")["paragraphs"])
        self.assertNotIn("**siempre** `auto_fraud=False`", text)
        self.assertIn("las claves `auto_fraud` e `is_family` **no existen**", text)

    def test_the_family_card_lists_the_signals_it_computed(self) -> None:
        # THEORY-11.2: move two employees out of the building and the card's signals follow.
        code = block("Contraejemplo: un umbral de relación etiqueta a compañeros como familia")["code"]
        moved = code["code"].replace('{"id": "E1", "phone": "014000000", "km": 0.1',
                                     '{"id": "E1", "phone": "014000000", "km": 5.0')
        self.assertNotEqual(moved, code["code"])
        done = run_py(moved)
        self.assertEqual(done.returncode, 0, done.stderr[-300:])
        card = done.stdout.splitlines()[-1]
        self.assertIn("'signals': ['shared_phone']", card)
        self.assertIn("'relationship_signal_score': 0.5", card)

    def test_the_demo_counts_claims_instead_of_printing_a_literal(self) -> None:
        code = demo("S13-T2-B-DEMO")["code"]
        self.assertNotIn('print("collusion_claim", False)', code["code"])
        self.assertTrue(code["output"].endswith("claims_made 0"))

    def test_direct_tx_carries_the_amounts_the_exam_asks_for(self) -> None:
        out = block("Transacciones directas y contrapartes comunes")["code"]["output"]
        self.assertIn("'n': 2, 'amounts': [10, 5]", out)

    def test_the_blend_figure_sits_with_the_blend(self) -> None:
        # THEORY-07.1: the figure of ER 0.70 / REL 1.00 / blend 0.82 moved to the block that computes it.
        self.assertNotIn("figure", block("Verdad etiquetada, precision/recall y revisión clerical"))
        fig = block("Contraejemplo: la mezcla de ER y relación decide la identidad")["figure"]
        self.assertEqual(fig["id"], "S13-two-scores")
        self.assertIn("con la mezcla 0.82 → accept_pair",
                      block("Contraejemplo: la mezcla de ER y relación decide la identidad")["code"]["output"])

    def test_the_egress_value_matches_the_s12_allowlist(self) -> None:
        out = block("Privacidad, acceso, pruebas, demo y runbook")["code"]["output"]
        self.assertIn("'egress_public_geocoder': 'city_country_only'", out)
        self.assertNotIn("city_address_only", json.dumps(s13(), ensure_ascii=False))

    def test_the_runbook_installs_nothing(self) -> None:
        out = demo("S13-T4-B-DEMO")["code"]["output"]
        self.assertNotIn("requirements.txt", out)
        self.assertIn("stdlib only", out)

    def test_every_tooltip_is_a_geo_signal_with_a_source(self) -> None:
        code = block("Dashboard/mapa pseudonimizado y ficha de caso")["code"]["code"]
        tips = [line.split('": ', 1)[1] for line in code.splitlines() if '"geo_tooltip"' in line]
        self.assertEqual(len(tips), 3)
        for tip in tips:
            with self.subTest(tip=tip):
                self.assertIn("geo_distance_km=", tip)
                self.assertIn("source=", tip)


class WordsAndContracts(unittest.TestCase):
    def test_cf1_is_defined_outside_the_optional_block(self) -> None:
        sec = s13()
        self.assertIn("CF-1 (privacidad, demostración y runbook)", sec["tagline"])
        required = learner_text(skip_optional=True)
        self.assertIn("El cierre pide además el paquete **CF-1**", required)
        self.assertIn("CF-1 es el paquete de operación del cierre", required)

    def test_header_terms_are_glossed(self) -> None:
        outcomes = " ".join(o["text"] for o in s13()["learningOutcomes"])
        for needle in ("blocking (bloqueo: comparar solo los pares", "La cola clerical es la bandeja",
                       "scaffold (andamiaje mínimo", "runbook (manual de operación)",
                       "señales de transacciones directas", "Distinguir la resolución de identidad de las señales de relación"):
            with self.subTest(needle=needle):
                self.assertIn(needle, outcomes)
        self.assertNotIn("txs", outcomes)
        self.assertNotIn("resolución de entidades", outcomes)

    def test_one_name_for_the_name_signal(self) -> None:
        # THEORY-10.1: the signal is the Jaccard of the full name, so it is called name_jaccard.
        self.assertNotIn("surname_jaccard", learner_text() + all_code())
        self.assertIn("'name_jaccard': 0.2", block("Email/teléfono/dirección compartidos, distancia y apellidos")["code"]["output"])

    def test_binary_surname_terms_are_labelled_as_variants(self) -> None:
        self.assertIn("variante declarada", demo("S13-T2-A-DEMO")["preamble"])
        para = block("Contraejemplo: un umbral de relación etiqueta a compañeros como familia")["paragraphs"][0]
        self.assertIn("con una variante declarada", para)
        self.assertNotIn("aplica la fórmula N1 de esta sección", para)

    def test_no_missing_demo_and_no_reused_threshold(self) -> None:
        text = learner_text()
        self.assertNotIn("de la demo anterior", text)
        self.assertNotIn("(reutiliza la geoseñal de S12)", text)
        self.assertIn("el corte de 2.0 km es nuevo", text)
        self.assertIn("no valores calibrados con datos reales", text)

    def test_the_blocking_paragraph_is_split(self) -> None:
        paras = block("Normalización, blocking y entity resolution")["paragraphs"]
        self.assertTrue(any(p.startswith("**Por qué una clave no basta:**") for p in paras))
        self.assertTrue(any(p.startswith("**La regla del token:**") for p in paras))
        self.assertLess(max(len(p.split()) for p in paras), 200)

    def test_abstain_says_what_happens_to_the_pair(self) -> None:
        text = " ".join(block("Umbral de revisión, abstención y no inferencia automática")["paragraphs"])
        self.assertIn("Abstenerse significa que el par no se une ni entra a la cola", text)
        self.assertNotIn("cualquier path", text)

    def test_exact_texts_are_in_the_instruction(self) -> None:
        self.assertIn("*contraparte común no prueba acuerdo ilícito*", exercise("S13-T2-B-E3")["instruction"])
        self.assertIn("`level1_regression: re-check S01-S13 critical paths after incident`",
                      exercise("S13-T4-B-E3")["instruction"])
        self.assertIn("módulo `demo_n1_dashboard.py` que crearás en el You Do", exercise("S13-T4-B-E2")["instruction"])

    def test_hints_say_what_the_code_does(self) -> None:
        self.assertNotIn("a and b and a.casefold()==b.casefold()", exercise("S13-T2-A-E1")["hints"])
        self.assertNotIn("Usarás el dict en E2", exercise("S13-T3-B-E1")["hints"])
        self.assertIn("En Python `True` es un int y valdría 1.0", exercise("S13-T3-B-E2")["hints"][0])
        self.assertIn("`pop(clave, None)`", exercise("S13-T3-B-E3")["hints"][0])

    def test_the_demo_preambles_leave_the_prediction_open(self) -> None:
        self.assertNotIn("(no: el umbral es >0.5)", demo("S13-T3-A-DEMO")["preamble"])
        pre = demo("S13-T4-B-DEMO")["preamble"]
        self.assertNotIn("shot", pre)
        self.assertNotIn("ledger", pre)


# The six fixes a learner makes; appended after the starter's definitions, so they replace them.
YOUDO_IMPL = '''
def norm_doc(d: str) -> str:
    return re.sub(r"[^a-z0-9]", "", d.casefold())


def blocking_key(rec: dict) -> str | None:
    parts = rec["name"].casefold().split()
    if not parts:
        return None
    ap = parts[1] if len(parts) >= 2 else parts[0]
    return f"{ap}|{rec['region'].casefold()}"


def er_score(a: dict, b: dict) -> float | None:
    doc_a, doc_b = norm_doc(a.get("document_id") or ""), norm_doc(b.get("document_id") or "")
    if not doc_a or not doc_b or blocking_key(a) is None or blocking_key(b) is None:
        return None
    if doc_a != doc_b:
        return 0.0
    return 1.0 if blocking_key(a) == blocking_key(b) else 0.5


def relationship_signal_score(a: dict, b: dict) -> float:
    phone = bool(a.get("phone")) and a.get("phone") == b.get("phone")
    geo = a.get("km") is not None and a.get("km") == b.get("km") and a["km"] <= 2.0
    ta, tb = set(a["name"].casefold().split()), set(b["name"].casefold().split())
    name_jaccard = len(ta & tb) / len(ta | tb) if ta and tb else 0.0
    return round(0.5 * phone + 0.3 * geo + 0.2 * name_jaccard, 3)


def decide_ops_status(score, uncertainty):
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return "invalid_input"
    if not isfinite(score) or not 0.0 <= score <= 1.0 or uncertainty not in {"low", "med", "high"}:
        return "invalid_input"
    if uncertainty == "high":
        return "needs_review"
    if score < 0.4:
        return "abstain"
    if score < 0.8:
        return "needs_review"
    return "accept_pair"


def pseudonymize(name: str) -> str:
    return " ".join(p[0] + "***" for p in name.split() if p)
'''

YOUDO_MUTANTS = [
    ("YOUDO-01.1 the second-token surname rule",
     "    name_jaccard = len(ta & tb) / len(ta | tb) if ta and tb else 0.0\n",
     "    pa, pb = a['name'].casefold().split(), b['name'].casefold().split()\n"
     "    name_jaccard = 1.0 if len(pa) > 1 and len(pb) > 1 and pa[1] == pb[1] else 0.0\n"),
    ("decision matrix without the uncertainty check", ' or uncertainty not in {"low", "med", "high"}', ""),
    ("the last token as block", "ap = parts[1] if len(parts) >= 2 else parts[0]", "ap = parts[-1]"),
]


def youdo_program(impl: str) -> str:
    starter = s13()["youDo"]["starterCode"]
    head, guard = starter.split('\n\nif __name__ == "__main__":')
    return head + "\n" + impl + '\n\nif __name__ == "__main__":' + guard


def run_module(impl: str, *args: str) -> subprocess.CompletedProcess:
    """Runs the You Do the way its requirement says: saved as demo_n1_dashboard.py, run with -m."""
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp) / "demo_n1_dashboard.py").write_text(youdo_program(impl), encoding="utf-8")
        return subprocess.run([sys.executable, "-E", "-s", "-m", "demo_n1_dashboard", *args], capture_output=True,
                              text=True, timeout=60, encoding="utf-8", cwd=tmp)


class YouDoRunsAsTheRunbookSays(unittest.TestCase):
    def test_the_reference_runs_with_the_documented_command(self) -> None:
        done = run_module(YOUDO_IMPL, "--synthetic")
        self.assertEqual(done.returncode, 0, done.stderr[-600:])
        lines = done.stdout.splitlines()
        self.assertEqual(lines[:4], ["pseudo A*** Q***", "er 1.0", "rel 1.0", "decision_matrix_ok True"])

    def test_without_the_flag_argparse_stops_with_code_2(self) -> None:
        done = run_module(YOUDO_IMPL)
        self.assertEqual(done.returncode, 2)
        self.assertIn("--synthetic", done.stderr)
        self.assertEqual(done.stdout, "")

    def test_each_mutant_stops_the_demo(self) -> None:
        for finding, old, new in YOUDO_MUTANTS:
            with self.subTest(finding=finding):
                self.assertEqual(YOUDO_IMPL.count(old), 1, finding)
                done = run_module(YOUDO_IMPL.replace(old, new), "--synthetic")
                self.assertNotEqual(done.returncode, 0, finding)
                self.assertIn("AssertionError", done.stderr)

    def test_the_starter_names_its_module_and_its_tests(self) -> None:
        starter = s13()["youDo"]["starterCode"]
        self.assertTrue(starter.startswith('"""demo_n1_dashboard.py'))
        self.assertIn("import argparse", starter)
        reqs = " ".join(s13()["youDo"]["requirements"])
        self.assertIn("`tests/test_demo_n1_dashboard.py`", reqs)
        self.assertIn("`python -m unittest discover -s tests`", reqs)
        self.assertIn("guardado como `demo_n1_dashboard.py`", reqs)


class SelfCheckAndBank(unittest.TestCase):
    def test_the_grey_zone_key_is_review_only(self) -> None:
        # SELFCHECK-03.1: [0.40, 0.80) goes to review; abstain is only below 0.40.
        q = s13()["selfCheck"]["questions"][2]
        self.assertEqual(q["options"][q["correctIndex"]], "Encolar needs_review (cola clerical), sin aceptar ni abstenerse")
        self.assertEqual(q["explanation"], "En [0.40, 0.80) el par va a revisión humana; abstain solo en < 0.40, y nunca fraude automático.")

    def test_selfcheck_has_no_absurd_distractor(self) -> None:
        opts = [o for q in s13()["selfCheck"]["questions"] for o in q["options"]]
        for absurd in ("Fraude confirmado", "Ocultarse al revisor", "Borrar el dashboard", "Hardcodear tokens en el repo",
                       "Solo un modelo de deep learning", "Enviar PII a geocoder público", "auto_fraud"):
            with self.subTest(absurd=absurd):
                self.assertNotIn(absurd, opts)

    def test_selfcheck_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(s13()["selfCheck"]["questions"])
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 3, ranks)
        self.assertLessEqual(ranks.count(1), 2, ranks)

    def test_the_exam_keeps_the_lesson_case_ids(self) -> None:
        stems = [q["question"] for q in bank()]
        self.assertFalse(any(s.startswith("CASE-2 tiene ER=0.52") for s in stems))
        self.assertTrue(any(s.startswith("Un caso nuevo, CASE-4, tiene ER=0.52") for s in stems))
        self.assertFalse(any("coincidencia de apellido igual a 1" in s for s in stems))

    def test_bank_has_no_length_cue(self) -> None:
        # Every tie is broken and no rank holds more than 8 of 24. The longest rank holds 2, as on main:
        # test_exam_length_cue's ratchet lets the course-wide "longest" count fall but never grow, so
        # the other three ranks carry 22 keys and one of them holds 8 (8/24 picks nobody's 70%).
        qs = bank()
        self.assertEqual(len(qs), 24)
        ranks = key_length_ranks(qs)
        self.assertLessEqual(ranks.count(1), 2, ranks)
        self.assertLessEqual(max(ranks.count(r) for r in range(1, 5)), 8, ranks)


if __name__ == "__main__":
    unittest.main()
