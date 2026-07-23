#!/usr/bin/env python3
"""
Agentic pedagogy validator (NOT code-exec as pass bar).

Success for dual-newbie gate:
- Live artifacts exist for two distinct agents with direct-live provenance
- Every selfcheck answer has justification_from_packet with lexical support from packet
- Every exercise either has blocked_on UNTAUGHT_* (honest gap) OR has justification + answer/code
- Selfcheck chosen_index matches offline keys (fairness check) — keys never shown to newbies
- No generator scripts / correct_preview leaks

Code execution is optional side-channel diagnostics only and does NOT decide pass.

Usage:
  python3 scripts/newbie_agentic_validator.py --attempt agentic_A1 --validate-all
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import build_packet  # noqa: E402
from newbie_walkthrough_runner import (  # noqa: E402
    attempt_dir,
    extract_selfcheck_keys,
    grade_selfcheck_answers,
    active_section_files,
    parse_section_learner,
    now_iso,
)

STOP = {
    "el", "la", "los", "las", "un", "una", "de", "del", "en", "y", "o", "a", "al",
    "que", "por", "para", "con", "se", "su", "es", "son", "the", "to", "of", "in",
    "on", "is", "are", "and", "or", "as", "if", "not", "no", "tu", "más", "muy",
}

LIVE_METHOD = "live_agentic_packet_only_no_execution"
LIVE_ORIGIN = "direct_agent_output"
META_ORIGIN = "live_agentic_transcript"
META_MODE = "fresh_sequential_packet_read"
# Provenance taint markers — match as provenance fingerprints, not domain tokens
# in learner code (e.g. REBUILD_NONROOT, generator expressions in theory).
TAINT_MARKERS = (
    "rebuilt",
    "rebuild",
    "copied",
    "copy_from",
    "codes_from",
    "source_exercises",
    "source_selfcheck",
    "generator",
    "produce_agent",
    "programmatic",
)

# Domain tokens that contain a marker substring but are legitimate curriculum text
TAINT_ALLOWLIST = (
    "rebuild_nonroot",
    "rebuild_provenance",
    "rebuild_partition",
    "rebuild_eval_dataset",
    "rebuild_eval",
    "rebuild_schema",
    "rebuild_index",
    "rebuild_cache",
    "source_change_rebuilds",
    "lock_copied_before_source",
    "copied_before_source",
    "generator expression",
    "generators",
    "generator-based",
    "random.generator",
    "default_rng",
)


def blob_has_taint(blob: str) -> bool:
    """True if provenance taint markers appear outside known domain allowlist."""
    low = (blob or "").lower()
    # neutralize allowlisted domain phrases so substring markers do not fire
    scrubbed = low
    for phrase in TAINT_ALLOWLIST:
        scrubbed = scrubbed.replace(phrase, " ")
    # also neutralize SCREAMING_SNAKE reject tokens like REBUILD_* used in exercises
    scrubbed = re.sub(r"\brebuild_[a-z0-9_]+\b", " ", scrubbed)
    # neutralize method label that ends with no_generator (already non-tainted method uses no_execution)
    scrubbed = scrubbed.replace("no_generator", " ")
    scrubbed = scrubbed.replace("llm_packet_only_no_generator", " ")
    return any(marker in scrubbed for marker in TAINT_MARKERS)


def tokens(s: str) -> set[str]:
    words = re.findall(
        r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-zÁÉÍÓÚÜÑáéíóúüñ_0-9]{2,}", s or ""
    )
    return {w.lower() for w in words if w.lower() not in STOP}


def packet_corpus(pkt: dict) -> str:
    parts = [json.dumps(pkt.get("landing") or {}, ensure_ascii=False)]
    for s in pkt.get("prior_sections") or []:
        parts.append(json.dumps(s, ensure_ascii=False))
    act = pkt.get("active") or {}
    # exclude anything that shouldn't be there
    lean = {k: v for k, v in act.items() if k not in ("_taught_text",)}
    parts.append(json.dumps(lean, ensure_ascii=False))
    return "\n".join(parts)


def justification_supported(just: str, corpus: str, min_hits: int = 2) -> bool:
    if not just or len(just.strip()) < 12:
        return False
    jt = tokens(just)
    ct = tokens(corpus)
    if not jt:
        return False
    hits = len(jt & ct)
    # also phrase presence
    low = corpus.lower()
    if any(w in low for w in list(jt)[:8] if len(w) > 4):
        hits += 1
    return hits >= min_hits


def load_live(path: Path) -> dict | None:
    if not path.exists():
        return None
    data = json.loads(path.read_text(encoding="utf-8"))
    if "responses" in data and isinstance(data["responses"], dict):
        return {**data, **data["responses"]}
    return data


def provenance_issues(
    meta: dict | None,
    lives: dict[str, dict | None],
    *,
    has_rebuild_report: bool = False,
) -> list[dict]:
    """Fail closed on copied/rebuilt/generated or non-isolated evidence.

    This intentionally validates explicit provenance rather than trusting a
    filename or the old self-asserted ``llm_packet_only_no_generator`` label.
    """
    issues: list[dict] = []
    meta = meta or {}
    meta_blob = json.dumps(meta, ensure_ascii=False).lower()
    if has_rebuild_report or blob_has_taint(meta_blob):
        issues.append({"tag": "TAINTED_ATTEMPT_ORIGIN", "detail": "rebuild/copy/generator fingerprint"})
    required_meta = {
        "evidence_origin": META_ORIGIN,
        "generation_mode": META_MODE,
        "restart_from": "landing",
        "code_execution_used": False,
    }
    for key, expected in required_meta.items():
        if meta.get(key) != expected:
            issues.append(
                {
                    "tag": "PROVENANCE_META_INVALID",
                    "detail": f"{key} must equal {expected!r}",
                }
            )

    ids: dict[str, str] = {}
    response_fingerprints: dict[str, str] = {}
    for label in ("newbie_a", "newbie_b"):
        raw = lives.get(label)
        if not raw:
            continue
        blob = json.dumps(raw, ensure_ascii=False).lower()
        if blob_has_taint(blob):
            issues.append(
                {"tag": "TAINTED_AGENT_ORIGIN", "agent": label, "detail": "rebuild/copy/generator/code-exec fingerprint"}
            )
        required_live = {
            "method": LIVE_METHOD,
            "artifact_origin": LIVE_ORIGIN,
            "restart_from": "landing",
            "code_execution_used": False,
        }
        for key, expected in required_live.items():
            if raw.get(key) != expected:
                issues.append(
                    {
                        "tag": "PROVENANCE_AGENT_INVALID",
                        "agent": label,
                        "detail": f"{key} must equal {expected!r}",
                    }
                )
        instance_id = raw.get("agent_instance_id")
        if not isinstance(instance_id, str) or len(instance_id.strip()) < 8:
            issues.append(
                {
                    "tag": "MISSING_AGENT_INSTANCE",
                    "agent": label,
                    "detail": "agent_instance_id must be an opaque id of at least 8 chars",
                }
            )
        else:
            ids[label] = instance_id.strip()
        response_only = {
            "exercises": raw.get("exercises") or [],
            "selfcheck": raw.get("selfcheck") or raw.get("selfCheck") or [],
            "confusion_points": raw.get("confusion_points") or [],
        }
        response_fingerprints[label] = hashlib.sha256(
            json.dumps(response_only, ensure_ascii=False, sort_keys=True).encode()
        ).hexdigest()

    if len(ids) == 2 and len(set(ids.values())) != 2:
        issues.append({"tag": "SAME_AGENT_REUSED", "detail": "newbie_a and newbie_b share agent_instance_id"})
    if len(response_fingerprints) == 2 and len(set(response_fingerprints.values())) != 2:
        issues.append({"tag": "COPIED_AGENT_RESPONSES", "detail": "A/B response payloads are byte-identical after normalization"})
    return issues


def normalize_selfcheck(data: dict) -> list[dict]:
    sc = data.get("selfcheck") or data.get("selfCheck") or []
    if isinstance(sc, dict) and "answers" in sc:
        sc = sc["answers"]
    out = []
    for a in sc or []:
        out.append(
            {
                "question_index": a.get("question_index", a.get("index", a.get("i"))),
                "chosen_index": a.get(
                    "chosen_index", a.get("chosen_option_index", a.get("chosen"))
                ),
                "blocked_on": a.get("blocked_on") or [],
                "justification": a.get("justification_from_packet")
                or a.get("justification")
                or a.get("note")
                or "",
            }
        )
    return out


def normalize_exercises(data: dict) -> list[dict]:
    out = []
    for e in data.get("exercises") or []:
        out.append(
            {
                "exercise_id": e.get("exercise_id") or e.get("id"),
                "code": e.get("code") or "",
                "answer": e.get("answer") or "",
                "blocked_on": e.get("blocked_on") or [],
                "justification": e.get("justification_from_packet")
                or e.get("justification")
                or e.get("note")
                or "",
                "concepts_used": e.get("concepts_used") or [],
            }
        )
    return out


# Incomplete / unsolved exercise fingerprints (not agentic solutions)
# Keep these tight: legitimate loop variables like print(x) must NOT fail.
INCOMPLETE_CODE_PATTERNS = [
    r"\b____\b",
    r"\bsys\.x\b",
    r"\bif x == [\"']x[\"']",
    r"\bsys\.exit\(x\)",
    r"\bexit\(x\)",
    r"#\s*TODO\b",
    r"^\s*TODO\b",
    r"print\(json\.dumps\([^)\n]*$",  # unclosed print(json.dumps...
    r"for x, y, _ in tx\s*$",
    r"elif x\s*$",
    r"nombre = [\"']x[\"']",  # produce_agent placeholder
    r"print\(r3\[\"errors\"\]\)\s*\n\s*print\(x,",  # known broken S02 scaffold
    r"#\s*exploratory pass\b",
    r"Transfer / protocolo",
]


def code_incomplete(code: str) -> str | None:
    """Return reason if code looks unsolved / broken; else None."""
    c = code or ""
    if not c.strip():
        return "empty_code"
    for pat in INCOMPLETE_CODE_PATTERNS:
        if re.search(pat, c, re.M):
            return f"pattern:{pat}"
    code_only = "\n".join(
        ln for ln in c.splitlines() if not ln.strip().startswith("#")
    )
    if code_only.count("(") > code_only.count(")"):
        return "unclosed_paren"
    if code_only.count("[") > code_only.count("]"):
        return "unclosed_bracket"
    return None


def justification_is_template(just: str) -> bool:
    j = (just or "").strip().lower()
    if len(j) < 40:
        return True
    templates = [
        "completé startercode con patrones del ido",
        "explorer: ejercicio",
        "mapeé starter→demo",
        "solo usé lo explícito en theory/ido/hints del paquete activo",
    ]
    # template if it starts with generic explorer/skeptic exercise line AND lacks exercise-specific detail
    hits = sum(1 for t in templates if t in j)
    if hits >= 1 and "instruction del paquete:" in j and j.count("ido") >= 1:
        # still template-like if no unique code tokens quoted
        if "print(" not in j and "def " not in j and "import " not in j and "«" not in j and '"' not in j[20:]:
            return True
    if j.startswith("explorer: ejercicio") and "completé startercode" in j:
        return True
    if j.startswith("skeptic: solo usé") and "completé el ejercicio" in j:
        return True
    return False




def non_comment_body(code: str) -> str:
    return "\n".join(
        ln for ln in (code or "").splitlines() if ln.strip() and not ln.strip().startswith("#")
    )


def exercise_form_issues(eid: str, instruction: str, code: str) -> list[str]:
    """Structural form gates beyond incomplete patterns (criterion 1 quality)."""
    issues: list[str] = []
    body = non_comment_body(code)
    instr = (instruction or "").lower()
    eid_l = (eid or "").lower()
    code_l = (code or "").lower()

    # Script exercises that ask for hello_sys / main / __name__ (always enforce)
    if "hello_sys" in instr or "hello_sys" in eid_l:
        if "def main" not in code_l and "def main(" not in code_l:
            issues.append("missing_main_for_hello_sys")
        if "__name__" not in code and "__main__" not in code:
            issues.append("missing_dunder_name")
        if "sys.version" not in code_l:
            issues.append("missing_sys_version")
        if (body.count(">>>") >= 1 or ">>>" in code) and "def " not in body:
            issues.append("repl_transcript_for_script_exercise")
        return issues

    if not body.strip():
        # pure comment / markdown protocol allowed for transfer/REPL transcript exercises
        if any(k in instr for k in (
            "diagnóstico", "diagnostico", "protocol", "markdown", "procedimiento",
            "checklist", "transcript", "repl", "comentar", "comentarios",
            "simula el diálogo", "no crees un archivo", "línea por línea",
            "linea por linea",
        )):
            return issues
        if "echo " in (code or "").lower() or ">>>" in (code or ""):
            return issues
        if any(k in instr for k in ("script", "escribe", "crea", "def ", "función", "funcion", ".py")):
            if "repl" in instr or "transcript" in instr:
                return issues
            issues.append("expected_form_comment_only")
        return issues

    # Generic script contract
    if ".py" in instr and ("if __name__" in instr or "__main__" in instr):
        if "__name__" not in code and "__main__" not in code:
            issues.append("missing_dunder_name")

    # If instruction emphasizes print and body has def but no print — soft
    if "imprima" in instr or "print(" in instr:
        if "print(" not in code and "print (" not in code and "def " in body:
            if "return" not in body and ">>> " not in code:
                issues.append("missing_print")

    # Very short non-comment body for coding exercises
    if len(body.strip()) < 12 and any(k in instr for k in ("def ", "función", "crea", "escribe", "implementa")):
        issues.append("too_short_body")

    return issues



def attempt_level_gates(attempt_id: str) -> list[dict]:
    """Hardened attempt-level gates (manifest, timing, anti-theater meta, independence)."""
    issues: list[dict] = []
    root = attempt_dir(attempt_id)
    meta_path = root / "meta.json"
    meta = {}
    if meta_path.exists():
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except Exception:
            meta = {}

    # Anti-theater production notes / repair stamps
    # Only flag affirmative theater use — not lists of forbidden tools
    meta_for_scan = {k: v for k, v in meta.items() if k not in (
        "forbidden_harnesses", "forbidden_sources", "forbidden"
    )}
    meta_blob = json.dumps(meta_for_scan, ensure_ascii=False).lower()
    theater_markers = (
        "packet_walk",
        "e1_code_map",
        "code-transplant",
        "code_transplant",
        "hardcoded answers",
        "hardcoded_answers",
        "apply_f2_selfcheck",
        "apply_f1_selfcheck",
        "rebuild from",
        "source_exercises",
        "transplant",
        "used bulk fill",
    )
    # Affirmative phrases only
    affirmative = (
        "used packet_walk",
        "via packet_walk",
        "from e1_code_map",
        "filled by e1_code_map",
        "repaired with transplant",
        "transplant from",
        "hardcoded answers applied",
        "used bulk fill",
        "codes from prior attempt",
        "source_exercises from",
    )
    for m in affirmative:
        if m in meta_blob:
            issues.append({"tag": "THEATER_META", "severity": "P0", "detail": f"meta claims {m}"})
            break
    if meta.get("repair"):
        issues.append({"tag": "THEATER_META", "severity": "P0", "detail": "meta.repair present"})
    # production_harness must not be a quarantined generator
    ph = (meta.get("production_harness") or "").lower()
    if any(x in ph for x in ("packet_walk", "produce_agent", "rebuild_lives", "e1_code_map")):
        issues.append({"tag": "THEATER_META", "severity": "P0", "detail": f"production_harness={ph}"})

    # Scan live production_notes for theater
    for i in range(1, 53):
        for lab in ("newbie_a_live.json", "newbie_b_live.json"):
            lp = root / f"section_{i:02d}" / lab
            if not lp.exists():
                continue
            try:
                live = json.loads(lp.read_text(encoding="utf-8"))
            except Exception:
                continue
            note = (live.get("production_note") or "").lower()
            # allow "no generators" / "no packet_walk" denials
            if any(bad in note for bad in (
                "filled by packet_walk",
                "via packet_walk",
                "from e1_code_map",
                "e1_code_map",
                "transplant from",
                "hardcoded answers applied",
                "bulk completer",
                "rebuilt from prior",
            )) or (
                "packet_walk" in note and "no packet" not in note and "not packet" not in note and "no generators" not in note
            ):
                issues.append({
                    "tag": "THEATER_PRODUCTION_NOTE",
                    "severity": "P0",
                    "agent": lab,
                    "section": i,
                    "detail": note[:80],
                })

    # Session manifest required
    man_path = root / "llm_session_manifest.json"
    if not man_path.exists():
        issues.append({"tag": "MISSING_LLM_SESSION_MANIFEST", "severity": "P0", "detail": "llm_session_manifest.json required"})
    else:
        try:
            man = json.loads(man_path.read_text(encoding="utf-8"))
        except Exception as e:
            issues.append({"tag": "BAD_LLM_SESSION_MANIFEST", "severity": "P0", "detail": str(e)})
            man = {}
        entries = man.get("entries") or man.get("sessions") or []
        # need 52*2 = 104 entries ideally
        if len(entries) < 100:
            issues.append({
                "tag": "INCOMPLETE_LLM_SESSION_MANIFEST",
                "severity": "P0",
                "detail": f"entries={len(entries)} need>=100 (52 sections × 2 agents)",
            })
        # Per-session duration + overall span (no wall_clock claim override of bad data)
        from datetime import datetime
        def parse(ts: str):
            return datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
        durs = []
        for e in entries:
            sa, ea = e.get("started_at"), e.get("ended_at")
            if not sa or not ea:
                issues.append({
                    "tag": "MANIFEST_MISSING_TIMESTAMPS",
                    "severity": "P0",
                    "detail": f"section={e.get('section')} agent={e.get('agent')}",
                })
                continue
            try:
                d = (parse(ea) - parse(sa)).total_seconds()
                durs.append(d)
                if d < 5.0:
                    issues.append({
                        "tag": "ZERO_DURATION_SESSION",
                        "severity": "P0",
                        "detail": f"section={e.get('section')} agent={e.get('agent')} dur={d:.4f}s",
                    })
                if d < 0:
                    issues.append({
                        "tag": "NEGATIVE_DURATION_SESSION",
                        "severity": "P0",
                        "detail": f"section={e.get('section')} agent={e.get('agent')} dur={d:.4f}s",
                    })
            except Exception as ex:
                issues.append({"tag": "MANIFEST_TIME_PARSE", "severity": "P0", "detail": str(ex)})
        # Cap ZERO_DURATION noise: keep first 15 in open_gaps but count all
        zero_n = sum(1 for x in issues if x.get("tag") == "ZERO_DURATION_SESSION")
        if zero_n > 15:
            # collapse extras
            kept, dropped = [], 0
            for x in issues:
                if x.get("tag") == "ZERO_DURATION_SESSION":
                    if dropped < 15:
                        kept.append(x)
                    dropped += 1
                else:
                    kept.append(x)
            if zero_n > 15:
                kept.append({
                    "tag": "ZERO_DURATION_SESSION_COUNT",
                    "severity": "P0",
                    "detail": f"total_zero_duration_sessions={zero_n}",
                })
            issues = kept
        if durs:
            # uniform exact durations (e.g. all 75.0s) are suspicious bulk stamping
            from collections import Counter
            rounded = Counter(round(d, 1) for d in durs)
            top_n = rounded.most_common(1)[0][1]
            if top_n >= max(20, int(0.25 * len(durs))):
                issues.append({
                    "tag": "SUSPICIOUS_UNIFORM_DURATION",
                    "severity": "P0",
                    "detail": f"{top_n}/{len(durs)} sessions share nearly identical duration",
                })
            span_min = (max(durs) and 0)  # placeholder
            try:
                t0 = min(parse(e["started_at"]) for e in entries if e.get("started_at"))
                t1 = max(parse(e["ended_at"]) for e in entries if e.get("ended_at"))
                span_min = (t1 - t0).total_seconds() / 60.0
            except Exception:
                span_min = 0.0
            # Do NOT trust man.wall_clock_minutes alone to override short spans
            if span_min < 30.0:
                issues.append({
                    "tag": "BULK_WRITE_TIMING",
                    "severity": "P0",
                    "detail": f"manifest entry span {span_min:.1f}m < 30m (wall_clock claim ignored as sole proof)",
                })

    # mtime span of live files — REQUIRED independently of manifest claims
    mtimes = []
    for i in range(1, 53):
        for lab in ("newbie_a_live.json", "newbie_b_live.json"):
            lp = root / f"section_{i:02d}" / lab
            if lp.exists():
                mtimes.append(lp.stat().st_mtime)
    if mtimes:
        span_sec = max(mtimes) - min(mtimes)
        if span_sec < 30 * 60:
            issues.append({
                "tag": "BULK_WRITE_MTIME",
                "severity": "P0",
                "detail": f"live mtime span {span_sec/60.0:.1f}m < 30m",
            })

    # Mechanical identity-stamp ban (any dual-attempt diversification stamps)
    stamp_hits = 0
    stamp_re = re.compile(
        r"(g2_agent\s*=|h_agent\s*=|h1_out\s*=|h2_out\s*=|"
        r"#\s*dual explorer-H|#\s*dual skeptic-H|"
        r"#\s*dual explorer-|#\s*dual skeptic-|"
        r"diversify_code|exploratory pass)",
        re.I,
    )
    # identity stamp assignment (not "no identity stamps" denials)
    identity_assign = re.compile(r"(?<!no )(?<!without )identity.?stamps?\s*=", re.I)
    for i in range(1, 53):
        for lab in ("newbie_a_live.json", "newbie_b_live.json"):
            lp = root / f"section_{i:02d}" / lab
            if not lp.exists():
                continue
            blob = lp.read_text(encoding="utf-8", errors="ignore")
            if stamp_re.search(blob) or identity_assign.search(blob):
                stamp_hits += 1
    if stamp_hits:
        issues.append({
            "tag": "MECHANICAL_IDENTITY_STAMP",
            "severity": "P0",
            "detail": f"files_with_identity_stamps={stamp_hits}",
        })

    # Independence vs prior_clean if declared
    prior = meta.get("prior_clean") or meta.get("independence_baseline")
    if prior and (root.parent / prior).exists():
        same = 0
        total = 0
        for i in range(1, 53):
            for lab in ("newbie_a_live.json", "newbie_b_live.json"):
                a_path = root.parent / prior / f"section_{i:02d}" / lab
                b_path = root / f"section_{i:02d}" / lab
                if not a_path.exists() or not b_path.exists():
                    continue
                try:
                    a = json.loads(a_path.read_text(encoding="utf-8"))
                    b = json.loads(b_path.read_text(encoding="utf-8"))
                except Exception:
                    continue
                def em(d):
                    return {(e.get("exercise_id") or e.get("id")): e for e in (d.get("exercises") or [])}
                ma, mb = em(a), em(b)
                for eid in set(ma) & set(mb):
                    total += 1
                    ba = non_comment_body(ma[eid].get("code") or "").strip()
                    bb = non_comment_body(mb[eid].get("code") or "").strip()
                    if ba and ba == bb:
                        same += 1
        if total and same / total >= 0.98:
            issues.append({
                "tag": "INDEPENDENCE_CODE_IDENTITY",
                "severity": "P0",
                "detail": f"non-comment body identity {same}/{total} vs {prior} >=98%",
            })

    return issues



def validate_section(attempt_id: str, section_index: int) -> dict:
    attempt_root = attempt_dir(attempt_id)
    d = attempt_root / f"section_{section_index:02d}"
    d.mkdir(parents=True, exist_ok=True)
    # Prefer on-disk slim/full packet (fast); rebuild only if missing
    pkt = None
    for name in ("packet.json", "slim_packet.json"):
        p = d / name
        if p.exists():
            try:
                pkt = json.loads(p.read_text(encoding="utf-8"))
                break
            except Exception:
                pkt = None
    if pkt is None:
        pkt = build_packet(section_index, attempt_id=attempt_id)
    corpus = packet_corpus(pkt)
    expected_ids = [
        e.get("id")
        for e in ((pkt["active"].get("weDo") or {}).get("exercises") or [])
        if e.get("id")
    ]
    # offline keys only for Validator fairness (newbies never saw these)
    files = active_section_files()
    target = None
    for p in files:
        if parse_section_learner(p).get("index") == section_index:
            target = p
            break
    keys = extract_selfcheck_keys(target) if target else []

    live_by_label = {
        "newbie_a": load_live(d / "newbie_a_live.json"),
        "newbie_b": load_live(d / "newbie_b_live.json"),
    }
    meta = None
    meta_path = attempt_root / "meta.json"
    if meta_path.exists():
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            meta = None
    prov_issues = provenance_issues(
        meta,
        live_by_label,
        has_rebuild_report=(attempt_root / "rebuild_report.json").exists(),
    )

    result = {
        "section_index": section_index,
        "section_id": pkt["active"].get("id"),
        "agents": {},
        "blocking_gaps": [
            {**issue, "severity": "P0"} for issue in prov_issues
        ],
        "provenance_pass": not prov_issues,
        "evaluation": "agentic_justification",
    }

    for label, fname in (
        ("newbie_a", "newbie_a_live.json"),
        ("newbie_b", "newbie_b_live.json"),
    ):
        path = d / fname
        raw = live_by_label[label]
        if not raw:
            result["agents"][label] = {"status": "missing", "pass": False}
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "MISSING_LIVE",
                    "severity": "P0",
                    "detail": fname,
                }
            )
            continue

        applicable_prov = [
            issue
            for issue in prov_issues
            if issue.get("agent") in (None, label)
        ]
        if applicable_prov:
            result["agents"][label] = {
                "status": "tainted_provenance",
                "pass": False,
                "provenance_issues": applicable_prov,
            }
            continue

        # authenticity
        if raw.get("attempt_id") and raw.get("attempt_id") != attempt_id:
            result["agents"][label] = {"status": "wrong_attempt", "pass": False}
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "WRONG_ATTEMPT",
                    "severity": "P0",
                    "detail": str(raw.get("attempt_id")),
                }
            )
            continue
        blob = json.dumps(raw, ensure_ascii=False)
        if "correct_preview" in blob or raw.get("generator") or "_gen_" in blob:
            result["agents"][label] = {"status": "generator", "pass": False}
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "GENERATOR",
                    "severity": "P0",
                    "detail": "generator fingerprint",
                }
            )
            continue

        sc = normalize_selfcheck(raw)
        ex = normalize_exercises(raw)
        sc_grade = grade_selfcheck_answers(
            keys,
            [
                {
                    "question_index": a["question_index"],
                    "chosen_index": a["chosen_index"],
                }
                for a in sc
            ],
        )

        # justification quality
        sc_just_ok = 0
        sc_answered = 0
        sc_blocked = 0
        for a in sc:
            if a.get("blocked_on"):
                sc_blocked += 1
                continue
            if a.get("chosen_index") is None:
                continue
            sc_answered += 1
            if justification_supported(a.get("justification") or "", corpus):
                sc_just_ok += 1

        ex_done = 0
        ex_just_ok = 0
        incomplete_ex = []
        template_just = []
        hard_blocks = []
        answered_ids = set()
        for e in ex:
            eid = e.get("exercise_id")
            if e.get("blocked_on"):
                tags = [str(b) for b in e["blocked_on"]]
                if any(t.startswith("UNTAUGHT") or t == "STARTER_BROKEN" for t in tags):
                    hard_blocks.append(e)
                continue
            code = e.get("code") or ""
            answer = e.get("answer") or ""
            just = e.get("justification") or ""
            if not (code or answer):
                continue
            # incomplete / placeholder solutions fail the gate
            reason = code_incomplete(code) if code else None
            if reason:
                incomplete_ex.append({"exercise_id": eid, "reason": reason})
                continue
            instr = ""
            for we in ((pkt.get("active") or {}).get("weDo") or {}).get("exercises") or []:
                if we.get("id") == eid:
                    instr = we.get("instruction") or ""
                    break
            form_fails = exercise_form_issues(eid or "", instr, code)
            if form_fails:
                incomplete_ex.append({"exercise_id": eid, "reason": form_fails[0]})
                continue
            if justification_is_template(just):
                template_just.append(eid)
                continue
            if not justification_supported(just, corpus, min_hits=1):
                # require real packet-grounded justification — no free pass on concepts_used alone
                incomplete_ex.append(
                    {"exercise_id": eid, "reason": "weak_or_unsupported_justification"}
                )
                continue
            ex_done += 1
            ex_just_ok += 1
            if eid:
                answered_ids.add(eid)

        missing = [i for i in expected_ids if i not in answered_ids]
        n_sc = len(keys) or max(1, len(sc))
        just_ratio = (sc_just_ok / sc_answered) if sc_answered else 0.0
        ex_ratio = (ex_just_ok / max(1, len(expected_ids))) if expected_ids else 1.0
        agent_pass = (
            sc_answered >= n_sc
            and sc_blocked == 0
            and sc_grade["score_pct"] >= 70
            and just_ratio >= 0.5
            and len(hard_blocks) == 0
            and len(incomplete_ex) == 0
            and len(template_just) == 0
            and len(missing) == 0
            and ex_ratio >= 0.95
        )

        result["agents"][label] = {
            "status": "validated",
            "pass": agent_pass,
            "selfcheck_score_pct": sc_grade["score_pct"],
            "selfcheck_just_ratio": round(just_ratio, 3),
            "exercises_done": ex_done,
            "exercises_just_ok": ex_just_ok,
            "exercises_expected": len(expected_ids),
            "hard_blocks": len(hard_blocks),
            "incomplete_exercises": incomplete_ex[:20],
            "template_justifications": template_just[:20],
            "missing_exercises": missing[:15],
            "method": raw.get("method"),
            "attempt_id": raw.get("attempt_id"),
        }
        if not agent_pass:
            if sc_grade["score_pct"] < 70:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "SELFCHECK_AGENTIC_FAIL",
                        "severity": "P1",
                        "detail": f"score={sc_grade['score_pct']}",
                    }
                )
            if just_ratio < 0.5:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "WEAK_JUSTIFICATION",
                        "severity": "P1",
                        "detail": f"just_ratio={just_ratio}",
                    }
                )
            for hb in hard_blocks[:5]:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "UNTAUGHT",
                        "severity": "P1",
                        "exercise_id": hb.get("exercise_id"),
                        "detail": str(hb.get("blocked_on")),
                    }
                )
            for inc in incomplete_ex[:8]:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "INCOMPLETE_EXERCISE",
                        "severity": "P0",
                        "exercise_id": inc.get("exercise_id"),
                        "detail": inc.get("reason"),
                    }
                )
            if template_just:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "TEMPLATE_JUSTIFICATION",
                        "severity": "P0",
                        "detail": f"n={len(template_just)} e.g. {template_just[:5]}",
                    }
                )
            if missing:
                result["blocking_gaps"].append(
                    {
                        "agent": label,
                        "tag": "MISSING_EXERCISES",
                        "severity": "P0",
                        "detail": str(missing[:10]),
                    }
                )

    result["section_pass"] = all(
        (result["agents"].get(a) or {}).get("pass") for a in ("newbie_a", "newbie_b")
    )
    (d / "agentic_validation.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return result


def validate_all(attempt_id: str) -> dict:
    rows = [validate_section(attempt_id, i) for i in range(1, 53)]
    summary = {
        "attempt_id": attempt_id,
        "validated_at": now_iso(),
        "evaluation": "agentic_justification_primary",
        "a_pass": sum(
            1
            for r in rows
            if (r.get("agents") or {}).get("newbie_a", {}).get("pass")
        ),
        "b_pass": sum(
            1
            for r in rows
            if (r.get("agents") or {}).get("newbie_b", {}).get("pass")
        ),
        "both_pass": sum(1 for r in rows if r.get("section_pass")),
        "provenance_pass": all(r.get("provenance_pass") for r in rows),
        "sections": [
            {
                "section_index": r["section_index"],
                "section_id": r.get("section_id"),
                "section_pass": r.get("section_pass"),
                "a_pass": (r.get("agents") or {}).get("newbie_a", {}).get("pass"),
                "b_pass": (r.get("agents") or {}).get("newbie_b", {}).get("pass"),
                "a_sc": (r.get("agents") or {})
                .get("newbie_a", {})
                .get("selfcheck_score_pct"),
                "b_sc": (r.get("agents") or {})
                .get("newbie_b", {})
                .get("selfcheck_score_pct"),
                "gaps": len(r.get("blocking_gaps") or []),
            }
            for r in rows
        ],
    }
    attempt_gates = attempt_level_gates(attempt_id)
    summary["attempt_level_gates"] = attempt_gates
    summary["attempt_gates_pass"] = len(attempt_gates) == 0
    summary["clean_52"] = (
        summary["both_pass"] == 52
        and summary["provenance_pass"]
        and summary["attempt_gates_pass"]
    )
    summary["open_gaps"] = [
        g
        for r in rows
        for g in (r.get("blocking_gaps") or [])
    ][:100] + attempt_gates
    out = attempt_dir(attempt_id) / "agentic_ledger.json"
    out.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    return summary


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--attempt", default="agentic_A1")
    ap.add_argument("--validate-all", action="store_true")
    ap.add_argument("--section", type=int, default=None)
    args = ap.parse_args()
    if args.section:
        print(json.dumps(validate_section(args.attempt, args.section), indent=2)[:4000])
        return 0
    if args.validate_all:
        s = validate_all(args.attempt)
        print(
            json.dumps(
                {
                    "clean_52": s["clean_52"],
                    "a_pass": s["a_pass"],
                    "b_pass": s["b_pass"],
                    "both": s["both_pass"],
                    "open_gaps_n": len(s.get("open_gaps") or []),
                    "attempt_gates_pass": s.get("attempt_gates_pass"),
                    "attempt_gates_n": len(s.get("attempt_level_gates") or []),
                },
                indent=2,
            )
        )
        return 0 if s["clean_52"] else 1
    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
