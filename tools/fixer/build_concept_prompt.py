#!/usr/bin/env python3
"""Prompt to introduce the concepts a section uses without teaching them.

Driven by docs/concept-map: for the given section, every concept whose first
learner-visible use happens here while no definition exists yet, or exists only
later in the course. Those are the words that surprise a reader.

Grouped by section rather than issued per concept, because the fixes interact - two
terms in one paragraph are one rewrite, and a definition added in T1 changes what T3
may assume. That is also why sections are never fanned out internally.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"""\bid:\s*['"]{re.escape(slug)}['"]""",
                                    p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


#: Kept in step with PE_CITIES in tests/adversarial/test_over_localized_language.py, which
#: is the gate. If the two drift, the prompt promises headroom the test will not honour.
PE_CITIES = re.compile(r"\b(Lima|Cusco|Cuzco|Arequipa|Piura|Tacna|Ayacucho|Trujillo|Chiclayo|Iquitos|Huancayo)\b")
PE_CITY_CAP = 55


def place_name_budget(path: Path) -> str:
    """How many more Peruvian place names this file can take before the gate fails it.

    Three concepts rounds have been thrown away on this cap, and every one of them wrote in
    the house style: nothing in the prompt said the limit existed, so codex had no way to
    know a section was already saturated. The count is stated rather than the rule alone
    because "do not overuse place names" is unactionable at 53 of 55.
    """
    prose = "\n".join(l for l in path.read_text(encoding="utf-8").splitlines() if "CASO-" not in l)
    used = len(PE_CITIES.findall(prose))
    left = PE_CITY_CAP - used
    if left <= 0:
        return (f"{path.name} already holds {used} place names against a hard cap of "
                f"{PE_CITY_CAP}. Your new prose must add NONE, and every name you can replace "
                f"with a role (`region norte`, `la sede`, `sucursal B`) helps.")
    if left <= 5:
        return (f"{path.name} holds {used} of a hard cap of {PE_CITY_CAP}. Your new prose may "
                f"add AT MOST {left}. Prefer a role over a city name; this gate fails the "
                f"round and the section is restored.")
    return (f"{path.name} holds {used} of a hard cap of {PE_CITY_CAP}, so there is room for "
            f"about {left}. Names counted: Lima, Cusco/Cuzco, Arequipa, Piura, Tacna, "
            f"Ayacucho, Trujillo, Chiclayo, Iquitos, Huancayo.")


def code_scope_rule(practice_in_scope: bool) -> str:
    """The hard constraint on code, stated so the prompt never contradicts itself.

    By default a concepts round is prose-only and code is frozen, which is right: most rounds
    teach a term, and a code block and its `output:` must keep matching.

    But D14 and route 2 put the PRACTICE LAYER in scope for S02-S04, and every amendment asking
    for exercises to be rebuilt sat beneath a template line reading "Do not change code, declared
    output...". Codex noticed both times and asked which wins instead of guessing - S02 ("¿Se
    levanta para esta ronda la prohibición de cambiar código?") and S03 ("¿Debe prevalecer la
    orden de ROUND TWO ... o la restricción anterior?") - and each round came back prose-only.
    A prompt that contradicts itself costs a round to resolve, and the right place to resolve it
    is the template, not an amendment underneath it.
    """
    if not practice_in_scope:
        return ("- Do not change code, declared output, identifiers, headings of existing blocks, or\n"
                "  exercise ids. A code block and its `output:` must keep matching; the runtime audit\n"
                "  executes them.")
    return ("- THE PRACTICE LAYER IS IN SCOPE for this section (decision D14, route 2). You MAY change\n"
            "  code, `starterCode`, `solutionCode`, `tests` and declared `output` - always TOGETHER, so\n"
            "  every code block and its `output:` still match line for line; the runtime audit executes\n"
            "  them all. You may NOT change exercise ids, the exercise count, or the headings of\n"
            "  existing blocks, and D14's rule holds: an exercise's objective may change, its worth\n"
            "  may not.")


def held_definitions(cmap: dict, tag: str, slugs: list[str]) -> list[dict]:
    """What breaks if this round removes a definition that lives here.

    The brief below is computed from the concept map BEFORE the round. It tells codex how many
    times each concept is used too early *given the definitions that exist now*. Remove one of
    those definitions - often the right call, because a section should not pre-announce a
    concept another section teaches - and every use it was masking becomes a surprise at once,
    including uses the brief never mentioned and codex had no way to see.

    That happened three times in two days, each time on a correct patch:

      `for`    S04, the only definition in 52 sections was a weDo preamble's
               "(base del gate de resúmenes)"; removing it would have taken the gated measure
               from 268 to 1126.
      function S02's gloss "una función es un bloque reutilizable de instrucciones" is the
               earliest in the course; removing it exposed 97 uses before S05 and the measure
               went 229 -> 301.
      `if`     S02-T2-A-DEMO's `why`; removing it exposed 20 and the measure went 208 -> 223.

    Each was diagnosed after the fact and the patch held back. Stating the number up front is
    cheaper, and it is the same move that stopped the place-name cap destroying rounds: codex
    cannot weigh a constraint nobody told it about.

    Telling it is not enough on its own. On 2026-09-26 the S02 brief said `unpacking` "disappears
    from the whole course" if theory[4] went, and codex deleted theory[4] with the rationale that
    unpacking "is taught later". So the list is also written for `apply_patches.py`, which
    refuses a patch that deletes one of these outright - see `write_held_definitions`.
    """
    # The map records a section as its tag (S04), while `slugs` is the slug order; key by tag.
    order = {f"S{i + 1:02d}": i for i in range(len(slugs))}
    held = []
    for cid, c in cmap.items():
        d = c.get("first_definition")
        if not d or d.get("section") != tag:
            continue
        # Successors inside the SAME block do not survive the removal either. `return` is
        # defined by both `decisions-rules.theory[3].p3` and `decisions-rules.theory[3].figure`;
        # taking the figure as the next definition made the exposure look like nothing, this
        # block stayed silent, and the round that replaced all of `theory[3]` exposed 58 uses.
        # A patch replaces a block, not a sentence, so look past every definition in it.
        block = d["location"].rsplit(".", 1)[0]
        later = [x for x in c.get("definitions", [])
                 if x["location"] != d["location"] and not x["location"].startswith(block + ".")]
        nxt = later[0] if later else None
        limit = order.get(nxt["section"], 99) if nxt else 99
        # Section-level, so it under-counts uses sitting earlier inside the next definition's
        # own section. Stated as "at least" for that reason.
        masked = sum(1 for u in c.get("uses", [])
                     if u.get("visible") and order.get(u["section"], 99) < limit)
        exposed = masked - len(c.get("surprising_uses", []))
        if exposed > 0:
            held.append({"concept": cid, "location": d["location"], "kind": d["kind"],
                         "moves_to": nxt["section"] if nxt else None, "exposed": exposed})
    return sorted(held, key=lambda h: -h["exposed"])


def definitions_this_section_holds(cmap: dict, tag: str, slugs: list[str]) -> str:
    """The brief's rendering of `held_definitions`."""
    rows = []
    for h in held_definitions(cmap, tag, slugs)[:8]:
        where = f"moves to {h['moves_to']}" if h["moves_to"] else "disappears from the whole course"
        rows.append(f"  - `{h['concept']}` is defined here, at {h['location']} ({h['kind']}).\n"
                    f"    Remove or reword that and the definition {where}, exposing at least "
                    f"{h['exposed']} further uses at once.")
    if not rows:
        return "This section holds no concept's earliest definition, so nothing here is load-bearing that way."
    return ("Each of these is the earliest definition of its concept in the course. Removing one is\n"
            "sometimes right - a section should not pre-announce what another teaches - but it is\n"
            "never free, and the cost does not appear in the list above:\n\n"
            + "\n".join(rows)
            + "\n\nIf you judge one should go, say so in `unresolved_questions` with the count, rather\n"
              "than removing it and leaving the uses behind. A round that trades one masked concept\n"
              "for dozens of exposed ones is rejected whole, and every other patch in it is lost.")


def write_held_definitions(cmap: dict, tag: str, payload: dict) -> Path:
    """The held definitions with their sentence text and every name of the concept.

    Named `{tag}k.*` like the rest of a concepts round's files, so `run_concepts.sh` clears it
    with them and `apply_patches.py` finds it beside `{tag}k.result.json`. A stale list from
    another round can therefore never guard this one.
    """
    text = {e["location"]: e["text"] for e in payload["events"]}
    names = {t["id"]: t.get("names", []) for t in payload["terms"]}
    rows = [{**h, "text": text.get(h["location"], ""), "names": names.get(h["concept"], [])}
            for h in held_definitions(cmap, tag, payload["active_section_ids"])]
    out = ROOT / f".fixer/{tag}k.held_definitions.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    return out


def concept_row(cid: str, c: dict, tag: str) -> dict | None:
    """One concept's entry in this section's prompt, or None if it is not a problem here.

    `load_bearing` here is NOT the concept map's field of that name. That one is D5's
    figure-targeting flag - depth L2 or L3 and used in three or more sections - and passing
    it through inverted this prompt's meaning. Depth is earned by being explained, so a
    concept the course never explains cannot reach L2, and all 13 never-explained concepts
    arrived marked `load_bearing: false`. The words most in need of a full teaching block
    were exactly the ones the "do not downgrade a load-bearing concept to GLOSS" rule could
    never protect. overfitting drives a whole subtopic of S33, carries its worked example and
    is promised in its outcomes, and arrived as false.

    What the TEACH-or-GLOSS call needs is whether the concept carries weight HERE: whether
    this section demonstrates it, grades it, promises it, or leans on it repeatedly. That
    reads both ways - `merge` is load-bearing in the course and does no work in S06, where
    the honest answer is GLOSS or DEFER rather than a teaching block it does not earn.
    """
    here = [u for u in c["surprising_uses"] if u["section"] == tag]
    if not here:
        return None
    examples_here = [e for e in c["examples"] if e["section"] == tag]
    checks_here = [s for s in c["self_checks"] if s["section"] == tag]
    promised_here = any(u["kind"] == "outcome" for u in here)
    return {
        "concept": cid,
        "depth_now": c["depth"],
        "load_bearing": bool(examples_here or checks_here or promised_here or len(here) >= 4),
        "never_explained_anywhere": c["depth"] == "L0",
        "explained_currently_at": (c["first_definition"] or {}).get("location", None),
        "used_here_at": [u["location"] for u in here][:8],
        "used_in_sections": c["sections_used"],
        "has_worked_example": len(examples_here) > 0,
        "tested_in_selfcheck": len(checks_here) > 0,
        "promised_in_this_sections_outcomes": promised_here,
        "times_used_here": len(here),
    }


def main() -> int:
    tag = sys.argv[1]
    # D14 sections (S02-S04 under route 2) rebuild exercises; everything else stays prose-only.
    practice_in_scope = "--practice-layer" in sys.argv[2:]
    num = int(tag.lstrip("Ss"))
    payload = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
    slugs = payload["active_section_ids"]
    slug = slugs[num - 1]
    path = section_file(slug)

    cmap = json.loads((ROOT / "course-state/concept_map.json").read_text(encoding="utf-8"))
    glossary = {t["id"]: t for t in payload["terms"]}
    write_held_definitions(cmap, tag, payload)

    todo = [row for cid, c in cmap.items()
            if (row := concept_row(cid, c, tag)) is not None]
    if not todo:
        print(f"{tag}: no unexplained concepts", file=sys.stderr)
        return 2

    todo.sort(key=lambda t: (not t["never_explained_anywhere"], not t["load_bearing"]))
    known = sorted({t for e in payload["events"]
                    if e["learner_visible"] and slugs.index(e["section_id"]) < num - 1
                    for t in e["defines"]})
    rules = (ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8")
    decisions = (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8")

    # The auditors' wiki: the operating contract and the Attack -> Defense -> Verdict rule.
    wiki = (ROOT / "audit/fixer/wiki/README.md").read_text(encoding="utf-8")
    w0 = wiki.find("## Campaign operating contract")
    w1 = wiki.find("## Solarize adaptation")
    wiki_contract = wiki[w0:w1 if w1 > w0 else None].strip() if w0 >= 0 else ""

    # ReviewerFixer-derived findings for this section that bear on vocabulary and
    # prerequisites - the audits already named many of these gaps in their own words.
    VOCAB = ("WIDOW", "TERM", "PREREQUISITE", "FUTURE_KNOWLEDGE", "JARGON", "UNDEFINED",
             "UNEXPLAINED", "ACRONYM", "OUTCOME_NOT_TAUGHT", "VOCAB", "GLOSS", "DEFIN")
    registry = json.loads((ROOT / "audit/consolidated/registry.json").read_text(encoding="utf-8"))["findings"]
    audit_findings = [
        {k: f.get(k) for k in ("finding_id", "severity", "category", "title", "evidence", "fix")}
        for f in registry
        if f["section"] == tag and any(v in (f.get("category") or "").upper() + (f.get("title") or "").upper()
                                       for v in VOCAB)
    ][:25]

    print(f"""You are teaching the concepts that PyArcana section {tag} ("{slug}") currently uses
without explaining them.

Read the current text here: {path.relative_to(ROOT)}
Do NOT modify it or any other file; you have read-only access. Return JSON matching the
schema: a byte-exact `anchor` from that file appearing EXACTLY ONCE, plus `replacement`.

THE PROBLEM, precisely. Each concept below is used in this section before the learner has
any way to know what it means. Some are never explained anywhere in all 52 sections. A
reader hits the word, guesses, and carries the guess forward.

{json.dumps(todo, ensure_ascii=False, indent=1)}

DECIDE EACH CONCEPT BEFORE WRITING ANYTHING (D6). Answer, in order:

  Q1. IS THIS USE NECESSARY? Would the passage still teach what it is for if the term
      were gone? If the mention is throwaway - a passing name-drop, a preview of a later
      section, jargon where plain words work - REMOVE it or replace it with plain Spanish.
      Removing adds no cognitive load; a definition always adds some. Prefer it whenever
      the lesson does not need the concept.

  Q2. IF IT IS NECESSARY, IS THIS THE RIGHT PLACE TO TEACH IT? If the learner needs it
      here, teach it here. If it cannot be taught properly at this point without derailing
      the lesson, do not bolt a definition onto the sentence: rewrite the use so it is not
      needed yet, and say in `unresolved_questions` which earlier section should teach it.

Then choose exactly one action per concept and state it in that patch's `rationale`,
starting with the action name:

  REMOVE          throwaway mention; delete or replace with plain words
  REPHRASE        the idea is needed, the term is not; say it without the term
  GLOSS           a term used once or twice that the learner need not operate with;
                  define in place at first use, in words already taught (D1)
  TEACH           a VITAL WORKING CONCEPT - the learner must use it to do this section's
                  work. A gloss is not enough. Add a supporting explanatory block with:
                    1. what it is and why it exists - the problem it solves
                    2. a worked example with concrete values, code if it applies
                    3. a guided step the learner performs, with what correct looks like
                    4. a check the learner can run to confirm they understood
                  (This mirrors the course's own I Do -> We Do -> You Do release.)
  DEFER           needed later, not here; rewrite this use away and name the section
                  that should teach it in `unresolved_questions`

A concept marked `load_bearing: true` is presumed TEACH unless Q1 shows the use here is
throwaway. Do not downgrade a load-bearing concept to GLOSS to save length.

STRUCTURE OF A TEACH BLOCK - this is a hard contract, it has broken a round before:

  A supporting explanatory block is a TheoryBlock with `heading` and `paragraphs`, and
  optionally `code` and `callout`. It MUST NOT have a `subtopicId`. The eight numbered
  subtopics are the spine that demos and exercises attach to, and the curriculum contract
  requires exactly those eight theory tags to line up with the eight demos. A block without
  `subtopicId` is ignored by that contract and can be as long as the concept needs. A block
  with one - new or copied from a neighbour - breaks the section.

  Place the block immediately before the numbered subtopic whose work needs the concept,
  so the learner reads the explanation before the first use.

HARD CONSTRAINTS:
- Define using only what earlier sections taught. The vocabulary already available is
  listed below; anything outside it must be explained here too, or avoided.
- Never explain a term with itself. "Un validador valida" teaches nothing.
{code_scope_rule(practice_in_scope)}
- Preserve what already works. Repair the gap, do not rewrite the section.
- If teaching a concept properly needs a decision you cannot make from the evidence,
  leave it and raise it in `unresolved_questions`.

CRITIQUE EVERY PASSAGE BEFORE RETURNING IT: read it as someone who knows only the
vocabulary below, ask what could confuse them and what is still missing, revise, then
answer `self_critique` about the revised text.

===== VOCABULARY ALREADY AVAILABLE TO THE LEARNER HERE =====
{", ".join(known) or "(none - this is the first section)"}

===== GLOSSARY DEFINITIONS (the meaning to preserve, not the wording to copy) =====
{json.dumps({t["concept"]: glossary.get(t["concept"], {}) for t in todo}, ensure_ascii=False, indent=1)}

===== WHAT THE AUDITORS ALREADY FOUND ABOUT VOCABULARY IN THIS SECTION =====
(from the ReviewerFixer audit registry; their evidence and proposed fixes are input, not orders)
{json.dumps(audit_findings, ensure_ascii=False, indent=1) if audit_findings else "(none recorded)"}

===== AUDIT WIKI: OPERATING CONTRACT (binding) =====
{wiki_contract}

===== LEDGER: OBSERVATIONS FROM EARLIER ROUNDS (binding; they apply to this section) =====
{(ROOT / "audit/fixer/LEDGER_NOTES.md").read_text(encoding="utf-8") if (ROOT / "audit/fixer/LEDGER_NOTES.md").exists() else ""}

===== STANDING DECISIONS (binding) =====
{decisions}

===== DISTILLED WRITING RULES (binding) =====
{rules}

===== DEFINITIONS THIS SECTION HOLDS FOR THE WHOLE COURSE =====
{definitions_this_section_holds(cmap, tag, slugs)}

===== THIS FILE'S PLACE-NAME BUDGET (hard gate, H1) =====
{place_name_budget(path)}
""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
