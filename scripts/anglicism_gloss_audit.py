#!/usr/bin/env python3
"""Flag English technical terms used in learner prose without a Spanish gloss.

The editorial protocol allows — and the course deliberately keeps — the English
terms practitioners actually meet. What it requires is that each one be
*explained in Spanish the first time it appears*, then used consistently.

A term counts as explained at its first use when any of these holds:

  * an inline gloss sits next to it: parentheses, an em-dash aside, or one of
    "esto es" / "es decir" / "o sea" / "en español";
  * the sentence defines it outright ("X es ...", "se le llama X");
  * it is registered in the glossary SSOT with a firstSectionId at or before
    this section, so the hover hint carries the definition.

Anything else is an anglicism dropped on the learner. Exit 1 if any are found.
Writes course-state/anglicism_gloss_audit.json.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/anglicism_gloss_audit.json"

#: English technical vocabulary that must be glossed on first use. Deliberately
#: excludes bare library/API identifiers (pandas, numpy, loc, iloc) — those are
#: names the learner types, not concepts needing translation.
TERMS = [
    "pushdown", "row group", "row groups", "pruning", "backpropagation",
    "overfitting", "leakage", "backtest", "guardrail", "peeking", "estimand",
    "outcome", "baseline", "bagging", "boosting", "embedding", "prompt",
    "throughput", "watermark", "blast radius", "small files", "rollback",
    "idempotent", "bootstrap", "resampling", "oversample", "undersample",
    "stratified", "holdout", "drift", "skew", "trade-off", "deadlock",
    "race condition", "backfill", "lineage", "freshness", "chunking",
    "retrieval", "grounding", "hallucination", "red teaming", "sandbox",
    "rate limit", "circuit breaker", "feature store", "warm start",
    # Added after a discovery pass over learner prose rather than guessed: these
    # are the high-frequency English concept words the course actually uses.
    # Bare code identifiers the learner types (`pass`, `null`, `str`) are
    # excluded — those are syntax, not vocabulary needing translation.
    # `ranking` is deliberately absent: the RAE accepts it as Spanish and it is
    # ordinary usage in Peru. Glossing a naturalised word patronises the reader,
    # which the protocol forbids as firmly as dropping an unexplained one.
    "rollback", "runbook", "matching", "seed", "recall", "precision",
    "checkpoint", "blocking", "checklist", "factory", "loop",
    "review", "ticket", "assess", "dataset", "mock", "timeout", "pipeline",
    "wrapper", "parser", "payload", "endpoint", "commit", "branch", "merge",
    "cache", "batch", "stub", "fixture", "linter", "scraping", "crawler",
    # Added after an independent review (Phase E) found 17 unexplained terms the
    # 79-word list could not see. The list was written by the same author as the
    # content, so it encoded the same blind spots — which is precisely the failure
    # mode an outside reader exists to catch.
    #
    # Metric acronyms: a beginner cannot expand these from context.
    "TPR", "TNR", "PPV", "NPV", "FPR", "AUC", "MAE", "RMSE",
    # Operations vocabulary.
    "RTO", "RPO", "SLO", "SLI", "ADR", "DLQ", "HITL",
    # Algorithms named only by initials.
    "BFS", "DFS",
    # Ensemble vocabulary introduced without translation.
    "bagging", "boosting",
    # Tooling a beginner meets before it is introduced.
    "Pyodide", "pytest", "factory", "smoke test",
    # Terms the course uses constantly and never defines in Spanish.
    "schema", "gate", "spans", "skew",
]

GLOSS_NEAR = re.compile(
    r"(\(|—|–|,\s*(esto es|es decir|o sea|en español)|:\s|\bse le llama\b|\bes\b)",
    re.I,
)


def prose_of(text: str) -> str:
    """Learner-visible prose: strip code templates and fenced blocks."""
    out = re.sub(r"```[\s\S]*?```", " ", text)
    out = re.sub(r"\bcode:\s*`[\s\S]*?`", " ", out)
    out = re.sub(r"\boutput:\s*`[\s\S]*?`", " ", out)
    return out


def glossary_available() -> dict[str, int]:
    """alias(lower) -> index of the section where its hover hint becomes available."""
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    order = [m.group(1) for m in re.finditer(r"from '\./sections/([^']+)'", index)]
    pos: dict[str, int] = {}
    for n, base in enumerate(order, start=1):
        t = (SECTIONS / f"{base}.ts").read_text(encoding="utf-8")
        pos[re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", t).group(1)] = n
    terms = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
    avail: dict[str, int] = {}
    for m in re.finditer(
        r"aliases:\s*\[([\s\S]*?)\][\s\S]*?firstSectionId:\s*'([^']+)'", terms
    ):
        first = pos.get(m.group(2))
        if first is None:
            continue
        for alias in re.findall(r"['\"]([^'\"]+)['\"]", m.group(1)):
            key = alias.lower()
            avail[key] = min(avail.get(key, 99), first)
    return avail


def main() -> int:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    order = [m.group(1) for m in re.finditer(r"from '\./sections/([^']+)'", index)]
    avail = glossary_available()
    seen: dict[str, int] = {}
    findings: list[dict] = []

    for n, base in enumerate(order, start=1):
        text = (SECTIONS / f"{base}.ts").read_text(encoding="utf-8")
        sid = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text).group(1)
        prose = prose_of(text)
        for term in TERMS:
            if term in seen:
                continue
            m = re.search(
                r"(?i)(?<![\w/-])" + re.escape(term) + r"(?![\w/-])", prose
            )
            if not m:
                continue
            seen[term] = n
            if avail.get(term.lower(), 99) <= n:
                continue  # glossary hover carries the definition here
            after = prose[m.end() : m.end() + 70]
            # A gloss may sit on either side: "**pushdown** (empuje de…)" or the
            # Spanish-first form "**split estratificado** (*stratified split*)".
            before = prose[max(0, m.start() - 70) : m.start()]
            if GLOSS_NEAR.search(after[:60]) or re.search(
                r"(\*\*[^*]{3,40}\*\*|\b[a-záéíóúñ]{4,}\b)\s*[(\[]\s*\*?$", before
            ):
                continue
            # Terse metadata (outcomes, taglines, resource notes) is a headline,
            # not teaching prose; a missing gloss there is worth knowing but is
            # not the same defect as dropping a term mid-explanation.
            head = prose[max(0, m.start() - 260) : m.start()]
            terse = bool(re.search(r"(tagline:|note:|text:\s*\"|jobRelevance:)", head))
            findings.append(
                {
                    "term": term,
                    "section": sid,
                    "index": n,
                    "severity": "INFO" if terse else "P1",
                    "where": "metadata" if terse else "teaching prose",
                    "excerpt": prose[max(0, m.start() - 70) : m.end() + 90]
                    .replace("\\n", " ")
                    .strip()[:220],
                }
            )

    report = {
        "terms_checked": len(TERMS),
        "terms_found_in_prose": len(seen),
        "unglossed_first_uses": sum(1 for f in findings if f["severity"] == "P1"),
        "info_metadata": sum(1 for f in findings if f["severity"] == "INFO"),
        "ok": not any(f["severity"] == "P1" for f in findings),
        "findings": findings,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        json.dumps(
            {k: v for k, v in report.items() if k != "findings"},
            indent=2,
            ensure_ascii=False,
        )
    )
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
