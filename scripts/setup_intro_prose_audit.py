#!/usr/bin/env python3
"""Measure the Spanish of Sesión 0 (/empezar) against audit/fixer/writing_rules.md.

    python3 scripts/setup_intro_prose_audit.py           # report; exit 1 on a hard failure
    python3 scripts/setup_intro_prose_audit.py --json    # the same, machine-readable

The course's own audit (scripts/prose_quality_audit.py) reads the 52 sections only, so Sesión 0
would go unmeasured. This applies the same formulas (imported, not copied) to every learner-facing
string of src/lib/setup/content.ts and figures.ts, and adds the checks the handover asks for:

  hard (exit 1)  a sentence over 32 words (D1); English outside `code` (D7, heuristic list);
                 unpaired ¿? ¡! (D3); doubled words (D6); authoring residue (D12)
  target         Fernández-Huerta at the easy end of 50-70 for the page as a whole; reported
                 per part, never a pass/fail on its own (E: "a signal for ranking passages")
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from prose_quality_audit import analyse, sentences  # noqa: E402

DUMP = r"""
import { SETUP_INTRO, SETUP_PARTS, SETUP_SHOTS } from './src/lib/setup/content.ts'
import { SETUP_FIGURES } from './src/lib/setup/figures.ts'
const out = []
const add = (where, text, teaching = false) => out.push({ where, text, teaching })
SETUP_INTRO.lead.forEach((t) => add('intro', t))
SETUP_INTRO.needs.forEach((t) => add('intro', t))
SETUP_INTRO.next.forEach((t) => add('intro', t))
for (const p of SETUP_PARTS) {
  add(p.id, p.goal); p.intro.forEach((t) => add(p.id, t, true))
  for (const s of p.steps) {
    add(p.id, s.title); s.body.forEach((t) => add(p.id, t, true))
    if (s.expect) add(p.id, s.expect.text)
    for (const f of s.fixes ?? []) { add(p.id, f.symptom); f.steps.forEach((t) => add(p.id, t)) }
  }
}
for (const s of SETUP_SHOTS) { add('shots', s.alt); add('shots', s.caption) }
for (const f of Object.values(SETUP_FIGURES)) { add('figures', f.caption); add('figures', f.alt) }
console.log(JSON.stringify(out))
"""

# English words a Spanish sentence should not carry outside `code`. Screen labels the learner must
# match are written as `code` in the content, so they never reach this check.
ENGLISH = re.compile(
    r"\b(the|and|with|click|download|install|settings|setup|folder|file|button|default|"
    r"path|shell command|login|password|email|repository|branch|commit message|push|pull)\b",
    re.I,
)
ALLOWED_NAMES = re.compile(r"\b(git push|git clone|git pull|PATH|GitHub|Git|VS Code|Python|PowerShell|Windows|macOS|Linux|Ubuntu|"
                           r"Microsoft Store|Microsoft Authenticator|Google Authenticator|Finder|"
                           r"Command|Shift|Enter|Ctrl|Alt|README|REPL|Vim|Apple|Snapdragon|ARM|Xcode|CV)\b")
DOUBLED = re.compile(r"\b(\w+)\s+\1\b", re.I)
RESIDUE = re.compile(r"\b(TODO|FIXME|XXX)\b|lorem ipsum|as an AI")


def strip_code(text: str) -> str:
    return re.sub(r"`[^`]*`", " CODIGO ", text)


def words(s: str) -> int:
    return len(re.findall(r"\b\w+\b", s))


def check(items: list[dict]) -> dict:
    hard = []
    by_part: dict[str, list[str]] = {}
    for it in items:
        plain = strip_code(it["text"])
        by_part.setdefault(it["where"], []).append(plain)
        for s in sentences(plain):
            if words(s) > 32:
                hard.append({"rule": "D1 >32 words", "where": it["where"], "text": s})
        prose = ALLOWED_NAMES.sub(" ", plain)
        m = ENGLISH.search(prose)
        if m and it["where"] != "shots":
            hard.append({"rule": f"D7 English '{m.group(0)}'", "where": it["where"], "text": it["text"]})
        if plain.count("¿") != plain.count("?") or plain.count("¡") != plain.count("!"):
            hard.append({"rule": "D3 paired marks", "where": it["where"], "text": it["text"]})
        d = DOUBLED.search(plain)
        if d and not d.group(1).isdigit():
            hard.append({"rule": f"D6 doubled '{d.group(0)}'", "where": it["where"], "text": it["text"]})
        if RESIDUE.search(it["text"]):
            hard.append({"rule": "D12 residue", "where": it["where"], "text": it["text"]})
    parts = {k: analyse("\n".join(v)) for k, v in by_part.items()}
    page = analyse("\n".join(strip_code(i["text"]) for i in items))
    teaching = analyse("\n".join(strip_code(i["text"]) for i in items if i.get("teaching")))
    return {"hard": hard, "parts": parts, "page": page, "teaching": teaching}


def main() -> int:
    proc = subprocess.run(["npx", "tsx", "-e", DUMP], cwd=ROOT, capture_output=True, text=True)
    if proc.returncode != 0:
        print(proc.stderr, file=sys.stderr)
        print("REFUSED: could not read the content; no verdict.", file=sys.stderr)
        return 2
    items = json.loads(proc.stdout)
    r = check(items)
    if "--json" in sys.argv:
        print(json.dumps(r, ensure_ascii=False, indent=1))
    else:
        print(f"{'part':10s} {'FH':>6s} {'w/sent':>7s} {'long':>5s} {'nomin':>6s} {'ger':>5s}")
        for k, m in list(r["parts"].items()) + [("PAGE", r["page"]), ("TEACHING", r["teaching"])]:
            print(f"{k:10s} {m['fernandez_huerta']:6.1f} {m['words_per_sentence']:7.1f} "
                  f"{m['long_sentences']:5d} {m['nominalisations_per_100w']:6.1f} {m['gerunds_per_100w']:5.1f}")
        for h in r["hard"]:
            print(f"FAIL  {h['rule']}  [{h['where']}]  {h['text'][:140]}")
        print(f"\n{len(items)} strings; {len(r['hard'])} hard failure(s).")
    return 1 if r["hard"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
