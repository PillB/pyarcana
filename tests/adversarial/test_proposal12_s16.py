"""Proposal 12 (approved 2026-11-21), S16: the P1, P2 and P3 findings of the item-by-item review.

S16 teaches the data-quality gate for CP-N2-A. The review found five shapes.

First, clean and quarantine overlapped. The P1: a conflicting key kept one row in `clean`
(`drop_duplicates(keep='first')`) and both rows in quarantine, while T4-B and the You Do computed
`rows_clean = rows_in - rows_quarantine`. The learner got two counts for the same data. The section
now has one rule: every input row ends in exactly one of the two sets. Exact copies leave one row
in clean and the rest as `dup_exact`; every row of a conflicting key goes to quarantine as
`dup_conflict`; schema drift holds the whole batch. The tests run the demos and check the sum.

Second, one case with several outcomes and names. A required null was "cuarentena o fail",
schema drift was a row reason in one demo and a batch stop in theory, the first audit event was
`ingest` in theory and `start` in code, the cap label was `blocked` in prose and `fail_impute_cap`
in code, a reason was spelled three ways, and the domain bound was 10000 in prose and 1e6 in a demo.

Third, a money parser that read the Peruvian format 1000 times too small: «S/ 1,250.50», as
`Intl.NumberFormat('es-PE')` prints it, became 1.2505. The rule now takes the last separator as
the decimal and refuses `1,250` as ambiguous. The test feeds it the es-PE string Node prints.

Fourth, checks that pass the usual wrong answer: every We Do compared one output on one fixture,
so a hardcoded print passed. Each exercise now runs two fixtures (or one that separates the usual
mistake), and the MUTATIONS table plants each wrong answer and requires the pin to catch it.

Fifth, an exam bank whose key was the longest option in 24 of 24, with wxPython leftovers as
distractors, and an off-topic wxPython playground and PDF label.

Lesson code needs pandas, so those runs use the pinned content interpreter (.venv-content, or
content-gates in CI) and skip elsewhere, like test_proposal12_s14 and _s15. The text, playground,
money-parser and bank checks need no pandas and always run.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import textwrap
import types
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s16-wxpython-gui.ts"
FIGURES = ROOT / "src" / "components" / "course" / "figures" / "data" / "misc.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"
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

DUMP = """
import {{ section16 }} from {path!r};
console.log(JSON.stringify(section16));
"""

#: The reason codes and audit events the section fixes for itself.
REASONS = {"null_required", "dup_exact", "dup_conflict", "domain_error", "cross_field", "schema_drift"}
EVENTS = {"ingest", "quarantine", "promote"}


@lru_cache(maxsize=None)
def s16() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S16 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s16()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def prose(heading: str) -> str:
    b = block(heading)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(demo_id: str) -> dict:
    hits = [d for d in s16()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s16()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def strings(node) -> list[str]:
    if isinstance(node, str):
        return [node]
    if isinstance(node, dict):
        return [s for v in node.values() for s in strings(v)]
    if isinstance(node, list):
        return [s for v in node for s in strings(v)]
    return []


def interpreter_for(source: str) -> Path | None:
    return CONTENT_PY if "pandas" in source else Path(sys.executable)


def run_py(source: str) -> subprocess.CompletedProcess:
    py = interpreter_for(source)
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


def bank() -> list[dict]:
    return exam_bank.bank_for("wxpython-gui")


def key_length_ranks(questions: list[dict]) -> list[int]:
    ranks = []
    for q in questions:
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        if lengths.count(key) != 1:
            raise AssertionError(f"the key ties another option in length: {q['question']}")
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


def inner_function(code: str, name: str) -> str:
    """The source of a function nested in a lesson snippet, dedented so it can run alone."""
    m = re.search(rf"^( +)def {name}\(.*?(?=^\1\S|\Z)", code, re.S | re.M)
    if not m:
        raise AssertionError(f"no def {name} in the snippet")
    return textwrap.dedent(m.group(0))


# ---------------------------------------------------------------------------- the P1: one partition

class OnePartition(unittest.TestCase):
    """Every input row ends in clean or in quarantine, never in both."""

    SUM = re.compile(r"^rows_in (\d+) = (\d+) \+ (\d+)$", re.M)

    def _sum(self, out: str) -> tuple[int, int, int]:
        m = self.SUM.search(out)
        self.assertIsNotNone(m, "the snippet must print rows_in N = clean + quarantine")
        return tuple(int(g) for g in m.groups())

    @needs_pandas
    def test_key_evidence_block_partitions_exact_copies_and_conflicts(self) -> None:
        code = block("Claves, cardinalidad y conservación de evidencia")["code"]
        out = stdout_of(code["code"])
        self.assertEqual(out, code["output"].rstrip("\n"))
        rows_in, clean, quarantine = self._sum(out)
        self.assertEqual(rows_in, clean + quarantine)
        clean_ids = eval(out.splitlines()[0].removeprefix("clean "))  # noqa: S307 - our own pin
        q = eval(out.splitlines()[1].removeprefix("quarantine "))  # noqa: S307
        conflicted = {k for k, r in zip(q["cliente_id"], q["reason"]) if r == "dup_conflict"}
        self.assertFalse(conflicted & set(clean_ids), "a conflicting key left a row in clean")
        self.assertEqual(set(q["reason"]), {"dup_exact", "dup_conflict"})

    @needs_pandas
    def test_evidence_demo_keeps_no_row_in_both_sets(self) -> None:
        code = demo("S16-T2-B-DEMO")["code"]
        out = stdout_of(code["code"])
        rows_in, clean, quarantine = self._sum(out)
        self.assertEqual((rows_in, clean, quarantine), (3, 1, 2))
        self.assertIn("clean_ids ['C002']", out.splitlines())

    @needs_pandas
    def test_the_old_keep_first_split_breaks_the_sum(self) -> None:
        """Negative control: the pre-fix split puts C001 in both sets and the sum stops adding up."""
        code = demo("S16-T2-B-DEMO")["code"]["code"]
        old = code.replace('clean = df[~conflicto]', 'clean = df.drop_duplicates("cliente_id", keep="first")')
        self.assertNotEqual(old, code)
        rows_in, clean, quarantine = self._sum(stdout_of(old))
        self.assertNotEqual(rows_in, clean + quarantine)

    def test_metrics_prose_states_the_identity_the_exercises_use(self) -> None:
        text = prose("Métricas, cuarentena y audit trail")
        self.assertIn("rows_in == rows_clean + rows_quarantine", text)
        self.assertIn("rows_in == rows_clean + rows_quarantine", " ".join(s16()["youDo"]["requirements"]))
        self.assertIn("rows_clean = rows_in - len(quarantine)", exercise("S16-T4-B-E1")["preamble"])
        self.assertNotIn('drop_duplicates(key, keep=...)', prose("Claves, cardinalidad y conservación de evidencia"))


class OneOutcomePerCase(unittest.TestCase):
    """A required null, schema drift, the cap label, reason codes, audit events and the domain bound."""

    def test_a_required_null_has_one_outcome(self) -> None:
        texts = strings(s16())
        self.assertFalse([t for t in texts if "cuarentena o fail" in t or "tumba el gate" in t])
        self.assertIn("`pass=False`", prose("Nulls y políticas por campo"))
        figure = FIGURES.read_text(encoding="utf-8")
        self.assertNotIn("'cuarentena o fail'", figure)

    def test_schema_drift_is_a_batch_stop_not_a_row_reason(self) -> None:
        text = prose("Reglas de schema y cross-field")
        self.assertIn("lote entero", text)
        demo_code = demo("S16-T4-B-DEMO")["code"]["code"]
        self.assertNotIn("schema_drift", demo_code, "a demo still quarantines one row for drift")
        self.assertNotIn("schema_drift", exercise("S16-T4-B-E1")["solutionCode"]["code"])

    def test_reason_codes_and_audit_events_use_one_vocabulary(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        reasons = set(re.findall(r'reason\\?"?: \\?"(\w+)', source)) | set(re.findall(r'reason="(\w+)"', source))
        self.assertTrue(reasons, "the reason scanner found nothing")
        self.assertLessEqual(reasons, REASONS, f"unknown reason codes: {reasons - REASONS}")
        events = set(re.findall(r'event\\?"?: \\?"(\w+)', source))
        self.assertTrue(events)
        self.assertLessEqual(events, EVENTS, f"unknown audit events: {events - EVENTS}")
        for gone in ("null_required_monto", "conflict_region", "fail_impute_cap", "1e6"):
            self.assertNotIn(gone, source)

    def test_the_cap_is_inclusive_in_prose_and_in_the_exercise(self) -> None:
        self.assertIn("inclusivo", prose("Indicadores y límites de imputación"))
        self.assertIn("rate > cap", exercise("S16-T1-B-E2")["solutionCode"]["code"])

    def test_no_spanish_city_in_a_peruvian_fixture(self) -> None:
        source = SECTION.read_text(encoding="utf-8") + FIGURES.read_text(encoding="utf-8")
        self.assertNotIn("Madrid", source)
        self.assertNotIn("MADRID", source)
        self.assertNotIn('"MAD"', source)


# ---------------------------------------------------------------------------- money and dates

class PeruvianMoney(unittest.TestCase):
    """The parser of the normalization block, run alone with a stand-in for pd.isna."""

    def setUp(self) -> None:
        code = block("Normalización de strings, números, fechas y categorías")["code"]["code"]
        ns = {"pd": types.SimpleNamespace(isna=lambda x: x is None), "re": re}
        exec(inner_function(code, "norm_money"), ns)  # noqa: S102 - our own lesson code
        self.norm = ns["norm_money"]

    def test_the_es_pe_format_node_prints_reads_as_its_amount(self) -> None:
        done = subprocess.run(
            ["node", "-e", "process.stdout.write(new Intl.NumberFormat('es-PE', "
                           "{style: 'currency', currency: 'PEN'}).format(1250.5))"],
            capture_output=True, text=True, timeout=60)
        self.assertEqual(done.returncode, 0, done.stderr)
        printed = done.stdout.replace("\u00a0", " ")
        self.assertIn("1,250.50", printed, "es-PE groups thousands with a comma")
        self.assertEqual(self.norm(printed), 1250.5)

    def test_the_four_rules(self) -> None:
        cases = {"S/ 1,250.50": 1250.5, "1.250,5": 1250.5, "3,00": 3.0, "10.50": 10.5,
                 "S/12.5": 12.5, "1.250.000,5": 1250000.5}
        for raw, value in cases.items():
            with self.subTest(raw):
                self.assertEqual(self.norm(raw), value)

    def test_one_separator_and_three_digits_is_refused(self) -> None:
        for raw in ("1,250", "1.250", "S/ 2,500"):
            with self.subTest(raw), self.assertRaises(ValueError):
                self.norm(raw)

    def test_the_old_rule_reads_the_receipt_one_thousand_times_too_small(self) -> None:
        """Negative control: the pre-fix rule (the dot is always thousands)."""
        s = "1,250.50".replace(".", "").replace(",", ".")
        self.assertAlmostEqual(float(s), 1.2505)

    def test_the_demo_parser_reads_the_receipt_too(self) -> None:
        code = demo("S16-T3-A-DEMO")["code"]["code"]
        ns: dict = {}
        exec(inner_function(code, "norm_money"), ns)  # noqa: S102
        self.assertEqual(ns["norm_money"]("S/ 1,250.50"), 1250.5)
        self.assertEqual(ns["norm_money"]("3,00"), 3.0)


class DocumentedDateFormat(unittest.TestCase):
    def test_a_month_first_date_is_not_reinterpreted(self) -> None:
        code = block("Normalización de strings, números, fechas y categorías")["code"]
        self.assertIn('"03/15/2024"', code["code"])
        self.assertIn("fechas ['2024-03-01', '2024-03-15', '2024-03-15', 'NaT']", code["output"])
        text = prose("Normalización de strings, números, fechas y categorías")
        self.assertIn("03/04/2024", text, "the prose must say a day <= 12 would parse silently")
        self.assertIn("Not a Time", text)

    @needs_pandas
    def test_the_pinned_dates_run(self) -> None:
        code = block("Normalización de strings, números, fechas y categorías")["code"]
        self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))


# ---------------------------------------------------------------------------- We Do mutations

#: (exercise, text in the solution, the usual wrong answer). Each must change the output.
MUTATIONS = [
    ("S16-T1-A-E1", 'df["id"].isna()', 'df["id"].notna()'),
    ("S16-T1-A-E1", 'return n, "violates" if n > 0 else "ok"', 'return 1, "violates"'),
    ("S16-T1-A-E2", 'p == "required"', 'p in ("required", "optional")'),
    ("S16-T1-A-E3", 'return "fail" if viol else "pass"', 'return "fail"'),
    ("S16-T1-B-E1", 'df["was_null"] = df["descuento"].isna()\n    df["descuento"] = df["descuento"].fillna(df["descuento"].median())',
     'df["descuento"] = df["descuento"].fillna(df["descuento"].median())\n    df["was_null"] = df["descuento"].isna()'),
    ("S16-T1-B-E2", "rate > cap", "rate >= cap"),
    ("S16-T1-B-E3", "s.median()", "s.mean()"),
    ("S16-T2-A-E1", "keep=False", 'keep="first"'),
    ("S16-T2-A-E2", "return regiones[regiones > 1].index.tolist()", 'return ["C001"]'),
    ("S16-T2-A-E3", 'if len(sub.drop_duplicates()) == 1:\n        return "exact"\n    return "conflict"',
     'if sub["region"].nunique() > 1:\n        return "conflict"\n    return "exact"'),
    ("S16-T2-A-E3", 'if len(sub.drop_duplicates()) == 1:\n        return "exact"\n', ""),
    # Codex review on #184: "every row has a copy" is not "one version"; C005 has two versions, each twice.
    ("S16-T2-A-E3", "if len(sub.drop_duplicates()) == 1:", "if sub.duplicated(keep=False).all():"),
    ("S16-T2-B-E1", "c = df[~mask]", 'c = df.drop_duplicates("id", keep="first")'),
    ("S16-T2-B-E2", 'return df[df.duplicated("id", keep=False)].copy()',
     'return df[df.duplicated("id", keep=False)][["id", "batch"]].copy()'),
    ("S16-T2-B-E3", 'return "card_ok" if df["id"].nunique() == len(df) else "card_bad"', 'return "card_bad"'),
    ("S16-T3-A-E1", "return s.str.strip().str.title().tolist()", 'return ["Lima", "Cusco"]'),
    ("S16-T3-A-E2", 'if "," in s and "." not in s:\n        s = s.replace(",", ".")', 's = s.replace(",", "")'),
    ("S16-T3-A-E3", 'df["region"] = df["region_raw"].str.title()',
     'df["region"] = df["region_raw"] = df["region_raw"].str.title()'),
    ("S16-T3-B-E1", "s < 0", "s <= 0"),
    ("S16-T3-B-E2", "mask = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)", "mask = s > q3 + 1.5 * iqr"),
    ("S16-T3-B-E3", 'if domain:\n            labels.append("error")\n        elif stat:\n            labels.append("flag")',
     'if stat:\n            labels.append("flag")\n        elif domain:\n            labels.append("error")'),
    ("S16-T4-A-E1", "return [c for c in required if c not in df.columns]", 'return ["monto"]'),
    ("S16-T4-A-E2", 'df["fin"] < df["inicio"]', 'df["fin"] <= df["inicio"]'),
    ("S16-T4-A-E3", 'return "drift " + str(missing) if missing else "schema_ok"', 'return "drift" if missing else "schema_ok"'),
    ("S16-T4-B-E1", '"pass": len(quarantine) == 0', '"pass": False'),
    ("S16-T4-B-E2", 'audit.append({"event": "quarantine", "n": n})', 'audit = [{"event": "quarantine", "n": n}]'),
    ("S16-T4-B-E3", '"pass": n_q == 0', '"pass": False'),
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
        self.assertEqual({m[0] for m in MUTATIONS}, {e["id"] for e in s16()["weDo"]["steps"]})

    def test_mutations_in_stdlib_exercises(self) -> None:
        self.assertGreater(self._check(with_pandas=False), 0)

    @needs_pandas
    def test_mutations_in_pandas_exercises(self) -> None:
        self.assertGreater(self._check(with_pandas=True), 20)

    @needs_pandas
    def test_every_starter_misses_its_pin_and_every_solution_hits_it(self) -> None:
        for ex in s16()["weDo"]["steps"]:
            with self.subTest(ex["id"]):
                sol = ex["solutionCode"]
                self.assertEqual(stdout_of(sol["code"]), sol["output"].rstrip("\n"))
                done = run_py(ex["starterCode"]["code"])
                self.assertFalse(done.returncode == 0 and done.stdout.rstrip("\n") == sol["output"].rstrip("\n"),
                                 "the starter already prints the answer")

    def test_every_check_prints_more_than_one_case(self) -> None:
        """A single printed value can be typed in; every pin holds at least two results."""
        for ex in s16()["weDo"]["steps"]:
            out = ex["solutionCode"]["output"]
            with self.subTest(ex["id"]):
                self.assertTrue("\n" in out or out.startswith("["), out)

    def test_the_imputation_exercises_no_longer_fill_with_zero(self) -> None:
        for ex_id in ("S16-T1-B-E1", "S16-T1-B-E3"):
            with self.subTest(ex_id):
                self.assertNotIn("fillna(0", exercise(ex_id)["solutionCode"]["code"])
                self.assertNotIn('"monto"', exercise(ex_id)["solutionCode"]["code"], "monto is required")

    def test_independent_starters_do_not_state_the_fix(self) -> None:
        e2 = exercise("S16-T1-A-E2")
        self.assertNotIn('p == "optional"', e2["instruction"])
        self.assertNotIn("required", e2["starterCode"]["code"].split("\n")[1])
        self.assertIn("keep='first'", exercise("S16-T2-A-E1")["hints"][1])
        self.assertNotIn("(True)", exercise("S16-T2-A-E1")["hints"][1])


# ---------------------------------------------------------------------------- You Do

REFERENCE_GATE = '''
import pandas as pd

def run_quality_gate(df, schema):
    audit = [{"event": "ingest", "rows_in": len(df)}]
    drift = [c for c in schema if c not in df.columns]
    if drift:
        q = df.assign(reason="schema_drift")
        audit.append({"event": "quarantine", "n": len(q), "reason": "schema_drift"})
        return {"metrics": {"rows_in": len(df), "rows_clean": 0, "rows_quarantine": len(q),
                            "pass": False}, "quarantine": q, "audit": audit, "clean": df.iloc[0:0]}
    reason = pd.Series(None, index=df.index, dtype="object")
    for col, pol in schema.items():
        if pol == "required":
            reason = reason.mask(reason.isna() & df[col].isna(), "null_required")
    rest = reason.isna()
    extra = df.duplicated(keep="first") & rest
    reason = reason.mask(extra, "dup_exact")
    rest = reason.isna()
    conflict = df[rest].duplicated("cliente_id", keep=False).reindex(df.index, fill_value=False)
    reason = reason.mask(conflict, "dup_conflict")
    rest = reason.isna()
    reason = reason.mask(rest & ((df["monto"] < 0) | (df["monto"] > 10000)), "domain_error")
    q = df[reason.notna()].assign(reason=reason[reason.notna()])
    clean = df[reason.isna()]
    audit.append({"event": "quarantine", "n": len(q)})
    audit.append({"event": "promote", "n": len(clean)})
    return {"metrics": {"rows_in": len(df), "rows_clean": len(clean), "rows_quarantine": len(q),
                        "pass": len(q) == 0}, "quarantine": q, "audit": audit, "clean": clean}
'''


class YouDoStarterAsserts(unittest.TestCase):
    def _run(self, gate: str) -> subprocess.CompletedProcess:
        starter = s16()["youDo"]["starterCode"]
        main = starter[starter.index('if __name__ == "__main__":'):]
        return run_py(gate + "\n\n" + main)

    def test_the_starter_names_the_partition_and_the_codes(self) -> None:
        starter = s16()["youDo"]["starterCode"]
        self.assertIn('m["rows_in"] == m["rows_clean"] + m["rows_quarantine"]', starter)
        self.assertIn('m["rows_quarantine"] == 4', starter)
        self.assertIn("dup_conflict", starter)
        self.assertNotIn("rows_quarantine\"] >= 2", starter)

    @needs_pandas
    def test_a_partitioning_gate_passes_the_starter_asserts(self) -> None:
        done = self._run(REFERENCE_GATE)
        self.assertEqual(done.returncode, 0, done.stderr[-600:])
        self.assertIn("'rows_clean': 1", done.stdout)

    @needs_pandas
    def test_keep_first_on_a_conflict_fails_the_starter_asserts(self) -> None:
        wrong = REFERENCE_GATE.replace(
            'conflict = df[rest].duplicated("cliente_id", keep=False)',
            'conflict = df[rest].duplicated("cliente_id", keep="first")')
        self.assertNotEqual(wrong, REFERENCE_GATE)
        self.assertNotEqual(self._run(wrong).returncode, 0)

    @needs_pandas
    def test_filling_the_required_null_fails_the_starter_asserts(self) -> None:
        wrong = REFERENCE_GATE.replace(
            '    audit = [{"event": "ingest", "rows_in": len(df)}]',
            '    df = df.fillna({"cliente_id": "C999"})\n    audit = [{"event": "ingest", "rows_in": len(df)}]')
        self.assertNotEqual(wrong, REFERENCE_GATE)
        self.assertNotEqual(self._run(wrong).returncode, 0)


# ---------------------------------------------------------------------------- playground, PDF, figure

class OnTopicSurfaces(unittest.TestCase):
    @staticmethod
    def _playground() -> tuple[str, str]:
        text = SECTION_VIEW.read_text(encoding="utf-8")
        start = text.index("'wxpython-gui': {")
        block_ = text[start:text.index("\n    },\n", start)]
        code = re.search(r"code: `(.*?)`,\n\s+expectedOutput: `", block_, re.S).group(1)
        expected = re.search(r"expectedOutput: `(.*?)`,", block_, re.S).group(1)
        unescape = lambda s: s.replace("\\`", "`").replace("\\${", "${").replace("\\\\", "\\")
        return unescape(code), unescape(expected)

    def test_the_playground_is_a_quality_gate_and_runs_to_its_output(self) -> None:
        code, expected = self._playground()
        for word in ("wx", "GUI", "callback", "boton"):
            self.assertNotIn(word, code)
        self.assertEqual(stdout_of(code), expected.rstrip("\n"))
        self.assertIn("cuadra True", expected)

    def test_the_pdf_label_names_the_topic(self) -> None:
        text = PDF_REPORT.read_text(encoding="utf-8")
        self.assertNotIn("'16. GUI'", text)
        self.assertIn('"wxpython-gui": \'16. Calidad de datos\'', text)

    def test_the_figure_alt_describes_the_decision_tree_that_renders(self) -> None:
        alt = s16()["theory"][0]["figure"]["alt"]
        self.assertNotIn("Embudo", alt)
        for word in ("required", "cuarentena", "cap", "was_null"):
            self.assertIn(word, alt)

    def test_kpi_is_expanded_at_first_use(self) -> None:
        texts = strings(s16())
        first = next(t for t in texts if "KPI" in t)
        self.assertIn("KPI (indicadores clave", first)


# ---------------------------------------------------------------------------- exam bank and self-check

class ExamBank(unittest.TestCase):
    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_no_wxpython_leftovers_or_untaught_terms(self) -> None:
        text = " ".join(q["question"] + " " + " ".join(q["options"]) for q in bank())
        for gone in ("GUI", "wx", "fan-out", "monto_igv", "expect/assert", "expects",
                     "subset/keep policy configurada", "sensible a extremos", "El color del", "logo"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_the_drift_key_does_not_recommend_assert(self) -> None:
        q = next(q for q in bank() if q["question"].startswith("Un contrato de schema ante drift"))
        self.assertNotIn("assert", q["options"][q["correctIndex"]])
        self.assertIn("assert", " ".join(q["options"]))
        self.assertIn("-O", q["explanation"])

    def test_the_duplicated_stem_matches_its_default(self) -> None:
        q = next(q for q in bank() if q["question"].startswith("df.duplicated() sin argumentos"))
        self.assertIn("no la primera", q["options"][q["correctIndex"]])

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 150)

    def test_the_self_check_conflict_item_has_one_defensible_option(self) -> None:
        q = s16()["selfCheck"]["questions"][7]
        others = [o for i, o in enumerate(q["options"]) if i != q["correctIndex"]]
        self.assertIn("cuarentena", q["options"][q["correctIndex"]])
        self.assertTrue(all("borrar" in o or "keep='first'" in o or "seguir" in o for o in others))
        ranks = key_length_ranks(s16()["selfCheck"]["questions"])
        self.assertLessEqual(ranks.count(1), 2)


if __name__ == "__main__":
    unittest.main()
