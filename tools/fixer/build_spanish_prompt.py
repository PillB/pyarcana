#!/usr/bin/env python3
"""Prompt for a Spanish-language pass: English leaking into Spanish prose.

Measured by scripts/code_switching_audit.py. Every English word in prose needs a
decision, not a blanket translation - S46 showed why: `inputs`, `outputs` and `owner`
there are field names in a lineage record, and translating a field name makes the
prose stop matching the code the learner writes.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))


def main() -> int:
    tag = sys.argv[1]
    import subprocess
    slug, path = subprocess.run(["python3", "tools/fixer/section_path.py", tag], cwd=ROOT,
                                capture_output=True, text=True).stdout.split()
    cs = json.loads((ROOT / "course-state/code_switching_report.json").read_text(encoding="utf-8")).get(tag)
    if not cs or cs["avoidable_english_per_1000"] < 1:
        print(f"{tag}: no meaningful English leakage", file=sys.stderr)
        return 2
    notes = (ROOT / "audit/fixer/LEDGER_NOTES.md").read_text(encoding="utf-8")
    rules = (ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8")

    print(f"""You are improving the Spanish of PyArcana section {tag} ("{slug}"), a course written in
Peruvian Spanish for learners who may read little English.

Read the current text here: {path}
Do NOT modify it or any other file; you have read-only access. Return JSON matching the
schema: a byte-exact `anchor` appearing EXACTLY ONCE, and the `replacement`.

THE PROBLEM. English words are dropped into Spanish sentences. Measured in this section:
{cs['avoidable_english_per_1000']} avoidable English words per 1,000 words of prose.
Most frequent: {", ".join(f"{t} ({n})" for t, n in cs['top_terms'])}

Some of the worst passages:
{json.dumps(cs['worst_passages'], ensure_ascii=False, indent=1)}

DECIDE EACH ENGLISH WORD. Do not translate on sight. In this order:

1. IS IT AN IDENTIFIER? A field name, key, status value, argument or literal that the code
   reads, writes or compares - `owner` as a record field, `inputs`/`outputs` in a lineage
   record, `accept`/`reject`/`review` as a decision value. Then KEEP IT IN ENGLISH and wrap it
   in backticks. Translating it makes the prose disagree with the code the learner types.
   Look at the section's code to decide; do not guess.
2. IS IT PRACTITIONER VOCABULARY THE COURSE DELIBERATELY KEEPS? `rollback`, `schema`,
   `baseline`, `pipeline`, `payload`, `lineage`, `runbook`. Keep it, provided it is explained
   in Spanish where the learner first meets it. If it is not, add that explanation once.
3. IS IT AN ORDINARY WORD WITH A STANDARD SPANISH RENDERING? Translate it: `owner` as a person
   or role -> *responsable*; `release` -> *versión* or *lanzamiento*; `check` -> *comprobación*;
   `review` as an activity -> *revisión*; `scope` -> *alcance*; `ticket` -> *incidencia* or
   *ticket* only where the learner will meet the English in a tool.
4. IS IT A SPANGLISH HYBRID? "Pinear", "trackear", "deployar": use the Spanish verb.
5. ENGLISH FUNCTION WORDS in Spanish prose ("and", "only", "not", "is"): rewrite the phrase in
   Spanish, unless the words are inside a quoted English label the learner will see verbatim.

Do not backtick an ordinary word to hide it from the measurement. Backticks mean "this is
exactly what you type or read in the code", and a learner will treat it that way.

A translation must not make the sentence heavier. An English noun ("the check", "a review")
tempts a Spanish noun chain ("la realización de la comprobación de la revisión"): use the
verb instead ("comprueba", "revisa"). If your Spanish is longer than the sentence it
replaces and that sentence was already long, split it in two. Run-on sentences and
nominalisations are measured, and a pass that raises either is rejected whole.

EXCEPTION - NAMED PRACTICES. Some English nouns name a standing practice or artifact rather
than an action: `code review`, `capacity review`, `request validation`. Their correct Spanish
is itself a noun phrase - *revisión de código*, *revisión de capacidad*, *validación de la
solicitud* - and there is no verb to use instead, because the phrase is a label, not an event
("En la revisión de capacidad:" is a heading, not something someone does to something). These
are the same shape as the names already accepted in `audit/fixer/b5_established_terms.json`
(*aseguramiento de la calidad*, *gestión de la configuración*, *control de versiones*). Write
the noun phrase, do NOT contort it into a verb, and list the Spanish name you used in that
patch's `terms_introduced` so it can be added to the accepted list. S41's pass was rejected
whole for exactly these three phrases; the writing was right and the measure had not been
told about them.

A longer, flatter translation is a regression even when the English count improves. "audit
append-only" became "un registro de auditoría al que solo se añade información" and
"Drift visible y bloqueado > golden actualizado en silencio." became a nominalised subject
clause; both lowered `avoidable_english_per_1000` and both made the course worse. If your
replacement is longer, flatter and less quotable than what it replaced, say so in
`self_critique` rather than shipping it because a number improved.

When you turn a terse instruction into code-shaped text (`record["owner"]`, a print call,
a variable name), use only names that already appear in this section's code or starter.
Never invent a key, variable or call: the learner will search the starter for it.

HARD CONSTRAINTS:
- Never change code, declared output, identifiers inside code, headings, exercise ids or
  subtopicIds.
- Preserve every fact. This is a language pass, not a content rewrite.
- Keep Peruvian Spanish register: *computadora*, *celular*, usted/tú consistent with the
  surrounding text.
- Repair the English; do not rewrite paragraphs that are already fine.
- Leave words that are already Spanish alone, even where you would have chosen another:
  "El dueño de S44-T4-A" is Spanish; do not turn it into "La persona responsable de". Keep
  the opening words of every callout and theory gate exactly — tests identify those blocks
  by how they begin, and changing a correct opener breaks the section for no gain.

Critique each replacement before returning it: would a learner who reads no English
understand it, and does every backticked word really appear in the code? Revise, then fill
`self_critique` for the revised text.

===== LEDGER: OBSERVATIONS FROM EARLIER ROUNDS (binding) =====
{notes}

===== DISTILLED WRITING RULES (binding) =====
{rules}
""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
