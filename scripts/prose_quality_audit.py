#!/usr/bin/env python3
"""Measure Spanish prose quality per section, using ReviewerFixer/_GRAMMAR_SUBPLAN.md.

Written because a repair round can improve a passage's facts and damage its writing at
the same time, and nothing was watching the second half. S01's Mars Climate Orbiter
paragraph gained an accurate account of the units failure and lost the sentence that
carried its teaching point, picking up "fallas contribuyentes de verificación,
comunicación e ingeniería de sistemas" on the way.

Metrics are the ones the subplan settled on, not invented here:
  Fernandez-Huerta  206.84 - 60*(syll/word) - 1.02*(words/sentence)   (G, section A)
  plus the pedagogical heuristics table                                (G, section C)

Scores rank passages for attention. They are not a claim that prose is good.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

# Writes a shared course-state report, so it must not run while a gate is measuring.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import report_lock  # noqa: E402
ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / ".fixer/events.json"
OUT = ROOT / "course-state/prose_quality_report.json"

VOWELS = "aeiouáéíóúü"
NOMINALISATION = re.compile(r"\b\w+(ción|ciones|miento|mientos|idad|idades|anza|encia)\b", re.I)
GERUND = re.compile(r"\b\w+(ando|iendo)\b", re.I)
META = re.compile(r"\b(TODO|FIXME|as an AI|como modelo|lorem ipsum)\b", re.I)

# --- Writing rule B5, as decision D7 defines it -------------------------------------------
#
# D7 (2026-09-15) ruled that the gate must stop failing rounds on `nominalisations_per_100w` -
# the density of -ción/-miento/-idad words - because that proxy punished the very fix the
# Spanish pass exists to make: translating an English noun to a Spanish noun (release ->
# lanzamiento) is not what B5 forbids. It named three shapes to count instead.
#
# The gate has been reading `prose.get("b5_per_100_sentences")` ever since, and nothing has
# ever written that key: `git log -S` finds one commit, the one that added the consuming line.
# So the value was None in all 19 snapshots, the verdict was "unmeasurable", and it was never
# appended to the failures. D7 has never once been enforced. These three patterns are it.
#
# It is a regex over Spanish and D7 says so plainly: it has false positives ("la versión del
# lanzamiento" reads as a chain) and will miss unusual light verbs. That is tolerable ONLY
# because it is gated as a regression - a false positive present before and after costs
# nothing - and because the suffix density stays visible as info.
# `-sión/-siones` is the same nominalising family after a sibilant stem - regresión,
# decisión, revisión, precisión - and D7 names only "-ción, -miento, -idad, -anza,
# -encia". Its own cited S28 regression is "regresiones del emparejamiento", which that
# list cannot match, so the decision as written could not catch the case it was written
# for. Found by running D7's four examples against the implementation.
_NOM = r"\w*(?:ci[oó]n|ciones|si[oó]n|siones|miento|mientos|idad|idades|anza|anzas|encia|encias)"

#: 1. A nominalisation doing the acting, where a verb should. D7's example:
#:    "La validación del registro produce el rechazo" -> "el validador rechaza el registro".
B5_ACTOR = re.compile(
    rf"(?:^|(?<=[.!?;:]\s))\s*(?:La|El|Las|Los)\s+{_NOM}\b[^.!?;]{{0,60}}?"
    rf"\s(?:produce|produjo|genera|generó|provoca|causa|permite|impide|requiere|exige|"
    rf"determina|afecta|garantiza|implica|evita)\b", re.I | re.M)

#: 2. A light verb carrying an action that belongs in the noun. "realizar la comprobación".
B5_LIGHT = re.compile(
    rf"\b(?:realiza|realizar|realizan|efect[uú]a\w*|efectuar|llevar\s+a\s+cabo|lleva\s+a\s+cabo|"
    rf"proceder\s+a|procede\s+a|proporcionar|proporciona)\s+"
    rf"(?:la|el|las|los|una|un|unas|unos)?\s*{_NOM}\b", re.I)

#: 3. Nominalisations stacked with `de`. "la ejecución de la validación".
# `del?` because Spanish contracts de+el. The first version required whitespace after "de",
# so "regresiones DEL emparejamiento" - D7's own cited S28 regression - never matched, and
# neither did the false positive D7 admits to ("la versión del lanzamiento"). Running the
# decision's four examples against the code is what found both.
B5_CHAIN = re.compile(rf"\b{_NOM}\s+del?\s+(?:la|el|las|los|una|un)?\s*{_NOM}\b", re.I)


def glossary_names() -> set[str]:
    """Terms and aliases the course owns, which B5 must not penalise.

    D7 excludes names: "glossary terms and aliases, and terms a section introduces in bold".
    `validación cruzada` is the name of a thing, not a nominal chain someone should have
    written as a verb. Read straight out of the TS source, the way code_switching_audit.py
    reads the anglicism list, because .fixer/events.json carries only term ids.
    """
    src = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
    out: set[str] = set()
    for m in re.finditer(r"\n    term: '([^']+)'|aliases:\s*\[([^\]]*)\]", src):
        if m.group(1):
            out.add(m.group(1).lower())
        elif m.group(2):
            out.update(a.lower() for a in re.findall(r"['\"]([^'\"]+)['\"]", m.group(2)))
    return {n for n in out if len(n) > 3}


def b5_constructions(text: str, names: set[str]) -> list[str]:
    """Every B5 construction in the text, with the course's own names excluded."""
    bolded = {m.group(1).lower() for m in re.finditer(r"\*\*([^*]{4,60})\*\*", text)}
    exempt = names | bolded
    hits = []
    for rx in (B5_ACTOR, B5_LIGHT, B5_CHAIN):
        for m in rx.finditer(text):
            span = m.group(0).strip()
            low = span.lower()
            if any(n in low for n in exempt):
                continue
            hits.append(span)
    return hits


