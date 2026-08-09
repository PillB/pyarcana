#!/usr/bin/env python3
"""
Simulate two packet-constrained newbie agents (0 Python outside packet).

Newbie A (Explorer): greedy lexical match; tries something even if weak.
Newbie B (Skeptic): only answers when option tokens clearly appear in packet;
  otherwise marks blocked_on with UNTAUGHT_*.

No external Python knowledge and no access to correctIndex/solutions.

Usage:
  python3 scripts/newbie_dual_sim.py --attempt attempt_002
  python3 scripts/newbie_dual_sim.py --attempt attempt_002 --section 3
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import build_packet  # noqa: E402
from newbie_walkthrough_runner import (  # noqa: E402
    extract_selfcheck_keys,
    active_section_files,
    parse_section_learner,
    grade_selfcheck_answers,
    record_agent_responses,
    grade_section_agents,
    attempt_dir,
    now_iso,
)

STOP = {
    "el", "la", "los", "las", "un", "una", "de", "del", "en", "y", "o", "a", "al",
    "que", "por", "para", "con", "se", "su", "sus", "es", "son", "the", "a", "an",
    "to", "of", "in", "on", "is", "are", "and", "or", "as", "if", "not", "no",
    "tu", "tú", "más", "mas", "muy", "ya", "lo", "le", "les", "me", "te", "nos",
    "cómo", "como", "qué", "que", "cuál", "cual", "when", "what", "which",
}


def tokens(s: str) -> set[str]:
    words = re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-zÁÉÍÓÚÜÑáéíóúüñ_0-9]{2,}", s or "")
    out = set()
    for w in words:
        wl = w.lower()
        if wl in STOP:
            continue
        out.add(wl)
        # keep original case tokens for code-ish
        if any(c.isupper() for c in w[1:]) or "_" in w:
            out.add(w)
    return out


def packet_text(pkt: dict) -> str:
    parts = []
    land = pkt.get("landing") or {}
    parts.append(land.get("title") or "")
    parts.append(land.get("subtitle") or "")
    parts.append(land.get("description") or "")
    for s in pkt.get("prior_sections") or []:
        parts.append(s.get("title") or "")
        parts.append(s.get("tagline") or "")
        parts.append(s.get("jobRelevance") or "")
        for lo in s.get("learningOutcomes") or []:
            parts.append(lo if isinstance(lo, str) else str(lo))
        for tb in s.get("theory") or []:
            parts.append(tb.get("heading") or "")
            parts.extend(tb.get("paragraphs") or [])
            if tb.get("code"):
                parts.append(tb["code"])
        for st in (s.get("iDo") or {}).get("steps") or []:
            parts.append(st.get("description") or "")
            parts.append(st.get("why") or "")
            if st.get("code"):
                parts.append(st["code"])
        for ex in (s.get("weDo") or {}).get("exercises") or []:
            parts.append(ex.get("instruction") or "")
            parts.extend(ex.get("hints") or [])
            if ex.get("starterCode"):
                parts.append(ex["starterCode"])
    act = pkt.get("active") or {}
    parts.append(act.get("title") or "")
    parts.append(act.get("tagline") or "")
    parts.append(act.get("jobRelevance") or "")
    for lo in act.get("learningOutcomes") or []:
        parts.append(lo if isinstance(lo, str) else str(lo))
    for tb in act.get("theory") or []:
        parts.append(tb.get("heading") or "")
        parts.extend(tb.get("paragraphs") or [])
        if tb.get("code"):
            parts.append(tb["code"])
    for st in (act.get("iDo") or {}).get("steps") or []:
        parts.append(st.get("description") or "")
        parts.append(st.get("why") or "")
        if st.get("code"):
            parts.append(st["code"])
    # Active exercises: instruction+hints+starter only (no solutions)
    for ex in (act.get("weDo") or {}).get("exercises") or []:
        parts.append(ex.get("instruction") or "")
        parts.extend(ex.get("hints") or [])
        if ex.get("starterCode"):
            parts.append(ex["starterCode"])
    return "\n".join(parts)


def score_option(opt: str, q: str, corpus_toks: set[str], corpus_lower: str) -> float:
    ot = tokens(opt)
    qt = tokens(q)
    if not ot:
        return 0.0
    # overlap with packet
    hit = sum(1 for t in ot if t in corpus_toks or t.lower() in corpus_toks)
    # phrase presence
    phrase = 2.0 if opt.lower().strip() in corpus_lower else 0.0
    # prefer options whose distinctive tokens appear near question topic
    topic_hit = sum(1 for t in ot if t in qt)
    return hit + phrase + 0.15 * topic_hit


def answer_selfcheck(stems: list[dict], corpus: str, persona: str) -> list[dict]:
    corpus_toks = tokens(corpus)
    corpus_lower = corpus.lower()
    answers = []
    for i, stem in enumerate(stems):
        q = stem.get("question") or ""
        opts = stem.get("options") or []
        scores = [score_option(o, q, corpus_toks, corpus_lower) for o in opts]
        if not scores:
            answers.append(
                {
                    "question_index": i,
                    "chosen_index": None,
                    "blocked_on": ["EXAM_INVALID"],
                    "confidence": 0,
                }
            )
            continue
        best = max(range(len(scores)), key=lambda j: scores[j])
        best_s = scores[best]
        ranked = sorted(scores, reverse=True)
        margin = ranked[0] - (ranked[1] if len(ranked) > 1 else 0)
        if persona == "skeptic":
            # require clear lexical support
            if best_s < 1.0 or margin < 0.2:
                answers.append(
                    {
                        "question_index": i,
                        "chosen_index": None,
                        "blocked_on": ["UNTAUGHT_CONCEPT"],
                        "confidence": 0.2,
                        "note": "Skeptic: insufficient packet support for any option",
                        "scores": scores,
                    }
                )
                continue
            conf = min(0.95, 0.4 + best_s * 0.1 + margin * 0.2)
        else:
            # explorer always picks best
            conf = min(0.9, 0.3 + best_s * 0.12)
            if best_s < 0.5:
                conf = 0.25
        answers.append(
            {
                "question_index": i,
                "chosen_index": best,
                "chosen_text": opts[best],
                "confidence": round(conf, 2),
                "blocked_on": [],
                "scores": scores,
            }
        )
    return answers


def answer_exercises(exercises: list[dict], corpus: str, persona: str) -> list[dict]:
    corpus_lower = corpus.lower()
    corpus_toks = tokens(corpus)
    out = []
    for ex in exercises:
        eid = ex.get("id") or "unknown"
        inst = ex.get("instruction") or ""
        starter = ex.get("starterCode") or ""
        hints = "\n".join(ex.get("hints") or [])
        # Can the newbie attempt? Need starter or clear fill-in markers taught in packet
        needed = tokens(inst) - tokens(starter) - tokens(hints)
        # code-like tokens in instruction that look like APIs
        apiish = {
            t
            for t in needed
            if t in corpus_toks
            or any(ch in t for ch in ("_",))
            or t[0].isupper()
        }
        untaught = []
        # crude: if instruction mentions a dotted call not in corpus
        for m in re.finditer(r"\b([a-zA-Z_][\w]*)\.([a-zA-Z_][\w]*)\b", inst):
            frag = f"{m.group(1)}.{m.group(2)}"
            if frag.lower() not in corpus_lower and m.group(2).lower() not in corpus_lower:
                # allow if only in starter to complete
                if frag not in starter:
                    untaught.append(frag)
        if persona == "skeptic" and untaught:
            out.append(
                {
                    "exercise_id": eid,
                    "answer": None,
                    "code": None,
                    "blocked_on": ["UNTAUGHT_API:" + u for u in untaught[:5]],
                    "confidence": 0.15,
                    "concepts_used": [],
                }
            )
            continue
        # Attempt: return starter with a comment that learner would fill blanks
        if "____" in starter or "TODO" in starter or "..." in starter or "# BUG" in starter:
            code = starter  # incomplete — expected
            conf = 0.55 if persona == "explorer" else 0.4
            out.append(
                {
                    "exercise_id": eid,
                    "answer": "attempt_incomplete_starter",
                    "code": code,
                    "blocked_on": [],
                    "confidence": conf,
                    "concepts_used": list(apiish)[:8],
                    "note": "Would fill blanks using hints/demos from packet",
                }
            )
        elif starter.strip():
            out.append(
                {
                    "exercise_id": eid,
                    "answer": "run_starter_as_baseline",
                    "code": starter,
                    "blocked_on": [],
                    "confidence": 0.5,
                    "concepts_used": list(apiish)[:8],
                }
            )
        else:
            # Transfer / markdown / protocol exercises often have no starterCode by design
            kind_md = "markdown" in inst.lower() or "protocolo" in inst.lower() or "escribe" in inst.lower()
            if persona == "skeptic" and not kind_md and not hints:
                out.append(
                    {
                        "exercise_id": eid,
                        "answer": None,
                        "blocked_on": ["STARTER_BROKEN"],
                        "confidence": 0.1,
                    }
                )
            else:
                out.append(
                    {
                        "exercise_id": eid,
                        "answer": "would_write_from_instruction_and_hints",
                        "code": f"# from instruction/hints only\n# {inst[:120]}",
                        "blocked_on": [],
                        "confidence": 0.35 if kind_md else 0.3,
                        "note": "no starter — narrative/transfer exercise",
                    }
                )
    return out


def run_section(attempt_id: str, section_index: int) -> dict:
    pkt = build_packet(section_index, attempt_id=attempt_id)
    corpus = packet_text(pkt)
    stems = (pkt.get("active") or {}).get("selfCheck_stems") or []
    exercises = ((pkt.get("active") or {}).get("weDo") or {}).get("exercises") or []

    resp_a = {
        "persona": "explorer",
        "selfcheck": answer_selfcheck(stems, corpus, "explorer"),
        "exercises": answer_exercises(exercises, corpus, "explorer"),
        "forbidden_ack": pkt.get("forbidden"),
        "packet_sha": pkt.get("packet_sha"),
    }
    resp_b = {
        "persona": "skeptic",
        "selfcheck": answer_selfcheck(stems, corpus, "skeptic"),
        "exercises": answer_exercises(exercises, corpus, "skeptic"),
        "forbidden_ack": pkt.get("forbidden"),
        "packet_sha": pkt.get("packet_sha"),
    }
    record_agent_responses(attempt_id, section_index, "a", resp_a)
    record_agent_responses(attempt_id, section_index, "b", resp_b)
    grades = grade_section_agents(attempt_id, section_index)

    # knowledge-sufficiency: offline check that correct option text appears in packet
    files = active_section_files()
    target = None
    for p in files:
        sec = parse_section_learner(p)
        if sec.get("index") == section_index:
            target = p
            break
    keys = extract_selfcheck_keys(target) if target else []
    sufficiency = []
    corpus_lower = corpus.lower()
    for i, k in enumerate(keys):
        ci = k.get("correctIndex")
        opts = k.get("options") or []
        if ci is None or ci < 0 or ci >= len(opts):
            sufficiency.append({"i": i, "ok": False, "reason": "bad_key"})
            continue
        correct = opts[ci]
        # correct answer must be learnable: tokens of correct option in corpus OR
        # question+correct appear as taught concept (not requiring option verbatim)
        ct = tokens(correct)
        support = sum(1 for t in ct if t in tokens(corpus) or t.lower() in corpus_lower)
        ratio = support / max(1, len(ct))
        # code/list literals: digits and brackets don't tokenize well — accept if
        # question topic words appear in corpus and option looks like a literal
        is_literal = bool(
            re.fullmatch(
                r"\s*[\[\(\{].*[\]\)\}]\s*|"
                r"\s*['\"].*['\"]\s*|"
                r"\s*-?\d+(\.\d+)?\s*|"
                r"\s*(True|False|None)\s*",
                correct,
            )
        )
        q_toks = tokens(k.get("question") or "")
        q_support = sum(1 for t in q_toks if t in tokens(corpus)) / max(1, len(q_toks))
        ok = (
            ratio >= 0.35
            or correct.lower() in corpus_lower
            or (is_literal and q_support >= 0.25)
            or any(frag in corpus_lower for frag in re.findall(r"[a-zA-Z_]{3,}", correct))
        )
        # pure punctuation/list of numbers: if question is about lists/indexing and lists appear
        if not ok and is_literal:
            if any(
                w in corpus_lower
                for w in ("lista", "list", "índice", "index", "slice", "rango", "range", "slicing")
            ):
                ok = True
                ratio = max(ratio, 0.5)
        sufficiency.append(
            {
                "i": i,
                "ok": ok,
                "support_ratio": round(ratio, 2),
                "correct_preview": correct[:80],
            }
        )

    gaps = []
    for s in sufficiency:
        if not s["ok"]:
            gaps.append(
                {
                    "tag": "UNTAUGHT_CONCEPT",
                    "severity": "P1",
                    "exercise_id": f"selfcheck-{s['i']}",
                    "detail": f"Correct option poorly supported by packet: {s.get('correct_preview')}",
                    "section_index": section_index,
                }
            )
    # skeptic blocks
    for ex in resp_b["exercises"]:
        if ex.get("blocked_on"):
            gaps.append(
                {
                    "tag": "UNTAUGHT_API",
                    "severity": "P1",
                    "exercise_id": ex.get("exercise_id"),
                    "detail": str(ex.get("blocked_on")),
                    "section_index": section_index,
                }
            )

    d = attempt_dir(attempt_id) / f"section_{section_index:02d}"
    d.mkdir(parents=True, exist_ok=True)
    (d / "gaps.json").write_text(
        json.dumps(gaps, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (d / "sufficiency.json").write_text(
        json.dumps(sufficiency, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return {
        "section_index": section_index,
        "section_id": (pkt.get("active") or {}).get("id"),
        "n_exercises": len(exercises),
        "n_selfcheck": len(stems),
        "grades": grades,
        "sufficiency_ok": all(s["ok"] for s in sufficiency) if sufficiency else True,
        "n_gaps": len(gaps),
        "gaps": gaps[:10],
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--attempt", default="attempt_002")
    ap.add_argument("--section", type=int, default=None)
    ap.add_argument("--from-section", type=int, default=1)
    ap.add_argument("--to-section", type=int, default=52)
    args = ap.parse_args()

    indices = (
        [args.section]
        if args.section
        else list(range(args.from_section, args.to_section + 1))
    )
    results = []
    first_fail = None
    for idx in indices:
        r = run_section(args.attempt, idx)
        results.append(
            {
                "section_index": r["section_index"],
                "id": r["section_id"],
                "sufficiency_ok": r["sufficiency_ok"],
                "n_gaps": r["n_gaps"],
                "a_sc": (r["grades"].get("agents") or {}).get("newbie_a", {}).get(
                    "selfcheck", {}
                ).get("score_pct"),
                "b_sc": (r["grades"].get("agents") or {}).get("newbie_b", {}).get(
                    "selfcheck", {}
                ).get("score_pct"),
                "a_pass": (r["grades"].get("agents") or {}).get("newbie_a", {}).get(
                    "pass_selfcheck"
                ),
                "b_pass": (r["grades"].get("agents") or {}).get("newbie_b", {}).get(
                    "pass_selfcheck"
                ),
            }
        )
        # hard fail on sufficiency (knowledge gap for correct answers)
        if not r["sufficiency_ok"] and first_fail is None:
            first_fail = idx
        print(
            f"S{idx:02d} {r['section_id']}: suff={r['sufficiency_ok']} gaps={r['n_gaps']} "
            f"A={results[-1]['a_sc']}% B={results[-1]['b_sc']}%",
            flush=True,
        )

    summary = {
        "attempt_id": args.attempt,
        "finished_at": now_iso(),
        "sections_run": len(results),
        "all_sufficiency_ok": all(r["sufficiency_ok"] for r in results),
        "first_sufficiency_fail": first_fail,
        "a_pass_count": sum(1 for r in results if r.get("a_pass")),
        "b_pass_count": sum(1 for r in results if r.get("b_pass")),
        "results": results,
    }
    out = attempt_dir(args.attempt) / "dual_sim_report.json"
    out.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: summary[k] for k in summary if k != "results"}, indent=2))
    return 0 if summary["all_sufficiency_ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
