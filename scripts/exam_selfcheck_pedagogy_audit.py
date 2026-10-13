#!/usr/bin/env python3
"""Static integrity audit for exam seed bank + section selfCheck questions."""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import exam_bank

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/exam_selfcheck_pedagogy_report.json"


def _skip_line_comment(text: str, i: int) -> int:
    """If at //, skip to end of line; else return i."""
    if text.startswith("//", i):
        nl = text.find("\n", i)
        return len(text) if nl < 0 else nl + 1
    return i


def _read_quoted_string(text: str, i: int) -> tuple[str, int] | None:
    """Read a '…' or \"…\" string starting at i. Returns (value, end_index)."""
    if i >= len(text) or text[i] not in ("'", '"'):
        return None
    quote = text[i]
    i += 1
    buf: list[str] = []
    while i < len(text):
        c = text[i]
        if c == "\\" and i + 1 < len(text):
            buf.append(text[i + 1])
            i += 2
            continue
        if c == quote:
            return "".join(buf), i + 1
        if c == "\n":
            # unclosed string across raw newline — abort
            return None
        buf.append(c)
        i += 1
    return None


def _extract_bracket_array(text: str, open_idx: int) -> tuple[str, int] | None:
    """Given text[open_idx] == '[', return (inner, index_after_closing_bracket)."""
    if open_idx >= len(text) or text[open_idx] != "[":
        return None
    i = open_idx + 1
    depth = 1
    start = i
    while i < len(text) and depth > 0:
        i2 = _skip_line_comment(text, i)
        if i2 != i:
            i = i2
            continue
        c = text[i]
        if c in ("'", '"'):
            got = _read_quoted_string(text, i)
            if got is None:
                return None
            i = got[1]
            continue
        if c == "[":
            depth += 1
            i += 1
            continue
        if c == "]":
            depth -= 1
            if depth == 0:
                return text[start:i], i + 1
            i += 1
            continue
        i += 1
    return None


def parse_string_array_elements(array_inner: str) -> list[str]:
    """Parse top-level quoted string elements from a TS/JS array body."""
    options: list[str] = []
    i = 0
    n = len(array_inner)
    while i < n:
        i2 = _skip_line_comment(array_inner, i)
        if i2 != i:
            i = i2
            continue
        c = array_inner[i]
        if c in ("'", '"'):
            got = _read_quoted_string(array_inner, i)
            if got is None:
                break
            options.append(got[0])
            i = got[1]
            continue
        i += 1
    return options


def _find_key_string(text: str, key: str, start: int, end: int | None = None) -> tuple[str, int] | None:
    """Find `key: '…'` or `key: "…"` after start; return (value, end_index)."""
    limit = end if end is not None else len(text)
    m = re.search(rf"\b{re.escape(key)}\s*:\s*", text[start:limit])
    if not m:
        return None
    i = start + m.end()
    while i < limit and text[i] in " \t\n\r":
        i += 1
    got = _read_quoted_string(text, i)
    if got is None:
        return None
    return got[0], got[1]


def _find_key_array(text: str, key: str, start: int, end: int | None = None) -> tuple[list[str], int] | None:
    """Find `key: […]` after start; return (elements, end_index)."""
    limit = end if end is not None else len(text)
    m = re.search(rf"\b{re.escape(key)}\s*:\s*", text[start:limit])
    if not m:
        return None
    i = start + m.end()
    while i < limit and text[i] in " \t\n\r":
        i += 1
    if i >= limit or text[i] != "[":
        return None
    extracted = _extract_bracket_array(text, i)
    if extracted is None:
        return None
    inner, end_i = extracted
    return parse_string_array_elements(inner), end_i


def _find_key_int(text: str, key: str, start: int, end: int | None = None) -> tuple[int, int] | None:
    limit = end if end is not None else len(text)
    m = re.search(rf"\b{re.escape(key)}\s*:\s*(\d+)", text[start:limit])
    if not m:
        return None
    return int(m.group(1)), start + m.end()


