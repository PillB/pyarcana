#!/usr/bin/env python3
"""How much English leaks into the course's Spanish prose.

The Spanish quality audit counts a great deal - fragments, spacing, agreement - but
reads code as prose, so most of what it flags is `.items()`, `$?` or a correct
half-open interval. Meanwhile it says nothing about what a Spanish reader actually
trips on: English dropped into Spanish sentences. "Gate de admisión capa 1 (mime
allowlist + size cap)". "El set de matching colapsa relabels". "En el orden del
control plane".

This is built for precision, not recall. It is a regression check - did English
leakage go down - and a finding it raises must be real. So it only counts signals
that are unambiguous in Spanish text once code is removed:

  * English function words that are not also Spanish words (the, with, from, should...)
  * English technical nouns from the anglicism gate's curated list, plus the leaks
    observed in this course's own prose

Code spans, fenced code, identifiers, URLs and CASO-/S01-style ids are stripped first.
Terms the course deliberately keeps and glosses are still counted as English: this
measures how English the prose reads, not whether a term was explained - that is the
anglicism gate's job.

  python3 scripts/code_switching_audit.py            # per-section table
  python3 scripts/code_switching_audit.py S01 S02    # just these
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / ".fixer/events.json"
OUT = ROOT / "course-state/code_switching_report.json"

# English function words that are not Spanish words. "a", "no", "me", "con", "de",
# "son", "fin", "real", "animal" and similar are excluded on purpose.
FUNCTION = set("""
the and with from this that these those is are was were be been being should would
could must will shall can cannot not only before after when where which while whose
into onto upon about above below between through without within against during
each every both either neither than then there here what who how why
""".split())

# Ordinary English words with a standard Spanish rendering. A hit here is a translation
# that was skipped, not a technical term the course chose to keep.
ORDINARY = set("""
owner owners check checks review reviews reviewer release releases issue issues
request requests response responses deadline deadlines scope scoring ranking tracking
backlog ticket tickets output outputs input inputs threshold thresholds workflow
workflows golden matching relabel relabels framing split splits body timestamp
""".split())

# Technical vocabulary the editorial protocol deliberately keeps, provided it is glossed
# in Spanish at first use. Counted separately: its presence is policy, not a defect.
KEPT_TECHNICAL = set("""
pipeline pipelines schema schemas payload payloads feature features fixture fixtures
gate gates allowlist denylist provenance fold folds staging rollout logging accuracy
""".split())

# Acronyms are expanded once and then used (writing rule A3); never leakage.
ACRONYM = re.compile(r"^[A-Z]{2,6}s?$")

def anglicism_terms() -> set[str]:
    src = (ROOT / "scripts/anglicism_gloss_audit.py").read_text(encoding="utf-8")
    block = src[src.index("TERMS = ["):]
    block = block[:block.index("]")]
    return {t.lower() for t in re.findall(r'"([^"]+)"', block) if " " not in t}


STRIP = [
    re.compile(r"```[\s\S]*?```"),            # fenced code
    # An English phrase that its own sentence translates on the spot is a gloss, not a leak.
    # The course teaches an initialism by expanding it and rendering it immediately:
    #   `NaN` (*not a number*, «no es un número»)
    # `not` counted as English leakage, so S09's round - which took the course from 400
    # surprising uses to 367 - was restored for explaining what NaN stands for. This file's
    # own contract is that "a finding it raises must be real", and by the campaign's rules
    # the alternatives are worse: drop the expansion and the acronym is arbitrary, or drop
    # the gloss and the English is genuinely unexplained.
    # Narrow on purpose: the span has to be italic AND be followed by a Spanish gloss in
    # guillemets. `*emphasis*` on its own, and English with no translation beside it, are
    # both still counted.
    re.compile(r"(?<!\*)\*[^*\n]{2,80}\*(?=[,;:]?\s*«)"),
    re.compile(r"`[^`]*`"),                   # inline code
    re.compile(r"https?://\S+"),              # urls
    re.compile(r"\b[A-Z]{2,}[-_][A-Z0-9_-]+\b"),  # CASO-LIM-001, CP-N1-A
    re.compile(r"\bS\d{2}(?:-T\d-[AB](?:-E\d|-DEMO)?)?\b"),  # section / exercise ids
    re.compile(r"\b\w+_\w+\b"),               # snake_case identifiers
    re.compile(r"\b\w+\.\w+\b"),              # dotted names
    re.compile(r"\*\*|__"),                   # emphasis markers
]


# Lines that are code even without backticks. S42 carried Python straight into hint
# text, and every `and` in `return change == "add_optional" and old_ok` counted as
# English prose.
CODE_LINE = re.compile(
    r"^\s*(?:def |return |import |from \w+ import|class |if .*:$|for .*:$|while .*:$|"
    r"print\(|elif |else:|try:|except|with .*:$|@\w+)"
    r"|==|!=|->|\(\)|\w+\(.*\)\s*$"
)


def clean(text: str) -> str:
    text = "\n".join(line for line in text.split("\n") if not CODE_LINE.search(line))
    for rx in STRIP:
        text = rx.sub(" ", text)
    return text


def main() -> int:
    if not EVENTS.exists():
        EVENTS.parent.mkdir(parents=True, exist_ok=True)
        EVENTS.write_text(subprocess.run(["npx", "tsx", "scripts/course_event_extractor.mts"],
                                         cwd=ROOT, capture_output=True, text=True).stdout,
                          encoding="utf-8")
    payload = json.loads(EVENTS.read_text(encoding="utf-8"))
    kept = KEPT_TECHNICAL | anglicism_terms()

    PROSE = {"theory.paragraph", "tagline", "jobRelevance", "outcome", "theory.callout",
             "ido.preamble", "ido.why", "ido.retrospective", "ido.description",
             "wedo.preamble", "wedo.instruction", "wedo.hint", "wedo.retrospective",
             "youdo.context", "youdo.objective", "youdo.requirement",
             "selfcheck.question", "selfcheck.option", "selfcheck.explanation"}

    rows = {}
    for i, slug in enumerate(payload["active_section_ids"], 1):
        tag = f"S{i:02d}"
        words = func = leak = keptn = 0
        hits: dict[str, int] = {}
        worst = []
        for e in payload["events"]:
            if e["section_id"] != slug or e["kind"] not in PROSE or not e["learner_visible"]:
                continue
            toks = [t for t in re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+", clean(e["text"]))
                    if not ACRONYM.match(t)]
            words += len(toks)
            ef = [t for t in toks if t.lower() in FUNCTION]
            eo = [t for t in toks if t.lower() in ORDINARY]
            ek = [t for t in toks if t.lower() in kept and t.lower() not in ORDINARY]
            func += len(ef); leak += len(eo); keptn += len(ek)
            for t in ef + eo:
                hits[t.lower()] = hits.get(t.lower(), 0) + 1
            avoid = len(ef) + len(eo)
            if toks and avoid >= 2 and avoid / len(toks) >= 0.08:
                worst.append({"location": e["location"], "avoidable_english": avoid,
                              "words": len(toks), "text": e["text"][:200]})
        if not words:
            continue
        rows[tag] = {
            "section": tag, "prose_words": words,
            "english_function_words": func,
            "ordinary_english_words": leak,
            "kept_technical_terms": keptn,
            # the actionable number: English that has a plain Spanish rendering
            "avoidable_english_per_1000": round(1000 * (func + leak) / words, 1),
            "top_terms": sorted(hits.items(), key=lambda kv: -kv[1])[:10],
            "worst_passages": sorted(worst, key=lambda w: -w["avoidable_english"] / w["words"])[:8],
        }

    OUT.write_text(json.dumps(rows, indent=1, ensure_ascii=False), encoding="utf-8")
    wanted = sys.argv[1:] or sorted(rows)
    print(f"{'sec':5s} {'words':>7s} {'fn':>4s} {'ord':>4s} {'kept':>5s} {'avoid/1k':>9s}  top avoidable")
    for t in wanted:
        r = rows.get(t)
        if r:
            top = ", ".join(f"{k}:{v}" for k, v in r["top_terms"][:5])
            print(f"{t:5s} {r['prose_words']:7d} {r['english_function_words']:4d} "
                  f"{r['ordinary_english_words']:4d} {r['kept_technical_terms']:5d} "
                  f"{r['avoidable_english_per_1000']:9.1f}  {top}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
