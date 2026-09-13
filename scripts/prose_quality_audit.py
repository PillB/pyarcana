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

ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / ".fixer/events.json"
OUT = ROOT / "course-state/prose_quality_report.json"

VOWELS = "aeiouáéíóúü"
NOMINALISATION = re.compile(r"\b\w+(ción|ciones|miento|mientos|idad|idades|anza|encia)\b", re.I)
GERUND = re.compile(r"\b\w+(ando|iendo)\b", re.I)
META = re.compile(r"\b(TODO|FIXME|as an AI|como modelo|lorem ipsum)\b", re.I)


def syllables(word: str) -> int:
    groups = re.findall(rf"[{VOWELS}]+", word.lower())
    return max(1, len(groups))


def sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p.strip()]


def analyse(text: str) -> dict:
    words = re.findall(r"\b[\wÁÉÍÓÚÜÑáéíóúüñ]+\b", text)
    sents = sentences(text)
    if not words or not sents:
        return {}
    spw = sum(syllables(w) for w in words) / len(words)
    wps = len(words) / len(sents)
    fh = 206.84 - 60 * spw - 1.02 * wps
    long_s = [s for s in sents if len(re.findall(r"\b\w+\b", s)) > 32]
    runon = [s for s in sents if len(re.findall(r"\b\w+\b", s)) > 45]
    return {
        "words": len(words),
        "sentences": len(sents),
        "words_per_sentence": round(wps, 1),
        "fernandez_huerta": round(fh, 1),
        "long_sentences": len(long_s),
        "run_on_sentences": len(runon),
        "nominalisations_per_100w": round(100 * len(NOMINALISATION.findall(text)) / len(words), 1),
        "gerunds_per_100w": round(100 * len(GERUND.findall(text)) / len(words), 1),
        "commas_per_sentence": round(text.count(",") / len(sents), 1),
        "meta_leaks": len(META.findall(text)),
    }


def main() -> int:
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

    rows = {}
    for i, slug in enumerate(payload["active_section_ids"], 1):
        text = "\n".join(by_section.get(slug, []))
        if not text:
            continue
        m = analyse(text)
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
