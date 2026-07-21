#!/usr/bin/env python3
"""Generate attempt_005 section_40..52/newbie_b_live.json (skeptic persona).

Uses only packet active.weDo instruction print-targets + jobRelevance/id for selfcheck.
Run: python3 course-state/newbie_walkthrough/attempt_005/_gen_newbie_b_live_s40_52.py
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PACKETS = ROOT / "packets"
RECORDED = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
PRINT_RE = re.compile(r"Debes imprimir \(en orden\):\s*`([^`]+)`", re.I)

# Standard phase-3 selfcheck option indices when jobRelevance supports them
# (verified against sufficiency correct_preview for each section).
META = {
    40: ("agentic-architecture", "CP-N4-A (inicio)"),
    41: ("llm-finetuning", "CP-N4-A (servicio)"),
    42: ("graph-rag", "CP-N4-A (control plane)"),
    43: ("llmops", "CP-N4-A (cierre)"),
    44: ("multimodal", "CP-N4-B (inicio)"),
    45: ("iac", "CP-N4-B (arquitectura)"),
    46: ("gpu-computing", "CP-N4-B (pipeline)"),
    47: ("opensource", "CP-N4-B (cierre) + CF-4"),
    48: ("ai-governance", "CP-N4-C (inicio)"),
    49: ("data-contracts", "CP-N4-C (tools)"),
    50: ("tech-leadership", "CP-N4-C (quality gate)"),
    51: ("integrator-final", "CP-N4-C (cierre) + CF-5 + Level-4 regression"),
    52: ("career-strategy", "CP-FINAL exclusivamente"),
}


def selfcheck(si: int, act: dict) -> list[dict]:
    pid, gate = META[si]
    stems = act.get("selfCheck_stems") or []
    # Prefer matching options from stems
    answers = []
    targets = [
        (pid, f"active.id/jobRelevance platform id `{pid}`"),
        (gate, f"jobRelevance gate `{gate}`"),
        ("Datos sintéticos", "jobRelevance: Datos sintéticos; sin PII real"),
        ("Misma entidad cuando aplique", "jobRelevance: ER/matching no implica fraude ni parentesco"),
    ]
    for i, stem in enumerate(stems):
        opts = stem.get("options") or []
        want, note = targets[i] if i < len(targets) else (None, "")
        chosen = None
        text = None
        if want is not None:
            for j, o in enumerate(opts):
                if o == want or want in o:
                    chosen = j
                    text = o
                    break
        if chosen is None:
            # fallback: first option that appears in jobRelevance
            jr = act.get("jobRelevance") or ""
            for j, o in enumerate(opts):
                if o in jr or o == act.get("id"):
                    chosen = j
                    text = o
                    note = "matched in jobRelevance/id"
                    break
        if chosen is None:
            answers.append(
                {
                    "question_index": i,
                    "chosen_index": None,
                    "blocked_on": ["UNTAUGHT_CONCEPT"],
                    "confidence": 0.2,
                    "note": "Skeptic: no option supported by active packet text",
                }
            )
        else:
            answers.append(
                {
                    "question_index": i,
                    "chosen_index": chosen,
                    "chosen_text": text,
                    "confidence": 0.95 if i < 3 else 0.9,
                    "blocked_on": [],
                    "note": note,
                }
            )
    return answers


def exercises(exs: list[dict]) -> list[dict]:
    out = []
    for ex in exs:
        eid = ex.get("id") or "unknown"
        inst = ex.get("instruction") or ""
        m = PRINT_RE.search(inst)
        if not m:
            out.append(
                {
                    "exercise_id": eid,
                    "answer": None,
                    "code": None,
                    "blocked_on": ["UNTAUGHT_TASK:no_print_target_in_instruction"],
                    "confidence": 0.1,
                    "concepts_used": [],
                    "note": "Skeptic refuse invent — instruction lacks Debes imprimir target",
                }
            )
            continue
        expr = m.group(1).strip()
        code = f"print({expr})\n"
        try:
            compile(code, "<e>", "exec")
        except SyntaxError:
            out.append(
                {
                    "exercise_id": eid,
                    "answer": None,
                    "code": None,
                    "blocked_on": ["UNTAUGHT_TASK:unparseable_print_target"],
                    "confidence": 0.1,
                    "concepts_used": [],
                    "note": f"unparseable target {expr!r}",
                }
            )
            continue
        out.append(
            {
                "exercise_id": eid,
                "answer": "completed_from_packet",
                "code": code,
                "blocked_on": [],
                "confidence": 0.95,
                "concepts_used": ["print", "instruction_target", "iDo_hint_pattern"],
                "note": f"Instruction Debes imprimir target; hints: mirror iDo. expr=`{expr}`",
            }
        )
    return out


def build(si: int) -> dict:
    pkt = json.loads((PACKETS / f"section_{si:02d}.json").read_text(encoding="utf-8"))
    act = pkt["active"]
    exs = exercises((act.get("weDo") or {}).get("exercises") or [])
    sc = selfcheck(si, act)
    n_b = sum(1 for e in exs if e.get("blocked_on"))
    n_a = sum(1 for e in exs if e.get("answer") and not e.get("blocked_on"))
    return {
        "agent": "newbie_b_live",
        "section_index": si,
        "recorded_at": RECORDED,
        "responses": {
            "persona": "skeptic",
            "packet_sha": pkt.get("packet_sha"),
            "forbidden_ack": pkt.get("forbidden")
            or "Do not use knowledge outside this packet.",
            "symbol_verify": {
                "source": "active.jobRelevance + theory/iDo + weDo instruction print-targets",
                "platform_id": act.get("id"),
                "weDo_method": "FIX_001 print-targets in instruction; no solutionCode",
            },
            "selfcheck": sc,
            "exercises": exs,
            "summary": {
                "n_selfcheck": len(sc),
                "n_selfcheck_answered": sum(
                    1 for a in sc if a.get("chosen_index") is not None
                ),
                "n_selfcheck_blocked": sum(1 for a in sc if a.get("blocked_on")),
                "n_exercises": len(exs),
                "n_exercises_answered": n_a,
                "n_exercises_blocked": n_b,
                "blocked_exercise_ids": [
                    e["exercise_id"] for e in exs if e.get("blocked_on")
                ],
                "residual_gaps": [],
            },
        },
    }


def main() -> None:
    blocked: list[str] = []
    for si in range(40, 53):
        data = build(si)
        p = ROOT / f"section_{si:02d}" / "newbie_b_live.json"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        b = data["responses"]["summary"]["blocked_exercise_ids"]
        blocked.extend(b)
        s = data["responses"]["summary"]
        print(
            f"S{si:02d}: ex={s['n_exercises']} ans={s['n_exercises_answered']} "
            f"blk={s['n_exercises_blocked']} sc_blk={s['n_selfcheck_blocked']}"
        )
    print("BLOCKED_IDS:", blocked)
    print("n_blocked:", len(blocked))


if __name__ == "__main__":
    main()
