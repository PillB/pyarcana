#!/usr/bin/env python3
"""CONTENT-001 privacy language audit for course section sources.

Scans src/lib/course/sections/s*.ts for wording that equates matching/scores
with fraude / parentesco / colusión as automatic proof.

Classifies each hit:
  OK   — context explicitly denies automatic inference, or the term appears
         only as a wrong quiz option / negative teaching example
  RISK — affirmative or ambiguous claim that matching/score implies fraud,
         kinship or collusion, especially in student-facing theory/youDo

Writes course-state/privacy_audit_report.json
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src" / "lib" / "course" / "sections"
OUT_PATH = ROOT / "course-state" / "privacy_audit_report.json"

# Primary risk lexicon (keyword/regex family)
PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("fraude", re.compile(r"fraude", re.I)),
    ("parentesco", re.compile(r"parentesco", re.I)),
    ("colusion", re.compile(r"colusi[oó]n", re.I)),
    ("is_fraud", re.compile(r"is_fraud", re.I)),
    ("es_fraude", re.compile(r"es_fraude", re.I)),
    ("fraud_label", re.compile(r"fraud_label", re.I)),
    ("auto_fraude", re.compile(r"auto[-_]?fraude|fraude\s+autom[aá]tic", re.I)),
    ("auto_parentesco", re.compile(r"auto[-_]?parentesco|parentesco\s+autom[aá]tic", re.I)),
    ("match_implica", re.compile(
        r"(match|matching|score|similaridad|er|entity\s*resolution).{0,40}"
        r"(implica|prueba|confirma|demuestra|es\s+prueba|veredicto).{0,40}"
        r"(fraude|parentesco|colusi)",
        re.I | re.S,
    )),
    ("score_as_verdict", re.compile(
        r"(score|umbral|threshold).{0,30}"
        r"(=\s*fraude|→\s*fraude|->\s*fraude|como\s+fraude|label\s+de\s+fraude)",
        re.I,
    )),
    ("centralidad_culpabilidad", re.compile(
        r"centralidad.{0,30}(culpabilidad|fraude|culpable)", re.I
    )),
]

# Phrases that make a hit safe (denial / negative teaching)
OK_MARKERS = re.compile(
    r"(?:"
    r"no\s+implica|"
    r"no\s+prueba|"
    r"no\s+es\s+(prueba|veredicto|etiqueta|label|culpab)|"
    r"no\s+(infier|afirma|afirmes|invent(?:es|ar)?|emite|declara|decide|confirma|traduzcas|uses)|"
    r"no\s+[“\"]?confirma|"
    r"no\s+se\s+(afirma|convierte|infier|etiquet)|"
    r"no\s+son\s+veredict|"
    r"no\s+como\s+veredicto|"
    r"no\s+veredicto|"
    r"sin\s+veredicto|"
    r"no\s+parentesco|"
    r"no\s+de\s+parentesco|"
    r"no\s+de\s+fraude|"
    r"ni\s+fraude|"
    r"ni\s+label\s+de\s+fraude|"
    r"ni\s+parentesco|"
    r"no\s+fraude|"
    r"no\s+etiqueta|"
    r"no\s+es\s+acusar|"
    r"no\s+[“\"]?fraudes?\s+detectad|"
    r"no\s+culpa|"
    r"no\s+relaci[oó]n\s+ni\s+riesgo|"
    r"\*\*no\*\*\s+(prueba|relaci|infer)|"
    r"sin\s*(?:\*+)?\s*(inferencia|claims?|claim|label|etiquet|auto|is_fraud|PII)|"
    r"sin\s*(?:\*+)?\s*(fraude|parentesco|inventar)|"
    r"sin\s*(?:\*+)?\s*afirmar|"
    r"nunca\s+salida\s+sin\s+evidencia|"
    r"nunca\s+para\s+inferir|"
    r"nunca\s+\w*\s*(prueba|etiqueta|infier|autom|digas|afirma)|"
    r"nunca\s+(prueba|etiqueta|infier|autom)|"
    r"fraud_labels\s+0|"
    r"fraud_labels.{0,16}0|"
    r"prohibir\s+inferencia|"
    r"ning[uú]n\s+m[eé]todo\s+is_fraud|"
    r"cero\s+labels?\s+de\s+fraude|"
    r"out_of_scope|"
    r"\bnogo\b|"
    r"auto_fraud_label|"  # listed as forbidden constraint/nogo in capstone
    r"real_pii|"
    r"≠|!=|"
    r"no_es_fraude|"
    r"no_parentesco|"
    r"match_no_es_fraude|"
    r"score_no_es_fraude|"
    r"match_no_es|"
    r"fraud_labels\s*[\"']?\s*[:=]\s*0|"
    r"fraud_labels[\"']?\s*:\s*0|"
    r"['\"]fraud_labels['\"]\s*:\s*0|"
    r"is_fraud['\"]?\s*,?\s*False|"
    r"er_is_fraud\s+False|"
    r"is_fraud\s+False|"
    r"prohibid|"
    r"evitar\s+APIs\s+de\s+fraude|"
    r"evitar.*(?:fraude|parentesco)|"
    r"ausencia\s+de\s+APIs|"
    r"deliberadamente\s+no\s+hay|"
    r"sin\s+auto|"
    r"cero\s+labels?\s+autom|"
    r"solo\s+evidencia|"
    r"evidencia\s+(d[eé]bil|de\s+contacto|para\s+revisi|se\s+conserva)|"
    r"evidencia\s+sin\s+parentesco|"
    r"revisi[oó]n\s+humana|"
    r"human[- ]?in[- ]?the[- ]?loop|"
    r"needs_review|"
    r"necesita_revisi|"
    r"disclaimer|"
    r"campos\s+de\s+texto|"
    r"no\s+una\s+afirmaci[oó]n\s+geneal|"
    r"wrong|incorrect|distract|"
    r"correctIndex|"
    r"opciones?\s+incorrect|"
    r"ER\s*≠|"
    r"matching\s+no\s+|"
    r"score\s+no\s+|"
    r"scores?\s+son\s+\*\*datos\*\*|"
    r"scores?\s+son\s+datos|"
    r"no\s+decisiones\s+legales|"
    r"gate\s+privacy|"
    r"sin\s+inferencia\s+de\s+fraude|"
    r"pol[ií]tica\s+[eé]tic|"
    r"riesgo\s+legal|"
    r"fuente\s+autoritativa"
    r")",
    re.I,
)

# Strong affirmative risk markers (when not denied nearby).
# Denials are handled first by OK_MARKERS; these only fire if denial missing.
RISK_AFFIRM = re.compile(
    r"(?:"
    r"\bimplica\s+(fraude|parentesco|colusi)|"
    r"\bprueba\s+(de\s+)?(fraude|parentesco|colusi)|"
    r"\bconfirma\s+(fraude|parentesco|colusi)|"
    r"\bdemuestra\s+(fraude|parentesco|colusi)|"
    r"veredicto\s+(legal\s+)?de\s+(fraude|parentesco)|"
    r"fraude\s+confirmado|"
    r"fraude\s+detectado|"
    r"\bes\s+fraude\b|"
    # Note: "label/etiqueta de fraude automático" almost always appears in denials
    # in this course; covered by OK_MARKERS. Affirmative product claims use is_fraud=True.
    r"is_fraud\s*=\s*True|"
    r"es_fraude\s*=\s*True|"
    r"alta\s+centralidad\s*→\s*fraude|"
    r"match(?:ing)?\s*=\s*fraude|"
    r"score\s*=\s*fraude"
    r")",
    re.I,
)

# Structural region heuristic from TS content (rough, line-based)
REGION_MARKERS = [
    (re.compile(r"\btheory\s*:"), "theory"),
    (re.compile(r"\biDo\s*:"), "iDo"),
    (re.compile(r"\bweDo\s*:"), "weDo"),
    (re.compile(r"\byouDo\s*:"), "youDo"),
    (re.compile(r"\bselfCheck\s*:"), "selfCheck"),
    (re.compile(r"\bresources\s*:"), "resources"),
    (re.compile(r"\bjobRelevance\s*:"), "jobRelevance"),
    (re.compile(r"\blearningOutcomes\s*:"), "learningOutcomes"),
]

STUDENT_FACING = {"theory", "youDo", "jobRelevance", "iDo", "weDo"}


def detect_regions(lines: list[str]) -> list[str]:
    """Return region name per line index."""
    regions = ["preamble"] * len(lines)
    current = "preamble"
    for i, line in enumerate(lines):
        for pat, name in REGION_MARKERS:
            if pat.search(line):
                current = name
                break
        regions[i] = current
    return regions


def window_text(lines: list[str], idx: int, radius: int = 3) -> str:
    start = max(0, idx - radius)
    end = min(len(lines), idx + radius + 1)
    return "\n".join(lines[start:end])


def classify(context: str, match_text: str, region: str = "") -> tuple[str, str]:
    """Return (classification, reason)."""
    # Explicit denial / negative teaching in window → OK (most course content)
    if OK_MARKERS.search(context):
        return "OK", "context explicitly denies automatic inference or is negative teaching"

    # Quiz / options / selfCheck distractors (wrong answers often say "fraude")
    if region == "selfCheck" or re.search(
        r"options:|correctIndex|question:|explanation:", context, re.I
    ):
        return "OK", "quiz/selfCheck option or explanation context"

    # Rubric criteria mentioning privacy gates
    if re.search(r"criterion:|weight:\s*[\"']gate|Privacidad", context):
        return "OK", "rubric/privacy gate criterion"

    # Affirmative risk without denial
    if RISK_AFFIRM.search(context) or RISK_AFFIRM.search(match_text):
        return "RISK", "affirmative fraud/parentesco/colusión claim without clear denial"

    # is_fraud / es_fraude identifiers without False/denial
    if re.search(r"is_fraud|es_fraude|fraud_label", match_text, re.I):
        if re.search(
            r"False|=\s*0|:\s*0|no_|not_|ausencia|evitar|sin\s|deliberadamente|prohib|debe\s+ser\s+0",
            context,
            re.I,
        ):
            return "OK", "identifier set to False/0 or denied"
        return "RISK", "fraud identifier without safe assignment/denial"

    # Co-occurrence of keyword with matching WITHOUT denial → residual RISK
    if re.search(
        r"(match|matching|score|similaridad|entity\s*resolution|"
        r"fuzzy|rapidfuzz|shared\s+contact|centralidad|detecta)",
        context,
        re.I,
    ) and re.search(r"fraude|parentesco|colusi", context, re.I):
        return "RISK", "keyword co-occurs with matching/score without denial in window"

    # Isolated keyword without equating match→fraud
    return "OK", "isolated keyword without claim equating match→fraud"


def scan_file(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    regions = detect_regions(lines)
    hits: list[dict] = []
    seen: set[tuple[int, str]] = set()

    for line_no, line in enumerate(lines, start=1):
        for family, pat in PATTERNS:
            for m in pat.finditer(line):
                key = (line_no, family)
                if key in seen:
                    continue
                seen.add(key)
                ctx = window_text(lines, line_no - 1, radius=5)
                region = regions[line_no - 1]
                classification, reason = classify(ctx, m.group(0), region=region)
                # Elevate bare ambiguous co-occurrence only in student-facing
                if classification == "RISK" and region == "selfCheck":
                    # Quiz options often list "Fraude" as wrong answer
                    if OK_MARKERS.search(ctx) or re.search(
                        r"correctIndex|options:|explanation:", ctx, re.I
                    ):
                        # If explanation denies, OK; if option is wrong distractor, usually OK
                        # Only keep RISK if the *correct* answer affirms fraud from match
                        if re.search(
                            r"correctIndex:\s*[023]|correctIndex:\s*1", ctx
                        ):
                            # Check if correct option text is the fraud claim
                            # heuristic: if explanation denies → OK
                            if re.search(
                                r"no\s+(implica|prueba|es)|≠|error de matching|evidencia",
                                ctx,
                                re.I,
                            ):
                                classification = "OK"
                                reason = "quiz distractor / explanation denies auto-fraud"
                            elif "Fraude" in line or "parentesco" in line.lower():
                                # often the wrong option itself
                                classification = "OK"
                                reason = "likely quiz option list (selfCheck)"
                hits.append(
                    {
                        "file": str(path.relative_to(ROOT)),
                        "line": line_no,
                        "region": region,
                        "pattern_family": family,
                        "match": m.group(0)[:80],
                        "line_text": line.strip()[:240],
                        "context": ctx[:600],
                        "classification": classification,
                        "reason": reason,
                        "student_facing": region in STUDENT_FACING,
                    }
                )
    return hits


def main() -> int:
    files = sorted(SECTIONS_DIR.glob("s*.ts"))
    all_hits: list[dict] = []
    for f in files:
        all_hits.extend(scan_file(f))

    by_class = Counter(h["classification"] for h in all_hits)
    by_file = defaultdict(lambda: {"OK": 0, "RISK": 0, "total": 0})
    for h in all_hits:
        by_file[h["file"]][h["classification"]] += 1
        by_file[h["file"]]["total"] += 1

    risk_hits = [h for h in all_hits if h["classification"] == "RISK"]
    risk_student = [
        h for h in risk_hits if h["student_facing"] and h["region"] in ("theory", "youDo")
    ]

    # Priority fix list: theory/youDo RISK first
    fix_candidates = sorted(
        risk_student,
        key=lambda h: (h["file"], h["line"]),
    )

    report = {
        "version": "1.0",
        "issue_id": "CONTENT-001",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scan_root": str(SECTIONS_DIR.relative_to(ROOT)),
        "files_scanned": len(files),
        "patterns": [name for name, _ in PATTERNS],
        "summary": {
            "total_hits": len(all_hits),
            "OK": by_class.get("OK", 0),
            "RISK": by_class.get("RISK", 0),
            "RISK_theory_or_youDo": len(risk_student),
            "RISK_other_regions": len(risk_hits) - len(risk_student),
        },
        "by_file": {
            k: dict(v)
            for k, v in sorted(by_file.items(), key=lambda kv: (-kv[1]["RISK"], kv[0]))
        },
        "fix_candidates_theory_youDo": fix_candidates,
        "all_risk_hits": risk_hits,
        "hits": all_hits,
        "notes": [
            "OK = explicit denial of automatic fraude/parentesco/colusión inference, "
            "or negative teaching / quiz distractor.",
            "RISK = affirmative or ambiguous match/score→fraud claim without denial.",
            "Priority fixes: RISK in theory/youDo student-facing prose.",
            "Do not treat rubric criteria 'sin inferencia de fraude' as RISK (denial).",
        ],
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {OUT_PATH.relative_to(ROOT)}")
    print(
        f"files={len(files)} hits={len(all_hits)} "
        f"OK={by_class.get('OK', 0)} RISK={by_class.get('RISK', 0)} "
        f"RISK_theory_youDo={len(risk_student)}"
    )
    if fix_candidates:
        print("Top fix candidates (theory/youDo):")
        for h in fix_candidates[:25]:
            print(f"  {h['file']}:{h['line']} [{h['region']}] {h['line_text'][:100]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
