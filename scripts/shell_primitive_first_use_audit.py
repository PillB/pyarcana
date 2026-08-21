#!/usr/bin/env python3
"""Gate: shell primitives must be explained in prose before a learner must type them.

The zero-prerequisite baseline grants no terminal knowledge, so an operator that
appears only inside a demo, a starter file or a hint is something the learner can
copy but not understand. This audit walks the cumulative learner-visible packet in
display order and reports every shell primitive that a section requires in code
without ever defining it in learner-visible prose.

Absence of a definition is decisive; presence of one is necessary, not sufficient.
Pair this gate with learner evidence before concluding that a concept is taught.

Usage:
    python3 scripts/shell_primitive_first_use_audit.py [--sections 1 2 3] [--json]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from newbie_packet_builder import build_packet  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "course-state/shell_primitive_first_use_report.json"

# (id, pattern in learner-visible CODE, patterns that count as a prose definition)
PRIMITIVES = [
    ("redirect_write", r">(?![>=])", [r"redirecci[oó]n", r"redirig", r"\bguarda(?:r)?\s+la\s+salida", r"env[ií]a\s+la\s+salida"]),
    ("redirect_append", r">>", [r"a[ñn]ad(?:e|ir)\s+al\s+final", r"\bappend\b", r"redirecci[oó]n", r"sin\s+borrar\s+lo\s+anterior"]),
    ("pipe", r"(?<![|>&])\|(?!\|)", [r"tuber[ií]a", r"\bpipe\b", r"encadena(?:r)?\s+comandos", r"pasa\s+la\s+salida"]),
    ("or_else", r"\|\|", [r"\bo si falla\b", r"si el primero falla", r"operador\s+`?\|\|`?"]),
    ("and_then", r"&&", [r"solo si (?:el anterior )?tuvo [ée]xito", r"encadena.*[ée]xito", r"operador\s+`?&&`?"]),
    ("discard_stderr", r"2>\s*/dev/null", [r"silencia(?:r)? (?:los )?errores", r"descarta.*error", r"/dev/null"]),
    ("grep", r"\bgrep\b", [r"\bgrep\b[^.\n]{0,80}(?:busca|filtra|encuentra)", r"(?:busca|filtra)[^.\n]{0,80}\bgrep\b"]),
    ("head", r"\bhead\b", [r"\bhead\b[^.\n]{0,80}(?:primeras|primeros)", r"(?:primeras|primeros)[^.\n]{0,80}\bhead\b"]),
    ("mkdir", r"\bmkdir\b", [r"\bmkdir\b[^.\n]{0,80}(?:crea|carpeta|directorio)", r"crea[^.\n]{0,60}\bmkdir\b"]),
    ("rm_recursive", r"\brm\s+-rf\b", [r"\brm\s+-rf\b[^.\n]{0,80}(?:borra|elimina)", r"(?:borra|elimina)[^.\n]{0,80}\brm\s+-rf\b"]),
    ("which_where", r"\b(?:which|where)\b", [r"\b(?:which|where)\b[^.\n]{0,80}(?:d[oó]nde|ubica|ruta)", r"d[oó]nde[^.\n]{0,60}\b(?:which|where)\b"]),
]

CODE_FIELDS_NOTE = (
    "shell-language blocks only: iDo.steps[].code where language=bash, plus "
    "theory.code / weDo.exercises[].starterCode / youDo.starterCode that the "
    "shell-block classifier accepts. Python blocks are excluded."
)

# Commands that mark a block as a terminal transcript rather than Python source.
SHELL_MARKERS = re.compile(
    r"^\s*\$?\s*(python3?|py|pip|pip3|git|gh|cd|mkdir|rmdir|rm|ls|dir|cat|echo|source|"
    r"which|where|ruff|pytest|deactivate|export|set|touch|mv|cp|code|curl|type)\b",
    re.M,
)
# Syntax that only appears in Python source.
PYTHON_MARKERS = re.compile(r"^\s*(def |class |import |from \w+ import|@|\s*return )", re.M)


def _strings(value) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [item for entry in value for item in _strings(entry)]
    return []


def is_shell_block(code: str, language: str | None) -> bool:
    """Only terminal transcripts can teach or hide a shell operator."""
    if language:
        return language.lower() in {"bash", "sh", "zsh", "shell", "powershell", "console"}
    if not code or not SHELL_MARKERS.search(code):
        return False
    return not PYTHON_MARKERS.search(code)


def strip_shell_comments(code: str) -> str:
    """Drop comment text so narrated REPL output is not read as live shell syntax."""
    lines = []
    for line in code.splitlines():
        stripped = line.split("#", 1)[0] if not line.lstrip().startswith("#") else ""
        lines.append(stripped)
    return "\n".join(lines)


def section_surfaces(section: dict) -> tuple[str, str]:
    """Split one section's learner-visible content into (prose, shell_code)."""
    prose, code = [], []

    def add_code(text: str | None, language: str | None = None) -> None:
        if text and is_shell_block(text, language):
            code.append(strip_shell_comments(text))

    for block in section.get("theory", []) or []:
        prose.append(block.get("heading") or "")
        prose += _strings(block.get("paragraphs"))
        add_code(block.get("code"))
        add_code(block.get("code_output"))
    for step in (section.get("iDo", {}) or {}).get("steps", []) or []:
        for field in ("description", "why"):
            prose += _strings(step.get(field))
        add_code(step.get("code"), step.get("language"))
        add_code(step.get("output"), step.get("language"))
    for exercise in (section.get("weDo", {}) or {}).get("exercises", []) or []:
        for field in ("preamble", "instruction", "tests"):
            prose += _strings(exercise.get(field))
        prose += _strings(exercise.get("hints"))
        prose += _strings(exercise.get("edgeCases"))
        add_code(exercise.get("starterCode"))
    youdo = section.get("youDo", {}) or {}
    for field in ("context", "title", "portfolioNote"):
        prose += _strings(youdo.get(field))
    prose += _strings(youdo.get("requirements"))
    prose += _strings(youdo.get("objectives"))
    add_code(youdo.get("starterCode"))
    for stem in section.get("selfCheck_stems", []) or []:
        prose += _strings(stem.get("question"))
        prose += _strings(stem.get("options"))
    prose += _strings(section.get("jobRelevance"))
    for outcome in section.get("learningOutcomes", []) or []:
        prose += _strings(outcome if isinstance(outcome, str) else outcome.get("text"))
    return "\n".join(p for p in prose if p), "\n".join(code)


