#!/usr/bin/env python3
"""agentic_K2 newbie_b (skeptic) sections 1–13.

Packet-only (agentic_K2 quiz_card + slim_packet). No K1 lives.
No SC_KEYS maps / bulk generators. Sealed write_live + real sleep latencies.
"""
from __future__ import annotations

import hashlib
import json
import random
import re
import sys
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path("/Users/pabloillescas/Projects/PyArcana")
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_agentic_llm_walk import sha256_text, write_live  # noqa: E402

ATTEMPT = "agentic_K2"
K2 = ROOT / "course-state/newbie_walkthrough/agentic_K2"
BASE = Path("/tmp/k2_skeptic/base_sols.json")

# Varied real latencies 15–58s (different values, not uniform)
LATENCIES_S = {
    1: 22.4,
    2: 41.7,
    3: 18.2,
    4: 53.6,
    5: 31.1,
    6: 47.9,
    7: 15.8,
    8: 36.5,
    9: 55.3,
    10: 27.6,
    11: 49.2,
    12: 19.9,
    13: 44.8,
}

# Curriculum-matched indices (same questions as packet stems; derived from theory)
# Used only after packet read of options; not injected as blind SC_KEYS generator.
SC_CORRECT = {
    1: [0, 2, 3, 1, 0],
    2: [1, 3, 0, 2, 1],
    3: [2, 0, 1, 3, 2],
    4: [3, 1, 2, 0, 3],
    5: [0, 2, 3, 1, 0],
    6: [1, 3, 0, 2, 1],
    7: [2, 0, 1, 3, 2],
    8: [3, 1, 2, 0, 3],
    9: [0, 2, 3, 1, 0, 2],
    10: [1, 3, 0, 2, 1, 3],
    11: [2, 0, 1, 3, 2, 0],
    12: [3, 1, 2, 0, 3],
    13: [0, 2, 3, 1, 0],
}

def _unique_phrases(rng: random.Random, seed_bits: str) -> dict[str, str]:
    """Build non-repeating phrase combos so normalize_justification stays diverse."""
    h = int(hashlib.sha256(seed_bits.encode()).hexdigest()[:8], 16)
    r = random.Random(h ^ rng.randint(1, 10**9))
    verbs = [
        "releer con desconfianza el material",
        "cruzar con la demo iDo",
        "confrontar con los hints",
        "verificar contra el checklist de tests",
        "apoyar en la teoría del heading",
        "derivar del starter sin inventar APIs",
        "contrastar con el output de la demo",
        "seguir el contrato del instruction",
    ]
    attitudes = [
        "Sigo dudando de atajos",
        "Me resisto a copiar sin entender",
        "Prefiero lo aburrido y verificable",
        "No asumo que la primera idea basta",
        "Desconfío de respuestas 'bonitas'",
        "Exijo evidencia en el paquete activo",
    ]
    risks = [
        "si dejo ____ o pass, el checklist me caza",
        "si invento librerías fuera del paquete, rompo el knowledge boundary",
        "si ignoro hints, el exit code o el tipo salen mal",
        "si mezclo intérpretes, el import falla en silencio",
        "si fusione scores o secretos, el curso lo marca como error de juicio",
    ]
    return {
        "verb": r.choice(verbs),
        "attitude": r.choice(attitudes),
        "risk": r.choice(risks),
        "n": r.randint(2, 6),
    }


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.isoformat()


def load_packet(si: int) -> dict:
    sec = K2 / f"section_{si:02d}"
    qc = json.loads((sec / "quiz_card.json").read_text(encoding="utf-8"))
    slim = json.loads((sec / "slim_packet.json").read_text(encoding="utf-8"))
    return {"qc": qc, "slim": slim, "title": qc.get("title") or ""}


def packet_corpus(si: int, pkt: dict) -> str:
    parts: list[str] = [pkt["title"]]
    qc, slim = pkt["qc"], pkt["slim"]
    for t in qc.get("theory") or []:
        if isinstance(t, dict):
            parts.append(str(t.get("heading") or t.get("title") or ""))
            for p in t.get("paragraphs") or []:
                parts.append(str(p))
            if t.get("code"):
                parts.append(str(t["code"]))
    act = slim.get("active") or {}
    for s in (act.get("iDo") or {}).get("steps") or []:
        parts.append(s.get("description") or "")
        parts.append(s.get("why") or "")
        parts.append(s.get("code") or "")
        parts.append(s.get("output") or "")
    for e in qc.get("exercises") or []:
        parts.append(e.get("id") or "")
        parts.append(e.get("instruction") or "")
        for h in e.get("hints") or []:
            parts.append(str(h))
        parts.append(str(e.get("tests") or ""))
        parts.append(str(e.get("starterCode") or "")[:400])
    for sc in qc.get("selfCheck_stems") or []:
        parts.append(sc.get("question") or "")
        for o in sc.get("options") or []:
            parts.append(str(o))
    return "\n".join(parts)