def parse_selfchecks() -> list[dict]:
    """Parse selfCheck (and quiz-like) question blocks in section files."""
    issues: list[dict] = []
    for path in sorted(SECTIONS.glob("s*.ts")):
        text = path.read_text(encoding="utf-8", errors="replace")
        sid_m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text)
        sid = sid_m.group(1) if sid_m else path.stem

        # Prefer selfCheck blocks; fall back to whole file question patterns
        blocks: list[str] = []
        for sc in re.finditer(r"\bselfCheck\s*:\s*\{", text):
            # grab until matching depth of braces roughly by next top-level sibling is hard;
            # take a large window that usually covers the questions array
            window = text[sc.start() : sc.start() + 12000]
            blocks.append(window)
        if not blocks:
            blocks = [text]

        for block in blocks:
            for m in re.finditer(r"\bquestion\s*:\s*", block):
                start = m.start()
                q_got = _find_key_string(block, "question", start, start + 500)
                if q_got is None:
                    continue
                question, pos = q_got

                # Next question bound
                next_q = re.search(r"\bquestion\s*:\s*", block[pos : pos + 2500])
                obj_end = pos + (next_q.start() if next_q else 2500)

                opts_got = _find_key_array(block, "options", pos, obj_end)
                if opts_got is None:
                    continue
                opts, pos = opts_got

                ci_got = _find_key_int(block, "correctIndex", pos, obj_end)
                if ci_got is None:
                    continue
                ci = ci_got[0]

                if ci < 0 or ci >= len(opts):
                    issues.append(
                        {
                            "section": sid,
                            "severity": "P0",
                            "reason": "correctIndex_out_of_range",
                            "question": question[:80],
                            "correctIndex": ci,
                            "n_options": len(opts),
                        }
                    )
                if len(opts) < 2:
                    issues.append(
                        {
                            "section": sid,
                            "severity": "P1",
                            "reason": "too_few_options",
                            "question": question[:80],
                        }
                    )
                if len(opts) != len(set(opts)):
                    issues.append(
                        {
                            "section": sid,
                            "severity": "P1",
                            "reason": "duplicate_options",
                            "question": question[:80],
                        }
                    )
    return issues


def flatten(banks: list[dict]) -> list[dict]:
    return [q for bank in banks for q in bank["questions"]]


def question_issues(qs: list[dict]) -> list[dict]:
    """Per-question structure: a key in range, two or more options, no repeated option, and an
    explanation."""
    issues: list[dict] = []
    for q in qs:
        n = len(q["options"])
        if q["correctIndex"] < 0 or q["correctIndex"] >= n:
            issues.append(
                {
                    "severity": "P0",
                    "reason": "seed_correctIndex_oor",
                    "concept": q["concept"],
                    "correctIndex": q["correctIndex"],
                    "n_options": n,
                    "question": q["question"][:80],
                }
            )
        if n < 2:
            issues.append({"severity": "P1", "reason": "seed_few_options", "concept": q["concept"]})
        if len(q["options"]) != len(set(q["options"])):
            issues.append({"severity": "P1", "reason": "seed_dup_options", "concept": q["concept"]})
        if not q["explanation"].strip():
            issues.append({"severity": "P1", "reason": "empty_explanation", "concept": q["concept"]})
    return issues


def concept_variant_issues(qs: list[dict]) -> list[dict]:
    """P2 for each concept with fewer than three variants. Every concept is reported."""
    counts = Counter(q["concept"] for q in qs)
    return [
        {"severity": "P2", "reason": "concept_lt_3_variants", "concept": concept, "n": n}
        for concept, n in counts.items()
        if n < 3
    ]


#: Pearson chi-square critical value: 4 key positions, 3 degrees of freedom, alpha 0.001.
KEY_POSITION_CHI2_CRITICAL = 16.27


def chi_square_equal(counts: list[int]) -> float:
    """Pearson chi-square of observed counts against equal expected counts."""
    total = sum(counts)
    if total == 0:
        return 0.0
    expected = total / len(counts)
    return sum((observed - expected) ** 2 / expected for observed in counts)