def syllables(word: str) -> int:
    groups = re.findall(rf"[{VOWELS}]+", word.lower())
    return max(1, len(groups))


def sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p.strip()]


def terminated(text: str) -> str:
    """One prose event, ended so it cannot run into the next one.

    Sections are analysed as all their prose joined by newlines, and the split above only
    breaks after `.`, `!` or `?`. A learning outcome or a tagline is a complete statement
    written without a full stop, so 358 of the course's 6,870 prose events - 305 of them
    outcomes - ran straight into whatever followed. A section's seven outcomes measured as
    one 122-word sentence, and `run_on_sentences` is gated, so a round could be restored
    over a run-on that is really a list.

    Splitting on the newline itself is not the fix: 2,508 prose events contain one inside a
    sentence, and breaking there would cut real sentences in half and hide the long ones
    this measure exists to find.
    """
    text = text.strip()
    return text if re.search(r"[.!?]\s*$", text) else text + "."


def analyse(text: str, names: set[str] | None = None) -> dict:
    words = re.findall(r"\b[\wÁÉÍÓÚÜÑáéíóúüñ]+\b", text)
    sents = sentences(text)
    if not words or not sents:
        return {}
    spw = sum(syllables(w) for w in words) / len(words)
    wps = len(words) / len(sents)
    fh = 206.84 - 60 * spw - 1.02 * wps
    b5 = b5_constructions(text, names if names is not None else set())
    long_s = [s for s in sents if len(re.findall(r"\b\w+\b", s)) > 32]
    runon = [s for s in sents if len(re.findall(r"\b\w+\b", s)) > 45]
    return {
        "words": len(words),
        "sentences": len(sents),
        "words_per_sentence": round(wps, 1),
        "fernandez_huerta": round(fh, 1),
        "long_sentences": len(long_s),
        "run_on_sentences": len(runon),
        # D7: the suffix density stays VISIBLE but is no longer what fails a round.
        "nominalisations_per_100w": round(100 * len(NOMINALISATION.findall(text)) / len(words), 1),
        "b5_nominal_constructions": len(b5),
        "b5_per_100_sentences": round(100 * len(b5) / len(sents), 1),
        "gerunds_per_100w": round(100 * len(GERUND.findall(text)) / len(words), 1),
        "commas_per_sentence": round(text.count(",") / len(sents), 1),
        "meta_leaks": len(META.findall(text)),
    }


def main() -> int:
    report_lock.refuse_if_busy(__file__)
    if not EVENTS.exists():
        proc = subprocess.run(["npx", "tsx", "scripts/course_event_extractor.mts"],
                              cwd=ROOT, capture_output=True, text=True)
        EVENTS.parent.mkdir(parents=True, exist_ok=True)
        EVENTS.write_text(proc.stdout, encoding="utf-8")
    payload = json.loads(EVENTS.read_text(encoding="utf-8"))

    PROSE = {"theory.paragraph", "jobRelevance", "tagline", "outcome", "theory.callout",
             "ido.why", "ido.preamble", "ido.retrospective", "wedo.preamble",
             "wedo.instruction", "youdo.context"}
    by_section: dict[str, list[str]] = {}
    for e in payload["events"]:
        if e["kind"] in PROSE and e["learner_visible"]:
            by_section.setdefault(e["section_id"], []).append(e["text"])

    names = glossary_names()
    rows = {}
    for i, slug in enumerate(payload["active_section_ids"], 1):
        text = "\n".join(terminated(t) for t in by_section.get(slug, []))
        if not text:
            continue
        m = analyse(text, names)
        m["section"] = f"S{i:02d}"
        rows[f"S{i:02d}"] = m

    OUT.write_text(json.dumps(rows, indent=1, ensure_ascii=False), encoding="utf-8")
    wanted = sys.argv[1:] or sorted(rows)
    print(f"{'sec':5s} {'FH':>6s} {'w/sent':>7s} {'long':>5s} {'runon':>6s} {'nomin':>6s} {'ger':>5s} {'com':>5s}")
    for s in wanted:
        r = rows.get(s)
        if not r:
            continue
        print(f"{s:5s} {r['fernandez_huerta']:6.1f} {r['words_per_sentence']:7.1f} "
              f"{r['long_sentences']:5d} {r['run_on_sentences']:6d} "
              f"{r['nominalisations_per_100w']:6.1f} {r['gerunds_per_100w']:5.1f} "
              f"{r['commas_per_sentence']:5.1f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