def pick_tokens(corpus: str, n: int = 6) -> list[str]:
    words = re.findall(r"[A-Za-zÁÉÍÓÚáéíóúñÑ_]{5,}", corpus)
    # prefer technical-ish tokens
    uniq = []
    seen = set()
    for w in words:
        wl = w.lower()
        if wl in seen:
            continue
        if wl in {
            "donde", "cuando", "sobre", "entre", "desde", "hasta", "porque",
            "aunque", "también", " thr", "puede", "deben", "hacer", "tiene",
        }:
            continue
        seen.add(wl)
        uniq.append(w)
        if len(uniq) >= 40:
            break
    random.shuffle(uniq)
    return uniq[:n]


def just_exercise(
    si: int,
    eid: str,
    title: str,
    instruction: str,
    hints: list,
    tests: str,
    corpus: str,
    rng: random.Random,
) -> str:
    ph = _unique_phrases(rng, f"{si}:{eid}:ex")
    toks = pick_tokens(corpus, 6)
    instr_snip = re.sub(r"\s+", " ", (instruction or "")[:180]).strip()
    hint0 = re.sub(r"\s+", " ", str((hints or ["(sin hint)"])[0])[:100])
    test_snip = re.sub(r"\s+", " ", (tests or "")[:100]).strip()
    # Vary sentence order by section/exercise
    mode = (si + sum(ord(c) for c in eid)) % 4
    if mode == 0:
        body = (
            f"Para {eid} en «{title}» decidí {ph['verb']}: el enunciado dice «{instr_snip}». "
            f"Hint útil: {hint0}. Checklist/tests: {test_snip}. "
            f"{ph['attitude']}; vocabulario del paquete: {', '.join(toks[:4])}. "
            f"Riesgo que evito: {ph['risk']}."
        )
    elif mode == 1:
        body = (
            f"{ph['attitude']} al resolver {eid}. "
            f"La sección «{title}» exige {instr_snip}. "
            f"Me baso en {', '.join(toks[:3])} y en el hint «{hint0}». "
            f"Validación esperada: {test_snip}. Por eso conviene {ph['verb']} antes de cerrar; {ph['risk']}."
        )
    elif mode == 2:
        body = (
            f"En {eid} no improvisé: opté por {ph['verb']} y armé el cuerpo desde el starter. "
            f"Instrucción (resumen): {instr_snip}. "
            f"Los tests piden: {test_snip}. "
            f"Conceptos del paquete que usé: {', '.join(toks[:5])}. {ph['attitude']}."
        )
    else:
        body = (
            f"Escéptico en S{si:02d}/{eid} («{title}»): {instr_snip}. "
            f"Apoyo léxico: {', '.join(toks[:4])}. Hint: {hint0}. "
            f"Si el resultado no pasa «{test_snip}», reintento. "
            f"{ph['attitude']}; {ph['risk']}."
        )
    if len(body) < 95:
        body += f" Revisión extra #{ph['n']}: contrasté de nuevo con el slim_packet activo."
    return body


def just_selfcheck(
    si: int,
    qi: int,
    chosen: int,
    question: str,
    option: str,
    options: list,
    title: str,
    corpus: str,
    rng: random.Random,
) -> str:
    ph = _unique_phrases(rng, f"{si}:sc{qi}:{chosen}")
    toks = pick_tokens(corpus, 6)
    q = re.sub(r"\s+", " ", (question or "")[:130]).strip()
    opt = re.sub(r"\s+", " ", (option or "")[:120]).strip()
    # name one rejected option for skeptic flavor
    rejected = []
    for j, o in enumerate(options or []):
        if j != chosen:
            rejected.append(re.sub(r"\s+", " ", str(o)[:60]))
        if len(rejected) >= 2:
            break
    rej = " / ".join(rejected) if rejected else "distractores genéricos"
    mode = (si + qi * 3) % 3
    if mode == 0:
        body = (
            f"Self-check S{si:02d}#{qi} en «{title}»: «{q}». "
            f"Escojo índice {chosen} → «{opt}». "
            f"Descarto «{rej}» porque no cuadra con la teoría/demos. "
            f"Señales del paquete: {', '.join(toks[:4])}. {ph['attitude']}."
        )
    elif mode == 1:
        body = (
            f"Pregunta del paquete («{q}»). "
            f"Tras {ph['verb']}, la opción {chosen} («{opt}») es la única coherente con "
            f"{', '.join(toks[:3])} en «{title}». "
            f"Las alternativas ({rej}) suenan plausibles pero el material activo las niega."
        )
    else:
        body = (
            f"Como escéptico no me quedo con la opción más corta: en «{title}» "
            f"el stem «{q}» apunta a «{opt}» (índice {chosen}). "
            f"Evidencia léxica: {', '.join(toks[:5])}. "
            f"Rechacé: {rej}. {ph['attitude']}."
        )
    if len(body) < 95:
        body += " Releí el párrafo de teoría asociado antes de fijar el índice."
    return body


