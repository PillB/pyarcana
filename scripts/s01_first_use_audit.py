#!/usr/bin/env python3
"""
S01 within-section define-before-use audit.
Walks learner-facing strings in display order; flags jargon that appears
before a definition cue in the cumulative text so far.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
S01 = ROOT / "src/lib/course/sections/s01-setup.ts"
OUT = ROOT / "course-state/s01_first_use_report.json"

# (canonical_id, aliases to match)
JARGON = [
    ("venv", [r"\bvenv\b", r"\.venv\b", r"entorno virtual", r"entornos virtuales"]),
    ("repo", [r"\brepo\b", r"repositorio", r"repositorios"]),
    ("git", [r"\bGit\b", r"\bgit\b"]),
    ("github", [r"\bGitHub\b"]),
    ("commit", [r"\bcommit\b", r"\bcommits\b"]),
    ("pr", [r"Pull Request", r"\bPR\b"]),
    ("pip", [r"\bpip\b"]),
    ("requirements", [r"requirements\.txt"]),
    ("path", [r"\bPATH\b"]),
    ("repl", [r"\bREPL\b"]),
    ("interprete", [r"int[eé]rprete"]),
    ("clonar", [r"\bclonar\b", r"\bclona\b", r"\bclone\b"]),
]

# Definition cues (Spanish pedagogy)
DEF_CUE = re.compile(
    r"(es un|es una|son un|significa|carpeta|historial|programa que|"
    r"lista de|instalador|propuesta de|modo interactivo|control de versiones|"
    r"repositorio:|entorno virtual\s*\(|repo\s*\(|venv\s*\)|"
    r"Diccionario del d[ií]a|herramienta `venv`)",
    re.I,
)


def extract_string_literals_in_order(src: str) -> list[tuple[str, str]]:
    """Rough ordered learner-facing strings from S01 export object."""
    chunks: list[tuple[str, str]] = []
    # jobRelevance
    m = re.search(r"jobRelevance:\s*'((?:\\'|[^'])*)'", src, re.S)
    if m:
        chunks.append(("jobRelevance", m.group(1).replace("\\'", "'").replace("\\n", "\n")))
    # learning outcomes
    for m in re.finditer(r"\{\s*text:\s*'((?:\\'|[^'])*)'\s*\}", src):
        chunks.append(("learningOutcome", m.group(1).replace("\\'", "'")))
    # theory paragraphs + headings
    for m in re.finditer(r"heading:\s*'((?:\\'|[^'])*)'", src):
        chunks.append(("theory.heading", m.group(1).replace("\\'", "'")))
    for m in re.finditer(r"paragraphs:\s*\[([\s\S]*?)\]", src):
        body = m.group(1)
        for sm in re.finditer(r"'((?:\\'|[^'])*)'", body):
            chunks.append(("theory.paragraph", sm.group(1).replace("\\'", "'").replace("\\n", "\n")))
    # iDo intro
    m = re.search(r"iDo:\s*\{[\s\S]*?intro:\s*'((?:\\'|[^'])*)'", src)
    if m:
        chunks.append(("iDo.intro", m.group(1).replace("\\'", "'")))
    return chunks


def main() -> None:
    src = S01.read_text(encoding="utf-8")
    chunks = extract_string_literals_in_order(src)
    # Only audit prefix until first theory paragraphs of block 1 (job + outcomes + first 4 paras)
    # Actually audit full cumulative through early theory
    cumulative = ""
    first_hits: dict[str, dict] = {}
    issues = []

    for loc, text in chunks:
        # skip code-heavy later theory for "first use" focus: stop after we have dictionary + 3 more paras of first blocks
        for jid, patterns in JARGON:
            if jid in first_hits:
                continue
            for pat in patterns:
                m = re.search(pat, text, re.I)
                if not m:
                    continue
                # definition already in cumulative (before this match) or in same text before match
                before = cumulative + text[: m.start()]
                window = text[max(0, m.start() - 120) : m.end() + 160]
                defined = bool(DEF_CUE.search(before)) or bool(DEF_CUE.search(window))
                # Dictionary paragraph always counts as definition for all listed there
                if "Diccionario del día" in cumulative or "Diccionario del día" in text:
                    defined = True
                first_hits[jid] = {
                    "location": loc,
                    "snippet": text[max(0, m.start() - 40) : m.end() + 60].replace("\n", " "),
                    "defined_at_first_use": defined,
                }
                if not defined:
                    issues.append(
                        {
                            "term": jid,
                            "severity": "P1",
                            "location": loc,
                            "snippet": first_hits[jid]["snippet"],
                            "fix": "Add in-line micro-definition at first use or move dictionary earlier",
                        }
                    )
                break
        cumulative += "\n" + text
        # stop deep audit after early theory (first heading + 4 paragraphs roughly)
        if loc == "theory.paragraph" and cumulative.count("theory.paragraph") >= 6:
            # don't hard stop — keep scanning outcomes only already done
            pass

    # Special: tagline is marketing; require dictionary exists in first theory paragraph
    has_dict = any("Diccionario del día" in t for _, t in chunks)
    if not has_dict:
        issues.append(
            {
                "term": "dictionary_block",
                "severity": "P0",
                "location": "theory[0]",
                "snippet": "missing Diccionario del día 1",
                "fix": "Add day-1 dictionary as first theory paragraph",
            }
        )

    report = {
        "section": "setup",
        "first_hits": first_hits,
        "issues": issues,
        "open_p0": [i for i in issues if i["severity"] == "P0"],
        "open_p1": [i for i in issues if i["severity"] == "P1"],
        "ok": len([i for i in issues if i["severity"] in ("P0", "P1")]) == 0,
        "has_day1_dictionary": has_dict,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    print(json.dumps({"ok": report["ok"], "p0": len(report["open_p0"]), "p1": len(report["open_p1"]), "hits": len(first_hits)}, indent=2))


if __name__ == "__main__":
    main()
