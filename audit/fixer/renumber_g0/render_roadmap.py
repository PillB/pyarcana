"""Render the roadmap renumber as a new file, then validate it by re-parsing.

Usage: python3 render_roadmap.py ROADMAP PLAN.json OUT.md

PLAN.json: {"insertions": [{"after_old": 18, "title": "...", "entry": "<full ### block text>",
             "state_row": "| SNN | `NOT_STARTED` | ... |"}], "level_of_insertion": {...}}

Four classes of section reference, handled differently:
  1. identifiers (headings, prerequisites, gates, CF, level ranges)  -> mapped old -> new
  2. counts (52 sections, 13 per level, 1,248 exercises)              -> recomputed
  3. positional references ("ninguna hasta S18 cerrada" in the state table) -> recomputed from
     the row's new predecessor, because mapping would point new S21 back at S18
  4. dated snapshots ("Estado real de producción al 2026-07-15")      -> untouched
The token rewrite is ONE regex pass with a mapping function, so a rewritten S21 can never be
rewritten again: there is no cascade to order around.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

TOKEN = re.compile(r"\bS(\d{1,2})\b")
HEADING = re.compile(r"^### S(\d+) — (.+)$")
STATE_ROW = re.compile(r"^\| S(\d{2}) \|")
FROZEN_SECTIONS = ("## Estado real de producción al",)   # class 4: dated snapshot
FLAGGED_LINES = ("960 horas curriculares",)               # class 4-ish: stale figure, owner item


def old_to_new(n_old: int, insertions: list[dict]) -> int:
    return n_old + sum(1 for ins in insertions if ins["after_old"] < n_old)


def remap(text: str, insertions: list[dict], total_old: int) -> str:
    def sub(m: re.Match) -> str:
        digits = m.group(1)
        n = int(digits)
        if n < 1 or n > total_old:
            raise ValueError(f"section token S{digits} outside 1..{total_old}: {m.string[max(0, m.start()-40):m.end()+40]!r}")
        new = old_to_new(n, insertions)
        padded = len(digits) == 2 and digits[0] == "0"
        return f"S{new:02d}" if padded else f"S{new}"
    return TOKEN.sub(sub, text)


def render(src: str, plan: dict) -> tuple[str, list[str]]:
    insertions = sorted(plan["insertions"], key=lambda i: i["after_old"])
    lines = src.split("\n")
    headings = [(i, int(m.group(1))) for i, l in enumerate(lines) if (m := HEADING.match(l))]
    total_old = len(headings)
    notes: list[str] = []

    # --- class 1: map every token, except frozen regions and flagged lines --------------------
    out: list[str] = []
    frozen = False
    for line in lines:
        if line.startswith("## "):
            frozen = line.startswith(FROZEN_SECTIONS)
        if frozen:
            out.append(line)
        elif any(f in line for f in FLAGGED_LINES):
            out.append(line)
            notes.append(f"UNTOUCHED, owner item: {line[:110]}…")
        else:
            out.append(remap(line, insertions, total_old))
    lines = out

    # Insertions sharing an anchor go in as ONE group, in plan order. Inserting them one at a
    # time at the same point reverses them (S20 lands before S19) -- the validator caught this.
    groups: dict[int, list[dict]] = {}
    for ins in insertions:
        groups.setdefault(ins["after_old"], []).append(ins)

    # --- insert the new ### blocks after the (mapped) block of `after_old` --------------------
    for after_old in sorted(groups, reverse=True):
        anchor_new = old_to_new(after_old, insertions)
        heads = [(i, int(m.group(1))) for i, l in enumerate(lines) if (m := HEADING.match(l))]
        idx = next(i for i, n in heads if n == anchor_new)
        # block ends at the next "### " or "## " line
        end = next(j for j in range(idx + 1, len(lines)) if lines[j].startswith(("### ", "## ")))
        block = [l for ins in groups[after_old] for l in ins["entry"].rstrip("\n").split("\n") + [""]]
        lines[end:end] = block

    # --- class 3: the state table -- insert rows, then recompute "hasta S(n-1)" --------------
    for after_old in sorted(groups, reverse=True):
        anchor_new = old_to_new(after_old, insertions)
        rows = [(i, int(m.group(1))) for i, l in enumerate(lines) if (m := STATE_ROW.match(l))]
        idx = next(i for i, n in rows if n == anchor_new)
        lines[idx + 1:idx + 1] = [r for ins in groups[after_old] for r in ins["state_rows"]]
    rows = [(i, int(m.group(1))) for i, l in enumerate(lines) if (m := STATE_ROW.match(l))]
    for k in range(1, len(rows)):
        i, n = rows[k]
        prev = rows[k - 1][1]
        fixed = re.sub(r"(ninguna hasta S)(\d{2})( cerrada| ?/)", lambda m: f"{m.group(1)}{prev:02d}{m.group(3)}", lines[i])
        if fixed != lines[i]:
            notes.append(f"state row S{n:02d}: predecessor recomputed -> S{prev:02d}")
            lines[i] = fixed

    # --- class 2: counts -----------------------------------------------------------------------
    for old, new in plan.get("count_edits", []):
        hits = [i for i, l in enumerate(lines) if old in l]
        if len(hits) != 1:
            raise ValueError(f"count edit {old!r} matched {len(hits)} lines, want exactly 1")
        lines[hits[0]] = lines[hits[0]].replace(old, new)

    return "\n".join(lines), notes


def validate(text: str, plan: dict) -> list[str]:
    errs: list[str] = []
    lines = text.split("\n")
    nums = [int(m.group(1)) for l in lines if (m := HEADING.match(l))]
    want = plan["expected_total"]
    if nums != list(range(1, want + 1)):
        errs.append(f"headings are not 1..{want} in order: {nums}")
    # every heading block: one metadata line, four Tn bullets each with exactly one ';', one gate line
    heads = [i for i, l in enumerate(lines) if HEADING.match(l)]
    for k, i in enumerate(heads):
        end = next((j for j in range(i + 1, len(lines)) if lines[j].startswith(("### ", "## "))), len(lines))
        block = lines[i:end]
        tn = [l for l in block if re.match(r"^- T[1-4] ", l)]
        if len(tn) != 4 or any(l.count(";") != 1 for l in tn):
            errs.append(f"{lines[i][:40]}: {len(tn)} Tn bullets or a bullet without exactly one ';'")
        if sum(l.startswith("**Prerrequisito") for l in block) != 1:
            errs.append(f"{lines[i][:40]}: metadata line count != 1")
        if sum(l.startswith("**Incremento/gate:**") for l in block) != 1:
            errs.append(f"{lines[i][:40]}: gate line count != 1")
    # no section token beyond the course
    beyond = sorted({int(m.group(1)) for l in lines for m in TOKEN.finditer(l)} - set(range(1, want + 1)))
    if beyond:
        errs.append(f"section tokens beyond S{want}: {beyond}")
    # state table: 1..N, each 'hasta S(n-1)' names the predecessor
    rows = [(l, int(m.group(1))) for l in lines if (m := STATE_ROW.match(l))]
    if [n for _, n in rows] != list(range(1, want + 1)):
        errs.append(f"state table rows are not S01..S{want:02d}")
    for (l, n) in rows[1:]:
        for m in re.finditer(r"ninguna hasta S(\d{2})", l):
            if int(m.group(1)) != n - 1:
                errs.append(f"state row S{n:02d} waits on S{m.group(1)}, not its predecessor")
    # level headings: their ranges agree with the headings under them
    lv = [(i, int(m.group(1)), int(m.group(2))) for i, l in enumerate(lines)
          if (m := re.match(r"^## Nivel \d — S(\d+)–S(\d+)", l))]
    for k, (i, a, b) in enumerate(lv):
        end = lv[k + 1][0] if k + 1 < len(lv) else len(lines)
        under = [int(m.group(1)) for l in lines[i:end] if (m := HEADING.match(l))]
        if under != list(range(a, b + 1)):
            errs.append(f"level heading S{a}–S{b} holds {under[:1]}..{under[-1:]}")
    # capstone ids: still 13 unique
    caps = set(re.findall(r"CP-N\d-[ABC]|CP-FINAL", text))
    if len(caps) != 13:
        errs.append(f"{len(caps)} capstone ids, want 13")
    return errs


if __name__ == "__main__":
    roadmap, plan_path, out_path = map(Path, sys.argv[1:4])
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    text, notes = render(roadmap.read_text(encoding="utf-8"), plan)
    out_path.write_text(text, encoding="utf-8")
    for n in notes:
        print("note:", n)
    errs = validate(text, plan)
    for e in errs:
        print("INVALID:", e)
    sys.exit(1 if errs else 0)