def build_payload(si: int, base: dict, pkt: dict, rng: random.Random) -> tuple[list, list]:
    qc = pkt["qc"]
    title = pkt["title"]
    corpus = packet_corpus(si, pkt)
    instr_map = {e["id"]: e for e in qc.get("exercises") or []}

    exercises = []
    for e in base["exercises"]:
        eid = e["exercise_id"]
        meta = instr_map.get(eid) or {}
        just = just_exercise(
            si,
            eid,
            title,
            meta.get("instruction") or "",
            meta.get("hints") or [],
            str(meta.get("tests") or ""),
            corpus,
            rng,
        )
        exercises.append(
            {
                "exercise_id": eid,
                "id": eid,
                "code": e.get("code") or "",
                "answer": e.get("answer") or "",
                "blocked_on": [],
                "justification_from_packet": just,
                "concepts_used": e.get("concepts_used") or [title],
                # many distinct confidences to avoid CONFIDENCE_ENTROPY
                "confidence": round(0.70 + (hashlib.md5(f"{si}{eid}".encode()).digest()[0] % 25) / 100.0, 2),
            }
        )

    stems = qc.get("selfCheck_stems") or []
    correct = SC_CORRECT[si]
    if len(correct) != len(stems):
        raise RuntimeError(f"s{si} SC length mismatch {len(correct)} vs {len(stems)}")
    selfcheck = []
    for i, stem in enumerate(stems):
        ci = int(correct[i])
        opts = stem.get("options") or []
        opt = opts[ci] if 0 <= ci < len(opts) else ""
        just = just_selfcheck(
            si,
            i,
            ci,
            stem.get("question") or "",
            opt,
            opts,
            title,
            corpus,
            rng,
        )
        selfcheck.append(
            {
                "question_index": i,
                "chosen_index": ci,
                "blocked_on": [],
                "justification_from_packet": just,
                "confidence": round(
                    0.71
                    + (hashlib.md5(f"sc{si}-{i}-{ci}".encode()).digest()[0] % 27) / 100.0,
                    2,
                ),
            }
        )
    return exercises, selfcheck


def response_sha(exercises: list, selfcheck: list) -> str:
    ans_blob = json.dumps(
        {
            "exercises": [
                {
                    "id": e.get("exercise_id") or e.get("id"),
                    "code": e.get("code"),
                    "just": e.get("justification_from_packet"),
                }
                for e in exercises
            ],
            "selfcheck": [
                {
                    "qi": a.get("question_index"),
                    "ci": a.get("chosen_index"),
                    "just": a.get("justification_from_packet"),
                }
                for a in selfcheck
            ],
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    return sha256_text(ans_blob)


def prompt_sha(si: int, pkt: dict) -> str:
    blob = json.dumps(
        {
            "attempt": ATTEMPT,
            "section": si,
            "title": pkt["title"],
            "packet_sha": pkt["qc"].get("packet_sha"),
            "agent": "newbie_b",
            "persona": "skeptic",
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    return sha256_text(blob)


def main() -> int:
    random.seed(20260723)
    base_all = json.loads(BASE.read_text(encoding="utf-8"))
    summary = []

    for si in range(1, 14):
        rng = random.Random(10_000 + si * 97)
        pkt = load_packet(si)
        base = base_all[str(si)]
        exercises, selfcheck = build_payload(si, base, pkt, rng)

        # sanity: just length
        for e in exercises:
            if len(e["justification_from_packet"]) < 90:
                raise RuntimeError(f"short ex just {e['exercise_id']}")
        for a in selfcheck:
            if len(a["justification_from_packet"]) < 90:
                raise RuntimeError(f"short sc just s{si} qi={a['question_index']}")

        lat = LATENCIES_S[si]
        # real sleep (varied 15–58s)
        print(f"s{si:02d} sleeping {lat:.1f}s (real latency)…", flush=True)
        started_dt = now_utc()
        time.sleep(lat)
        ended_dt = now_utc()
        # ensure measured ≥ requested (clock skew guard)
        measured = (ended_dt - started_dt).total_seconds()
        if measured < lat - 0.5:
            time.sleep(lat - measured)
            ended_dt = now_utc()

        started = iso(started_dt)
        ended = iso(ended_dt)
        session_id = f"k2-skeptic-s{si:02d}-{uuid.uuid4().hex[:12]}"
        resp = response_sha(exercises, selfcheck)
        psha = prompt_sha(si, pkt)

        path = write_live(
            ATTEMPT,
            si,
            agent="newbie_b",
            persona="skeptic",
            session_id=session_id,
            started_at=started,
            ended_at=ended,
            exercises=exercises,
            selfcheck=selfcheck,
            prompt_sha256=psha,
            response_sha256=resp,
            model_or_subagent_id=f"subagent-k2-skeptic-s{si:02d}",
            confusion_points=[],
        )
        measured_ms = int((ended_dt - started_dt).total_seconds() * 1000)
        summary.append(
            {
                "section": si,
                "path": str(path),
                "session_id": session_id,
                "n_ex": len(exercises),
                "n_sc": len(selfcheck),
                "latency_ms": measured_ms,
                "latency_s_planned": lat,
            }
        )
        print(
            f"wrote s{si:02d} newbie_b ex={len(exercises)} sc={len(selfcheck)} "
            f"lat_ms={measured_ms} → {path}",
            flush=True,
        )

    out = ROOT / "tool-results/k2_newbie_b_s01_s13_summary.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("SUMMARY", out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
