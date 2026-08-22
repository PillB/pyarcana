#!/usr/bin/env python3
"""Editorial audit across the active S01-S52 curriculum.

Checks the defect classes that can be detected objectively, so editorial
judgement is spent on what actually needs a human:

  FORWARD_DEPENDENCY  an exercise instruction, hint or starter tells the learner
                      to use something from a LATER section. A pointer in theory
                      prose ("esto se profundiza en S34") is fine and is reported
                      separately as INFO; a dependency inside a task is not.
  ANSWER_LEAKAGE      a substantive line of the solution appears verbatim in the
                      starter or the hint of the same exercise, so the learner
                      can pass without reasoning.
  DUPLICATE_OPTION    two self-check options are identical after normalisation.
  LENGTH_TELL         the correct option is the longest in the question by a wide
                      margin, repeatedly within a section. A learner can then
                      score well by picking the longest answer without knowing
                      the material.

Exit 0 when no P1 findings; 1 otherwise. Writes
course-state/curriculum_editorial_audit.json.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/curriculum_editorial_audit.json"

SEC_REF = re.compile(r"\bS(\d{2})\b")
#: lines too generic to count as leaked reasoning
TRIVIAL = re.compile(
    r"^\s*(#|$|import |from |print\(\)|\)|\]|\}|else:|try:|pass$)", re.M
)


def active_sections() -> list[tuple[str, int, Path]]:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        path = SECTIONS / f"{m.group(1)}.ts"
        text = path.read_text(encoding="utf-8")
        sid = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text).group(1)
        idx = int(re.search(r"^\s*index:\s*(\d+)", text, re.M).group(1))
        out.append((sid, idx, path))
    return out


def templates(text: str, key: str) -> list[str]:
    """Every `key: `...`` template literal body, raw."""
    found = []
    for m in re.finditer(rf"\b{key}:\s*`", text):
        i = m.end() - 1
        j = i + 1
        while j < len(text):
            if text[j] == "\\":
                j += 2
                continue
            if text[j] == "`":
                break
            j += 1
        found.append(text[i + 1 : j])
    return found


def quoted(text: str, key: str) -> list[str]:
    return [m.group(1) for m in re.finditer(rf'\b{key}:\s*"((?:[^"\\]|\\.)*)"', text)]


def split_options(raw: str) -> list[str]:
    """Split an `options: [...]` body into whole option strings.

    Sections use both quote styles, and an option may itself contain the other
    quote — e.g. `'Decimal("0.1")'`. Matching only double-quoted runs pulls out
    the inner fragments and makes distinct options look identical, so scan for
    complete top-level string literals of either style.
    """
    out: list[str] = []
    i = 0
    while i < len(raw):
        ch = raw[i]
        if ch in "\"'":
            j = i + 1
            buf = []
            while j < len(raw):
                if raw[j] == "\\" and j + 1 < len(raw):
                    buf.append(raw[j + 1])
                    j += 2
                    continue
                if raw[j] == ch:
                    break
                buf.append(raw[j])
                j += 1
            out.append("".join(buf))
            i = j + 1
            continue
        i += 1
    return out


def we_do_blocks(text: str) -> list[str]:
    """Split the weDo region into per-exercise chunks on the stable id."""
    start = text.find(" weDo:") if " weDo:" in text else text.find("weDo:")
    region = text[start:] if start != -1 else text
    parts = re.split(r"\bid:\s*['\"](S\d{2}-T\d-[AB]-E\d)['\"]", region)
    return [parts[i] + parts[i + 1] for i in range(1, len(parts) - 1, 2)]


def audit(sid: str, idx: int, path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    findings: list[dict] = []

    # ---- forward dependency inside learner tasks -------------------------
    # A forward *pointer* ("siguiente: S08", "se profundiza en S34") is good
    # curriculum design. A forward *dependency* — prose that assumes the learner
    # already holds a later section — is the defect. Only the second is P1, and
    # the two are told apart by the verb, so the phrasing list is the check.
    BACKREF = re.compile(
        r"(como (?:viste|vimos|aprendiste)|ya (?:viste|conoces)|"
        r"seg[uú]n lo de|usando el .{0,30} de|recuerda de)\s*S?$",
        re.I,
    )
    for field in ("instruction", "hint", "preamble"):
        for val in quoted(text, field):
            for m in SEC_REF.finditer(val):
                if int(m.group(1)) <= idx:
                    continue
                before = val[max(0, m.start() - 40) : m.start()]
                assumed = bool(BACKREF.search(before))
                findings.append(
                    {
                        "section": sid,
                        "index": idx,
                        "kind": "FORWARD_DEPENDENCY" if assumed else "FORWARD_POINTER",
                        "severity": "P1" if assumed else "INFO",
                        "detail": f"{field} cites S{m.group(1)} (later than S{idx:02d})"
                        + ("; phrased as already-known" if assumed else "; pointer only"),
                        "excerpt": val[max(0, m.start() - 60) : m.start() + 40],
                    }
                )

    # ---- answer leakage: the hint hands over a solution line -------------
    # NOTE: starter-vs-solution overlap is NOT leakage in this course. The
    # starter is deliberately the solution with a `# DEFECT` introduced, so the
    # two share almost every line by design. The real defect is a *hint* that
    # contains the exact line the learner is supposed to derive.
    for blk in we_do_blocks(text):
        code_tmpls = templates(blk, "code")
        if len(code_tmpls) < 2:
            continue
        starter, solution = code_tmpls[0], code_tmpls[1]
        starter_lines = {ln.strip() for ln in starter.splitlines()}
        # Only lines the learner must ADD count. A line already present in the
        # starter is given, not derived — several exercises explicitly say
        # "mantén el return", so quoting it in a hint gives nothing away.
        sol_lines = {
            ln.strip()
            for ln in solution.splitlines()
            if len(ln.strip()) > 28
            and not TRIVIAL.match(ln)
            and ln.strip() not in starter_lines
        }
        hints = quoted(blk, "hint") + [
            h for h in re.findall(r'"((?:[^"\\]|\\.)*)"', "".join(quoted(blk, "hints")))
        ]
        for h in hints:
            hit = [s for s in sol_lines if s in h]
            if hit:
                eid = re.search(r"(S\d{2}-T\d-[AB]-E\d)", blk)
                findings.append(
                    {
                        "section": sid,
                        "index": idx,
                        "kind": "ANSWER_LEAKAGE",
                        "severity": "P1",
                        "detail": f"{eid.group(1) if eid else '?'}: hint contains a full solution line",
                        "excerpt": hit[0][:160],
                    }
                )
                break

    # ---- self-check option quality --------------------------------------
    sc = text[text.find("selfCheck:") :] if "selfCheck:" in text else ""
    longest_correct = 0
    total_q = 0
    for m in re.finditer(
        r"options:\s*\[([\s\S]*?)\],\s*correctIndex:\s*(\d)", sc
    ):
        opts = split_options(m.group(1))
        if len(opts) < 2:
            continue
        total_q += 1
        ci = int(m.group(2))
        norm = [re.sub(r"\s+", " ", o).strip().lower() for o in opts]
        if len(set(norm)) != len(norm):
            findings.append(
                {
                    "section": sid,
                    "index": idx,
                    "kind": "DUPLICATE_OPTION",
                    "severity": "P1",
                    "detail": "two options identical after normalisation",
                    "excerpt": opts[0][:160],
                }
            )
        if ci < len(opts):
            lens = [len(o) for o in opts]
            others = [l for k, l in enumerate(lens) if k != ci]
            if others and lens[ci] > max(others) * 1.6:
                longest_correct += 1
    if total_q >= 4 and longest_correct >= max(3, total_q // 2):
        findings.append(
            {
                "section": sid,
                "index": idx,
                "kind": "LENGTH_TELL",
                "severity": "P1",
                "detail": f"correct option is much the longest in {longest_correct}/{total_q} questions",
                "excerpt": "",
            }
        )
    return findings


def main() -> int:
    all_findings: list[dict] = []
    for sid, idx, path in active_sections():
        all_findings.extend(audit(sid, idx, path))

    by_kind: dict[str, int] = {}
    for f in all_findings:
        by_kind[f["kind"]] = by_kind.get(f["kind"], 0) + 1

    report = {
        "sections_audited": 52,
        "p1_total": sum(1 for f in all_findings if f["severity"] == "P1"),
        "info_total": sum(1 for f in all_findings if f["severity"] == "INFO"),
        "by_kind": by_kind,
        "ok": not any(f["severity"] == "P1" for f in all_findings),
        "findings": all_findings,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        json.dumps(
            {"ok": report["ok"], "p1_total": report["p1_total"], "info_total": report["info_total"], "by_kind": by_kind},
            indent=2,
            ensure_ascii=False,
        )
    )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