def audit_section(index: int) -> dict:
    packet = build_packet(index, attempt_id=f"shell-first-use-s{index:02d}")
    active = packet["active"]

    # Everything the learner could have been taught up to and including this section.
    cumulative_prose = []
    for prior in packet.get("prior_sections", []) or []:
        cumulative_prose.append(section_surfaces(prior)[0])
    active_prose, active_code = section_surfaces(active)
    cumulative_prose.append(active_prose)
    prose = "\n".join(cumulative_prose)

    issues = []
    for primitive_id, code_pattern, definition_patterns in PRIMITIVES:
        uses = len(re.findall(code_pattern, active_code))
        if not uses:
            continue
        defined = any(re.search(pattern, prose, re.I) for pattern in definition_patterns)
        if not defined:
            sample = ""
            match = re.search(r"^.*" + code_pattern + r".*$", active_code, re.M)
            if match:
                sample = match.group(0).strip()[:120]
            issues.append({
                "primitive": primitive_id,
                "uses_in_learner_code": uses,
                "defined_in_learner_prose": False,
                "severity": "P1",
                "sample_line": sample,
            })
    return {
        "section_index": index,
        "section_id": active["id"],
        "issues": issues,
        "ok": not issues,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sections", nargs="*", type=int, default=None)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    indexes = args.sections if args.sections else list(range(1, 53))
    results = [audit_section(index) for index in indexes]
    total = sum(len(result["issues"]) for result in results)
    report = {
        "schema_version": 1,
        "scope": "curriculum_audit",
        "gate": "shell_primitive_first_use",
        "code_fields": CODE_FIELDS_NOTE,
        "sections_audited": len(results),
        "unexplained_primitive_count": total,
        "ok": total == 0,
        "results": [result for result in results if result["issues"]],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if args.json:
        json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
    else:
        for result in results:
            for issue in result["issues"]:
                print(
                    f"{result['section_id']:>22}  {issue['primitive']:<16} "
                    f"uses={issue['uses_in_learner_code']:<3} {issue['sample_line']}"
                )
        print(f"\nsections={len(results)} unexplained={total} ok={report['ok']}")
    return 0 if total == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
