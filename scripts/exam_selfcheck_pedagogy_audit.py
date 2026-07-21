#!/usr/bin/env python3
"""Static integrity audit for exam seed bank + section selfCheck questions."""
from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "prisma/seed.ts"
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


def parse_seed_questions(text: str) -> list[dict]:
    """Parse question objects in seed.ts with string-aware options arrays."""
    qs: list[dict] = []
    for m in re.finditer(r"\bconcept\s*:\s*", text):
        start = m.start()
        concept_got = _find_key_string(text, "concept", start, start + 80)
        if concept_got is None:
            continue
        concept, pos = concept_got
        # Bound the object: next concept or a reasonable window
        next_concept = re.search(r"\bconcept\s*:\s*", text[pos : pos + 4000])
        obj_end = pos + (next_concept.start() if next_concept else 4000)

        q_got = _find_key_string(text, "question", pos, obj_end)
        if q_got is None:
            continue
        question, pos = q_got

        opts_got = _find_key_array(text, "options", pos, obj_end)
        if opts_got is None:
            continue
        options, pos = opts_got

        ci_got = _find_key_int(text, "correctIndex", pos, obj_end)
        if ci_got is None:
            continue
        correct_index, pos = ci_got

        exp_got = _find_key_string(text, "explanation", pos, obj_end)
        explanation = exp_got[0] if exp_got else ""

        qs.append(
            {
                "concept": concept,
                "question": question[:120],
                "options": options,
                "correctIndex": correct_index,
                "explanation": explanation[:80],
            }
        )
    return qs


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


def main() -> int:
    seed_text = SEED.read_text(encoding="utf-8", errors="replace")
    qs = parse_seed_questions(seed_text)
    issues: list[dict] = []
    by_concept = Counter(q["concept"] for q in qs)
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

    # expect ~3 variants per concept typically
    thin = [c for c, n in by_concept.items() if n < 3]
    for c in thin[:50]:
        issues.append({"severity": "P2", "reason": "concept_lt_3_variants", "concept": c, "n": by_concept[c]})

    sc_issues = parse_selfchecks()
    issues.extend(sc_issues)

    p0 = [i for i in issues if i.get("severity") == "P0"]
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "seed_questions_parsed": len(qs),
        "unique_concepts": len(by_concept),
        "selfcheck_issues": len(sc_issues),
        "p0": len(p0),
        "p1": sum(1 for i in issues if i.get("severity") == "P1"),
        "issues": issues[:300],
        "ok": len(p0) == 0,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        json.dumps(
            {
                "ok": report["ok"],
                "seed_q": len(qs),
                "concepts": len(by_concept),
                "p0": len(p0),
                "p1": report["p1"],
            },
            indent=2,
        )
    )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
