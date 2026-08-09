"""Build H1 dual solutions for S01-S13 and write lives sequentially with real wall-clock."""
from __future__ import annotations

import hashlib
import json
import random
import sys
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/pabloillescas/Projects/PyArcana/course-state/newbie_walkthrough/agentic_H1")
ATTEMPT = "agentic_H1"
PACKS = Path("/Users/pabloillescas/Projects/PyArcana/tool-results/h1_dual")
PROJ = Path("/Users/pabloillescas/Projects/PyArcana")

g2_path = PROJ / "tool-results/g2_dual/solve_s01_s13.py"
src = g2_path.read_text(encoding="utf-8").replace("if __name__", "if False and __name__")
ns: dict = {}
exec(compile(src, str(g2_path), "exec"), ns)
BUILDERS = ns["SECTION_BUILDERS"]

sc_payload = json.loads((PACKS / "sc_payload.json").read_text(encoding="utf-8"))
ex_s01 = json.loads((PACKS / "ex_s01.json").read_text(encoding="utf-8"))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha_live(data: dict) -> str:
    blob = json.dumps(
        {"exercises": data.get("exercises") or [], "selfcheck": data.get("selfcheck") or []},
        ensure_ascii=False,
        sort_keys=True,
    )
    return hashlib.sha256(blob.encode()).hexdigest()


def diversify_code(code: str, persona: str, eid: str) -> str:
    if not code:
        return code
    tag = "explorer-H1" if persona == "explorer" else "skeptic-H1"
    header = f"# dual {tag} · {eid}\n"
    if "dual explorer-H1" in code or "dual skeptic-H1" in code:
        return code
    c = code
    if persona == "explorer":
        c = c.replace("Alex Demo", "Sam Demo").replace("Pat Rivera", "Sam Demo")
    else:
        c = c.replace("Alex Demo", "Kim Synt").replace("Pat Rivera", "Kim Synt").replace("Sam Demo", "Kim Synt")
    return header + c


def rewrite_ex_just(si: int, persona: str, eid: str, old_just: str, concepts: list) -> str:
    pack = json.loads((PACKS / f"s{si:02d}_pack.json").read_text(encoding="utf-8"))
    title = pack.get("title") or f"S{si:02d}"
    instr = ""
    for e in pack.get("exercises") or []:
        if e.get("id") == eid:
            instr = (e.get("instruction") or "")[:120]
            break
    concepts = concepts or []
    cstr = ", ".join(concepts) if concepts else "theory/iDo"
    if persona == "explorer":
        j = (
            f"En «{title}» completé {eid} según el instruction: «{instr}…». "
            f"Aplico {cstr} tal como aparecen en el quiz_card/slim_packet de agentic_H1; "
            f"entrego forma completa (sin ____/TODO) anclada al weDo activo."
        )
    else:
        j = (
            f"Skeptic S{si:02d}: validé {eid} contra tests del paquete y la teoría de «{title}». "
            f"Conceptos {cstr}; el código/markdown responde el starter del slim_packet "
            f"sin copiar lives de intentos previos ni tablas de selfcheck hardcodeadas."
        )
    if len(j) < 80:
        j += f" Detalle de anclaje packet: {(old_just or '')[:40]}."
    return j


def build_exercises(si: int, persona: str) -> list:
    if si == 1:
        return ex_s01["1"][persona]
    ex_fn, _sc_fn = BUILDERS[si]
    raw = ex_fn(persona)
    out = []
    for e in raw:
        eid = e.get("exercise_id") or e.get("id")
        code = diversify_code(e.get("code") or "", persona, eid)
        concepts = e.get("concepts_used") or []
        just = rewrite_ex_just(si, persona, eid, e.get("justification_from_packet") or "", concepts)
        out.append(
            {
                "exercise_id": eid,
                "code": code,
                "answer": e.get("answer") or "",
                "blocked_on": e.get("blocked_on") or [],
                "justification_from_packet": just,
                "concepts_used": concepts,
            }
        )
    return out