def key_position_issues(banks: list[dict]) -> list[dict]:
    """P1 for a bank whose key sits in some of the four positions more often than chance allows.

    The rule is the item-writing one to "vary the location of the right answer" (Haladyna, Downing
    & Rodriguez 2002), and key-position bias is a measurable property of an item set (Attali &
    Bar-Hillel 2003).

    It reads the exam banks of prisma/seed.ts and nothing else: the section self-checks come through
    parse_selfchecks and get no position check. Exam options are shuffled per attempt since #91 and
    self-check options since #90, so a stored position reaches a learner on neither path. A finding
    is a record of what the stored bank looks like, not a learner-facing defect; it would matter to
    any use that read a bank without the shuffle.
    """
    issues: list[dict] = []
    for bank in banks:
        positions = Counter(q["correctIndex"] for q in bank["questions"] if 0 <= q["correctIndex"] < 4)
        stat = chi_square_equal([positions.get(i, 0) for i in range(4)])
        if stat > KEY_POSITION_CHI2_CRITICAL:
            issues.append({
                "severity": "P1",
                "reason": "key_position_imbalanced",
                "bank": bank["slug"],
                "counts": dict(sorted(positions.items())),
                "chi_square": round(stat, 2),
                "critical": KEY_POSITION_CHI2_CRITICAL,
                "n": sum(positions.values()),
            })
    return issues


#: An option whose whole meaning is a pointer to other options, so the per-attempt shuffle would make
#: it point at the wrong text. It is anchored to the start of the option; a phrase inside a sentence
#: is ordinary Spanish or notation ("una alternativa a pandas", "los grupos A y B"), and P0 blocks CI.
#: Three forms:
#:   - "todas las anteriores" / "ninguna de las anteriores", exactly or at the start;
#:   - "opción A" / "alternativa B" (with an optional "la" or "lo"), exactly or at the start. The letter
#:     is upper case, so the preposition in "alternativa a pandas" or "opción a corto plazo" is not option A;
#:   - "A y B", "A o B", "solo A y B", "tanto A como B", optionally followed by "son correctas": the
#:     WHOLE option. Any other text after "A y B" makes it a statement about sets, events or groups
#:     ("A y B son independientes"), which the statistics sections use.
#: Residual ambiguity, accepted: an option that is only "A y B" in a question about events named A and B
#: is flagged; write the option out ("Los eventos A y B") to clear it.
POSITION_REFERENCE = re.compile(
    r"^\s*(?:"
    r"(?i:(?:todas|ninguna\s+de)\s+las\s+anteriores)\b"
    r"|(?i:(?:la\s+|lo\s+)?(?:opci[oó]n|alternativa))\s+(?-i:[A-D])\b"
    r"|(?i:(?:solo\s+|tanto\s+)?)(?-i:[A-D])\s+(?i:y|o|como)\s+(?-i:[A-D])"
    r"(?i:\s+son\s+(?:correctas|ciertas|verdaderas))?\W*$"
    r")"
)


def position_reference_issues(banks: list[dict]) -> list[dict]:
    """P0 for an option that names another option. None exist in the seed today; the check keeps
    it that way, because the per-attempt shuffle would make the reference point at the wrong text."""
    issues: list[dict] = []
    for bank in banks:
        for q in bank["questions"]:
            for option in q["options"]:
                found = POSITION_REFERENCE.search(option)
                if found:
                    issues.append({
                        "severity": "P0",
                        "reason": "option_names_another_option",
                        "bank": bank["slug"],
                        "concept": q["concept"],
                        "matched": found.group(0),
                        "option": option[:80],
                    })
    return issues


#: A bank is a stand-in when at least this many of the four signals hold (A5).
STAND_IN_SIGNALS_NEEDED = 2
_TEMPLATE_STEM = re.compile(r"^\[S\d{2}/[A-C]\]")
_QUOTED_TERM = re.compile(r"«[^»]*»")


def _key_text(q: dict) -> str:
    options = q["options"]
    return options[q["correctIndex"]] if 0 <= q["correctIndex"] < len(options) else ""


