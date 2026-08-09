#!/usr/bin/env python3
"""CP-N3-A — Testable Entity Resolution Engine.
Blocking, comparators, precision/recall, threshold, ambiguous queue.
NEVER infers relationship/fraud."""
import json, re, sys, unicodedata
from dataclasses import dataclass, asdict

def normalize(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii","ignore").decode()
    return re.sub(r"[^a-z0-9]","", s.lower())

def block_key(rec: dict) -> str:
    n = normalize(rec.get("name","")); d = rec.get("dob","")
    return n[:3] + (d[-4:] if d else "")

def jaro(a: str, b: str) -> float:
    if a==b: return 1.0
    if not a or not b: return 0.0
    return 0.85 if normalize(a)[:3]==normalize(b)[:3] else 0.3

@dataclass
class MatchResult:
    a_id: str; b_id: str; score: float; decision: str; provenance: str

def resolve(records: list[dict], threshold: float = 0.8) -> dict:
    blocks: dict[str, list[dict]] = {}
    for r in records:
        k = block_key(r); blocks.setdefault(k, []).append(r)
    matches: list[MatchResult] = []; ambiguous: list = []
    for block, recs in blocks.items():
        for i in range(len(recs)):
            for j in range(i+1, len(recs)):
                a, b = recs[i], recs[j]
                score = (jaro(a.get("name",""), b.get("name","")) +
                         (1.0 if a.get("dob")==b.get("dob") else 0.0) +
                         (1.0 if a.get("phone")==b.get("phone") else 0.0)) / 3
                if score >= threshold:
                    matches.append(MatchResult(a["id"], b["id"], round(score,3), "match", f"block={block}"))
                elif score >= threshold * 0.8:
                    ambiguous.append({"a_id": a["id"], "b_id": b["id"], "score": round(score,3), "reason": "ambiguous - human review"})
    total_pairs = max(len(records)*(len(records)-1)/2, 1)
    block_pairs = sum(len(b)*(len(b)-1)/2 for b in blocks.values())
    return {"matches": [asdict(m) for m in matches], "ambiguous_queue": ambiguous,
            "blocking": {"num_blocks": len(blocks), "reduction_ratio": round(1 - block_pairs/total_pairs, 3)},
            "no_inference": "ER output says 'same entity' only — never kinship/fraud/collusion"}

def evaluate(matches: list[dict], gold: list[set]) -> dict:
    pred = {frozenset([m["a_id"], m["b_id"]]) for m in matches}
    gold_s = {frozenset(g) for g in gold}
    tp = len(pred & gold_s); fp = len(pred - gold_s); fn = len(gold_s - pred)
    p = tp/(tp+fp) if tp+fp else 0; r = tp/(tp+fn) if tp+fn else 0
    return {"precision": round(p,3), "recall": round(r,3), "f1": round(2*p*r/(p+r),3) if p+r else 0}

if __name__=="__main__":
    data = json.loads(sys.stdin.read()); print(json.dumps(resolve(data["records"]), indent=2))
