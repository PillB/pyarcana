#!/usr/bin/env python3
"""Ensure canonical S01 jargon seed is covered by glossary SSOT aliases."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TERMS = ROOT / "src/lib/glossary/terms.ts"
OUT = ROOT / "course-state/s01_glossary_coverage.json"

SEED = [
    "venv",
    ".venv",
    "entorno virtual",
    "repo",
    "repositorio",
    "git",
    "github",
    "clonar",
    "commit",
    "pull request",
    "pr",
    "path",
    "intérprete",
    "repl",
    "pip",
    "requirements.txt",
    "dependencias",
    "terminal",
    "shell",
    ".gitignore",
    ".env",
    "ruff",
    "vs code",
    "notebook",
]


def collect_aliases(text: str) -> set[str]:
    aliases: set[str] = set()
    for m in re.finditer(r"aliases:\s*\[([\s\S]*?)\]", text):
        for a, b in re.findall(r"'((?:\\'|[^'])*)'|\"((?:\\\"|[^\"]*)*)\"", m.group(1)):
            aliases.add((a or b).replace("\\'", "'").lower())
    for m in re.finditer(r"term:\s*'((?:\\'|[^'])*)'", text):
        aliases.add(m.group(1).replace("\\'", "'").lower())
    return aliases


def covered(seed: str, aliases: set[str]) -> bool:
    s = seed.lower()
    if s in aliases:
        return True
    for a in aliases:
        if s == a or s in a or a in s:
            return True
    return False


def main() -> None:
    text = TERMS.read_text(encoding="utf-8")
    aliases = collect_aliases(text)
    missing = [s for s in SEED if not covered(s, aliases)]
    report = {
        "seed_size": len(SEED),
        "alias_count": len(aliases),
        "missing": missing,
        "ok": len(missing) == 0,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    print(json.dumps(report, indent=2, ensure_ascii=False))
    raise SystemExit(0 if report["ok"] else 1)


if __name__ == "__main__":
    main()