def stand_in_signals(bank: dict) -> dict[str, bool]:
    """The four signals of a bank written from one template rather than item by item (A5).

    templated_stems: a stem carries a template label such as [S12/A], or the stems are one sentence
        once the quoted term is masked (at most two distinct).
    few_distinct_options: under half the option texts are distinct. The S12/S13 stand-ins measure
        0.11; every other bank measures 0.98 or more.
    slug_in_key: the item's own hyphenated concept slug appears in its key, in at least half the items.
    explanations_per_concept: no more distinct explanations than concepts, so one is shared per concept.
    """
    qs = bank["questions"]
    stems = [q["question"] for q in qs]
    masked = {_QUOTED_TERM.sub("«»", s) for s in stems}
    options = [o for q in qs for o in q["options"]]
    slug_keys = sum(1 for q in qs if "-" in q["concept"] and q["concept"] in _key_text(q))
    return {
        "templated_stems": any(_TEMPLATE_STEM.match(s) for s in stems) or len(masked) <= 2,
        "few_distinct_options": len(set(options)) < len(options) / 2,
        "slug_in_key": bool(qs) and slug_keys * 2 >= len(qs),
        "explanations_per_concept": len({q["explanation"] for q in qs}) <= len({q["concept"] for q in qs}),
    }


def is_stand_in(bank: dict) -> bool:
    return sum(stand_in_signals(bank).values()) >= STAND_IN_SIGNALS_NEEDED


def stand_in_issues(banks: list[dict]) -> list[dict]:
    """P1 for a bank that reads as one template with the content swapped in. A learner can pass it by
    recognising the template, without the concept it is meant to test."""
    return [
        {
            "severity": "P1",
            "reason": "stand_in_bank",
            "bank": bank["slug"],
            "signals": sorted(name for name, held in stand_in_signals(bank).items() if held),
        }
        for bank in banks
        if is_stand_in(bank)
    ]


def build_report(qs: list[dict], issues: list[dict], selfcheck_issues: int, generated_at: str) -> dict:
    """Every issue, with counts by severity and by reason. Nothing is cut: a report that keeps the
    first 300 issues hides the 301st with no sign that it exists."""
    p0 = [i for i in issues if i["severity"] == "P0"]
    return {
        "generated_at": generated_at,
        "seed_questions_parsed": len(qs),
        "unique_concepts": len({q["concept"] for q in qs}),
        "selfcheck_issues": selfcheck_issues,
        "p0": len(p0),
        "p1": sum(1 for i in issues if i["severity"] == "P1"),
        "counts": {
            "by_severity": dict(sorted(Counter(i["severity"] for i in issues).items())),
            "by_reason": dict(sorted(Counter(i["reason"] for i in issues).items())),
        },
        "issues": issues,
        "ok": not p0,
    }


def parse_args(argv: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit the exam banks and the section self-checks.")
    parser.add_argument(
        "--out", type=Path, default=OUT,
        help="where to write the report (default: the tracked course-state report; tests pass a temp path)",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Audit every bank of the exam seed, read through scripts/exam_bank.py (the TypeScript parser),
    and the section self-checks. The regex reader this replaced could not see a key's quote style,
    and it turned an escaped newline inside one question into a plain letter. Exit 1 on any P0."""
    args = parse_args(argv)
    banks = exam_bank.load_banks()
    qs = flatten(banks)
    sc_issues = parse_selfchecks()
    issues = [
        *question_issues(qs),
        *concept_variant_issues(qs),
        *key_position_issues(banks),
        *position_reference_issues(banks),
        *stand_in_issues(banks),
        *sc_issues,
    ]
    report = build_report(qs, issues, len(sc_issues), datetime.now(timezone.utc).isoformat())
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        json.dumps(
            {
                "ok": report["ok"],
                "seed_q": report["seed_questions_parsed"],
                "concepts": report["unique_concepts"],
                "p0": report["p0"],
                "p1": report["p1"],
            },
            indent=2,
        )
    )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
