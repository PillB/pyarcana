#!/usr/bin/env python3
"""
S01 within-section define-before-use audit.
Walks learner-facing strings in display order; flags jargon that appears
before a definition cue in the cumulative text so far.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
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
    ("stdout", [r"\bstdout\b"]),
    ("stderr", [r"\bstderr\b"]),
]

# A term's definition must match that *term*, not any unrelated earlier "es una"
# in the cumulative text. Each pattern is a minimal independently reviewable
# first-use contract, not a claim that keyword matching proves all pedagogy.
DEFINITION_PATTERNS = {
    "venv": r"entorno virtual.{0,35}(?:venv)?.{0,35}(?:directorio|carpeta|aislad)|venv.{0,80}(?:directorio|carpeta|aislad)",
    "repo": r"repositorio.{0,35}carpeta.{0,30}historial|carpeta.{0,60}repositorio",
    "git": r"Git.{0,15}(?:sistema|historial)",
    "github": r"GitHub.{0,35}(?:sitio web|aloja|servidor|compart)",
    "commit": r"commit.{0,32}(?:punto guardado|historial|guarda)|punto guardado.{0,80}commit",
    "pr": r"(?:Pull Request|PR).{0,35}(?:propuesta|revisar|revisión)",
    "pip": r"pip.{0,20}(?:instalador|instala paquetes)",
    "requirements": r"requirements\.txt.{0,45}(?:lista|paquetes|versiones)",
    "path": r"PATH.{0,50}(?:d[oó]nde|busca programas|busca ejecutables)",
    "repl": r"REPL.{0,95}(?:ciclo|interactivo|Read.Eval.Print)",
    "interprete": r"int[eé]rprete.{0,60}(?:programa|ejecuta|lee)",
    "clonar": r"clon(?:ar|a|an).{0,65}(?:descarg|copia)",
    "stdout": r"stdout.{0,90}(?:salida est[aá]ndar|salida normal|texto normal)",
    "stderr": r"stderr.{0,90}(?:salida de errores|mensajes de error|canal de errores)",
}


def extract_string_literals_in_order() -> list[tuple[str, str]]:
    """Import the *rendered data order*, not source-code regular expressions."""
    result = subprocess.run(
        ["node", "--import", "tsx", "scripts/export_s01_first_use.mts"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    return [(loc, text) for loc, text in json.loads(result.stdout)]


def first_use_is_defined(term: str, context: str) -> bool:
    """A constrained positive assertion; unrelated definitions cannot satisfy it."""
    return bool(re.search(DEFINITION_PATTERNS[term], context, re.I | re.S))


def audit_chunks(chunks: list[tuple[str, str]]) -> dict:
    first_hits: dict[str, dict] = {}
    issues = []

    for loc, text in chunks:
        for jid, patterns in JARGON:
            if jid in first_hits:
                continue
            for pat in patterns:
                m = re.search(pat, text, re.I)
                if not m:
                    continue
                # Check this term's nearby context, not an arbitrary definition
                # of a different term. The following 220 chars allow an inline
                # definition after the first mention in a beginner paragraph.
                window = text[max(0, m.start() - 30) : m.end() + 450]
                defined = first_use_is_defined(jid, window)
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
    # S01 intentionally uses inline explanations instead of a block titled
    # "Diccionario del día". Require substantive definitions in the opening
    # paragraph cluster; a cosmetic heading alone is not sufficient.
    early_theory = " ".join(t for loc, t in chunks if loc == "theory.paragraph")[:6000]
    has_day1_definitions = all(
        first_use_is_defined(jid, early_theory)
        for jid in ("venv", "git", "repo", "commit", "pip", "requirements")
    )
    if not has_day1_definitions:
        issues.append(
            {
                "term": "day1_core_definitions",
                "severity": "P0",
                "location": "theory[0]",
                "snippet": "missing one or more first-block core explanations",
                "fix": "Define venv, Git, repo, commit, pip and requirements early; headings alone do not count",
            }
        )

    report = {
        "section": "setup",
        "first_hits": first_hits,
        "issues": issues,
        "open_p0": [i for i in issues if i["severity"] == "P0"],
        "open_p1": [i for i in issues if i["severity"] == "P1"],
        "ok": len([i for i in issues if i["severity"] in ("P0", "P1")]) == 0,
        "has_day1_definitions": has_day1_definitions,
    }
    return report


def main() -> None:
    report = audit_chunks(extract_string_literals_in_order())
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    print(json.dumps({"ok": report["ok"], "p0": len(report["open_p0"]), "p1": len(report["open_p1"]), "hits": len(report["first_hits"])}, indent=2))
    if not report["ok"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