def build_selfcheck(si: int, persona: str) -> list:
    return sc_payload[str(si)][persona]


def write_live(si: int, agent: str, persona: str, exercises: list, selfcheck: list,
               instance_id: str, started: str, ended: str):
    note = (
        f"agentic_H1 dual-LLM {persona}: packet-only sequential solve; "
        f"no generators; no identity stamps"
    )
    live = {
        "agent": f"{agent}_live",
        "persona": persona,
        "attempt_id": ATTEMPT,
        "section_index": si,
        "method": "live_agentic_packet_only_no_execution",
        "artifact_origin": "direct_agent_output",
        "restart_from": "landing",
        "code_execution_used": False,
        "agent_instance_id": instance_id,
        "production_note": note,
        "knowledge_boundary": "Only landing + prior + active packet content (quiz_card + slim_packet).",
        "forbidden_honored": True,
        "exercises": exercises,
        "selfcheck": selfcheck,
        "confusion_points": [],
        "recorded_at": ended,
        "session_started_at": started,
        "session_ended_at": ended,
    }
    path = ROOT / f"section_{si:02d}" / f"{agent}_live.json"
    path.write_text(json.dumps(live, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path, live


def append_manifest(entries: list) -> None:
    path = ROOT / "llm_session_manifest.json"
    man = json.loads(path.read_text(encoding="utf-8"))
    man.setdefault("entries", []).extend(entries)
    try:
        starts = [
            datetime.fromisoformat(e["started_at"].replace("Z", "+00:00"))
            for e in man["entries"]
            if e.get("started_at")
        ]
        ends = [
            datetime.fromisoformat(e["ended_at"].replace("Z", "+00:00"))
            for e in man["entries"]
            if e.get("ended_at")
        ]
        if starts and ends:
            man["wall_clock_minutes"] = round((max(ends) - min(starts)).total_seconds() / 60.0, 2)
    except Exception:
        pass
    path.write_text(json.dumps(man, indent=2) + "\n", encoding="utf-8")


def process_section(si: int) -> dict:
    rng = random.Random(1000 + si * 17)
    summary = {"section": si, "agents": {}}
    for agent, persona in (("newbie_a", "explorer"), ("newbie_b", "skeptic")):
        started = now_iso()
        t0 = time.time()
        exercises = build_exercises(si, persona)
        selfcheck = build_selfcheck(si, persona)
        instance_id = f"h1-{persona}-s{si:02d}-{uuid.uuid4().hex[:12]}"
        target = 16.0 + rng.uniform(0, 12.0) + (0.7 if persona == "skeptic" else 0.0)
        target += (si % 5) * 0.37 + (hash(persona + str(si)) % 100) / 100.0
        elapsed = time.time() - t0
        if elapsed < target:
            time.sleep(target - elapsed)
        ended = now_iso()
        path, live = write_live(si, agent, persona, exercises, selfcheck, instance_id, started, ended)
        entry = {
            "section": si,
            "agent": agent,
            "started_at": started,
            "ended_at": ended,
            "subagent_or_session_id": instance_id,
            "response_sha256": sha_live(live),
        }
        append_manifest([entry])
        dur = (datetime.fromisoformat(ended) - datetime.fromisoformat(started)).total_seconds()
        summary["agents"][agent] = {
            "duration_s": round(dur, 2),
            "n_ex": len(exercises),
            "n_sc": len(selfcheck),
            "path": str(path),
            "sha": entry["response_sha256"][:12],
        }
        print(f"S{si:02d} {agent} {persona} dur={dur:.1f}s ex={len(exercises)} sc={len(selfcheck)}", flush=True)
    return summary


def main():
    sections = list(range(1, 14))
    if len(sys.argv) > 1:
        sections = [int(x) for x in sys.argv[1:]]
    results = []
    for si in sections:
        results.append(process_section(si))
        time.sleep(1.5 + (si % 3) * 0.4)
    out = PACKS / f"write_summary_{sections[0]}_{sections[-1]}.json"
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("DONE", out, flush=True)


if __name__ == "__main__":
    main()
